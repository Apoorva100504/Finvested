// routes/watchlist.js
import { db } from '../config/database.js';
import { randomUUID } from 'crypto';

export default async function watchlistRoutes(fastify, options) {
  
  fastify.addHook('onRequest', async (request, reply) => {
    try {
      await request.jwtVerify();
    } catch (err) {
      reply.send(err);
    }
  });

  // Get user's watchlist - POSTGRESQL
  fastify.get('/watchlist', async (request, reply) => {
    const userId = request.user.id;

    try {
      const watchlist = await db.query(`
        SELECT w.id, w.created_at,
               s.id as stock_id, s.symbol, s.company_name, s.sector, 
               s.exchange, s.current_price, s.day_high, s.day_low, s.volume
        FROM watchlists w
        JOIN stocks s ON w.stock_id = s.id
        WHERE w.user_id = $1
        ORDER BY w.created_at DESC
      `, [userId]);

      reply.send({
        watchlist: watchlist.rows.map(item => ({
          id: item.id,
          stock: {
            id: item.stock_id,
            symbol: item.symbol,
            companyName: item.company_name,
            sector: item.sector,
            exchange: item.exchange,
            currentPrice: item.current_price,
            dayHigh: item.day_high,
            dayLow: item.day_low,
            volume: item.volume
          },
          addedAt: item.created_at
        }))
      });

    } catch (error) {
      fastify.log.error(error);
      reply.status(500).send({ error: 'Internal server error' });
    }
  });

  // Add stock to watchlist - POSTGRESQL
  fastify.post('/watchlist/add', {
    schema: {
      body: {
        type: 'object',
        required: ['stockId'],
        properties: {
          stockId: { type: 'string' }
        }
      }
    }
  }, async (request, reply) => {
    const userId = request.user.id;
    const { stockId } = request.body;

    try {
      // Check if stock exists - POSTGRESQL
      const stock = await db.get(
        'SELECT id FROM stocks WHERE id = $1 AND is_active = TRUE', 
        [stockId]
      );
      if (!stock) {
        return reply.status(404).send({ error: 'Stock not found' });
      }

      // Check if already in watchlist - POSTGRESQL
      const existing = await db.get(`
        SELECT id FROM watchlists WHERE user_id = $1 AND stock_id = $2
      `, [userId, stockId]);

      if (existing) {
        return reply.status(400).send({ error: 'Stock already in watchlist' });
      }

      // Add to watchlist - POSTGRESQL
      await db.run(`
        INSERT INTO watchlists (id, user_id, stock_id) 
        VALUES ($1, $2, $3)
      `, [randomUUID(), userId, stockId]);

      // Get the added item with stock details - POSTGRESQL
      const addedItem = await db.get(`
        SELECT w.id, w.created_at,
               s.id as stock_id, s.symbol, s.company_name, s.sector, 
               s.exchange, s.current_price
        FROM watchlists w
        JOIN stocks s ON w.stock_id = s.id
        WHERE w.user_id = $1 AND w.stock_id = $2
      `, [userId, stockId]);

      reply.status(201).send({
        message: 'Stock added to watchlist',
        item: {
          id: addedItem.id,
          stock: {
            id: addedItem.stock_id,
            symbol: addedItem.symbol,
            companyName: addedItem.company_name,
            sector: addedItem.sector,
            exchange: addedItem.exchange,
            currentPrice: addedItem.current_price
          },
          addedAt: addedItem.created_at
        }
      });

    } catch (error) {
      fastify.log.error(error);
      reply.status(500).send({ error: 'Internal server error' });
    }
  });

  // Remove stock from watchlist - POSTGRESQL
  fastify.delete('/watchlist/remove/:id', {
    schema: {
      params: {
        type: 'object',
        properties: {
          id: { type: 'string' }
        }
      }
    }
  }, async (request, reply) => {
    const userId = request.user.id;
    const { id } = request.params;

    try {
      const result = await db.run(`
        DELETE FROM watchlists 
        WHERE id = $1 AND user_id = $2
      `, [id, userId]);

      if (result.changes === 0) {
        return reply.status(404).send({ error: 'Watchlist item not found' });
      }

      reply.send({
        message: 'Stock removed from watchlist'
      });

    } catch (error) {
      fastify.log.error(error);
      reply.status(500).send({ error: 'Internal server error' });
    }
  });

  // Remove stock from watchlist by symbol - POSTGRESQL
  fastify.delete('/watchlist/remove-by-symbol/:symbol', {
    schema: {
      params: {
        type: 'object',
        properties: {
          symbol: { type: 'string' }
        }
      }
    }
  }, async (request, reply) => {
    const userId = request.user.id;
    const { symbol } = request.params;

    try {
      const result = await db.run(`
        DELETE FROM watchlists 
        WHERE user_id = $1 AND stock_id IN (
          SELECT id FROM stocks WHERE symbol = $2
        )
      `, [userId, symbol.toUpperCase()]);

      if (result.changes === 0) {
        return reply.status(404).send({ error: 'Stock not found in watchlist' });
      }

      reply.send({
        message: 'Stock removed from watchlist'
      });

    } catch (error) {
      fastify.log.error(error);
      reply.status(500).send({ error: 'Internal server error' });
    }
  });
}