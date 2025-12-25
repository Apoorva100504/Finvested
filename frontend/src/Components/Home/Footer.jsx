import React, { useState } from 'react';
import { FaDownload, FaMapMarkerAlt, FaCopyright, FaPhoneAlt, FaEnvelope, FaTimes } from 'react-icons/fa';

function Footer() {
  const [showAbout, setShowAbout] = useState(false);
  const [activePolicy, setActivePolicy] = useState(null);

  const handleDownloadClick = () => {
    window.open('https://play.google.com/store/apps/details?id=com.nextbillion.groww');
  };

  const policies = {
    privacy: {
      title: "Privacy Policy",
      content: `
        <div class="space-y-4">
          <p class="font-semibold text-gray-800 text-lg">Privacy Policy</p>
          <p class="text-sm text-gray-600">Last Updated: January 1, 2025</p>
          
          <div class="space-y-3">
            <p class="font-medium text-gray-800">Information We Collect</p>
            <p class="text-gray-700">We collect information that you provide directly to us, including:</p>
            <ul class="list-disc list-inside space-y-1 pl-4 text-gray-700">
              <li>Personal identification information (name, email address, phone number)</li>
              <li>Financial information (PAN, bank account details)</li>
              <li>Investment preferences and transaction history</li>
              <li>Device and usage information</li>
            </ul>
          </div>

          <div class="space-y-3">
            <p class="font-medium text-gray-800">How We Use Your Information</p>
            <ul class="list-disc list-inside space-y-1 pl-4 text-gray-700">
              <li>To provide, maintain, and improve our services</li>
              <li>To process your transactions and send you related information</li>
              <li>To send you technical notices, updates, security alerts</li>
              <li>To respond to your comments and questions</li>
              <li>To detect, prevent, and address technical issues</li>
            </ul>
          </div>

          <div class="space-y-3">
            <p class="font-medium text-gray-800">Data Security</p>
            <p class="text-gray-700">We implement appropriate technical and organizational security measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction.</p>
          </div>

          <div class="space-y-3">
            <p class="font-medium text-gray-800">Your Rights</p>
            <ul class="list-disc list-inside space-y-1 pl-4 text-gray-700">
              <li>Access your personal information</li>
              <li>Correct inaccurate or incomplete information</li>
              <li>Delete your personal information</li>
              <li>Object to processing of your personal information</li>
              <li>Data portability</li>
            </ul>
          </div>

          <div class="space-y-3">
            <p class="font-medium text-gray-800">Contact Us</p>
            <p class="text-gray-700">If you have any questions about this Privacy Policy, please contact us at privacy@finvested.in</p>
          </div>
        </div>
      `
    },
    terms: {
      title: "Terms & Conditions",
      content: `
        <div class="space-y-4">
          <p class="font-semibold text-gray-800 text-lg">Terms & Conditions</p>
          <p class="text-sm text-gray-600">Last Updated: January 1, 2025</p>
          
          <div class="space-y-3">
            <p class="font-medium text-gray-800">1. Acceptance of Terms</p>
            <p class="text-gray-700">By accessing and using Finvested's platform, you agree to be bound by these Terms and Conditions. If you do not agree with any part of these terms, you must not use our services.</p>
          </div>

          <div class="space-y-3">
            <p class="font-medium text-gray-800">2. Account Registration</p>
            <p class="text-gray-700">You must be at least 18 years old to create an account. You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account.</p>
          </div>

          <div class="space-y-3">
            <p class="font-medium text-gray-800">3. Investment Services</p>
            <ul class="list-disc list-inside space-y-1 pl-4 text-gray-700">
              <li>Finvested provides a platform for investing in mutual funds, stocks, and other financial instruments</li>
              <li>We do not provide investment advice or recommendations</li>
              <li>All investment decisions are made at your own discretion and risk</li>
              <li>Past performance is not indicative of future results</li>
            </ul>
          </div>

          <div class="space-y-3">
            <p class="font-medium text-gray-800">4. Fees and Charges</p>
            <p class="text-gray-700">Finvested charges zero commission on direct mutual funds and equity delivery trades. Standard transaction charges and statutory charges apply as per regulatory requirements.</p>
          </div>

          <div class="space-y-3">
            <p class="font-medium text-gray-800">5. Prohibited Activities</p>
            <ul class="list-disc list-inside space-y-1 pl-4 text-gray-700">
              <li>Engaging in fraudulent activities</li>
              <li>Violating any laws or regulations</li>
              <li>Interfering with the platform's operation</li>
              <li>Sharing your account credentials</li>
              <li>Using automated systems to access our services</li>
            </ul>
          </div>

          <div class="space-y-3">
            <p class="font-medium text-gray-800">6. Termination</p>
            <p class="text-gray-700">We reserve the right to terminate or suspend your account at any time for violation of these terms or for any other reason at our sole discretion.</p>
          </div>

          <div class="space-y-3">
            <p class="font-medium text-gray-800">7. Limitation of Liability</p>
            <p class="text-gray-700">Finvested shall not be liable for any direct, indirect, incidental, special, or consequential damages resulting from the use or inability to use our services.</p>
          </div>
        </div>
      `
    },
    disclaimer: {
      title: "Disclaimer",
      content: `
        <div class="space-y-4">
          <p class="font-semibold text-gray-800 text-lg">Disclaimer</p>
          <p class="text-sm text-gray-600">Last Updated: January 1, 2025</p>
          
          <div class="space-y-3">
            <p class="font-medium text-gray-800">Investment Risk Disclaimer</p>
            <p class="text-gray-700">Investing in securities market involves substantial risk. The value of investments may fluctuate and investors may lose their principal amount. Past performance of securities/instruments is not indicative of their future performance. Investors should consider their investment objectives and risks carefully before investing.</p>
          </div>

          <div class="space-y-3">
            <p class="font-medium text-gray-800">No Investment Advice</p>
            <p class="text-gray-700">Finvested is only an execution platform. We do not provide any investment advice, recommendations, or opinions about the suitability, value, or profitability of any particular investment or investment strategy. All investment decisions are made by you at your own discretion.</p>
          </div>

          <div class="space-y-3">
            <p class="font-medium text-gray-800">Market Information</p>
            <p class="text-gray-700">Market data, news, research, and other information available on our platform are provided for informational purposes only. While we strive to ensure accuracy, we do not guarantee the completeness, timeliness, or accuracy of such information.</p>
          </div>

          <div class="space-y-3">
            <p class="font-medium text-gray-800">Third-Party Content</p>
            <p class="text-gray-700">Our platform may contain links to third-party websites or services. We do not endorse and are not responsible for the content, accuracy, or practices of these third-party sites.</p>
          </div>

          <div class="space-y-3">
            <p class="font-medium text-gray-800">Technical Disclaimer</p>
            <p class="text-gray-700">While we strive to provide uninterrupted service, we do not guarantee that our platform will be available at all times without interruption. We are not liable for any losses due to technical failures, maintenance, or other interruptions.</p>
          </div>

          <div class="space-y-3">
            <p class="font-medium text-gray-800">Regulatory Compliance</p>
            <p class="text-gray-700">Finvested is registered with SEBI as a Stock Broker (Registration No. INZ000208238) and with AMFI as a Mutual Fund Distributor (ARN-161125). All transactions are executed through recognized stock exchanges and clearing corporations.</p>
          </div>

          <div class="space-y-3">
            <p class="font-medium text-gray-800">Tax Implications</p>
            <p class="text-gray-700">Investors are solely responsible for their tax liabilities arising from investments made through our platform. We recommend consulting with a tax advisor for tax-related matters.</p>
          </div>
        </div>
      `
    }
  };

  const closeModal = () => {
    setActivePolicy(null);
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
          <span>About Finvested</span>
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
              Finvested is India's largest Stock Broker with more than 1.4 crore active customers where users can find their investment solutions pertaining to mutual funds, stocks, US Stocks, ETFs, IPO, and FAQs, to invest their money without hassles.
            </p>
            <p className="leading-relaxed">
              Finvested objectively evaluates stocks and mutual funds and does not advise or recommend any stocks, mutual funds or portfolios. Investors shall invest at their own discretion, will and consent. Groww, at any time, does not guarantee fixed returns on the capital invested.
            </p>
            
            <div className="space-y-4">
              <p className="font-medium text-gray-900">Finvested helps investors -</p>
              <ul className="list-disc list-inside space-y-2 pl-4">
                <li className="leading-relaxed">By providing 100% paperless online free Demat and trading account opening</li>
                <li className="leading-relaxed">By providing an objective evaluation of products available on the platform</li>
                <li className="leading-relaxed">By being transparent about fees and charges involved while investing in a product</li>
                <li className="leading-relaxed">By offering decision-making assistance with technical analysis, charts, and company data</li>
              </ul>
            </div>

            <div className="space-y-4">
              <p className="font-semibold text-gray-900">SECURE TRANSACTIONS ON Finvested</p>
              <p className="leading-relaxed">
                All transactions on Finvested are safe and secure. Users can invest through SIP or Lumpsum using Netbanking through all supported banks. It uses BSE Star MF (Member code 11724) as the transaction platform.
              </p>
            </div>

            <div className="space-y-4">
              <p className="font-semibold text-gray-900">TRADE AND INVEST SECURELY WITH F</p>
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

        {/* Contact and Address Section */}
        <div className="mt-8 pt-8 border-t border-gray-300">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            
            {/* Address Section */}
            <div className="space-y-4">
              <h3 className="text-xl font-bold text-gray-900">Finvested</h3>
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
                    href="mailto:support@finvested.in" 
                    className="text-sm text-blue-600 hover:text-blue-800 transition-colors"
                  >
                    support@Finvested.in
                  </a>
                </div>
              </div>
            </div>

            {/* Download App Section */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">Download the App</h3>
              <button
                onClick={handleDownloadClick}
                className="px-5 py-2.5 text-sm font-semibold text-white bg-gradient-to-r from-aquaMintDark to-neonBlue rounded-xl hover:shadow-lg hover:shadow-neonBlue/30 hover:from-neonBlue hover:to-aquaMintDark active:scale-95 transition-all duration-200 shadow-md"
              >
                Get Finvested App
              </button>
              <p className="text-xs text-gray-600 mt-2">
                Available on iOS and Android
              </p>
            </div>

          </div>

          {/* Copyright and Policy Links Section */}
          <div className="mt-8 pt-8 border-t border-gray-300">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
              <div className="flex items-center space-x-2 text-gray-600">
                <FaCopyright className="w-4 h-4" />
                <span className="text-sm">2016-2025 Finvested. All rights reserved.</span>
              </div>
              
              <div className="flex flex-wrap gap-4 md:gap-6">
                <button
                  onClick={() => setActivePolicy('privacy')}
                  className="text-sm text-gray-600 hover:text-blue-600 transition-colors"
                >
                  Privacy Policy
                </button>
                <button
                  onClick={() => setActivePolicy('terms')}
                  className="text-sm text-gray-600 hover:text-blue-600 transition-colors"
                >
                  Terms & Conditions
                </button>
                <button
                  onClick={() => setActivePolicy('disclaimer')}
                  className="text-sm text-gray-600 hover:text-blue-600 transition-colors"
                >
                  Disclaimer
                </button>
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* Policy Modal */}
     {activePolicy && (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
    
    <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[80vh] overflow-hidden flex flex-col">

      {/* Header */}
      <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
        <h3 className="text-xl font-bold text-gray-800">
          {policies[activePolicy].title}
        </h3>
        <button
          onClick={closeModal}
          className="p-2 hover:bg-gray-100 rounded-full"
        >
          <FaTimes className="w-5 h-5 text-gray-500" />
        </button>
      </div>

      {/* Scrollable Content */}
      <div className="p-6 overflow-y-auto flex-1">
        <div
          dangerouslySetInnerHTML={{ __html: policies[activePolicy].content }}
          className="prose max-w-none"
        />
      </div>

      {/* Footer */}
      <div className="sticky bottom-0 bg-gray-50 border-t border-gray-200 px-6 py-4">
        <div className="flex justify-end">
          <button
            onClick={closeModal}
            className="px-6 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700"
          >
            Close
          </button>
        </div>
      </div>

    </div>
  </div>
)}

    </footer>
  );
}

export default Footer;