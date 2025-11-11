// routes/alerts.js
import { db } from '../config/database.js';
import { randomUUID } from 'crypto';

export default async function alertsRoutes(fastify, options) {
  
  // Helper function to check if alert is triggered
  function checkAlertTriggered(alert) {
    if (!alert.is_active || alert.triggered_at) return false;

    const currentPrice = alert.current_price;
    const targetPrice = alert.target_price;

    if (alert.condition === 'above' && currentPrice >= targetPrice) {
      return true;
    }

    if (alert.condition === 'below' && currentPrice <= targetPrice) {
      return true;
    }

    return false;
  }

  fastify.addHook('onRequest', async (request, reply) => {
    try {
      await request.jwtVerify();
    } catch (err) {
      reply.send(err);
    }
  });

  // Create price alert
  fastify.post('/alerts', {
    schema: {
      body: {
        type: 'object',
        required: ['stockId', 'condition', 'targetPrice'],
        properties: {
          stockId: { type: 'string' },
          condition: { type: 'string', enum: ['above', 'below'] },
          targetPrice: { type: 'number', minimum: 0.01 },
          isActive: { type: 'boolean', default: true }
        }
      }
    }
  }, async (request, reply) => {
    const userId = request.user.id;
    const { stockId, condition, targetPrice, isActive = true } = request.body;

    try {
      // Check if stock exists
      const stock = db.prepare('SELECT id, symbol FROM stocks WHERE id = ?').get(stockId);
      if (!stock) {
        return reply.status(404).send({ error: 'Stock not found' });
      }

      const alertId = randomUUID();
      
      db.prepare(`
        INSERT INTO price_alerts (id, user_id, stock_id, condition, target_price, is_active, created_at)
        VALUES (?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP)
      `).run(alertId, userId, stockId, condition, targetPrice, isActive ? 1 : 0);

      const alert = db.prepare(`
        SELECT pa.*, s.symbol, s.company_name, s.current_price
        FROM price_alerts pa
        JOIN stocks s ON pa.stock_id = s.id
        WHERE pa.id = ?
      `).get(alertId);

      reply.status(201).send({
        message: 'Price alert created successfully',
        alert: {
          id: alert.id,
          stock: {
            symbol: alert.symbol,
            companyName: alert.company_name
          },
          condition: alert.condition,
          targetPrice: alert.target_price,
          isActive: Boolean(alert.is_active),
          isTriggered: checkAlertTriggered(alert),
          createdAt: alert.created_at
        }
      });

    } catch (error) {
      fastify.log.error(error);
      reply.status(500).send({ error: 'Internal server error' });
    }
  });

  // Get user's price alerts
  fastify.get('/alerts', async (request, reply) => {
    const userId = request.user.id;

    try {
      const alerts = db.prepare(`
        SELECT pa.*, s.symbol, s.company_name, s.current_price
        FROM price_alerts pa
        JOIN stocks s ON pa.stock_id = s.id
        WHERE pa.user_id = ?
        ORDER BY pa.created_at DESC
      `).all(userId);

      reply.send({
        alerts: alerts.map(alert => ({
          id: alert.id,
          stock: {
            symbol: alert.symbol,
            companyName: alert.company_name,
            currentPrice: alert.current_price
          },
          condition: alert.condition,
          targetPrice: alert.target_price,
          isActive: Boolean(alert.is_active),
          isTriggered: checkAlertTriggered(alert),
          createdAt: alert.created_at,
          triggeredAt: alert.triggered_at
        }))
      });

    } catch (error) {
      fastify.log.error(error);
      reply.status(500).send({ error: 'Internal server error' });
    }
  });

  // Update alert
  fastify.put('/alerts/:id', {
    schema: {
      params: {
        type: 'object',
        properties: {
          id: { type: 'string' }
        }
      },
      body: {
        type: 'object',
        properties: {
          condition: { type: 'string', enum: ['above', 'below'] },
          targetPrice: { type: 'number', minimum: 0.01 },
          isActive: { type: 'boolean' }
        }
      }
    }
  }, async (request, reply) => {
    const userId = request.user.id;
    const { id } = request.params;
    const { condition, targetPrice, isActive } = request.body;

    try {
      const alert = db.prepare('SELECT * FROM price_alerts WHERE id = ? AND user_id = ?').get(id, userId);
      if (!alert) {
        return reply.status(404).send({ error: 'Alert not found' });
      }

      const updates = [];
      const params = [];

      if (condition) {
        updates.push('condition = ?');
        params.push(condition);
      }

      if (targetPrice) {
        updates.push('target_price = ?');
        params.push(targetPrice);
      }

      if (isActive !== undefined) {
        updates.push('is_active = ?');
        params.push(isActive ? 1 : 0);
      }

      if (updates.length === 0) {
        return reply.status(400).send({ error: 'No fields to update' });
      }

      updates.push('updated_at = CURRENT_TIMESTAMP');
      params.push(id, userId);

      db.prepare(`
        UPDATE price_alerts 
        SET ${updates.join(', ')}
        WHERE id = ? AND user_id = ?
      `).run(...params);

      const updatedAlert = db.prepare(`
        SELECT pa.*, s.symbol, s.company_name, s.current_price
        FROM price_alerts pa
        JOIN stocks s ON pa.stock_id = s.id
        WHERE pa.id = ?
      `).get(id);

      reply.send({
        message: 'Alert updated successfully',
        alert: {
          id: updatedAlert.id,
          stock: {
            symbol: updatedAlert.symbol,
            companyName: updatedAlert.company_name,
            currentPrice: updatedAlert.current_price
          },
          condition: updatedAlert.condition,
          targetPrice: updatedAlert.target_price,
          isActive: Boolean(updatedAlert.is_active),
          isTriggered: checkAlertTriggered(updatedAlert),
          createdAt: updatedAlert.created_at,
          updatedAt: updatedAlert.updated_at
        }
      });

    } catch (error) {
      fastify.log.error(error);
      reply.status(500).send({ error: 'Internal server error' });
    }
  });

  // Delete alert
  fastify.delete('/alerts/:id', {
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
      const result = db.prepare('DELETE FROM price_alerts WHERE id = ? AND user_id = ?').run(id, userId);

      if (result.changes === 0) {
        return reply.status(404).send({ error: 'Alert not found' });
      }

      reply.send({ message: 'Alert deleted successfully' });

    } catch (error) {
      fastify.log.error(error);
      reply.status(500).send({ error: 'Internal server error' });
    }
  });
}