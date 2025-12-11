// src/Components/Home/LoggedInHome.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Compass, Package, ListOrdered, Star } from "lucide-react";

import WatchlistPage from "../Watchlist/Watchlist.jsx";
import AllOrders from "../Account/AllOrders.jsx";
import Stocks from "../StockDashboard/StockDashboard.jsx";
import Holdings from "./Holdings.jsx";

function LoggedInHome() {
  const [activeTab, setActiveTab] = useState("explore");
  const navigate = useNavigate();

  // Tab configuration
  const tabs = [
    { id: "explore", label: "Explore", icon: Compass },
    { id: "Holdings", label: "Holdings", icon: Package },
    { id: "orders", label: "Orders", icon: ListOrdered },
    { id: "watchlist", label: "Watchlist", icon: Star },
  ];

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
      <div className="sticky top-16 z-40 bg-white/90 backdrop-blur-lg border-b border-emerald-100">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-1 sm:space-x-2 overflow-x-auto py-2 scrollbar-hide">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 px-4 sm:px-6 py-3 rounded-xl transition-all duration-300 whitespace-nowrap ${
                    isActive
                      ? "bg-gradient-to-r from-aquaMintDark to-neonBlue text-white shadow-lg shadow-neonBlue/30"
                      : "text-gray-600 hover:text-neonBlue hover:bg-neonBlue/10"
                  }`}
                >
                  <Icon className={`h-4 w-4 sm:h-5 sm:w-5 ${isActive ? 'text-white' : 'text-neonBlue'}`} />
                  <span className="font-semibold text-sm sm:text-base">{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* ===== MARKET INDEX STRIP ===== */}
      <div className="w-full border-b py-5 px-4 md:px-8 lg:px-24 text-xs flex justify-between items-center mb-4 bg-white overflow-x-auto pt-10 scrollbar-hide">
        {indices.map((item) => {
          const isPositive = item.change >= 0;
          return (
            <div key={item.name} className="flex items-center space-x-1 px-2">
              <span className="font-medium text-gray-800 text-[11px] whitespace-nowrap">{item.name}</span>
              <span className="text-gray-700 text-[11px] whitespace-nowrap">{item.price.toLocaleString('en-IN')}</span>
              <span className={`font-medium text-[11px] whitespace-nowrap ${isPositive ? "text-green-500" : "text-red-500"}`}>
                {item.change.toFixed(2)} ({item.percent.toFixed(2)}%)
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

      {/* ===== INLINE STYLE FOR SCROLLBAR HIDE ===== */}
      <style>
        {`
          .scrollbar-hide {
            -ms-overflow-style: none;
            scrollbar-width: none;
          }
          .scrollbar-hide::-webkit-scrollbar {
            display: none;
          }
        `}
      </style>
    </div>
  );
}

export default LoggedInHome;
