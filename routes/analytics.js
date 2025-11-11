// routes/analytics.js
import { db } from '../config/database.js';

export default async function analyticsRoutes(fastify, options) {
  
  fastify.addHook('onRequest', async (request, reply) => {
    try {
      await request.jwtVerify();
    } catch (err) {
      reply.send(err);
    }
  });

  // Get portfolio performance analytics
  fastify.get('/analytics/portfolio', async (request, reply) => {
    const userId = request.user.id;

    try {
      // Get portfolio summary
      const portfolioSummary = db.prepare(`
        SELECT 
          COUNT(*) as total_holdings,
          SUM(invested_amount) as total_invested,
          SUM(current_value) as total_current_value,
          SUM(unrealized_pnl) as total_pnl,
          (SUM(unrealized_pnl) / SUM(invested_amount)) * 100 as total_pnl_percentage
        FROM portfolio 
        WHERE user_id = ? AND quantity > 0
      `).get(userId);

      // Get sector-wise allocation
      const sectorAllocation = db.prepare(`
        SELECT 
          s.sector,
          COUNT(p.id) as holding_count,
          SUM(p.invested_amount) as invested_amount,
          SUM(p.current_value) as current_value,
          SUM(p.unrealized_pnl) as pnl,
          (SUM(p.current_value) / ?) * 100 as allocation_percentage
        FROM portfolio p
        JOIN stocks s ON p.stock_id = s.id
        WHERE p.user_id = ? AND p.quantity > 0
        GROUP BY s.sector
        ORDER BY current_value DESC
      `).all(portfolioSummary.total_current_value || 1, userId);

      // Get top performers
      const topPerformers = db.prepare(`
        SELECT 
          s.symbol,
          s.company_name,
          p.quantity,
          p.average_buy_price,
          p.invested_amount,
          p.current_value,
          p.unrealized_pnl,
          (p.unrealized_pnl / p.invested_amount) * 100 as pnl_percentage
        FROM portfolio p
        JOIN stocks s ON p.stock_id = s.id
        WHERE p.user_id = ? AND p.quantity > 0
        ORDER BY pnl_percentage DESC
        LIMIT 5
      `).all(userId);

      // Get worst performers
      const worstPerformers = db.prepare(`
        SELECT 
          s.symbol,
          s.company_name,
          p.quantity,
          p.average_buy_price,
          p.invested_amount,
          p.current_value,
          p.unrealized_pnl,
          (p.unrealized_pnl / p.invested_amount) * 100 as pnl_percentage
        FROM portfolio p
        JOIN stocks s ON p.stock_id = s.id
        WHERE p.user_id = ? AND p.quantity > 0
        ORDER BY pnl_percentage ASC
        LIMIT 5
      `).all(userId);

      // Get recent trades for performance chart
      const recentTrades = db.prepare(`
        SELECT 
          t.traded_at as date,
          SUM(CASE WHEN o.order_type = 'buy' THEN t.quantity * t.price ELSE 0 END) as buy_amount,
          SUM(CASE WHEN o.order_type = 'sell' THEN t.quantity * t.price ELSE 0 END) as sell_amount,
          COUNT(*) as trade_count
        FROM trades t
        JOIN orders o ON t.buy_order_id = o.id OR t.sell_order_id = o.id
        WHERE o.user_id = ?
        GROUP BY DATE(t.traded_at)
        ORDER BY t.traded_at DESC
        LIMIT 30
      `).all(userId);

      reply.send({
        summary: {
          totalHoldings: portfolioSummary.total_holdings,
          totalInvested: portfolioSummary.total_invested,
          totalCurrentValue: portfolioSummary.total_current_value,
          totalPnl: portfolioSummary.total_pnl,
          totalPnlPercentage: portfolioSummary.total_pnl_percentage
        },
        sectorAllocation: sectorAllocation.map(sector => ({
          sector: sector.sector,
          holdingCount: sector.holding_count,
          investedAmount: sector.invested_amount,
          currentValue: sector.current_value,
          pnl: sector.pnl,
          allocationPercentage: sector.allocation_percentage
        })),
        performance: {
          topPerformers: topPerformers.map(stock => ({
            symbol: stock.symbol,
            companyName: stock.company_name,
            quantity: stock.quantity,
            averageBuyPrice: stock.average_buy_price,
            investedAmount: stock.invested_amount,
            currentValue: stock.current_value,
            pnl: stock.unrealized_pnl,
            pnlPercentage: stock.pnl_percentage
          })),
          worstPerformers: worstPerformers.map(stock => ({
            symbol: stock.symbol,
            companyName: stock.company_name,
            quantity: stock.quantity,
            averageBuyPrice: stock.average_buy_price,
            investedAmount: stock.invested_amount,
            currentValue: stock.current_value,
            pnl: stock.unrealized_pnl,
            pnlPercentage: stock.pnl_percentage
          }))
        },
        tradingActivity: recentTrades.map(day => ({
          date: day.date,
          buyAmount: day.buy_amount,
          sellAmount: day.sell_amount,
          tradeCount: day.trade_count
        }))
      });

    } catch (error) {
      fastify.log.error(error);
      reply.status(500).send({ error: 'Internal server error' });
    }
  });

  // Get order book for a stock
  fastify.get('/analytics/orderbook/:symbol', {
    schema: {
      params: {
        type: 'object',
        properties: {
          symbol: { type: 'string' }
        }
      }
    }
  }, async (request, reply) => {
    const { symbol } = request.params;

    try {
      const stock = db.prepare('SELECT id FROM stocks WHERE symbol = ?').get(symbol.toUpperCase());
      
      if (!stock) {
        return reply.status(404).send({ error: 'Stock not found' });
      }

      // Get buy orders (sorted by price descending)
      const buyOrders = db.prepare(`
        SELECT price, SUM(quantity) as total_quantity, COUNT(*) as order_count
        FROM orders 
        WHERE stock_id = ? AND order_type = 'buy' AND status = 'pending'
        GROUP BY price
        ORDER BY price DESC
        LIMIT 10
      `).all(stock.id);

      // Get sell orders (sorted by price ascending)
      const sellOrders = db.prepare(`
        SELECT price, SUM(quantity) as total_quantity, COUNT(*) as order_count
        FROM orders 
        WHERE stock_id = ? AND order_type = 'sell' AND status = 'pending'
        GROUP BY price
        ORDER BY price ASC
        LIMIT 10
      `).all(stock.id);

      // Get recent trades
      const recentTrades = db.prepare(`
        SELECT t.price, t.quantity, t.traded_at
        FROM trades t
        WHERE t.stock_id = ?
        ORDER BY t.traded_at DESC
        LIMIT 20
      `).all(stock.id);

      reply.send({
        symbol: symbol.toUpperCase(),
        orderBook: {
          buyOrders: buyOrders.map(order => ({
            price: order.price,
            totalQuantity: order.total_quantity,
            orderCount: order.order_count
          })),
          sellOrders: sellOrders.map(order => ({
            price: order.price,
            totalQuantity: order.total_quantity,
            orderCount: order.order_count
          }))
        },
        recentTrades: recentTrades.map(trade => ({
          price: trade.price,
          quantity: trade.quantity,
          tradedAt: trade.traded_at
        }))
      });

    } catch (error) {
      fastify.log.error(error);
      reply.status(500).send({ error: 'Internal server error' });
    }
  });
}