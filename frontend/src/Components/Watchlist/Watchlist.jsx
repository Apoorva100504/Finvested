// components/Watchlist/Watchlist.jsx
import React, { useState, useEffect, useRef } from "react";
import { FiEdit2, FiPlus, FiSearch, FiTrash2, FiX, FiCheck, FiDelete, FiEdit3 } from "react-icons/fi";
import { FaRegHeart } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import { useWatchlist } from "../hooks/useWatchlist";

// Import dummy logos
const dummyLogos = [
  "https://cdn-icons-png.flaticon.com/512/732/732221.png",
  "https://cdn-icons-png.flaticon.com/512/732/732217.png",
  "https://cdn-icons-png.flaticon.com/512/732/732218.png",
  "https://cdn-icons-png.flaticon.com/512/732/732219.png",
  "https://cdn-icons-png.flaticon.com/512/732/732220.png",
  "https://cdn-icons-png.flaticon.com/512/732/732222.png",
  "https://cdn-icons-png.flaticon.com/512/732/732223.png",
  "https://cdn-icons-png.flaticon.com/512/732/732224.png",
  "https://cdn-icons-png.flaticon.com/512/732/732225.png",
  "https://cdn-icons-png.flaticon.com/512/732/732226.png",
];

// Mock stock data
const mockStocks = [
  {
    id: 1,
    symbol: "AAPL",
    companyName: "Apple Inc.",
    currentPrice: 182.63,
    change: 1.24,
    changePercent: 0.68,
    volume: 58923100,
    week52Low: 164.08,
    week52High: 199.62,
  },
  {
    id: 2,
    symbol: "MSFT",
    companyName: "Microsoft Corporation",
    currentPrice: 414.11,
    change: 3.27,
    changePercent: 0.80,
    volume: 23785100,
    week52Low: 309.45,
    week52High: 420.82,
  },
  {
    id: 3,
    symbol: "AMZN",
    companyName: "Amazon.com Inc.",
    currentPrice: 176.95,
    change: -0.85,
    changePercent: -0.48,
    volume: 38461900,
    week52Low: 122.35,
    week52High: 189.77,
  },
  {
    id: 4,
    symbol: "GOOGL",
    companyName: "Alphabet Inc.",
    currentPrice: 167.94,
    change: 2.11,
    changePercent: 1.27,
    volume: 26354800,
    week52Low: 115.20,
    week52High: 172.08,
  },
  {
    id: 5,
    symbol: "TSLA",
    companyName: "Tesla Inc.",
    currentPrice: 248.42,
    change: -3.68,
    changePercent: -1.46,
    volume: 117423500,
    week52Low: 152.37,
    week52High: 299.29,
  },
  {
    id: 6,
    symbol: "NFLX",
    companyName: "Netflix Inc.",
    currentPrice: 615.91,
    change: 8.23,
    changePercent: 1.35,
    volume: 5243700,
    week52Low: 375.28,
    week52High: 639.00,
  },
  {
    id: 7,
    symbol: "META",
    companyName: "Meta Platforms Inc.",
    currentPrice: 474.99,
    change: 5.21,
    changePercent: 1.11,
    volume: 18965200,
    week52Low: 285.25,
    week52High: 486.43,
  },
  {
    id: 8,
    symbol: "RELIANCE",
    companyName: "Reliance Industries",
    currentPrice: 2856.75,
    change: 12.25,
    changePercent: 0.43,
    volume: 4589200,
    week52Low: 2210.00,
    week52High: 3025.00,
  },
  {
    id: 9,
    symbol: "TCS",
    companyName: "Tata Consultancy Services",
    currentPrice: 3892.45,
    change: -8.55,
    changePercent: -0.22,
    volume: 1928300,
    week52Low: 3115.00,
    week52High: 4120.00,
  },
  {
    id: 10,
    symbol: "INFY",
    companyName: "Infosys Limited",
    currentPrice: 1523.80,
    change: 4.20,
    changePercent: 0.28,
    volume: 4832100,
    week52Low: 1310.00,
    week52High: 1720.00,
  },
];

// Enhanced Line Chart Component
const LineChart = ({ stock = {} }) => {
  const canvasRef = useRef(null);
  
  useEffect(() => {
    if (!canvasRef.current) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    if (!stock?.currentPrice && !stock?.change) {
      ctx.strokeStyle = '#e5e7eb';
      ctx.lineWidth = 2;
      ctx.setLineDash([5, 5]);
      ctx.beginPath();
      ctx.moveTo(0, canvas.height / 2);
      ctx.lineTo(canvas.width, canvas.height / 2);
      ctx.stroke();
      ctx.setLineDash([]);
      return;
    }
    
    const currentPrice = stock.currentPrice || 0;
    const dayChange = stock.change || 0;
    const isPositive = dayChange >= 0;
    
    const dataPoints = 15;
    const data = [];
    let base = isPositive ? currentPrice * 0.97 : currentPrice * 1.03;
    
    for (let i = 0; i < dataPoints; i++) {
      const progress = i / (dataPoints - 1);
      const fluctuation = Math.random() * currentPrice * 0.015;
      const price = isPositive 
        ? base + (currentPrice * 0.06 * progress) + fluctuation
        : base - (currentPrice * 0.06 * progress) + fluctuation;
      data.push(price);
    }
    
    const min = Math.min(...data);
    const max = Math.max(...data);
    const range = max - min || 1;
    const padding = 3;
    const chartHeight = canvas.height - padding * 2;
    const chartWidth = canvas.width - padding * 2;
    
    // Create gradient
    const gradient = ctx.createLinearGradient(0, 0, canvas.width, 0);
    if (isPositive) {
      gradient.addColorStop(0, '#0fbaad');
      gradient.addColorStop(1, '#5064FF');
    } else {
      gradient.addColorStop(0, '#ef4444');
      gradient.addColorStop(1, '#f97316');
    }
    
    ctx.strokeStyle = gradient;
    ctx.lineWidth = 2;
    ctx.lineCap = 'round';
    ctx.beginPath();
    
    data.forEach((value, index) => {
      const x = padding + (index / (data.length - 1)) * chartWidth;
      const y = padding + chartHeight - ((value - min) / range) * chartHeight;
      index === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
    });
    
    ctx.stroke();
    
    // Add glow effect for positive trends
    if (isPositive) {
      ctx.shadowColor = '#0fbaad';
      ctx.shadowBlur = 4;
      ctx.stroke();
      ctx.shadowBlur = 0;
    }
  }, [stock]);
  
  return <canvas ref={canvasRef} width={64} height={20} className="w-16 h-5" style={{ display: 'block' }} />;
};

export default function Watchlist() {
  const { 
    watchlists, currentWatchlist, loading: watchlistLoading, error: watchlistError,
    createWatchlist, addStockToWatchlist, removeFromWatchlist, deleteWatchlist,
    renameWatchlist, setCurrentWatchlist, searchStocks, isStockInWatchlist,
    getAllStocks, bulkDeleteStocks, clearError, refresh
  } = useWatchlist();

  const [searchQuery, setSearchQuery] = useState("");
  const [stockSearchQuery, setStockSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [showStockSearch, setShowStockSearch] = useState(false);
  const [showCreateWatchlist, setShowCreateWatchlist] = useState(false);
  const [newWatchlistName, setNewWatchlistName] = useState("");
  const [editMode, setEditMode] = useState(false);
  const [stocksToDelete, setStocksToDelete] = useState(new Set());
  const [editingWatchlistName, setEditingWatchlistName] = useState(null);
  const [tempWatchlistName, setTempWatchlistName] = useState("");
  const [viewAllStocks, setViewAllStocks] = useState(true);

  // Use mock data if no stocks available
  const [demoStocks, setDemoStocks] = useState(mockStocks.map((stock, index) => ({
    ...stock,
    logo: dummyLogos[index % dummyLogos.length],
    id: `demo_${stock.id}`,
  })));

  useEffect(() => {
    const searchStocksAsync = async () => {
      if (stockSearchQuery.trim()) {
        const filtered = mockStocks.filter(stock =>
          stock.companyName.toLowerCase().includes(stockSearchQuery.toLowerCase()) ||
          stock.symbol.toLowerCase().includes(stockSearchQuery.toLowerCase())
        );
        setSearchResults(filtered.map((stock, index) => ({
          ...stock,
          logo: dummyLogos[index % dummyLogos.length],
          id: `search_${stock.id}`,
        })));
      } else {
        setSearchResults([]);
      }
    };
    searchStocksAsync();
  }, [stockSearchQuery]);

  // Use demo stocks as default
  const currentStocks = viewAllStocks ? demoStocks : (currentWatchlist?.stocks || demoStocks);
  const filteredStocks = currentStocks.filter(item => {
    if (!searchQuery) return true;
    const stock = item.stock || item;
    return stock.companyName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
           stock.symbol?.toLowerCase().includes(searchQuery.toLowerCase());
  });

  const formatNumber = (num) => (num ?? 0).toLocaleString('en-IN');
  const formatPercentage = (value) => {
    const num = parseFloat(value);
    if (isNaN(num)) return '0.00%';
    return `${num >= 0 ? '+' : ''}${Math.abs(num).toFixed(2)}%`;
  };

  const get52WPerformance = (stock) => {
    if (!stock) return { position: 50, label: 'M' };
    const current = stock.currentPrice || stock.lastPrice || 0;
    const low = stock.week52Low || 0;
    const high = stock.week52High || 0;
    if (current === 0 || high === low) return { position: 50, label: 'M' };
    const position = ((current - low) / (high - low)) * 100;
    let label = 'M';
    if (position < 33) label = 'L';
    else if (position > 66) label = 'H';
    return { position: Math.min(100, Math.max(0, position)), label };
  };

  const handleAddStock = async (stock) => {
    if (!stock) {
      alert("Invalid stock data!");
      return;
    }
    
    const exists = demoStocks.some(s => s.symbol === stock.symbol);
    if (exists) {
      alert("Stock is already in your watchlist!");
      return;
    }
    
    const newStock = {
      ...stock,
      logo: dummyLogos[demoStocks.length % dummyLogos.length],
      id: `demo_${Date.now()}`,
    };
    
    setDemoStocks(prev => [...prev, newStock]);
    setStockSearchQuery("");
    setSearchResults([]);
    setShowStockSearch(false);
  };

  const handleRemoveStock = async (stockId) => {
    setDemoStocks(prev => prev.filter(stock => stock.id !== stockId));
    const newSelection = new Set(stocksToDelete);
    newSelection.delete(stockId);
    setStocksToDelete(newSelection);
  };

  const handleDeleteSelected = async () => {
    if (stocksToDelete.size === 0) return;
    if (!window.confirm(`Are you sure you want to delete ${stocksToDelete.size} selected stocks?`)) return;
    try {
      setDemoStocks(prev => prev.filter(stock => !stocksToDelete.has(stock.id)));
      setStocksToDelete(new Set());
      setEditMode(false);
    } catch (error) {
      console.error("Error deleting selected stocks:", error);
      alert("Failed to delete selected stocks");
    }
  };

  const toggleStockSelection = (stockId) => {
    const newSelection = new Set(stocksToDelete);
    newSelection.has(stockId) ? newSelection.delete(stockId) : newSelection.add(stockId);
    setStocksToDelete(newSelection);
  };

  const handleDeleteAllWatchlist = async () => {
    if (!filteredStocks.length) return;
    const watchlistName = viewAllStocks ? "My Watchlist" : currentWatchlist?.name;
    if (!window.confirm(`Are you sure you want to delete all ${filteredStocks.length} stocks from "${watchlistName}"?`)) return;
    
    const stockIdsToDelete = new Set(filteredStocks.map(stock => stock.id));
    setDemoStocks(prev => prev.filter(stock => !stockIdsToDelete.has(stock.id)));
    setEditMode(false);
    setStocksToDelete(new Set());
  };

  const handleToggleEditMode = () => {
    if (editMode) {
      setEditMode(false);
      setStocksToDelete(new Set());
      setEditingWatchlistName(null);
    } else {
      setEditMode(true);
    }
  };

  const handleCreateWatchlist = async () => {
    if (newWatchlistName.trim()) {
      alert(`Watchlist "${newWatchlistName}" created successfully!`);
      setNewWatchlistName("");
      setShowCreateWatchlist(false);
    }
  };

  const handleDeleteWatchlist = async (watchlistId) => {
    const watchlistToDelete = watchlists.find(w => w.id === watchlistId);
    if (!watchlistToDelete || !window.confirm(`Are you sure you want to delete "${watchlistToDelete.name}"?`)) return;
    alert(`Watchlist "${watchlistToDelete.name}" deleted successfully!`);
  };

  const startEditingWatchlistName = (watchlistId, currentName) => {
    setEditingWatchlistName(watchlistId);
    setTempWatchlistName(currentName);
  };

  const saveWatchlistName = async (watchlistId) => {
    const originalName = watchlists.find(w => w.id === watchlistId)?.name;
    if (tempWatchlistName.trim() && tempWatchlistName !== originalName) {
      alert(`Watchlist renamed to "${tempWatchlistName}"!`);
      setEditingWatchlistName(null);
    } else {
      setEditingWatchlistName(null);
    }
  };

  const handleCloseStockSearch = () => {
    setShowStockSearch(false);
    setStockSearchQuery("");
    setSearchResults([]);
  };

  if (watchlistLoading) {
    return (
      <div className="w-full px-6 py-6 bg-white">
        <div className="animate-pulse space-y-4">
          <div className="h-6 bg-gray-200 rounded w-1/4"></div>
          <div className="h-10 bg-gray-200 rounded"></div>
          <div className="space-y-2">
            {[1, 2, 3, 4, 5, 6].map(i => (
              <div key={i} className="h-16 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full px-32 py-5 bg-gradient-to-br from-gray-50 via-white to-blue-50/30">
      {/* Animated Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-[#48E1C4]/20 rounded-full mix-blend-multiply filter blur-3xl animate-blob"></div>
        <div className="absolute top-1/3 right-1/4 w-64 h-64 bg-[#5064FF]/20 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-1/4 left-1/2 w-64 h-64 bg-[#48E1C4]/20 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-4000"></div>
      </div>
<div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
            <div className="group animate-fadeInUp">
              <h1 className="text-4xl font-bold bg-gray-600 bg-clip-text text-transparent transition-all duration-300 group-hover:tracking-wide">
                Watchlist
              </h1>
              <p className="text-gray-700 text-sm mt-1 relative inline-block group-hover:font-medium">
                Add stocks to your watchlist
                <span className="absolute left-0 -bottom-1 w-0 h-[2px] bg-[#48E1C4] rounded-full transition-all duration-300 group-hover:w-full"></span>
              </p></div></div>
      {/* Main Watchlist Container - Everything inside this rounded container */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="border border-gray-300 rounded-xl shadow-sm overflow-hidden bg-white"
      >
        
        {/* Top Header Section with Tabs and Action Buttons */}
        <div className="p-6 border-b border-gray-200 bg-white">
          {/* Tabs Section */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                {/* My Watchlist Tab */}
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setViewAllStocks(true)}
                  className={`px-4 py-2 text-lg font-semibold transition-colors flex items-center gap-1 relative font-sans ${
                    viewAllStocks ? "text-gray-700" : "text-gray-600 hover:text-gray-700"
                  }`}
                >
                  My Watchlist 
                  {viewAllStocks && (
                    <motion.div 
                      layoutId="activeTab"
                      className="absolute bottom-0 left-0 right-0 h-[2.5px] bg-gradient-to-r from-[#5064FF] to-[#48E1C4]"
                    />
                  )}
                </motion.button>

                {/* Custom Watchlist Tabs */}
                <AnimatePresence>
                  {watchlists.map((watchlist) => (
                    <motion.div 
                      key={watchlist.id} 
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      className="relative group"
                    >
                      {editingWatchlistName === watchlist.id ? (
                        <div className="flex items-center gap-1">
                          <motion.input
                            initial={{ width: 0 }}
                            animate={{ width: "auto" }}
                            type="text"
                            value={tempWatchlistName}
                            onChange={(e) => setTempWatchlistName(e.target.value)}
                            className="px-3 py-1.5 border border-blue-300 rounded-full text-sm"
                            onKeyPress={(e) => e.key === 'Enter' && saveWatchlistName(watchlist.id)}
                            autoFocus
                          />
                          <motion.button 
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => saveWatchlistName(watchlist.id)} 
                            className="text-green-600 hover:text-green-700"
                          >
                            <FiCheck size={16} />
                          </motion.button>
                          <motion.button 
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => setEditingWatchlistName(null)} 
                            className="text-red-600 hover:text-red-700"
                          >
                            <FiX size={16} />
                          </motion.button>
                        </div>
                      ) : (
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => { setViewAllStocks(false); setCurrentWatchlist(watchlist); }}
                          className={`px-3 py-1.5 text-sm font-medium transition-colors flex items-center gap-1 relative ${
                            !viewAllStocks && currentWatchlist?.id === watchlist.id ? "text-gray-700" : "text-gray-600 hover:text-gray-700"
                          }`}
                        >
                          {watchlist.name} ({watchlist.stocks?.length || 0})
                          {editMode && (
                            <motion.button
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              onClick={(e) => { e.stopPropagation(); startEditingWatchlistName(watchlist.id, watchlist.name); }}
                              className="ml-1 text-gray-500 hover:text-blue-600"
                            >
                              <FiEdit3 size={12} />
                            </motion.button>
                          )}
                          {!viewAllStocks && currentWatchlist?.id === watchlist.id && (
                            <motion.div 
                              layoutId="activeTab"
                              className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-[#5064FF] to-[#48E1C4]"
                            />
                          )}
                        </motion.button>
                      )}
                    </motion.div>
                  ))}
                </AnimatePresence>
                
                {/* + Watchlist Button */}
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setShowCreateWatchlist(true)}
                  className="px-3 py-1.5 text-[#0fbaad] hover:text-[#0d9488] transition-colors flex items-center gap-1 font-medium text-sm"
                >
                  + Watchlist
                </motion.button>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-3">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowStockSearch(true)}
                className="flex items-center gap-1 border rounded-lg px-3 py-2 text-sm hover:bg-gray-50 transition-colors"
              >
                <FiPlus size={16} /> Add stocks
              </motion.button>

              {!editMode ? (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleToggleEditMode}
                  className="flex items-center gap-1 border rounded-lg px-3 py-2 text-sm hover:bg-gray-50 transition-colors"
                >
                  <FiEdit2 size={16} /> Edit
                </motion.button>
              ) : (
                <div className="flex items-center gap-2">
                  {stocksToDelete.size > 0 && (
                    <motion.button
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={handleDeleteSelected}
                      className="flex items-center gap-1 border rounded-lg px-3 py-2 text-sm transition-colors border-red-200 text-red-600 bg-red-50 hover:bg-red-100"
                    >
                      <FiDelete size={16} /> Delete Selected ({stocksToDelete.size})
                    </motion.button>
                  )}
                  
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleDeleteAllWatchlist}
                    disabled={!filteredStocks.length}
                    className={`flex items-center gap-1 border rounded-lg px-3 py-2 text-sm transition-colors ${
                      filteredStocks.length
                        ? "border-red-200 text-red-600 bg-red-50 hover:bg-red-100"
                        : "opacity-50 cursor-not-allowed border-gray-200"
                    }`}
                  >
                    <FiDelete size={16} /> Delete All
                  </motion.button>
                  
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleToggleEditMode}
                    className="flex items-center gap-1 border border-green-200 text-green-600 bg-green-50 rounded-lg px-3 py-2 text-sm hover:bg-green-100 transition-colors"
                  >
                    <FiCheck size={16} /> Done
                  </motion.button>
                </div>
              )}
            </div>
          </div>
          {/* Search Bar Section with Border Above */}
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="flex items-center justify-between pt-4 border-t border-gray-200"
          >
            <div className="relative flex-1 max-w-xs">
              <FiSearch className="absolute left-3 top-3 text-gray-500" size={16} />
              <motion.input
                whileFocus={{ scale: 1.01 }}
                type="text"
                placeholder="Search your watchlist"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full border border-gray-300 rounded-lg pl-10 pr-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#5064FF]/30 focus:border-[#5064FF] transition-all duration-300"
              />
            </div>
            
            <div className="text-sm text-gray-500">
              {filteredStocks.length} {filteredStocks.length === 1 ? 'stock' : 'stocks'}
            </div>
          </motion.div>
        </div>

        {/* Error Message Section */}
        <AnimatePresence>
          {watchlistError && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="p-4 border-b border-gray-200 bg-red-50"
            >
              <div className="p-3 bg-red-100 text-red-700 rounded-lg flex justify-between items-center">
                <span className="flex items-center gap-2">
                  <span className="font-medium">Error:</span> {watchlistError}
                </span>
                <motion.button 
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={clearError} 
                  className="text-red-500 hover:text-red-700"
                >
                  <FiX size={16} />
                </motion.button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Main Table Content */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="min-h-[200px]"
        >
          {filteredStocks.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="text-gray-600 text-xs bg-gray-50">
                  <tr>
                    {editMode && <th className="text-left py-4 px-6 font-medium w-10">✓</th>}
                    <th className="text-left py-4 px-6 font-medium">Company ({filteredStocks.length})</th>
                    <th className="text-left py-4 px-6 font-medium">Trend</th>
                    <th className="text-left py-4 px-6 font-medium">Mkt price</th>
                    <th className="text-left py-4 px-6 font-medium">1D change</th>
                    <th className="text-left py-4 px-6 font-medium">1D vol</th>
                    <th className="text-left py-4 px-6 font-medium">52W perf</th>
                    {editMode && <th className="text-left py-4 px-6 font-medium">Delete</th>}
                  </tr>
                </thead>

                <tbody>
                  <AnimatePresence>
                    {filteredStocks.map((stock, index) => {
                      const dayChange = stock.change || 0;
                      const dayChangePercent = stock.changePercent || 0;
                      const dayVolume = stock.volume || 0;
                      const perf = get52WPerformance(stock);
                      
                      return (
                        <motion.tr
                          key={stock.id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -20 }}
                          transition={{ duration: 0.2, delay: index * 0.03 }}
                          className="border-t border-gray-100 hover:bg-gray-50 transition-colors"
                          whileHover={{ scale: 1.002 }}
                        >
                          {editMode && (
                            <td className="py-4 px-6">
                              <motion.div
                                whileHover={{ scale: 1.2 }}
                                whileTap={{ scale: 0.9 }}
                                className="relative"
                              >
                                <input
                                  type="checkbox"
                                  checked={stocksToDelete.has(stock.id)}
                                  onChange={() => toggleStockSelection(stock.id)}
                                  className="h-4 w-4 rounded border-gray-300 text-[#5064FF] focus:ring-[#5064FF]/20 cursor-pointer"
                                />
                              </motion.div>
                            </td>
                          )}
                          
                          <td className="py-4 px-6">
                            <div className="flex items-center gap-3">
                              {/* Company Logo Image */}
                              <motion.div 
                                whileHover={{ scale: 1.1, rotate: 5 }}
                                className="h-8 w-8 rounded-full bg-white flex items-center justify-center overflow-hidden border border-gray-200"
                              >
                                <img
                                  src={stock.logo || `https://ui-avatars.com/api/?name=${stock.symbol}&background=blue&color=white`}
                                  alt={stock.companyName}
                                  className="h-5 w-5 object-contain"
                                  onError={(e) => {
                                    e.target.onerror = null;
                                    e.target.src = `https://ui-avatars.com/api/?name=${stock.symbol}&background=blue&color=white`;
                                  }}
                                />
                              </motion.div>
                              <div className="truncate max-w-[180px]">
                                <div className="font-medium text-gray-800">{stock.companyName || "Unknown Company"}</div>
                                <div className="text-xs text-gray-500">{stock.symbol || "N/A"}</div>
                              </div>
                            </div>
                          </td>

                          <td className="py-4 px-6"><LineChart stock={stock} /></td>

                          <td className="py-4 px-6">
                            <motion.div
                              initial={false}
                              animate={{ scale: dayChange !== 0 ? [1, 1.02, 1] : 1 }}
                              transition={{ duration: 0.5, repeat: dayChange !== 0 ? Infinity : 0, repeatDelay: 3 }}
                              className="font-medium text-gray-900"
                            >
                              ₹{parseFloat(stock.currentPrice || 0).toFixed(2)}
                            </motion.div>
                          </td>

                          <td className="py-4 px-6">
                            <motion.div
                              initial={false}
                              animate={{ 
                                scale: dayChange !== 0 ? [1, 1.05, 1] : 1,
                                color: dayChange >= 0 ? '#0fbaad' : '#ef4444'
                              }}
                              transition={{ 
                                duration: 0.5,
                                repeat: dayChange !== 0 ? Infinity : 0,
                                repeatDelay: 3 
                              }}
                              className={`font-medium ${dayChange >= 0 ? "text-[#0fbaad]" : "text-[#ef4444]"}`}
                            >
                              {dayChange >= 0 ? "+" : ""}{dayChange.toFixed(2)} ({formatPercentage(dayChangePercent)})
                            </motion.div>
                          </td>

                          <td className="py-4 px-6 text-gray-700">{formatNumber(dayVolume)}</td>

                          <td className="py-4 px-6">
                            <div className="flex items-center gap-2">
                              <span className="text-xs text-gray-500">L</span>
                              <div className="h-1.5 w-24 bg-gray-200 rounded-full relative">
                                <motion.div 
                                  className="absolute top-0 h-1.5 w-3 bg-gradient-to-r from-[#5064FF] to-[#48E1C4] rounded-full shadow-sm"
                                  initial={{ left: '50%' }}
                                  animate={{ left: `${perf.position}%` }}
                                  transition={{ duration: 0.5 }}
                                />
                                <motion.div 
                                  className="absolute top-0 h-1.5 bg-gradient-to-r from-gray-300 to-gray-400 rounded-full"
                                  style={{ width: `${perf.position}%` }}
                                  initial={{ width: 0 }}
                                  animate={{ width: `${perf.position}%` }}
                                  transition={{ duration: 1, delay: 0.2 }}
                                />
                              </div>
                              <span className="text-xs text-gray-500">H</span>
                              <motion.span 
                                className={`text-xs font-medium ml-2 px-1.5 py-0.5 rounded ${
                                  perf.label === 'L' ? 'bg-red-50 text-red-600' :
                                  perf.label === 'H' ? 'bg-[#0fbaad]/10 text-[#0d9488]' :
                                  'bg-gray-100 text-gray-600'
                                }`}
                                whileHover={{ scale: 1.1 }}
                              >
                                {perf.label}
                              </motion.span>
                            </div>
                          </td>

                          {editMode && (
                            <td className="py-4 px-6">
                              <motion.button
                                whileHover={{ scale: 1.2, rotate: 5 }}
                                whileTap={{ scale: 0.9 }}
                                onClick={() => handleRemoveStock(stock.id)}
                                className="flex items-center justify-center w-8 h-8 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                title="Delete this stock"
                              >
                                <FiTrash2 size={16} />
                              </motion.button>
                            </td>
                          )}
                        </motion.tr>
                      );
                    })}
                  </AnimatePresence>
                </tbody>
              </table>
            </div>
          ) : searchQuery ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-16"
            >
              <div className="text-gray-400 mb-3 flex justify-center">
                <FiSearch size={32} />
              </div>
              <div className="text-gray-500 mb-3">No stocks match your search</div>
              <motion.button 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setSearchQuery("")} 
                className="text-[#0fbaad] hover:text-[#0d9488] font-medium hover:underline"
              >
                Clear search
              </motion.button>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-16"
            >
              <motion.div 
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="text-gray-400 mb-3 flex justify-center"
              >
                <FaRegHeart size={32} />
              </motion.div>
              <div className="text-gray-500 mb-3">
                {viewAllStocks ? "My Watchlist is empty" : `${currentWatchlist?.name || "This watchlist"} is empty`}
              </div>
              <motion.button 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowStockSearch(true)} 
                className="text-[#0fbaad] hover:text-[#0d9488] font-medium hover:underline"
              >
                + Add your first stock
              </motion.button>
            </motion.div>
          )}
        </motion.div>
      </motion.div>

      {/* Create Watchlist Modal */}
      <AnimatePresence>
        {showCreateWatchlist && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
              onClick={() => { setShowCreateWatchlist(false); setNewWatchlistName(""); }}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="fixed inset-0 z-50 flex items-center justify-center"
            >
              <div 
                className="bg-white rounded-lg p-6 w-full max-w-md"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex justify-between items-center mb-4">
                  <h5 className="text-base font-medium text-gray-600">Create New Watchlist</h5>
                  <motion.button 
                    whileHover={{ scale: 1.1, rotate: 90 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => { setShowCreateWatchlist(false); setNewWatchlistName(""); }} 
                    className="text-gray-500 hover:text-gray-700"
                  >
                    <FiX size={18} />
                  </motion.button>
                </div>
                
                <div className="mb-1">
                  <motion.input
                    whileFocus={{ scale: 1.01 }}
                    type="text"
                    placeholder="Enter watchlist name..."
                    value={newWatchlistName}
                    onChange={(e) => e.target.value.length <= 18 && setNewWatchlistName(e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#5064FF]/30 focus:border-[#5064FF] transition-all duration-300"
                    onKeyPress={(e) => e.key === 'Enter' && handleCreateWatchlist()}
                    maxLength={18}
                  />
                </div>
                
                <div className="flex justify-between items-center mb-4">
                  <div className="text-xs text-gray-500">18 characters allowed</div>
                  {newWatchlistName.length === 18 && <div className="text-xs text-red-500">Maximum 18 characters reached</div>}
                </div>
                
                <div className="flex justify-end gap-3 mt-6">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => { setShowCreateWatchlist(false); setNewWatchlistName(""); }}
                    className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg text-sm hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleCreateWatchlist}
                    disabled={!newWatchlistName.trim() || newWatchlistName.length > 18}
                    className="px-4 py-2 bg-gradient-to-r from-[#5064FF] to-[#48E1C4] text-white rounded-lg text-sm hover:shadow-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Create
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Stock Search Modal */}
      <AnimatePresence>
        {showStockSearch && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
              onClick={handleCloseStockSearch}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="fixed inset-0 z-50 flex items-center justify-center"
            >
              <div 
                className="bg-white rounded-2xl p-6 w-full max-w-md shadow-lg"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-semibold text-gray-700">
                    Add Stocks to {viewAllStocks ? "My Watchlist" : currentWatchlist?.name}
                  </h3>
                  <motion.button 
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleCloseStockSearch} 
                    className="px-3 py-1.5 text-sm font-medium text-[#5064FF] hover:text-[#48E1C4] transition-colors"
                  >
                    Done
                  </motion.button>
                </div>

                <div className="relative mb-4">
                  <FiSearch className="absolute left-3 top-3 text-gray-500" size={16} />
                  <motion.input
                    whileFocus={{ scale: 1.01 }}
                    type="text"
                    placeholder="Search for stocks..."
                    value={stockSearchQuery}
                    onChange={(e) => setStockSearchQuery(e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-10 py-2 focus:outline-none focus:border-gray-400 focus:ring-0"
                  />
                </div>

                <div className="max-h-64 overflow-y-auto rounded-lg border border-gray-200">
                  <AnimatePresence>
                    {searchResults.map((stock, index) => {
                      const isInWatchlist = demoStocks.some(s => s.symbol === stock.symbol);
                      return (
                        <motion.div
                          key={stock.id}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: 20 }}
                          transition={{ delay: index * 0.05 }}
                          className={`flex items-center justify-between p-3 hover:bg-gray-50 cursor-pointer border-b ${
                            isInWatchlist ? "bg-green-50" : ""
                          }`}
                          onClick={() => !isInWatchlist && handleAddStock(stock)}
                          whileHover={{ scale: 1.01 }}
                        >
                          <div className="flex items-center gap-3">
                            {/* Company Logo in Search Results */}
                            <motion.div 
                              whileHover={{ scale: 1.1, rotate: 5 }}
                              className="h-8 w-8 rounded-full bg-white flex items-center justify-center overflow-hidden border border-gray-200"
                            >
                              <img
                                src={stock.logo || `https://ui-avatars.com/api/?name=${stock.symbol}&background=blue&color=white`}
                                alt={stock.companyName}
                                className="h-5 w-5 object-contain"
                                onError={(e) => {
                                  e.target.onerror = null;
                                  e.target.src = `https://ui-avatars.com/api/?name=${stock.symbol}&background=blue&color=white`;
                                }}
                              />
                            </motion.div>
                            <div>
                              <div className="font-medium text-gray-800">{stock.companyName || stock.name}</div>
                              <div className="text-sm text-gray-500">{stock.symbol}</div>
                            </div>
                          </div>
                          <motion.div 
                            className={`font-medium text-sm ${isInWatchlist ? "text-green-600" : "text-blue-600"}`}
                            whileHover={{ scale: 1.1 }}
                          >
                            {isInWatchlist ? "Added" : "Add"}
                          </motion.div>
                        </motion.div>
                      );
                    })}

                    {stockSearchQuery && searchResults.length === 0 && (
                      <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-center py-4 text-gray-500 text-sm"
                      >
                        No stocks found
                      </motion.div>
                    )}

                    {!stockSearchQuery && searchResults.length === 0 && (
                      <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-center py-4 text-gray-500 text-sm"
                      >
                        Start typing to search for stocks
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

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
      `}</style>
    </div>
  );
}