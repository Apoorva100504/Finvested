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
      // Check if user already exists
      const userExists = db.prepare('SELECT id FROM users WHERE email = ?').get(email);

      if (userExists) {
        return reply.status(400).send({
          error: 'User already exists with this email'
        });
      }

      // Hash password
      const saltRounds = 12;
      const passwordHash = await bcrypt.hash(password, saltRounds);

      const userId = randomUUID();

      // Create user
      const insertUser = db.prepare(`
        INSERT INTO users (id, email, password_hash, first_name, last_name, phone) 
        VALUES (?, ?, ?, ?, ?, ?)
      `);
      
      insertUser.run(userId, email, passwordHash, firstName, lastName, phone);

      // Create wallet for user
      const insertWallet = db.prepare(`
        INSERT INTO wallets (id, user_id) VALUES (?, ?)
      `);
      insertWallet.run(randomUUID(), userId);

      // Get created user
      const user = db.prepare(`
        SELECT id, email, first_name, last_name, phone, role, created_at 
        FROM users WHERE id = ?
      `).get(userId);
      
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
      // Find user
      const user = db.prepare(`
        SELECT id, email, password_hash, first_name, last_name, phone, role, is_kyc_verified 
        FROM users WHERE email = ?
      `).get(email);

      if (!user) {
        return reply.status(401).send({ error: 'Invalid credentials' });
      }

      // Verify password
      const isValidPassword = await bcrypt.compare(password, user.password_hash);
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
}