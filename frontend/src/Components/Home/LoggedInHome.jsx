// src/Components/Home/LoggedInHome.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

import WatchlistPage from "../Watchlist/Watchlist.jsx";
import AllOrders from "../Account/AllOrders.jsx";
import Stocks from "../StockDashboard/StockDashboard.jsx";
import Holdings from "./Holdings.jsx";

function LoggedInHome() {
  const [activeTab, setActiveTab] = useState("explore");
  const navigate = useNavigate();

  const CompletedOrdersWrapper = () => {
    const token = localStorage.getItem("authToken") || "";
    return <AllOrders apiBaseUrl="" authToken={token} />;
  };

  const indices = [
    { name: "NIFTY", price: 26011.6, change: -174.85, percent: -0.67 },
    { name: "SENSEX", price: 85231.58, change: -480.79, percent: -0.56 },
    { name: "BANKNIFTY", price: 59235.6, change: -541.6, percent: -0.91 },
    { name: "MIDCPNIFTY", price: 13812.1, change: -186.4, percent: -1.33 },
    { name: "FINNIFTY", price: 2771, change: 5.0, percent: 0.18 },
  ];

  return (
    <div className="w-full bg-white min-h-screen">

      {/* ===== TAB NAVBAR ===== */}
      <div className="flex space-x-4 border-b px-4">
        {["explore", "orders", "Holdings", "watchlist"].map((tab) => (
          <button
            key={tab}
            className={`py-2 px-4 font-semibold ${
              activeTab === tab
                ? "border-b-2 border-blue-500 text-blue-500"
                : "text-gray-600"
            }`}
            onClick={() => setActiveTab(tab)}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      {/* ===== MARKET INDEX STRIP (Below Tab Navbar) ===== */}
      <div className="w-full border-b py-5 px-24 text-xs flex justify-between items-center mb-4 bg-white">
        {indices.map((item) => {
          const isPositive = item.change >= 0;

          return (
            <div key={item.name} className="flex items-center space-x-1">
              <span className="font-medium text-gray-800 text-[11px]">
                {item.name}
              </span>

              <span className="text-gray-700 text-[11px]">
                {item.price}
              </span>

              <span
                className={`font-medium text-[11px] ${
                  isPositive ? "text-green-500" : "text-red-500"
                }`}
              >
                {item.change} ({item.percent}%)
              </span>
            </div>
          );
        })}
      </div>

      {/* ===== TAB CONTENT ===== */}
      <div className="w-full px-4 bg-white">
        {activeTab === "explore" && <Stocks />}
        {activeTab === "Holdings" && <Holdings />}
        {activeTab === "orders" && <CompletedOrdersWrapper />}
        {activeTab === "watchlist" && <WatchlistPage />}
      </div>
    </div>
  );
}

export default LoggedInHome;
