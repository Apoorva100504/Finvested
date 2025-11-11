// routes/wallet.js
import { paymentService } from '../services/paymentService.js';
import { notificationService } from '../services/notificationService.js';
import { randomUUID } from 'crypto';

export default async function walletRoutes(fastify, options) {
    const db = fastify.db;

    // Get wallet balance
    fastify.get('/balance', async (request, reply) => {
        const userId = request.user.id;
        
        const wallet = db.prepare('SELECT balance FROM wallet WHERE user_id = ?').get(userId);
        
        if (!wallet) {
            return reply.code(404).send({ error: 'Wallet not found' });
        }

        return { balance: wallet.balance };
    });

    // Deposit initiation endpoint
    fastify.post('/deposit/initiate', async (request, reply) => {
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

            // Store pending transaction
            const transactionId = randomUUID();
            db.prepare(`
                INSERT INTO transactions (id, user_id, type, amount, status, description, metadata)
                VALUES (?, ?, 'deposit', ?, 'pending', 'Funds deposit initiated', ?)
            `).run(
                transactionId,
                userId,
                amount,
                JSON.stringify({
                    razorpayOrderId: orderResult.orderId,
                    createdAt: new Date().toISOString()
                })
            );

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

    // Payment verification endpoint
    fastify.post('/deposit/verify', async (request, reply) => {
        const { orderId, paymentId, signature, transactionId } = request.body;
        const userId = request.user.id;

        try {
            // Verify payment signature
            const isValid = paymentService.verifyPaymentSignature(orderId, paymentId, signature);

            if (!isValid) {
                return reply.code(400).send({ error: 'Invalid payment signature' });
            }

            // Update transaction status
            db.prepare(`
                UPDATE transactions 
                SET status = 'completed', metadata = json_set(metadata, '$.razorpayPaymentId', ?)
                WHERE id = ? AND user_id = ?
            `).run(paymentId, transactionId, userId);

            // Get transaction amount
            const transaction = db.prepare('SELECT amount FROM transactions WHERE id = ?').get(transactionId);
            const amount = transaction.amount;

            // Update wallet balance
            db.prepare(`
                UPDATE wallet 
                SET balance = balance + ?, updated_at = CURRENT_TIMESTAMP
                WHERE user_id = ?
            `).run(amount, userId);

            // Send notification
            await notificationService.sendEmail(
                request.user.email,
                'Deposit Successful',
                `Your deposit of ₹${amount} has been successfully processed.`
            );

            const updatedWallet = db.prepare('SELECT balance FROM wallet WHERE user_id = ?').get(userId);

            return {
                success: true,
                message: 'Deposit successful',
                walletBalance: updatedWallet.balance
            };

        } catch (error) {
            console.error('Deposit verification error:', error);
            return reply.code(500).send({ error: 'Deposit verification failed' });
        }
    });

    // Get transaction history
    fastify.get('/transactions', async (request, reply) => {
        const userId = request.user.id;
        
        const transactions = db.prepare(`
            SELECT id, type, amount, status, description, created_at, metadata
            FROM transactions 
            WHERE user_id = ?
            ORDER BY created_at DESC
            LIMIT 50
        `).all(userId);

        return { transactions };
    });
}
