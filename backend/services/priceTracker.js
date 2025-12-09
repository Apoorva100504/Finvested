// services/priceTracker.js
import { WebSocketServer } from 'ws';

// Simple fallback market data service
class SimpleMarketData {
  async getBulkPrices(symbols) {
    console.log(`Getting mock prices for: ${symbols.join(', ')}`);
    return symbols.map(symbol => ({
      symbol,
      price: 100 + Math.random() * 1000,
      change: (Math.random() - 0.5) * 10,
      changePercent: (Math.random() - 0.5) * 2,
      volume: Math.floor(Math.random() * 1000000),
      timestamp: new Date().toISOString(),
      source: 'Mock'
    }));
  }
}

class PriceTracker {
  constructor() {
    this.wss = null;
    this.clients = new Set();
    this.priceUpdateInterval = null;
    this.marketData = new SimpleMarketData();
    this.db = null;
  }

  setDatabase(database) {
    this.db = database;
  }

  initialize(server) {
    console.log('Initializing PriceTracker...');
    
    if (!this.db) {
      console.error('Database not set in PriceTracker');
      return;
    }

    this.wss = new WebSocketServer({ server, path: '/ws/prices' });

    this.wss.on('connection', (ws, request) => {
      console.log('New WebSocket connection');
      this.clients.add(ws);

      ws.on('message', (message) => {
        try {
          const data = JSON.parse(message);
          this.handleMessage(ws, data);
        } catch (error) {
          console.error('WebSocket message error:', error);
        }
      });

      ws.on('close', () => {
        console.log('WebSocket connection closed');
        this.clients.delete(ws);
      });

      ws.on('error', (error) => {
        console.error('WebSocket error:', error);
        this.clients.delete(ws);
      });

      // Send initial data
      this.sendInitialData(ws);
    });

    this.startPriceUpdates();
    console.log('PriceTracker initialized');
  }

  handleMessage(ws, data) {
    switch (data.type) {
      case 'subscribe':
        if (data.symbols && Array.isArray(data.symbols)) {
          ws.subscribedSymbols = data.symbols;
          console.log(`Client subscribed to: ${data.symbols.join(', ')}`);
        }
        break;
      case 'ping':
        ws.send(JSON.stringify({ type: 'pong', timestamp: Date.now() }));
        break;
    }
  }

  // POSTGRESQL VERSION
  async sendInitialData(ws) {
    try {
      const stocks = await this.db.query(`
        SELECT symbol, current_price 
        FROM stocks 
        WHERE is_active = TRUE
        LIMIT 20
      `);

      ws.send(JSON.stringify({
        type: 'initial_data',
        stocks: stocks.rows.map(s => ({
          symbol: s.symbol,
          price: s.current_price
        }))
      }));
    } catch (error) {
      console.error('Error sending initial data:', error);
    }
  }

  startPriceUpdates() {
    // Update prices every 10 seconds
    this.priceUpdateInterval = setInterval(() => {
      this.updatePrices();
    }, 10000);
  }

  // POSTGRESQL VERSION
  async updatePrices() {
    if (!this.db) {
      console.error('Database not available for price updates');
      return;
    }

    try {
      const stocks = await this.db.query(
        'SELECT id, symbol, current_price FROM stocks WHERE is_active = TRUE LIMIT 10'
      );
      
      if (stocks.rows.length === 0) {
        console.log('No stocks found');
        return;
      }

      const symbols = stocks.rows.map(s => s.symbol);
      const priceData = await this.marketData.getBulkPrices(symbols);

      const updates = [];
      for (const data of priceData) {
        if (!data) continue;
        
        const stock = stocks.rows.find(s => s.symbol === data.symbol);
        if (!stock) continue;

        try {
          // Update database - POSTGRESQL
          await this.db.run(
            'UPDATE stocks SET current_price = $1 WHERE id = $2',
            [data.price, stock.id]
          );
          
          updates.push({
            symbol: data.symbol,
            price: data.price,
            change: data.change,
            changePercent: data.changePercent,
            timestamp: data.timestamp
          });
        } catch (error) {
          console.error(`Error updating ${data.symbol}:`, error);
        }
      }

      // Broadcast to clients
      if (updates.length > 0) {
        this.broadcast({
          type: 'price_update',
          updates,
          timestamp: new Date().toISOString()
        });
      }

    } catch (error) {
      console.error('Error in updatePrices:', error);
    }
  }

  broadcast(message) {
    const messageStr = JSON.stringify(message);
    this.clients.forEach(client => {
      if (client.readyState === 1) { // WebSocket.OPEN
        try {
          client.send(messageStr);
        } catch (error) {
          console.error('Error sending to client:', error);
        }
      }
    });
  }

  stop() {
    if (this.priceUpdateInterval) {
      clearInterval(this.priceUpdateInterval);
    }
    this.clients.clear();
  }
}

const priceTracker = new PriceTracker();
export { priceTracker };