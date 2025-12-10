import React, { useState, useMemo, useEffect } from 'react';
import { useBulkStockData, useIndicesData } from '../hooks/useStockData';
import StockDetailsPage from './StockDetailsPage';
import './StockDashboard.css';

const StockDashboard = () => {
  const [allStockSymbols] = useState([
    'RELIANCE', 'TCS', 'HDFCBANK', 'INFY', 'ICICIBANK', 'SBIN', 
    'BHARTIARTL', 'ITC', 'KOTAKBANK', 'AXISBANK', 'LT', 
    'BAJFINANCE', 'WIPRO', 'HCLTECH', 'TATAMOTORS', 'SUNPHARMA',
    'MARUTI', 'ONGC', 'NTPC', 'POWERGRID', 'HIKAL', 'ROUTE', 'DOMS', 'CAPITAL', 'BBTC', 'SLOANE'
  ]);
  
  const [mostBoughtSymbols] = useState(['RELIANCE', 'TCS', 'HDFCBANK', 'INFY', 'SBIN']);

  // FIX: Use separate hook for indices
  const { indices: indicesStocks, loading: indicesLoading, error: indicesError } = useIndicesData();
  const { stocks: allStocks, loading: allLoading, error: allError } = useBulkStockData(allStockSymbols);
  const { stocks: mostBoughtStocks, loading: mostBoughtLoading, error: mostBoughtError } = useBulkStockData(mostBoughtSymbols);

  const [activeTab, setActiveTab] = useState('gainers');
  const [showAllMovers, setShowAllMovers] = useState(false); 
  const [showAllMostBought, setShowAllMostBought] = useState(false);
  
  // State for stock details navigation
  const [selectedStock, setSelectedStock] = useState(null);
  const [showStockDetails, setShowStockDetails] = useState(false);

  // Debug: Check data structure
  useEffect(() => {
    if (allStocks && allStocks.length > 0) {
      console.log('Dashboard - First stock:', allStocks[0]);
      console.log('Has priceInfo?', !!allStocks[0].priceInfo);
    }
  }, [allStocks]);

  // --- Data Categorization Logic (categorizedStocks) ---
  const categorizedStocks = useMemo(() => {
    console.log('Processing', allStocks?.length || 0, 'stocks');
    
    if (!allStocks || allStocks.length === 0) {
      console.log('No stocks to categorize');
      return {
        gainers: [],
        losers: [],
        volumeShockers: [],
        allStocks: []
      };
    }
    
    // Debug first few stocks
    allStocks.slice(0, 3).forEach((stock, i) => {
      console.log(`Stock ${i}:`, {
        symbol: stock.symbol,
        hasPriceInfo: !!stock.priceInfo,
        priceInfoKeys: stock.priceInfo ? Object.keys(stock.priceInfo) : 'none',
        lastPrice: stock.priceInfo?.lastPrice,
        pChange: stock.priceInfo?.pChange
      });
    });

    // Transform stocks from your backend
    const validStocks = allStocks
      .filter(stock => {
        const hasData = stock && stock.priceInfo && 
          stock.priceInfo.pChange !== undefined && 
          stock.priceInfo.lastPrice !== undefined;
        
        if (!hasData && stock) {
          console.log('Invalid stock:', stock.symbol, 'priceInfo:', stock.priceInfo);
        }
        
        return hasData;
      })
      .map(stock => ({
        ...stock,
        symbol: stock.symbol || '',
        name: stock.companyName || stock.symbol || '',
        price: parseFloat(stock.priceInfo.lastPrice) || 0,
        change: parseFloat(stock.priceInfo.change) || 0,
        pChange: parseFloat(stock.priceInfo.pChange) || 0,
        volume: parseFloat(stock.priceInfo.totalTradedVolume) || 0,
        marketCap: parseFloat(stock.priceInfo.marketCap) || 0,
        dayHigh: parseFloat(stock.priceInfo.dayHigh) || 0,
        dayLow: parseFloat(stock.priceInfo.dayLow) || 0,
        open: parseFloat(stock.priceInfo.open) || 0,
        previousClose: parseFloat(stock.priceInfo.previousClose) || 0
      }));

    console.log(`Valid stocks after filtering: ${validStocks.length}`);

    const volumes = validStocks.map(s => s.volume).filter(v => v > 0);
    const avgVolume = volumes.length > 0 ? 
      volumes.reduce((a, b) => a + b, 0) / volumes.length : 1000000;

    const gainers = [...validStocks]
      .filter(s => s.pChange > 0)
      .sort((a, b) => b.pChange - a.pChange);

    const losers = [...validStocks]
      .filter(s => s.pChange < 0)
      .sort((a, b) => a.pChange - b.pChange);

    const volumeShockers = [...validStocks]
      .filter(s => s.volume > avgVolume * 1.5)
      .sort((a, b) => b.volume - a.volume);

    console.log(`Gainers: ${gainers.length}, Losers: ${losers.length}, Volume Shockers: ${volumeShockers.length}`);

    return {
      gainers: gainers.slice(0, showAllMovers ? 20 : 6),
      losers: losers.slice(0, showAllMovers ? 20 : 6),
      volumeShockers: volumeShockers.slice(0, showAllMovers ? 20 : 6),
      allStocks: validStocks
    };
  }, [allStocks, showAllMovers]);

  const getActiveStocks = () => {
    switch(activeTab) {
      case 'gainers': return categorizedStocks.gainers;
      case 'losers': return categorizedStocks.losers;
      case 'volume': return categorizedStocks.volumeShockers;
      default: return categorizedStocks.gainers;
    }
  };

  // UPDATED: Show 7-8 stocks initially for Most Bought
  const mostBoughtStocksToDisplay = useMemo(() => {
    if (!mostBoughtStocks) return [];
    
    // Calculate initial count based on available space
    // We'll show 7 initially, or all if less than 8
    const initialCount = 7;
    
    if (showAllMostBought || mostBoughtStocks.length <= initialCount + 1) {
      return mostBoughtStocks;
    }
    return mostBoughtStocks.slice(0, initialCount);
  }, [mostBoughtStocks, showAllMostBought]);

  // --- Click Handlers for Stock Details ---
  const handleStockClick = (stock) => {
    setSelectedStock(stock.symbol);
    setShowStockDetails(true);
  };

  const handleBackToDashboard = () => {
    setShowStockDetails(false);
    setSelectedStock(null);
  };

  // Show Stock Details Page if stock is selected
  if (showStockDetails && selectedStock) {
    return <StockDetailsPage stockSymbol={selectedStock} onBack={handleBackToDashboard} />;
  }

  // --- Formatting Helpers ---
  const formatCurrency = (value) => {
    if (value === undefined || value === null || isNaN(value)) return '₹0.00';
    const numValue = parseFloat(value);
    if (numValue >= 10000000) return `₹${(numValue / 10000000).toFixed(2)} Cr`;
    if (numValue >= 100000) return `₹${(numValue / 100000).toFixed(2)} L`;
    return `₹${numValue.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  const formatPercentage = (value) => {
    if (value === undefined || value === null || isNaN(value)) return '0.00%';
    const numValue = parseFloat(value);
    const sign = numValue >= 0 ? '+' : '';
    return `${sign}${numValue.toFixed(2)}%`;
  };

  const formatNumber = (value) => {
    if (value === undefined || value === null || isNaN(value)) return '0.00';
    return parseFloat(value).toFixed(1);
  };

  // FIXED: Volume formatting
  const formatVolume = (volume) => {
    if (!volume || isNaN(volume) || volume === 0) return '0';
    const num = parseFloat(volume);
    if (num >= 10000000) return `${(num / 10000000).toFixed(2)} Cr`;
    if (num >= 100000) return `${(num / 100000).toFixed(2)} L`;
    return num.toLocaleString('en-IN');
  };

  const getChangeClass = (change) => {
    if (change > 0) return 'positive';
    if (change < 0) return 'negative';
    return 'neutral';
  };

  const getVolumeChangePercentage = (stock) => {
    const avgVolume = 1000000;
    const todayVolume = stock.volume || 0;
    const changePercent = todayVolume > 0 ? ((todayVolume - avgVolume) / avgVolume) * 100 : 0;
    return Math.abs(changePercent).toFixed(0);
  };
  
  // --- Loading and Error Checks ---
  const isLoading = indicesLoading || mostBoughtLoading || allLoading;

  if (isLoading) {
    return (
      <div className="dashboard-loading">
        <div className="spinner"></div>
        <p>Loading real-time market data...</p>
      </div>
    );
  }

  if (allError || indicesError || mostBoughtError) {
    return (
      <div className="dashboard-error">
        <h3>⚠️ Unable to load market data</h3>
        <p>Please check if your backend is running on port 3000</p>
        <p>Errors: {allError || indicesError || mostBoughtError}</p>
        <button onClick={() => window.location.reload()} className="retry-btn">
          Retry
        </button>
      </div>
    );
  }

  const activeStocks = getActiveStocks();

  return (
    <div className="stock-dashboard">
     
      {/* Main Content Grid with margin top for spacing */}
      <div className="w-full px-32 py-5 bg-white">
        {/* Left Column - Stocks */}
        <div className="stocks-column">
          
          {/* Most Bought Stocks - Clickable */}
          <div className="stocks-section">
            <div className="section-header">
              <h3 className="section-title">Most Bought Stocks</h3>
              {mostBoughtStocks && mostBoughtStocks.length > 7 && (
                <button 
                  className="see-all-btn"
                  onClick={() => setShowAllMostBought(!showAllMostBought)}
                >
                  {showAllMostBought ? 'Show Less' : 'See All →'}
                </button>
              )}
            </div>
            
            {mostBoughtLoading ? (
              <div className="no-data-message" style={{padding: '10px 0'}}>Loading most bought data...</div>
            ) : mostBoughtStocksToDisplay.length > 0 ? (
              <div className="stocks-grid">
                {mostBoughtStocksToDisplay.map((stock, index) => (
                  <div 
                    key={index} 
                    className="stock-item clickable"
                    onClick={() => handleStockClick(stock)}
                  >
                    <div className="stock-info">
                      <div className="stock-symbol">{stock.symbol}</div>
                      <div className="stock-name">{stock.companyName || stock.symbol}</div>
                    </div>
                    <div className="stock-details">
                      <div className="stock-price">{formatCurrency(stock.priceInfo?.lastPrice)}</div>
                      <div className={`stock-change ${getChangeClass(stock.priceInfo?.pChange)}`}>
                        {formatPercentage(stock.priceInfo?.pChange)}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="no-data-message" style={{padding: '10px 0'}}>
                No data available for most bought stocks.
              </div>
            )}
          </div>

          {/* Top Market Movers Section - Clickable */}
          <div className="top-movers-section">
            <div className="section-header">
              <h3 className="section-title">Top Market Movers</h3>
              <div className="movers-tabs">
                <button 
                  className={`tab-btn ${activeTab === 'gainers' ? 'active' : ''}`}
                  onClick={() => setActiveTab('gainers')}
                >
                  Gainers
                </button>
                <button 
                  className={`tab-btn ${activeTab === 'losers' ? 'active' : ''}`}
                  onClick={() => setActiveTab('losers')}
                >
                  Losers
                </button>
                <button 
                  className={`tab-btn ${activeTab === 'volume' ? 'active' : ''}`}
                  onClick={() => setActiveTab('volume')}
                >
                  Volume Shockers
                </button>
              </div>
            </div>
            
            {/* Movers Table */}
            <div className="movers-table-screenshot">
              <table className="movers-table">
                <thead>
                  <tr className="table-header">
                    <th className="col-company">Company</th>
                    <th className="col-trend">Trend (1D)</th> 
                    <th className="col-price">Market price (1D)</th>
                    <th className="col-volume">Vol change (1D)</th>
                  </tr>
                </thead>
                <tbody>
                  {activeStocks.length > 0 ? activeStocks.map((stock, index) => (
                    <tr 
                      key={index} 
                      className="stock-row clickable"
                      onClick={() => handleStockClick(stock)}
                    >
                      <td className="col-company">
                        <div className="company-name-full">{stock.name}</div>
                        <div className={`price-change-screenshot ${getChangeClass(stock.pChange)}`}>
                          {stock.pChange >= 0 ? '+' : ''}{stock.change.toFixed(2)} ({stock.pChange.toFixed(2)}%)
                        </div>
                      </td>
                      <td className="col-trend">
                        <div className={`mini-line-chart ${getChangeClass(stock.pChange)}`}>
                          <svg width="80" height="25" viewBox="0 0 80 25">
                            {stock.pChange > 0 ? (
                              <path d="M0,20 L20,15 L40,10 L60,5 L80,0" 
                                    stroke="#00d09c" 
                                    fill="none" 
                                    strokeWidth="2" />
                            ) : stock.pChange < 0 ? (
                              <path d="M0,5 L20,10 L40,15 L60,20 L80,25" 
                                    stroke="#ff6b6b" 
                                    fill="none" 
                                    strokeWidth="2" />
                            ) : (
                              <path d="M0,12.5 L80,12.5" 
                                    stroke="#666" 
                                    fill="none" 
                                    strokeWidth="2" />
                            )}
                          </svg>
                        </div>
                      </td>
                      <td className="col-price">
                        <div className="price-main-screenshot">₹{stock.price.toFixed(2)}</div>
                      </td>
                      <td className="col-volume">
                        <div className="volume-percentage">{getVolumeChangePercentage(stock)}%</div>
                        <div className="volume-amount">{formatVolume(stock.volume)}</div>
                      </td>
                    </tr>
                  )) : (
                    <tr>
                      <td colSpan="4" className="no-data-message">
                        No real-time data available for {activeTab}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {activeStocks.length > 0 && (
              <div className="see-more-container">
                <button 
                  className="see-more-btn"
                  onClick={() => setShowAllMovers(!showAllMovers)} 
                >
                  {showAllMovers ? 'Show Less' : 'See More'} ▼
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StockDashboard;