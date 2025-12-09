import { db } from '../config/database.js';
import { randomUUID } from 'crypto';

export default async function kycRoutes(fastify, options) {
  
  // Get KYC Status
  fastify.get('/kyc/status', {
    preHandler: [fastify.authenticate]
  }, async (request, reply) => {
    try {
      const kycInfo = await db.get(`
        SELECT 
          u.kyc_status,
          u.is_kyc_verified,
          kv.status as verification_status,
          kv.full_name,
          kv.pan_number,
          kv.aadhaar_verified,
          kv.bank_account_verified
        FROM users u
        LEFT JOIN kyc_verifications kv ON u.id = kv.user_id
        WHERE u.id = $1
      `, [request.user.id]);

      return {
        kycStatus: kycInfo?.kyc_status || 'not_started',
        isKycVerified: kycInfo?.is_kyc_verified || false,
        verificationStatus: kycInfo?.verification_status || 'pending',
        fullName: kycInfo?.full_name,
        panNumber: kycInfo?.pan_number ? '****' + kycInfo.pan_number.slice(-4) : null,
        aadhaarVerified: kycInfo?.aadhaar_verified || false,
        bankVerified: kycInfo?.bank_account_verified || false
      };
    } catch (error) {
      fastify.log.error(error);
      reply.status(500).send({ error: 'Internal server error' });
    }
  });

  // Verify PAN Card via API (Groww Style)
  fastify.post('/kyc/verify-pan', {
    preHandler: [fastify.authenticate],
    schema: {
      body: {
        type: 'object',
        required: ['panNumber', 'fullName', 'dateOfBirth'],
        properties: {
          panNumber: { type: 'string', pattern: '^[A-Z]{5}[0-9]{4}[A-Z]{1}$' },
          fullName: { type: 'string', minLength: 3 },
          dateOfBirth: { type: 'string', format: 'date' }
        }
      }
    }
  }, async (request, reply) => {
    const { panNumber, fullName, dateOfBirth } = request.body;
    
    try {
      // MOCK PAN VERIFICATION API CALL
      const mockPanVerification = {
        isValid: true,
        name: fullName,
        pan: panNumber,
        status: 'valid'
      };

      if (!mockPanVerification.isValid) {
        return reply.status(400).send({ error: 'Invalid PAN card details' });
      }

      // Update KYC verification with PAN details
      await db.run(`
        INSERT INTO kyc_verifications (id, user_id, pan_number, full_name, date_of_birth, status)
        VALUES ($1, $2, $3, $4, $5, $6)
        ON CONFLICT (user_id) 
        DO UPDATE SET 
          pan_number = $3, 
          full_name = $4, 
          date_of_birth = $5,
          status = 'pan_verified',
          updated_at = CURRENT_TIMESTAMP
      `, [randomUUID(), request.user.id, panNumber.toUpperCase(), fullName, dateOfBirth, 'pan_verified']);

      // Update user KYC status
      await db.run(
        'UPDATE users SET kyc_status = $1 WHERE id = $2',
        ['pan_verified', request.user.id]
      );

      return { 
        success: true, 
        message: 'PAN card verified successfully',
        status: 'pan_verified'
      };

    } catch (error) {
      fastify.log.error(error);
      reply.status(500).send({ error: 'Internal server error' });
    }
  });

  // Send Aadhaar OTP (Groww Style)
  fastify.post('/kyc/send-aadhaar-otp', {
    preHandler: [fastify.authenticate],
    schema: {
      body: {
        type: 'object',
        required: ['aadhaarNumber'],
        properties: {
          aadhaarNumber: { type: 'string', pattern: '^[0-9]{12}$' }
        }
      }
    }
  }, async (request, reply) => {
    const { aadhaarNumber } = request.body;
    
    try {
      // MOCK: Generate and store Aadhaar OTP
      const { OTPService } = await import('../services/otpService.js');
      const otp = await OTPService.generateOTP(aadhaarNumber, 'aadhaar_verification');
      
      console.log(`📧 Aadhaar OTP ${otp} sent to mobile linked with ${aadhaarNumber}`);

      return { 
        success: true, 
        message: 'Aadhaar OTP sent to registered mobile',
        maskedAadhaar: `XXXXXXXX${aadhaarNumber.slice(-4)}`
      };

    } catch (error) {
      fastify.log.error(error);
      reply.status(500).send({ error: 'Internal server error' });
    }
  });

  // Verify Aadhaar OTP (Groww Style)
  fastify.post('/kyc/verify-aadhaar-otp', {
    preHandler: [fastify.authenticate],
    schema: {
      body: {
        type: 'object',
        required: ['aadhaarNumber', 'otp'],
        properties: {
          aadhaarNumber: { type: 'string', pattern: '^[0-9]{12}$' },
          otp: { type: 'string', minLength: 6, maxLength: 6 }
        }
      }
    }
  }, async (request, reply) => {
    const { aadhaarNumber, otp } = request.body;
    
    try {
      const { OTPService } = await import('../services/otpService.js');
      
      // Verify Aadhaar OTP
      const isValid = await OTPService.verifyOTP(aadhaarNumber, otp, 'aadhaar_verification');
      
      if (!isValid) {
        return reply.status(400).send({ error: 'Invalid or expired Aadhaar OTP' });
      }

      // Update KYC with Aadhaar verification
      await db.run(`
        UPDATE kyc_verifications 
        SET aadhaar_verified = TRUE,
            status = 'aadhaar_verified',
            updated_at = CURRENT_TIMESTAMP
        WHERE user_id = $1
      `, [request.user.id]);

      // Update user KYC status
      await db.run(
        'UPDATE users SET kyc_status = $1 WHERE id = $2',
        ['aadhaar_verified', request.user.id]
      );

      return { 
        success: true, 
        message: 'Aadhaar verified successfully',
        status: 'aadhaar_verified'
      };

    } catch (error) {
      fastify.log.error(error);
      reply.status(500).send({ error: 'Internal server error' });
    }
  });

  // Verify Bank Account (Groww Style)
  fastify.post('/kyc/verify-bank-account', {
    preHandler: [fastify.authenticate],
    schema: {
      body: {
        type: 'object',
        required: ['accountNumber', 'ifscCode', 'accountHolderName'],
        properties: {
          accountNumber: { type: 'string', minLength: 9, maxLength: 18 },
          ifscCode: { type: 'string', pattern: '^[A-Z]{4}0[A-Z0-9]{6}$' },
          accountHolderName: { type: 'string', minLength: 3 }
        }
      }
    }
  }, async (request, reply) => {
    const { accountNumber, ifscCode, accountHolderName } = request.body;
    
    try {
      // MOCK Bank Account Verification
      const mockBankVerification = {
        isValid: true,
        bankName: 'State Bank of India',
        branch: 'Main Branch',
        accountExists: true
      };

      if (!mockBankVerification.isValid) {
        return reply.status(400).send({ error: 'Invalid bank account details' });
      }

      // Update KYC with bank verification
      await db.run(`
        UPDATE kyc_verifications 
        SET bank_account_verified = TRUE,
            bank_account_number = $1,
            bank_ifsc_code = $2,
            bank_account_holder = $3,
            status = 'bank_verified',
            updated_at = CURRENT_TIMESTAMP
        WHERE user_id = $4
      `, [accountNumber, ifscCode, accountHolderName, request.user.id]);

      // Update user KYC status
      await db.run(
        'UPDATE users SET kyc_status = $1 WHERE id = $2',
        ['bank_verified', request.user.id]
      );

      return { 
        success: true, 
        message: 'Bank account verified successfully',
        status: 'bank_verified',
        bankName: mockBankVerification.bankName
      };

    } catch (error) {
      fastify.log.error(error);
      reply.status(500).send({ error: 'Internal server error' });
    }
  });

  // Complete KYC Process
  fastify.post('/kyc/complete', {
    preHandler: [fastify.authenticate]
  }, async (request, reply) => {
    try {
      // Check if all verifications are done
      const kycInfo = await db.get(`
        SELECT pan_number, aadhaar_verified, bank_account_verified 
        FROM kyc_verifications 
        WHERE user_id = $1
      `, [request.user.id]);

      if (!kycInfo?.pan_number) {
        return reply.status(400).send({ error: 'PAN verification required' });
      }

      if (!kycInfo?.aadhaar_verified) {
        return reply.status(400).send({ error: 'Aadhaar verification required' });
      }

      if (!kycInfo?.bank_account_verified) {
        return reply.status(400).send({ error: 'Bank account verification required' });
      }

      // Mark KYC as completed
      await db.run(`
        UPDATE kyc_verifications 
        SET status = 'completed',
            verified_at = CURRENT_TIMESTAMP,
            updated_at = CURRENT_TIMESTAMP
        WHERE user_id = $1
      `, [request.user.id]);

      await db.run(
        'UPDATE users SET kyc_status = $1, is_kyc_verified = TRUE WHERE id = $2',
        ['completed', request.user.id]
      );

      return { 
        success: true, 
        message: 'KYC completed successfully! You can now start trading.',
        status: 'completed'
      };

    } catch (error) {
      fastify.log.error(error);
      reply.status(500).send({ error: 'Internal server error' });
    }
  });
} 