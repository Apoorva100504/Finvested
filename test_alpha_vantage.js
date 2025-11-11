// test_alpha_vantage.js
import { marketDataService } from './services/marketDataService.js';

async function testAlphaVantage() {
  console.log('🧪 Testing Alpha Vantage with REAL API key...\n');
  
  try {
    // Test with Indian stocks
    const stocks = ['RELIANCE.BSE', 'TCS.BSE', 'INFY.BSE', 'HDFCBANK.BSE'];
    
    for (const symbol of stocks) {
      console.log(`📈 Fetching ${symbol}...`);
      const priceData = await marketDataService.getRealTimePrice(symbol);
      
      if (priceData.source === 'Alpha Vantage') {
        console.log(`✅ REAL DATA: ${symbol} - ₹${priceData.price} (${priceData.change}%)`);
      } else if (priceData.source === 'Mock Data') {
        console.log(`❌ STILL MOCK: ${symbol} - ₹${priceData.price}`);
        console.log('   API key might be invalid or rate limited');
      } else {
        console.log(`⚠️  ${symbol}: ${priceData.source} - ₹${priceData.price}`);
      }
      
      // Wait 1 second between requests to respect API limits
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

testAlphaVantage();
