import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FiBarChart2 } from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";

export default function HoldingsUI() {
  // Mock data for holdings
  const navigate = useNavigate();
  
  const initialHoldings = [
    {
      id: 1,
      name: "Bank of Baroda",
      symbol: "BANKBARODA",
      shares: 1,
      currentPrice: 168.85,
      investedPrice: 161.85,
      change: 0.00,
      changePercent: 0.00,
      sector: "Banking",
      marketCap: "Large Cap"
    },
    {
      id: 2,
      name: "Reliance Industries",
      symbol: "RELIANCE",
      shares: 5,
      currentPrice: 2450.75,
      investedPrice: 2300.50,
      change: 12.25,
      changePercent: 0.50,
      sector: "Energy",
      marketCap: "Large Cap"
    },
    {
      id: 3,
      name: "TCS",
      symbol: "TCS",
      shares: 2,
      currentPrice: 3850.25,
      investedPrice: 3800.00,
      change: -15.50,
      changePercent: -0.40,
      sector: "IT",
      marketCap: "Large Cap"
    },
    {
      id: 4,
      name: "Infosys",
      symbol: "INFY",
      shares: 3,
      currentPrice: 1520.80,
      investedPrice: 1500.00,
      change: 8.20,
      changePercent: 0.54,
      sector: "IT",
      marketCap: "Large Cap"
    },
    {
      id: 5,
      name: "HDFC Bank",
      symbol: "HDFCBANK",
      shares: 4,
      currentPrice: 1675.60,
      investedPrice: 1600.00,
      change: 25.35,
      changePercent: 1.52,
      sector: "Banking",
      marketCap: "Large Cap"
    },
    {
      id: 6,
      name: "ICICI Bank",
      symbol: "ICICIBANK",
      shares: 6,
      currentPrice: 1050.25,
      investedPrice: 980.50,
      change: 12.75,
      changePercent: 1.22,
      sector: "Banking",
      marketCap: "Large Cap"
    }
  ];

  // State management
  const [holdings, setHoldings] = useState(initialHoldings);
  const [selectedHolding, setSelectedHolding] = useState(initialHoldings[0]);
  const [sortBy, setSortBy] = useState("currentValue");
  const [sortOrder, setSortOrder] = useState("desc");
  const [showSortDropdown, setShowSortDropdown] = useState(false);
  const [totalPortfolioValue, setTotalPortfolioValue] = useState(0);
  const [totalReturns, setTotalReturns] = useState(0);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(new Date());

  // Calculate portfolio totals
  useEffect(() => {
    const totalValue = holdings.reduce((sum, holding) => 
      sum + (holding.currentPrice * holding.shares), 0);
    const totalReturn = holdings.reduce((sum, holding) => 
      sum + ((holding.currentPrice - holding.investedPrice) * holding.shares), 0);
    
    setTotalPortfolioValue(totalValue);
    setTotalReturns(totalReturn);
  }, [holdings]);

  // Auto update time
  useEffect(() => {
    const interval = setInterval(() => {
      setLastUpdated(new Date());
    }, 60000);
    
    return () => clearInterval(interval);
  }, []);

  // Sort options
  const sortOptions = [
    { key: 'currentValue', label: 'Current Value (High to Low)', icon: '💰' },
    { key: 'nameAsc', label: 'Name (A to Z)', icon: '🔤' },
    { key: 'nameDesc', label: 'Name (Z to A)', icon: '🔤' },
    { key: 'returns', label: 'Returns (High to Low)', icon: '📈' },
    { key: 'dayChange', label: '1D Change (High to Low)', icon: '⚡' },
    { key: 'invested', label: 'Invested Amount (High to Low)', icon: '💼' },
    { key: 'sector', label: 'Sector', icon: '🏢' },
  ];

  const handleAnalyticsClick = () => {
    navigate("/portfolio");
  };

  const getSelectedHoldingDetails = (holding) => {
    const currentValue = holding.currentPrice * holding.shares;
    const investedValue = holding.investedPrice * holding.shares;
    const returns = currentValue - investedValue;
    const returnsPercent = investedValue > 0 ? (returns / investedValue) * 100 : 0;
    const dayChange = holding.change * holding.shares;
    const dayChangePercent = holding.changePercent;
    const portfolioPercentage = totalPortfolioValue > 0 ? 
      (currentValue / totalPortfolioValue) * 100 : 0;

    return {
      currentValue,
      investedValue,
      returns,
      returnsPercent,
      dayChange,
      dayChangePercent,
      portfolioPercentage
    };
  };

  // Handle holding click
  const handleHoldingClick = (holding) => {
    setSelectedHolding(holding);
  };

  // Handle sort selection
  const handleSortSelect = (optionKey) => {
    let newSortBy = optionKey;
    let newSortOrder = "desc";
    
    if (optionKey === "nameAsc") {
      newSortBy = "name";
      newSortOrder = "asc";
    } else if (optionKey === "nameDesc") {
      newSortBy = "name";
      newSortOrder = "desc";
    } else if (optionKey === "sector") {
      newSortBy = "sector";
      newSortOrder = "asc";
    } else {
      newSortBy = optionKey;
    }
    
    setSortBy(newSortBy);
    setSortOrder(newSortOrder);
    setShowSortDropdown(false);
  };

  // Sort holdings
  const sortedHoldings = [...holdings].sort((a, b) => {
    let aValue, bValue;
    
    switch(sortBy) {
      case 'name':
        aValue = a.name.toLowerCase();
        bValue = b.name.toLowerCase();
        return sortOrder === 'asc' ? aValue.localeCompare(bValue) : bValue.localeCompare(aValue);
      case 'sector':
        aValue = a.sector?.toLowerCase() || '';
        bValue = b.sector?.toLowerCase() || '';
        return sortOrder === 'asc' ? aValue.localeCompare(bValue) : bValue.localeCompare(aValue);
      case 'returns':
        aValue = (a.currentPrice - a.investedPrice) * a.shares;
        bValue = (b.currentPrice - b.investedPrice) * b.shares;
        break;
      case 'dayChange':
        aValue = a.change * a.shares;
        bValue = b.change * b.shares;
        break;
      case 'invested':
        aValue = a.investedPrice * a.shares;
        bValue = b.investedPrice * b.shares;
        break;
      case 'currentValue':
      default:
        aValue = a.currentPrice * a.shares;
        bValue = b.currentPrice * b.shares;
        break;
    }
    
    return sortOrder === 'asc' ? aValue - bValue : bValue - aValue;
  });

  // Get current sort label
  const getCurrentSortLabel = () => {
    const option = sortOptions.find(opt => {
      if (sortBy === 'name') {
        return opt.key === (sortOrder === 'asc' ? 'nameAsc' : 'nameDesc');
      }
      if (sortBy === 'sector') {
        return opt.key === 'sector';
      }
      return opt.key === sortBy;
    });
    return option ? option.label : 'Sort by';
  };

  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  // Format number with commas
  const formatNumber = (num) => {
    return num.toLocaleString('en-IN', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
  };

  // Get color based on value
  const getValueColor = (value) => {
    return value >= 0 ? 'text-green-600' : 'text-red-600';
  };

  // Format time
  const formatTime = (date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  };

  // Format date
  const formatDate = (date) => {
    return date.toLocaleDateString('en-IN', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  // Handle refresh
  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setLastUpdated(new Date());
      setIsRefreshing(false);
    }, 1000);
  };

  const selectedDetails = getSelectedHoldingDetails(selectedHolding);
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50/30 px-16">
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
            <div className="group animate-fadeInUp">
              <h1 className="text-4xl font-bold bg-gray-600 bg-clip-text text-transparent transition-all duration-300 group-hover:tracking-wide">
                Holdings
              </h1>
              <p className="text-gray-700 text-sm mt-1 relative inline-block group-hover:font-medium">
                Your Investment Portfolio
                <span className="absolute left-0 -bottom-1 w-0 h-[2px] bg-[#48E1C4] rounded-full transition-all duration-300 group-hover:w-full"></span>
              </p>
              <p className="font-semibold text-gray-600 mt-1">
                {formatDate(lastUpdated)} • Last updated: {formatTime(lastUpdated)}
              </p>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="text-sm text-gray-500">Total Portfolio Value</p>
                <p className="text-2xl font-bold tracking-tight">{formatCurrency(totalPortfolioValue)}</p>
                <p className={`text-sm font-medium ${getValueColor(totalReturns)}`}>
                  {totalReturns >= 0 ? '+' : ''}{formatCurrency(totalReturns)} 
                  <span className="text-gray-600 ml-1">total returns</span>
                </p>
              </div>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleAnalyticsClick}
                className="ml-4 p-3 rounded-xl bg-white border border-[#5064FF]/20 hover:bg-[#5064FF]/10 transition-all duration-300 shadow-sm hover:shadow-md"
                title="Go to portfolio analytics"
              >
                <FiBarChart2 className="w-6 h-6 text-[#5064FF]" />
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleRefresh}
                disabled={isRefreshing}
                className="gradient-hover p-3 rounded-xl bg-white border border-[#48E1C4]/20 hover:bg-[#48E1C4]/10 transition-all duration-300 shadow-sm hover:shadow-md"
                title="Refresh data"
              >
                <svg 
                  className={`w-5 h-5 text-[#48E1C4] ${isRefreshing ? 'animate-spin' : ''}`} 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
              </motion.button>
            </div>
          </div>
          <div className="h-1 w-24 bg-gradient-to-r from-[#5064FF] to-[#48E1C4] rounded-full mt-2"></div>
        </motion.header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Selected Holding Details */}
          <div className="lg:col-span-2">
            {/* Selected Holding Summary Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="gradient-hover bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-100/50 p-6 mb-6 relative overflow-hidden group"
            >
              {/* Header with symbol and sector */}
              <div className="flex justify-between items-start mb-6">
                <div className="flex items-center gap-4">
                  <div className="logo-hover relative w-12 h-12">
                    <div className="w-full h-full rounded-xl flex items-center justify-center bg-gradient-to-br from-[#5064FF]/20 to-[#48E1C4]/20 shadow-sm group-hover:scale-105 transition-transform duration-300">
                      <span className="font-bold text-xl text-[#5064FF]">
                        {selectedHolding.symbol.charAt(0)}
                      </span>
                    </div>
                  </div>
                  <div>
                    <h2 className="font-bold text-2xl text-gray-900">{selectedHolding.name}</h2>
                    <div className="flex items-center gap-3 mt-1">
                      <span className="text-sm font-medium text-gray-500">{selectedHolding.symbol}</span>
                      <span className="text-xs px-2 py-1 bg-[#5064FF]/10 text-[#5064FF] rounded-full">
                        {selectedHolding.sector}
                      </span>
                      <span className="text-xs px-2 py-1 bg-[#48E1C4]/10 text-[#48E1C4] rounded-full">
                        {selectedHolding.marketCap}
                      </span>
                    </div>
                  </div>
                </div>
                
                <motion.div 
                  initial={false}
                  animate={{ 
                    scale: selectedDetails.returnsPercent !== 0 ? [1, 1.05, 1] : 1 
                  }}
                  transition={{ 
                    duration: 0.5,
                    repeat: selectedDetails.returnsPercent !== 0 ? Infinity : 0,
                    repeatDelay: 3 
                  }}
                  className={`px-3 py-1.5 rounded-lg inline-block ${selectedDetails.returns >= 0 ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'}`}
                >
                  <p className={`font-bold text-lg ${selectedDetails.returns >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {selectedDetails.returns >= 0 ? '↗' : '↘'} 
                    {selectedDetails.returnsPercent.toFixed(2)}%
                  </p>
                </motion.div>
              </div>

              {/* Main metrics */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                {/* Current Value */}
                <div className="gradient-hover bg-white rounded-xl border border-[#5064FF]/20 p-4 stock-card-hover">
                  <p className="text-sm text-gray-500 mb-2">Current Value</p>
                  <p className="text-2xl font-bold tracking-tight text-gray-900">
                    {formatCurrency(selectedDetails.currentValue)}
                  </p>
                  <div className="mt-2 text-xs text-gray-500 flex items-center">
                    <span className="w-2 h-2 bg-[#5064FF] rounded-full mr-2"></span>
                    {selectedDetails.portfolioPercentage.toFixed(1)}% of portfolio
                  </div>
                </div>

                {/* Invested Amount */}
                <div className="gradient-hover bg-white rounded-xl border border-[#5064FF]/20 p-4 stock-card-hover">
                  <p className="text-sm text-gray-500 mb-2">Invested Amount</p>
                  <p className="text-2xl font-bold tracking-tight text-gray-900">
                    {formatCurrency(selectedDetails.investedValue)}
                  </p>
                  <div className="mt-2 text-xs text-gray-500">
                    {selectedHolding.shares} shares @ ₹{formatNumber(selectedHolding.investedPrice)}
                  </div>
                </div>

                {/* 1D Change */}
                <div className={`gradient-hover rounded-xl p-4 stock-card-hover border ${selectedDetails.dayChange >= 0 ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'}`}>
                  <p className="text-sm text-gray-500 mb-2">1D Change</p>
                  <p className={`text-2xl font-bold tracking-tight ${selectedDetails.dayChange >= 0 ? 'text-green-600' : 'text-red-500'}`}>
                    {selectedDetails.dayChange >= 0 ? '+' : ''}{formatCurrency(selectedDetails.dayChange)}
                  </p>
                  <div className={`text-sm font-medium mt-2 ${selectedDetails.dayChange >= 0 ? 'text-green-600' : 'text-red-500'}`}>
                    ({selectedDetails.dayChangePercent.toFixed(2)}%)
                  </div>
                </div>
              </div>

              {/* Additional info */}
              <div className="flex justify-between items-center pt-4 border-t border-gray-100">
                <div className="text-sm text-gray-600">
                  <span className="font-medium text-[#5064FF]">Avg. Cost:</span> ₹{formatNumber(selectedHolding.investedPrice)}
                </div>
                <div className="text-sm text-gray-600">
                  <span className="font-medium text-[#48E1C4]">LTP:</span> ₹{formatNumber(selectedHolding.currentPrice)}
                </div>
                <div className="text-sm text-gray-600">
                  <span className="font-medium text-[#5064FF]">Qty:</span> {selectedHolding.shares} shares
                </div>
              </div>
            </motion.div>

            {/* Holdings List */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="gradient-hover bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-100/50 overflow-hidden"
            >
              {/* Sort Header */}
              <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
                <div className="flex items-center gap-2">
                  <div className="relative">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setShowSortDropdown(!showSortDropdown)}
                      className="flex items-center gap-2 bg-[#5064FF]/5 hover:bg-[#5064FF]/10 px-4 py-2.5 rounded-xl transition-all duration-300 border border-[#5064FF]/20"
                    >
                      <svg className="w-4 h-4 text-[#5064FF]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4h13M3 8h9m-9 4h9m5-4v12m0 0l-4-4m4 4l4-4" />
                      </svg>
                      <span className="font-medium text-gray-700">{getCurrentSortLabel()}</span>
                      <svg className={`w-4 h-4 text-gray-700 transition-transform duration-200 ${showSortDropdown ? 'rotate-180' : ''}`} 
                           fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </motion.button>

                    {/* Dropdown */}
                    <AnimatePresence>
                      {showSortDropdown && (
                        <>
                          <div className="fixed inset-0 z-40" onClick={() => setShowSortDropdown(false)} />
                          <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="absolute top-full left-0 mt-2 w-72 bg-white border border-[#5064FF]/20 rounded-xl shadow-lg z-50 py-2 overflow-hidden"
                          >
                            <div className="px-4 py-3 border-b border-gray-100 bg-[#5064FF]/5">
                              <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Sort Holdings By
                              </p>
                            </div>
                            {sortOptions.map((option) => {
                              const isSelected =
                                (sortBy === 'name' && option.key === (sortOrder === 'asc' ? 'nameAsc' : 'nameDesc')) ||
                                (sortBy === 'sector' && option.key === 'sector') ||
                                (sortBy === option.key && option.key !== 'nameAsc' && option.key !== 'nameDesc');

                              return (
                                <motion.button
                                  key={option.key}
                                  whileHover={{ scale: 1.02 }}
                                  whileTap={{ scale: 0.98 }}
                                  onClick={() => handleSortSelect(option.key)}
                                  className={`w-full text-left px-4 py-3 flex items-center gap-3 hover:bg-[#5064FF]/5 transition-all duration-150 group ${
                                    isSelected ? 'bg-gradient-to-r from-[#5064FF]/10 to-[#48E1C4]/10 text-[#5064FF]' : 'text-gray-700'
                                  }`}
                                >
                                  <span className={`text-lg transition-transform group-hover:scale-110 ${
                                    isSelected ? 'text-[#5064FF]' : 'text-gray-400'
                                  }`}>
                                    {option.icon}
                                  </span>
                                  <div className="flex-1">
                                    <p className="text-sm font-medium">{option.label}</p>
                                  </div>
                                  {isSelected && (
                                    <svg className="w-4 h-4 text-[#5064FF] animate-pulse" 
                                         fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                    </svg>
                                  )}
                                </motion.button>
                              );
                            })}
                          </motion.div>
                        </>
                      )}
                    </AnimatePresence>
                  </div>
                </div>

                {/* Price / Value headings */}
                <div className="flex items-center gap-12">
                  <p className="text-sm font-medium text-gray-600">Price</p>
                  <p className="text-sm font-medium text-gray-600">Value</p>
                </div>
              </div>

              {/* Holdings List Items */}
              <div className="max-h-[500px] overflow-y-auto">
                <AnimatePresence>
                  {sortedHoldings.map((holding, index) => {
                    const currentValue = holding.currentPrice * holding.shares;
                    const investedValue = holding.investedPrice * holding.shares;
                    const returns = currentValue - investedValue;
                    const isSelected = selectedHolding.id === holding.id;

                    return (
                      <motion.div
                        key={holding.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                        transition={{ duration: 0.2, delay: index * 0.03 }}
                        onClick={() => handleHoldingClick(holding)}
                        className={`gradient-hover stock-card-hover flex items-center gap-4 px-6 py-4 border-b border-gray-100 last:border-b-0 cursor-pointer relative overflow-hidden group ${
                          isSelected 
                            ? 'bg-gradient-to-r from-[#5064FF]/10 to-[#48E1C4]/10' 
                            : 'hover:bg-gradient-to-r hover:from-[#5064FF]/5 hover:via-white hover:to-[#48E1C4]/5'
                        }`}
                      >
                        {/* Company Icon */}
                        <div className={`logo-hover w-10 h-10 rounded-lg flex items-center justify-center shadow-sm transition-transform group-hover:scale-110 ${
                          isSelected ? 'bg-gradient-to-br from-[#5064FF]/20 to-[#48E1C4]/20' : 'bg-gray-100'
                        }`}>
                          <span className={`font-bold ${isSelected ? 'text-[#5064FF]' : 'text-gray-600'}`}>
                            {holding.symbol.charAt(0)}
                          </span>
                        </div>

                        {/* Company Info */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <h3 className={`font-semibold truncate ${isSelected ? 'text-[#5064FF]' : 'text-gray-900'}`}>
                              {holding.name}
                            </h3>
                            <span className="text-xs px-2 py-0.5 bg-[#5064FF]/10 text-[#5064FF] rounded-full">
                              {holding.sector}
                            </span>
                          </div>

                          <div className="flex items-center gap-3 mt-1">
                            <p className="text-sm text-gray-500">{holding.symbol}</p>
                            <p className="text-xs text-gray-400">
                              {holding.shares} share{holding.shares !== 1 ? 's' : ''}
                            </p>
                          </div>
                        </div>

                        {/* Price and Value Columns */}
                        <div className="flex items-center gap-12">
                          {/* Price Column */}
                          <div className="text-right">
                            <p className="font-bold text-gray-900">
                              ₹{formatNumber(holding.currentPrice)}
                            </p>
                            <motion.p 
                              initial={false}
                              animate={{ 
                                scale: holding.currentPrice >= holding.investedPrice ? [1, 1.05, 1] : 1 
                              }}
                              transition={{ 
                                duration: 0.5,
                                repeat: holding.currentPrice >= holding.investedPrice ? Infinity : 0,
                                repeatDelay: 3 
                              }}
                              className={`text-sm ${holding.currentPrice >= holding.investedPrice ? 'text-[#5064FF]' : 'text-red-500'}`}
                            >
                              {holding.currentPrice >= holding.investedPrice ? '↗' : '↘'} 
                              ₹{formatNumber(holding.investedPrice)}
                            </motion.p>
                          </div>

                          {/* Value Column */}
                          <div className="text-right w-28">
                            <p className="font-bold text-gray-900">
                              {formatCurrency(currentValue)}
                            </p>
                            <motion.p 
                              initial={false}
                              animate={{ 
                                scale: returns !== 0 ? [1, 1.05, 1] : 1 
                              }}
                              transition={{ 
                                duration: 0.5,
                                repeat: returns !== 0 ? Infinity : 0,
                                repeatDelay: 3 
                              }}
                              className={`text-sm font-medium ${returns >= 0 ? 'text-green-600' : 'text-red-500'}`}
                            >
                              {returns >= 0 ? '+' : ''}{formatCurrency(returns)}
                            </motion.p>
                          </div>
                        </div>

                        {/* Selection Indicator */}
                        <div className={`ml-2 transition-all duration-300 ${
                          isSelected ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
                        }`}>
                          {isSelected ? (
                            <div className="w-6 h-6 bg-gradient-to-r from-[#5064FF] to-[#48E1C4] rounded-full flex items-center justify-center">
                              <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                              </svg>
                            </div>
                          ) : (
                            <div className="w-2 h-2 bg-gray-300 rounded-full group-hover:bg-[#5064FF] transition-colors"></div>
                          )}
                        </div>
                      </motion.div>
                    );
                  })}
                </AnimatePresence>
              </div>
            </motion.div>

            {/* Action Button */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="mt-8"
            >
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="gradient-hover w-full text-center font-semibold py-3.5 px-4 rounded-xl
                          bg-white border-2 border-[#5064FF] text-[#5064FF]
                          hover:bg-[#5064FF]/5 hover:shadow-lg active:scale-[0.98]
                          transition-all duration-300 flex items-center justify-center gap-2"
              >
                <svg className="w-5 h-5 text-[#5064FF]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Verify Holdings
              </motion.button>
            </motion.div>
          </div>

          {/* Right Column - Portfolio Summary */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="lg:col-span-1"
          >
            <div className="gradient-hover bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-100/50 p-6 sticky top-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Portfolio Summary</h3>
              
              {/* Total Investments */}
              <div className="mb-6">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm text-gray-600">Total Investments</span>
                  <span className="font-semibold">{formatCurrency(totalPortfolioValue)}</span>
                </div>
                <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: '100%' }}
                    transition={{ duration: 1 }}
                    className="h-full bg-gradient-to-r from-[#5064FF] to-[#48E1C4] rounded-full"
                  ></motion.div>
                </div>
              </div>
              
              {/* Total Returns */}
              <div className="mb-6">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm text-gray-600">Total Returns</span>
                  <span className={`font-semibold ${getValueColor(totalReturns)}`}>
                    {totalReturns >= 0 ? '+' : ''}{formatCurrency(totalReturns)}
                  </span>
                </div>
                <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${Math.min(Math.abs(totalReturns / totalPortfolioValue * 100), 100)}%` }}
                    transition={{ duration: 1, delay: 0.2 }}
                    className={`h-full ${totalReturns >= 0 ? 'bg-green-500' : 'bg-red-500'} rounded-full`}
                  ></motion.div>
                </div>
              </div>
              
              {/* Sector Distribution */}
              <div className="mb-6">
                <h4 className="text-sm font-medium text-gray-900 mb-3">Sector Distribution</h4>
                <div className="space-y-3">
                  {['IT', 'Banking', 'Energy'].map((sector) => {
                    const sectorHoldings = holdings.filter(h => h.sector === sector);
                    const sectorValue = sectorHoldings.reduce((sum, h) => sum + (h.currentPrice * h.shares), 0);
                    const sectorPercentage = totalPortfolioValue > 0 ? (sectorValue / totalPortfolioValue * 100) : 0;
                    
                    return (
                      <div key={sector}>
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-sm text-gray-600">{sector}</span>
                          <span className="text-sm font-medium">{sectorPercentage.toFixed(1)}%</span>
                        </div>
                        <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden">
                          <motion.div 
                            initial={{ width: 0 }}
                            animate={{ width: `${sectorPercentage}%` }}
                            transition={{ duration: 1, delay: 0.4 }}
                            className="h-full bg-gradient-to-r from-[#5064FF] to-[#48E1C4] rounded-full"
                          ></motion.div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
              
              {/* Market Cap Distribution */}
              <div>
                <h4 className="text-sm font-medium text-gray-900 mb-3">Market Cap</h4>
                <div className="flex items-center justify-center">
                  <div className="relative w-32 h-32">
                    <svg className="w-full h-full" viewBox="0 0 100 100">
                      {/* Background circle */}
                      <circle cx="50" cy="50" r="40" fill="none" stroke="#E5E7EB" strokeWidth="8" />
                      {/* Progress circle */}
                      <circle cx="50" cy="50" r="40" fill="none" 
                              stroke="url(#gradient)" strokeWidth="8" 
                              strokeLinecap="round" strokeDasharray="251.2" 
                              strokeDashoffset="251.2 - (251.2 * 100) / 100" 
                              transform="rotate(-90 50 50)" />
                      {/* Center text */}
                      <text x="50" y="50" textAnchor="middle" dy="0.3em" className="text-lg font-bold fill-[#5064FF]">
                        100%
                      </text>
                    </svg>
                    
                  </div>
                </div>
                <p className="text-center text-sm text-gray-600 mt-2">All holdings are Large Cap</p>
              </div>
              
              
            </div>
          </motion.div>
        </div>

        {/* Footer */}
        <motion.footer 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-12 pt-8 border-t border-gray-200/50 text-center"
        >
          <p className="text-gray-500 text-sm">
            Data updates every minute • Last refresh: {formatTime(lastUpdated)}
          </p>
          <p className="text-gray-400 text-xs mt-2">
            Holdings data is for demonstration purposes. Always verify with official sources.
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
        
        /* Gradient hover effect */
        .gradient-hover {
          position: relative;
          overflow: hidden;
        }
        
        .gradient-hover::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, 
            transparent 0%, 
            rgba(72, 225, 196, 0.1) 25%, 
            rgba(80, 100, 255, 0.1) 50%, 
            rgba(72, 225, 196, 0.1) 75%, 
            transparent 100%
          );
          transition: transform 0.8s ease;
          z-index: 0;
        }
        
        .gradient-hover:hover::before {
          transform: translateX(100%);
        }
        
        /* Card hover effects */
        .stock-card-hover {
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }
        
        .stock-card-hover:hover {
          transform: translateY(-6px);
          box-shadow: 0 20px 40px -15px rgba(72, 225, 196, 0.25);
        }
        
        /* Logo hover effect */
        .logo-hover {
          transition: all 0.3s ease;
        }
        
        .logo-hover:hover {
          transform: scale(1.1) rotate(5deg);
        }
        
        /* Ensure text remains visible over gradient */
        .gradient-hover > *:not(:before) {
          position: relative;
          z-index: 1;
        }
      `}</style>
    </div>
  );
}