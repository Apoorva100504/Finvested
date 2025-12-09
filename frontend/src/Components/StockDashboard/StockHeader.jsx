

import React, { useState, useEffect } from 'react';
import StockChart from './StockChart';
import KYCForm from '../login/KYCForm';
import BuyModal from './BuyStock.jsx';
import { FiPlus, FiCheck, FiX, FiChevronDown } from 'react-icons/fi';
import { FaStar, FaRegStar } from 'react-icons/fa';

const StockHeader = ({ companyName, priceInfo, historicalData, onBack }) => {
  const [showKYC, setShowKYC] = useState(false);
  const [showBuySell, setShowBuySell] = useState(false);
  const [showWatchlistDropdown, setShowWatchlistDropdown] = useState(false);
  const [showCreateWatchlist, setShowCreateWatchlist] = useState(false);
  const [kycCompleted, setKycCompleted] = useState(false);
  const [tradeType, setTradeType] = useState('buy');
  const [newWatchlistName, setNewWatchlistName] = useState('');
  const [isInWatchlist, setIsInWatchlist] = useState(false);
  const [watchlists, setWatchlists] = useState([]);
  const [currentStockSymbol, setCurrentStockSymbol] = useState('');
  
  // Mock watchlists data - in real app, this would come from context/API
  const mockWatchlists = [
    { id: 1, name: 'My Favorites', stocks: ['AAPL', 'GOOGL'], count: 2 },
    { id: 2, name: 'Tech Giants', stocks: ['MSFT', 'META', 'NFLX'], count: 3 },
    { id: 3, name: 'Indian Stocks', stocks: ['RELIANCE', 'TCS'], count: 2 },
    { id: 4, name: 'Long Term', stocks: [], count: 0 },
  ];
  
  // Mock current stock info - extract from companyName or props
  const currentStock = {
    symbol: companyName.split(' ')[0].toUpperCase() || 'STOCK',
    name: companyName,
    price: priceInfo?.lastPrice || 0,
    change: priceInfo?.change || 0,
    changePercent: priceInfo?.pChange || 0,
  };

  // Load data on component mount
  useEffect(() => {
    // Load KYC status
    const kycStatus = localStorage.getItem('kycStatus');
    if (kycStatus === 'verified') {
      setKycCompleted(true);
    }
    
    // Load watchlists from localStorage or use mock data
    const savedWatchlists = localStorage.getItem('userWatchlists');
    if (savedWatchlists) {
      setWatchlists(JSON.parse(savedWatchlists));
    } else {
      setWatchlists(mockWatchlists);
    }
    
    // Check if stock is already in any watchlist
    checkIfInWatchlist();
    
    // Extract symbol from company name
    const symbol = extractSymbol(companyName);
    setCurrentStockSymbol(symbol);
  }, [companyName]);

  const extractSymbol = (companyName) => {
    // Simple extraction - first word as symbol
    return companyName.split(' ')[0].toUpperCase();
  };

  const checkIfInWatchlist = () => {
    const symbol = extractSymbol(companyName);
    const savedWatchlists = localStorage.getItem('userWatchlists');
    const watchlistsData = savedWatchlists ? JSON.parse(savedWatchlists) : mockWatchlists;
    
    const isInAnyWatchlist = watchlistsData.some(watchlist => 
      watchlist.stocks.includes(symbol)
    );
    
    setIsInWatchlist(isInAnyWatchlist);
  };

  const formatNumber = (value) => {
    if (!value || isNaN(value)) return '0.00';
    return parseFloat(value).toLocaleString('en-IN', { 
      minimumFractionDigits: 2, 
      maximumFractionDigits: 2 
    });
  };

  const formatPercentage = (value) => {
    if (!value || isNaN(value)) return '0.00%';
    const numValue = parseFloat(value);
    const sign = numValue >= 0 ? '+' : '';
    return `${sign}${numValue.toFixed(2)}%`;
  };

  const handleUnlockStocks = () => {
    setShowKYC(true);
  };

  const handleKYCClose = () => {
    setShowKYC(false);
    const kycStatus = localStorage.getItem('kycStatus');
    if (kycStatus === 'verified') {
      setKycCompleted(true);
    }
  };

  const handleKYCVerified = () => {
    setKycCompleted(true);
    setShowKYC(false);
  };

  const handleBuySell = (type) => {
    setTradeType(type);
    setShowBuySell(true);
  };

  const toggleWatchlistDropdown = () => {
    setShowWatchlistDropdown(!showWatchlistDropdown);
    if (showCreateWatchlist) setShowCreateWatchlist(false);
  };

  const handleAddToWatchlist = (watchlistId) => {
    const symbol = extractSymbol(companyName);
    const updatedWatchlists = watchlists.map(watchlist => {
      if (watchlist.id === watchlistId) {
        // Check if stock already exists
        if (!watchlist.stocks.includes(symbol)) {
          const updatedStocks = [...watchlist.stocks, symbol];
          return {
            ...watchlist,
            stocks: updatedStocks,
            count: updatedStocks.length
          };
        }
      }
      return watchlist;
    });
    
    setWatchlists(updatedWatchlists);
    localStorage.setItem('userWatchlists', JSON.stringify(updatedWatchlists));
    setIsInWatchlist(true);
    setShowWatchlistDropdown(false);
    
    // Show success feedback
    const watchlistName = updatedWatchlists.find(w => w.id === watchlistId)?.name;
    alert(`${symbol} added to "${watchlistName}" successfully!`);
  };

  const handleRemoveFromWatchlist = () => {
    const symbol = extractSymbol(companyName);
    const updatedWatchlists = watchlists.map(watchlist => ({
      ...watchlist,
      stocks: watchlist.stocks.filter(stock => stock !== symbol),
      count: watchlist.stocks.filter(stock => stock !== symbol).length
    }));
    
    setWatchlists(updatedWatchlists);
    localStorage.setItem('userWatchlists', JSON.stringify(updatedWatchlists));
    setIsInWatchlist(false);
    setShowWatchlistDropdown(false);
    
    alert(`${symbol} removed from all watchlists!`);
  };

  const handleCreateWatchlist = () => {
    if (newWatchlistName.trim()) {
      const newWatchlist = {
        id: Date.now(),
        name: newWatchlistName,
        stocks: [extractSymbol(companyName)],
        count: 1
      };
      
      const updatedWatchlists = [...watchlists, newWatchlist];
      setWatchlists(updatedWatchlists);
      localStorage.setItem('userWatchlists', JSON.stringify(updatedWatchlists));
      setNewWatchlistName('');
      setShowCreateWatchlist(false);
      setIsInWatchlist(true);
      
      alert(`Created "${newWatchlistName}" and added ${extractSymbol(companyName)}!`);
    }
  };

  const handleToggleWatchlist = () => {
    if (isInWatchlist) {
      handleRemoveFromWatchlist();
    } else {
      setShowWatchlistDropdown(true);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow mb-4 p-6">
      
      {/* Back Button */}
      <div className="mb-4">
        <button 
          className="text-blue-600 hover:text-blue-800 font-medium flex items-center text-sm"
          onClick={onBack}
        >
          ← Back
        </button>
      </div>

      {/* Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* LEFT SIDE */}
        <div className={kycCompleted ? "lg:col-span-2" : "lg:col-span-2 space-y-4"}>
          
          {/* Title & Price */}
          <div className="mb-2">
            <h1 className="text-lg font-bold text-gray-900 mb-1">{companyName}</h1>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-bold text-gray-900">₹{formatNumber(priceInfo?.lastPrice || 0)}</span>
              <span className={`text-sm font-semibold ${priceInfo?.change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {priceInfo?.change >= 0 ? '+' : ''}{formatNumber(priceInfo?.change || 0)}
                ({formatPercentage(priceInfo?.pChange || 0)}) 1D
              </span>
            </div>
          </div>

          {/* Unlock stocks Badge */}
          <div className="flex justify-between items-center mb-2">
            <div className="font-bold text-gray-900 text-sm relative">
              <span className="relative z-10">UNLOCK STOCKS</span>
              <div className="absolute -inset-1 bg-green-100/30 blur-sm rounded-lg"></div>
              <div className="absolute -inset-1 bg-gradient-to-r from-green-50/40 to-emerald-50/40 rounded-lg"></div>
            </div>
          </div>
          
          {/* Watchlist + Alert */}
          <div className="absolute top-6 right-6 z-10 flex gap-2">
            <button className="px-3 py-1.5 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 text-xs font-medium flex items-center gap-1">
              🔔 Alert
            </button>
            
            {/* Watchlist Button with Dropdown */}
            <div className="relative">
              <button 
                onClick={handleToggleWatchlist}
                className="px-3 py-1.5 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 text-xs font-medium flex items-center gap-1"
              >
                {isInWatchlist ? (
                  <>
                    <FaStar className="text-yellow-500" size={12} /> 
                    <span>In Watchlist</span>
                  </>
                ) : (
                  <>
                    <FaRegStar size={12} />
                    <span>Watchlist</span>
                  </>
                )}
                <FiChevronDown size={12} />
              </button>
              
              {/* Watchlist Dropdown */}
              {showWatchlistDropdown && (
                <div className="absolute top-full right-0 mt-1 w-56 bg-white rounded-lg shadow-lg border border-gray-200 z-50 overflow-hidden">
                  <div className="p-3 border-b border-gray-100">
                    <div className="text-sm font-medium text-gray-700">Add to watchlist</div>
                    <div className="text-xs text-gray-500 truncate">{companyName}</div>
                  </div>
                  
                  <div className="max-h-48 overflow-y-auto">
                    {watchlists.map((watchlist) => (
                      <button
                        key={watchlist.id}
                        onClick={() => handleAddToWatchlist(watchlist.id)}
                        className="w-full flex items-center justify-between p-3 hover:bg-blue-50 text-left border-b border-gray-50"
                      >
                        <div>
                          <div className="text-sm font-medium text-gray-800">{watchlist.name}</div>
                          <div className="text-xs text-gray-500">{watchlist.count} stocks</div>
                        </div>
                        {watchlist.stocks.includes(currentStockSymbol) && (
                          <FiCheck className="text-green-500" size={16} />
                        )}
                      </button>
                    ))}
                    
                    {/* Create New Watchlist Option */}
                    {showCreateWatchlist ? (
                      <div className="p-3 border-t border-gray-100">
                        <input
                          type="text"
                          placeholder="Watchlist name"
                          value={newWatchlistName}
                          onChange={(e) => setNewWatchlistName(e.target.value)}
                          className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg mb-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          onKeyPress={(e) => e.key === 'Enter' && handleCreateWatchlist()}
                          autoFocus
                        />
                        <div className="flex gap-2">
                          <button
                            onClick={handleCreateWatchlist}
                            className="flex-1 px-3 py-1.5 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700"
                          >
                            Create
                          </button>
                          <button
                            onClick={() => setShowCreateWatchlist(false)}
                            className="px-3 py-1.5 text-gray-600 hover:text-gray-800"
                          >
                            <FiX size={16} />
                          </button>
                        </div>
                      </div>
                    ) : (
                      <button
                        onClick={() => setShowCreateWatchlist(true)}
                        className="w-full flex items-center gap-2 p-3 hover:bg-blue-50 text-blue-600 text-sm font-medium border-t border-gray-100"
                      >
                        <FiPlus size={14} />
                        Create new watchlist
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
          {/* Chart */}
          <div className={`border border-gray-200 rounded-lg p-4 bg-white mb-4 relative ${kycCompleted ? 'h-96' : 'h-80'}`}>
            
           

            <StockChart historicalData={historicalData} />
          </div>

          {/* Time Period Buttons */}
          <div className="flex flex-wrap gap-6 mb-4">
            <button className="px-3 py-1.5 bg-blue-600 text-white text-xs font-medium rounded">1D</button>
            <button className="px-3 py-1.5 bg-gray-100 text-gray-700 text-xs font-medium rounded">1W</button>
            <button className="px-3 py-1.5 bg-gray-100 text-gray-700 text-xs font-medium rounded">3M</button>
            <button className="px-3 py-1.5 bg-gray-100 text-gray-700 text-xs font-medium rounded">6M</button>
            <button className="px-3 py-1.5 bg-gray-100 text-gray-700 text-xs font-medium rounded">1Y</button>
            <button className="px-3 py-1.5 bg-gray-100 text-gray-700 text-xs font-medium rounded">3Y</button>
            <button className="px-3 py-1.5 bg-gray-100 text-gray-700 text-xs font-medium rounded">5Y</button>
            <button className="px-3 py-1.5 bg-gray-100 text-gray-700 text-xs font-medium rounded">All</button>
            <button className="px-3 py-1.5 bg-gray-100 text-gray-700 text-xs font-medium rounded">4Y</button>
          </div>

          {/* Exchange */}
          <div className="flex items-center gap-3 pt-3 border-t border-gray-200">
            <span className="text-xs font-medium text-blue-600">NSE</span>
            <span className="text-gray-300 text-xs">|</span>
            <span className="text-xs text-gray-500 cursor-pointer hover:text-gray-700">HSE</span>
          </div>
        </div>

        {/* RIGHT SIDE */}
        <div className="space-y-4">
          {!kycCompleted ? (
            /* BEFORE KYC - Unlock Stocks Card */
            <div className="relative bg-gradient-to-r from-emerald-50/80 to-green-50/80 border border-emerald-100 rounded-xl p-5 mt-16 overflow-hidden">
              
              <div className="absolute -top-20 -right-20 w-40 h-40 bg-emerald-200/20 rounded-full blur-2xl"></div>
              <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-green-200/20 rounded-full blur-2xl"></div>

              <div className="relative z-10 flex items-center gap-2 mb-3">
                <div className="w-8 h-8 bg-gradient-to-br from-emerald-100 to-green-100 rounded-lg flex items-center justify-center">
                  <span className="text-emerald-600 text-sm font-bold">🔓</span>
                </div>
                <h3 className="font-bold text-gray-900 text-base">Looking to invest in stocks?</h3>
              </div>

              <p className="text-gray-600 text-xs mb-4 z-10 relative">
                Complete KYC verification to unlock full trading features
              </p>

              <button 
                onClick={handleUnlockStocks}
                className="relative w-full bg-gradient-to-r from-emerald-500 to-green-500 text-white px-4 py-2.5 rounded-lg font-medium text-sm hover:from-emerald-600 hover:to-green-600 shadow-sm hover:shadow-md z-10"
              >
                UNLOCK STOCKS
              </button>

              <div className="absolute inset-0 border-2 border-emerald-200/30 rounded-xl pointer-events-none"></div>
            </div>
          ) : (
            /* AFTER KYC - Trading Card */
            <div className="mt-24 ">
              
             {/* BUY/SELL MODAL (only one modal used) */}
      <BuyModal
        isOpen={showBuySell}
        onClose={() => setShowBuySell(false)}
        type={tradeType}          // "buy" or "sell"
        stockName={companyName}
        currentPrice={priceInfo?.lastPrice}
      />     
            </div>
          )}
        </div>
      </div>

      {/* KYC Modal */}
      <KYCForm 
        isOpen={showKYC} 
        onClose={handleKYCClose}
        onVerified={handleKYCVerified}
      />

      

    </div>
  );
};

export default StockHeader;
