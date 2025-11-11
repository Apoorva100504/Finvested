// routes/stocks.js
import { db } from '../config/database.js';

export default async function stocksRoutes(fastify, options) {
  
  // Get all stocks with pagination
  fastify.get('/stocks', {
    schema: {
      querystring: {
        type: 'object',
        properties: {
          page: { type: 'integer', minimum: 1, default: 1 },
          limit: { type: 'integer', minimum: 1, maximum: 100, default: 20 },
          search: { type: 'string' },
          sector: { type: 'string' },
          sort: { type: 'string', enum: ['symbol', 'company_name', 'current_price', 'volume'], default: 'symbol' },
          order: { type: 'string', enum: ['asc', 'desc'], default: 'asc' }
        }
      }
    }
  }, async (request, reply) => {
    const { page = 1, limit = 20, search, sector, sort = 'symbol', order = 'asc' } = request.query;
    const offset = (page - 1) * limit;

    try {
      let whereConditions = ['is_active = TRUE'];
      let params = [];

      if (search) {
        whereConditions.push('(symbol LIKE ? OR company_name LIKE ?)');
        params.push(`%${search}%`, `%${search}%`);
      }

      if (sector) {
        whereConditions.push('sector = ?');
        params.push(sector);
      }

      const whereClause = whereConditions.length > 0 ? `WHERE ${whereConditions.join(' AND ')}` : '';

      // Get stocks
      const stocks = db.prepare(`
        SELECT id, symbol, company_name, sector, exchange, current_price, 
               day_high, day_low, volume, created_at
        FROM stocks 
        ${whereClause}
        ORDER BY ${sort} ${order.toUpperCase()}
        LIMIT ? OFFSET ?
      `).all(...params, limit, offset);

      // Get total count for pagination
      const countResult = db.prepare(`
        SELECT COUNT(*) as total 
        FROM stocks 
        ${whereClause}
      `).get(...params);

      // Get distinct sectors for filters
      const sectors = db.prepare(`
        SELECT DISTINCT sector 
        FROM stocks 
        WHERE sector IS NOT NULL AND sector != '' AND is_active = TRUE
        ORDER BY sector
      `).all().map(row => row.sector);

      reply.send({
        stocks: stocks.map(stock => ({
          id: stock.id,
          symbol: stock.symbol,
          companyName: stock.company_name,
          sector: stock.sector,
          exchange: stock.exchange,
          currentPrice: stock.current_price,
          dayHigh: stock.day_high,
          dayLow: stock.day_low,
          volume: stock.volume,
          createdAt: stock.created_at
        })),
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total: countResult.total,
          totalPages: Math.ceil(countResult.total / limit)
        },
        filters: {
          sectors
        }
      });

    } catch (error) {
      fastify.log.error(error);
      reply.status(500).send({ error: 'Internal server error' });
    }
  });

  // Get single stock details
  fastify.get('/stocks/:symbol', {
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
      const stock = db.prepare(`
        SELECT id, symbol, company_name, sector, exchange, current_price, 
               day_high, day_low, volume, is_active, created_at
        FROM stocks 
        WHERE symbol = ? AND is_active = TRUE
      `).get(symbol.toUpperCase());

      if (!stock) {
        return reply.status(404).send({ error: 'Stock not found' });
      }

      reply.send({
        stock: {
          id: stock.id,
          symbol: stock.symbol,
          companyName: stock.company_name,
          sector: stock.sector,
          exchange: stock.exchange,
          currentPrice: stock.current_price,
          dayHigh: stock.day_high,
          dayLow: stock.day_low,
          volume: stock.volume,
          isActive: stock.is_active,
          createdAt: stock.created_at
        }
      });

    } catch (error) {
      fastify.log.error(error);
      reply.status(500).send({ error: 'Internal server error' });
    }
  });

  // Get stock price history (mock data for now)
  fastify.get('/stocks/:symbol/history', {
    schema: {
      params: {
        type: 'object',
        properties: {
          symbol: { type: 'string' }
        }
      },
      querystring: {
        type: 'object',
        properties: {
          period: { type: 'string', enum: ['1d', '1w', '1m', '3m', '1y'], default: '1d' }
        }
      }
    }
  }, async (request, reply) => {
    const { symbol } = request.params;
    const { period = '1d' } = request.query;

    try {
      const stock = db.prepare('SELECT id, current_price FROM stocks WHERE symbol = ?').get(symbol.toUpperCase());

      if (!stock) {
        return reply.status(404).send({ error: 'Stock not found' });
      }

      // Generate mock historical data based on period
      const historicalData = generateMockHistoricalData(stock.current_price, period);

      reply.send({
        symbol: symbol.toUpperCase(),
        period,
        history: historicalData
      });

    } catch (error) {
      fastify.log.error(error);
      reply.status(500).send({ error: 'Internal server error' });
    }
  });

  // Helper function to generate mock historical data
  function generateMockHistoricalData(currentPrice, period) {
    const data = [];
    let points = 100;
    let timeInterval = 1; // minutes

    switch (period) {
      case '1d':
        points = 96; // 24 hours * 4 (15-min intervals)
        timeInterval = 15;
        break;
      case '1w':
        points = 168; // 7 days * 24 hours
        timeInterval = 60;
        break;
      case '1m':
        points = 30; // 30 days
        timeInterval = 1440; // daily
        break;
      case '3m':
        points = 90; // 90 days
        timeInterval = 1440; // daily
        break;
      case '1y':
        points = 365; // 365 days
        timeInterval = 1440; // daily
        break;
    }

    let price = currentPrice;
    const baseTime = new Date();

    for (let i = points - 1; i >= 0; i--) {
      // Random price fluctuation (±2%)
      const changePercent = (Math.random() - 0.5) * 4;
      price = price * (1 + changePercent / 100);
      
      // Ensure price doesn't go negative
      price = Math.max(price, currentPrice * 0.5);

      const timestamp = new Date(baseTime.getTime() - i * timeInterval * 60 * 1000);

      data.push({
        timestamp: timestamp.toISOString(),
        price: parseFloat(price.toFixed(2)),
        volume: Math.floor(Math.random() * 1000000) + 100000
      });
    }

    return data;
  }
}