import React, { useState, useEffect } from "react";
import { useNavigate, Outlet } from "react-router-dom";

const Dashboard = ({ isDashboardModalOpen, onToggleDashboardModal }) => {
  const navigate = useNavigate();
  const [userName, setUserName] = useState("Guest User");
  const [userEmail, setUserEmail] = useState("");
  const [loading, setLoading] = useState(false);

  // Fetch user data from localStorage
  useEffect(() => {
    if (isDashboardModalOpen) {
      setLoading(true);
      
      // Get user data from localStorage
      const userData = JSON.parse(localStorage.getItem("userData") || "{}");
      const token = localStorage.getItem("authToken");
      
      if (token && userData) {
        // Extract name from userData
        const firstName = userData.first_name || userData.firstName || "";
        const lastName = userData.last_name || userData.lastName || "";
        const fullName = `${firstName} ${lastName}`.trim();
        
        // Set username (if no name, use email username)
        if (fullName) {
          setUserName(fullName);
        } else if (userData.email) {
          const emailUsername = userData.email.split('@')[0];
          setUserName(emailUsername.charAt(0).toUpperCase() + emailUsername.slice(1));
        }
        
        // Set email
        if (userData.email) {
          setUserEmail(userData.email);
        }
      } else {
        // Fallback to demo user
        const demoUser = JSON.parse(localStorage.getItem("demoUser") || "{}");
        const storedEmail = localStorage.getItem("userEmail");
        
        if (demoUser.name) {
          setUserName(demoUser.name);
        }
        if (storedEmail) {
          setUserEmail(storedEmail);
        }
      }
      
      setLoading(false);
    }
  }, [isDashboardModalOpen]);

  const handleLogout = () => {
    // Clear all auth data
    localStorage.removeItem("authToken");
    localStorage.removeItem("userData");
    localStorage.removeItem("demoAuthToken");
    localStorage.removeItem("demoUser");
    localStorage.removeItem("userEmail");
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("loginProvider");

    // Dispatch custom event for Navbar
    window.dispatchEvent(new Event("userLoggedOut"));

    onToggleDashboardModal();
    navigate("/");
  };

  // Get initials for avatar
  const getUserInitials = () => {
    return userName
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  if (!isDashboardModalOpen) return null;

  return (
    <div className="relative">
      {/* ===== DASHBOARD MODAL ===== */}
      <div
        className="fixed inset-0 bg-black/40 z-50 flex justify-end"
        onClick={onToggleDashboardModal}
      >
        {/* MODAL BOX with dynamic height */}
       <div
  className="w-80 bg-white rounded-xl shadow-2xl m-4 overflow-hidden border border-gray-200 max-h-fit"
  onClick={(e) => e.stopPropagation()}
>

          {/* USER INFO with hover effects */}
          <div className="p-5 bg-gradient-to-br from-gray-50 to-white border-b border-gray-100">
            {loading ? (
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-r from-gray-200 to-gray-300 rounded-full animate-pulse"></div>
                <div className="space-y-2">
                  <div className="h-4 bg-gradient-to-r from-gray-200 to-gray-300 rounded w-24 animate-pulse"></div>
                  <div className="h-3 bg-gradient-to-r from-gray-200 to-gray-300 rounded w-32 animate-pulse"></div>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-4 group">
                {/* Avatar with gradient hover effect */}
                <div 
                  className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold shadow-md transition-all duration-300 group-hover:scale-110 group-hover:shadow-lg"
                  style={{
                    background: "linear-gradient(135deg, #5064FF, #48E1C4)",
                    transition: "all 0.3s ease"
                  }}
                >
                  {getUserInitials()}
                </div>
                
                <div className="flex-1 min-w-0">
                  {/* Username with slide-in effect */}
                  <h3 className="text-lg font-bold text-gray-900 truncate transition-all duration-300 group-hover:text-gray-800">
                    {userName}
                  </h3>
                  
                  {/* Email with special hover effect */}
                  <div className="flex items-center gap-2">
                    <svg 
                      className="w-3 h-3 text-gray-500 transition-all duration-300 group-hover:text-blue-500 group-hover:scale-110" 
                      fill="currentColor" 
                      viewBox="0 0 24 24"
                    >
                      <path d="M20 4H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z" />
                    </svg>
                    <p className="text-sm text-gray-600 truncate transition-all duration-300 group-hover:text-blue-600 group-hover:font-medium">
                      {userEmail || "Not logged in"}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Scrollable content area */}
          <div className="overflow-y-auto" style={{ maxHeight: "calc(100vh - 150px)" }}>
            {/* Rest of your content remains the same */}
            <div className="p-4">
              <hr className="my-2" />

              {/* BALANCE */}
              <button
                onClick={() => {
                  navigate("/wallet");
                  onToggleDashboardModal();
                }}
                className="w-full flex items-start gap-3 py-3 px-2 rounded-md text-left transition-all duration-200 hover:bg-gradient-to-r hover:from-blue-50 hover:to-cyan-50 hover:shadow-sm hover:scale-[1.02] active:scale-[0.98] border border-transparent hover:border-blue-100"
              >
                <svg
                  className="w-6 h-6 text-gray-600 transition-all duration-200 group-hover:text-blue-600"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                >
                  <path d="M21 12V7a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v5m18 0v5a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-5m18 0H3" />
                </svg>

                <div>
                  <p className="font-medium text-gray-800 transition-colors duration-200 group-hover:text-gray-900">₹0.00</p>
                  <p className="text-xs text-gray-500 transition-colors duration-200 group-hover:text-gray-600">Stocks, F&O balance</p>
                </div>
              </button>

              {/* ALL ORDERS */}
              <button
                onClick={() => {
                  navigate("/orders");
                  onToggleDashboardModal();
                }}
                className="w-full flex items-center gap-3 py-3 px-2 rounded-md text-left transition-all duration-200 hover:bg-gradient-to-r hover:from-blue-50 hover:to-cyan-50 hover:shadow-sm hover:scale-[1.02] active:scale-[0.98] border border-transparent hover:border-blue-100"
              >
                <svg
                  className="w-5 h-5 text-gray-600 transition-all duration-200 group-hover:text-blue-600"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                >
                  <path d="M4 6h16M4 12h16M4 18h16" />
                </svg>
                <span className="text-gray-800 transition-colors duration-200 group-hover:text-gray-900">All Orders</span>
              </button>

              {/* CUSTOMER SUPPORT */}
              <button
                onClick={() => {
                  navigate("/customer-support");
                  onToggleDashboardModal();
                }}
                className="w-full flex items-center gap-3 py-3 px-2 rounded-md text-left transition-all duration-200 hover:bg-gradient-to-r hover:from-blue-50 hover:to-cyan-50 hover:shadow-sm hover:scale-[1.02] active:scale-[0.98] border border-transparent hover:border-blue-100"
              >
                <svg
                  className="w-5 h-5 text-gray-600 transition-all duration-200 group-hover:text-blue-600"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                >
                  <path d="M18 10a6 6 0 1 0-12 0v4a4 4 0 0 0 4 4h4a4 4 0 0 0 4-4v-4z" />
                  <path d="M6 14H4a2 2 0 0 1-2-2v-1a2 2 0 0 1 2-2h2" />
                  <path d="M18 14h2a2 2 0 0 0 2-2v-1a2 2 0 0 0-2-2h-2" />
                </svg>
                <span className="text-gray-800 transition-colors duration-200 group-hover:text-gray-900">24 × 7 Customer Support</span>
              </button>

              {/* REPORTS */}
              <button
                onClick={() => {
                  navigate("/reports");
                  onToggleDashboardModal();
                }}
                className="w-full flex items-center gap-3 py-3 px-2 rounded-md text-left transition-all duration-200 hover:bg-gradient-to-r hover:from-blue-50 hover:to-cyan-50 hover:shadow-sm hover:scale-[1.02] active:scale-[0.98] border border-transparent hover:border-blue-100"
              >
                <svg
                  className="w-5 h-5 text-gray-600 transition-all duration-200 group-hover:text-blue-600"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                >
                  <path d="M4 4h16v16H4z" />
                  <path d="M8 12h8M8 16h6M8 8h8" />
                </svg>
                <span className="text-gray-800 transition-colors duration-200 group-hover:text-gray-900">Reports</span>
              </button>

              {/* LOGOUT */}
              <div className="border-t mt-3 pt-3">
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 py-3 px-2 rounded-md text-left transition-all duration-200 hover:bg-gradient-to-r hover:from-red-50 hover:to-pink-50 hover:shadow-sm hover:scale-[1.02] active:scale-[0.98] border border-transparent hover:border-red-100 text-red-500 hover:text-red-600"
                >
                  <svg
                    className="w-5 h-5 transition-all duration-200 hover:scale-110"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                  >
                    <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" />
                    <path d="M10 17l5-5-5-5" />
                    <path d="M15 12H3" />
                  </svg>

                  <span className="font-medium transition-colors duration-200">Log out</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ===== MAIN DASHBOARD CONTENT ===== */}
      <div className="px-6 py-4">
        <Outlet />
      </div>
    </div>
  );
};

export default Dashboard;