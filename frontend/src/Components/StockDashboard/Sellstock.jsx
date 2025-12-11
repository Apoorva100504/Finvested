import React, { useState } from "react";

export default function Sellstock() {
  const stock = {
    name: "Globe Textiles",
    price: 3.10,
    changePercent: -3.13,
    sharesAvailable: 24,
  };

  const [qty, setQty] = useState(stock.sharesAvailable);
  const marketClosed = true;

  return (
    <div className="min-h-screen bg-white p-4 text-gray-900 font-sans">
      {/* Header */}
      <div className="flex items-center mb-6">
        <button className="text-xl mr-2">←</button>
        <h1 className="text-lg font-semibold flex-1">Sell {stock.name}</h1>
        <button className="text-gray-500">⚙️</button>
      </div>

      {/* Price info */}
      <p className="text-sm text-gray-600 mb-4">
        ₹{stock.price.toFixed(2)} ({stock.changePercent}%) Depth
      </p>

      {/* Tabs */}
      <div className="flex gap-3 mb-4">
        <span className="px-3 py-1 rounded-full bg-green-100 text-green-600 text-sm font-medium">Delivery</span>
        <span className="px-3 py-1 rounded-full bg-gray-100 text-gray-500 text-sm font-medium">Intraday</span>
      </div>

      {/* Shares Available */}
      <p className="text-sm text-gray-500 mb-2">Shares available {stock.sharesAvailable}</p>

      {/* Qty */}
      <div className="mb-4">
        <p className="text-sm text-gray-600 mb-1">Qty NSE</p>
        <input
          type="number"
          className="w-24 p-2 border rounded-lg text-right"
          value={qty}
          onChange={(e) => setQty(e.target.value)}
        />
      </div>

      {/* Price type */}
      <div className="mb-12">
        <p className="text-sm text-gray-600 mb-1">Price Market</p>
        <button className="px-4 py-2 border rounded-xl bg-gray-100 text-gray-500 text-sm">
          At market
        </button>
      </div>

      {/* Market closed note */}
      {marketClosed && (
        <p className="text-center text-xs text-gray-400 mb-3">
          Market is closed, order will be placed on next trading day.
        </p>
      )}

      {/* Sell button */}
      <button
        className="w-full py-4 text-center bg-red-300 text-white font-semibold rounded-2xl text-lg"
      >
        SELL
      </button>
    </div>
  );
}
