import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function GrowwBuySellUI({ stockPrice = 151.64 }) {
  const [mode, setMode] = useState("buy");
  const [priceType, setPriceType] = useState("limit"); // limit | market
  const [quantity, setQuantity] = useState(1);
  const [limitPrice, setLimitPrice] = useState(0);
  const [userBalance, setUserBalance] = useState(0);
  const [loading, setLoading] = useState(true);
  
  const navigate = useNavigate();
  const isBuy = mode === "buy";

  // Fetch user balance from backend/API
  useEffect(() => {
    const fetchUserBalance = async () => {
      try {
        setLoading(true);
        // Simulate API call to get user balance
        // In real app: const response = await fetch('/api/user/balance');
        const mockBalance = 50000; // ₹50,000 mock balance
        setUserBalance(mockBalance);
      } catch (error) {
        console.error("Error fetching balance:", error);
        setUserBalance(0);
      } finally {
        setLoading(false);
      }
    };

    fetchUserBalance();
  }, []);

  // Calculate required amount
  const calculateRequiredAmount = () => {
    const price = priceType === "market" ? stockPrice : parseFloat(limitPrice) || stockPrice;
    return quantity * price;
  };

  const requiredAmount = calculateRequiredAmount();
  const isBalanceSufficient = userBalance >= requiredAmount;

  // Handle buy/sell action
  const handleAction = async () => {
    if (!isBalanceSufficient && isBuy) {
      // Redirect to wallet for adding money
      navigate("/wallet");
      return;
    }

    const action = isBuy ? "buy" : "sell";
    const price = priceType === "market" ? stockPrice : parseFloat(limitPrice);
    const orderType = priceType === "market" ? "MARKET" : "LIMIT";

    try {
      // Prepare order data
      const orderData = {
        action,
        symbol: "STOCK_SYMBOL", // Should be passed as prop
        quantity,
        price,
        orderType,
        timestamp: new Date().toISOString()
      };

      console.log("Placing order:", orderData);

      // In real app: await fetch('/api/orders/place', { method: 'POST', body: JSON.stringify(orderData) });
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Show success message
      alert(`${action.toUpperCase()} order placed successfully!\n${quantity} shares at ₹${price.toFixed(2)}`);
      
      // Reset form
      setQuantity(1);
      setLimitPrice(stockPrice.toFixed(2));
      
    } catch (error) {
      console.error("Error placing order:", error);
      alert(`Failed to place ${action} order. Please try again.`);
    }
  };

  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(amount);
  };

  // Quick quantity buttons
  const quickQuantities = [1, 10, 50, 100];

  return (
    <div className="max-w-sm mx-auto border rounded-xl shadow-lg bg-white text-gray-800 overflow-hidden transition-all duration-300 hover:shadow-xl">
      {/* Header with subtle gradient */}
      <div className="px-4 pt-4 pb-2 border-b border-gray-100">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-base font-bold leading-tight text-gray-900 mt-5">Groww</h1>
            <p className="text-xs text-gray-500 mt-1 flex items-center gap-1 mt-3">
              <span className="font-medium">NSE ₹{stockPrice.toFixed(2)}</span>
              <span className="text-green-600 font-medium">· BSE ₹{(stockPrice * 1.002).toFixed(2)} (+0.53%)</span>
              
            </p>
          </div>
          
        </div>
      </div>

      {/* Tabs with smooth transition */}
      <div className="flex text-sm font-medium border-b mt-2 relative">
        <button
          onClick={() => setMode("buy")}
          className={`flex-1 py-3 text-center transition-all duration-300 relative ${
            isBuy 
              ? "text-green-600 font-semibold" 
              : "text-gray-500 hover:text-gray-700"
          }`}
        >
          BUY
          {isBuy && (
            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-green-600 animate-expand"></div>
          )}
        </button>
        <button
          onClick={() => setMode("sell")}
          className={`flex-1 py-3 text-center transition-all duration-300 relative ${
            !isBuy 
              ? "text-red-600 font-semibold" 
              : "text-gray-500 hover:text-gray-700"
          }`}
        >
          SELL
          {!isBuy && (
            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-red-600 animate-expand"></div>
          )}
        </button>
      </div>

     

      {/* Qty Row with enhanced input */}
      <div className="px-4 py-2 text-sm flex justify-between items-center gap-4 border-b border-gray-100">
        <label className="text-gray-600 font-medium">Quantity (Shares)</label>
        <div className="relative">
          <input
            type="number"
            value={quantity}
            onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
            min="1"
            className="w-28 border rounded-lg px-3 py-2 text-sm focus:outline-none text-right font-medium focus:ring-2 focus:border-transparent transition-all duration-200"
            style={isBuy ? { borderColor: '#059669' } : { borderColor: '#dc2626' }}
          />
          
        </div>
      </div>

      
      {/* Price Row */}
<div className="px-4 py-2 text-sm border-b pb-4 flex justify-between items-center gap-4">
  <div>
    <label 
      className="text-gray-600 cursor-pointer hover:text-gray-800 transition-colors"
      onClick={() => setPriceType(priceType === "limit" ? "market" : "limit")}
    >
      {priceType === "limit" ? "Price Limit" : "Price Market"}
    </label>
    <div className="flex items-center gap-2 mt-0.5">
      <span className="text-xs text-gray-500">
        {priceType === "limit" ? "Order executes at this price" : "Executes at current market price"}
      </span>
      
    </div>
  </div>

  {priceType === "limit" ? (
    <input
      type="number"
      value={limitPrice}
      onChange={(e) => setLimitPrice(e.target.value)}
      placeholder="Enter price"
      className="w-28 border rounded-lg px-3 py-2 text-sm focus:outline-none text-right"
    />
  ) : (
    <input
      type="text"
      value="At Market"
      disabled
      className="w-28 border rounded-lg px-3 py-2 text-sm bg-gray-100 text-right text-gray-500"
    />
  )}
</div>
     

      {/* Balance Info with loading state */}
      <div className="flex justify-between px-4 py-3 text-xs border-t border-gray-100 pt-8">
        <div>
          <p className="text-gray-600 mb-1">Available Balance</p>
          {loading ? (
            <div className="h-4 w-20 bg-gray-200 rounded animate-pulse"></div>
          ) : (
            <p className={`font-semibold ${isBalanceSufficient ? 'text-green-600' : 'text-red-600'}`}>
              {formatCurrency(userBalance)}
            </p>
          )}
        </div>
        <div className="text-right">
          <p className="text-gray-600 mb-1"> Required Amount</p>
          <p className="font-semibold text-gray-900">{formatCurrency(requiredAmount)}</p>
        </div>
      </div>

      {/* Action Button with conditional state */}
      <div className="px-4 pb-4">
        {!isBalanceSufficient && isBuy ? (
          <button
            onClick={() => navigate("/wallet")}
            className="w-full py-3 rounded-lg bg-gradient-to-r from-yellow-500 to-yellow-600 text-white font-semibold text-sm shadow-md hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200 active:translate-y-0 flex items-center justify-center gap-2"
          >
            <span>Add Money</span>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
            </svg>
          </button>
        ) : (
          <button
  onClick={handleAction}
  disabled={loading || (priceType === "limit" && !limitPrice)}
  className={`relative w-full py-3 rounded-lg text-white font-semibold text-sm shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-300 active:translate-y-0 disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-2 overflow-hidden group ${
    isBuy 
      ? "bg-gradient-to-r from-green-500 via-emerald-500 to-green-600 hover:from-green-600 hover:via-emerald-600 hover:to-green-700" 
      : "bg-gradient-to-r from-red-500 via-rose-500 to-red-600 hover:from-red-600 hover:via-rose-600 hover:to-red-700"
  }`}
>
  {/* Buy Button Effects (Green) */}
  {isBuy && (
    <>
      {/* Lit effect overlay for buy */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-t from-green-300/20 via-transparent to-emerald-500/10"></div>
      {/* Top highlight for buy */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-green-300 to-emerald-300"></div>
      {/* Subtle light spots for buy */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
        <div className="absolute top-1/4 left-1/4 w-12 h-12 rounded-full bg-green-300/10 blur-xl"></div>
        <div className="absolute bottom-1/4 right-1/4 w-10 h-10 rounded-full bg-emerald-400/10 blur-xl"></div>
      </div>
    </>
  )}
  
  {/* Sell Button Effects (Red) */}
  {!isBuy && (
    <>
      {/* Glow effect overlay for sell */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-t from-red-300/20 via-transparent to-rose-500/10"></div>
      {/* Top highlight for sell */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-red-300 to-rose-300"></div>
      {/* Subtle glow spots for sell */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
        <div className="absolute top-1/4 left-1/4 w-12 h-12 rounded-full bg-red-300/10 blur-xl"></div>
        <div className="absolute bottom-1/4 right-1/4 w-10 h-10 rounded-full bg-rose-400/10 blur-xl"></div>
      </div>
    </>
  )}
  
  {/* Shimmer effect on hover (works for both) */}
  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
  
  <span className="relative flex items-center gap-2">
    {isBuy ? "Buy Now" : "Sell Now"}
    <svg className="w-4 h-4 group-hover:scale-110 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      {isBuy ? (
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
      ) : (
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
      )}
    </svg>
  </span>
</button>
        )}
        
        {/* Disclaimer */}
        <p className="text-xs text-gray-500 text-center mt-3">
          {priceType === "limit" 
            ? "Limit orders may not execute if price isn't reached" 
            : "Market orders execute immediately at best available price"}
        </p>
      </div>

      {/* Add CSS for animations */}
      <style jsx>{`
        @keyframes expand {
          from { width: 0; }
          to { width: 100%; }
        }
        .animate-expand {
          animation: expand 0.3s ease-out;
        }
      `}</style>
    </div>
  );
}