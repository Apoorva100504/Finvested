// Navbar.jsx
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Logo from "../../assets/Logo.png";
import LoginModal from "../login/LoginModal.jsx";
import { Search, Bell, ChevronDown, User, LogOut, TrendingUp, CheckCircle, AlertTriangle, ArrowRight } from "lucide-react";

const Navbar = () => {
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

  // Check login state on mount
  useEffect(() => {
    const loggedIn = localStorage.getItem("isLoggedIn") === "true";
    const email = localStorage.getItem("userEmail") || "";
    setIsLoggedIn(loggedIn);
    setUserEmail(email);

    const handleLoginEvent = (e) => {
      setIsLoggedIn(true);
      setUserEmail(e.detail.email);
    };

    const handleLogoutEvent = () => {
      setIsLoggedIn(false);
      setUserEmail("");
    };

    window.addEventListener("userLoggedIn", handleLoginEvent);
    window.addEventListener("userLoggedOut", handleLogoutEvent);

    return () => {
      window.removeEventListener("userLoggedIn", handleLoginEvent);
      window.removeEventListener("userLoggedOut", handleLogoutEvent);
    };
  }, []);

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
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("userEmail");
    setIsLoggedIn(false);
    setUserEmail("");
    setIsDashboardModalOpen(false);
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
    if (!userEmail) return "U";
    const name = userEmail.split('@')[0];
    return name.charAt(0).toUpperCase();
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
                  <span className="text-2xl font-bold bg-gradient-to-r from-emerald-600 to-green-500 bg-clip-text text-transparent leading-tight">
                    Finvested
                  </span>
                  <span className="text-[10px] text-gray-500 font-medium tracking-wider">
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
                    className="px-5 py-2.5 text-sm font-semibold text-emerald-600 border-2 border-emerald-600 rounded-xl hover:bg-emerald-50 hover:border-emerald-700 hover:text-emerald-700 active:scale-95 transition-all duration-200 shadow-sm"
                  >
                    Log In
                  </button>
                  <button
                    onClick={openSignupModal}
                    className="px-5 py-2.5 text-sm font-semibold text-white bg-gradient-to-r from-emerald-600 to-green-500 rounded-xl hover:shadow-lg hover:shadow-emerald-200 hover:from-emerald-700 hover:to-green-600 active:scale-95 transition-all duration-200 shadow-md"
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
                        <div className="h-10 w-10 bg-gradient-to-br from-emerald-500 to-green-600 text-white rounded-full flex items-center justify-center font-bold text-lg shadow-md group-hover:shadow-lg transition-all duration-300 group-hover:scale-105">
                          {getUserInitials()}
                        </div>
                        <div className="absolute -inset-1 bg-gradient-to-r from-emerald-400 to-green-500 rounded-full opacity-0 group-hover:opacity-20 blur transition-opacity duration-300"></div>
                      </div>
                      <div className="hidden lg:block text-left">
                        <p className="text-sm font-semibold text-gray-800 truncate max-w-[140px]">
                          {userEmail ? userEmail.split('@')[0] : "User"}
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
                      <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-xl border border-gray-200 py-2 z-50">
                        <div className="px-4 py-3 border-b border-gray-100">
                          <div className="flex items-center space-x-3">
                            <div className="h-10 w-10 bg-gradient-to-br from-emerald-500 to-green-600 text-white rounded-full flex items-center justify-center font-bold">
                              {getUserInitials()}
                            </div>
                            <div>
                              <p className="font-semibold text-gray-800">
                                {userEmail ? userEmail.split('@')[0] : "User"}
                              </p>
                              <p className="text-sm text-gray-500 truncate">
                                {userEmail}
                              </p>
                            </div>
                          </div>
                        </div>
                        
                        <div className="py-2">
                          <Link
                            to="/portfolio"
                            className="flex items-center space-x-3 px-4 py-2.5 hover:bg-gray-50 text-gray-700 hover:text-emerald-600 transition-colors"
                          >
                            <User className="h-4 w-4" />
                            <span className="text-sm font-medium">My Portfolio</span>
                          </Link>
                          <Link
                            to="/profile"
                            className="flex items-center space-x-3 px-4 py-2.5 hover:bg-gray-50 text-gray-700 hover:text-emerald-600 transition-colors"
                          >
                            <User className="h-4 w-4" />
                            <span className="text-sm font-medium">Account Settings</span>
                          </Link>
                          <Link
                            to="/notifications"
                            className="flex items-center space-x-3 px-4 py-2.5 hover:bg-gray-50 text-gray-700 hover:text-emerald-600 transition-colors relative"
                          >
                            <Bell className="h-4 w-4" />
                            <span className="text-sm font-medium">Notifications</span>
                            {unreadCount > 0 && (
                              <span className="absolute right-4 h-5 w-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-bold">
                                {unreadCount}
                              </span>
                            )}
                          </Link>
                        </div>
                        
                        <div className="border-t border-gray-100 pt-2">
                          <button
                            onClick={handleLogout}
                            className="flex items-center space-x-3 w-full px-4 py-2.5 hover:bg-red-50 text-red-600 hover:text-red-700 transition-colors rounded-lg mx-2"
                          >
                            <LogOut className="h-4 w-4" />
                            <span className="text-sm font-medium">Log Out</span>
                          </button>
                        </div>
                      </div>
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