// routes/users.js
import { kycService } from '../services/kycService.js';
import { notificationService } from '../services/notificationService.js';
import { randomUUID } from 'crypto';

export default async function usersRoutes(fastify, options) {
    const db = fastify.db;

    // KYC Submit endpoint
    fastify.post('/kyc/submit', async (request, reply) => {
        try {
            const { panNumber, aadhaarNumber, dateOfBirth, address } = request.body;
            const userId = request.user.id;

            // Check if user already has KYC submitted
            const existingKyc = db.prepare('SELECT id, kyc_status FROM kyc_details WHERE user_id = ?').get(userId);
            if (existingKyc && existingKyc.kyc_status === 'verified') {
                return reply.code(400).send({ error: 'KYC already verified' });
            }

            // Perform real KYC verification
            const kycResult = await kycService.performFullKYC(
                panNumber,
                aadhaarNumber,
                {
                    firstName: request.user.firstName,
                    lastName: request.user.lastName,
                    dateOfBirth: dateOfBirth
                }
            );

            const kycId = randomUUID();
            const kycStatus = kycResult.isVerified ? 'verified' : 'pending';

            // Store KYC details
            const insertKyc = db.prepare(`
                INSERT INTO kyc_details (id, user_id, pan_number, aadhaar_number, date_of_birth, address, kyc_status, submitted_at, verified_at)
                VALUES (?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP, ?)
            `);

            insertKyc.run(
                kycId,
                userId,
                panNumber.toUpperCase(),
                aadhaarNumber,
                dateOfBirth,
                JSON.stringify(address),
                kycStatus,
                kycResult.isVerified ? new Date().toISOString() : null
            );

            // Update user KYC status
            db.prepare('UPDATE users SET is_kyc_verified = ? WHERE id = ?').run(
                kycResult.isVerified ? 1 : 0,
                userId
            );

            // Send notification
            await notificationService.sendKYCStatusNotification(userId, kycStatus);

            const kyc = db.prepare(`
                SELECT id, kyc_status, submitted_at, verified_at 
                FROM kyc_details 
                WHERE id = ?
            `).get(kycId);

            return {
                success: true,
                kyc: {
                    id: kyc.id,
                    status: kyc.kyc_status,
                    submittedAt: kyc.submitted_at,
                    verifiedAt: kyc.verified_at,
                    verificationDetails: kycResult
                }
            };

        } catch (error) {
            console.error('KYC submission error:', error);
            return reply.code(500).send({ error: 'KYC verification failed' });
        }
    });

    // Get user profile
    fastify.get('/profile', async (request, reply) => {
        const userId = request.user.id;
        
        const user = db.prepare(`
            SELECT u.id, u.email, u.first_name, u.last_name, u.phone, 
                u.is_kyc_verified, u.created_at, u.updated_at,
                k.kyc_status, k.submitted_at, k.verified_at
            FROM users u
            LEFT JOIN kyc_details k ON u.id = k.user_id
            WHERE u.id = ?
        `).get(userId);

        return {
            id: user.id,
            email: user.email,
            firstName: user.first_name,
            lastName: user.last_name,
            phone: user.phone,
            isKycVerified: user.is_kyc_verified,
            kycStatus: user.kyc_status,
            kycSubmittedAt: user.submitted_at,
            kycVerifiedAt: user.verified_at,
            createdAt: user.created_at,
            updatedAt: user.updated_at
        };
    });
}
