// routes/portfolio.js
import { db } from '../config/database.js';

export default async function portfolioRoutes(fastify, options) {
  
  fastify.addHook('onRequest', async (request, reply) => {
    try {
      await request.jwtVerify();
    } catch (err) {
      reply.send(err);
    }
  });

  // Get user portfolio - POSTGRESQL
  fastify.get('/portfolio', async (request, reply) => {
    const userId = request.user.id;

    try {
      const portfolioResult = await db.query(`
        SELECT p.*, s.symbol, s.company_name, s.sector, s.exchange, s.current_price
        FROM portfolio p
        JOIN stocks s ON p.stock_id = s.id
        WHERE p.user_id = $1 AND p.quantity > 0
        ORDER BY p.current_value DESC
      `, [userId]);

      // Calculate portfolio summary - POSTGRESQL
      const summaryResult = await db.get(`
        SELECT 
          COALESCE(SUM(invested_amount), 0) as total_invested,
          COALESCE(SUM(current_value), 0) as total_current_value,
          COALESCE(SUM(unrealized_pnl), 0) as total_pnl,
          COUNT(*) as total_holdings
        FROM portfolio 
        WHERE user_id = $1 AND quantity > 0
      `, [userId]);

      const holdings = portfolioResult.rows.map(row => ({
        id: row.id,
        stock: {
          symbol: row.symbol,
          companyName: row.company_name,
          sector: row.sector,
          exchange: row.exchange
        },
        quantity: row.quantity,
        averageBuyPrice: row.average_buy_price,
        investedAmount: row.invested_amount,
        currentPrice: row.current_price,
        currentValue: row.current_value,
        unrealizedPnl: row.unrealized_pnl,
        pnlPercentage: ((row.unrealized_pnl / row.invested_amount) * 100) || 0,
        lastUpdated: row.last_updated
      }));

      const summary = summaryResult;

      reply.send({
        portfolio: {
          holdings,
          summary: {
            totalInvested: summary.total_invested,
            totalCurrentValue: summary.total_current_value,
            totalPnl: summary.total_pnl,
            totalPnlPercentage: ((summary.total_pnl / summary.total_invested) * 100) || 0,
            totalHoldings: summary.total_holdings
          }
        }
      });

    } catch (error) {
      fastify.log.error(error);
      reply.status(500).send({ error: 'Internal server error' });
    }
  });

  // Get trade history - POSTGRESQL
  fastify.get('/portfolio/history', async (request, reply) => {
    const userId = request.user.id;

    try {
      const result = await db.query(`
        SELECT o.id, o.order_type, o.order_category, o.quantity, o.price, 
               o.status, o.executed_quantity, o.average_price, o.created_at,
               s.symbol, s.company_name
        FROM orders o
        JOIN stocks s ON o.stock_id = s.id
        WHERE o.user_id = $1 AND o.status IN ('executed', 'partial')
        ORDER BY o.created_at DESC
        LIMIT 50
      `, [userId]);

      const trades = result.rows.map(row => ({
        id: row.id,
        type: row.order_type,
        category: row.order_category,
        symbol: row.symbol,
        companyName: row.company_name,
        quantity: row.quantity,
        executedQuantity: row.executed_quantity,
        price: row.price,
        averagePrice: row.average_price,
        status: row.status,
        totalAmount: row.average_price * row.executed_quantity,
        executedAt: row.created_at
      }));

      reply.send({ trades });

    } catch (error) {
      fastify.log.error(error);
      reply.status(500).send({ error: 'Internal server error' });
    }
  });
}