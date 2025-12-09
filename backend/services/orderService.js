// services/orderService.js
import { db } from '../config/database.js';
import { randomUUID } from 'crypto';

class OrderService {
  constructor() {
    this.matchingEngine = new MatchingEngine();
  }

  // Validate order before placement
  async validateOrder(userId, orderData) {
    const { stockId, orderType, orderCategory, quantity, price } = orderData;

    try {
      console.log('Validating order for user:', userId, 'stock:', stockId);

      // Check if stock exists and is active
      const stock = db.prepare('SELECT * FROM stocks WHERE id = ? AND is_active = TRUE').get(stockId);
      if (!stock) {
        console.log('Stock not found:', stockId);
        return { valid: false, error: 'Stock not found or inactive' };
      }

      console.log('Stock found:', stock.symbol, 'Price:', stock.current_price);

      // Check if user has sufficient funds for buy order
      if (orderType === 'buy') {
        const wallet = db.prepare('SELECT balance, locked_balance FROM wallets WHERE user_id = ?').get(userId);
        if (!wallet) {
          return { valid: false, error: 'Wallet not found' };
        }

        const availableBalance = wallet.balance - wallet.locked_balance;
        const requiredAmount = orderCategory === 'market' ? 
          quantity * stock.current_price : 
          quantity * price;

        console.log('Available balance:', availableBalance, 'Required:', requiredAmount);

        if (availableBalance < requiredAmount) {
          return { valid: false, error: `Insufficient funds. Available: ${availableBalance}, Required: ${requiredAmount}` };
        }
      }

      // Check if user has sufficient stocks for sell order
      if (orderType === 'sell') {
        const portfolio = db.prepare('SELECT quantity FROM portfolio WHERE user_id = ? AND stock_id = ?').get(userId, stockId);
        const availableQuantity = portfolio ? portfolio.quantity : 0;
        
        console.log('Available quantity for sell:', availableQuantity, 'Requested:', quantity);
        
        if (availableQuantity < quantity) {
          return { valid: false, error: `Insufficient stocks. Available: ${availableQuantity}, Requested: ${quantity}` };
        }
      }

      // Validate limit order price
      if (orderCategory === 'limit' && (!price || price <= 0)) {
        return { valid: false, error: 'Invalid price for limit order' };
      }

      console.log('Order validation successful');
      return { valid: true };

    } catch (error) {
      console.error('Validation error:', error);
      return { valid: false, error: 'Validation failed: ' + error.message };
    }
  }

  // Place a new order
  async placeOrder(userId, orderData) {
    const { stockId, orderType, orderCategory, quantity, price } = orderData;
    
    try {
      return db.transaction(() => {
        // Get current stock price for market orders
        const stock = db.prepare('SELECT current_price, symbol FROM stocks WHERE id = ?').get(stockId);
        const orderPrice = orderCategory === 'market' ? stock.current_price : price;

        console.log('Placing order - Stock:', stock.symbol, 'Price:', orderPrice, 'Type:', orderType);

        // Lock funds for buy orders
        if (orderType === 'buy') {
          const requiredAmount = quantity * orderPrice;
          console.log('Locking funds:', requiredAmount, 'for user:', userId);
          
          const result = db.prepare(`
            UPDATE wallets 
            SET locked_balance = locked_balance + ? 
            WHERE user_id = ?
          `).run(requiredAmount, userId);

          if (result.changes === 0) {
            throw new Error('Failed to lock funds');
          }
        }

        // Lock stocks for sell orders
        if (orderType === 'sell') {
          console.log('Locking stocks:', quantity, 'for user:', userId);
          
          const result = db.prepare(`
            UPDATE portfolio 
            SET quantity = quantity - ?,
                current_value = (quantity - ?) * (
                  SELECT current_price FROM stocks WHERE id = ?
                )
            WHERE user_id = ? AND stock_id = ?
          `).run(quantity, quantity, stockId, userId, stockId);

          if (result.changes === 0) {
            throw new Error('Failed to lock stocks');
          }
        }

        // Create order
        const orderId = randomUUID();
        console.log('Creating order with ID:', orderId);
        
        db.prepare(`
          INSERT INTO orders (id, user_id, stock_id, order_type, order_category, quantity, price, status)
          VALUES (?, ?, ?, ?, ?, ?, ?, 'pending')
        `).run(orderId, userId, stockId, orderType, orderCategory, quantity, orderPrice);

        const order = db.prepare('SELECT * FROM orders WHERE id = ?').get(orderId);
        console.log('Order created successfully:', order.id);

        // Try to match order immediately
        try {
          this.matchingEngine.matchOrder(order);
        } catch (matchError) {
          console.log('Order matching failed:', matchError);
          // Continue even if matching fails
        }

        return order;
      })();
    } catch (error) {
      console.error('Order placement error:', error);
      throw error;
    }
  }

  // ... rest of the methods remain the same
  async cancelOrder(orderId, userId) {
    return db.transaction(() => {
      const order = db.prepare('SELECT * FROM orders WHERE id = ? AND user_id = ?').get(orderId, userId);

      if (!order) {
        return { success: false, error: 'Order not found' };
      }

      if (order.status !== 'pending') {
        return { success: false, error: 'Cannot cancel non-pending order' };
      }

      // Unlock funds/stocks
      if (order.order_type === 'buy') {
        const lockedAmount = order.quantity * order.price;
        db.prepare(`
          UPDATE wallets 
          SET locked_balance = locked_balance - ? 
          WHERE user_id = ?
        `).run(lockedAmount, order.user_id);
      }

      if (order.order_type === 'sell') {
        db.prepare(`
          UPDATE portfolio 
          SET quantity = quantity + ?,
              current_value = (quantity + ?) * (
                SELECT current_price FROM stocks WHERE id = ?
              )
          WHERE user_id = ? AND stock_id = ?
        `).run(order.quantity, order.quantity, order.stock_id, order.user_id, order.stock_id);
      }

      // Update order status
      db.prepare('UPDATE orders SET status = ? WHERE id = ?').run('cancelled', orderId);

      return { success: true };
    })();
  }

  // Get order book for a stock
  getOrderBook(stockId) {
    const buyOrders = db.prepare(`
      SELECT * FROM orders 
      WHERE stock_id = ? AND order_type = 'buy' AND status = 'pending'
      ORDER BY price DESC, created_at ASC
    `).all(stockId);

    const sellOrders = db.prepare(`
      SELECT * FROM orders 
      WHERE stock_id = ? AND order_type = 'sell' AND status = 'pending'
      ORDER BY price ASC, created_at ASC
    `).all(stockId);

    return {
      buyOrders: buyOrders.map(this.formatOrder),
      sellOrders: sellOrders.map(this.formatOrder)
    };
  }

  formatOrder(order) {
    return {
      id: order.id,
      orderType: order.order_type,
      quantity: order.quantity,
      price: order.price,
      createdAt: order.created_at
    };
  }
}

class MatchingEngine {
  // Match orders for a stock
  matchOrder(newOrder) {
    try {
      console.log('Matching order:', newOrder.id, 'Type:', newOrder.order_type);
      
      const { stock_id, order_type, quantity, price } = newOrder;

      const oppositeType = order_type === 'buy' ? 'sell' : 'buy';
      const priceCondition = order_type === 'buy' ? '<= ?' : '>= ?';

      // Find matching orders
      const matchingOrders = db.prepare(`
        SELECT * FROM orders 
        WHERE stock_id = ? 
          AND order_type = ? 
          AND status = 'pending'
          AND price ${priceCondition}
        ORDER BY ${order_type === 'buy' ? 'price ASC' : 'price DESC'}, created_at ASC
      `).all(stock_id, oppositeType, price);

      console.log('Found matching orders:', matchingOrders.length);

      let remainingQuantity = quantity;

      for (const matchOrder of matchingOrders) {
        if (remainingQuantity <= 0) break;

        const tradeQuantity = Math.min(remainingQuantity, matchOrder.quantity);
        const tradePrice = this.determineTradePrice(newOrder, matchOrder);

        console.log('Executing trade - Qty:', tradeQuantity, 'Price:', tradePrice);

        // Execute trade
        this.executeTrade(newOrder, matchOrder, tradeQuantity, tradePrice);

        remainingQuantity -= tradeQuantity;

        // Update order quantities
        this.updateOrderQuantities(newOrder, matchOrder, tradeQuantity);
      }

      // Update new order status
      this.updateOrderStatus(newOrder, remainingQuantity);
      
    } catch (error) {
      console.error('Order matching error:', error);
      throw error;
    }
  }

  determineTradePrice(order1, order2) {
    // For market vs limit orders, use limit order price
    // For limit vs limit orders, use the price that benefits the market
    if (order1.order_category === 'market') {
      return order2.price;
    } else if (order2.order_category === 'market') {
      return order1.price;
    } else {
      // Both are limit orders - use average or appropriate price
      return order1.order_type === 'buy' ? 
        Math.min(order1.price, order2.price) : 
        Math.max(order1.price, order2.price);
    }
  }

  executeTrade(buyOrder, sellOrder, quantity, price) {
    const tradeId = randomUUID();
    console.log('Creating trade:', tradeId);

    db.prepare(`
      INSERT INTO trades (id, buy_order_id, sell_order_id, stock_id, quantity, price)
      VALUES (?, ?, ?, ?, ?, ?)
    `).run(tradeId, buyOrder.id, sellOrder.id, buyOrder.stock_id, quantity, price);

    // Update buyer's portfolio
    const buyerPortfolio = db.prepare(`
      SELECT * FROM portfolio WHERE user_id = ? AND stock_id = ?
    `).get(buyOrder.user_id, buyOrder.stock_id);

    const currentStockPrice = db.prepare('SELECT current_price FROM stocks WHERE id = ?').get(buyOrder.stock_id).current_price;

    if (buyerPortfolio) {
      // Update existing portfolio
      const newQuantity = buyerPortfolio.quantity + quantity;
      const newInvested = buyerPortfolio.invested_amount + (quantity * price);
      const newAvgPrice = newInvested / newQuantity;

      db.prepare(`
        UPDATE portfolio 
        SET quantity = ?, 
            average_buy_price = ?,
            invested_amount = ?,
            current_value = ? * ?,
            unrealized_pnl = (? * ?) - ?,
            last_updated = CURRENT_TIMESTAMP
        WHERE user_id = ? AND stock_id = ?
      `).run(
        newQuantity, newAvgPrice, newInvested, 
        newQuantity, currentStockPrice,
        newQuantity, currentStockPrice, newInvested,
        buyOrder.user_id, buyOrder.stock_id
      );
    } else {
      // Create new portfolio entry
      const investedAmount = quantity * price;
      const currentValue = quantity * currentStockPrice;
      
      db.prepare(`
        INSERT INTO portfolio (id, user_id, stock_id, quantity, average_buy_price, invested_amount, current_value, unrealized_pnl)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      `).run(
        randomUUID(), 
        buyOrder.user_id, 
        buyOrder.stock_id, 
        quantity, 
        price, 
        investedAmount, 
        currentValue,
        currentValue - investedAmount
      );
    }

    // Update seller's portfolio
    const sellerPortfolio = db.prepare(`
      SELECT * FROM portfolio WHERE user_id = ? AND stock_id = ?
    `).get(sellOrder.user_id, sellOrder.stock_id);

    if (sellerPortfolio) {
      const newQuantity = sellerPortfolio.quantity - quantity;
      const newInvested = sellerPortfolio.invested_amount - (quantity * sellerPortfolio.average_buy_price);
      const newCurrentValue = newQuantity * currentStockPrice;
      
      db.prepare(`
        UPDATE portfolio 
        SET quantity = ?,
            invested_amount = ?,
            current_value = ?,
            unrealized_pnl = ? - ?,
            last_updated = CURRENT_TIMESTAMP
        WHERE user_id = ? AND stock_id = ?
      `).run(
        newQuantity, newInvested, newCurrentValue,
        newCurrentValue, newInvested,
        sellOrder.user_id, sellOrder.stock_id
      );
    }

    // Update wallets
    const totalAmount = quantity * price;

    // Deduct from buyer's locked balance and balance
    db.prepare(`
      UPDATE wallets 
      SET locked_balance = locked_balance - ?,
          balance = balance - ?
      WHERE user_id = ?
    `).run(totalAmount, totalAmount, buyOrder.user_id);

    // Add to seller's balance
    db.prepare(`
      UPDATE wallets 
      SET balance = balance + ?
      WHERE user_id = ?
    `).run(totalAmount, sellOrder.user_id);

    // Record transactions
    db.prepare(`
      INSERT INTO transactions (id, user_id, type, amount, status, description)
      VALUES (?, ?, 'trade', ?, 'completed', ?)
    `).run(randomUUID(), buyOrder.user_id, -totalAmount, `Buy ${quantity} shares of ${db.prepare('SELECT symbol FROM stocks WHERE id = ?').get(buyOrder.stock_id).symbol}`);

    db.prepare(`
      INSERT INTO transactions (id, user_id, type, amount, status, description)
      VALUES (?, ?, 'trade', ?, 'completed', ?)
    `).run(randomUUID(), sellOrder.user_id, totalAmount, `Sell ${quantity} shares of ${db.prepare('SELECT symbol FROM stocks WHERE id = ?').get(sellOrder.stock_id).symbol}`);

    console.log('Trade executed successfully');
  }

  updateOrderQuantities(order1, order2, tradedQuantity) {
    // Update order1
    const order1Remaining = order1.quantity - tradedQuantity;
    if (order1Remaining > 0) {
      db.prepare('UPDATE orders SET quantity = ? WHERE id = ?').run(order1Remaining, order1.id);
    } else {
      db.prepare('UPDATE orders SET status = ? WHERE id = ?').run('executed', order1.id);
    }

    // Update order2
    const order2Remaining = order2.quantity - tradedQuantity;
    if (order2Remaining > 0) {
      db.prepare('UPDATE orders SET quantity = ?, executed_quantity = executed_quantity + ? WHERE id = ?')
        .run(order2Remaining, tradedQuantity, order2.id);
    } else {
      db.prepare('UPDATE orders SET status = ?, executed_quantity = ? WHERE id = ?')
        .run('executed', order2.quantity, order2.id);
    }
  }

  updateOrderStatus(order, remainingQuantity) {
    if (remainingQuantity === 0) {
      db.prepare('UPDATE orders SET status = ? WHERE id = ?').run('executed', order.id);
    } else if (remainingQuantity < order.quantity) {
      db.prepare('UPDATE orders SET status = ?, quantity = ?, executed_quantity = ? WHERE id = ?')
        .run('partial', remainingQuantity, order.quantity - remainingQuantity, order.id);
    }
  }
}

export const orderService = new OrderService();