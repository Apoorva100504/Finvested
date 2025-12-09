// routes/stocks.js
import { db } from '../config/database.js';

export default async function stocksRoutes(fastify, options) {
  
  // Get all stocks with pagination - POSTGRESQL
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
      let paramCount = 0;

      if (search) {
        paramCount++;
        whereConditions.push(`(symbol ILIKE $${paramCount} OR company_name ILIKE $${paramCount + 1})`);
        params.push(`%${search}%`, `%${search}%`);
        paramCount += 2;
      }

      if (sector) {
        paramCount++;
        whereConditions.push(`sector = $${paramCount}`);
        params.push(sector);
      }

      const whereClause = whereConditions.length > 0 ? `WHERE ${whereConditions.join(' AND ')}` : '';

      // Get stocks - POSTGRESQL
      const stocks = await db.query(`
        SELECT id, symbol, company_name, sector, exchange, current_price, 
               day_high, day_low, volume, created_at
        FROM stocks 
        ${whereClause}
        ORDER BY ${sort} ${order.toUpperCase()}
        LIMIT $${paramCount + 1} OFFSET $${paramCount + 2}
      `, [...params, limit, offset]);

      // Get total count for pagination - POSTGRESQL
      const countResult = await db.get(`
        SELECT COUNT(*) as total 
        FROM stocks 
        ${whereClause}
      `, params);

      // Get distinct sectors for filters - POSTGRESQL
      const sectorsResult = await db.query(`
        SELECT DISTINCT sector 
        FROM stocks 
        WHERE sector IS NOT NULL AND sector != '' AND is_active = TRUE
        ORDER BY sector
      `);
      const sectors = sectorsResult.rows.map(row => row.sector);

      reply.send({
        stocks: stocks.rows.map(stock => ({
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

  // Get single stock details - POSTGRESQL
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
    const upperSymbol = symbol.toUpperCase();

    try {
      // First, try to get from local database - POSTGRESQL
      const stock = await db.get(`
        SELECT id, symbol, company_name, sector, exchange, current_price, 
               day_high, day_low, volume, is_active, created_at
        FROM stocks 
        WHERE symbol = $1 AND is_active = TRUE
      `, [upperSymbol]);

      // If found in local DB, return it
      if (stock) {
        return reply.send({
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
            createdAt: stock.created_at,
            source: 'local_database'
          }
        });
      }

      // If not found locally, call Alpha Vantage API
      console.log(`🔍 Stock ${upperSymbol} not found locally, calling Alpha Vantage API...`);
      
      const alphaVantageUrl = `https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${upperSymbol}&apikey=${process.env.ALPHA_VANTAGE_API_KEY}`;
      
      const response = await fetch(alphaVantageUrl);
      const data = await response.json();
      
      if (data['Global Quote'] && data['Global Quote']['01. symbol']) {
        const quote = data['Global Quote'];
        return reply.send({
          stock: {
            symbol: quote['01. symbol'],
            companyName: `${upperSymbol} Company`,
            currentPrice: parseFloat(quote['05. price']),
            dayHigh: parseFloat(quote['03. high']),
            dayLow: parseFloat(quote['04. low']),
            volume: parseInt(quote['06. volume']),
            previousClose: parseFloat(quote['08. previous close']),
            change: parseFloat(quote['09. change']),
            changePercent: quote['10. change percent'],
            source: 'alpha_vantage_api',
            realTime: true
          }
        });
      } else {
        return reply.status(404).send({ 
          error: 'Stock not found',
          message: `Stock ${upperSymbol} not found in local database or Alpha Vantage API`,
          details: data.Note || data['Error Message'] || 'Unknown error'
        });
      }

    } catch (error) {
      fastify.log.error('Stock lookup error:', error);
      reply.status(500).send({ 
        error: 'Internal server error',
        details: error.message 
      });
    }
  });

  // Get stock price history - POSTGRESQL
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
      const stock = await db.get(
        'SELECT id, current_price FROM stocks WHERE symbol = $1', 
        [symbol.toUpperCase()]
      );

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

  // Test MarketStack integration
  fastify.get('/test-market-data', async (request, reply) => {
    try {
        const { enhancedMarketDataService } = await import('../services/enhancedMarketDataService.js');
        
        const testSymbols = ['RELIANCE', 'TCS', 'INFY', 'HDFCBANK'];
        const marketData = await enhancedMarketDataService.getRealTimePrices(testSymbols);
        
        return {
            success: true,
            dataSource: 'MarketStack + Alpha Vantage',
            marketData: marketData,
            timestamp: new Date().toISOString()
        };
    } catch (error) {
        console.error('Market data test error:', error);
        return reply.code(500).send({
            success: false,
            error: 'Market data test failed',
            details: error.message
        });
    }
  });

  // Helper function to generate mock historical data
  function generateMockHistoricalData(currentPrice, period) {
    // ... (same as before, no changes needed)
    const data = [];
    let points = 100;
    let timeInterval = 1;

    switch (period) {
      case '1d': points = 96; timeInterval = 15; break;
      case '1w': points = 168; timeInterval = 60; break;
      case '1m': points = 30; timeInterval = 1440; break;
      case '3m': points = 90; timeInterval = 1440; break;
      case '1y': points = 365; timeInterval = 1440; break;
    }

    let price = currentPrice;
    const baseTime = new Date();

    for (let i = points - 1; i >= 0; i--) {
      const changePercent = (Math.random() - 0.5) * 4;
      price = price * (1 + changePercent / 100);
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