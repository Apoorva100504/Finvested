// routes/payments.js
import { paymentService } from '../services/paymentService.js';
import { randomUUID } from 'crypto';
import { db } from '../config/database.js';

export default async function paymentsRoutes(fastify, options) {
    // Use the database from the config
    const database = db;

    // Add JWT authentication hook for all payment routes
    fastify.addHook('onRequest', async (request, reply) => {
        try {
            await request.jwtVerify();
        } catch (err) {
            reply.send(err);
        }
    });

    // Get payment methods and configuration
    fastify.get('/payment-methods', async (request, reply) => {
        return {
            success: true,
            methods: [
                {
                    id: 'razorpay',
                    name: 'Razorpay UPI/Cards/NetBanking',
                    supportedMethods: ['UPI', 'Credit Card', 'Debit Card', 'Net Banking', 'Wallet'],
                    minAmount: 1,
                    maxAmount: 100000,
                    processingFee: 0
                }
            ],
            razorpayKey: process.env.RAZORPAY_KEY_ID
        };
    });

    // Create payment order (generic - can be used for any payment type)
    fastify.post('/create-order', {
        schema: {
            body: {
                type: 'object',
                required: ['amount', 'purpose'],
                properties: {
                    amount: { type: 'number', minimum: 1 },
                    purpose: { type: 'string', enum: ['deposit', 'subscription', 'investment'] },
                    currency: { type: 'string', default: 'INR' },
                    notes: { type: 'object' }
                }
            }
        }
    }, async (request, reply) => {
        const { amount, purpose, currency, notes } = request.body;
        const userId = request.user.id;

        console.log('User ID from JWT:', userId);

        try {
            // Create Razorpay order
            const orderResult = await paymentService.createDepositOrder(userId, amount, currency);
            
            if (!orderResult.success) {
                return reply.code(400).send({
                    error: 'Payment order creation failed',
                    details: orderResult.error
                });
            }

            // Store payment intent
            const paymentIntentId = randomUUID();
            database.prepare(`
                INSERT INTO payment_intents (id, user_id, razorpay_order_id, amount, currency, purpose, status, notes)
                VALUES (?, ?, ?, ?, ?, ?, 'created', ?)
            `).run(
                paymentIntentId,
                userId,
                orderResult.orderId,
                amount,
                currency,
                purpose,
                JSON.stringify(notes || {})
            );

            return {
                success: true,
                paymentIntentId,
                order: orderResult,
                purpose,
                createdAt: new Date().toISOString()
            };

        } catch (error) {
            console.error('Payment order creation error:', error);
            return reply.code(500).send({
                error: 'Failed to create payment order',
                details: error.message
            });
        }
    });

    // Verify payment (generic verification endpoint)
    fastify.post('/verify', {
        schema: {
            body: {
                type: 'object',
                required: ['orderId', 'paymentId', 'signature', 'paymentIntentId'],
                properties: {
                    orderId: { type: 'string' },
                    paymentId: { type: 'string' },
                    signature: { type: 'string' },
                    paymentIntentId: { type: 'string' }
                }
            }
        }
    }, async (request, reply) => {
        const { orderId, paymentId, signature, paymentIntentId } = request.body;
        const userId = request.user.id;

        try {
            // Verify payment signature
            const isValid = paymentService.verifyPaymentSignature(orderId, paymentId, signature);
            
            if (!isValid) {
                return reply.code(400).send({
                    error: 'Invalid payment signature',
                    code: 'INVALID_SIGNATURE'
                });
            }

            // Get payment intent details
            const paymentIntent = database.prepare(`
                SELECT * FROM payment_intents 
                WHERE id = ? AND user_id = ?
            `).get(paymentIntentId, userId);

            if (!paymentIntent) {
                return reply.code(404).send({
                    error: 'Payment intent not found'
                });
            }

            // Update payment intent status
            database.prepare(`
                UPDATE payment_intents 
                SET status = 'completed', 
                    razorpay_payment_id = ?,
                    completed_at = CURRENT_TIMESTAMP
                WHERE id = ?
            `).run(paymentId, paymentIntentId);

            // Handle different payment purposes
            if (paymentIntent.purpose === 'deposit') {
                // Update wallet balance
                database.prepare(`
                    UPDATE wallet 
                    SET balance = balance + ?, updated_at = CURRENT_TIMESTAMP
                    WHERE user_id = ?
                `).run(paymentIntent.amount, userId);

                // Create transaction record
                const transactionId = randomUUID();
                database.prepare(`
                    INSERT INTO transactions (id, user_id, type, amount, status, description, metadata)
                    VALUES (?, ?, 'deposit', ?, 'completed', 'Funds deposit via Razorpay', ?)
                `).run(
                    transactionId,
                    userId,
                    paymentIntent.amount,
                    JSON.stringify({
                        razorpayOrderId: orderId,
                        razorpayPaymentId: paymentId,
                        paymentIntentId: paymentIntentId
                    })
                );
            }

            // Get updated wallet balance
            const wallet = database.prepare('SELECT balance FROM wallet WHERE user_id = ?').get(userId);

            return {
                success: true,
                message: 'Payment verified successfully',
                paymentId,
                purpose: paymentIntent.purpose,
                amount: paymentIntent.amount,
                walletBalance: wallet.balance,
                verifiedAt: new Date().toISOString()
            };

        } catch (error) {
            console.error('Payment verification error:', error);
            return reply.code(500).send({
                error: 'Payment verification failed'
            });
        }
    });

    // Get payment history
    fastify.get('/history', async (request, reply) => {
        const userId = request.user.id;
        
        const payments = database.prepare(`
            SELECT id, razorpay_order_id, amount, currency, purpose, status, created_at, completed_at
            FROM payment_intents 
            WHERE user_id = ? 
            ORDER BY created_at DESC
            LIMIT 50
        `).all(userId);

        return {
            success: true,
            payments,
            total: payments.length
        };
    });

    // Get specific payment details
    fastify.get('/:paymentIntentId', async (request, reply) => {
        const { paymentIntentId } = request.params;
        const userId = request.user.id;

        const payment = database.prepare(`
            SELECT * FROM payment_intents 
            WHERE id = ? AND user_id = ?
        `).get(paymentIntentId, userId);

        if (!payment) {
            return reply.code(404).send({
                error: 'Payment not found'
            });
        }

        return {
            success: true,
            payment
        };
    });

    // Webhook endpoint for Razorpay (no authentication) - exclude from JWT auth
    fastify.post('/webhook', { onRequest: [] }, async (request, reply) => {
        const signature = request.headers['x-razorpay-signature'];
        const webhookBody = JSON.stringify(request.body);

        // In production, verify webhook signature here
        console.log('Webhook received:', request.body.event);

        // Immediately acknowledge webhook
        reply.code(200).send({ status: 'ok' });

        // Process webhook asynchronously
        try {
            const event = request.body;
            
            switch (event.event) {
                case 'payment.captured':
                    await handlePaymentCaptured(event.payload.payment.entity);
                    break;
                case 'payment.failed':
                    await handlePaymentFailed(event.payload.payment.entity);
                    break;
                case 'order.paid':
                    await handleOrderPaid(event.payload.order.entity);
                    break;
                default:
                    console.log('Unhandled webhook event:', event.event);
            }
        } catch (error) {
            console.error('Webhook processing error:', error);
        }
    });

    // Webhook handlers
    async function handlePaymentCaptured(payment) {
        console.log('Payment captured:', payment.id);
        // Update your database, send notifications, etc.
    }

    async function handlePaymentFailed(payment) {
        console.log('Payment failed:', payment.id);
        // Update your database, notify user, etc.
    }

    async function handleOrderPaid(order) {
        console.log('Order paid:', order.id);
        // Handle order completion
    }
}
