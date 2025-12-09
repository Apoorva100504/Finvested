// config/database.js - UPDATED WITH CONNECTION STRING
import pg from 'pg';
const { Pool } = pg;

// Use connection string for reliable authentication
const connectionString = process.env.DATABASE_URL || 'postgresql://postgres:root@localhost/finvested';
const pool = new Pool({
  connectionString: connectionString
});

// Database methods for PostgreSQL
const db = {
  // Query method
  query: async (sql, params = []) => {
    try {
      const result = await pool.query(sql, params);
      return { rows: result.rows, rowCount: result.rowCount };
    } catch (error) {
      console.error('PostgreSQL Query Error:', error);
      throw error;
    }
  },

  // Get single row
  get: async (sql, params = []) => {
    try {
      const result = await pool.query(sql, params);
      return result.rows[0] || null;
    } catch (error) {
      console.error('PostgreSQL Get Error:', error);
      throw error;
    }
  },

  // Execute (for INSERT, UPDATE, DELETE)
  run: async (sql, params = []) => {
    try {
      const result = await pool.query(sql, params);
      return { lastID: result.rows[0]?.id, changes: result.rowCount };
    } catch (error) {
      console.error('PostgreSQL Run Error:', error);
      throw error;
    }
  }
};

async function initializeDatabase() {
  console.log('🔄 Initializing PostgreSQL database with complete schema...');
  
  try {
    // Users Table (keep 'password' not 'password_hash')
    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        email VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        first_name VARCHAR(100) NOT NULL,
        last_name VARCHAR(100) NOT NULL,
        phone VARCHAR(20),
        role VARCHAR(20) DEFAULT 'user' CHECK (role IN ('user', 'admin')),
        is_kyc_verified BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Wallet Table (keep 'wallet' not 'wallets')
    await pool.query(`
      CREATE TABLE IF NOT EXISTS wallet (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id UUID REFERENCES users(id) ON DELETE CASCADE UNIQUE,
        balance DECIMAL(15,2) DEFAULT 0.00,
        locked_balance DECIMAL(15,2) DEFAULT 0.00,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Stocks Table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS stocks (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        symbol VARCHAR(20) UNIQUE NOT NULL,
        company_name VARCHAR(255) NOT NULL,
        sector VARCHAR(100),
        exchange VARCHAR(10) DEFAULT 'NSE',
        current_price DECIMAL(10,2) DEFAULT 0.00,
        day_high DECIMAL(10,2),
        day_low DECIMAL(10,2),
        volume BIGINT DEFAULT 0,
        is_active BOOLEAN DEFAULT TRUE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
          // Orders Table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS orders (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id UUID REFERENCES users(id) ON DELETE CASCADE,
        stock_id UUID REFERENCES stocks(id) ON DELETE CASCADE,
        order_type VARCHAR(10) CHECK (order_type IN ('buy', 'sell')),
        order_category VARCHAR(10) CHECK (order_category IN ('market', 'limit')),
        quantity INTEGER NOT NULL CHECK (quantity > 0),
        price DECIMAL(10,2),
        status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'executed', 'partial', 'cancelled', 'failed')),
        executed_quantity INTEGER DEFAULT 0,
        average_price DECIMAL(10,2),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Portfolio Table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS portfolio (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id UUID REFERENCES users(id) ON DELETE CASCADE,
        stock_id UUID REFERENCES stocks(id) ON DELETE CASCADE,
        quantity INTEGER DEFAULT 0 CHECK (quantity >= 0),
        average_buy_price DECIMAL(10,2) DEFAULT 0.00,
        invested_amount DECIMAL(15,2) DEFAULT 0.00,
        current_value DECIMAL(15,2) DEFAULT 0.00,
        unrealized_pnl DECIMAL(15,2) DEFAULT 0.00,
        last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(user_id, stock_id)
      )
    `);

    // Watchlists Table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS watchlists (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id UUID REFERENCES users(id) ON DELETE CASCADE,
        stock_id UUID REFERENCES stocks(id) ON DELETE CASCADE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(user_id, stock_id)
      )
    `);

    // Transactions Table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS transactions (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id UUID REFERENCES users(id) ON DELETE CASCADE,
        type VARCHAR(20) CHECK (type IN ('deposit', 'withdrawal', 'trade')),
        amount DECIMAL(15,2) NOT NULL,
        status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'failed')),
        reference_id VARCHAR(255),
        description TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Create indexes for performance
    await pool.query('CREATE INDEX IF NOT EXISTS idx_orders_user_id ON orders(user_id)');
    await pool.query('CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status)');
    await pool.query('CREATE INDEX IF NOT EXISTS idx_portfolio_user_id ON portfolio(user_id)');
    // Add sample stocks
    await pool.query(`
      INSERT INTO stocks (symbol, company_name, sector, exchange, current_price, day_high, day_low, volume) VALUES
      ('RELIANCE', 'Reliance Industries Ltd', 'Energy', 'NSE', 2500.00, 2550.00, 2450.00, 1000000),
      ('TCS', 'Tata Consultancy Services Ltd', 'IT', 'NSE', 3200.00, 3250.00, 3150.00, 500000),
      ('INFY', 'Infosys Ltd', 'IT', 'NSE', 1500.00, 1550.00, 1450.00, 750000),
      ('HDFCBANK', 'HDFC Bank Ltd', 'Banking', 'NSE', 1600.00, 1650.00, 1550.00, 800000)
      ON CONFLICT (symbol) DO NOTHING
    `);

    console.log('✅ Complete database schema created successfully');
  } catch (error) {
    console.error('❌ Database initialization error:', error);
  }
}
// Test connection
pool.on('connect', () => {
  console.log('✅ Connected to PostgreSQL database');
});

pool.on('error', (err) => {
  console.error('❌ PostgreSQL connection error:', err);
});

export { db, initializeDatabase, pool };