import { useState, useEffect, useCallback, useRef } from "react";

// =========================================================================
// COMPREHENSIVE MOCK DATA FOR ALL SYMBOLS + INDICES
// =========================================================================
const MOCK_STOCK_DATA = {
  // INDICES (For the top bar)
  'NIFTY 50': { 
    symbol: 'NIFTY 50', 
    companyName: 'Nifty 50 Index', 
    lastPrice: 22150.45, 
    change: 45.20, 
    pChange: 0.20, 
    volume: 0, 
    previousClose: 22105.25,
    open: 22110.50,
    dayHigh: 22200.00,
    dayLow: 22050.00,
    marketCap: 0
  },
  'SENSEX': { 
    symbol: 'SENSEX', 
    companyName: 'Sensex Index', 
    lastPrice: 73200.10, 
    change: -120.50, 
    pChange: -0.16, 
    volume: 0, 
    previousClose: 73320.60,
    open: 73300.00,
    dayHigh: 73450.00,
    dayLow: 73100.00,
    marketCap: 0
  },
  'BANKNIFTY': { 
    symbol: 'BANKNIFTY', 
    companyName: 'Bank Nifty Index', 
    lastPrice: 46980.00, 
    change: 100.00, 
    pChange: 0.21, 
    volume: 0, 
    previousClose: 46880.00,
    open: 46900.00,
    dayHigh: 47050.00,
    dayLow: 46800.00,
    marketCap: 0
  },

  // MOST BOUGHT / TOP MOVERS
  'RELIANCE': { 
    symbol: 'RELIANCE', 
    companyName: 'Reliance Industries', 
    lastPrice: 2550.00, 
    change: 47.00, 
    pChange: 1.88, 
    volume: 18500000, 
    marketCap: 17.2e12, 
    previousClose: 2503.00, 
    open: 2510.00, 
    dayHigh: 2560.00, 
    dayLow: 2500.00
  },
  'TCS': { 
    symbol: 'TCS', 
    companyName: 'Tata Consultancy Svc', 
    lastPrice: 3950.00, 
    change: -21.72, 
    pChange: -0.55, 
    volume: 1500000, 
    marketCap: 14.5e12, 
    previousClose: 3971.72, 
    open: 3960.00, 
    dayHigh: 3980.00, 
    dayLow: 3940.00
  },
  'HDFCBANK': { 
    symbol: 'HDFCBANK', 
    companyName: 'HDFC Bank', 
    lastPrice: 1520.10, 
    change: 3.80, 
    pChange: 0.25, 
    volume: 2200000, 
    marketCap: 11.0e12, 
    previousClose: 1516.30, 
    open: 1520.00, 
    dayHigh: 1530.00, 
    dayLow: 1515.00
  },
  'INFY': { 
    symbol: 'INFY', 
    companyName: 'Infosys', 
    lastPrice: 1645.75, 
    change: 25.75, 
    pChange: 1.59, 
    volume: 15000000, 
    marketCap: 6.8e12, 
    previousClose: 1620.00, 
    open: 1625.00, 
    dayHigh: 1650.00, 
    dayLow: 1620.00
  },
  'SBIN': { 
    symbol: 'SBIN', 
    companyName: 'State Bank of India', 
    lastPrice: 720.50, 
    change: 6.45, 
    pChange: 0.90, 
    volume: 9500000, 
    marketCap: 6.4e12, 
    previousClose: 714.05, 
    open: 715.00, 
    dayHigh: 722.00, 
    dayLow: 713.50
  },
  
  // GAINERS (High PChange, Moderate Volume)
  'HIKAL': { 
    symbol: 'HIKAL', 
    companyName: 'Hikal Ltd', 
    lastPrice: 280.50, 
    change: 10.50, 
    pChange: 3.89, 
    volume: 1250000, 
    previousClose: 270.00, 
    open: 271.00, 
    dayHigh: 282.00, 
    dayLow: 270.50,
    marketCap: 2800e6
  },
  'ROUTE': { 
    symbol: 'ROUTE', 
    companyName: 'Route Mobile Ltd', 
    lastPrice: 1650.00, 
    change: 50.00, 
    pChange: 3.13, 
    volume: 5250000, 
    previousClose: 1600.00, 
    open: 1605.00, 
    dayHigh: 1655.00, 
    dayLow: 1600.00,
    marketCap: 42000e6
  },
  'DOMS': { 
    symbol: 'DOMS', 
    companyName: 'DOMS Industries', 
    lastPrice: 1600.00, 
    change: 45.00, 
    pChange: 2.89, 
    volume: 8100000, 
    previousClose: 1555.00, 
    open: 1560.00, 
    dayHigh: 1610.00, 
    dayLow: 1555.00,
    marketCap: 64000e6
  },
  'ICICIBANK': { 
    symbol: 'ICICIBANK', 
    companyName: 'ICICI Bank', 
    lastPrice: 975.00, 
    change: 15.00, 
    pChange: 1.56, 
    volume: 4500000, 
    previousClose: 960.00, 
    open: 965.00, 
    dayHigh: 978.00, 
    dayLow: 963.00,
    marketCap: 6.8e12
  },
  'KOTAKBANK': { 
    symbol: 'KOTAKBANK', 
    companyName: 'Kotak Mahindra Bank', 
    lastPrice: 1750.00, 
    change: 17.50, 
    pChange: 1.01, 
    volume: 1800000, 
    previousClose: 1732.50, 
    open: 1740.00, 
    dayHigh: 1755.00, 
    dayLow: 1735.00,
    marketCap: 3.4e12
  },
  
  // LOSERS (Negative PChange, Moderate Volume)
  'AXISBANK': { 
    symbol: 'AXISBANK', 
    companyName: 'Axis Bank', 
    lastPrice: 1050.00, 
    change: -10.50, 
    pChange: -0.99, 
    volume: 3000000, 
    previousClose: 1060.50, 
    open: 1058.00, 
    dayHigh: 1060.00, 
    dayLow: 1045.00,
    marketCap: 3.2e12
  },
  'LT': { 
    symbol: 'LT', 
    companyName: 'Larsen & Toubro', 
    lastPrice: 3450.00, 
    change: -45.00, 
    pChange: -1.29, 
    volume: 1100000, 
    previousClose: 3495.00, 
    open: 3480.00, 
    dayHigh: 3485.00, 
    dayLow: 3440.00,
    marketCap: 4.8e12
  },
  'BAJFINANCE': { 
    symbol: 'BAJFINANCE', 
    companyName: 'Bajaj Finance', 
    lastPrice: 6900.00, 
    change: -80.00, 
    pChange: -1.15, 
    volume: 800000, 
    previousClose: 6980.00, 
    open: 6970.00, 
    dayHigh: 6975.00, 
    dayLow: 6890.00,
    marketCap: 4.2e12
  },
  
  // VOLUME SHOCKERS (High Volume)
  'TATAMOTORS': { 
    symbol: 'TATAMOTORS', 
    companyName: 'Tata Motors', 
    lastPrice: 950.25, 
    change: 5.25, 
    pChange: 0.55, 
    volume: 22000000, 
    previousClose: 945.00, 
    open: 948.00, 
    dayHigh: 955.00, 
    dayLow: 940.00,
    marketCap: 3.1e12
  },
  'WIPRO': { 
    symbol: 'WIPRO', 
    companyName: 'Wipro', 
    lastPrice: 480.25, 
    change: -5.75, 
    pChange: -1.18, 
    volume: 8000000, 
    previousClose: 486.00, 
    open: 485.00, 
    dayHigh: 485.50, 
    dayLow: 479.00,
    marketCap: 2.5e12
  },
  'HCLTECH': { 
    symbol: 'HCLTECH', 
    companyName: 'HCL Technologies', 
    lastPrice: 1400.00, 
    change: 0.00, 
    pChange: 0.00, 
    volume: 5500000, 
    previousClose: 1400.00, 
    open: 1400.00, 
    dayHigh: 1405.00, 
    dayLow: 1395.00,
    marketCap: 3.8e12
  },
  
  // REMAINING STOCKS
  'BHARTIARTL': { 
    symbol: 'BHARTIARTL', 
    companyName: 'Bharti Airtel', 
    lastPrice: 1050.00, 
    change: -10.50, 
    pChange: -0.99, 
    volume: 4500000, 
    previousClose: 1060.50, 
    open: 1058.00, 
    dayHigh: 1060.00, 
    dayLow: 1045.00,
    marketCap: 5.6e12
  },
  'ITC': { 
    symbol: 'ITC', 
    companyName: 'ITC Ltd', 
    lastPrice: 420.00, 
    change: 0.00, 
    pChange: 0.00, 
    volume: 100000, 
    previousClose: 420.00, 
    open: 420.00, 
    dayHigh: 421.00, 
    dayLow: 419.50,
    marketCap: 5.2e12
  },
  'SUNPHARMA': { 
    symbol: 'SUNPHARMA', 
    companyName: 'Sun Pharma', 
    lastPrice: 1500.00, 
    change: 10.00, 
    pChange: 0.67, 
    volume: 900000, 
    previousClose: 1490.00, 
    open: 1495.00, 
    dayHigh: 1505.00, 
    dayLow: 1490.00,
    marketCap: 3.6e12
  },
  'MARUTI': { 
    symbol: 'MARUTI', 
    companyName: 'Maruti Suzuki', 
    lastPrice: 10100.00, 
    change: -50.00, 
    pChange: -0.49, 
    volume: 750000, 
    previousClose: 10150.00, 
    open: 10140.00, 
    dayHigh: 10145.00, 
    dayLow: 10080.00,
    marketCap: 3.1e12
  },
  'ONGC': { 
    symbol: 'ONGC', 
    companyName: 'Oil & Natural Gas Corp', 
    lastPrice: 205.00, 
    change: 2.50, 
    pChange: 1.23, 
    volume: 3000000, 
    previousClose: 202.50, 
    open: 203.00, 
    dayHigh: 205.50, 
    dayLow: 202.50,
    marketCap: 2.6e12
  },
  'NTPC': { 
    symbol: 'NTPC', 
    companyName: 'NTPC Ltd', 
    lastPrice: 320.00, 
    change: 3.20, 
    pChange: 1.01, 
    volume: 1500000, 
    previousClose: 316.80, 
    open: 317.00, 
    dayHigh: 321.00, 
    dayLow: 316.50,
    marketCap: 3.1e12
  },
  'POWERGRID': { 
    symbol: 'POWERGRID', 
    companyName: 'Power Grid Corp', 
    lastPrice: 260.00, 
    change: -1.30, 
    pChange: -0.50, 
    volume: 1200000, 
    previousClose: 261.30, 
    open: 261.00, 
    dayHigh: 261.50, 
    dayLow: 259.50,
    marketCap: 2.4e12
  },
  'CAPITAL': { 
    symbol: 'CAPITAL', 
    companyName: 'Capital First', 
    lastPrice: 900.00, 
    change: 9.00, 
    pChange: 1.00, 
    volume: 500000, 
    previousClose: 891.00, 
    open: 895.00, 
    dayHigh: 905.00, 
    dayLow: 890.00,
    marketCap: 1800e6
  },
  'BBTC': { 
    symbol: 'BBTC', 
    companyName: 'Bombay Burmah Trdg', 
    lastPrice: 1400.00, 
    change: 14.00, 
    pChange: 1.01, 
    volume: 200000, 
    previousClose: 1386.00, 
    open: 1390.00, 
    dayHigh: 1405.00, 
    dayLow: 1385.00,
    marketCap: 2800e6
  },
  'SLOANE': { 
    symbol: 'SLOANE', 
    companyName: 'Sloane Group', 
    lastPrice: 500.00, 
    change: -5.00, 
    pChange: -0.99, 
    volume: 150000, 
    previousClose: 505.00, 
    open: 504.00, 
    dayHigh: 505.50, 
    dayLow: 498.00,
    marketCap: 500e6
  },
};

// =========================================================================
// REAL-TIME WEBSOCKET SIMULATION
// =========================================================================

// Simulate WebSocket connection
class MockWebSocket {
  constructor(url) {
    this.url = url;
    this.connected = false;
    this.listeners = {
      open: [],
      message: [],
      close: [],
      error: []
    };
  }

  connect() {
    setTimeout(() => {
      this.connected = true;
      this.trigger('open', {});
      this.startPriceUpdates();
    }, 100);
  }

  startPriceUpdates() {
    // Simulate real-time price updates every 2-5 seconds (like real trading)
    setInterval(() => {
      if (this.connected) {
        // Randomly select a stock to update
        const symbols = Object.keys(MOCK_STOCK_DATA);
        const randomSymbol = symbols[Math.floor(Math.random() * symbols.length)];
        const stock = MOCK_STOCK_DATA[randomSymbol];
        
        if (stock) {
          // Small price fluctuation (±0.1% to ±0.5%)
          const fluctuation = (Math.random() - 0.5) * stock.lastPrice * 0.005;
          const newPrice = stock.lastPrice + fluctuation;
          const change = newPrice - stock.previousClose;
          const pChange = (change / stock.previousClose) * 100;
          
          // Update mock data
          stock.lastPrice = parseFloat(newPrice.toFixed(2));
          stock.change = parseFloat(change.toFixed(2));
          stock.pChange = parseFloat(pChange.toFixed(2));
          
          // Send update
          this.trigger('message', {
            type: 'price_update',
            symbol: randomSymbol,
            lastPrice: stock.lastPrice,
            change: stock.change,
            pChange: stock.pChange,
            timestamp: new Date().toISOString()
          });
        }
      }
    }, 2000 + Math.random() * 3000); // Random interval between 2-5 seconds
  }

  trigger(event, data) {
    if (this.listeners[event]) {
      this.listeners[event].forEach(callback => callback(data));
    }
  }

  addEventListener(event, callback) {
    if (this.listeners[event]) {
      this.listeners[event].push(callback);
    }
  }

  removeEventListener(event, callback) {
    if (this.listeners[event]) {
      this.listeners[event] = this.listeners[event].filter(cb => cb !== callback);
    }
  }

  close() {
    this.connected = false;
    this.trigger('close', {});
  }
}

// Global WebSocket instance
let globalWebSocket = null;

const getWebSocket = () => {
  if (!globalWebSocket) {
    globalWebSocket = new MockWebSocket('ws://mock-stock-prices');
    globalWebSocket.connect();
  }
  return globalWebSocket;
};

// =========================================================================
// HOOK FOR BULK STOCK DATA WITH REAL-TIME UPDATES
// =========================================================================
export const useBulkStockData = (symbols = []) => {
  const [stocks, setStocks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const wsRef = useRef(null);

  // Fetch initial data
  const fetchInitialData = useCallback(() => {
    if (!symbols || symbols.length === 0) {
      setStocks([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Get initial data from mock
      const initialStocks = symbols
        .map(symbol => {
          const mockData = MOCK_STOCK_DATA[symbol];
          if (mockData) {
            return {
              symbol: mockData.symbol,
              companyName: mockData.companyName,
              priceInfo: {
                lastPrice: parseFloat(mockData.lastPrice || 0),
                change: parseFloat(mockData.change || 0),
                pChange: parseFloat(mockData.pChange || 0),
                open: parseFloat(mockData.open || 0),
                dayHigh: parseFloat(mockData.dayHigh || 0),
                dayLow: parseFloat(mockData.dayLow || 0),
                previousClose: parseFloat(mockData.previousClose || 0),
                totalTradedVolume: parseFloat(mockData.volume || 0),
                marketCap: parseFloat(mockData.marketCap || 0),
                timestamp: new Date().toISOString()
              }
            };
          }
          return null;
        })
        .filter(stock => stock !== null);

      setStocks(initialStocks);
      setLoading(false);

    } catch (err) {
      console.error("Error loading stock data:", err);
      setError("Failed to load stock data");
      setStocks([]);
      setLoading(false);
    }
  }, [symbols]);

  // Handle real-time price updates
  useEffect(() => {
    if (!symbols || symbols.length === 0) return;

    fetchInitialData();

    // Connect to WebSocket for real-time updates
    const ws = getWebSocket();
    wsRef.current = ws;

    const handlePriceUpdate = (event) => {
      const update = event;
      
      if (update.type === 'price_update') {
        setStocks(prevStocks => 
          prevStocks.map(stock => {
            if (stock.symbol === update.symbol) {
              return {
                ...stock,
                priceInfo: {
                  ...stock.priceInfo,
                  lastPrice: update.lastPrice,
                  change: update.change,
                  pChange: update.pChange,
                  timestamp: update.timestamp
                }
              };
            }
            return stock;
          })
        );
      }
    };

    ws.addEventListener('message', handlePriceUpdate);

    // Cleanup
    return () => {
      if (wsRef.current) {
        wsRef.current.removeEventListener('message', handlePriceUpdate);
      }
    };
  }, [symbols, fetchInitialData]);

  return { 
    stocks, 
    loading, 
    error,
    refresh: fetchInitialData // Manual refresh if needed
  };
};

// =========================================================================
// HOOK FOR INDICES DATA WITH REAL-TIME UPDATES
// =========================================================================
export const useIndicesData = () => {
  const [indices, setIndices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const wsRef = useRef(null);

  // Fetch initial indices data
  const fetchIndicesData = useCallback(() => {
    setLoading(true);
    setError(null);

    try {
      const indicesSymbols = ['NIFTY 50', 'SENSEX', 'BANKNIFTY'];
      
      const initialIndices = indicesSymbols.map(symbol => {
        const mockData = MOCK_STOCK_DATA[symbol];
        return {
          symbol: mockData?.symbol || symbol,
          companyName: mockData?.companyName || symbol,
          priceInfo: {
            lastPrice: parseFloat(mockData?.lastPrice || 0),
            change: parseFloat(mockData?.change || 0),
            pChange: parseFloat(mockData?.pChange || 0),
            timestamp: new Date().toISOString(),
          }
        };
      });
      
      setIndices(initialIndices);
      setLoading(false);
      
    } catch (err) {
      console.error("Error fetching indices:", err);
      setError("Failed to load indices data");
      setIndices([]);
      setLoading(false);
    }
  }, []);

  // Handle real-time updates for indices
  useEffect(() => {
    fetchIndicesData();

    // Connect to WebSocket for real-time updates
    const ws = getWebSocket();
    wsRef.current = ws;

    const handlePriceUpdate = (event) => {
      const update = event;
      
      if (update.type === 'price_update') {
        // Check if it's an index update
        const isIndex = ['NIFTY 50', 'SENSEX', 'BANKNIFTY'].includes(update.symbol);
        
        if (isIndex) {
          setIndices(prevIndices =>
            prevIndices.map(index => {
              if (index.symbol === update.symbol) {
                return {
                  ...index,
                  priceInfo: {
                    ...index.priceInfo,
                    lastPrice: update.lastPrice,
                    change: update.change,
                    pChange: update.pChange,
                    timestamp: update.timestamp
                  }
                };
              }
              return index;
            })
          );
        }
      }
    };

    ws.addEventListener('message', handlePriceUpdate);

    return () => {
      if (wsRef.current) {
        wsRef.current.removeEventListener('message', handlePriceUpdate);
      }
    };
  }, [fetchIndicesData]);

  return { 
    indices, 
    loading, 
    error, 
    refresh: fetchIndicesData 
  };
};

// =========================================================================
// HOOK FOR SINGLE STOCK DETAILS WITH REAL-TIME UPDATES
// =========================================================================
export const useStockDetails = (symbol) => {
  const [stock, setStock] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [historicalData, setHistoricalData] = useState([]);
  const wsRef = useRef(null);

  // Fetch initial stock data
  const fetchStockDetails = useCallback((sym) => {
    if (!sym) return;

    setLoading(true);
    setError(null);

    try {
      // Get mock data for the symbol
      const mockData = MOCK_STOCK_DATA[sym] || MOCK_STOCK_DATA['RELIANCE'];
      
      const stockData = {
        // Basic info
        symbol: mockData.symbol,
        companyName: mockData.companyName,
        sector: 'Technology',
        exchange: 'NSE',
        
        // Price info
        priceInfo: {
          lastPrice: mockData.lastPrice,
          change: mockData.change,
          pChange: mockData.pChange,
          open: mockData.open,
          dayHigh: mockData.dayHigh,
          dayLow: mockData.dayLow,
          previousClose: mockData.previousClose,
          totalTradedVolume: mockData.volume,
          marketCap: mockData.marketCap,
          timestamp: new Date().toISOString()
        },
        
        // Market depth data
        marketDepth: {
          bids: [
            { price: mockData.lastPrice - 0.1, quantity: 1000 },
            { price: mockData.lastPrice - 0.2, quantity: 2000 },
            { price: mockData.lastPrice - 0.3, quantity: 1500 },
          ],
          asks: [
            { price: mockData.lastPrice + 0.1, quantity: 1200 },
            { price: mockData.lastPrice + 0.2, quantity: 1800 },
            { price: mockData.lastPrice + 0.3, quantity: 900 },
          ],
          bidTotal: 4500,
          askTotal: 3900,
          buyOrderPercentage: 53.6,
          sellOrderPercentage: 46.4
        },
        
        // Fundamental data
        fundamentals: {
          marketCap: mockData.marketCap,
          peRatio: 381.95,
          pbRatio: 5.54,
          dividendYield: 0.00,
          eps: 1.67,
          roe: 'N/A',
          bookValue: 115.17,
          industryPE: 26.18,
          faceValue: 2,
          week52High: mockData.dayHigh * 1.15,
          week52Low: mockData.dayLow * 0.85,
          upperCircuit: (mockData.previousClose * 1.2).toFixed(2),
          lowerCircuit: (mockData.previousClose * 0.8).toFixed(2)
        },
        
        // Performance summary
        performance: {
          todayRange: `${mockData.dayLow} - ${mockData.dayHigh}`,
          previousClose: mockData.previousClose,
          volume: mockData.volume,
          valueTraded: `₹${(mockData.volume * mockData.lastPrice / 10000000).toFixed(2)} Cr`
        }
      };
      
      setStock(stockData);
      
      // Generate historical data
      const generateHistoricalData = (currentPrice) => {
        const basePrice = currentPrice * 0.9;
        const dataPoints = 8;
        const data = [];
        
        for (let i = 0; i < dataPoints; i++) {
          const hour = 9 + Math.floor(i * 1.5);
          const minute = i % 2 === 0 ? '15' : '45';
          const time = `${hour}:${minute}`;
          
          const progress = i / (dataPoints - 1);
          const price = basePrice + (currentPrice - basePrice) * progress;
          
          data.push({
            time,
            price: Number((price + (Math.random() - 0.5) * 5).toFixed(2))
          });
        }
        return data;
      };

      const histData = generateHistoricalData(mockData.lastPrice);
      setHistoricalData(histData);
      setLoading(false);
      
    } catch (err) {
      console.error(`Error fetching details for ${sym}:`, err);
      setError(`Failed to load data for ${sym}`);
      setStock(null);
      setLoading(false);
    }
  }, []);

  // Handle real-time price updates for this specific stock
  useEffect(() => {
    if (!symbol) return;

    fetchStockDetails(symbol);

    // Connect to WebSocket for real-time updates
    const ws = getWebSocket();
    wsRef.current = ws;

    const handlePriceUpdate = (event) => {
      const update = event;
      
      if (update.type === 'price_update' && update.symbol === symbol) {
        setStock(prevStock => {
          if (!prevStock) return prevStock;
          
          return {
            ...prevStock,
            priceInfo: {
              ...prevStock.priceInfo,
              lastPrice: update.lastPrice,
              change: update.change,
              pChange: update.pChange,
              timestamp: update.timestamp
            }
          };
        });

        // Update historical data with latest price
        setHistoricalData(prev => {
          if (prev.length === 0) return prev;
          
          const newData = [...prev];
          // Add new data point or update last one
          if (newData.length >= 8) {
            newData.shift(); // Remove oldest
          }
          
          const lastTime = newData.length > 0 ? newData[newData.length - 1].time : '15:45';
          const newHour = parseInt(lastTime.split(':')[0]);
          const newMinute = parseInt(lastTime.split(':')[1]) + 15;
          
          let hour = newHour;
          let minute = newMinute;
          
          if (newMinute >= 60) {
            hour += 1;
            minute = newMinute - 60;
          }
          
          if (hour > 15) hour = 15; // Market closes at 15:30
          
          newData.push({
            time: `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`,
            price: update.lastPrice
          });
          
          return newData;
        });
      }
    };

    ws.addEventListener('message', handlePriceUpdate);

    return () => {
      if (wsRef.current) {
        wsRef.current.removeEventListener('message', handlePriceUpdate);
      }
    };
  }, [symbol, fetchStockDetails]);

  return { 
    stock, 
    loading, 
    error, 
    historicalData,
    refresh: () => fetchStockDetails(symbol)
  };
};

// =========================================================================
// MANUAL PRICE UPDATE FUNCTION (FOR TESTING)
// =========================================================================
export const simulatePriceUpdate = (symbol, priceChange) => {
  const stock = MOCK_STOCK_DATA[symbol];
  if (stock) {
    const newPrice = stock.lastPrice + priceChange;
    const change = newPrice - stock.previousClose;
    const pChange = (change / stock.previousClose) * 100;
    
    // Update mock data
    stock.lastPrice = parseFloat(newPrice.toFixed(2));
    stock.change = parseFloat(change.toFixed(2));
    stock.pChange = parseFloat(pChange.toFixed(2));
    
    // Get WebSocket and trigger update
    const ws = getWebSocket();
    ws.trigger('message', {
      type: 'price_update',
      symbol,
      lastPrice: stock.lastPrice,
      change: stock.change,
      pChange: stock.pChange,
      timestamp: new Date().toISOString()
    });
  }
};

// =========================================================================
// CLEANUP FUNCTION (FOR TESTING)
// =========================================================================
export const cleanupWebSocket = () => {
  if (globalWebSocket) {
    globalWebSocket.close();
    globalWebSocket = null;
  }
};