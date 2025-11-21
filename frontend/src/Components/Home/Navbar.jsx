// Navbar.jsx
import React, { useState, useEffect } from "react";
import Logo from "../../assets/Logo.png";
import LoginModal from "../login/LoginModal";
import Dashboard from "../Account/Dashboard.jsx"; // Dashboard component

const Navbar = () => {
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState('login'); // 'login' or 'signup'
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userEmail, setUserEmail] = useState('');
  const [isDashboardModalOpen, setIsDashboardModalOpen] = useState(false);

  // Check login state on mount
  useEffect(() => {
    const loggedIn = localStorage.getItem('isLoggedIn') === 'true';
    const email = localStorage.getItem('userEmail') || '';
    setIsLoggedIn(loggedIn);
    setUserEmail(email);

    // Listen to login event
    const handleLoginEvent = (e) => {
      setIsLoggedIn(true);
      setUserEmail(e.detail.email);
    };

    window.addEventListener('userLoggedIn', handleLoginEvent);
    return () => window.removeEventListener('userLoggedIn', handleLoginEvent);
  }, []);

  const openLoginModal = () => {
    setModalMode('login');
    setIsLoginModalOpen(true);
  };

  const openSignupModal = () => {
    setModalMode('signup');
    setIsLoginModalOpen(true);
  };

  const closeModal = () => setIsLoginModalOpen(false);

  const handleLogout = () => {
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('userEmail');
    setIsLoggedIn(false);
    setUserEmail('');
    setIsDashboardModalOpen(false);
  };

  const toggleDashboardModal = () => {
    setIsDashboardModalOpen(prev => !prev);
  };

  return (
    <>
      <nav className="bg-white shadow-md w-full fixed top-0 left-0 z-50 flex items-center h-16">
        <div className="w-full px-32 flex justify-between items-center h-full whitespace-nowrap overflow-x-auto">

          {/* Left Section: Logo + Brand */}
          <div className="flex items-center space-x-2 h-full">
            <img src={Logo} alt="Groww Logo" className="h-6" />
            <span className="text-lg font-bold text-gray-800">Groww</span>
          </div>

          {/* Middle Section: Nav Links */}
          <div className="flex items-center space-x-6">
            <a href="#" className="text-gray-600 hover:text-green-500 transition">Stocks</a>
            <a href="#" className="text-gray-600 hover:text-green-500 transition">F&O</a>
            <a href="#" className="text-gray-600 hover:text-green-500 transition">Mutual Funds</a>
            <a href="#" className="text-gray-600 hover:text-green-500 transition">More</a>
          </div>

          {/* Right Section: Search + Login/Signup or User */}
          <div className="flex items-center h-full">

            {/* Search Box */}
            <div className="relative mr-4 h-full flex items-center">
              <span className="absolute left-3">
                <svg
                  className="h-4 w-4 text-gray-500"
                  fill="none"
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
                placeholder="Search Groww..."
                className="h-[32px] pl-8 pr-12 rounded-lg border border-gray-300 
                focus:outline-none focus:ring-2 focus:ring-green-500 w-64"
              />

              <span className="absolute right-2 text-gray-500 text-xs">
                Ctrl+K
              </span>
            </div>

            {/* Conditional Right Buttons */}
            {!isLoggedIn ? (
              <>
                <button
                  onClick={openLoginModal}
                  className="bg-white border border-green-500 hover:bg-green-50 text-green-500 font-semibold px-4 h-[32px] rounded-lg transition mr-2"
                >
                  Login
                </button>

                <button
                  onClick={openSignupModal}
                  className="bg-green-500 hover:bg-green-600 text-white font-semibold px-4 h-[32px] rounded-lg transition"
                >
                  Sign Up
                </button>
              </>
            ) : (
              <div className="flex items-center space-x-4">
                {/* Notification Icon */}
                <button className="relative">
                  <svg
                    className="h-6 w-6 text-gray-700"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0 1 18 14.158V11a6 6 0 1 0-12 0v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 1 1-6 0v-1m6 0H9" />
                  </svg>
                  <span className="absolute -top-1 -right-1 h-2 w-2 bg-red-500 rounded-full"></span>
                </button>

                {/* User Icon - triggers dashboard modal */}
                <div className="flex items-center space-x-2 cursor-pointer" onClick={toggleDashboardModal}>
                  <div className="h-8 w-8 bg-green-500 text-white rounded-full flex items-center justify-center font-bold">
                    {userEmail.charAt(0).toUpperCase()}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </nav>

      {/* Login Modal */}
      <LoginModal
        isOpen={isLoginModalOpen}
        mode={modalMode}
        onClose={closeModal}
      />

      {/* Dashboard Modal */}
      <Dashboard
        isDashboardModalOpen={isDashboardModalOpen}
        onToggleDashboardModal={toggleDashboardModal}
      />
    </>
  );
};

export default Navbar;
