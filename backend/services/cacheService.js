// services/cacheService.js
class CacheService {
  constructor() {
    this.cache = new Map();
    this.defaultTTL = 300000; // 5 minutes
  }

  set(key, value, ttl = this.defaultTTL) {
    const expires = Date.now() + ttl;
    this.cache.set(key, { value, expires });
    return true;
  }

  get(key) {
    const item = this.cache.get(key);
    if (!item) return null;

    if (Date.now() > item.expires) {
      this.cache.delete(key);
      return null;
    }

    return item.value;
  }

  delete(key) {
    return this.cache.delete(key);
  }

  clear() {
    this.cache.clear();
  }

  // Stock price cache
  cacheStockPrices(stocks) {
    stocks.forEach(stock => {
      this.set(`stock:${stock.symbol}`, stock, 10000); // 10 seconds for prices
    });
  }

  getStockPrice(symbol) {
    return this.get(`stock:${symbol}`);
  }

  // Portfolio cache
  cacheUserPortfolio(userId, portfolio) {
    this.set(`portfolio:${userId}`, portfolio, 30000); // 30 seconds
  }

  getUserPortfolio(userId) {
    return this.get(`portfolio:${userId}`);
  }

  // Order book cache
  cacheOrderBook(symbol, orderBook) {
    this.set(`orderbook:${symbol}`, orderBook, 15000); // 15 seconds
  }

  getOrderBook(symbol) {
    return this.get(`orderbook:${symbol}`);
  }

  // Invalidate cache on data changes
  invalidateUserData(userId) {
    this.delete(`portfolio:${userId}`);
  }

  // Stats
  getStats() {
    return {
      size: this.cache.size,
      keys: Array.from(this.cache.keys())
    };
  }
}

const cacheService = new CacheService();
export { cacheService };