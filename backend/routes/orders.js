// routes/orders.js
import { db } from '../config/database.js';
import { randomUUID } from 'crypto';
import { orderService } from '../services/orderService.js';

export default async function ordersRoutes(fastify, options) {
  
  fastify.addHook('onRequest', async (request, reply) => {
    try {
      await request.jwtVerify();
    } catch (err) {
      reply.send(err);
    }
  });

  // Place a new order
  fastify.post('/orders/place', {
    schema: {
      body: {
        type: 'object',
        required: ['stockId', 'orderType', 'orderCategory', 'quantity'],
        properties: {
          stockId: { type: 'string' },
          orderType: { type: 'string', enum: ['buy', 'sell'] },
          orderCategory: { type: 'string', enum: ['market', 'limit'] },
          quantity: { type: 'integer', minimum: 1 },
          price: { type: 'number', minimum: 0.01 }
        }
      }
    }
  }, async (request, reply) => {
    const userId = request.user.id;
    const { stockId, orderType, orderCategory, quantity, price } = request.body;

    try {
      console.log('Received order request:', { userId, stockId, orderType, orderCategory, quantity, price });

      // Validate order
      const validation = await orderService.validateOrder(userId, {
        stockId,
        orderType,
        orderCategory,
        quantity,
        price
      });

      if (!validation.valid) {
        console.log('Order validation failed:', validation.error);
        return reply.status(400).send({ error: validation.error });
      }

      // Place order
      const order = await orderService.placeOrder(userId, {
        stockId,
        orderType,
        orderCategory,
        quantity,
        price
      });

      console.log('Order placed successfully:', order.id);

      reply.status(201).send({
        message: 'Order placed successfully',
        order: {
          id: order.id,
          orderType: order.order_type,
          orderCategory: order.order_category,
          quantity: order.quantity,
          price: order.price,
          status: order.status,
          createdAt: order.created_at
        }
      });

    } catch (error) {
      console.error('Order placement error:', error);
      reply.status(500).send({ error: error.message || 'Internal server error' });
    }
  });

  // Get user orders - POSTGRESQL
  fastify.get('/orders', {
    schema: {
      querystring: {
        type: 'object',
        properties: {
          status: { type: 'string', enum: ['pending', 'executed', 'partial', 'cancelled', 'failed'] },
          type: { type: 'string', enum: ['buy', 'sell'] },
          page: { type: 'integer', minimum: 1, default: 1 },
          limit: { type: 'integer', minimum: 1, maximum: 50, default: 20 }
        }
      }
    }
  }, async (request, reply) => {
    const userId = request.user.id;
    const { status, type, page = 1, limit = 20 } = request.query;
    const offset = (page - 1) * limit;

    try {
      console.log('Fetching orders for user:', userId);
      
      let whereConditions = ['o.user_id = $1'];
      let params = [userId];
      let paramCount = 1;

      if (status) {
        paramCount++;
        whereConditions.push(`o.status = $${paramCount}`);
        params.push(status);
      }

      if (type) {
        paramCount++;
        whereConditions.push(`o.order_type = $${paramCount}`);
        params.push(type);
      }

      const whereClause = whereConditions.length > 0 ? `WHERE ${whereConditions.join(' AND ')}` : '';

      console.log('Query conditions:', whereClause, params);

      // Get orders with stock details - POSTGRESQL
      const orders = await db.query(`
        SELECT 
          o.id, o.user_id, o.stock_id, o.order_type, o.order_category, 
          o.quantity, o.price, o.status, o.executed_quantity, o.average_price,
          o.created_at, o.updated_at,
          s.symbol, s.company_name, s.current_price
        FROM orders o
        JOIN stocks s ON o.stock_id = s.id
        ${whereClause}
        ORDER BY o.created_at DESC
        LIMIT $${paramCount + 1} OFFSET $${paramCount + 2}
      `, [...params, limit, offset]);

      console.log('Found orders:', orders.rows.length);

      // Get total count - POSTGRESQL
      const countQuery = `
        SELECT COUNT(*) as total 
        FROM orders o 
        ${whereClause}
      `;
      const countResult = await db.get(countQuery, params);
      console.log('Total orders count:', countResult.total);

      const formattedOrders = orders.rows.map(order => ({
        id: order.id,
        stock: {
          symbol: order.symbol,
          companyName: order.company_name
        },
        orderType: order.order_type,
        orderCategory: order.order_category,
        quantity: order.quantity,
        price: order.price,
        status: order.status,
        executedQuantity: order.executed_quantity,
        averagePrice: order.average_price,
        currentPrice: order.current_price,
        createdAt: order.created_at,
        updatedAt: order.updated_at
      }));

      console.log('Formatted orders:', formattedOrders);

      reply.send({
        orders: formattedOrders,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total: countResult.total,
          totalPages: Math.ceil(countResult.total / limit)
        }
      });

    } catch (error) {
      console.error('Error fetching orders:', error);
      reply.status(500).send({ error: 'Internal server error: ' + error.message });
    }
  });

  // Cancel an order - POSTGRESQL
  fastify.post('/orders/:id/cancel', {
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
      const order = await db.get(
        'SELECT * FROM orders WHERE id = $1 AND user_id = $2', 
        [id, userId]
      );

      if (!order) {
        return reply.status(404).send({ error: 'Order not found' });
      }

      if (order.status !== 'pending') {
        return reply.status(400).send({ error: 'Only pending orders can be cancelled' });
      }

      // Cancel order
      const result = await orderService.cancelOrder(id, userId);

      if (result.success) {
        reply.send({ message: 'Order cancelled successfully' });
      } else {
        reply.status(400).send({ error: result.error });
      }

    } catch (error) {
      fastify.log.error(error);
      reply.status(500).send({ error: 'Internal server error' });
    }
  });

  // Get order by ID - POSTGRESQL
  fastify.get('/orders/:id', {
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
      const order = await db.get(`
        SELECT o.*, s.symbol, s.company_name, s.current_price
        FROM orders o
        JOIN stocks s ON o.stock_id = s.id
        WHERE o.id = $1 AND o.user_id = $2
      `, [id, userId]);

      if (!order) {
        return reply.status(404).send({ error: 'Order not found' });
      }

      reply.send({
        order: {
          id: order.id,
          stock: {
            symbol: order.symbol,
            companyName: order.company_name
          },
          orderType: order.order_type,
          orderCategory: order.order_category,
          quantity: order.quantity,
          price: order.price,
          status: order.status,
          executedQuantity: order.executed_quantity,
          averagePrice: order.average_price,
          currentPrice: order.current_price,
          createdAt: order.created_at,
          updatedAt: order.updated_at
        }
      });

    } catch (error) {
      fastify.log.error(error);
      reply.status(500).send({ error: 'Internal server error' });
    }
  });
}