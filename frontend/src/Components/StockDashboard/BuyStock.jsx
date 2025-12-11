import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function GrowwBuySellUI({ stockPrice = 151.64 }) {
  const [mode, setMode] = useState("buy");
  const [priceType, setPriceType] = useState("limit");
  const [quantity, setQuantity] = useState(1);
  const [limitPrice, setLimitPrice] = useState(0);
  const [userBalance, setUserBalance] = useState(0);
  const [loading, setLoading] = useState(true);
  
  const navigate = useNavigate();
  const isBuy = mode === "buy";

  // Fetch user balance
  useEffect(() => {
    const fetchUserBalance = async () => {
      try {
        setLoading(true);
        const mockBalance = 50000;
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
      navigate("/wallet");
      return;
    }

    try {
      const action = isBuy ? "buy" : "sell";
      const price = priceType === "market" ? stockPrice : parseFloat(limitPrice);
      const orderType = priceType === "market" ? "MARKET" : "LIMIT";

      const orderData = {
        action,
        symbol: "STOCK_SYMBOL",
        quantity,
        price,
        orderType,
        timestamp: new Date().toISOString()
      };

      console.log("Placing order:", orderData);
      await new Promise(resolve => setTimeout(resolve, 500));
      
      alert(`${action.toUpperCase()} order placed successfully!\n${quantity} shares at ₹${price.toFixed(2)}`);
      
      setQuantity(1);
      setLimitPrice(stockPrice.toFixed(2));
      
    } catch (error) {
      console.error("Error placing order:", error);
      alert(`Failed to place ${isBuy ? 'buy' : 'sell'} order. Please try again.`);
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

  return (
    <div className="max-w-sm mx-auto border rounded-xl shadow-lg bg-white text-gray-800 overflow-hidden transition-all duration-300 hover:shadow-xl group">
      {/* Header */}
      <div className="px-4 pt-4 pb-2 border-b border-gray-100">
        <div className="flex justify-between items-center">
          <div>
            
            <p className="text-xs text-gray-500 mt-1 flex items-center gap-1 mt-3 transition-colors duration-300 group-hover:text-gray-600">
              <span className="font-medium">NSE ₹{stockPrice.toFixed(2)}</span>
              <span className="text-green-600 font-medium transition-colors duration-300 group-hover:text-green-700">
                · BSE ₹{(stockPrice * 1.002).toFixed(2)} (+0.53%)
              </span>
            </p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex text-sm font-medium border-b mt-2 relative">
        <button
          onClick={() => setMode("buy")}
          className={`flex-1 py-3 text-center transition-all duration-300 relative group/tab ${
            isBuy 
              ? "text-green-600 font-semibold" 
              : "text-gray-500 hover:text-gray-700"
          }`}
        >
          BUY
          <div className={`absolute bottom-0 left-1/2 transform -translate-x-1/2 h-0.5 bg-green-600 transition-all duration-300 ${
            isBuy ? "w-full" : "w-0 group-hover/tab:w-full"
          }`}></div>
          {isBuy && (
            <div className="absolute inset-0 bg-green-50 opacity-0 group-hover/tab:opacity-100 transition-opacity duration-300"></div>
          )}
        </button>
        <button
          onClick={() => setMode("sell")}
          className={`flex-1 py-3 text-center transition-all duration-300 relative group/tab ${
            !isBuy 
              ? "text-red-600 font-semibold" 
              : "text-gray-500 hover:text-gray-700"
          }`}
        >
          SELL
          <div className={`absolute bottom-0 left-1/2 transform -translate-x-1/2 h-0.5 bg-red-600 transition-all duration-300 ${
            !isBuy ? "w-full" : "w-0 group-hover/tab:w-full"
          }`}></div>
          {!isBuy && (
            <div className="absolute inset-0 bg-red-50 opacity-0 group-hover/tab:opacity-100 transition-opacity duration-300"></div>
          )}
        </button>
      </div>

      {/* Quantity Row */}
      <div className="px-4 py-3 text-sm flex justify-between items-center gap-4 border-b border-gray-100 group/input">
        <label className="text-gray-600 font-medium transition-colors duration-300 group-hover/input:text-gray-800">
          Quantity (Shares)
        </label>
        <div className="relative">
          <input
            type="number"
            value={quantity}
            onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
            min="1"
            className={`w-28 border rounded-lg px-3 py-2 text-sm focus:outline-none text-right font-medium transition-all duration-300 
                      focus:ring-2 focus:border-transparent hover:shadow-sm ${
                        isBuy 
                          ? 'border-green-300 hover:border-green-400 focus:ring-green-200' 
                          : 'border-red-300 hover:border-red-400 focus:ring-red-200'
                      }`}
          />
          <div className={`absolute inset-0 rounded-lg opacity-0 group-hover/input:opacity-100 transition-opacity duration-300 ${
            isBuy ? 'bg-green-50' : 'bg-red-50'
          } -z-10`}></div>
        </div>
      </div>

      {/* Price Row */}
      <div className="px-4 py-3 text-sm border-b border-gray-100 flex justify-between items-center gap-4 group/price">
        <div>
          <label 
            className="text-gray-600 cursor-pointer transition-colors duration-300 hover:text-gray-800"
            onClick={() => setPriceType(priceType === "limit" ? "market" : "limit")}
          >
            {priceType === "limit" ? "Price Limit" : "Price Market"}
          </label>
          <div className="flex items-center gap-2 mt-0.5">
            <span className="text-xs text-gray-500 transition-colors duration-300 group-hover/price:text-gray-600">
              {priceType === "limit" ? "Order executes at this price" : "Executes at current market price"}
            </span>
          </div>
        </div>

        {priceType === "limit" ? (
          <div className="relative">
            <input
              type="number"
              value={limitPrice}
              onChange={(e) => setLimitPrice(e.target.value)}
              placeholder="Enter price"
              className={`w-28 border rounded-lg px-3 py-2 text-sm focus:outline-none text-right transition-all duration-300 
                        hover:shadow-sm focus:ring-2 focus:border-transparent ${
                          isBuy 
                            ? 'border-green-300 hover:border-green-400 focus:ring-green-200' 
                            : 'border-red-300 hover:border-red-400 focus:ring-red-200'
                        }`}
            />
            <div className={`absolute inset-0 rounded-lg opacity-0 group-hover/price:opacity-100 transition-opacity duration-300 ${
              isBuy ? 'bg-green-50' : 'bg-red-50'
            } -z-10`}></div>
          </div>
        ) : (
          <div className="relative">
            <input
              type="text"
              value="At Market"
              disabled
              className="w-28 border rounded-lg px-3 py-2 text-sm bg-gray-50 text-right text-gray-500 transition-colors duration-300 group-hover/price:bg-gray-100"
            />
            <div className="absolute inset-0 rounded-lg opacity-0 group-hover/price:opacity-100 bg-gray-100 -z-10 transition-opacity duration-300"></div>
          </div>
        )}
      </div>

      {/* Balance Info */}
      <div className="flex justify-between px-4 py-4 text-xs border-t border-gray-100 pt-8 group/balance">
        <div className="transition-all duration-300 group-hover/balance:scale-105">
          <p className="text-gray-600 mb-1 transition-colors duration-300 group-hover/balance:text-gray-700">
            Available Balance
          </p>
          {loading ? (
            <div className="h-4 w-20 bg-gray-200 rounded animate-pulse"></div>
          ) : (
            <p className={`font-semibold transition-colors duration-300 ${
              isBalanceSufficient ? 'text-green-600 group-hover/balance:text-green-700' : 'text-red-600 group-hover/balance:text-red-700'
            }`}>
              {formatCurrency(userBalance)}
            </p>
          )}
        </div>
        <div className="text-right transition-all duration-300 group-hover/balance:scale-105">
          <p className="text-gray-600 mb-1 transition-colors duration-300 group-hover/balance:text-gray-700">
            Required Amount
          </p>
          <p className="font-semibold text-gray-900 transition-colors duration-300 group-hover/balance:text-gray-800">
            {formatCurrency(requiredAmount)}
          </p>
        </div>
      </div>

      {/* Action Button */}
      <div className="px-4 pb-4">
        {!isBalanceSufficient && isBuy ? (
          <button
            onClick={() => navigate("/wallet")}
            className="relative w-full py-3 rounded-lg bg-gradient-to-r from-yellow-500 to-yellow-600 text-white font-semibold text-sm shadow-md transition-all duration-300 hover:shadow-xl hover:scale-[1.02] active:scale-[0.98] overflow-hidden group/wallet"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-yellow-400 to-yellow-500 opacity-0 group-hover/wallet:opacity-100 transition-opacity duration-300"></div>
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover/wallet:translate-x-full transition-transform duration-700"></div>
            <span className="relative flex items-center justify-center gap-2">
              Add Money
              <svg className="w-4 h-4 transition-transform duration-300 group-hover/wallet:scale-110" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
              </svg>
            </span>
          </button>
        ) : (
          <button
            onClick={handleAction}
            disabled={loading || (priceType === "limit" && !limitPrice)}
            className={`relative w-full py-3 rounded-lg text-white font-semibold text-sm shadow-lg transition-all duration-300 hover:shadow-xl hover:scale-[1.02] active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none overflow-hidden group/action ${
              isBuy 
                ? "bg-gradient-to-r from-green-500 to-emerald-600" 
                : "bg-gradient-to-r from-red-500 to-rose-600"
            }`}
          >
            <div className={`absolute inset-0 opacity-0 group-hover/action:opacity-100 transition-opacity duration-300 ${
              isBuy 
                ? "bg-gradient-to-r from-green-600 to-emerald-700" 
                : "bg-gradient-to-r from-red-600 to-rose-700"
            }`}></div>
            
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover/action:translate-x-full transition-transform duration-700"></div>
            
            <span className="relative flex items-center justify-center gap-2">
              {isBuy ? "Buy Now" : "Sell Now"}
              <svg className="w-4 h-4 transition-transform duration-300 group-hover/action:scale-110" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
        <p className="text-xs text-gray-500 text-center mt-3 transition-colors duration-300 hover:text-gray-600">
          {priceType === "limit" 
            ? "Limit orders may not execute if price isn't reached" 
            : "Market orders execute immediately at best available price"}
        </p>
      </div>
    </div>
  );
}