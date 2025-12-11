import React, { useState } from 'react';
import { FaDownload, FaMapMarkerAlt, FaCopyright, FaPhoneAlt, FaEnvelope } from 'react-icons/fa';

function Footer() {
  const [showAbout, setShowAbout] = useState(false);

  const handleDownloadClick = () => {
    // Navigate to Groww download link
    window.open('https://play.google.com/store/apps/details?id=com.nextbillion.groww');
  };

  return (
    <footer className="bg-gray-100 py-8 px-4 border-t border-gray-300">
      <div className="container mx-auto space-y-8 max-w-6xl">
        
        {/* Toggle button */}
        <button
          onClick={() => setShowAbout(!showAbout)}
          className="flex items-center space-x-2 text-black font-semibold text-lg hover:text-blue-600 transition-colors duration-200 group"
        >
          <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center group-hover:bg-blue-700 transition-colors duration-200">
            <span className="text-white font-bold">?</span>
          </div>
          <span>About Groww</span>
          <svg 
            className={`w-4 h-4 transform transition-transform duration-200 ${showAbout ? 'rotate-180' : ''}`} 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        {/* About content */}
        {showAbout && (
          <div className="mt-6 text-gray-700 px-4 space-y-6 bg-gray-100 p-6 rounded-lg border border-gray-200 shadow-sm">
            <p className="leading-relaxed">
              Groww is India's largest Stock Broker with more than 1.4 crore active customers where users can find their investment solutions pertaining to mutual funds, stocks, US Stocks, ETFs, IPO, and FAQs, to invest their money without hassles.
            </p>
            <p className="leading-relaxed">
              Groww objectively evaluates stocks and mutual funds and does not advise or recommend any stocks, mutual funds or portfolios. Investors shall invest at their own discretion, will and consent. Groww, at any time, does not guarantee fixed returns on the capital invested.
            </p>
            
            <div className="space-y-4">
              <p className="font-medium text-gray-900">Groww helps investors -</p>
              <ul className="list-disc list-inside space-y-2 pl-4">
                <li className="leading-relaxed">By providing 100% paperless online free Demat and trading account opening</li>
                <li className="leading-relaxed">By providing an objective evaluation of products available on the platform</li>
                <li className="leading-relaxed">By being transparent about fees and charges involved while investing in a product</li>
                <li className="leading-relaxed">By offering decision-making assistance with technical analysis, charts, and company data</li>
              </ul>
            </div>

            <div className="space-y-4">
              <p className="font-semibold text-gray-900">SECURE TRANSACTIONS ON GROWW</p>
              <p className="leading-relaxed">
                All transactions on Groww are safe and secure. Users can invest through SIP or Lumpsum using Netbanking through all supported banks. It uses BSE Star MF (Member code 11724) as the transaction platform.
              </p>
            </div>

            <div className="space-y-4">
              <p className="font-semibold text-gray-900">TRADE AND INVEST SECURELY WITH GROWW</p>
              <ul className="list-disc list-inside space-y-2 pl-4">
                <li className="leading-relaxed">Invest in Nifty 50 (NSE) & Sensex (BSE) listed stocks</li>
                <li className="leading-relaxed">Diversify across multiple stocks and other instruments</li>
                <li className="leading-relaxed">Start SIP with any amount (as low as Rs. 500)</li>
                <li className="leading-relaxed">Switch regular funds to direct funds</li>
                <li className="leading-relaxed">Start automated monthly investments (SIP), and benefit from many more features</li>
              </ul>
            </div>
          </div>
        )}

        {/* Contact and Address Section - Mimicking the screenshot */}
        <div className="mt-8 pt-8 border-t border-gray-300">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            
            {/* Address Section */}
            <div className="space-y-4">
              <h3 className="text-xl font-bold text-gray-900">Groww</h3>
              <div className="space-y-2 text-gray-700">
                <div className="flex items-start space-x-3">
                  <FaMapMarkerAlt className="w-4 h-4 text-gray-500 mt-1 flex-shrink-0" />
                  <p className="text-sm leading-relaxed">
                    Vaishnavi Tech Park, South Tower, 3rd Floor<br />
                    Sarjapur Main Road, Bellandur, Bengaluru – 560103<br />
                    Karnataka
                  </p>
                </div>
              </div>
            </div>

            {/* Contact Us Section */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">Contact Us</h3>
              <div className="space-y-2">
                <div className="flex items-center space-x-3">
                  <FaPhoneAlt className="w-4 h-4 text-gray-500" />
                  <a 
                    href="tel:+18004198999" 
                    className="text-sm text-blue-600 hover:text-blue-800 transition-colors"
                  >
                    +1 800 419 8999
                  </a>
                </div>
                <div className="flex items-center space-x-3">
                  <FaEnvelope className="w-4 h-4 text-gray-500" />
                  <a 
                    href="mailto:support@groww.in" 
                    className="text-sm text-blue-600 hover:text-blue-800 transition-colors"
                  >
                    support@groww.in
                  </a>
                </div>
              </div>
            </div>

            {/* Download App Section */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">Download the App</h3>
              <button
                onClick={handleDownloadClick}
               
              >
               
                <span className="px-5 py-2.5 text-sm font-semibold text-white bg-gradient-to-r from-aquaMintDark to-neonBlue 
             rounded-xl hover:shadow-lg hover:shadow-neonBlue/30 hover:from-neonBlue hover:to-aquaMintDark 
             active:scale-95 transition-all duration-200 shadow-md">Get Groww App</span>
              </button>
              <p className="text-xs text-gray-600 mt-2">
                Available on iOS and Android
              </p>
            </div>

          </div>

          {/* Copyright Section */}
          <div className="mt-8 pt-8 border-t border-gray-300">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
              <div className="flex items-center space-x-2 text-gray-600">
                <FaCopyright className="w-4 h-4" />
                <span className="text-sm">2016-2025 Groww. All rights reserved.</span>
              </div>
              
              <div className="flex space-x-6">
                <a 
                  href="https://groww.in/privacy" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-sm text-gray-600 hover:text-blue-600 transition-colors"
                >
                  Privacy Policy
                </a>
                <a 
                  href="https://groww.in/terms" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-sm text-gray-600 hover:text-blue-600 transition-colors"
                >
                  Terms & Conditions
                </a>
                <a 
                  href="https://groww.in/disclaimer" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-sm text-gray-600 hover:text-blue-600 transition-colors"
                >
                  Disclaimer
                </a>
              </div>
            </div>
          </div>
        </div>

      </div>
    </footer>
  );
}

export default Footer;