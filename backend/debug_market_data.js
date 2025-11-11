// debug_market_data.js
import { marketDataService } from './services/marketDataService.js';

async function debugMarketData() {
  console.log('🔍 Debugging Market Data Service...\n');
  
  console.log('1. Checking environment variable:');
  console.log('   ALPHA_VANTAGE_API_KEY:', process.env.ALPHA_VANTAGE_API_KEY ? '✅ Set' : '❌ Not set');
  
  console.log('2. Testing direct API call...');
  try {
    const symbol = 'RELIANCE.BSE';
    console.log(`   Testing with symbol: ${symbol}`);
    
    const priceData = await marketDataService.getRealTimePrice(symbol);
    console.log('   Result:', priceData);
    
  } catch (error) {
    console.log('   Error:', error.message);
  }
}

debugMarketData();
