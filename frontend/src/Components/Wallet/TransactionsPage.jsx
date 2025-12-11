import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function TransactionsPage() {
  const [filters, setFilters] = useState({
    status: [],
    type: [],
    startDate: "",
    endDate: ""
  });

  const transactions = [
    {
      id: 1,
      type: "Deposit",
      method: "UPI",
      amount: 5000,
      status: "completed",
      date: "15 Dec 2024",
      time: "14:30",
      reference: "TX123456",
      icon: "💳"
    },
    {
      id: 2,
      type: "Withdraw",
      method: "Bank Transfer",
      amount: 2500,
      status: "completed",
      date: "14 Dec 2024",
      time: "10:15",
      reference: "TX123457",
      icon: "🏦"
    },
    {
      id: 3,
      type: "Deposit",
      method: "Net Banking",
      amount: 3000,
      status: "processing",
      date: "14 Dec 2024",
      time: "09:45",
      reference: "TX123458",
      icon: "💻"
    },
    {
      id: 4,
      type: "Withdraw",
      method: "Bank Transfer",
      amount: 1500,
      status: "failed",
      date: "13 Dec 2024",
      time: "16:20",
      reference: "TX123459",
      icon: "❌"
    },
    {
      id: 5,
      type: "Stocks",
      method: "Equity Purchase",
      amount: 10000,
      status: "completed",
      date: "12 Dec 2024",
      time: "11:30",
      reference: "TX123460",
      icon: "📈"
    },
    {
      id: 6,
      type: "FnO",
      method: "Options Trading",
      amount: 5000,
      status: "completed",
      date: "11 Dec 2024",
      time: "15:45",
      reference: "TX123461",
      icon: "📊"
    },
    {
      id: 7,
      type: "Deposit",
      method: "UPI",
      amount: 7500,
      status: "completed",
      date: "10 Dec 2024",
      time: "13:20",
      reference: "TX123462",
      icon: "💳"
    },
    {
      id: 8,
      type: "Others",
      method: "Account Fee",
      amount: 236,
      status: "completed",
      date: "09 Dec 2024",
      time: "10:00",
      reference: "TX123463",
      icon: "💰"
    },
    {
      id: 9,
      type: "Deposit",
      method: "UPI",
      amount: 3000,
      status: "completed",
      date: "08 Dec 2024",
      time: "16:45",
      reference: "TX123464",
      icon: "💳"
    },
    {
      id: 10,
      type: "Withdraw",
      method: "Bank Transfer",
      amount: 2000,
      status: "completed",
      date: "07 Dec 2024",
      time: "12:30",
      reference: "TX123465",
      icon: "🏦"
    },
    {
      id: 11,
      type: "Deposit",
      method: "Net Banking",
      amount: 8000,
      status: "completed",
      date: "06 Dec 2024",
      time: "14:20",
      reference: "TX123466",
      icon: "💻"
    },
    {
      id: 12,
      type: "Stocks",
      method: "Equity Sale",
      amount: 12000,
      status: "completed",
      date: "05 Dec 2024",
      time: "11:15",
      reference: "TX123467",
      icon: "📈"
    },
    {
      id: 13,
      type: "Deposit",
      method: "UPI",
      amount: 4500,
      status: "processing",
      date: "04 Dec 2024",
      time: "09:30",
      reference: "TX123468",
      icon: "💳"
    },
    {
      id: 14,
      type: "Withdraw",
      method: "Bank Transfer",
      amount: 3000,
      status: "completed",
      date: "03 Dec 2024",
      time: "15:40",
      reference: "TX123469",
      icon: "🏦"
    },
    {
      id: 15,
      type: "FnO",
      method: "Futures Trading",
      amount: 7000,
      status: "completed",
      date: "02 Dec 2024",
      time: "13:25",
      reference: "TX123470",
      icon: "📊"
    }
  ];

  const handleFilterChange = (filterType, value) => {
    setFilters(prev => ({
      ...prev,
      [filterType]: prev[filterType].includes(value)
        ? prev[filterType].filter(item => item !== value)
        : [...prev[filterType], value]
    }));
  };

  const handleDateChange = (field, value) => {
    setFilters(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const clearAllFilters = () => {
    setFilters({
      status: [],
      type: [],
      startDate: "",
      endDate: ""
    });
  };

  const filteredTransactions = transactions.filter(transaction => {
    if (filters.status.length > 0 && !filters.status.includes(transaction.status)) {
      return false;
    }
    
    if (filters.type.length > 0 && !filters.type.includes(transaction.type)) {
      return false;
    }
    
    const transactionDate = new Date(transaction.date);
    if (filters.startDate && transactionDate < new Date(filters.startDate)) {
      return false;
    }
    if (filters.endDate && transactionDate > new Date(filters.endDate)) {
      return false;
    }
    
    return true;
  });

  const calculateBalances = () => {
    const allTransactions = transactions;
    const credits = allTransactions
      .filter(t => t.type !== 'Withdraw')
      .reduce((sum, t) => sum + t.amount, 0);
    
    const debits = allTransactions
      .filter(t => t.type === 'Withdraw')
      .reduce((sum, t) => sum + t.amount, 0);
    
    const net = credits - debits;
    
    return { credits, debits, net };
  };

  const balances = calculateBalances();

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'completed': return 'text-green-600 bg-green-50';
      case 'processing': return 'text-yellow-600 bg-yellow-50';
      case 'failed': return 'text-red-600 bg-red-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  return (
    <>
      {/* Animated Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-[#48E1C4]/20 rounded-full mix-blend-multiply filter blur-3xl animate-blob"></div>
        <div className="absolute top-1/3 right-1/4 w-64 h-64 bg-[#5064FF]/20 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-1/4 left-1/2 w-64 h-64 bg-[#48E1C4]/20 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-4000"></div>
      </div>

      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50/30 px-4 md:px-32 py-8 font-sans text-gray-900">
        {/* Header */}
        <motion.header 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <div className="flex justify-between items-center mb-4">
            <div>
              <motion.h1 
                className="text-3xl font-bold bg-gradient-to-r from-[#5064FF] via-[#48E1C4] to-[#5064FF] bg-clip-text text-transparent"
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.3 }}
              >
                Transactions
              </motion.h1>
              <p className="text-[#5064FF] text-sm mt-1">View all your transaction history</p>
            </div>
            <motion.button 
              className="text-[#5064FF] font-medium hover:text-[#48E1C4] hover:underline transition-all duration-200"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Download statement
            </motion.button>
          </div>
          <motion.div 
            className="h-1.5 w-24 bg-gradient-to-r from-[#5064FF] to-[#48E1C4] rounded-full"
            initial={{ width: 0 }}
            animate={{ width: "6rem" }}
            transition={{ duration: 1 }}
          />
        </motion.header>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Filters Sidebar */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="md:col-span-1"
          >
            <div className="gradient-hover bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-gray-100/50 shadow-sm sticky top-8">
              <div className="flex justify-between items-center mb-6">
                <p className="text-sm font-semibold text-gray-700">FILTERS</p>
                <motion.button 
                  onClick={clearAllFilters}
                  className="text-[#5064FF] text-xs font-medium hover:text-[#48E1C4] transition-colors duration-200"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  CLEAR ALL
                </motion.button>
              </div>

              {/* Transaction Status */}
              <div className="mb-6 border-b border-gray-100/50 pb-6">
                <p className="text-sm font-medium text-gray-700 mb-3">Transaction Status</p>
                <div className="space-y-2">
                  {['completed', 'processing', 'failed'].map((status) => (
                    <motion.label 
                      key={status}
                      className="flex items-center gap-3 text-sm text-gray-600 hover:text-gray-800 cursor-pointer group"
                      whileHover={{ x: 5 }}
                    >
                      <div className="relative">
                        <input 
                          type="checkbox" 
                          checked={filters.status.includes(status)}
                          onChange={() => handleFilterChange('status', status)}
                          className="sr-only peer"
                        />
                        <div className="w-4 h-4 border border-gray-300 rounded-sm peer-checked:border-[#5064FF] peer-checked:bg-[#5064FF] flex items-center justify-center group-hover:border-[#5064FF]/70 transition-all duration-200">
                          <svg className="w-3 h-3 text-white opacity-0 peer-checked:opacity-100 transition-opacity duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                      </div>
                      <span className="capitalize">{status}</span>
                    </motion.label>
                  ))}
                </div>
              </div>

              {/* Transaction Type */}
              <div className="mb-6 border-b border-gray-100/50 pb-6">
                <p className="text-sm font-medium text-gray-700 mb-3">Transaction Type</p>
                <div className="space-y-2">
                  {['Deposit', 'Withdraw', 'Stocks', 'FnO', 'Others'].map((type) => (
                    <motion.label 
                      key={type}
                      className="flex items-center gap-3 text-sm text-gray-600 hover:text-gray-800 cursor-pointer group"
                      whileHover={{ x: 5 }}
                    >
                      <div className="relative">
                        <input 
                          type="checkbox" 
                          checked={filters.type.includes(type)}
                          onChange={() => handleFilterChange('type', type)}
                          className="sr-only peer"
                        />
                        <div className="w-4 h-4 border border-gray-300 rounded-sm peer-checked:border-[#5064FF] peer-checked:bg-[#5064FF] flex items-center justify-center group-hover:border-[#5064FF]/70 transition-all duration-200">
                          <svg className="w-3 h-3 text-white opacity-0 peer-checked:opacity-100 transition-opacity duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                      </div>
                      <span>{type}</span>
                    </motion.label>
                  ))}
                </div>
              </div>

              {/* Date Range */}
              <div>
                <p className="text-sm font-medium text-gray-700 mb-3">Date Range</p>
                <div className="space-y-3">
                  <div>
                    <p className="text-xs text-gray-500 mb-1">From</p>
                    <motion.input 
                      whileFocus={{ scale: 1.01 }}
                      type="date" 
                      value={filters.startDate}
                      onChange={(e) => handleDateChange('startDate', e.target.value)}
                      className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:border-[#5064FF] focus:ring-2 focus:ring-[#5064FF]/20 outline-none transition-all duration-200"
                    />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 mb-1">To</p>
                    <motion.input 
                      whileFocus={{ scale: 1.01 }}
                      type="date" 
                      value={filters.endDate}
                      onChange={(e) => handleDateChange('endDate', e.target.value)}
                      className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:border-[#5064FF] focus:ring-2 focus:ring-[#5064FF]/20 outline-none transition-all duration-200"
                    />
                  </div>
                </div>
              </div>

              {/* Active Filters */}
              <AnimatePresence>
                {(filters.status.length > 0 || filters.type.length > 0 || filters.startDate || filters.endDate) && (
                  <motion.div 
                    className="mt-6 pt-6 border-t border-gray-100/50"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                  >
                    <p className="text-sm font-medium text-gray-700 mb-2">Active Filters</p>
                    <div className="flex flex-wrap gap-2">
                      {filters.status.map(status => (
                        <motion.span 
                          key={status} 
                          className="px-2 py-1 bg-gradient-to-r from-[#5064FF]/10 to-[#48E1C4]/10 text-[#5064FF] text-xs rounded-full border border-[#5064FF]/20"
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          exit={{ scale: 0 }}
                        >
                          {status}
                        </motion.span>
                      ))}
                      {filters.type.map(type => (
                        <motion.span 
                          key={type} 
                          className="px-2 py-1 bg-gradient-to-r from-[#5064FF]/10 to-[#48E1C4]/10 text-[#5064FF] text-xs rounded-full border border-[#5064FF]/20"
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          exit={{ scale: 0 }}
                        >
                          {type}
                        </motion.span>
                      ))}
                      {filters.startDate && (
                        <motion.span 
                          className="px-2 py-1 bg-gradient-to-r from-[#5064FF]/10 to-[#48E1C4]/10 text-[#5064FF] text-xs rounded-full border border-[#5064FF]/20"
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          exit={{ scale: 0 }}
                        >
                          From: {filters.startDate}
                        </motion.span>
                      )}
                      {filters.endDate && (
                        <motion.span 
                          className="px-2 py-1 bg-gradient-to-r from-[#5064FF]/10 to-[#48E1C4]/10 text-[#5064FF] text-xs rounded-full border border-[#5064FF]/20"
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          exit={{ scale: 0 }}
                        >
                          To: {filters.endDate}
                        </motion.span>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>

          {/* Content Area */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="md:col-span-3 flex flex-col min-h-[600px]"
          >
            <div className="gradient-hover bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-gray-100/50 shadow-sm flex-1 flex flex-col">
              {/* Results Header */}
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h2 className="font-semibold text-gray-900">Transaction History</h2>
                  <p className="text-sm text-gray-500">
                    Showing {filteredTransactions.length} of {transactions.length} transactions
                  </p>
                </div>
                <div className="flex items-center gap-4">
                  <motion.button 
                    className="text-sm text-gray-600 hover:text-gray-800 transition-colors duration-200"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Sort by: Recent
                  </motion.button>
                </div>
              </div>

              {/* Transactions List with Scrollbar */}
              <AnimatePresence mode="wait">
                {filteredTransactions.length === 0 ? (
                  <motion.div 
                    className="flex flex-col justify-center items-center py-16 text-center flex-1"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                  >
                    <motion.div 
                      className="text-6xl mb-4 opacity-50"
                      animate={{ rotate: [0, 10, -10, 0] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    >
                      💳
                    </motion.div>
                    <p className="text-lg font-semibold text-gray-900 mb-2">No transactions found</p>
                    <p className="text-sm text-gray-500 max-w-md">
                      Try changing or clearing the filters to see your transaction history
                    </p>
                    <motion.button 
                      onClick={clearAllFilters}
                      className="mt-4 px-4 py-2 text-[#5064FF] font-medium hover:text-[#48E1C4] hover:bg-gradient-to-r hover:from-[#5064FF]/5 hover:via-white hover:to-[#48E1C4]/5 rounded-lg transition-all duration-200 border border-[#5064FF]/20"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      Clear all filters
                    </motion.button>
                  </motion.div>
                ) : (
                  <motion.div 
                    className="flex-1 overflow-hidden flex flex-col"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    {/* Scrollable Transactions Container */}
                    <div className="overflow-y-auto pr-2 flex-1 custom-scrollbar">
                      <div className="space-y-4">
                        <AnimatePresence>
                          {filteredTransactions.map((transaction, index) => (
                            <motion.div 
                              key={transaction.id}
                              initial={{ opacity: 0, y: 20 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, y: -20 }}
                              transition={{ duration: 0.2, delay: index * 0.03 }}
                              className="flex items-center gap-4 p-4 border border-gray-100/50 rounded-xl hover:bg-gradient-to-r hover:from-[#5064FF]/5 hover:via-white hover:to-[#48E1C4]/5 hover:border-[#5064FF]/30 transition-all duration-200 group"
                              whileHover={{ scale: 1.01 }}
                            >
                              {/* Icon */}
                              <motion.div 
                                className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#5064FF]/10 to-[#48E1C4]/10 flex items-center justify-center text-xl"
                                whileHover={{ rotate: 5, scale: 1.1 }}
                                transition={{ duration: 0.3 }}
                              >
                                {transaction.icon}
                              </motion.div>

                              {/* Details */}
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-3 mb-1">
                                  <h3 className="font-medium text-gray-900 truncate">
                                    {transaction.type} • {transaction.method}
                                  </h3>
                                  <motion.span 
                                    className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(transaction.status)}`}
                                    whileHover={{ scale: 1.1 }}
                                  >
                                    {transaction.status}
                                  </motion.span>
                                </div>
                                <div className="flex items-center gap-4 text-sm text-gray-500">
                                  <span>{transaction.date}</span>
                                  <span>•</span>
                                  <span>{transaction.time}</span>
                                  <span>•</span>
                                  <span>Ref: {transaction.reference}</span>
                                </div>
                              </div>

                              {/* Amount */}
                              <div className="text-right">
                                <motion.p 
                                  className={`text-lg font-semibold ${transaction.type === 'Withdraw' ? 'text-red-600' : 'text-green-600'}`}
                                  whileHover={{ scale: 1.1 }}
                                  initial={false}
                                  animate={{ scale: transaction.amount > 5000 ? [1, 1.05, 1] : 1 }}
                                  transition={{ duration: 0.5, repeat: transaction.amount > 5000 ? Infinity : 0, repeatDelay: 3 }}
                                >
                                  {transaction.type === 'Withdraw' ? '-' : '+'}{formatCurrency(transaction.amount)}
                                </motion.p>
                                <p className="text-sm text-gray-500">
                                  {transaction.type === 'Withdraw' ? 'Debited' : 'Credited'}
                                </p>
                              </div>
                            </motion.div>
                          ))}
                        </AnimatePresence>
                      </div>
                    </div>

                    {/* Fixed Balance Summary at Bottom */}
                    <motion.div 
                      className="mt-8 pt-6 border-t border-gray-100/50 sticky bottom-0 bg-white/80 backdrop-blur-sm"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: 0.4 }}
                    >
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <motion.div 
                          className="gradient-hover bg-gradient-to-br from-green-50 to-emerald-50 p-4 rounded-xl border border-green-100/50"
                          whileHover={{ scale: 1.02, y: -5 }}
                        >
                          <p className="text-sm text-gray-600 mb-1">Total Credits</p>
                          <p className="text-xl font-bold text-green-700">
                            {formatCurrency(balances.credits)}
                          </p>
                          <motion.p 
                            className="text-xs text-green-600 mt-1"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.5 }}
                          >
                            All deposits & inflows
                          </motion.p>
                        </motion.div>
                        
                        <motion.div 
                          className="gradient-hover bg-gradient-to-br from-red-50 to-pink-50 p-4 rounded-xl border border-red-100/50"
                          whileHover={{ scale: 1.02, y: -5 }}
                        >
                          <p className="text-sm text-gray-600 mb-1">Total Debits</p>
                          <p className="text-xl font-bold text-red-700">
                            {formatCurrency(balances.debits)}
                          </p>
                          <motion.p 
                            className="text-xs text-red-600 mt-1"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.6 }}
                          >
                            All withdrawals & outflows
                          </motion.p>
                        </motion.div>
                        
                        <motion.div 
                          className="gradient-hover bg-gradient-to-br from-blue-50 to-cyan-50 p-4 rounded-xl border border-blue-100/50"
                          whileHover={{ scale: 1.02, y: -5 }}
                        >
                          <p className="text-sm text-gray-600 mb-1">Net Balance</p>
                          <p className="text-xl font-bold text-blue-700">
                            {formatCurrency(balances.net)}
                          </p>
                          <motion.p 
                            className={`text-xs mt-1 ${balances.net >= 0 ? 'text-green-600' : 'text-red-600'}`}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.7 }}
                          >
                            {balances.net >= 0 ? 'Positive balance' : 'Negative balance'}
                          </motion.p>
                        </motion.div>
                      </div>
                      
                      {/* Last Deposit Info */}
                      <motion.div 
                        className="mt-4 p-3 bg-gradient-to-r from-gray-50/50 to-gray-100/50 rounded-lg border border-gray-100/50"
                        whileHover={{ scale: 1.01 }}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <motion.div 
                              className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#5064FF]/10 to-[#48E1C4]/10 flex items-center justify-center"
                              whileHover={{ rotate: 5 }}
                            >
                              <span className="text-[#5064FF]">💰</span>
                            </motion.div>
                            <div>
                              <p className="text-sm font-medium text-gray-900">Last Deposit</p>
                              <p className="text-xs text-gray-500">
                                ₹{transactions.find(t => t.type === 'Deposit')?.amount.toLocaleString() || '0'} on {transactions.find(t => t.type === 'Deposit')?.date || 'N/A'}
                              </p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-sm font-medium text-gray-900">Current Balance</p>
                            <motion.p 
                              className="text-lg font-bold text-green-700"
                              initial={false}
                              animate={{ scale: [1, 1.05, 1] }}
                              transition={{ duration: 2, repeat: Infinity }}
                            >
                              {formatCurrency(balances.net)}
                            </motion.p>
                          </div>
                        </div>
                      </motion.div>
                    </motion.div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </div>
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
            rgba(72, 225, 196, 0.05) 25%, 
            rgba(80, 100, 255, 0.05) 50%, 
            rgba(72, 225, 196, 0.05) 75%, 
            transparent 100%
          );
          transition: transform 0.8s ease;
          z-index: 0;
        }
        
        .gradient-hover:hover::before {
          transform: translateX(100%);
        }
        
        /* Ensure text remains visible over gradient */
        .gradient-hover > *:not(:before) {
          position: relative;
          z-index: 1;
        }
        
        /* Custom scrollbar */
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(241, 241, 241, 0.5);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: linear-gradient(to bottom, #5064FF, #48E1C4);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: linear-gradient(to bottom, #4054FF, #38D1B4);
        }
      `}</style>
    </>
  );
}
