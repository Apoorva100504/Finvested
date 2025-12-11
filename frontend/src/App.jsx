// src/App.js - NO REDUX VERSION
import React, { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

// Pages
import Homepage from "./Components/Home/HomePage.jsx";
import LoginHome from "./Components/Home/LoggedInHome.jsx";
import Holding from "./Components/Home/Holdings.jsx";
import Noorder from "./Components/Home/Noorder.jsx";
import Navbar from "./Components/Home/Navbar.jsx";
import WalletPage from "./Components/Wallet/WalletPage.jsx";
import Transactions from "./Components/Wallet/TransactionsPage.jsx";
import Login from "./Components/login/LoginModal.jsx";
// Account Components
import Dashboard from "./Components/Account/Dashboard.jsx";
import AllOrders from "./Components/Account/AllOrders.jsx";
import CustomerSupport from "./Components/Account/CustomerSupport.jsx";
import Reports from "./Components/Account/Reports.jsx";
import Logout from "./Components/Account/Logout.jsx";

// Portfolio
import PortfolioPage from "./Components/Portfolio/PortfolioPage.jsx";
import AnalyticsPage from "./Components/Portfolio/AnalyticsPage.jsx";

// Watchlist
import Watchlist from "./Components/Watchlist/Watchlist.jsx";

// Stock Dashboard
import StockDashboard from "./Components/StockDashboard/StockDashboard.jsx";

// Stock Details Page - ADD THIS IMPORT
import StockDetailsPage from "./Components/StockDashboard/StockDetailsPage.jsx";
import Buy from "./Components/StockDashboard/BuyStock.jsx";

function App() {
  useEffect(() => {
    const vapidKey = "BNuO8ul1x-GKuOpEDPGkBBv911cMJJ30P1wcxx1Tp0WhkZ7jsQ9RyUi26YGAzTuYGDR2HUAILm9wYaVnZ4PUHVQ";

    async function registerFCM() {
      try {
        // Only run if Firebase functions exist
        if (typeof generateFcmToken === 'function') {
          const token = await generateFcmToken(vapidKey);
          console.log("FCM Token:", token);

          if (token) {
            localStorage.setItem("fcmToken", token);
            
            const isLoggedIn = localStorage.getItem("isLoggedIn");
            if (isLoggedIn === "true") {
              await fetch("http://localhost:4000/save-token", {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({ token }),
              });
            }
          }
        }
      } catch (error) {
        console.error("FCM Error:", error);
      }
    }

    // Comment out FCM for now to avoid errors
    // registerFCM();

  }, []);

  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        
        <main className="pt-16">
          <Routes>
            {/* Home */}
            <Route path="/" element={<Homepage />} />
             <Route path="/login" element={<Login />} />
            
            {/* Watchlist */}
            <Route path="/watchlist" element={<Watchlist />} />
            <Route path="/transaction" element={<Transactions />} />
            
            {/* Stocks */}
            <Route path="/stocks" element={<StockDashboard />} />
            
            {/* Stock Details Page - ADD THIS ROUTE */}
            <Route path="/stock/:symbol" element={<StockDetailsPage />} />
            <Route path="/Noorder" element={<Noorder />} />
           
            
            {/* Wallet */}
            <Route path="/wallet" element={<WalletPage />} />
            <Route path="/Loginh" element={<LoginHome />} />
            <Route path="/holding" element={<Holding/>} />
            {/* Account */}
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/orders" element={<AllOrders />} />
            <Route path="/customer-support" element={<CustomerSupport />} />
            <Route path="/reports" element={<Reports />} />
            <Route path="/logout" element={<Logout />} />
            <Route path="/buy" element={<Buy />} />
            
            {/* Portfolio */}
            <Route path="/portfolio" element={<PortfolioPage />} />
            <Route path="/analytics" element={<AnalyticsPage />} />
            
            {/* Redirect unknown paths to home */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;