import React, { useState, useEffect } from "react";

export default function HoldingsUI() {
  // Mock data for holdings
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

  // Calculate portfolio totals
  useEffect(() => {
    const totalValue = holdings.reduce((sum, holding) => 
      sum + (holding.currentPrice * holding.shares), 0);
    const totalReturn = holdings.reduce((sum, holding) => 
      sum + ((holding.currentPrice - holding.investedPrice) * holding.shares), 0);
    
    setTotalPortfolioValue(totalValue);
    setTotalReturns(totalReturn);
  }, [holdings]);

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

  // Calculate values for selected holding
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

  // Get background color based on value
  const getValueBgColor = (value) => {
    return value >= 0 ? 'bg-green-50' : 'bg-red-50';
  };

  const selectedDetails = getSelectedHoldingDetails(selectedHolding);
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 px-4 md:px-56 py-6 text-gray-900 font-sans">
      {/* Header with Portfolio Summary */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
              Holdings ({holdings.length})
            </h1>
            <p className="text-gray-600 mt-1">Your investment portfolio overview</p>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-500">Total Portfolio Value</p>
            <p className="text-2xl font-bold tracking-tight">{formatCurrency(totalPortfolioValue)}</p>
            <p className={`text-sm font-medium ${getValueColor(totalReturns)}`}>
              {totalReturns >= 0 ? '+' : ''}{formatCurrency(totalReturns)} 
              <span className="text-gray-600 ml-1">total returns</span>
            </p>
          </div>
        </div>
        <div className="h-1.5 w-24 bg-gradient-to-r from-green-400 via-blue-400 to-purple-500 rounded-full"></div>
      </div>

      <div className="w-full">
        {/* Left Column - Selected Holding Details */}
        <div className="lg:col-span-2">
          {/* Selected Holding Summary Card */}
          <div className="border border-gray-200 rounded-2xl p-6 shadow-xl mb-6 bg-white 
                        hover:shadow-2xl transition-all duration-500
                        relative overflow-hidden group">
            {/* Animated gradient background */}
            <div className="absolute inset-0 bg-gradient-to-br from-green-50/30 via-blue-50/20 to-purple-50/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            
            {/* Glowing effect */}
            <div className="absolute -inset-0.5 bg-gradient-to-r from-green-400 via-blue-400 to-purple-500 rounded-2xl opacity-0 group-hover:opacity-10 blur transition duration-500 group-hover:duration-200"></div>
            
            <div className="relative z-10">
              {/* Header with symbol and sector */}
              <div className="flex justify-between items-start mb-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-green-100 to-blue-100 rounded-xl flex items-center justify-center shadow-sm group-hover:scale-105 transition-transform duration-300">
                    <span className="font-bold text-xl text-green-700">
                      {selectedHolding.symbol.charAt(0)}
                    </span>
                  </div>
                  <div>
                    <h2 className="font-bold text-2xl text-gray-900">{selectedHolding.name}</h2>
                    <div className="flex items-center gap-3 mt-1">
                      <span className="text-sm font-medium text-gray-500">{selectedHolding.symbol}</span>
                      <span className="text-xs px-2 py-1 bg-gray-100 text-gray-700 rounded-full">
                        {selectedHolding.sector}
                      </span>
                      <span className="text-xs px-2 py-1 bg-blue-100 text-blue-700 rounded-full">
                        {selectedHolding.marketCap}
                      </span>
                    </div>
                  </div>
                </div>
                
                <div className="text-right">
                  <div className={`px-3 py-1.5 rounded-lg inline-block ${getValueBgColor(selectedDetails.returns)}`}>
                    <p className={`font-bold text-lg ${getValueColor(selectedDetails.returns)}`}>
                      {selectedDetails.returns >= 0 ? '↗' : '↘'} 
                      {selectedDetails.returnsPercent.toFixed(2)}%
                    </p>
                  </div>
                </div>
              </div>

              {/* Main metrics */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                <div className="bg-gradient-to-br from-gray-50 to-white p-4 rounded-xl border border-gray-100">
                  <p className="text-sm text-gray-500 mb-2">Current Value</p>
                  <p className="text-2xl font-bold tracking-tight text-gray-900">
                    {formatCurrency(selectedDetails.currentValue)}
                  </p>
                  <div className="mt-2 text-xs text-gray-500 flex items-center">
                    <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                    {selectedDetails.portfolioPercentage.toFixed(1)}% of portfolio
                  </div>
                </div>
                
                <div className="bg-gradient-to-br from-gray-50 to-white p-4 rounded-xl border border-gray-100">
                  <p className="text-sm text-gray-500 mb-2">Invested Amount</p>
                  <p className="text-2xl font-bold tracking-tight text-gray-900">
                    {formatCurrency(selectedDetails.investedValue)}
                  </p>
                  <div className="mt-2 text-xs text-gray-500">
                    {selectedHolding.shares} shares @ ₹{formatNumber(selectedHolding.investedPrice)}
                  </div>
                </div>
                
                <div className={`p-4 rounded-xl border ${selectedDetails.dayChange >= 0 ? 'border-green-100' : 'border-red-100'}`}>
                  <p className="text-sm text-gray-500 mb-2">1D Change</p>
                  <p className={`text-2xl font-bold tracking-tight ${getValueColor(selectedDetails.dayChange)}`}>
                    {selectedDetails.dayChange >= 0 ? '+' : ''}{formatCurrency(selectedDetails.dayChange)}
                  </p>
                  <div className={`text-sm font-medium mt-2 ${getValueColor(selectedDetails.dayChange)}`}>
                    ({selectedDetails.dayChangePercent.toFixed(2)}%)
                  </div>
                </div>
              </div>

              {/* Additional info */}
              <div className="flex justify-between items-center pt-4 border-t border-gray-100">
                <div className="text-sm text-gray-600">
                  <span className="font-medium">Avg. Cost:</span> ₹{formatNumber(selectedHolding.investedPrice)}
                </div>
                <div className="text-sm text-gray-600">
                  <span className="font-medium">LTP:</span> ₹{formatNumber(selectedHolding.currentPrice)}
                </div>
                <div className="text-sm text-gray-600">
                  <span className="font-medium">Qty:</span> {selectedHolding.shares} shares
                </div>
              </div>
            </div>
          </div>

          {/* Holdings List */}
          <div className="bg-white rounded-2xl shadow-lg p-1">
            {/* Sort Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <div className="relative">
                  <button
                    onClick={() => setShowSortDropdown(!showSortDropdown)}
                    className="flex items-center gap-2 bg-gray-100 hover:bg-gray-200 px-4 py-2.5 rounded-xl transition-all duration-300 hover:shadow-md"
                  >
                    <svg className="w-4 h-4 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4h13M3 8h9m-9 4h9m5-4v12m0 0l-4-4m4 4l4-4" />
                    </svg>
                    <span className="font-medium text-gray-700">{getCurrentSortLabel()}</span>
                    <svg className={`w-4 h-4 transition-transform duration-200 ${showSortDropdown ? 'rotate-180' : ''}`} 
                         fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>

                  {/* Sort Dropdown Menu */}
                  {showSortDropdown && (
                    <>
                      <div 
                        className="fixed inset-0 z-40"
                        onClick={() => setShowSortDropdown(false)}
                      />
                      <div className="absolute top-full left-0 mt-2 w-72 bg-white border border-gray-200 rounded-2xl shadow-xl z-50 py-2 overflow-hidden">
                        <div className="px-4 py-3 border-b border-gray-100 bg-gray-50">
                          <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">Sort Holdings By</p>
                        </div>
                        {sortOptions.map((option) => {
                          const isSelected = 
                            (sortBy === 'name' && option.key === (sortOrder === 'asc' ? 'nameAsc' : 'nameDesc')) ||
                            (sortBy === 'sector' && option.key === 'sector') ||
                            (sortBy === option.key && option.key !== 'nameAsc' && option.key !== 'nameDesc');
                          
                          return (
                            <button
                              key={option.key}
                              onClick={() => handleSortSelect(option.key)}
                              className={`w-full text-left px-4 py-3.5 flex items-center gap-3 hover:bg-gray-50 transition-all duration-150 group ${
                                isSelected ? 'bg-gradient-to-r from-green-50 to-emerald-50 text-green-700' : 'text-gray-700'
                              }`}
                            >
                              <span className={`text-lg transition-transform group-hover:scale-110 ${isSelected ? 'text-green-500' : 'text-gray-400'}`}>
                                {option.icon}
                              </span>
                              <div className="flex-1">
                                <p className="text-sm font-medium">{option.label}</p>
                              </div>
                              {isSelected && (
                                <svg className="w-4 h-4 text-green-500 animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                              )}
                            </button>
                          );
                        })}
                      </div>
                    </>
                  )}
                </div>
              </div>
              
              <div className="flex items-center gap-8">
                <p className="text-sm font-medium text-gray-600">Price</p>
                <p className="text-sm font-medium text-gray-600">Value</p>
              </div>
            </div>

            {/* Holdings List Items */}
            <div className="max-h-[500px] overflow-y-auto pr-1">
              {sortedHoldings.map((holding) => {
                const currentValue = holding.currentPrice * holding.shares;
                const investedValue = holding.investedPrice * holding.shares;
                const returns = currentValue - investedValue;
                const isSelected = selectedHolding.id === holding.id;

                return (
                  <div 
                    key={holding.id}
                    onClick={() => handleHoldingClick(holding)}
                    className={`flex items-center gap-4 p-4 mx-2 my-2 rounded-xl border
                                transition-all duration-300 cursor-pointer group
                                ${isSelected 
                                  ? 'bg-gradient-to-r from-green-50 to-emerald-50 border-green-200 shadow-md' 
                                  : 'border-gray-100 hover:bg-gray-50 hover:border-green-100 hover:shadow-sm'}`}
                  >
                    {/* Company Icon */}
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center shadow-sm transition-transform group-hover:scale-110 ${
                      isSelected ? 'bg-gradient-to-br from-green-100 to-emerald-100' : 'bg-gray-100'
                    }`}>
                      <span className={`font-bold ${isSelected ? 'text-green-700' : 'text-gray-600'}`}>
                        {holding.symbol.charAt(0)}
                      </span>
                    </div>

                    {/* Company Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <h3 className={`font-semibold truncate ${isSelected ? 'text-green-700' : 'text-gray-900'}`}>
                          {holding.name}
                        </h3>
                        <span className="text-xs px-2 py-0.5 bg-gray-100 text-gray-600 rounded-full">
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
                    <div className="flex items-center gap-8">
                      {/* Price Column */}
                      <div className="text-right">
                        <p className="text-lg font-bold text-gray-900">
                          ₹{formatNumber(holding.currentPrice)}
                        </p>
                        <p className={`text-sm ${holding.currentPrice >= holding.investedPrice ? 'text-green-600' : 'text-red-600'}`}>
                          {holding.currentPrice >= holding.investedPrice ? '↗' : '↘'} 
                          ₹{formatNumber(holding.investedPrice)}
                        </p>
                      </div>

                      {/* Value Column */}
                      <div className="text-right w-32">
                        <p className="text-lg font-bold text-gray-900">
                          {formatCurrency(currentValue)}
                        </p>
                        <p className={`text-sm font-medium ${getValueColor(returns)}`}>
                          {returns >= 0 ? '+' : ''}{formatCurrency(returns)}
                        </p>
                      </div>
                    </div>

                    {/* Selection Indicator */}
                    <div className={`ml-2 transition-all duration-300 ${
                      isSelected ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
                    }`}>
                      {isSelected ? (
                        <div className="w-6 h-6 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center">
                          <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                      ) : (
                        <div className="w-2 h-2 bg-gray-300 rounded-full group-hover:bg-green-400 transition-colors"></div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Column - Portfolio Summary & Actions */}
        
          {/* Portfolio Summary Card */}
          
            
            

           
          </div>

          {/* Action Buttons */}
          <div className="space-y-3 mt-8">
           
            
            <button className="w-2/3 text-center font-semibold py-3.5 px-4 rounded-xl
                              bg-white border-2 border-green-500 text-green-600
                              hover:bg-green-50 hover:shadow-lg active:scale-[0.98]
                              transition-all duration-300 flex items-center justify-center gap-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Verify Holdings
            </button>
            
            <button className="w-full text-center font-semibold py-3.5 px-4 rounded-xl
                              bg-gradient-to-r from-gray-100 to-gray-50 border border-gray-200
                              text-gray-700 hover:shadow-md hover:bg-white
                              transition-all duration-300 flex items-center justify-center gap-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
              View Reports
            </button>
          </div>
        </div>
     
  );
}