// Navbar.jsx
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Logo from "../../assets/Logo.png";
import LoginModal from "../login/LoginModal.jsx";
import Dashboard from "../Account/Dashboard.jsx";

const Navbar = () => {
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState("login");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userEmail, setUserEmail] = useState("");
  const [isDashboardModalOpen, setIsDashboardModalOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

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
  setIsLoggedIn(false); // optional
  setUserEmail("");
  setIsDashboardModalOpen(false);

  window.dispatchEvent(new Event("userLoggedOut")); // important!
};



  const toggleDashboardModal = () => {
    setIsDashboardModalOpen((prev) => !prev);
  };

  return (
    <>
      <nav className={`bg-white shadow-lg w-full fixed top-0 left-0 z-50 flex items-center h-16 transition-all duration-300 ${scrolled ? 'shadow-xl' : 'shadow-md'}`}>
        <div className="w-full px-4 sm:px-6 md:px-8 lg:px-32 flex justify-between items-center h-full">
          {/* Left Section: Logo + Brand */}
          <Link
            to="/"
            className="flex items-center space-x-3 h-full group"
          >
            <img src={Logo} alt="Groww Logo" className="h-8 transition-transform duration-300 group-hover:scale-105 " />
            <span className="text-xl font-bold text-gray-900 tracking-tight">Groww</span>
          </Link>

          {/* Middle Section: Nav Links */}
          <div className="hidden md:flex items-center space-x-8">
            <a href="#" className="text-gray-700 hover:text-green-600 transition-colors duration-200 font-medium text-sm py-2 px-3 rounded-lg hover:bg-green-50 group relative">
              Stocks
              <span className="absolute bottom-1 left-1/2 transform -translate-x-1/2 w-0 group-hover:w-4/5 h-0.5 bg-green-500 transition-all duration-300"></span>
            </a>
            <a href="#" className="text-gray-700 hover:text-green-600 transition-colors duration-200 font-medium text-sm py-2 px-3 rounded-lg hover:bg-green-50 group relative">
              F&O
              <span className="absolute bottom-1 left-1/2 transform -translate-x-1/2 w-0 group-hover:w-4/5 h-0.5 bg-green-500 transition-all duration-300"></span>
            </a>
            <a href="#" className="text-gray-700 hover:text-green-600 transition-colors duration-200 font-medium text-sm py-2 px-3 rounded-lg hover:bg-green-50 group relative">
              Mutual Funds
              <span className="absolute bottom-1 left-1/2 transform -translate-x-1/2 w-0 group-hover:w-4/5 h-0.5 bg-green-500 transition-all duration-300"></span>
            </a>
            <a href="#" className="text-gray-700 hover:text-green-600 transition-colors duration-200 font-medium text-sm py-2 px-3 rounded-lg hover:bg-green-50 group relative">
              More
              <span className="absolute bottom-1 left-1/2 transform -translate-x-1/2 w-0 group-hover:w-4/5 h-0.5 bg-green-500 transition-all duration-300"></span>
            </a>
          </div>

          {/* Right Section: Search + Login/Signup or User */}
          <div className="flex items-center h-full space-x-3 md:space-x-4">
            {/* Search Box */}
            <div className="relative">
              <div className="hidden md:block relative group">
                <span className="absolute left-3.5 top-1/2 transform -translate-y-1/2 text-gray-400">
                  <svg
                    className="h-4 w-4"
                    fill="none"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                  >
                    <path d="M21 21l-6-6m2-5a7 7 0 1 1-14 0 7 7 0 0 1 14 0z" />
                  </svg>
                </span>

                <input
                  type="text"
                  placeholder="Search for stocks, ETFs, & more"
                  className="h-10 pl-10 pr-24 rounded-xl border border-gray-200 
                  focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent 
                  w-72 transition-all duration-200 bg-gray-50 focus:bg-white shadow-sm"
                />

                <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 text-xs font-medium px-2 py-1 border border-gray-300 rounded-lg bg-white">
                  Ctrl+K
                </span>
              </div>

              {/* Mobile search icon */}
              <button className="md:hidden p-2 rounded-lg hover:bg-gray-100">
                <svg
                  className="h-5 w-5 text-gray-600"
                  fill="none"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                >
                  <path d="M21 21l-6-6m2-5a7 7 0 1 1-14 0 7 7 0 0 1 14 0z" />
                </svg>
              </button>
            </div>

            {/* Conditional Right Buttons */}
            {!isLoggedIn ? (
              <div className="flex items-center space-x-3">
                <button
                  onClick={openLoginModal}
                  className="bg-white border border-green-600 hover:bg-green-600 hover:text-white text-green-600 font-semibold px-5 h-10 rounded-xl transition-all duration-200 hover:shadow-md text-sm shadow-sm"
                >
                  Login
                </button>

                <button
                  onClick={openSignupModal}
                  className="bg-green-600 hover:bg-green-700 text-white font-semibold px-5 h-10 rounded-xl transition-all duration-200 hover:shadow-lg hover:shadow-green-200 text-sm shadow-md"
                >
                  Sign Up
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-5">
                {/* Notification Icon */}
                <button className="relative p-2 rounded-xl hover:bg-gray-100 transition-colors duration-200 group">
                  <svg
                    className="h-6 w-6 text-gray-700 group-hover:text-green-600 transition-colors"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M15 17h5l-1.405-1.405A2.032 2.032 0 0 1 18 14.158V11a6 6 0 1 0-12 0v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 1 1-6 0v-1m6 0H9"
                    />
                  </svg>
                  <span className="absolute top-1.5 right-1.5 h-2.5 w-2.5 bg-red-500 rounded-full ring-2 ring-white"></span>
                </button>

                {/* User Icon - triggers dashboard modal */}
                <div
                  className="flex items-center space-x-3 cursor-pointer group p-1.5 pr-3 rounded-xl hover:bg-gray-100 transition-all duration-200"
                  onClick={toggleDashboardModal}
                >
                  <div className="h-10 w-10 bg-gradient-to-br from-green-500 to-emerald-600 text-white rounded-full flex items-center justify-center font-bold text-base shadow-sm group-hover:shadow-md transition-all duration-300 group-hover:scale-105">
                   {userEmail ? userEmail.charAt(0).toUpperCase() : "U"}
                  </div>
                  <div className="hidden lg:flex flex-col items-start">
                    <span className="text-xs text-gray-500 font-medium">My Account</span>
                    <span className="text-sm font-semibold text-gray-800 truncate max-w-[140px]">
                     {userEmail ? userEmail.split('@')[0] : "User"}
                    </span>
                  </div>
                  <svg 
                    className={`h-5 w-5 text-gray-400 transition-transform duration-300 ${isDashboardModalOpen ? 'rotate-180' : ''}`}
                    fill="none" 
                    stroke="currentColor" 
                    strokeWidth="2" 
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
            )}

            {/* Mobile menu button */}
            <button className="md:hidden p-2 rounded-xl hover:bg-gray-100">
              <svg className="h-6 w-6 text-gray-700" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
      </nav>

      {/* Add a spacer div with the exact height of the navbar (64px = 16 * 4) */}
     

      {/* Login Modal */}
      <LoginModal isOpen={isLoginModalOpen} mode={modalMode} onClose={closeModal} />

      {/* Dashboard Modal */}
      <Dashboard
        isDashboardModalOpen={isDashboardModalOpen}
        onToggleDashboardModal={toggleDashboardModal}
      />
    </>
  );
};

export default Navbar;