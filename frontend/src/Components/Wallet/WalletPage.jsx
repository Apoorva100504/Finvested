import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

export default function WalletPage() {
  const [addAmount, setAddAmount] = useState("");
  const [withdrawAmount, setWithdrawAmount] = useState("");
  const [activeTab, setActiveTab] = useState("add");
  const [showCashModal, setShowCashModal] = useState(false);
  const [modalPosition, setModalPosition] = useState({ x: 0, y: 0 });
  const [transactions, setTransactions] = useState([]);
  const navigate = useNavigate();

  const balance = 12500.50;
  const minAmount = 100;
  const bankDetails = {
    name: "HDFC Bank",
    account: "•••6016",
    upiId: "user@hdfcbank"
  };

  const mockTransactions = [
    {
      id: 1,
      type: "deposit",
      amount: 5000,
      method: "UPI",
      status: "completed",
      date: "2024-12-15",
      time: "14:30",
      reference: "TX123456"
    },
    {
      id: 2,
      type: "withdrawal",
      amount: 2500,
      method: "Bank Transfer",
      status: "completed",
      date: "2024-12-14",
      time: "10:15",
      reference: "TX123457"
    },
    {
      id: 3,
      type: "deposit",
      amount: 3000,
      method: "Net Banking",
      status: "processing",
      date: "2024-12-14",
      time: "09:45",
      reference: "TX123458"
    },
    {
      id: 4,
      type: "withdrawal",
      amount: 1500,
      method: "Bank Transfer",
      status: "failed",
      date: "2024-12-13",
      time: "16:20",
      reference: "TX123459"
    },
    {
      id: 5,
      type: "deposit",
      amount: 10000,
      method: "UPI",
      status: "completed",
      date: "2024-12-12",
      time: "11:30",
      reference: "TX123460"
    }
  ];

  useEffect(() => {
    setTransactions(mockTransactions);
  }, []);

  const handleCashClick = (e) => {
    const rect = e.target.getBoundingClientRect();
    setModalPosition({
      x: rect.left + rect.width / 2,
      y: rect.top - 10
    });
    setShowCashModal(true);
    
    setTimeout(() => {
      setShowCashModal(false);
    }, 2000);
  };

  const handleAddMoney = () => {
    if (addAmount < minAmount) {
      alert(`Minimum amount is ₹${minAmount}`);
      return;
    }
    alert(`Added ₹${addAmount} to your wallet!`);
    setAddAmount("");
  };

  const handleWithdraw = () => {
    if (withdrawAmount < minAmount) {
      alert(`Minimum withdrawal is ₹${minAmount}`);
      return;
    }
    if (withdrawAmount > balance) {
      alert(`Insufficient balance! Available: ₹${balance}`);
      return;
    }
    alert(`Withdrawal request of ₹${withdrawAmount} initiated!`);
    setWithdrawAmount("");
  };

  const handleBackgroundClick = (e) => {
    if (e.target.id === "modal-backdrop") {
      setShowCashModal(false);
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const formatNumber = (num) => {
    return num.toLocaleString('en-IN', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
  };

  return (
    <>
      {/* Animated Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-[#48E1C4]/20 rounded-full mix-blend-multiply filter blur-3xl animate-blob"></div>
        <div className="absolute top-1/3 right-1/4 w-64 h-64 bg-[#5064FF]/20 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-1/4 left-1/2 w-64 h-64 bg-[#48E1C4]/20 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-4000"></div>
      </div>

      {/* Modal Backdrop */}
      <AnimatePresence>
        {showCashModal && (
          <motion.div 
            id="modal-backdrop"
            className="fixed inset-0 z-40 bg-transparent"
            onClick={handleBackgroundClick}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div 
              className="fixed bg-white/90 backdrop-blur-sm text-gray-800 text-sm px-4 py-3 rounded-2xl shadow-xl z-50 min-w-[220px] border border-green-200/50"
              style={{
                left: `${modalPosition.x - 110}px`,
                top: `${modalPosition.y - 70}px`,
              }}
              initial={{ opacity: 0, scale: 0.9, y: -20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: -20 }}
            >
              <div className="relative">
                <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2">
                  <div className="w-0 h-0 border-l-[8px] border-r-[8px] border-t-[10px] border-l-transparent border-r-transparent border-t-green-100"></div>
                </div>
                
                <div className="mb-2">
                  <div className="flex justify-between items-center mb-2 p-2 rounded-lg bg-gradient-to-r from-green-50 to-emerald-50">
                    <span className="text-gray-600">Available cash</span>
                    <span className="font-bold text-green-700">{formatCurrency(balance)}</span>
                  </div>
                  
                  <div className="flex justify-between items-center mb-2 p-2 rounded-lg hover:bg-gray-50 transition-colors duration-200">
                    <span className="text-gray-600">Today's opening</span>
                    <span className="font-medium">₹0.00</span>
                  </div>
                  
                  <div className="flex justify-between items-center p-2 rounded-lg hover:bg-gray-50 transition-colors duration-200">
                    <span className="text-gray-600">Today's activity</span>
                    <span className="font-medium text-green-600">₹0.00</span>
                  </div>
                </div>
                
                <div className="text-xs text-gray-500 pt-2 border-t border-gray-100">
                  Your available cash for trading
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="min-h-[60vh] bg-gradient-to-br from-gray-50 via-white to-blue-50/30 px-4 md:px-32 py-8 text-gray-900 font-sans">
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
                Wallet
              </motion.h1>
              <p className="text-[#5064FF] text-sm mt-1">Manage your funds and transactions</p>
            </div>
            <motion.div 
              className="text-right"
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.3 }}
            >
              <p className="text-sm text-gray-500">Available Balance</p>
              <p className="text-2xl font-bold tracking-tight text-green-600">
                {formatCurrency(balance)}
              </p>
              <motion.p 
                initial={false}
                animate={{ scale: [1, 1.05, 1] }}
                transition={{ duration: 0.5, repeat: Infinity, repeatDelay: 3 }}
                className="text-xs text-green-500 mt-1"
              >
                ↗ Live balance
              </motion.p>
            </motion.div>
          </div>
          <motion.div 
            className="h-1.5 w-24 bg-gradient-to-r from-[#5064FF] to-[#48E1C4] rounded-full"
            initial={{ width: 0 }}
            animate={{ width: "6rem" }}
            transition={{ duration: 1 }}
          />
        </motion.header>

        <div className="w-full max-w-6xl grid grid-cols-1 md:grid-cols-2 gap-8 mx-auto">
          
          {/* Left Card - Balance Overview */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="gradient-hover bg-white/80 backdrop-blur-sm p-6 rounded-2xl shadow-lg border border-gray-100/50 hover:shadow-xl transition-all duration-300 group relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-green-50/20 to-emerald-50/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            
            <div className="relative z-10">
              <h2 className="text-sm text-center text-gray-500 mb-1">Stocks, F&O balance</h2>
              <motion.p 
                className="text-3xl text-center font-bold mb-8 text-gray-900"
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.3 }}
              >
                {formatCurrency(balance)}
              </motion.p>

              {/* Cash Row */}
              <motion.div 
                className="flex justify-between items-center py-4 border-b border-green-100 hover:bg-gradient-to-r hover:from-[#5064FF]/5 hover:via-white hover:to-[#48E1C4]/5 px-3 -mx-3 rounded-xl transition-all duration-200 cursor-pointer group/cash relative"
                onClick={handleCashClick}
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className="flex items-center">
                  <motion.div 
                    className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#5064FF]/10 to-[#48E1C4]/10 flex items-center justify-center mr-3 shadow-sm"
                    whileHover={{ rotate: 5, scale: 1.1 }}
                    transition={{ duration: 0.3 }}
                  >
                    <span className="text-xl text-[#5064FF]">💵</span>
                  </motion.div>
                  <div>
                    <p className="font-semibold text-gray-900">Cash</p>
                    <motion.p 
                      className="text-xs text-[#5064FF] opacity-0 group-hover/cash:opacity-100 transition-opacity duration-200"
                      initial={{ x: -10 }}
                      animate={{ x: 0 }}
                    >
                      Click to view details
                    </motion.p>
                  </div>
                </div>
                <motion.p 
                  className="font-bold text-green-700 text-lg"
                  whileHover={{ scale: 1.1 }}
                  transition={{ duration: 0.3 }}
                >
                  {formatCurrency(balance)}
                </motion.p>
              </motion.div>

              {/* Pledge Row */}
              <motion.div 
                className="flex justify-between items-center py-4 px-3 -mx-3 rounded-xl hover:bg-gradient-to-r hover:from-[#5064FF]/5 hover:via-white hover:to-[#48E1C4]/5 transition-all duration-200"
                whileHover={{ x: 5 }}
              >
                <div className="flex items-center">
                  <motion.div 
                    className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-100 to-cyan-100 flex items-center justify-center mr-3 shadow-sm"
                    whileHover={{ rotate: -5, scale: 1.1 }}
                    transition={{ duration: 0.3 }}
                  >
                    <span className="text-xl text-blue-700">🏦</span>
                  </motion.div>
                  <div>
                    <p className="font-semibold text-gray-900 mb-1">Pledge</p>
                    <p className="text-xs text-gray-500 max-w-xs">
                      Add balance by pledging holdings
                    </p>
                  </div>
                </div>
                <motion.button 
                  className="text-green-700 font-semibold hover:text-green-800 hover:scale-105 transition-all duration-200 active:scale-95 px-4 py-2 bg-gradient-to-r from-green-100 to-emerald-100 hover:from-green-200 hover:to-emerald-200 rounded-lg shadow-sm"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  Add
                </motion.button>
              </motion.div>

              {/* Recent Transactions */}
              <div className="mt-8">
                <h3 className="font-semibold text-gray-900 mb-3">Recent Transactions</h3>
                <div className="space-y-3 max-h-64 overflow-y-auto pr-2">
                  <AnimatePresence>
                    {transactions.slice(0, 3).map((transaction, index) => (
                      <motion.div 
                        key={transaction.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.2, delay: index * 0.1 }}
                        className="flex justify-between items-center p-3 border border-gray-100 rounded-lg hover:bg-gradient-to-r hover:from-[#5064FF]/5 hover:via-white hover:to-[#48E1C4]/5 transition-all duration-200"
                        whileHover={{ scale: 1.01 }}
                      >
                        <div>
                          <div className="flex items-center gap-2">
                            <motion.span 
                              className={`text-xs px-2 py-1 rounded-full ${transaction.type === 'deposit' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}
                              whileHover={{ scale: 1.1 }}
                            >
                              {transaction.type === 'deposit' ? 'Deposit' : 'Withdrawal'}
                            </motion.span>
                            <motion.span 
                              className={`text-xs px-2 py-1 rounded-full ${transaction.status === 'completed' ? 'bg-green-100 text-green-700' : transaction.status === 'processing' ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700'}`}
                              whileHover={{ scale: 1.1 }}
                            >
                              {transaction.status}
                            </motion.span>
                          </div>
                          <p className="text-xs text-gray-500 mt-1">
                            {transaction.date} • {transaction.method}
                          </p>
                        </div>
                        <div className="text-right">
                          <motion.p 
                            className={`font-semibold ${transaction.type === 'deposit' ? 'text-green-600' : 'text-red-600'}`}
                            whileHover={{ scale: 1.1 }}
                          >
                            {transaction.type === 'deposit' ? '+' : '-'}{formatCurrency(transaction.amount)}
                          </motion.p>
                          <p className="text-xs text-gray-500">{transaction.time}</p>
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              </div>

              {/* View All Transactions Button */}
              <motion.button 
                onClick={() => navigate("/transaction")}
                className="mt-6 w-full py-3 text-[#5064FF] font-semibold hover:text-[#48E1C4] hover:bg-gradient-to-r hover:from-[#5064FF]/5 hover:via-white hover:to-[#48E1C4]/5 rounded-xl transition-all duration-300 flex items-center justify-center gap-2 group/trans border-2 border-[#5064FF]/20 hover:border-[#5064FF]/40"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                View All Transactions
                <motion.svg 
                  className="w-4 h-4 group-hover/trans:translate-x-1 transition-transform duration-200"
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                  whileHover={{ rotate: 5 }}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </motion.svg>
              </motion.button>
            </div>
          </motion.div>

          {/* Right Card - Add/Withdraw */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="gradient-hover bg-white/80 backdrop-blur-sm p-6 rounded-2xl shadow-lg border border-gray-100/50 hover:shadow-xl transition-all duration-300 group relative overflow-hidden"
          >
            <div className="relative z-10">
              {/* Tabs */}
              <div className="flex gap-8 border-b border-green-100 pb-4 mb-6 font-medium">
                <motion.button
                  onClick={() => setActiveTab("add")}
                  className={`pb-2 relative transition-all duration-200 ${
                    activeTab === "add"
                      ? "text-[#5064FF] font-semibold"
                      : "text-gray-500 hover:text-gray-700"
                  }`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Add money
                  {activeTab === "add" && (
                    <motion.div 
                      className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-[#5064FF] to-[#48E1C4] rounded-full"
                      layoutId="tabIndicator"
                    />
                  )}
                </motion.button>

                <motion.button
                  onClick={() => setActiveTab("withdraw")}
                  className={`pb-2 relative transition-all duration-200 ${
                    activeTab === "withdraw"
                      ? "text-[#5064FF] font-semibold"
                      : "text-gray-500 hover:text-gray-700"
                  }`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Withdraw
                  {activeTab === "withdraw" && (
                    <motion.div 
                      className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-[#5064FF] to-[#48E1C4] rounded-full"
                      layoutId="tabIndicator"
                    />
                  )}
                </motion.button>
              </div>

              {/* Add Money Section */}
              <AnimatePresence mode="wait">
                {activeTab === "add" && (
                  <motion.div
                    key="add"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="mb-6">
                      <p className="text-sm font-medium text-gray-700 mb-3">Enter Amount to Add</p>
                      <div className="flex items-center mb-4">
                        <span className="px-4 py-3 bg-gradient-to-r from-[#5064FF]/10 to-[#48E1C4]/10 rounded-l-xl border border-r-0 border-[#5064FF]/30 font-medium text-[#5064FF]">₹</span>
                        <motion.input
                          whileFocus={{ scale: 1.02 }}
                          type="number"
                          value={addAmount}
                          onChange={(e) => setAddAmount(e.target.value)}
                          className="w-40 border border-[#5064FF]/30 rounded-r-xl px-4 py-3 font-semibold outline-none focus:border-[#5064FF] focus:ring-2 focus:ring-[#5064FF]/20 transition-all duration-200"
                          placeholder="0"
                          min={minAmount}
                        />
                      </div>

                      {/* Quick Buttons for ADD */}
                      <div className="flex gap-2 mb-6">
                        {[100, 500, 1000, 5000].map((value) => (
                          <motion.button
                            key={value}
                            onClick={() => setAddAmount(value)}
                            className="px-3 py-1.5 border border-[#5064FF]/20 rounded-lg text-sm font-medium bg-gradient-to-r from-[#5064FF]/5 to-[#48E1C4]/5 hover:from-[#5064FF]/10 hover:to-[#48E1C4]/10 hover:border-[#5064FF]/40 hover:text-[#5064FF] transition-all duration-200"
                            whileHover={{ scale: 1.05, y: -2 }}
                            whileTap={{ scale: 0.95 }}
                          >
                            ₹{value.toLocaleString()}
                          </motion.button>
                        ))}
                      </div>
                    </div>

                    {addAmount && addAmount < minAmount && (
                      <motion.div 
                        className="mb-4"
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                      >
                        <p className="text-sm text-red-600 bg-gradient-to-r from-red-50 to-red-100 px-3 py-2 rounded-lg border border-red-200">
                          Minimum amount is ₹{minAmount}
                        </p>
                      </motion.div>
                    )}

                    {/* Payment Methods */}
                    <div className="mb-6">
                      <p className="text-sm font-medium text-gray-700 mb-3">Payment Methods</p>
                      <div className="space-y-3">
                        {[
                          { icon: "📍", name: "UPI Payment", desc: "Instant transfer", value: bankDetails.upiId, color: "from-green-100 to-emerald-100" },
                          { icon: "🏦", name: "Bank Transfer", desc: "1-2 hours processing", value: bankDetails.account, color: "from-blue-100 to-cyan-100" },
                        ].map((method, idx) => (
                          <motion.button
                            key={idx}
                            className="w-full flex justify-between items-center border border-[#5064FF]/20 rounded-xl px-4 py-3 text-sm hover:border-[#5064FF]/40 hover:bg-gradient-to-r hover:from-[#5064FF]/5 hover:via-white hover:to-[#48E1C4]/5 transition-all duration-200 group/payment"
                            whileHover={{ scale: 1.01 }}
                            whileTap={{ scale: 0.99 }}
                          >
                            <div className="flex items-center gap-3">
                              <motion.div 
                                className={`w-8 h-8 rounded-lg bg-gradient-to-br ${method.color} flex items-center justify-center`}
                                whileHover={{ rotate: 5, scale: 1.1 }}
                              >
                                <span className={method.icon === "📍" ? "text-green-700" : "text-blue-700"}>{method.icon}</span>
                              </motion.div>
                              <div>
                                <p className="font-semibold text-gray-900">{method.name}</p>
                                <p className="text-xs text-gray-500">{method.desc}</p>
                              </div>
                            </div>
                            <p className="text-[#5064FF] font-medium">
                              {method.value}
                            </p>
                          </motion.button>
                        ))}
                      </div>
                    </div>

                    {/* Submit ADD */}
                    <motion.button
                      onClick={handleAddMoney}
                      disabled={!addAmount || addAmount < minAmount}
                      className={`w-full py-3 text-white rounded-xl font-semibold text-sm transition-all duration-200 relative overflow-hidden group/submit ${
                        addAmount && addAmount >= minAmount
                          ? "bg-gradient-to-r from-[#5064FF] to-[#48E1C4] hover:from-[#5064FF] hover:to-[#48E1C4] hover:shadow-lg" 
                          : "bg-gray-300 cursor-not-allowed"
                      }`}
                      whileHover={{ scale: addAmount && addAmount >= minAmount ? 1.02 : 1 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <span className="relative z-10">Add money</span>
                      <motion.div 
                        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover/submit:translate-x-full transition-transform duration-700"
                      />
                    </motion.button>
                  </motion.div>
                )}

                {/* Withdraw Section */}
                {activeTab === "withdraw" && (
                  <motion.div
                    key="withdraw"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="mb-6">
                      <p className="text-sm font-medium text-gray-700 mb-3">Enter Amount to Withdraw</p>
                      <div className="flex items-center mb-4">
                        <span className="px-4 py-3 bg-gradient-to-r from-[#5064FF]/10 to-[#48E1C4]/10 rounded-l-xl border border-r-0 border-[#5064FF]/30 font-medium text-[#5064FF]">₹</span>
                        <motion.input
                          whileFocus={{ scale: 1.02 }}
                          type="number"
                          value={withdrawAmount}
                          onChange={(e) => setWithdrawAmount(e.target.value)}
                          className="w-40 border border-[#5064FF]/30 rounded-r-xl px-4 py-3 font-semibold outline-none focus:border-[#5064FF] focus:ring-2 focus:ring-[#5064FF]/20 transition-all duration-200"
                          placeholder="0"
                        />
                      </div>

                      {/* Quick Buttons for WITHDRAW */}
                      <div className="flex gap-2 mb-6">
                        {[500, 1000, 5000, 10000].map((value) => (
                          <motion.button
                            key={value}
                            onClick={() => setWithdrawAmount(value)}
                            disabled={value > balance}
                            className={`px-3 py-1.5 border rounded-lg text-sm font-medium transition-all duration-200 ${
                              value <= balance
                                ? "border-[#5064FF]/20 bg-gradient-to-r from-[#5064FF]/5 to-[#48E1C4]/5 hover:from-[#5064FF]/10 hover:to-[#48E1C4]/10 hover:border-[#5064FF]/40 hover:text-[#5064FF]"
                                : "border-gray-200 bg-gray-100 text-gray-400 cursor-not-allowed"
                            }`}
                            whileHover={{ scale: value <= balance ? 1.05 : 1, y: value <= balance ? -2 : 0 }}
                            whileTap={{ scale: 0.95 }}
                          >
                            ₹{value.toLocaleString()}
                          </motion.button>
                        ))}
                      </div>
                    </div>

                    {withdrawAmount && withdrawAmount > balance && (
                      <motion.div 
                        className="mb-4"
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                      >
                        <p className="text-sm text-red-600 bg-gradient-to-r from-red-50 to-red-100 px-3 py-2 rounded-lg border border-red-200">
                          Insufficient balance! Available: {formatCurrency(balance)}
                        </p>
                      </motion.div>
                    )}

                    {withdrawAmount && withdrawAmount < minAmount && (
                      <motion.div 
                        className="mb-4"
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                      >
                        <p className="text-sm text-red-600 bg-gradient-to-r from-red-50 to-red-100 px-3 py-2 rounded-lg border border-red-200">
                          Minimum withdrawal is ₹{minAmount}
                        </p>
                      </motion.div>
                    )}

                    <motion.p 
                      className="text-sm text-[#5064FF] mb-6 bg-gradient-to-r from-[#5064FF]/5 to-[#48E1C4]/5 px-3 py-2 rounded-lg border border-[#5064FF]/20"
                      whileHover={{ scale: 1.01 }}
                    >
                      💡 Withdrawals might take 1-2 business days
                    </motion.p>

                    {/* Bank Info */}
                    <div className="mb-6">
                      <p className="text-sm font-medium text-gray-700 mb-3">Withdraw to Bank</p>
                      <motion.div 
                        className="border border-[#5064FF]/20 rounded-xl p-4 bg-gradient-to-r from-[#5064FF]/5 to-[#48E1C4]/5"
                        whileHover={{ scale: 1.01 }}
                      >
                        <div className="flex items-center gap-3 mb-3">
                          <motion.div 
                            className="w-10 h-10 rounded-lg bg-gradient-to-br from-green-100 to-emerald-100 flex items-center justify-center"
                            whileHover={{ rotate: 5, scale: 1.1 }}
                          >
                            <span className="text-green-700">🏦</span>
                          </motion.div>
                          <div>
                            <p className="font-semibold text-gray-900">{bankDetails.name}</p>
                            <p className="text-sm text-[#5064FF]">Account: {bankDetails.account}</p>
                          </div>
                        </div>
                        <p className="text-xs text-gray-500">
                          Default withdrawal account. Funds will be transferred within 24-48 hours.
                        </p>
                      </motion.div>
                    </div>

                    {/* Submit WITHDRAW */}
                    <motion.button
                      onClick={handleWithdraw}
                      disabled={!withdrawAmount || withdrawAmount < minAmount || withdrawAmount > balance}
                      className={`w-full py-3 text-white rounded-xl font-semibold text-sm transition-all duration-200 relative overflow-hidden group/withdraw ${
                        withdrawAmount && withdrawAmount >= minAmount && withdrawAmount <= balance
                          ? "bg-gradient-to-r from-[#5064FF] to-[#48E1C4] hover:from-[#5064FF] hover:to-[#48E1C4] hover:shadow-lg"
                          : "bg-gray-300 cursor-not-allowed"
                      }`}
                      whileHover={{ scale: withdrawAmount && withdrawAmount >= minAmount && withdrawAmount <= balance ? 1.02 : 1 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <span className="relative z-10">Withdraw Funds</span>
                      <motion.div 
                        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover/withdraw:translate-x-full transition-transform duration-700"
                      />
                    </motion.button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </div>

        {/* Additional Info Section */}
        <motion.div 
          className="mt-8 w-full max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          {[
            { icon: "⚡", title: "Instant Transfer", desc: "Add money instantly with UPI", color: "from-green-100 to-emerald-100" },
            { icon: "🛡️", title: "Secure & Safe", desc: "Bank-level security for all transactions", color: "from-blue-100 to-cyan-100" },
            { icon: "🎯", title: "Zero Fees", desc: "No hidden charges on deposits or withdrawals", color: "from-purple-100 to-pink-100" },
          ].map((item, index) => (
            <motion.div 
              key={index}
              className="gradient-hover bg-white/80 backdrop-blur-sm p-4 rounded-xl border border-gray-100/50 shadow-sm hover:shadow-md transition-all duration-300 hover:border-[#5064FF]/30"
              whileHover={{ scale: 1.03, y: -5 }}
            >
              <div className="flex items-center gap-3 mb-2">
                <motion.div 
                  className={`w-8 h-8 rounded-lg bg-gradient-to-br ${item.color} flex items-center justify-center`}
                  whileHover={{ rotate: [0, 10, -10, 0] }}
                  transition={{ duration: 0.5 }}
                >
                  <span className="text-lg">{item.icon}</span>
                </motion.div>
                <p className="font-semibold text-gray-900">{item.title}</p>
              </div>
              <p className="text-sm text-gray-600">{item.desc}</p>
            </motion.div>
          ))}
        </motion.div>
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
        
        /* Ensure text remains visible over gradient */
        .gradient-hover > *:not(:before) {
          position: relative;
          z-index: 1;
        }
      `}</style>
    </>
  );
}