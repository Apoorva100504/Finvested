import { useEffect, useState } from "react"; // Import useState
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
//import "./App.css";
import { generateFcmToken, listenForegroundMessages } from "./firebase";
import Homepage from "./Components/Home/Homepage.jsx";
import Navbar from "./Components/Home/Navbar";
// Import the existing Dashboard component from the Account folder
import Dashboard from "./Components/Account/Dashboard.jsx";
import AllOrders from "./Components/Account/AllOrders.jsx"; // Assuming these are also in Account
import CustomerSupport from "./Components/Account/CustomerSupport.jsx"; // Assuming these are also in Account
import Reports from "./Components/Account/Reports.jsx"; // Assuming these are also in Account
import Logout from "./Components/Account/Logout.jsx"; // Assuming these are also in Account

function App() {
  // State for the dashboard modal
 
  useEffect(() => {
    const vapidKey =
      "BNuO8ul1x-GKuOpEDPGkBBv911cMJJ30P1wcxx1Tp0WhkZ7jsQ9RyUi26YGAzTuYGDR2HUAILm9wYaVnZ4PUHVQ";

    async function registerFCM() {
      const token = await generateFcmToken(vapidKey);
      console.log("FCM Token:", token);

      if (token) {
        // Send token to your backend
        await fetch("http://localhost:4000/save-token", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ token }),
        });
      }
    }

    registerFCM();

    // Listen to messages when app is open
    listenForegroundMessages((payload) => {
      console.log("Foreground Message:", payload);
      alert(payload.notification?.title + "\n" + payload.notification?.body);
    });
  }, []);

  return (
    <Router>
      <div>
        <Navbar/>
        <Routes>
          {/* Public route for Homepage */}
          <Route path="/" element={<Homepage />} />

          {/* Dashboard routes */}
          <Route
            path="/dashboard"
            element={<Dashboard
              
            />}
          >
            <Route path="all-orders" element={<AllOrders />} />
            <Route path="customer-support" element={<CustomerSupport />} />
            <Route path="reports" element={<Reports />} />
            <Route path="logout" element={<Logout />} />
          </Route>

          {/* Add other routes here if needed */}
        </Routes>
      </div>
    </Router>
  );
}

export default App;
