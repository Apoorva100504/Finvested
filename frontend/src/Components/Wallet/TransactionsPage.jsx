import React, { useState } from "react";

export default function TransactionsPage() {
  const [filters, setFilters] = useState({
    status: [],
    type: [],
    startDate: "",
    endDate: ""
  });

  // Mock transaction data - Increased to 20 for testing scroll
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
    // Status filter
    if (filters.status.length > 0 && !filters.status.includes(transaction.status)) {
      return false;
    }
    
    // Type filter
    if (filters.type.length > 0 && !filters.type.includes(transaction.type)) {
      return false;
    }
    
    // Date filter
    const transactionDate = new Date(transaction.date);
    if (filters.startDate && transactionDate < new Date(filters.startDate)) {
      return false;
    }
    if (filters.endDate && transactionDate > new Date(filters.endDate)) {
      return false;
    }
    
    return true;
  });

  // Calculate balances (always show regardless of filters)
  const calculateBalances = () => {
    const allTransactions = transactions; // Always use ALL transactions
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

  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  // Get status color
  const getStatusColor = (status) => {
    switch(status) {
      case 'completed': return 'text-green-600 bg-green-50';
      case 'processing': return 'text-yellow-600 bg-yellow-50';
      case 'failed': return 'text-red-600 bg-red-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 px-4 md:px-56 py-8 font-sans text-gray-900">
      {/* Header */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
              Transactions
            </h1>
            <p className="text-gray-600 mt-1">View all your transaction history</p>
          </div>
          <button className="text-green-700 font-medium hover:text-green-800 hover:underline transition-all duration-200">
            Download statement
          </button>
        </div>
        <div className="h-1.5 w-24 bg-gradient-to-r from-green-400 via-blue-400 to-purple-500 rounded-full"></div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Filters Sidebar */}
        <div className="md:col-span-1">
          <div className="bg-white rounded-2xl p-6 border border-green-100 shadow-sm sticky top-8">
            <div className="flex justify-between items-center mb-6">
              <p className="text-sm font-semibold text-gray-700">FILTERS</p>
              <button 
                onClick={clearAllFilters}
                className="text-green-700 text-xs font-medium hover:text-green-800 transition-colors duration-200"
              >
                CLEAR ALL
              </button>
            </div>

            {/* Transaction Status */}
            <div className="mb-6 border-b border-gray-100 pb-6">
              <p className="text-sm font-medium text-gray-700 mb-3">Transaction Status</p>
              <div className="space-y-2">
                {['completed', 'processing', 'failed'].map((status) => (
                  <label 
                    key={status}
                    className="flex items-center gap-3 text-sm text-gray-600 hover:text-gray-800 cursor-pointer group"
                  >
                    <div className="relative">
                      <input 
                        type="checkbox" 
                        checked={filters.status.includes(status)}
                        onChange={() => handleFilterChange('status', status)}
                        className="sr-only peer"
                      />
                      <div className="w-4 h-4 border border-gray-300 rounded-sm peer-checked:border-green-500 peer-checked:bg-green-500 flex items-center justify-center group-hover:border-green-400 transition-all duration-200">
                        <svg className="w-3 h-3 text-white opacity-0 peer-checked:opacity-100 transition-opacity duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                    </div>
                    <span className="capitalize">{status}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Transaction Type */}
            <div className="mb-6 border-b border-gray-100 pb-6">
              <p className="text-sm font-medium text-gray-700 mb-3">Transaction Type</p>
              <div className="space-y-2">
                {['Deposit', 'Withdraw', 'Stocks', 'FnO', 'Others'].map((type) => (
                  <label 
                    key={type}
                    className="flex items-center gap-3 text-sm text-gray-600 hover:text-gray-800 cursor-pointer group"
                  >
                    <div className="relative">
                      <input 
                        type="checkbox" 
                        checked={filters.type.includes(type)}
                        onChange={() => handleFilterChange('type', type)}
                        className="sr-only peer"
                      />
                      <div className="w-4 h-4 border border-gray-300 rounded-sm peer-checked:border-green-500 peer-checked:bg-green-500 flex items-center justify-center group-hover:border-green-400 transition-all duration-200">
                        <svg className="w-3 h-3 text-white opacity-0 peer-checked:opacity-100 transition-opacity duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                    </div>
                    <span>{type}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Date Range */}
            <div>
              <p className="text-sm font-medium text-gray-700 mb-3">Date Range</p>
              <div className="space-y-3">
                <div>
                  <p className="text-xs text-gray-500 mb-1">From</p>
                  <input 
                    type="date" 
                    value={filters.startDate}
                    onChange={(e) => handleDateChange('startDate', e.target.value)}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:border-green-400 focus:ring-2 focus:ring-green-100 outline-none transition-all duration-200"
                  />
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-1">To</p>
                  <input 
                    type="date" 
                    value={filters.endDate}
                    onChange={(e) => handleDateChange('endDate', e.target.value)}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:border-green-400 focus:ring-2 focus:ring-green-100 outline-none transition-all duration-200"
                  />
                </div>
              </div>
            </div>

            {/* Active Filters */}
            {(filters.status.length > 0 || filters.type.length > 0 || filters.startDate || filters.endDate) && (
              <div className="mt-6 pt-6 border-t border-gray-100">
                <p className="text-sm font-medium text-gray-700 mb-2">Active Filters</p>
                <div className="flex flex-wrap gap-2">
                  {filters.status.map(status => (
                    <span key={status} className="px-2 py-1 bg-green-50 text-green-700 text-xs rounded-full border border-green-100">
                      {status}
                    </span>
                  ))}
                  {filters.type.map(type => (
                    <span key={type} className="px-2 py-1 bg-green-50 text-green-700 text-xs rounded-full border border-green-100">
                      {type}
                    </span>
                  ))}
                  {filters.startDate && (
                    <span className="px-2 py-1 bg-green-50 text-green-700 text-xs rounded-full border border-green-100">
                      From: {filters.startDate}
                    </span>
                  )}
                  {filters.endDate && (
                    <span className="px-2 py-1 bg-green-50 text-green-700 text-xs rounded-full border border-green-100">
                      To: {filters.endDate}
                    </span>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Content Area */}
        <div className="md:col-span-3 flex flex-col min-h-[600px]">
          <div className="bg-white rounded-2xl p-6 border border-green-100 shadow-sm flex-1 flex flex-col">
            {/* Results Header */}
            <div className="flex justify-between items-center mb-6">
              <div>
                <h2 className="font-semibold text-gray-900">Transaction History</h2>
                <p className="text-sm text-gray-500">
                  Showing {filteredTransactions.length} of {transactions.length} transactions
                </p>
              </div>
              <div className="flex items-center gap-4">
                <button className="text-sm text-gray-600 hover:text-gray-800 transition-colors duration-200">
                  Sort by: Recent
                </button>
              </div>
            </div>

            {/* Transactions List with Scrollbar */}
            {filteredTransactions.length === 0 ? (
              <div className="flex flex-col justify-center items-center py-16 text-center flex-1">
                <div className="text-6xl mb-4 opacity-50">💳</div>
                <p className="text-lg font-semibold text-gray-900 mb-2">No transactions found</p>
                <p className="text-sm text-gray-500 max-w-md">
                  Try changing or clearing the filters to see your transaction history
                </p>
                <button 
                  onClick={clearAllFilters}
                  className="mt-4 px-4 py-2 text-green-700 font-medium hover:text-green-800 hover:bg-green-50 rounded-lg transition-all duration-200"
                >
                  Clear all filters
                </button>
              </div>
            ) : (
              <div className="flex-1 overflow-hidden flex flex-col">
                {/* Scrollable Transactions Container */}
                <div className="overflow-y-auto pr-2 flex-1 custom-scrollbar">
                  <div className="space-y-4">
                    {filteredTransactions.map((transaction) => (
                      <div 
                        key={transaction.id}
                        className="flex items-center gap-4 p-4 border border-gray-100 rounded-xl hover:bg-green-50/30 hover:border-green-100 transition-all duration-200 group"
                      >
                        {/* Icon */}
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-50 to-emerald-50 flex items-center justify-center text-xl group-hover:scale-105 transition-transform duration-200">
                          {transaction.icon}
                        </div>

                        {/* Details */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-3 mb-1">
                            <h3 className="font-medium text-gray-900 truncate">
                              {transaction.type} • {transaction.method}
                            </h3>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(transaction.status)}`}>
                              {transaction.status}
                            </span>
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
                          <p className={`text-lg font-semibold ${transaction.type === 'Withdraw' ? 'text-red-600' : 'text-green-600'}`}>
                            {transaction.type === 'Withdraw' ? '-' : '+'}{formatCurrency(transaction.amount)}
                          </p>
                          <p className="text-sm text-gray-500">
                            {transaction.type === 'Withdraw' ? 'Debited' : 'Credited'}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Fixed Balance Summary at Bottom */}
                <div className="mt-8 pt-6 border-t border-gray-100 sticky bottom-0 bg-white">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-4 rounded-xl border border-green-100">
                      <p className="text-sm text-gray-600 mb-1">Total Credits</p>
                      <p className="text-xl font-bold text-green-700">
                        {formatCurrency(balances.credits)}
                      </p>
                      <p className="text-xs text-green-600 mt-1">All deposits & inflows</p>
                    </div>
                    <div className="bg-gradient-to-br from-red-50 to-pink-50 p-4 rounded-xl border border-red-100">
                      <p className="text-sm text-gray-600 mb-1">Total Debits</p>
                      <p className="text-xl font-bold text-red-700">
                        {formatCurrency(balances.debits)}
                      </p>
                      <p className="text-xs text-red-600 mt-1">All withdrawals & outflows</p>
                    </div>
                    <div className="bg-gradient-to-br from-blue-50 to-cyan-50 p-4 rounded-xl border border-blue-100">
                      <p className="text-sm text-gray-600 mb-1">Net Balance</p>
                      <p className="text-xl font-bold text-blue-700">
                        {formatCurrency(balances.net)}
                      </p>
                      <p className={`text-xs mt-1 ${balances.net >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {balances.net >= 0 ? 'Positive balance' : 'Negative balance'}
                      </p>
                    </div>
                  </div>
                  
                  {/* Last Deposit Info */}
                  <div className="mt-4 p-3 bg-gray-50 rounded-lg border border-gray-100">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-green-100 flex items-center justify-center">
                          <span className="text-green-700">💰</span>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-900">Last Deposit</p>
                          <p className="text-xs text-gray-500">
                            ₹{transactions.find(t => t.type === 'Deposit')?.amount.toLocaleString() || '0'} on {transactions.find(t => t.type === 'Deposit')?.date || 'N/A'}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium text-gray-900">Current Balance</p>
                        <p className="text-lg font-bold text-green-700">{formatCurrency(balances.net)}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Custom scrollbar styles */}
      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #f1f1f1;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #c1c1c1;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #a1a1a1;
        }
      `}</style>
    </div>
  );
}
