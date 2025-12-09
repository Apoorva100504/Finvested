import axios from 'axios';

class EnhancedMarketDataService {
  constructor() {
    this.marketStackApiKey = process.env.MARKETSTACK_API_KEY;
    this.alphaVantageApiKey = process.env.ALPHA_VANTAGE_API_KEY;
    console.log('🔧 MarketStack API Key:', this.marketStackApiKey ? '✅ Present' : '❌ Missing');
  }

  async getRealTimePrices(symbols) {
    try {
      console.log('📊 Getting real-time prices for:', symbols);
      
      // Try MarketStack first if we have a real key
      if (this.marketStackApiKey && this.marketStackApiKey !== 'PUT_YOUR_MARKETSTACK_KEY_HERE') {
        console.log('🔄 Trying MarketStack API...');
        try {
          // MarketStack requires symbols with exchange (e.g., RELIANCE.BSE)
          const symbolsWithExchange = symbols.map(sym => `${sym}.BSE`).join(',');
          const response = await axios.get(
            `https://api.marketstack.com/v1/eod/latest?access_key=${this.marketStackApiKey}&symbols=${symbolsWithExchange}`
          );
          console.log('✅ MarketStack response received');
          return this.formatMarketStackData(response.data);
        } catch (marketStackError) {
          console.error('❌ MarketStack failed:', marketStackError.message);
          // Continue to fallback
        }
      }
      
      console.log('🔄 Falling back to Alpha Vantage...');
      // Fallback to Alpha Vantage
      const alphaVantageData = await this.getAlphaVantageData(symbols);
      if (Object.keys(alphaVantageData).length > 0) {
        return alphaVantageData;
      }
      
      console.log('🔄 Falling back to mock data...');
      // Final fallback to mock data
      return this.getMockData(symbols);
      
    } catch (error) {
      console.error('❌ Market data error:', error.message);
      return this.getMockData(symbols);
    }
  }

  formatMarketStackData(data) {
    if (!data.data || !Array.isArray(data.data)) {
      console.log('❌ MarketStack data format issue, using mock data');
      return this.getMockData([]);
    }
    
    const formattedData = {};
    data.data.forEach(stock => {
      if (stock && stock.symbol) {
        // Remove exchange suffix (e.g., "RELIANCE.BSE" -> "RELIANCE")
        const cleanSymbol = stock.symbol.split('.')[0];
        formattedData[cleanSymbol] = {
          symbol: cleanSymbol,
          price: stock.close || 0,
          change: stock.close - stock.open || 0,
          changePercent: stock.close && stock.open ? ((stock.close - stock.open) / stock.open * 100).toFixed(2) : "0.00",
          volume: stock.volume || 0,
          dataSource: 'MarketStack'
        };
      }
    });
    
    console.log('📊 Formatted MarketStack data:', Object.keys(formattedData));
    return formattedData;
  }

  async getAlphaVantageData(symbols) {
    console.log('🔄 Trying Alpha Vantage...');
    const prices = {};
    
    for (const symbol of symbols) {
      try {
        const response = await axios.get(
          `https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${symbol}.BSE&apikey=${this.alphaVantageApiKey}`
        );
        
        const quote = response.data['Global Quote'];
        if (quote && quote['05. price']) {
          prices[symbol] = {
            price: parseFloat(quote['05. price']),
            change: parseFloat(quote['09. change']),
            changePercent: parseFloat(quote['10. change percent'].replace('%', '')),
            volume: parseInt(quote['06. volume']),
            dataSource: 'Alpha Vantage'
          };
          console.log(`✅ Alpha Vantage data for ${symbol}: ${quote['05. price']}`);
        }
      } catch (error) {
        console.error(`❌ Alpha Vantage error for ${symbol}:`, error.message);
      }
    }
    
    return prices;
  }

  getMockData(symbols) {
    console.log('🔄 Generating mock data...');
    const mockData = {};
    symbols.forEach(symbol => {
      const basePrice = 1000 + Math.random() * 5000;
      const change = (Math.random() - 0.5) * 100;
      mockData[symbol] = {
        price: Math.round(basePrice * 100) / 100,
        change: Math.round(change * 100) / 100,
        changePercent: (change / basePrice * 100).toFixed(2),
        volume: Math.floor(Math.random() * 1000000),
        dataSource: 'Mock Data'
      };
    });
    return mockData;
  }
}

const enhancedMarketDataService = new EnhancedMarketDataService();
export { enhancedMarketDataService };
