// routes/auth.js - CORRECTED VERSION
import { db } from '../config/database.js';
import bcrypt from 'bcryptjs';
import { randomUUID } from 'crypto';

console.log('🔧 auth.js module loaded');

export default async function authRoutes(fastify, options) {
  console.log('🚀 authRoutes function executing with prefix:', options.prefix || 'none');
  console.log('📌 Routes will be registered under:', options.prefix || '/');

  // Add test routes first
  fastify.get('/test-auth', async (request, reply) => {
    console.log('✅ /test-auth route hit!');
    return { 
      success: true, 
      message: 'Auth routes are working!',
      prefix: options.prefix || 'none'
    };
  });

  fastify.post('/test-auth-post', async (request, reply) => {
    console.log('✅ /test-auth-post route hit!', request.body);
    return { 
      success: true, 
      message: 'POST route working',
      data: request.body
    };
  });

  // User Registration - ONLY AFTER EMAIL VERIFICATION
  fastify.post('/signup', {
    schema: {
      body: {
        type: 'object',
        required: ['email', 'password', 'firstName', 'lastName'],
        properties: {
          email: { type: 'string', format: 'email' },
          password: { type: 'string', minLength: 6 },
          firstName: { type: 'string' },
          lastName: { type: 'string' },
          phone: { type: 'string' }
        }
      }
    }
  }, async (request, reply) => {
    const { email, password, firstName, lastName, phone } = request.body;

    try {
      // Check if user already exists
      const userExists = await db.get(
        'SELECT id, is_email_verified FROM users WHERE email = $1', 
        [email]
      );

      // If user exists AND email is verified
      if (userExists && userExists.is_email_verified) {
        return reply.status(400).send({
          error: 'User already exists with this email. Please login instead.'
        });
      }

      // If user exists BUT email NOT verified, delete old record
      if (userExists && !userExists.is_email_verified) {
        await db.run('DELETE FROM users WHERE id = $1', [userExists.id]);
      }

      // Hash password
      const saltRounds = 12;
      const passwordHash = await bcrypt.hash(password, saltRounds);

      const userId = randomUUID();

      // Create user with email verified (since we verified in previous step)
      await db.run(`
        INSERT INTO users (id, email, password, first_name, last_name, phone, is_email_verified) 
        VALUES ($1, $2, $3, $4, $5, $6, $7)
      `, [userId, email, passwordHash, firstName, lastName, phone, true]);

      // Create wallet for user
      await db.run(`
        INSERT INTO wallet (id, user_id) VALUES ($1, $2)
      `, [randomUUID(), userId]);

      // Send welcome email
      try {
        const { EmailService } = await import('../services/emailService.js');
        await EmailService.sendWelcomeEmail(email, `${firstName} ${lastName}`);
      } catch (emailError) {
        console.error('Welcome email failed:', emailError);
        // Don't fail signup if welcome email fails
      }

      // Get created user
      const user = await db.get(`
        SELECT id, email, first_name, last_name, phone, role, is_email_verified, created_at 
        FROM users WHERE id = $1
      `, [userId]);
      
      // Generate JWT token
      const token = fastify.jwt.sign({
        id: user.id,
        email: user.email,
        role: user.role
      });

      reply.status(201).send({
        message: 'Account created successfully!',
        user: {
          id: user.id,
          email: user.email,
          firstName: user.first_name,
          lastName: user.last_name,
          phone: user.phone,
          role: user.role,
          isEmailVerified: user.is_email_verified
        },
        token
      });

    } catch (error) {
      fastify.log.error(error);
      reply.status(500).send({ error: 'Internal server error' });
    }
  });

  // User Login
  fastify.post('/login', {
    schema: {
      body: {
        type: 'object',
        required: ['email', 'password'],
        properties: {
          email: { type: 'string', format: 'email' },
          password: { type: 'string' }
        }
      }
    }
  }, async (request, reply) => {
    const { email, password } = request.body;

    try {
      // Find user
      const user = await db.get(`
        SELECT id, email, password, first_name, last_name, phone, role, is_kyc_verified 
        FROM users WHERE email = $1
      `, [email]);

      if (!user) {
        return reply.status(401).send({ error: 'Invalid credentials' });
      }

      // Verify password
      const isValidPassword = await bcrypt.compare(password, user.password);
      if (!isValidPassword) {
        return reply.status(401).send({ error: 'Invalid credentials' });
      }

      // Generate JWT token
      const token = fastify.jwt.sign({
        id: user.id,
        email: user.email,
        role: user.role
      });

      reply.send({
        message: 'Login successful',
        user: {
          id: user.id,
          email: user.email,
          firstName: user.first_name,
          lastName: user.last_name,
          phone: user.phone,
          role: user.role,
          isKycVerified: user.is_kyc_verified
        },
        token
      });

    } catch (error) {
      fastify.log.error(error);
      reply.status(500).send({ error: 'Internal server error' });
    }
  });

  // Send verification OTP - FOR BOTH NEW AND EXISTING USERS
  fastify.post('/send-verification', {
    schema: {
      body: {
        type: 'object',
        required: ['email'],
        properties: {
          email: { type: 'string', format: 'email' }
        }
      }
    }
  }, async (request, reply) => {
    const { email } = request.body;
    
    console.log('\n📨 ===== /send-verification REQUEST =====');
    console.log('📧 Email received:', email);

    try {
      // Check if user exists AND is already verified
      const user = await db.get('SELECT id, is_email_verified FROM users WHERE email = $1', [email]);
      
      // If user exists AND email is already verified
      if (user && user.is_email_verified) {
        console.log('⚠️ User already verified:', email);
        return reply.status(400).send({ 
          error: 'Email already verified. Please login instead.' 
        });
      }

      // Generate and send OTP
      const { OTPService } = await import('../services/otpService.js');
      const { EmailService } = await import('../services/emailService.js');
      
      console.log('🔢 Generating OTP...');
      const otp = await OTPService.generateOTP(email, 'email_verification');
      console.log('✅ OTP generated:', otp);
      
      // Send OTP via email
      console.log('📤 Calling EmailService.sendOTPEmail...');
      const emailSent = await EmailService.sendOTPEmail(email, otp);
      
      console.log('📧 Email sent result:', emailSent);
      
      if (emailSent) {
        console.log('✅ OTP email sent successfully');
        return { 
          success: true, 
          message: 'Verification OTP sent to your email',
          email: email,
          otp: otp // TEMPORARY: Include OTP in response for debugging
        };
      } else {
        console.log('❌ Email sending failed');
        return reply.status(500).send({ 
          error: 'Failed to send OTP email. Please try again.',
          debug: { otp: otp } // Include OTP for testing
        });
      }

    } catch (error) {
      console.error('❌ Error in /send-verification:', error);
      fastify.log.error(error);
      reply.status(500).send({ error: 'Internal server error' });
    }
  });

  // Verify email with OTP
  fastify.post('/verify-email', {
    schema: {
      body: {
        type: 'object',
        required: ['email', 'otp'],
        properties: {
          email: { type: 'string', format: 'email' },
          otp: { type: 'string', minLength: 6, maxLength: 6 }
        }
      }
    }
  }, async (request, reply) => {
    const { email, otp } = request.body;

    try {
      const { OTPService } = await import('../services/otpService.js');
      
      // Verify OTP
      const isValid = await OTPService.verifyOTP(email, otp, 'email_verification');
      
      if (!isValid) {
        return reply.status(400).send({ 
          error: 'Invalid or expired OTP. Please request a new one.' 
        });
      }

      // If user exists in DB, mark their email as verified
      const user = await db.get('SELECT id FROM users WHERE email = $1', [email]);
      if (user) {
        await db.run('UPDATE users SET is_email_verified = TRUE WHERE email = $1', [email]);
      }
      
      // Mark OTP as used
      await OTPService.markOTPAsUsed(email, otp, 'email_verification');

      return { 
        success: true, 
        message: 'Email verified successfully',
        email: email,
        verified: true
      };

    } catch (error) {
      fastify.log.error(error);
      reply.status(500).send({ error: 'Internal server error' });
    }
  });

  // Google OAuth Routes
  fastify.get('/google', async (request, reply) => {
    try {
      const { GoogleAuthService } = await import('../services/googleAuthService.js');
      const authUrl = GoogleAuthService.generateAuthUrl();
      
      reply.redirect(authUrl);
    } catch (error) {
      fastify.log.error(error);
      reply.status(500).send({ error: 'OAuth configuration error' });
    }
  });

  fastify.get('/google/callback', async (request, reply) => {
    const { code } = request.query;
    
    if (!code) {
      return reply.status(400).send({ error: 'Authorization code missing' });
    }

    try {
      const { GoogleAuthService } = await import('../services/googleAuthService.js');
      const result = await GoogleAuthService.verifyCode(code);

      if (!result.success) {
        return reply.status(401).send({ error: result.error });
      }

      const { user: googleUser } = result;

      // Check if user exists with this Google ID
      let user = await db.get(
        'SELECT * FROM users WHERE google_id = $1', 
        [googleUser.googleId]
      );

      // If not, check if user exists with same email
      if (!user) {
        user = await db.get(
          'SELECT * FROM users WHERE email = $1', 
          [googleUser.email]
        );

        // Create new user if doesn't exist
        if (!user) {
          const userId = randomUUID();
          
          await db.run(`
            INSERT INTO users (id, email, first_name, last_name, google_id, is_email_verified, role) 
            VALUES ($1, $2, $3, $4, $5, $6, $7)
          `, [
            userId, 
            googleUser.email, 
            googleUser.firstName, 
            googleUser.lastName, 
            googleUser.googleId,
            googleUser.emailVerified,
            'user'
          ]);

          // Create wallet for user
          await db.run(`
            INSERT INTO wallet (id, user_id) VALUES ($1, $2)
          `, [randomUUID(), userId]);

          // Get created user
          user = await db.get(`
            SELECT id, email, first_name, last_name, phone, role, is_email_verified 
            FROM users WHERE id = $1
          `, [userId]);
        } else {
          // Update existing user with Google ID
          await db.run(
            'UPDATE users SET google_id = $1 WHERE id = $2',
            [googleUser.googleId, user.id]
          );
        }
      }

      // Generate JWT token
      const token = fastify.jwt.sign({
        id: user.id,
        email: user.email,
        role: user.role
      });

      // Redirect to frontend with token
      reply.redirect(`http://localhost:5173/auth/success?token=${token}&userId=${user.id}`);

    } catch (error) {
      fastify.log.error(error);
      reply.status(500).send({ error: 'OAuth authentication failed' });
    }
  });

  // Check OAuth status
  fastify.get('/status', {
    preHandler: [fastify.authenticate]
  }, async (request, reply) => {
    try {
      const user = await db.get(
        'SELECT id, email, google_id, is_email_verified FROM users WHERE id = $1',
        [request.user.id]
      );
      
      return {
        hasGoogleOAuth: !!user.google_id,
        isEmailVerified: user.is_email_verified,
        email: user.email
      };
    } catch (error) {
      fastify.log.error(error);
      reply.status(500).send({ error: 'Internal server error' });
    }
  });

  // Unlink Google OAuth
  fastify.post('/google/unlink', {
    preHandler: [fastify.authenticate]
  }, async (request, reply) => {
    try {
      const user = await db.get(
        'SELECT id, password FROM users WHERE id = $1',
        [request.user.id]
      );

      // Check if user has password (so they can still login)
      if (!user.password) {
        return reply.status(400).send({ 
          error: 'Set a password first before unlinking Google' 
        });
      }

      await db.run(
        'UPDATE users SET google_id = NULL WHERE id = $1',
        [request.user.id]
      );

      return { success: true, message: 'Google account unlinked successfully' };
    } catch (error) {
      fastify.log.error(error);
      reply.status(500).send({ error: 'Internal server error' });
    }
  });

  // Forgot Password - Send OTP
  fastify.post('/forgot-password', {
    schema: {
      body: {
        type: 'object',
        required: ['email'],
        properties: {
          email: { type: 'string', format: 'email' }
        }
      }
    }
  }, async (request, reply) => {
    const { email } = request.body;

    try {
      // Check if user exists
      const user = await db.get('SELECT id FROM users WHERE email = $1', [email]);
      if (!user) {
        // Don't reveal if user exists for security
        return { success: true, message: 'If email exists, password reset OTP sent' };
      }

      // Generate and send OTP
      const { OTPService } = await import('../services/otpService.js');
      const { EmailService } = await import('../services/emailService.js');
      
      const otp = await OTPService.generateOTP(email, 'password_reset');
      
      // Send OTP via email
      const emailSent = await EmailService.sendPasswordResetEmail(email, otp);
      
      if (emailSent) {
        return { success: true, message: 'If email exists, password reset OTP sent' };
      } else {
        return reply.status(500).send({ error: 'Failed to send OTP email' });
      }

    } catch (error) {
      fastify.log.error(error);
      reply.status(500).send({ error: 'Internal server error' });
    }
  });

  // Verify OTP and Reset Password
  fastify.post('/reset-password', {
    schema: {
      body: {
        type: 'object',
        required: ['email', 'otp', 'newPassword'],
        properties: {
          email: { type: 'string', format: 'email' },
          otp: { type: 'string', minLength: 6, maxLength: 6 },
          newPassword: { type: 'string', minLength: 6 }
        }
      }
    }
  }, async (request, reply) => {
    const { email, otp, newPassword } = request.body;

    try {
      const { OTPService } = await import('../services/otpService.js');
      
      // Verify OTP
      const isValid = await OTPService.verifyOTP(email, otp, 'password_reset');
      
      if (!isValid) {
        return reply.status(400).send({ error: 'Invalid or expired OTP' });
      }

      // Hash new password
      const saltRounds = 12;
      const passwordHash = await bcrypt.hash(newPassword, saltRounds);

      // Update password
      await db.run(
        'UPDATE users SET password = $1 WHERE email = $2',
        [passwordHash, email]
      );

      // Mark OTP as used
      await OTPService.markOTPAsUsed(email, otp, 'password_reset');

      return { success: true, message: 'Password reset successfully' };

    } catch (error) {
      fastify.log.error(error);
      reply.status(500).send({ error: 'Internal server error' });
    }
  });
  // Get current user (for Google auth success)
fastify.get('/user', {
  preHandler: [fastify.authenticate]
}, async (request, reply) => {
  try {
    const user = await db.get(`
      SELECT id, email, first_name, last_name, phone, role, is_email_verified 
      FROM users WHERE id = $1
    `, [request.user.id]);

    if (!user) {
      return reply.status(404).send({ error: 'User not found' });
    }

    return {
      id: user.id,
      email: user.email,
      firstName: user.first_name,
      lastName: user.last_name,
      phone: user.phone,
      role: user.role,
      isEmailVerified: user.is_email_verified
    };
  } catch (error) {
    fastify.log.error(error);
    reply.status(500).send({ error: 'Internal server error' });
  }
});

  console.log('✅ authRoutes setup complete');
}