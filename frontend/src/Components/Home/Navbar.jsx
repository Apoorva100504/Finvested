// Navbar.jsx
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Logo from "../../assets/Logo.png";
import LoginModal from "../login/LoginModal.jsx";
import Dashboard from "../Account/Dashboard.jsx"
import { Search, Bell, ChevronDown, TrendingUp, CheckCircle, AlertTriangle, ArrowRight } from "lucide-react";

const Navbar = () => {
  const [userName, setUserName] = useState("");
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState("login");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userEmail, setUserEmail] = useState("");
  const [isDashboardModalOpen, setIsDashboardModalOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      type: "success",
      title: "Portfolio Update",
      message: "Your portfolio gained 2.5% today",
      time: "Just now",
      read: false,
      icon: TrendingUp
    },
    {
      id: 2,
      type: "info",
      title: "Order Executed",
      message: "Your buy order for RELIANCE executed at ₹2,850",
      time: "10 min ago",
      read: false,
      icon: CheckCircle
    },
    {
      id: 3,
      type: "warning",
      title: "Market Alert",
      message: "NIFTY 50 down by 1.2% today",
      time: "30 min ago",
      read: true,
      icon: AlertTriangle
    },
    {
      id: 4,
      type: "success",
      title: "Weekly Report",
      message: "Your weekly portfolio report is ready",
      time: "2 hours ago",
      read: true,
      icon: TrendingUp
    },
    {
      id: 5,
      type: "info",
      title: "Dividend Received",
      message: "₹1,250 dividend credited from HDFC Bank",
      time: "1 day ago",
      read: true,
      icon: CheckCircle
    }
  ]);

  // Scroll effect for navbar
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Extract user name from userData
  const extractUserName = (userData) => {
    if (!userData) return "";
    
    const firstName = userData.first_name || userData.firstName || "";
    const lastName = userData.last_name || userData.lastName || "";
    const fullName = `${firstName} ${lastName}`.trim();
    
    return fullName;
  };

  // Check login state on mount and setup event listeners
  useEffect(() => {
    const checkLoginStatus = () => {
      const loggedIn = localStorage.getItem("isLoggedIn") === "true";
      const email = localStorage.getItem("userEmail") || "";
      const userData = JSON.parse(localStorage.getItem("userData") || "{}");
      
      setIsLoggedIn(loggedIn);
      setUserEmail(email);
      
      // Extract and set name from userData
      if (loggedIn && userData) {
        const name = extractUserName(userData);
        if (name) {
          setUserName(name);
        } else if (email) {
          // Fallback to email username
          const emailUsername = email.split('@')[0];
          setUserName(emailUsername.charAt(0).toUpperCase() + emailUsername.slice(1));
        }
      }
    };

    // Initial check
    checkLoginStatus();

    const handleLoginEvent = (e) => {
      console.log("✅ Login event received in Navbar:", e.detail);
      
      // Force immediate state update
      setIsLoggedIn(true);
      
      if (e.detail.email) {
        setUserEmail(e.detail.email);
        localStorage.setItem("userEmail", e.detail.email);
      }
      
      if (e.detail.userData) {
        localStorage.setItem("userData", JSON.stringify(e.detail.userData));
        
        // Extract and set name immediately
        const name = extractUserName(e.detail.userData);
        if (name) {
          setUserName(name);
        } else if (e.detail.email) {
          const emailUsername = e.detail.email.split('@')[0];
          setUserName(emailUsername.charAt(0).toUpperCase() + emailUsername.slice(1));
        }
      }
      
      localStorage.setItem("isLoggedIn", "true");
    };

    const handleLogoutEvent = () => {
      console.log("🚪 Logout event received in Navbar");
      setIsLoggedIn(false);
      setUserEmail("");
      setUserName("");
    };

    window.addEventListener("userLoggedIn", handleLoginEvent);
    window.addEventListener("userLoggedOut", handleLogoutEvent);

    return () => {
      window.removeEventListener("userLoggedIn", handleLoginEvent);
      window.removeEventListener("userLoggedOut", handleLogoutEvent);
    };
  }, []);

  // Real-time sync useEffect - checks localStorage periodically
  useEffect(() => {
    const syncWithLocalStorage = () => {
      // Only sync if we're logged in
      if (isLoggedIn) {
        const storedEmail = localStorage.getItem("userEmail") || "";
        const userData = JSON.parse(localStorage.getItem("userData") || "{}");
        
        // Sync email if changed
        if (storedEmail && storedEmail !== userEmail) {
          setUserEmail(storedEmail);
        }
        
        // Sync name from userData
        if (Object.keys(userData).length > 0) {
          const name = extractUserName(userData);
          if (name && name !== userName) {
            setUserName(name);
          }
        }
      }
    };

    // Sync every 300ms (fast enough but not too heavy)
    const intervalId = setInterval(syncWithLocalStorage, 300);

    return () => clearInterval(intervalId);
  }, [isLoggedIn, userEmail, userName]);

  const openLoginModal = () => {
    setModalMode("login");
    setIsLoginModalOpen(true);
  };

  const openSignupModal = () => {
    setModalMode("signup");
    setIsLoginModalOpen(true);
  };

  const closeModal = () => setIsLoginModalOpen(false);

  const handleLogout = () => {
    // Clear all auth-related localStorage items
    localStorage.removeItem("authToken");
    localStorage.removeItem("userData");
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("loginProvider");
    localStorage.removeItem("userEmail");
    
    // Update state
    setIsLoggedIn(false);
    setUserEmail("");
    setUserName("");
    setIsDashboardModalOpen(false);
    
    // Dispatch logout event
    window.dispatchEvent(new Event("userLoggedOut"));
  };

  const toggleDashboardModal = () => {
    setIsDashboardModalOpen((prev) => !prev);
  };

  const handleSearch = (e) => {
    if (e.key === 'Enter' && searchQuery.trim()) {
      console.log("Searching for:", searchQuery);
      // Add your search logic here
    }
  };

  // Get user initials for avatar
  const getUserInitials = () => {
    if (userName) {
      return userName
        .split(' ')
        .map(word => word.charAt(0))
        .join('')
        .toUpperCase()
        .slice(0, 2);
    }
    if (userEmail) {
      return userEmail.charAt(0).toUpperCase();
    }
    return "U";
  };

  // Get display name for navbar
  const getDisplayName = () => {
    if (userName) return userName;
    if (userEmail) {
      const emailUsername = userEmail.split('@')[0];
      return emailUsername.charAt(0).toUpperCase() + emailUsername.slice(1);
    }
    return "User";
  };

  // Mark all notifications as read
  const markAllAsRead = () => {
    setNotifications(notifications.map(notification => ({
      ...notification,
      read: true
    })));
  };

  // Mark single notification as read
  const markAsRead = (id) => {
    setNotifications(notifications.map(notification => 
      notification.id === id ? { ...notification, read: true } : notification
    ));
  };

  // Get unread notifications count
  const unreadCount = notifications.filter(n => !n.read).length;

  // Clear all notifications
  const clearAllNotifications = () => {
    setNotifications([]);
  };

  // Get notification icon based on type
  const getNotificationIcon = (type) => {
    switch(type) {
      case 'success': return TrendingUp;
      case 'warning': return AlertTriangle;
      case 'info': return CheckCircle;
      default: return CheckCircle;
    }
  };

  // Get notification color based on type
  const getNotificationColor = (type) => {
    switch(type) {
      case 'success': return 'bg-emerald-100 text-emerald-600';
      case 'warning': return 'bg-amber-100 text-amber-600';
      case 'info': return 'bg-blue-100 text-blue-600';
      default: return 'bg-gray-100 text-gray-600';
    }
  };

  return (
    <>
      {/* Spacer div to prevent content from going under fixed navbar */}
      <div className="h-5"></div>

      {/* Main Navbar */}
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled
            ? "bg-white/95 backdrop-blur-lg shadow-lg border-b border-gray-100"
            : "bg-white shadow-md"
        }`}
      >
        <div className="px-4 sm:px-6 lg:px-16 xl:px-32">
          <div className="flex items-center justify-between h-16">
            {/* Left Section - Logo */}
            <div className="flex items-center">
              <Link
                to="/"
                className="flex items-center space-x-3 group"
              >
                <div className="relative">
                  <img
                    src={Logo}
                    alt="Finvested Logo"
                    className="h-9 w-auto transition-transform duration-300 group-hover:scale-110"
                  />
                  <div className="absolute -inset-2 bg-gradient-to-r from-emerald-400 to-green-500 rounded-full opacity-0 group-hover:opacity-20 blur-md transition-opacity duration-300"></div>
                </div>
                <div className="flex flex-col">
                  <span className="text-3xl font-bold bg-gradient-to-r from-neonBlue via-aquaMintDark to-neonBlue bg-clip-text text-transparent transition-all duration-300 group-hover:tracking-wide">
                    Finvested
                  </span>
                  <span className="text-sm font-bold bg-gradient-to-r from-[#5064FF] to-[#5064FF] bg-clip-text text-transparent leading-tight">
                    SMART INVESTING
                  </span>
                </div>
              </Link>
            </div>

            {/* Center Section - Search Bar */}
            <div className="flex-1 max-w-2xl mx-8 hidden lg:block">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Search className="h-4 w-4 text-gray-400" />
                </div>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={handleSearch}
                  placeholder="Search for stocks, ETFs, mutual funds..."
                  className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent focus:bg-white transition-all duration-200 placeholder-gray-400 text-sm"
                />
                <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
                  <kbd className="inline-flex items-center px-2 py-1 text-xs font-medium text-gray-500 bg-gray-100 border border-gray-300 rounded-lg">
                    ⌘K
                  </kbd>
                </div>
              </div>
            </div>

            {/* Right Section - Auth or User Menu */}
            <div className="flex items-center space-x-4">
              {/* Mobile Search Icon */}
              <button className="lg:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors">
                <Search className="h-5 w-5 text-gray-600" />
              </button>

              {!isLoggedIn ? (
                <div className="flex items-center space-x-3">
                  <button
                    onClick={openLoginModal}
                    className="px-5 py-2.5 text-sm font-semibold text-[#5064FF] border-2 border-[#5064FF] rounded-xl hover:bg-[#E6E8FF] hover:border-[#3948E0] hover:text-[#3948E0] active:scale-95 transition-all duration-200 shadow-sm"
                  >
                    Log In
                  </button>
                  <button
                    onClick={openSignupModal}
                    className="px-5 py-2.5 text-sm font-semibold text-white bg-gradient-to-r from-aquaMintDark to-neonBlue rounded-xl hover:shadow-lg hover:shadow-neonBlue/30 hover:from-neonBlue hover:to-aquaMintDark active:scale-95 transition-all duration-200 shadow-md"
                  >
                    Sign Up Free
                  </button>
                </div>
              ) : (
                <div className="flex items-center space-x-4">
                  {/* Notification Bell */}
                  <div className="relative">
                    <button
                      onClick={() => setShowNotifications(!showNotifications)}
                      className="relative p-2 rounded-xl hover:bg-gray-100 transition-colors group"
                    >
                      <Bell className="h-5 w-5 text-gray-600 group-hover:text-emerald-600 transition-colors" />
                      {unreadCount > 0 && (
                        <span className="absolute -top-1 -right-1 h-5 w-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-bold ring-2 ring-white">
                          {unreadCount}
                        </span>
                      )}
                    </button>
                    
                    {/* Notification Dropdown */}
                    {showNotifications && (
                      <div className="absolute right-0 mt-2 w-96 bg-white rounded-xl shadow-2xl border border-gray-200 py-2 z-50">
                        {/* Notification Header */}
                        <div className="px-4 py-3 border-b border-gray-100 flex justify-between items-center">
                          <div>
                            <h3 className="font-semibold text-gray-800">Notifications</h3>
                            <p className="text-xs text-gray-500">
                              {unreadCount} unread notification{unreadCount !== 1 ? 's' : ''}
                            </p>
                          </div>
                          <div className="flex space-x-2">
                            {unreadCount > 0 && (
                              <button
                                onClick={markAllAsRead}
                                className="text-xs text-emerald-600 hover:text-emerald-700 font-medium px-3 py-1 hover:bg-emerald-50 rounded-lg transition-colors"
                              >
                                Mark all read
                              </button>
                            )}
                            {notifications.length > 0 && (
                              <button
                                onClick={clearAllNotifications}
                                className="text-xs text-red-600 hover:text-red-700 font-medium px-3 py-1 hover:bg-red-50 rounded-lg transition-colors"
                              >
                                Clear all
                              </button>
                            )}
                          </div>
                        </div>

                        {/* Notifications List */}
                        <div className="max-h-96 overflow-y-auto">
                          {notifications.length === 0 ? (
                            <div className="px-4 py-8 text-center">
                              <Bell className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                              <p className="text-gray-500">No notifications</p>
                              <p className="text-xs text-gray-400 mt-1">We'll notify you when something arrives</p>
                            </div>
                          ) : (
                            notifications.map((notification) => {
                              const Icon = getNotificationIcon(notification.type);
                              const colorClass = getNotificationColor(notification.type);
                              
                              return (
                                <div
                                  key={notification.id}
                                  onClick={() => markAsRead(notification.id)}
                                  className={`px-4 py-3 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-0 transition-colors ${
                                    !notification.read ? 'bg-emerald-50/50' : ''
                                  }`}
                                >
                                  <div className="flex items-start space-x-3">
                                    <div className={`w-10 h-10 ${colorClass} rounded-full flex items-center justify-center flex-shrink-0`}>
                                      <Icon className="h-5 w-5" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                      <div className="flex justify-between items-start">
                                        <p className="text-sm font-medium text-gray-800">
                                          {notification.title}
                                          {!notification.read && (
                                            <span className="ml-2 inline-block w-2 h-2 bg-emerald-500 rounded-full"></span>
                                          )}
                                        </p>
                                        <span className="text-xs text-gray-500 whitespace-nowrap">
                                          {notification.time}
                                        </span>
                                      </div>
                                      <p className="text-xs text-gray-600 mt-1">
                                        {notification.message}
                                      </p>
                                    </div>
                                  </div>
                                </div>
                              );
                            })
                          )}
                        </div>

                        {/* Notification Footer */}
                        {notifications.length > 0 && (
                          <div className="px-4 py-2 border-t border-gray-100">
                            <Link
                              to="/notifications"
                              className="text-sm text-emerald-600 hover:text-emerald-700 font-medium w-full text-center py-2 flex items-center justify-center gap-1 hover:bg-emerald-50 rounded-lg transition-colors"
                            >
                              View All Notifications
                              <ArrowRight className="h-3 w-3" />
                            </Link>
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  {/* User Profile */}
                  <div className="relative">
                    <button
                      onClick={toggleDashboardModal}
                      className="flex items-center space-x-3 group p-1.5 pr-3 rounded-xl hover:bg-gray-100 transition-all duration-200"
                    >
                      <div className="relative">
                     <div className="h-10 w-10 flex items-center justify-center text-white bg-gradient-to-r from-aquaMintDark to-neonBlue rounded-full hover:shadow-lg hover:shadow-neonBlue/30 hover:from-neonBlue hover:to-aquaMintDark active:scale-95 transition-all duration-200 shadow-md">


                          {getUserInitials()}
                        </div>
                        <div className="absolute -inset-1 bg-gradient-to-r from-emerald-400 to-green-500 rounded-full opacity-0 group-hover:opacity-20 blur transition-opacity duration-300"></div>
                      </div>
                      <div className="hidden lg:block text-left">
                        <p className="text-sm font-semibold text-gray-800 truncate max-w-[140px]">
                          {getDisplayName()}
                        </p>
                        <p className="text-xs text-gray-500 truncate max-w-[140px]">
                          {userEmail}
                        </p>
                      </div>
                      <ChevronDown 
                        className={`h-5 w-5 text-gray-400 transition-transform duration-300 ${isDashboardModalOpen ? 'rotate-180' : ''}`}
                      />
                    </button>

                    {/* User Dropdown Menu */}
                    {isDashboardModalOpen && (
                      <Dashboard
                        isDashboardModalOpen={isDashboardModalOpen}
                        onToggleDashboardModal={toggleDashboardModal}
                      />
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Mobile Search Bar */}
        <div className="lg:hidden px-4 pb-4">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Search className="h-4 w-4 text-gray-400" />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={handleSearch}
              placeholder="Search investments..."
              className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent focus:bg-white transition-all duration-200 placeholder-gray-400 text-sm"
            />
          </div>
        </div>
      </nav>

      {/* Login/Signup Modal */}
      <LoginModal isOpen={isLoginModalOpen} mode={modalMode} onClose={closeModal} />

      {/* Click outside to close dropdowns */}
      {(showNotifications || isDashboardModalOpen) && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => {
            setShowNotifications(false);
            setIsDashboardModalOpen(false);
          }}
        />
      )}
    </>
  );
};

export default Navbar;