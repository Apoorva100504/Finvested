// services/stockApi.js
import api from './api'; // Your existing axios instance

export const stockApi = {
  // Get all stocks with pagination
  getStocks: async (params = {}) => {
    try {
      const response = await api.get('/stocks', { params });
      return response.data;
    } catch (error) {
      console.error('Error fetching stocks:', error);
      throw error;
    }
  },

  // Get single stock details
  getStockDetails: async (symbol) => {
    try {
      const response = await api.get(`/stocks/${symbol}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching stock ${symbol}:`, error);
      throw error;
    }
  },

  // Get stock history
  getStockHistory: async (symbol, period = '1d') => {
    try {
      const response = await api.get(`/stocks/${symbol}/history`, {
        params: { period }
      });
      return response.data;
    } catch (error) {
      console.error(`Error fetching history for ${symbol}:`, error);
      throw error;
    }
  },

  // Get user watchlist
  getWatchlist: async () => {
    try {
      const response = await api.get('/watchlist');
      return response.data;
    } catch (error) {
      console.error('Error fetching watchlist:', error);
      throw error;
    }
  },

  // Add to watchlist
  addToWatchlist: async (symbol) => {
    try {
      const response = await api.post('/watchlist/add', { symbol });
      return response.data;
    } catch (error) {
      console.error('Error adding to watchlist:', error);
      throw error;
    }
  },

  // Remove from watchlist
  removeFromWatchlist: async (id) => {
    try {
      const response = await api.delete(`/watchlist/remove/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error removing from watchlist:', error);
      throw error;
    }
  },

  // Place order
  placeOrder: async (orderData) => {
    try {
      const response = await api.post('/orders/place', orderData);
      return response.data;
    } catch (error) {
      console.error('Error placing order:', error);
      throw error;
    }
  },

  // Get user orders
  getUserOrders: async () => {
    try {
      const response = await api.get('/orders');
      return response.data;
    } catch (error) {
      console.error('Error fetching orders:', error);
      throw error;
    }
  },

  // Get portfolio analytics
  getPortfolioAnalytics: async () => {
    try {
      const response = await api.get('/analytics/portfolio');
      return response.data;
    } catch (error) {
      console.error('Error fetching portfolio analytics:', error);
      throw error;
    }
  },

  // Get market data test
  testMarketData: async () => {
    try {
      const response = await api.get('/test-market-data');
      return response.data;
    } catch (error) {
      console.error('Error testing market data:', error);
      throw error;
    }
  }
};