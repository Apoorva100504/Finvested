// setup.js
import { db } from './config/database.js';
import { randomUUID } from 'crypto';

function setupDatabase() {
  try {
    console.log('Setting up Finvested database with sample data...');

    // Insert sample stocks
    const sampleStocks = [
      [randomUUID(), 'RELIANCE', 'Reliance Industries Ltd', 'Energy', 2456.75, 2480.50, 2445.25],
      [randomUUID(), 'TCS', 'Tata Consultancy Services Ltd', 'IT', 3315.20, 3340.00, 3290.50],
      [randomUUID(), 'INFY', 'Infosys Ltd', 'IT', 1520.45, 1540.00, 1505.75],
      [randomUUID(), 'HDFCBANK', 'HDFC Bank Ltd', 'Banking', 1445.60, 1460.25, 1432.80],
      [randomUUID(), 'ICICIBANK', 'ICICI Bank Ltd', 'Banking', 920.35, 928.40, 915.20],
      [randomUUID(), 'SBIN', 'State Bank of India', 'Banking', 565.80, 572.45, 562.30],
      [randomUUID(), 'BHARTIARTL', 'Bharti Airtel Ltd', 'Telecom', 815.25, 822.60, 808.90],
      [randomUUID(), 'LT', 'Larsen & Toubro Ltd', 'Construction', 3125.40, 3150.75, 3102.35],
      [randomUUID(), 'HINDUNILVR', 'Hindustan Unilever Ltd', 'FMCG', 2450.85, 2475.60, 2435.20],
      [randomUUID(), 'ITC', 'ITC Ltd', 'FMCG', 415.65, 420.30, 412.45]
    ];

    const insertStock = db.prepare(`
      INSERT OR IGNORE INTO stocks (id, symbol, company_name, sector, current_price, day_high, day_low, volume) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `);

    sampleStocks.forEach(stock => {
      insertStock.run([...stock, Math.floor(Math.random() * 1000000) + 100000]);
    });

    console.log('✅ Sample stocks inserted successfully');
    console.log('🎉 Database setup completed!');
    console.log('📊 Database file: finvested.db');
    
  } catch (error) {
    console.error('❌ Database setup failed:', error);
  }
}

setupDatabase();