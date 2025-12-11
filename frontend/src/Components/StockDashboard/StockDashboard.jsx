import React, { useState, useMemo, useEffect } from 'react';
import { useBulkStockData, useIndicesData } from '../hooks/useStockData';
import StockDetailsPage from './StockDetailsPage';
import { motion, AnimatePresence } from 'framer-motion';

const StockDashboard = () => {
  const [allStockSymbols] = useState([
    'RELIANCE', 'TCS', 'HDFCBANK', 'INFY', 'ICICIBANK', 'SBIN', 
    'BHARTIARTL', 'ITC', 'KOTAKBANK', 'AXISBANK', 'LT', 
    'BAJFINANCE', 'WIPRO', 'HCLTECH', 'TATAMOTORS', 'SUNPHARMA',
    'MARUTI', 'ONGC', 'NTPC', 'POWERGRID', 'HIKAL', 'ROUTE', 'DOMS', 
    'CAPITAL', 'BBTC', 'SLOANE'
  ]);
  
  const [mostBoughtSymbols] = useState(['RELIANCE', 'TCS', 'HDFCBANK', 'INFY', 'SBIN']);

  const { indices: indicesStocks, loading: indicesLoading, error: indicesError } = useIndicesData();
  const { stocks: allStocks, loading: allLoading, error: allError } = useBulkStockData(allStockSymbols);
  const { stocks: mostBoughtStocks, loading: mostBoughtLoading, error: mostBoughtError } = useBulkStockData(mostBoughtSymbols);

  const [activeTab, setActiveTab] = useState('gainers');
  const [showAllMovers, setShowAllMovers] = useState(false); 
  const [showAllMostBought, setShowAllMostBought] = useState(false);
  
  const [selectedStock, setSelectedStock] = useState(null);
  const [showStockDetails, setShowStockDetails] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(12);
  const [showAllStocks, setShowAllStocks] = useState(false);

  const [sortBy, setSortBy] = useState('name');
  const [sortOrder, setSortOrder] = useState('asc');

  const [searchTerm, setSearchTerm] = useState('');

  const [lastUpdated, setLastUpdated] = useState(new Date());
  const [isRefreshing, setIsRefreshing] = useState(false);

  const stockLogos = useMemo(() => ({
    'RELIANCE': 'https://img.icons8.com/color/96/000000/reliance.png',
    'TCS': 'https://img.icons8.com/color/96/000000/tata.png',
    'HDFCBANK': 'https://img.icons8.com/color/96/000000/bank.png',
    'INFY': 'https://img.icons8.com/color/96/000000/infosys.png',
    'ICICIBANK': 'https://img.icons8.com/color/96/000000/bank-building.png',
    'SBIN': 'https://img.icons8.com/color/96/000000/state-bank-of-india.png',
    'BHARTIARTL': 'https://img.icons8.com/color/96/000000/airtel.png',
    'ITC': 'https://img.icons8.com/color/96/000000/cigarette.png',
    'KOTAKBANK': 'https://img.icons8.com/color/96/000000/bank.png',
    'AXISBANK': 'https://img.icons8.com/color/96/000000/bank.png',
    'LT': 'https://img.icons8.com/color/96/000000/construction.png',
    'BAJFINANCE': 'https://img.icons8.com/color/96/000000/finance.png',
    'WIPRO': 'https://img.icons8.com/color/96/000000/wipro.png',
    'HCLTECH': 'https://img.icons8.com/color/96/000000/hcl.png',
    'TATAMOTORS': 'https://img.icons8.com/color/96/000000/tata-motors.png',
    'SUNPHARMA': 'https://img.icons8.com/color/96/000000/pharmaceutical.png',
    'MARUTI': 'https://img.icons8.com/color/96/000000/suzuki.png',
    'ONGC': 'https://img.icons8.com/color/96/000000/oil.png',
    'NTPC': 'https://img.icons8.com/color/96/000000/power-plant.png',
    'POWERGRID': 'https://img.icons8.com/color/96/000000/electricity.png',
    'HIKAL': 'https://img.icons8.com/color/96/000000/pharmaceutical.png',
    'ROUTE': 'https://img.icons8.com/color/96/000000/mobile-payment.png',
    'DOMS': 'https://img.icons8.com/color/96/000000/stationery.png',
    'CAPITAL': 'https://img.icons8.com/color/96/000000/investment.png',
    'BBTC': 'https://img.icons8.com/color/96/000000/tea.png',
    'SLOANE': 'https://img.icons8.com/color/96/000000/company.png',
    'NIFTY 50': 'https://img.icons8.com/color/96/000000/india.png',
    'SENSEX': 'https://img.icons8.com/color/96/000000/chart.png',
    'BANKNIFTY': 'https://img.icons8.com/color/96/000000/bank.png',
  }), []);

  const getStockLogo = (symbol) => {
    return stockLogos[symbol] || 'https://img.icons8.com/color/96/000000/stocks.png';
  };

  const getStockColor = (symbol) => {
    const colors = [
      '#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6',
      '#EC4899', '#14B8A6', '#F97316', '#6366F1', '#8B5CF6'
    ];
    const hash = symbol.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    return colors[hash % colors.length];
  };

  const getStockInitial = (symbol) => {
    return symbol.charAt(0);
  };

  const remainingStocks = useMemo(() => {
    if (!allStocks || allStocks.length === 0) return [];
    
    const mostBoughtSet = new Set(mostBoughtSymbols.map(s => s.toUpperCase()));
    
    return allStocks.filter(stock => {
      const symbol = stock.symbol?.toUpperCase();
      return symbol && !mostBoughtSet.has(symbol);
    });
  }, [allStocks, mostBoughtSymbols]);

  const filteredStocks = useMemo(() => {
    if (!remainingStocks || remainingStocks.length === 0) return [];
    
    if (!searchTerm.trim()) return remainingStocks;
    
    const term = searchTerm.toLowerCase();
    return remainingStocks.filter(stock => 
      stock.symbol?.toLowerCase().includes(term) || 
      stock.companyName?.toLowerCase().includes(term)
    );
  }, [remainingStocks, searchTerm]);

  const sortedStocks = useMemo(() => {
    if (!filteredStocks || filteredStocks.length === 0) return [];
    
    return [...filteredStocks].sort((a, b) => {
      let aValue, bValue;
      
      switch (sortBy) {
        case 'price':
          aValue = a.priceInfo?.lastPrice || 0;
          bValue = b.priceInfo?.lastPrice || 0;
          break;
        case 'change':
          aValue = a.priceInfo?.pChange || 0;
          bValue = b.priceInfo?.pChange || 0;
          break;
        case 'volume':
          aValue = a.priceInfo?.totalTradedVolume || 0;
          bValue = b.priceInfo?.totalTradedVolume || 0;
          break;
        case 'name':
        default:
          aValue = a.companyName || a.symbol || '';
          bValue = b.companyName || b.symbol || '';
      }
      
      if (sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });
  }, [filteredStocks, sortBy, sortOrder]);

  useEffect(() => {
    const interval = setInterval(() => {
      setLastUpdated(new Date());
    }, 30000);
    
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, sortBy, sortOrder]);

  const categorizedStocks = useMemo(() => {
    if (!allStocks || allStocks.length === 0) {
      return {
        gainers: [],
        losers: [],
        volumeShockers: [],
        allStocks: []
      };
    }

    const validStocks = allStocks
      .filter(stock => {
        return stock && stock.priceInfo && 
          stock.priceInfo.pChange !== undefined && 
          stock.priceInfo.lastPrice !== undefined;
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

  const mostBoughtStocksToDisplay = useMemo(() => {
    if (!mostBoughtStocks) return [];
    
    const initialCount = 5;
    
    if (showAllMostBought || mostBoughtStocks.length <= initialCount + 1) {
      return mostBoughtStocks;
    }
    return mostBoughtStocks.slice(0, initialCount);
  }, [mostBoughtStocks, showAllMostBought]);

  const paginatedRemainingStocks = useMemo(() => {
    if (!sortedStocks || sortedStocks.length === 0) return [];
    
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    
    if (showAllStocks || sortedStocks.length <= itemsPerPage) {
      return sortedStocks;
    }
    
    return sortedStocks.slice(startIndex, endIndex);
  }, [sortedStocks, currentPage, itemsPerPage, showAllStocks]);

  const totalPages = useMemo(() => {
    if (!sortedStocks || sortedStocks.length === 0) return 0;
    return Math.ceil(sortedStocks.length / itemsPerPage);
  }, [sortedStocks, itemsPerPage]);

  const handleStockClick = (stock) => {
    setSelectedStock(stock.symbol);
    setShowStockDetails(true);
  };

  const handleBackToDashboard = () => {
    setShowStockDetails(false);
    setSelectedStock(null);
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handlePageClick = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const handleSort = (field) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('asc');
    }
  };

  

  const formatTime = (date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  };

  const formatDate = (date) => {
    return date.toLocaleDateString('en-IN', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

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

  const formatVolume = (volume) => {
    if (!volume || isNaN(volume) || volume === 0) return '0';
    const num = parseFloat(volume);
    if (num >= 10000000) return `${(num / 10000000).toFixed(2)} Cr`;
    if (num >= 100000) return `${(num / 100000).toFixed(2)} L`;
    return num.toLocaleString('en-IN');
  };

  const getChangeClass = (change) => {
    if (change > 0) return 'text-green-600 bg-green-50';
    if (change < 0) return 'text-red-600 bg-red-50';
    return 'text-gray-600 bg-gray-50';
  };

  const getChangeColor = (change) => {
    if (change > 0) return 'text-green-600';
    if (change < 0) return 'text-red-600';
    return 'text-gray-600';
  };

  const getVolumeChangePercentage = (stock) => {
    const avgVolume = 1000000;
    const todayVolume = stock.volume || 0;
    const changePercent = todayVolume > 0 ? ((todayVolume - avgVolume) / avgVolume) * 100 : 0;
    return Math.abs(changePercent).toFixed(0);
  };

  if (showStockDetails && selectedStock) {
    return <StockDetailsPage stockSymbol={selectedStock} onBack={handleBackToDashboard} />;
  }

  const isLoading = indicesLoading || mostBoughtLoading || allLoading;

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="relative">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          <div className="absolute inset-0 w-16 h-16 border-4 border-blue-200 border-t-transparent rounded-full animate-spin" style={{ animationDelay: '0.1s' }}></div>
        </div>
        <p className="mt-6 text-gray-600 font-medium animate-pulse">Loading real-time market data...</p>
        <p className="mt-2 text-sm text-gray-500">Fetching live stock prices and indices</p>
      </div>
    );
  }

  if (allError || indicesError || mostBoughtError) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white border border-red-200 rounded-xl p-8 max-w-md text-center shadow-lg"
        >
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl">⚠️</span>
          </div>
          <h3 className="text-xl font-bold text-red-700 mb-2">Connection Error</h3>
          <p className="text-red-600 mb-4">Unable to load market data. Please check your connection.</p>
          <div className="flex gap-3 justify-center">
            <button 
              onClick={handleRefresh} 
              className="px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all duration-300 shadow-md hover:shadow-lg font-medium"
            >
              ↻ Retry Connection
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  const activeStocks = getActiveStocks();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50/30 px-32">
      {/* Animated Background Elements */}
     {/* Animated Background Elements */}
<div className="fixed inset-0 overflow-hidden pointer-events-none">
  <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-[#48E1C4]/20 rounded-full mix-blend-multiply filter blur-3xl animate-blob"></div>
  <div className="absolute top-1/3 right-1/4 w-64 h-64 bg-[#5064FF]/20 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-2000"></div>
  <div className="absolute bottom-1/4 left-1/2 w-64 h-64 bg-[#48E1C4]/20 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-4000"></div>
</div>

{/* Main Content */}
<div className="relative container mx-auto px-4 sm:px-6 lg:px-8 py-6">
  {/* Header */}
  <motion.header 
    initial={{ opacity: 0, y: -20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5 }}
    className="mb-8"
  >
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
      <div>
        <p className="font-semibold text-gray-600 mt-1">
          {formatDate(lastUpdated)} • Last updated: {formatTime(lastUpdated)}
        </p>
      </div>
    </div>
  </motion.header>

  {/* Most Bought Stocks Section */}
  <motion.section
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5, delay: 0.1 }}
    className="mb-8"
  >
    <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-100/50 p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-xl font-semibold text-gray-600">
            <span className="font-semibold bg-gradient-to-r from-[#5064FF] to-[#5064FF] bg-clip-text text-transparent leading-tight"></span>
            Most Bought Stocks
          </h2>
          <p className="text-gray-600 text-sm mt-1">
            Today's highest trading volume stocks
          </p>
        </div>
        <div className="flex items-center gap-3">
          <span className="bg-gradient-to-r from-[#48E1C4]/20 via-[#5064FF]/20 to-[#48E1C4]/20 text-transparent bg-clip-text px-3 py-1.5 rounded-full text-sm font-medium border border-[#48E1C4]/30">
            {mostBoughtStocks?.length || 0} stocks
          </span>
          {mostBoughtStocks && mostBoughtStocks.length > 5 && (
            <motion.button 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="font-medium text-sm flex items-center gap-1 text-transparent bg-clip-text bg-gradient-to-r from-[#48E1C4] via-[#5064FF] to-[#48E1C4] hover:from-[#5064FF] hover:via-[#48E1C4] hover:to-[#5064FF] transition-colors duration-300"
              onClick={() => setShowAllMostBought(!showAllMostBought)}
            >
              {showAllMostBought ? 'Show Less' : 'See All'}
              <span className={`transition-transform duration-300 ${showAllMostBought ? 'rotate-180' : ''}`}>▼</span>
            </motion.button>
          )}
        </div>
      </div>


      {mostBoughtLoading ? (
        <div className="text-center py-8">
          <div className="inline-block w-8 h-8 border-2 border-[#48E1C4]/30 border-t-[#5064FF] rounded-full animate-spin"></div>
          <p className="text-[#5064FF]/70 mt-2">Loading most bought data...</p>
        </div>
      ) : mostBoughtStocksToDisplay.length > 0 ? (
        <motion.div 
          layout
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4"
        >
          {mostBoughtStocksToDisplay.map((stock, index) => (
            <motion.div
              key={stock.symbol}
              layout
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
              whileHover={{ 
                y: -8,
                boxShadow: '0 20px 40px -15px rgba(72, 225, 196, 0.3)'
              }}
              className="bg-gradient-to-br from-white to-gray-50 hover:from-[#48E1C4]/10 hover:to-[#5064FF]/10 rounded-xl p-4 cursor-pointer transition-all duration-300 border border-[#48E1C4]/20 h-[140px] flex flex-col justify-between relative overflow-hidden group"
              onClick={() => handleStockClick(stock)}
            >

                    {/* Hover effect background */}
<div className="absolute inset-0 
                bg-gradient-to-r from-[#48E1C4]/0 via-[#5064FF]/10 to-[#48E1C4]/0 
                translate-x-[-100%] group-hover:translate-x-[100%] 
                transition-transform duration-1000 rounded-lg"></div>

{/* Stock Logo with shine effect */}
<div className="absolute top-3 right-3 w-10 h-10 group-hover:scale-110 transition-transform duration-300">
  <div className="relative">
    <img 
      src={getStockLogo(stock.symbol)} 
      alt={stock.symbol}
      className="w-full h-full rounded-lg object-cover border border-gray-200 shadow-sm group-hover:shadow-md transition-all duration-300"
      onError={(e) => {
        e.target.style.display = 'none';
        e.target.nextElementSibling.style.display = 'flex';
      }}
    />
    <div 
      className="w-full h-full rounded-lg flex items-center justify-center text-white font-bold text-lg hidden shadow-inner"
      style={{ backgroundColor: getStockColor(stock.symbol) }}
    >
      {getStockInitial(stock.symbol)}
    </div>
    {/* Gradient shine overlay */}
    <div className="absolute inset-0 
                    bg-gradient-to-tr from-transparent via-[#48E1C4]/20 to-transparent 
                    opacity-0 group-hover:opacity-100 
                    transition-opacity duration-300 rounded-lg"></div>
  </div>
</div>

{/* Stock Info */}
<div className="pr-12 relative z-10">
  <div className="font-bold text-gray-800 text-sm 
                  group-hover:text-[#5064FF] transition-colors">
    {stock.symbol}
  </div>
  <div className="text-xs text-gray-600 truncate 
                  group-hover:text-[#48E1C4] transition-colors">
    {stock.companyName || stock.symbol}
  </div>
</div>

                   {/* Stock Details with pulse animation for price changes */}
<div className="pr-12 relative z-10 group">
  {/* Last Price */}
  <div className="font-semibold text-lg text-gray-900 transition-colors group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-[#48E1C4] group-hover:via-[#5064FF] group-hover:to-[#48E1C4]">
    {formatCurrency(stock.priceInfo?.lastPrice)}
  </div>

  {/* Percentage Change Badge */}
  <motion.div 
    initial={false}
    animate={{ 
      scale: stock.priceInfo?.pChange !== 0 ? [1, 1.1, 1] : 1 
    }}
    transition={{ 
      duration: 0.5,
      repeat: stock.priceInfo?.pChange !== 0 ? Infinity : 0,
      repeatDelay: 3 
    }}
    className={`text-xs font-medium px-3 py-1.5 rounded-full inline-block mt-1 border ${getChangeClass(stock.priceInfo?.pChange)}
                text-gray-900 transition-all duration-300
                group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-[#48E1C4] group-hover:via-[#5064FF] group-hover:to-[#48E1C4]`}
  >
    {formatPercentage(stock.priceInfo?.pChange)}
  </motion.div>
</div>

                  </motion.div>
                ))}
              </motion.div>
            ) : (
              <div className="text-center py-8">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="text-2xl">📊</span>
                </div>
                <p className="text-gray-500">No data available for most bought stocks.</p>
              </div>
            )}
          </div>
        </motion.section>

        {/* Top Market Movers Section */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mb-8"
        >
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-100/50 p-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
              <div>
                <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                  <span className="w-2 h-6 bg-gradient-to-b from-green-500 to-emerald-500 rounded-full"></span>
                  Top Market Movers
                </h2>
                <p className="text-gray-600 text-sm mt-1">Real-time gainers, losers & volume shockers</p>
              </div>
              <div className="flex items-center gap-4">
                <span className="text-sm text-gray-600 bg-gray-100 px-3 py-1.5 rounded-full">
                  {activeTab === 'gainers' ? '📈 Top Gainers' : 
                   activeTab === 'losers' ? '📉 Top Losers' : '📊 Volume Shockers'}
                </span>
                <div className="flex bg-gray-100 p-1 rounded-xl">
                  <motion.button 
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className={`px-4 py-2 rounded-lg font-medium text-sm transition-all duration-300 ${activeTab === 'gainers' ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-lg' : 'text-gray-700 hover:text-gray-900 hover:bg-white/50'}`}
                    onClick={() => setActiveTab('gainers')}
                  >
                    Gainers
                  </motion.button>
                  <motion.button 
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className={`px-4 py-2 rounded-lg font-medium text-sm transition-all duration-300 ${activeTab === 'losers' ? 'bg-gradient-to-r from-red-500 to-pink-500 text-white shadow-lg' : 'text-gray-700 hover:text-gray-900 hover:bg-white/50'}`}
                    onClick={() => setActiveTab('losers')}
                  >
                    Losers
                  </motion.button>
                  <motion.button 
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className={`px-4 py-2 rounded-lg font-medium text-sm transition-all duration-300 ${activeTab === 'volume' ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg' : 'text-gray-700 hover:text-gray-900 hover:bg-white/50'}`}
                    onClick={() => setActiveTab('volume')}
                  >
                    Volume
                  </motion.button>
                </div>
              </div>
            </div>
            
            {/* Movers Table */}
            <div className="overflow-x-auto rounded-xl border border-gray-200/50">
              <table className="w-full">
                <thead>
                  <tr className="bg-gradient-to-r from-gray-50 to-gray-100/50 border-b border-gray-200">
                    <th className="text-left py-4 px-6 font-semibold text-gray-600 text-xs uppercase tracking-wider w-[45%]">Company</th>
                    <th className="text-center py-4 px-2 font-semibold text-gray-600 text-xs uppercase tracking-wider w-[15%]">Trend (1D)</th> 
                    <th className="text-right py-4 px-6 font-semibold text-gray-600 text-xs uppercase tracking-wider w-[20%]">Market Price</th>
                    <th className="text-right py-4 px-6 font-semibold text-gray-600 text-xs uppercase tracking-wider w-[20%]">Volume Change</th>
                  </tr>
                </thead>
                <tbody>
                  {activeStocks.length > 0 ? (
                    activeStocks.map((stock, index) => (
                      <motion.tr
                        key={stock.symbol}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.3, delay: index * 0.05 }}
                        whileHover={{ 
                          backgroundColor: 'rgba(59, 130, 246, 0.05)',
                          transition: { duration: 0.2 }
                        }}
                        className="border-b border-gray-100 hover:bg-blue-50/50 cursor-pointer transition-colors"
                        onClick={() => handleStockClick(stock)}
                      >
                        <td className="py-4 px-6">
                          <div className="flex items-center gap-4">
                            <div className="relative w-12 h-12 flex-shrink-0">
                              <img 
                                src={getStockLogo(stock.symbol)} 
                                alt={stock.symbol}
                                className="w-full h-full rounded-xl object-cover border border-gray-200 shadow-sm"
                              />
                              <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-white border border-gray-200 flex items-center justify-center">
                                <span className="text-xs font-bold" style={{ color: getStockColor(stock.symbol) }}>
                                  {index + 1}
                                </span>
                              </div>
                            </div>
                            <div className="min-w-0">
                              <div className="font-semibold text-gray-800 text-sm truncate">{stock.name}</div>
                              <motion.div 
                                initial={false}
                                animate={{ 
                                  scale: stock.pChange !== 0 ? [1, 1.05, 1] : 1 
                                }}
                                transition={{ 
                                  duration: 0.5,
                                  repeat: stock.pChange !== 0 ? Infinity : 0,
                                  repeatDelay: 3 
                                }}
                                className={`text-xs font-medium px-3 py-1 rounded-full inline-block mt-2 ${getChangeClass(stock.pChange)}`}
                              >
                                {stock.pChange >= 0 ? '+' : ''}{stock.change.toFixed(2)} ({stock.pChange.toFixed(2)}%)
                              </motion.div>
                            </div>
                          </div>
                        </td>
                        <td className="py-4 px-2 text-center">
                          <div className="flex justify-center">
                            <div className={`w-20 h-8 flex items-center justify-center ${stock.pChange > 0 ? 'bg-green-50' : stock.pChange < 0 ? 'bg-red-50' : 'bg-gray-50'} rounded-lg border`}>
                              <svg width="60" height="20" viewBox="0 0 60 20" className={getChangeColor(stock.pChange)}>
                                {stock.pChange > 0 ? (
                                  <path d="M0,15 L15,12 L30,9 L45,6 L60,3" 
                                        fill="none" 
                                        stroke="currentColor" 
                                        strokeWidth="2"
                                        strokeLinecap="round" />
                                ) : stock.pChange < 0 ? (
                                  <path d="M0,5 L15,8 L30,11 L45,14 L60,17" 
                                        fill="none" 
                                        stroke="currentColor" 
                                        strokeWidth="2"
                                        strokeLinecap="round" />
                                ) : (
                                  <path d="M0,10 L60,10" 
                                        fill="none" 
                                        stroke="currentColor" 
                                        strokeWidth="2"
                                        strokeLinecap="round" />
                                )}
                              </svg>
                            </div>
                          </div>
                        </td>
                        <td className="py-4 px-6 text-right">
                          <div className="font-bold text-gray-800 text-lg">₹{stock.price.toFixed(2)}</div>
                          <div className="text-xs text-gray-500">
                            {stock.dayHigh ? `H: ₹${stock.dayHigh.toFixed(2)}` : ''}
                          </div>
                        </td>
                        <td className="py-4 px-6 text-right">
                          <div className="flex flex-col items-end gap-2">
                            <div className="text-blue-600 font-semibold text-sm">{getVolumeChangePercentage(stock)}%</div>
                            <div className="w-20 h-2 bg-gray-200 rounded-full overflow-hidden">
                              <motion.div 
                                initial={{ width: 0 }}
                                animate={{ width: `${Math.min(100, getVolumeChangePercentage(stock))}%` }}
                                transition={{ duration: 1, delay: index * 0.1 }}
                                className="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"
                              ></motion.div>
                            </div>
                            <div className="text-xs text-gray-600">{formatVolume(stock.volume)}</div>
                          </div>
                        </td>
                      </motion.tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="4" className="py-12 px-4 text-center">
                        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                          <span className="text-2xl">📈</span>
                        </div>
                        <p className="text-gray-500 font-medium">No real-time data available for {activeTab}</p>
                        <p className="text-gray-400 text-sm mt-1">Try refreshing or check back later</p>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {activeStocks.length > 0 && (
              <div className="mt-6 text-center">
                <motion.button 
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-6 py-2.5 bg-gradient-to-r from-gray-100 to-gray-50 hover:from-gray-200 hover:to-gray-100 text-gray-700 rounded-xl font-medium transition-all duration-300 border border-gray-200 shadow-sm hover:shadow"
                  onClick={() => setShowAllMovers(!showAllMovers)} 
                >
                  {showAllMovers ? 'Show Less' : 'See More'}
                  <span className={`ml-2 inline-block transition-transform duration-300 ${showAllMovers ? 'rotate-180' : ''}`}>▼</span>
                </motion.button>
              </div>
            )}
          </div>
        </motion.section>

        {/* All Stocks Section */}
        {remainingStocks.length > 0 && (
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-100/50 p-6">
              <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-6 gap-4">
                <div>
                  <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                    <span className="w-2 h-6 bg-gradient-to-b from-purple-500 to-pink-500 rounded-full"></span>
                    All Stocks
                  </h2>
                  <p className="text-gray-600 text-sm mt-1">Browse and filter all available stocks</p>
                </div>
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 w-full lg:w-auto">
                  {/* Search Box */}
                  <div className="relative w-full sm:w-56">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <span className="text-gray-400">🔍</span>
                    </div>
                    <motion.input
                      type="text"
                      placeholder="Search stocks by symbol or name..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-10 pr-10 py-2.5 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm"
                      whileFocus={{ scale: 1.02 }}
                    />
                    {searchTerm && (
                      <motion.button 
                        initial={{ opacity: 0, scale: 0 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                        onClick={() => setSearchTerm('')}
                      >
                        ✕
                      </motion.button>
                    )}
                  </div>
                  
                  {/* Sort Controls */}
                  <div className="flex items-center gap-2">
                    <div className="relative">
                      <select 
                        value={sortBy}
                        onChange={(e) => handleSort(e.target.value)}
                        className="px-4 py-2.5 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white pr-10 shadow-sm"
                      >
                        <option value="name">Sort by: Name</option>
                        <option value="price">Sort by: Price</option>
                        <option value="change">Sort by: Change</option>
                        <option value="volume">Sort by: Volume</option>
                      </select>
                      <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                        <span className="text-gray-400">▼</span>
                      </div>
                    </div>
                    <motion.button 
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      className="px-4 py-2.5 border border-gray-300 rounded-xl text-sm font-bold hover:bg-gray-50 shadow-sm"
                      onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                    >
                      {sortOrder === 'asc' ? '↑' : '↓'}
                    </motion.button>
                  </div>
                  
                  {/* Show All Button */}
                  {sortedStocks.length > itemsPerPage && (
                    <motion.button 
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="px-5 py-2.5 bg-gradient-to-r from-gray-100 to-gray-50 hover:from-gray-200 hover:to-gray-100 text-gray-700 rounded-xl font-medium transition-all duration-300 border border-gray-200 shadow-sm hover:shadow"
                      onClick={() => setShowAllStocks(!showAllStocks)}
                    >
                      {showAllStocks ? '📄 Paginated' : '📋 Show All'}
                    </motion.button>
                  )}
                </div>
              </div>
              
              {/* Search Results Info */}
              {searchTerm && (
                <motion.div 
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-gradient-to-r from-blue-50 to-blue-100/50 border border-blue-200 rounded-xl p-4 mb-6"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-blue-700 font-medium">
                        Found {sortedStocks.length} stock{sortedStocks.length !== 1 ? 's' : ''} matching "{searchTerm}"
                      </p>
                      <p className="text-blue-600 text-sm mt-1">Click on any stock to view detailed analysis</p>
                    </div>
                    <button 
                      className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                      onClick={() => setSearchTerm('')}
                    >
                      Clear search
                    </button>
                  </div>
                </motion.div>
              )}
              
              {sortedStocks.length > 0 ? (
                <>
                  <motion.div 
                    layout
                    className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mb-6"
                  >
                    {paginatedRemainingStocks.map((stock, index) => (
                      <motion.div
                        key={stock.symbol}
                        layout
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.2, delay: index * 0.03 }}
                        whileHover={{ 
                          y: -6,
                          boxShadow: '0 20px 40px -15px rgba(139, 92, 246, 0.2)'
                        }}
                        className="bg-gradient-to-br from-white to-gray-50 hover:from-purple-50/30 hover:to-white rounded-xl p-4 cursor-pointer transition-all duration-300 border border-gray-200/50 hover:border-purple-200 h-[140px] flex flex-col justify-between relative overflow-hidden group"
                        onClick={() => handleStockClick(stock)}
                      >
                        {/* Gradient overlay on hover */}
                        <div className="absolute inset-0 bg-gradient-to-r from-purple-500/0 via-purple-500/5 to-purple-500/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
                        
                        {/* Stock Logo */}
                        <div className="absolute top-3 right-3 w-10 h-10 group-hover:rotate-12 transition-transform duration-300">
                          <div className="relative">
                            <img 
                              src={getStockLogo(stock.symbol)} 
                              alt={stock.symbol}
                              className="w-full h-full rounded-lg object-cover border border-gray-200 shadow-sm group-hover:shadow-md"
                              onError={(e) => {
                                e.target.style.display = 'none';
                                e.target.nextElementSibling.style.display = 'flex';
                              }}
                            />
                            <div 
                              className="w-full h-full rounded-lg flex items-center justify-center text-white font-bold text-lg hidden shadow-inner"
                              style={{ backgroundColor: getStockColor(stock.symbol) }}
                            >
                              {getStockInitial(stock.symbol)}
                            </div>
                          </div>
                        </div>
                        
                        {/* Stock Info */}
                        <div className="pr-12 relative z-10">
                          <div className="font-bold text-gray-800 text-sm group-hover:text-purple-700 transition-colors">{stock.symbol}</div>
                          <div className="text-xs text-gray-600 truncate group-hover:text-gray-800 transition-colors">{stock.companyName || stock.symbol}</div>
                        </div>
                        
                        {/* Stock Details */}
                        <div className="pr-12 relative z-10">
                          <div className="font-semibold text-gray-800 text-lg group-hover:text-purple-800 transition-colors">
                            {formatCurrency(stock.priceInfo?.lastPrice)}
                          </div>
                          <motion.div 
                            initial={false}
                            animate={{ 
                              scale: stock.priceInfo?.pChange !== 0 ? [1, 1.05, 1] : 1 
                            }}
                            transition={{ 
                              duration: 0.5,
                              repeat: stock.priceInfo?.pChange !== 0 ? Infinity : 0,
                              repeatDelay: 3 
                            }}
                            className={`text-xs font-medium px-3 py-1.5 rounded-full inline-block mt-1 border ${getChangeClass(stock.priceInfo?.pChange)}`}
                          >
                            {formatPercentage(stock.priceInfo?.pChange)}
                          </motion.div>
                        </div>
                      </motion.div>
                    ))}
                  </motion.div>
                  
                  {/* Pagination Controls */}
                  {!showAllStocks && totalPages > 1 && (
                    <motion.div 
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="flex flex-col sm:flex-row justify-between items-center gap-4 pt-8 border-t border-gray-200"
                    >
                      <motion.button 
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className={`px-5 py-2.5 rounded-xl font-medium transition-all duration-300 ${currentPage === 1 ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-gradient-to-r from-gray-100 to-gray-50 text-gray-700 hover:from-gray-200 hover:to-gray-100 shadow-sm hover:shadow'}`}
                        onClick={handlePrevPage}
                        disabled={currentPage === 1}
                      >
                        ← Previous
                      </motion.button>
                      
                      <div className="flex items-center gap-2">
                        {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                          let pageNum;
                          if (totalPages <= 5) {
                            pageNum = i + 1;
                          } else if (currentPage <= 3) {
                            pageNum = i + 1;
                          } else if (currentPage >= totalPages - 2) {
                            pageNum = totalPages - 4 + i;
                          } else {
                            pageNum = currentPage - 2 + i;
                          }
                          
                          return (
                            <motion.button
                              key={pageNum}
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              className={`w-10 h-10 flex items-center justify-center rounded-lg font-medium transition-all duration-300 ${currentPage === pageNum ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg' : 'bg-gray-100 text-gray-700 hover:bg-gray-200 shadow-sm hover:shadow'}`}
                              onClick={() => handlePageClick(pageNum)}
                            >
                              {pageNum}
                            </motion.button>
                          );
                        })}
                        
                        {totalPages > 5 && (
                          <span className="text-gray-400 mx-2">...</span>
                        )}
                      </div>
                      
                      <div className="text-sm text-gray-600">
                        Page <span className="font-bold">{currentPage}</span> of <span className="font-bold">{totalPages}</span>
                      </div>
                      
                      <motion.button 
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className={`px-5 py-2.5 rounded-xl font-medium transition-all duration-300 ${currentPage === totalPages ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-gradient-to-r from-gray-100 to-gray-50 text-gray-700 hover:from-gray-200 hover:to-gray-100 shadow-sm hover:shadow'}`}
                        onClick={handleNextPage}
                        disabled={currentPage === totalPages}
                      >
                        Next →
                      </motion.button>
                    </motion.div>
                  )}
                </>
              ) : (
                <div className="text-center py-12">
                  <div className="w-20 h-20 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-3xl">🔍</span>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-700 mb-2">No stocks found</h3>
                  <p className="text-gray-500 max-w-md mx-auto">
                    {searchTerm ? 'No stocks match your search criteria. Try a different search term.' : 'No additional stocks available at the moment.'}
                  </p>
                </div>
              )}
            </div>
          </motion.section>
        )}

        {/* Footer */}
        <motion.footer 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-12 pt-8 border-t border-gray-200/50 text-center"
        >
          <p className="text-gray-500 text-sm">
            Data updates every 30 seconds • Last refresh: {formatTime(lastUpdated)}
          </p>
          <p className="text-gray-400 text-xs mt-2">
            Stock data is for demonstration purposes. Always verify with official sources.
          </p>
        </motion.footer>
      </div>

      {/* Custom CSS for animations */}
      <style>{`
        @keyframes blob {
          0% {
            transform: translate(0px, 0px) scale(1);
          }
          33% {
            transform: translate(30px, -50px) scale(1.1);
          }
          66% {
            transform: translate(-20px, 20px) scale(0.9);
          }
          100% {
            transform: translate(0px, 0px) scale(1);
          }
        }
        
        .animate-blob {
          animation: blob 7s infinite;
        }
        
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        
        .animation-delay-4000 {
          animation-delay: 4s;
        }
        
        /* Smooth transitions */
        * {
          transition: background-color 0.2s ease-in-out;
        }
      `}</style>
    </div>
  );
};

export default StockDashboard;