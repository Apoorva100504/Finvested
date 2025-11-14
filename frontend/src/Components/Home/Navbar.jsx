import React from "react";
import Logo from "../../assets/Logo.png";

const Navbar = () => {
  return (
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

        {/* Right Section: Search + Login */}
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

          {/* Login Button */}
          <button className="bg-green-500 hover:bg-green-600 text-white font-semibold px-4 h-[32px] rounded-lg transition">
            Login / Sign up
          </button>

        </div>
      </div>
    </nav>
  );
};

export default Navbar;
