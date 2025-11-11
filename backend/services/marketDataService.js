// services/marketDataService.js
import axios from 'axios';

class MarketDataService {
  constructor() {
    this.alphaVantageKey = process.env.ALPHA_VANTAGE_API_KEY || 'demo';
    this.marketStackKey = process.env.MARKETSTACK_API_KEY;
  }

  async getRealTimePrice(symbol) {
    try {
      // For demo purposes, return mock data if no API key
      if (!this.alphaVantageKey || this.alphaVantageKey === 'demo') {
        return this.getMockPrice(symbol);
      }

      const response = await axios.get(
        'https://www.alphavantage.co/query',
        {
          params: {
            function: 'GLOBAL_QUOTE',
            symbol: symbol,
            apikey: this.alphaVantageKey
          },
          timeout: 5000
        }
      );

      if (response.data['Global Quote']) {
        const quote = response.data['Global Quote'];
        return {
          symbol: symbol,
          price: parseFloat(quote['05. price']),
          change: parseFloat(quote['09. change']),
          changePercent: parseFloat(quote['10. change percent'].replace('%', '')),
          volume: parseInt(quote['06. volume']),
          timestamp: new Date().toISOString(),
          source: 'Alpha Vantage'
        };
      }

      return this.getMockPrice(symbol);

    } catch (error) {
      console.error(`Market data API error for ${symbol}:`, error.message);
      return this.getMockPrice(symbol);
    }
  }

  getMockPrice(symbol) {
    const basePrice = 100 + (Math.random() * 5000);
    const changePercent = (Math.random() - 0.5) * 10;
    const change = (basePrice * changePercent) / 100;
    
    return {
      symbol: symbol,
      price: parseFloat((basePrice + change).toFixed(2)),
      change: parseFloat(change.toFixed(2)),
      changePercent: parseFloat(changePercent.toFixed(2)),
      volume: Math.floor(Math.random() * 1000000) + 100000,
      timestamp: new Date().toISOString(),
      source: 'Mock Data'
    };
  }

  async getBulkPrices(symbols) {
    const prices = [];
    for (const symbol of symbols) {
      try {
        const price = await this.getRealTimePrice(symbol);
        if (price) {
          prices.push(price);
        }
        // Small delay to respect API rate limits
        await new Promise(resolve => setTimeout(resolve, 500));
      } catch (error) {
        console.error(`Error fetching price for ${symbol}:`, error);
      }
    }
    return prices;
  }
}

export const marketDataService = new MarketDataService();