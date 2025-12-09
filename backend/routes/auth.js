// routes/auth.js
import { db } from '../config/database.js';
import bcrypt from 'bcryptjs';
import { randomUUID } from 'crypto';

export default async function authRoutes(fastify, options) {
  // User Registration
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
      // Check if user already exists - POSTGRESQL
      const userExists = await db.get(
        'SELECT id FROM users WHERE email = $1', 
        [email]
      );

      if (userExists) {
        return reply.status(400).send({
          error: 'User already exists with this email'
        });
      }

      // Hash password
      const saltRounds = 12;
      const passwordHash = await bcrypt.hash(password, saltRounds);

      const userId = randomUUID();

      // Create user - POSTGRESQL
      await db.run(`
        INSERT INTO users (id, email, password, first_name, last_name, phone) 
        VALUES ($1, $2, $3, $4, $5, $6)
      `, [userId, email, passwordHash, firstName, lastName, phone]);

      // Create wallet for user - POSTGRESQL
      await db.run(`
        INSERT INTO wallet (id, user_id) VALUES ($1, $2)
      `, [randomUUID(), userId]);

      // Get created user - POSTGRESQL
      const user = await db.get(`
        SELECT id, email, first_name, last_name, phone, role, created_at 
        FROM users WHERE id = $1
      `, [userId]);
      
      // Generate JWT token
      const token = fastify.jwt.sign({
        id: user.id,
        email: user.email,
        role: user.role
      });

      reply.status(201).send({
        message: 'User registered successfully',
        user: {
          id: user.id,
          email: user.email,
          firstName: user.first_name,
          lastName: user.last_name,
          phone: user.phone,
          role: user.role
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
      // Find user - POSTGRESQL
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
  // Send verification OTP
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

  try {
    // Check if user exists
    const user = await db.get('SELECT id, is_email_verified FROM users WHERE email = $1', [email]);
    if (!user) {
      return reply.status(404).send({ error: 'User not found' });
    }

    if (user.is_email_verified) {
      return reply.status(400).send({ error: 'Email already verified' });
    }

    // Generate and send OTP
    const { OTPService } = await import('../services/otpService.js');
    const { EmailService } = await import('../services/emailService.js');
    
    const otp = await OTPService.generateOTP(email, 'email_verification');
    
    // Send OTP via email
    const emailSent = await EmailService.sendOTPEmail(email, otp);
    
    if (emailSent) {
      return { success: true, message: 'Verification OTP sent to your email' };
    } else {
      return reply.status(500).send({ error: 'Failed to send OTP email' });
    }

  } catch (error) {
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
      return reply.status(400).send({ error: 'Invalid or expired OTP' });
    }

    // Mark email as verified
    await db.run('UPDATE users SET is_email_verified = TRUE WHERE email = $1', [email]);
    
    return { success: true, message: 'Email verified successfully' };

  } catch (error) {
    fastify.log.error(error);
    reply.status(500).send({ error: 'Internal server error' });
  }
});
// Google OAuth Routes
fastify.get('/auth/google', async (request, reply) => {
  try {
    const { GoogleAuthService } = await import('../services/googleAuthService.js');
    const authUrl = GoogleAuthService.generateAuthUrl();
    
    reply.redirect(authUrl);
  } catch (error) {
    fastify.log.error(error);
    reply.status(500).send({ error: 'OAuth configuration error' });
  }
});

fastify.get('/auth/google/callback', async (request, reply) => {
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
    reply.redirect(`http://localhost:3001/auth/success?token=${token}&userId=${user.id}`);

  } catch (error) {
    fastify.log.error(error);
    reply.status(500).send({ error: 'OAuth authentication failed' });
  }
});
// Check OAuth status
fastify.get('/auth/status', {
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
fastify.post('/auth/google/unlink', {
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
}