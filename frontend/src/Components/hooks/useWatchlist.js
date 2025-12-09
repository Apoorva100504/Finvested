// hooks/useWatchlist.js - OPTIMIZED VERSION
import { useState, useEffect, useCallback } from 'react';

export const useWatchlist = () => {
  // Use environment variable or fallback to localhost
  const API_BASE = import.meta.env?.REACT_APP_API_URL || 'http://localhost:3000/api';
  
  const [watchlists, setWatchlists] = useState([]);
  const [currentWatchlist, setCurrentWatchlist] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchCache, setSearchCache] = useState(new Map());

  // Helper function to get auth headers
  const getAuthHeaders = useCallback(() => {
    try {
      const token = localStorage.getItem('token') || localStorage.getItem('auth_token') || 'mock-token';
      return {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      };
    } catch {
      return {
        'Content-Type': 'application/json'
      };
    }
  }, []);

  // Handle API errors
  const handleApiError = useCallback((error, defaultMessage = 'An error occurred') => {
    console.error('API Error:', error);
    const message = error.response?.data?.error || error.message || defaultMessage;
    setError(message);
    return { success: false, error: message };
  }, []);

  // Fetch all watchlists with caching
  const fetchWatchlists = useCallback(async (forceRefresh = false) => {
    try {
      setLoading(true);
      setError(null);
      
      // Simple cache key
      const cacheKey = 'watchlists_data';
      
      // Check cache first if not forcing refresh
      if (!forceRefresh) {
        const cached = sessionStorage.getItem(cacheKey);
        if (cached) {
          const parsed = JSON.parse(cached);
          if (Date.now() - parsed.timestamp < 30000) { // 30 second cache
            setWatchlists(parsed.data);
            if (!currentWatchlist && parsed.data.length > 0) {
              setCurrentWatchlist(parsed.data[0]);
            }
            return { success: true, data: { watchlists: parsed.data } };
          }
        }
      }
      
      const response = await fetch(`${API_BASE}/watchlists`, {
        headers: getAuthHeaders(),
        cache: forceRefresh ? 'no-cache' : 'default'
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `HTTP ${response.status}`);
      }
      
      const data = await response.json();
      const fetchedWatchlists = data.watchlists || [];
      
      // Cache the data
      sessionStorage.setItem(cacheKey, JSON.stringify({
        data: fetchedWatchlists,
        timestamp: Date.now()
      }));
      
      setWatchlists(fetchedWatchlists);
      
      // Set current watchlist if not set or if current doesn't exist in fetched
      if (!currentWatchlist || !fetchedWatchlists.find(w => w.id === currentWatchlist.id)) {
        setCurrentWatchlist(fetchedWatchlists[0] || null);
      }
      
      return { success: true, data };
      
    } catch (err) {
      return handleApiError(err, 'Failed to fetch watchlists');
    } finally {
      setLoading(false);
    }
  }, [API_BASE, currentWatchlist, getAuthHeaders, handleApiError]);

  // Create new watchlist
  const createWatchlist = async (name) => {
    try {
      setLoading(true);
      setError(null);
      
      if (!name || name.trim().length === 0) {
        throw new Error('Watchlist name is required');
      }
      
      if (name.length > 18) {
        throw new Error('Watchlist name cannot exceed 18 characters');
      }
      
      const response = await fetch(`${API_BASE}/watchlists`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({ name: name.trim() })
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `Failed to create watchlist`);
      }
      
      const data = await response.json();
      const newWatchlist = data.watchlist;
      
      // Update local state and cache
      setWatchlists(prev => [...prev, newWatchlist]);
      setCurrentWatchlist(newWatchlist);
      
      // Clear cache to force refresh on next fetch
      sessionStorage.removeItem('watchlists_data');
      
      return {
        success: true,
        data,
        message: 'Watchlist created successfully'
      };
      
    } catch (err) {
      return handleApiError(err, 'Failed to create watchlist');
    } finally {
      setLoading(false);
    }
  };

  // Add stock to watchlist
  const addStockToWatchlist = async (stockId, watchlistId = null) => {
    try {
      setLoading(true);
      setError(null);
      
      const targetWatchlistId = watchlistId || currentWatchlist?.id;
      if (!targetWatchlistId) {
        throw new Error('No watchlist selected');
      }
      
      const response = await fetch(`${API_BASE}/watchlists/${targetWatchlistId}/stocks`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({ stockId })
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `Failed to add stock to watchlist`);
      }
      
      const data = await response.json();
      
      // Optimistic update
      setWatchlists(prev => prev.map(wl => {
        if (wl.id === targetWatchlistId) {
          return {
            ...wl,
            stocks: [...(wl.stocks || []), data.item]
          };
        }
        return wl;
      }));
      
      if (currentWatchlist?.id === targetWatchlistId) {
        setCurrentWatchlist(prev => ({
          ...prev,
          stocks: [...(prev.stocks || []), data.item]
        }));
      }
      
      // Clear cache
      sessionStorage.removeItem('watchlists_data');
      setSearchCache(new Map());
      
      return {
        success: true,
        data,
        message: 'Stock added to watchlist'
      };
      
    } catch (err) {
      return handleApiError(err, 'Failed to add stock to watchlist');
    } finally {
      setLoading(false);
    }
  };

  // Remove stock from watchlist
  const removeFromWatchlist = async (watchlistItemId) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch(`${API_BASE}/watchlist-stocks/${watchlistItemId}`, {
        method: 'DELETE',
        headers: getAuthHeaders()
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `Failed to remove stock from watchlist`);
      }
      
      // Find which watchlist contains this item
      const watchlistContainingItem = watchlists.find(wl => 
        wl.stocks?.some(item => item.id === watchlistItemId)
      );
      
      if (watchlistContainingItem) {
        // Optimistic update
        setWatchlists(prev => prev.map(wl => {
          if (wl.id === watchlistContainingItem.id) {
            return {
              ...wl,
              stocks: wl.stocks.filter(item => item.id !== watchlistItemId)
            };
          }
          return wl;
        }));
        
        if (currentWatchlist?.id === watchlistContainingItem.id) {
          setCurrentWatchlist(prev => ({
            ...prev,
            stocks: prev.stocks.filter(item => item.id !== watchlistItemId)
          }));
        }
      }
      
      // Clear cache
      sessionStorage.removeItem('watchlists_data');
      setSearchCache(new Map());
      
      return {
        success: true,
        message: 'Stock removed from watchlist'
      };
      
    } catch (err) {
      return handleApiError(err, 'Failed to remove stock from watchlist');
    } finally {
      setLoading(false);
    }
  };

  // Delete watchlist
  const deleteWatchlist = async (watchlistId) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch(`${API_BASE}/watchlists/${watchlistId}`, {
        method: 'DELETE',
        headers: getAuthHeaders()
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `Failed to delete watchlist`);
      }
      
      // Optimistic update
      const updatedWatchlists = watchlists.filter(wl => wl.id !== watchlistId);
      setWatchlists(updatedWatchlists);
      
      if (currentWatchlist?.id === watchlistId) {
        setCurrentWatchlist(updatedWatchlists[0] || null);
      }
      
      // Clear cache
      sessionStorage.removeItem('watchlists_data');
      
      return {
        success: true,
        message: 'Watchlist deleted successfully'
      };
      
    } catch (err) {
      return handleApiError(err, 'Failed to delete watchlist');
    } finally {
      setLoading(false);
    }
  };

  // Rename watchlist
  const renameWatchlist = async (watchlistId, newName) => {
    try {
      setLoading(true);
      setError(null);
      
      if (!newName || newName.trim().length === 0) {
        throw new Error('Watchlist name is required');
      }
      
      if (newName.length > 18) {
        throw new Error('Watchlist name cannot exceed 18 characters');
      }
      
      const response = await fetch(`${API_BASE}/watchlists/${watchlistId}/rename`, {
        method: 'PATCH',
        headers: getAuthHeaders(),
        body: JSON.stringify({ name: newName.trim() })
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `Failed to rename watchlist`);
      }
      
      // Optimistic update
      setWatchlists(prev => prev.map(wl => {
        if (wl.id === watchlistId) {
          return { ...wl, name: newName.trim() };
        }
        return wl;
      }));
      
      if (currentWatchlist?.id === watchlistId) {
        setCurrentWatchlist(prev => ({ ...prev, name: newName.trim() }));
      }
      
      // Clear cache
      sessionStorage.removeItem('watchlists_data');
      
      return {
        success: true,
        message: 'Watchlist renamed successfully'
      };
      
    } catch (err) {
      return handleApiError(err, 'Failed to rename watchlist');
    } finally {
      setLoading(false);
    }
  };

  // Search stocks with caching and debouncing
  const searchStocks = useCallback(async (query) => {
    try {
      if (!query || query.trim().length < 1) {
        return [];
      }
      
      const trimmedQuery = query.trim().toLowerCase();
      
      // Check cache first
      const cacheKey = `search_${trimmedQuery}`;
      const cached = searchCache.get(cacheKey);
      if (cached && Date.now() - cached.timestamp < 60000) { // 1 minute cache
        return cached.results;
      }
      
      const response = await fetch(`${API_BASE}/stocks/search?q=${encodeURIComponent(trimmedQuery)}&limit=10`, {
        headers: getAuthHeaders()
      });
      
      if (!response.ok) {
        console.warn('Search API error:', response.status);
        return [];
      }
      
      const data = await response.json();
      const results = data.stocks || [];
      
      // Update cache
      setSearchCache(prev => {
        const newCache = new Map(prev);
        newCache.set(cacheKey, {
          results,
          timestamp: Date.now()
        });
        
        // Limit cache size
        if (newCache.size > 50) {
          const firstKey = newCache.keys().next().value;
          newCache.delete(firstKey);
        }
        
        return newCache;
      });
      
      return results;
      
    } catch (err) {
      console.error('Search error:', err);
      return [];
    }
  }, [API_BASE, getAuthHeaders, searchCache]);

  // Clear search cache
  const clearSearchCache = useCallback(() => {
    setSearchCache(new Map());
  }, []);

  // Get stock details
  const getStockDetails = async (stockId) => {
    try {
      const response = await fetch(`${API_BASE}/stocks/${stockId}`, {
        headers: getAuthHeaders()
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `Failed to get stock details`);
      }
      
      const data = await response.json();
      return { success: true, data };
      
    } catch (err) {
      return handleApiError(err, 'Failed to get stock details');
    }
  };

  // Check if stock is in any watchlist
  const isStockInWatchlist = useCallback((stockId) => {
    return watchlists.some(wl => 
      wl.stocks?.some(item => item.stock?.id === stockId)
    );
  }, [watchlists]);

  // Get all stocks from all watchlists
  const getAllStocks = useCallback(() => {
    const allStocks = [];
    watchlists.forEach(watchlist => {
      if (watchlist.stocks) {
        allStocks.push(...watchlist.stocks);
      }
    });
    return allStocks;
  }, [watchlists]);

  // Bulk delete stocks from watchlist
  const bulkDeleteStocks = async (watchlistId, stockIds) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch(`${API_BASE}/watchlists/${watchlistId}/stocks/bulk`, {
        method: 'DELETE',
        headers: getAuthHeaders(),
        body: JSON.stringify({ stockIds })
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `Failed to delete stocks`);
      }
      
      // Refresh data
      await fetchWatchlists(true);
      
      return {
        success: true,
        message: 'Stocks deleted successfully'
      };
      
    } catch (err) {
      return handleApiError(err, 'Failed to delete stocks');
    } finally {
      setLoading(false);
    }
  };

  // Clear error
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  // Clear all cache
  const clearCache = useCallback(() => {
    sessionStorage.removeItem('watchlists_data');
    setSearchCache(new Map());
  }, []);

  // Initialize - fetch watchlists on mount
  useEffect(() => {
    fetchWatchlists();
  }, [fetchWatchlists]);

  // Memoized computed values
  const currentStocks = currentWatchlist?.stocks || [];
  const allStocks = getAllStocks();
  const hasWatchlists = watchlists.length > 0;
  const watchlistCount = watchlists.length;
  const totalStockCount = allStocks.length;

  return {
    // State
    watchlists,
    currentWatchlist,
    loading,
    error,
    
    // Actions
    fetchWatchlists,
    createWatchlist,
    addStockToWatchlist,
    removeFromWatchlist,
    deleteWatchlist,
    renameWatchlist,
    setCurrentWatchlist,
    searchStocks,
    getStockDetails,
    bulkDeleteStocks,
    clearError,
    clearCache,
    clearSearchCache,
    
    // Helper functions
    isStockInWatchlist,
    getAllStocks,
    
    // Convenience
    refresh: () => fetchWatchlists(true),
    hasWatchlists,
    watchlistCount,
    totalStockCount,
    
    // Computed properties (memoized)
    currentStocks,
    allStocks
  };
};