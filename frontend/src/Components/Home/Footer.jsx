import React, { useState } from 'react';
import hatImage from '../../assets/hat.png'; // Graduation cap image

function Footer() {
  const [showAbout, setShowAbout] = useState(false); // State to toggle

  return (
    <footer className="bg-gray-100 py-8 px-4">
      <div className="container mx-auto space-y-4">

        {/* Toggle button aligned left */}
        <button
          onClick={() => setShowAbout(!showAbout)}
          className="flex items-center space-x-2 text-black font-semibold text-lg hover:text-green-600 transition-colors"
        >
         
          <span>About Groww</span>
        </button>

        {/* Content to show/hide */}
        {showAbout && (
          <div className="mt-4 text-gray-700 px-2 space-y-4">
            <p>
              Groww is India's largest Stock Broker with more than 1.4 crore active customers where users can find their investment solutions pertaining to mutual funds, stocks, US Stocks, ETFs, IPO, and FAQs, to invest their money without hassles.
            </p>
            <p>
              Groww objectively evaluates stocks and mutual funds and does not advise or recommend any stocks, mutual funds or portfolios. Investors shall invest at their own discretion, will and consent. Groww, at any time, does not guarantee fixed returns on the capital invested.
            </p>
            <p>Groww helps investors -</p>
            <ul className="list-disc list-inside space-y-1">
              <li>By providing 100% paperless online free Demat and trading account opening</li>
              <li>By providing an objective evaluation of products available on the platform</li>
              <li>By being transparent about fees and charges involved while investing in a product</li>
              <li>By offering decision-making assistance with technical analysis, charts, and company data</li>
            </ul>
            <p><strong>SECURE TRANSACTIONS ON GROWW</strong></p>
            <p>
              All transactions on Groww are safe and secure. Users can invest through SIP or Lumpsum using Netbanking through all supported banks. It uses BSE Star MF (Member code 11724) as the transaction platform.
            </p>
            <p><strong>TRADE AND INVEST SECURELY WITH GROWW</strong></p>
            <ul className="list-disc list-inside space-y-1">
              <li>Invest in Kirby 50 (NSE) & Sensex (BSE) listed stocks</li>
              <li>Diversity across multiple stocks and other instruments</li>
              <li>Start SIP with any amount (as low as Rs. 500)</li>
              <li>Switch regular funds to direct funds</li>
              <li>Start automated monthly investments (SIP), and benefit from many more features</li>
            </ul>
          </div>
        )}
      </div>
    </footer>
  );
}

export default Footer;
