// database/optimization.js
import { db } from '../config/database.js';

export function optimizeDatabase() {
  console.log('Optimizing database performance...');
  
  // Create indexes for frequently queried columns
  const indexes = [
    // Orders table indexes
    'CREATE INDEX IF NOT EXISTS idx_orders_user_status ON orders(user_id, status)',
    'CREATE INDEX IF NOT EXISTS idx_orders_stock_status ON orders(stock_id, status)',
    'CREATE INDEX IF NOT EXISTS idx_orders_created_at ON orders(created_at DESC)',
    
    // Portfolio table indexes
    'CREATE INDEX IF NOT EXISTS idx_portfolio_user_stock ON portfolio(user_id, stock_id)',
    'CREATE INDEX IF NOT EXISTS idx_portfolio_user ON portfolio(user_id)',
    
    // Trades table indexes
    'CREATE INDEX IF NOT EXISTS idx_trades_stock_time ON trades(stock_id, traded_at DESC)',
    'CREATE INDEX IF NOT EXISTS idx_trades_time ON trades(traded_at DESC)',
    
    // Stocks table indexes
    'CREATE INDEX IF NOT EXISTS idx_stocks_symbol ON stocks(symbol)',
    'CREATE INDEX IF NOT EXISTS idx_stocks_sector ON stocks(sector)',
    'CREATE INDEX IF NOT EXISTS idx_stocks_active ON stocks(is_active)',
    
    // Transactions table indexes
    'CREATE INDEX IF NOT EXISTS idx_transactions_user_time ON transactions(user_id, created_at DESC)',
    
    // Price alerts indexes
    'CREATE INDEX IF NOT EXISTS idx_alerts_user ON price_alerts(user_id)',
    'CREATE INDEX IF NOT EXISTS idx_alerts_stock ON price_alerts(stock_id)',
    
    // Watchlist indexes
    'CREATE INDEX IF NOT EXISTS idx_watchlist_user ON watchlists(user_id)'
  ];

  indexes.forEach(indexSQL => {
    try {
      db.exec(indexSQL);
      console.log(`✅ Created index: ${indexSQL.split('IF NOT EXISTS ')[1]}`);
    } catch (error) {
      console.error(`❌ Failed to create index: ${error.message}`);
    }
  });

  console.log('Database optimization completed!');
}

// Run database optimization
optimizeDatabase();