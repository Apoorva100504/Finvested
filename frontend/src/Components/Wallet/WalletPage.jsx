import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function WalletPage() {
  // Separate states for add and withdraw
  const [addAmount, setAddAmount] = useState("");
  const [withdrawAmount, setWithdrawAmount] = useState("");
  const [activeTab, setActiveTab] = useState("add");
  const [showCashModal, setShowCashModal] = useState(false);
  const [modalPosition, setModalPosition] = useState({ x: 0, y: 0 });
  const [transactions, setTransactions] = useState([]);
  const navigate = useNavigate();

  // Mock data
  const balance = 12500.50;
  const minAmount = 100;
  const bankDetails = {
    name: "HDFC Bank",
    account: "•••6016",
    upiId: "user@hdfcbank"
  };

  // Mock transaction data
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
    // Load mock transactions
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

  // Format currency like HoldingsUI
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

  return (
    <>
      {/* Modal Backdrop */}
      {showCashModal && (
        <div 
          id="modal-backdrop"
          className="fixed inset-0 z-40 bg-transparent"
          onClick={handleBackgroundClick}
        >
          <div 
            className="fixed bg-white text-gray-800 text-sm px-4 py-3 rounded-xl shadow-lg z-50 min-w-[200px] animate-fadeIn border border-gray-200"
            style={{
              left: `${modalPosition.x - 100}px`,
              top: `${modalPosition.y - 70}px`,
            }}
          >
            <div className="relative">
              {/* Arrow pointing down */}
              <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2">
                <div className="w-0 h-0 border-l-[6px] border-r-[6px] border-t-[8px] border-l-transparent border-r-transparent border-t-green-200"></div>
              </div>
              
              <div className="mb-2">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-gray-600">Available cash</span>
                  <span className="font-semibold">{formatCurrency(balance)}</span>
                </div>
                
                <div className="flex justify-between items-center mb-2">
                  <span className="text-gray-600">Today's opening</span>
                  <span className="font-medium">₹0.00</span>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Today's activity</span>
                  <span className="font-medium text-green-600">₹0.00</span>
                </div>
              </div>
              
              <div className="text-xs text-gray-500 pt-2 border-t border-gray-100">
                Your available cash for trading
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="min-h-[60vh] bg-gradient-to-br from-gray-50 to-gray-100 px-4 md:px-32 py-8 text-gray-900 font-sans">
        {/* Header */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                Wallet
              </h1>
              <p className="text-gray-600 mt-1">Manage your funds and transactions</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-500">Available Balance</p>
              <p className="text-2xl font-bold tracking-tight text-green-600">
                {formatCurrency(balance)}
              </p>
            </div>
          </div>
          <div className="h-1.5 w-24 bg-gradient-to-r from-green-400 via-blue-400 to-purple-500 rounded-full"></div>
        </div>

        <div className="w-full max-w-6xl grid grid-cols-1 md:grid-cols-2 gap-8 mx-auto">
          
          {/* Left Card - Balance Overview */}
          <div className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 group relative overflow-hidden border border-green-100">
            {/* Green background gradient */}
            <div className="absolute inset-0 bg-gradient-to-br from-green-50 to-emerald-50 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            
            <div className="relative z-10">
              <h2 className="text-sm text-center text-gray-500 mb-1">Stocks, F&O balance</h2>
              <p className="text-3xl text-center font-bold mb-8 text-gray-900">
                {formatCurrency(balance)}
              </p>

              {/* Cash Row */}
              <div 
                className="flex justify-between items-center py-4 border-b border-green-100 hover:bg-gradient-to-r hover:from-green-50 hover:to-emerald-50 px-3 -mx-3 rounded-xl transition-all duration-200 cursor-pointer group/cash relative"
                onClick={handleCashClick}
              >
                <div className="flex items-center">
                  <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-green-100 to-emerald-100 flex items-center justify-center mr-3 shadow-sm">
                    <span className="text-xl text-green-700">💵</span>
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">Cash</p>
                    <p className="text-xs text-green-600 opacity-0 group-hover/cash:opacity-100 transition-opacity duration-200">
                      Click to view details
                    </p>
                  </div>
                </div>
                <p className="font-bold text-green-700 text-lg">
                  {formatCurrency(balance)}
                </p>
              </div>

              {/* Pledge Row */}
              <div className="flex justify-between items-center py-4 px-3 -mx-3 rounded-xl hover:bg-gradient-to-r hover:from-blue-50 hover:to-cyan-50 transition-all duration-200">
                <div className="flex items-center">
                  <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-100 to-cyan-100 flex items-center justify-center mr-3 shadow-sm">
                    <span className="text-xl text-blue-700">🏦</span>
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900 mb-1">Pledge</p>
                    <p className="text-xs text-gray-500 max-w-xs">
                      Add balance by pledging holdings
                    </p>
                  </div>
                </div>
                <button className="text-green-700 font-semibold hover:text-green-800 hover:scale-105 transition-all duration-200 active:scale-95 px-4 py-2 bg-gradient-to-r from-green-100 to-emerald-100 hover:from-green-200 hover:to-emerald-200 rounded-lg shadow-sm">
                  Add
                </button>
              </div>

              {/* Recent Transactions */}
              <div className="mt-8">
                <h3 className="font-semibold text-gray-900 mb-3">Recent Transactions</h3>
                <div className="space-y-3 max-h-64 overflow-y-auto pr-2">
                  {transactions.slice(0, 3).map((transaction) => (
                    <div key={transaction.id} className="flex justify-between items-center p-3 border border-gray-100 rounded-lg hover:bg-gray-50 transition-all duration-200">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className={`text-xs px-2 py-1 rounded-full ${transaction.type === 'deposit' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                            {transaction.type === 'deposit' ? 'Deposit' : 'Withdrawal'}
                          </span>
                          <span className={`text-xs px-2 py-1 rounded-full ${transaction.status === 'completed' ? 'bg-green-100 text-green-700' : transaction.status === 'processing' ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700'}`}>
                            {transaction.status}
                          </span>
                        </div>
                        <p className="text-xs text-gray-500 mt-1">
                          {transaction.date} • {transaction.method}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className={`font-semibold ${transaction.type === 'deposit' ? 'text-green-600' : 'text-red-600'}`}>
                          {transaction.type === 'deposit' ? '+' : '-'}{formatCurrency(transaction.amount)}
                        </p>
                        <p className="text-xs text-gray-500">{transaction.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* View All Transactions Button */}
              <button 
                onClick={() => navigate("/transaction")}
                className="mt-6 w-full py-3 text-green-700 font-semibold hover:text-green-800 hover:bg-gradient-to-r hover:from-green-50 hover:to-emerald-50 rounded-xl transition-all duration-300 flex items-center justify-center gap-2 group/trans border-2 border-green-200 hover:border-green-300"
              >
                View All Transactions
                <svg className="w-4 h-4 group-hover/trans:translate-x-1 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </button>
            </div>
          </div>

          {/* Right Card - Add/Withdraw */}
          <div className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 group relative overflow-hidden border border-green-100">
            {/* Green background gradient */}
            <div className="absolute inset-0 bg-gradient-to-br from-green-50 to-emerald-50 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            
            <div className="relative z-10">
              {/* Tabs */}
              <div className="flex gap-8 border-b border-green-100 pb-4 mb-6 font-medium">
                <button
                  onClick={() => setActiveTab("add")}
                  className={`pb-2 relative transition-all duration-200 ${
                    activeTab === "add"
                      ? "text-green-700 font-semibold"
                      : "text-gray-500 hover:text-gray-700"
                  }`}
                >
                  Add money
                  {activeTab === "add" && (
                    <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full"></div>
                  )}
                </button>

                <button
                  onClick={() => setActiveTab("withdraw")}
                  className={`pb-2 relative transition-all duration-200 ${
                    activeTab === "withdraw"
                      ? "text-green-700 font-semibold"
                      : "text-gray-500 hover:text-gray-700"
                  }`}
                >
                  Withdraw
                  {activeTab === "withdraw" && (
                    <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full"></div>
                  )}
                </button>
              </div>

              {/* =============================== */}
              {/* ADD MONEY SECTION - SEPARATE INPUT */}
              {/* =============================== */}

              {activeTab === "add" && (
                <div className="animate-fadeIn">
                  {/* Amount Input */}
                  <div className="mb-6">
                    <p className="text-sm font-medium text-gray-700 mb-3">Enter Amount to Add</p>
                    <div className="flex items-center mb-4">
                      <span className="px-4 py-3 bg-green-50 rounded-l-xl border border-r-0 border-green-300 font-medium text-green-700">₹</span>
                      <input
                        type="number"
                        value={addAmount}
                        onChange={(e) => setAddAmount(e.target.value)}
                        className="w-40 border border-green-300 rounded-r-xl px-4 py-3 font-semibold outline-none focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-all duration-200"
                        placeholder="0"
                        min={minAmount}
                      />
                    </div>

                    {/* Quick Buttons for ADD */}
                    <div className="flex gap-2 mb-6">
                      {[100, 500, 1000, 5000].map((value) => (
                        <button
                          key={value}
                          onClick={() => setAddAmount(value)}
                          className="px-3 py-1.5 border border-green-200 rounded-lg text-sm font-medium bg-green-50 hover:bg-green-100 hover:border-green-400 hover:text-green-800 transition-all duration-200"
                        >
                          ₹{value.toLocaleString()}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Minimum amount validation */}
                  {addAmount && addAmount < minAmount && (
                    <div className="mb-4 animate-shake">
                      <p className="text-sm text-red-600 bg-red-50 px-3 py-2 rounded-lg border border-red-200">
                        Minimum amount is ₹{minAmount}
                      </p>
                    </div>
                  )}

                  {/* Bank Details */}
                  <div className="mb-6">
                    <p className="text-sm font-medium text-gray-700 mb-3">Payment Methods</p>
                    <div className="space-y-3">
                      <button className="w-full flex justify-between items-center border border-green-200 rounded-xl px-4 py-3 text-sm hover:border-green-400 hover:bg-green-50 transition-all duration-200 group/payment">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-green-100 to-emerald-100 flex items-center justify-center">
                            <span className="text-green-700">📍</span>
                          </div>
                          <div>
                            <p className="font-semibold text-gray-900">UPI Payment</p>
                            <p className="text-xs text-green-600">Instant transfer</p>
                          </div>
                        </div>
                        <p className="text-green-700 font-medium">
                          {bankDetails.upiId}
                        </p>
                      </button>

                      <button className="w-full flex justify-between items-center border border-green-200 rounded-xl px-4 py-3 text-sm hover:border-green-400 hover:bg-green-50 transition-all duration-200 group/payment">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-100 to-cyan-100 flex items-center justify-center">
                            <span className="text-blue-700">🏦</span>
                          </div>
                          <div>
                            <p className="font-semibold text-gray-900">Bank Transfer</p>
                            <p className="text-xs text-blue-600">1-2 hours processing</p>
                          </div>
                        </div>
                        <p className="text-green-700 font-medium">
                          {bankDetails.account}
                        </p>
                      </button>
                    </div>
                  </div>

                  {/* Submit ADD */}
                  <button
                    onClick={handleAddMoney}
                    disabled={!addAmount || addAmount < minAmount}
                    className={`w-full py-3 text-white rounded-xl font-semibold text-sm transition-all duration-200 relative overflow-hidden group/submit ${
                      addAmount && addAmount >= minAmount
                        ? "bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 hover:shadow-lg hover:scale-[1.02] active:scale-[0.98]" 
                        : "bg-gray-300 cursor-not-allowed"
                    }`}
                  >
                    <span className="relative z-10">Add money</span>
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover/submit:translate-x-full transition-transform duration-700"></div>
                  </button>
                </div>
              )}

              {/* =============================== */}
              {/* WITHDRAW SECTION - SEPARATE INPUT */}
              {/* =============================== */}

              {activeTab === "withdraw" && (
                <div className="animate-fadeIn">
                  <div className="mb-6">
                    <p className="text-sm font-medium text-gray-700 mb-3">Enter Amount to Withdraw</p>
                    <div className="flex items-center mb-4">
                      <span className="px-4 py-3 bg-green-50 rounded-l-xl border border-r-0 border-green-300 font-medium text-green-700">₹</span>
                      <input
                        type="number"
                        value={withdrawAmount}
                        onChange={(e) => setWithdrawAmount(e.target.value)}
                        className="w-40 border border-green-300 rounded-r-xl px-4 py-3 font-semibold outline-none focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-all duration-200"
                        placeholder="0"
                      />
                    </div>

                    {/* Quick Buttons for WITHDRAW */}
                    <div className="flex gap-2 mb-6">
                      {[500, 1000, 5000, 10000].map((value) => (
                        <button
                          key={value}
                          onClick={() => setWithdrawAmount(value)}
                          disabled={value > balance}
                          className={`px-3 py-1.5 border rounded-lg text-sm font-medium transition-all duration-200 ${
                            value <= balance
                              ? "border-green-200 bg-green-50 hover:bg-green-100 hover:border-green-400 hover:text-green-800"
                              : "border-gray-200 bg-gray-100 text-gray-400 cursor-not-allowed"
                          }`}
                        >
                          ₹{value.toLocaleString()}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Balance Warning */}
                  {withdrawAmount && withdrawAmount > balance && (
                    <div className="mb-4 animate-shake">
                      <p className="text-sm text-red-600 bg-red-50 px-3 py-2 rounded-lg border border-red-200">
                        Insufficient balance! Available: {formatCurrency(balance)}
                      </p>
                    </div>
                  )}

                  {/* Minimum amount validation */}
                  {withdrawAmount && withdrawAmount < minAmount && (
                    <div className="mb-4 animate-shake">
                      <p className="text-sm text-red-600 bg-red-50 px-3 py-2 rounded-lg border border-red-200">
                        Minimum withdrawal is ₹{minAmount}
                      </p>
                    </div>
                  )}

                  {/* Note */}
                  <p className="text-sm text-green-600 mb-6 bg-green-50 px-3 py-2 rounded-lg border border-green-200">
                    💡 Withdrawals might take 1-2 business days
                  </p>

                  {/* Bank Info */}
                  <div className="mb-6">
                    <p className="text-sm font-medium text-gray-700 mb-3">Withdraw to Bank</p>
                    <div className="border border-green-200 rounded-xl p-4 bg-green-50/30">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-green-100 to-emerald-100 flex items-center justify-center">
                          <span className="text-green-700">🏦</span>
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900">{bankDetails.name}</p>
                          <p className="text-sm text-green-600">Account: {bankDetails.account}</p>
                        </div>
                      </div>
                      <p className="text-xs text-gray-500">
                        Default withdrawal account. Funds will be transferred within 24-48 hours.
                      </p>
                    </div>
                  </div>

                  {/* Submit WITHDRAW */}
                  <button
                    onClick={handleWithdraw}
                    disabled={!withdrawAmount || withdrawAmount < minAmount || withdrawAmount > balance}
                    className={`w-full py-3 text-white rounded-xl font-semibold text-sm transition-all duration-200 relative overflow-hidden group/withdraw ${
                      withdrawAmount && withdrawAmount >= minAmount && withdrawAmount <= balance
                        ? "bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 hover:shadow-lg hover:scale-[1.02] active:scale-[0.98]"
                        : "bg-gray-300 cursor-not-allowed"
                    }`}
                  >
                    <span className="relative z-10">Withdraw Funds</span>
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover/withdraw:translate-x-full transition-transform duration-700"></div>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Additional Info Section */}
        <div className="mt-8 w-full max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-4 rounded-xl border border-green-100 shadow-sm hover:shadow-md transition-all duration-300 hover:border-green-300">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-green-100 to-emerald-100 flex items-center justify-center">
                <span className="text-green-700">⚡</span>
              </div>
              <p className="font-semibold text-gray-900">Instant Transfer</p>
            </div>
            <p className="text-sm text-green-900">Add money instantly with UPI</p>
          </div>
          
          <div className="bg-white p-4 rounded-xl border border-green-100 shadow-sm hover:shadow-md transition-all duration-300 hover:border-green-300">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-100 to-cyan-100 flex items-center justify-center">
                <span className="text-blue-700">🛡️</span>
              </div>
              <p className="font-semibold text-gray-900">Secure & Safe</p>
            </div>
            <p className="text-sm text-green-900">Bank-level security for all transactions</p>
          </div>
          
          <div className="bg-white p-4 rounded-xl border border-green-100 shadow-sm hover:shadow-md transition-all duration-300 hover:border-green-300">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-100 to-pink-100 flex items-center justify-center">
                <span className="text-purple-700">🎯</span>
              </div>
              <p className="font-semibold text-gray-900">Zero Fees</p>
            </div>
            <p className="text-sm text-green-900">No hidden charges on deposits or withdrawals</p>
          </div>
        </div>
      </div>
    </>
  );
}