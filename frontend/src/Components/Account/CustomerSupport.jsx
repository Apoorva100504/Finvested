import React, { useState } from "react";

const topics = [
  { id: "payments", label: "Payments & Withdrawals" },
  { id: "stocks-fno-ipo", label: "Stocks & F&O" },
  { id: "mutual-funds", label: "Mutual Funds" },
  { id: "my-account", label: "My Account" },
  { id: "complete-setup", label: "Complete Setup" },
  { id: "us-stocks", label: "US Stocks" },
];

const articlesByTopic = {
  payments: [
    {
      id: "all-transactions",
      icon: "📊",
      title: "All Transactions",
      subtitle: "View all wallet loads, withdrawals, and charges",
      details: `• Filter by date and status\n• Check bank SMS if missing\n• Share reference ID for support`,
    },
    {
      id: "withdrawal",
      icon: "💰",
      title: "Withdrawal",
      subtitle: "Withdraw money to your bank account",
      details: `1. Funds → Withdraw\n2. Enter amount & confirm OTP\n3. Credits in 1-2 working days\n\nCommon issues: Wrong bank details, insufficient balance`,
    },
    {
      id: "account-balance",
      icon: "💳",
      title: "Account Balance",
      subtitle: "Understanding different balance types",
      details: `• Available: Money you can use\n• Ledger: Total including unsettled\n• Blocked: Margin for positions`,
    },
    {
      id: "instant-pay",
      icon: "⚡",
      title: "Instant Pay",
      subtitle: "Add money instantly via UPI",
      details: `• Usually reflects within seconds\n• During peak times may take longer\n• Contact support if issues persist`,
    },
  ],
  "stocks-fno-ipo": [
    {
      id: "order-types",
      icon: "📈",
      title: "Order Types",
      subtitle: "Market, Limit, SL orders",
      details: `• Market: Best available price\n• Limit: At your set price\n• SL: Stop-loss orders`,
    },
  ],
  "mutual-funds": [
    {
      id: "sip",
      icon: "📅",
      title: "SIP Management",
      subtitle: "Create, pause or cancel SIPs",
      details: `• Manage from Mutual Funds → SIPs\n• Changes reflect next installment\n• Check cut-off times`,
    },
  ],
  "my-account": [
    {
      id: "security",
      icon: "🔐",
      title: "Login & Security",
      subtitle: "Change password, enable 2FA",
      details: `• Profile → Security\n• Change password anytime\n• Enable 2FA for safety`,
    },
  ],
  "complete-setup": [
    {
      id: "kyc",
      icon: "📋",
      title: "KYC Verification",
      subtitle: "Documents and setup time",
      details: `• PAN, Aadhaar, bank proof\n• Ensure name matches PAN\n• Instant or 24-48 hours`,
    },
  ],
  "us-stocks": [
    {
      id: "us-account",
      icon: "🇺🇸",
      title: "US Stocks",
      subtitle: "Onboarding and funding",
      details: `• Additional KYC required\n• USD funding route\n• Check app for options`,
    },
  ],
};

const CustomerSupport = () => {
  const [selectedTopic, setSelectedTopic] = useState("payments");
  const topicArticles = articlesByTopic[selectedTopic] || [];
  const [selectedArticle, setSelectedArticle] = useState(
    topicArticles[0] || null
  );

  const handleTopicChange = (topicId) => {
    setSelectedTopic(topicId);
    const list = articlesByTopic[topicId] || [];
    setSelectedArticle(list[0] || null);
  };

  return (
    <div className="flex min-h-screen bg-gray-50 px-24">
      {/* Left sidebar - Clean professional design */}
      <aside className="w-64 bg-white border-r border-gray-200 shadow-sm">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center gap-3 mb-1">
            <div className="h-8 w-8 bg-gray-900 rounded-lg flex items-center justify-center">
              <span className="text-white text-sm font-semibold">?</span>
            </div>
            <div>
              <h1 className="text-lg font-semibold text-gray-900">Help Center</h1>
              <p className="text-xs text-gray-500 mt-0.5">Support & Documentation</p>
            </div>
          </div>
        </div>

        <div className="p-4">
          <nav className="mb-8">
            <div className="space-y-1">
              <button className="w-full text-left px-3 py-2.5 text-sm text-gray-700 hover:bg-gray-50 rounded-lg flex items-center gap-3 transition-colors">
                <span className="text-gray-600">🏠</span>
                <span className="font-medium">Home</span>
              </button>
              <button className="w-full text-left px-3 py-2.5 text-sm text-gray-700 hover:bg-gray-50 rounded-lg flex items-center gap-3 transition-colors">
                <span className="text-gray-600">📄</span>
                <span className="font-medium">Statements</span>
              </button>
            </div>
          </nav>

          <div>
            <h3 className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-4 px-2">
              Help Topics
            </h3>
            <div className="space-y-1">
              {topics.map((t) => (
                <button
                  key={t.id}
                  onClick={() => handleTopicChange(t.id)}
                  className={`w-full text-left px-3 py-3 text-sm rounded-lg transition-all duration-200 ${
                    selectedTopic === t.id
                      ? "bg-blue-50 text-blue-700 font-medium border-l-3 border-blue-600 shadow-sm"
                      : "text-gray-700 hover:bg-gray-50 hover:text-gray-900 hover:translate-x-1"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span>{t.label}</span>
                    {selectedTopic === t.id && (
                      <svg className="h-4 w-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                      </svg>
                    )}
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 p-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Support Articles</h2>
              <p className="text-gray-600 mt-2">
                Browse help articles by topic or search for specific questions
              </p>
            </div>
            <div className="relative w-80">
              <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                <svg className="h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 1 1-14 0 7 7 0 0 1 14 0z" />
                </svg>
              </div>
              <input
                type="text"
                placeholder="Search articles..."
                className="w-full pl-10 pr-4 py-3 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm"
                disabled
              />
            </div>
          </div>

          {/* Current topic indicator */}
          <div className="flex items-center gap-3 mb-6">
            <div className="h-2 w-2 bg-blue-600 rounded-full"></div>
            <span className="text-sm font-medium text-gray-900">
              {topics.find((t) => t.id === selectedTopic)?.label}
            </span>
            <span className="text-xs text-gray-500">
              • {topicArticles.length} articles
            </span>
          </div>
        </div>

        <div className="flex gap-8">
          {/* Article list */}
          <div className="w-1/2">
            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
              <div className="border-b border-gray-200 px-6 py-4">
                <h3 className="text-base font-semibold text-gray-900">Frequently Asked Questions</h3>
                <p className="text-sm text-gray-500 mt-1">Select an article to view details</p>
              </div>
              <div className="divide-y divide-gray-100">
                {topicArticles.length === 0 ? (
                  <div className="px-6 py-12 text-center">
                    <div className="text-4xl mb-4 text-gray-300">📭</div>
                    <p className="text-sm text-gray-500">No articles available for this topic</p>
                  </div>
                ) : (
                  topicArticles.map((a) => (
                    <button
                      key={a.id}
                      onClick={() => setSelectedArticle(a)}
                      className={`w-full text-left p-5 transition-all duration-200 hover:bg-gray-50 ${
                        selectedArticle?.id === a.id 
                          ? "bg-blue-50 border-l-3 border-blue-600" 
                          : "border-l-3 border-transparent"
                      }`}
                    >
                      <div className="flex items-start gap-4">
                        <div className="text-xl bg-gray-100 p-2 rounded-lg text-gray-700">
                          {a.icon}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-start justify-between">
                            <h4 className="text-sm font-semibold text-gray-900 mb-1.5">
                              {a.title}
                            </h4>
                            {selectedArticle?.id === a.id && (
                              <div className="text-blue-600">
                                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                                </svg>
                              </div>
                            )}
                          </div>
                          <p className="text-xs text-gray-600 leading-relaxed">
                            {a.subtitle}
                          </p>
                        </div>
                      </div>
                    </button>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* Article details */}
          <div className="w-1/2">
            {selectedArticle ? (
              <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm h-full flex flex-col">
                <div className="border-b border-gray-200 px-6 py-5 bg-gray-50">
                  <div className="flex items-start gap-4">
                    <div className="text-2xl bg-gray-100 p-3 rounded-lg text-gray-700">
                      {selectedArticle.icon}
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900">
                        {selectedArticle.title}
                      </h3>
                      <p className="text-sm text-gray-600 mt-1">
                        {selectedArticle.subtitle}
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="flex-1 p-6">
                  <div className="mb-6">
                    <h4 className="text-sm font-medium text-gray-900 mb-4">Article Details</h4>
                    <div className="text-gray-700 whitespace-pre-line text-sm leading-relaxed bg-gray-50 p-5 rounded-lg border border-gray-100">
                      {selectedArticle.details.trim()}
                    </div>
                  </div>
                  
                  <div className="pt-4 border-t border-gray-200">
                    <h4 className="text-sm font-medium text-gray-900 mb-3">Was this helpful?</h4>
                    <div className="flex gap-2">
                      <button className="px-4 py-2 text-sm border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
                        👍 Yes
                      </button>
                      <button className="px-4 py-2 text-sm border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
                        👎 No
                      </button>
                    </div>
                  </div>
                </div>
                
                <div className="border-t border-gray-200 px-6 py-4 bg-gray-50">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Need more assistance?</p>
                    </div>
                    <button className="px-4 py-2.5 text-sm bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors font-medium">
                      Contact 91+1234567890
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-xl border border-gray-200 p-12 text-center shadow-sm h-full flex flex-col items-center justify-center">
                <div className="text-5xl mb-4 text-gray-300">📚</div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">Select an Article</h3>
                <p className="text-sm text-gray-500 max-w-sm">
                  Choose from the list on the left to view detailed information and instructions
                </p>
              </div>
            )}
          </div>
        </div>

       
      </main>
    </div>
  );
};

export default CustomerSupport;