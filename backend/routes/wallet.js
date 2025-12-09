// routes/wallet.js
import { paymentService } from '../services/paymentService.js';
import { notificationService } from '../services/notificationService.js';
import { randomUUID } from 'crypto';
import { db } from '../config/database.js'; // Add this import

export default async function walletRoutes(fastify, options) {
    // Add JWT authentication hook
    fastify.addHook('onRequest', async (request, reply) => {
        try {
            await request.jwtVerify();
        } catch (err) {
            reply.send(err);
        }
    });

    // Get wallet balance - POSTGRESQL
    fastify.get('/wallet', async (request, reply) => {
        const userId = request.user.id;
        
        const wallet = await db.get(
            'SELECT balance FROM wallet WHERE user_id = $1', 
            [userId]
        );
        
        if (!wallet) {
            return reply.code(404).send({ error: 'Wallet not found' });
        }

        return { balance: wallet.balance };
    });

    // Deposit initiation endpoint - POSTGRESQL
    fastify.post('/funds/deposit', async (request, reply) => {
        const { amount } = request.body;
        const userId = request.user.id;

        if (!amount || amount <= 0) {
            return reply.code(400).send({ error: 'Invalid amount' });
        }

        try {
            // Create Razorpay order
            const orderResult = await paymentService.createDepositOrder(userId, amount);

            if (!orderResult.success) {
                return reply.code(400).send({ error: orderResult.error });
            }

            // Store pending transaction - POSTGRESQL
            const transactionId = randomUUID();
            await db.run(`
                INSERT INTO transactions (id, user_id, type, amount, status, description, metadata)
                VALUES ($1, $2, 'deposit', $3, 'pending', 'Funds deposit initiated', $4)
            `, [transactionId, userId, amount, JSON.stringify({
                razorpayOrderId: orderResult.orderId,
                createdAt: new Date().toISOString()
            })]);

            return {
                success: true,
                order: orderResult,
                transactionId: transactionId
            };

        } catch (error) {
            console.error('Deposit initiation error:', error);
            return reply.code(500).send({ error: 'Failed to initiate deposit' });
        }
    });

    // Get transaction history - POSTGRESQL
    fastify.get('/funds/history', async (request, reply) => {
        const userId = request.user.id;
        
        const transactions = await db.query(`
            SELECT id, type, amount, status, description, created_at, metadata
            FROM transactions 
            WHERE user_id = $1
            ORDER BY created_at DESC
            LIMIT 50
        `, [userId]);

        return { transactions: transactions.rows };
    });

    // Withdraw funds - POSTGRESQL
    fastify.post('/funds/withdraw', async (request, reply) => {
        const { amount } = request.body;
        const userId = request.user.id;

        if (!amount || amount <= 0) {
            return reply.code(400).send({ error: 'Invalid amount' });
        }

        try {
            // Check wallet balance
            const wallet = await db.get(
                'SELECT balance FROM wallet WHERE user_id = $1', 
                [userId]
            );

            if (!wallet || wallet.balance < amount) {
                return reply.code(400).send({ error: 'Insufficient balance' });
            }

            // Create withdrawal transaction - POSTGRESQL
            const transactionId = randomUUID();
            await db.run(`
                INSERT INTO transactions (id, user_id, type, amount, status, description)
                VALUES ($1, $2, 'withdrawal', $3, 'pending', 'Withdrawal request')
            `, [transactionId, userId, amount]);

            // Update wallet balance - POSTGRESQL
            await db.run(`
                UPDATE wallet 
                SET balance = balance - $1, updated_at = CURRENT_TIMESTAMP
                WHERE user_id = $2
            `, [amount, userId]);

            // Update transaction status to completed
            await db.run(`
                UPDATE transactions 
                SET status = 'completed'
                WHERE id = $1
            `, [transactionId]);

            const updatedWallet = await db.get(
                'SELECT balance FROM wallet WHERE user_id = $1', 
                [userId]
            );

            return {
                success: true,
                message: 'Withdrawal successful',
                transactionId: transactionId,
                walletBalance: updatedWallet.balance
            };

        } catch (error) {
            console.error('Withdrawal error:', error);
            return reply.code(500).send({ error: 'Withdrawal failed' });
        }
    });
}