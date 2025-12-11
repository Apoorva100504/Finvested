import React, { useState } from "react";

const FundamentalsSection = ({ fundamentals }) => {
  const [hoveredMetric, setHoveredMetric] = useState(null);
  const [hoveredFinancial, setHoveredFinancial] = useState(null);

  // ---------- FORMATTERS ----------
  const formatCurrency = (value) => {
    const num = Number(value);
    if (!num || isNaN(num)) return "₹0.00";

    if (num >= 10000000) return `₹${(num / 10000000).toFixed(2)} Cr`;
    if (num >= 100000) return `₹${(num / 100000).toFixed(2)} L`;

    return `₹${num.toLocaleString("en-IN", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;
  };

  const formatPercent = (value) => {
    const num = Number(value);
    if (!num || isNaN(num)) return "0.00%";
    const isPositive = num >= 0;
    const colorClass = isPositive ? 'text-green-600' : 'text-red-600';
    return <span className={colorClass}>{`${num.toFixed(2)}%`}</span>;
  };

  const formatDecimal = (value) => {
    const num = Number(value);
    if (!num || isNaN(num)) return "N/A";
    return num.toFixed(2);
  };

  // Get color based on value for metrics
  const getMetricColor = (label, value) => {
    const num = Number(value);
    if (isNaN(num)) return 'text-gray-700';
    
    switch(label) {
      case 'P/E Ratio (TTM)':
        return num < 20 ? 'text-green-600' : num < 30 ? 'text-yellow-600' : 'text-red-600';
      case 'P/B Ratio':
        return num < 2 ? 'text-green-600' : num < 4 ? 'text-yellow-600' : 'text-red-600';
      case 'ROE':
        return num > 15 ? 'text-green-600' : num > 8 ? 'text-yellow-600' : 'text-red-600';
      case 'Dividend Yield':
        return num > 3 ? 'text-green-600' : num > 1 ? 'text-yellow-600' : 'text-red-600';
      default:
        return 'text-gray-900';
    }
  };

  // Get icon based on label
  const getMetricIcon = (label) => {
    const iconMap = {
      'Market Cap': '💼',
      'P/E Ratio (TTM)': '📊',
      'P/B Ratio': '📈',
      'Industry P/E': '🏢',
      'ROE': '💰',
      'EPS (TTM)': '📋',
      'Dividend Yield': '🎁',
      'Book Value': '📚',
      'Revenue': '📈',
      'Profit': '💸',
      'Net Worth': '🏦'
    };
    return iconMap[label] || '📊';
  };

  // Get hover gradient based on metric type
  const getHoverGradient = (label) => {
    if (label.includes('Ratio') || label.includes('P/E')) return 'from-blue-50 to-cyan-50';
    if (label.includes('Yield') || label.includes('ROE')) return 'from-green-50 to-emerald-50';
    if (label.includes('Market') || label.includes('Value')) return 'from-purple-50 to-indigo-50';
    if (label.includes('Revenue') || label.includes('Profit')) return 'from-amber-50 to-orange-50';
    return 'from-gray-50 to-slate-50';
  };

  // ---------- DATA ARRAYS ----------
  const fundamentalData = [
    { label: "Market Cap", value: formatCurrency(fundamentals?.marketCap), raw: fundamentals?.marketCap },
    { label: "P/E Ratio (TTM)", value: formatDecimal(fundamentals?.peRatio), raw: fundamentals?.peRatio },
    { label: "P/B Ratio", value: formatDecimal(fundamentals?.pbRatio), raw: fundamentals?.pbRatio },
    { label: "Industry P/E", value: formatDecimal(fundamentals?.industryPE), raw: fundamentals?.industryPE },
    { label: "ROE", value: formatPercent(fundamentals?.roe), raw: fundamentals?.roe },
    { label: "EPS (TTM)", value: formatDecimal(fundamentals?.eps), raw: fundamentals?.eps },
    { label: "Dividend Yield", value: formatPercent(fundamentals?.dividendYield), raw: fundamentals?.dividendYield },
    { label: "Book Value", value: formatCurrency(fundamentals?.bookValue), raw: fundamentals?.bookValue },
  ];

  const financialData = [
    { label: "Revenue", value: formatCurrency(fundamentals?.revenue), raw: fundamentals?.revenue },
    { label: "Profit", value: formatCurrency(fundamentals?.profit), raw: fundamentals?.profit },
    { label: "Net Worth", value: formatCurrency(fundamentals?.netWorth), raw: fundamentals?.netWorth },
  ];

  // Calculate percentage growth if previous values exist
  const calculateGrowth = () => {
    if (!fundamentals?.previousRevenue || !fundamentals?.revenue) return null;
    const growth = ((fundamentals.revenue - fundamentals.previousRevenue) / fundamentals.previousRevenue) * 100;
    return growth.toFixed(2);
  };

  const revenueGrowth = calculateGrowth();

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 mb-6 transition-all duration-300 hover:shadow-xl">
      {/* Header with Gradient */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold bg-gray-700 bg-clip-text text-transparent mb-4">
          Fundamentals
        </h2>
        
        {/* Summary Card */}
        <div className="bg-gradient-to-r from-gray-50 to-white p-4 rounded-lg border border-gray-100 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-100 to-cyan-100 rounded-lg flex items-center justify-center">
                <span className="text-lg">📊</span>
              </div>
              <div>
                <div className="text-sm text-gray-500">Overall Valuation</div>
                <div className="text-xl font-bold text-gray-900">
                  {formatCurrency(fundamentals?.marketCap || 0)}
                </div>
              </div>
            </div>
            
            {revenueGrowth && (
              <div className={`px-3 py-1.5 rounded-full text-sm font-medium ${
                revenueGrowth > 0 
                  ? 'bg-green-100 text-green-700' 
                  : 'bg-red-100 text-red-700'
              }`}>
                {revenueGrowth > 0 ? '↗' : '↘'} {Math.abs(revenueGrowth)}% YoY
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Fundamentals Grid with Cards */}
      <div className="mb-10">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <span>Key Metrics</span>
          <span className="text-sm text-gray-400">• Updated daily</span>
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {fundamentalData.map((item, idx) => {
            const isHovered = hoveredMetric === item.label;
            const colorClass = getMetricColor(item.label, item.raw);
            const hoverGradient = getHoverGradient(item.label);
            
            return (
              <div
                key={idx}
                className={`relative p-4 rounded-xl border border-gray-200 transition-all duration-300 
                          hover:scale-[1.02] hover:shadow-lg hover:border-transparent
                          ${isHovered ? 'scale-[1.02] shadow-lg border-transparent' : ''}
                          bg-gradient-to-br from-white to-gray-50 hover:${hoverGradient}`}
                onMouseEnter={() => setHoveredMetric(item.label)}
                onMouseLeave={() => setHoveredMetric(null)}
              >
                {/* Hover Top Bar */}
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-gray-200 to-transparent opacity-0 transition-opacity duration-300 hover:opacity-100 rounded-t-xl"></div>
                
                {/* Content */}
                <div className="relative">
                  <div className="flex items-center justify-between mb-3">
                    <div className="text-lg">{getMetricIcon(item.label)}</div>
                    <div className={`w-2 h-2 rounded-full ${
                      item.label.includes('Ratio') ? 'bg-blue-400' :
                      item.label.includes('Yield') ? 'bg-green-400' :
                      item.label.includes('Value') ? 'bg-purple-400' : 'bg-gray-400'
                    } ${isHovered ? 'animate-pulse' : ''}`}></div>
                  </div>
                  
                  <div className="text-xs text-gray-500 mb-1 transition-colors duration-300 hover:text-gray-700">
                    {item.label}
                  </div>
                  
                  <div className={`text-sm font-bold transition-all duration-300 hover:scale-105 ${colorClass}`}>
                    {item.value}
                  </div>
                  
                  {/* Hover Indicator Arrow */}
                  <div className="absolute -right-2 top-1/2 transform -translate-y-1/2 opacity-0 transition-all duration-300 hover:opacity-100 hover:right-0">
                    <div className="w-4 h-4 text-gray-300 transition-colors duration-300 hover:text-blue-500">
                      <svg fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <path d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </div>
                </div>
                
                {/* Subtle Background Pattern */}
                <div className="absolute inset-0 opacity-0 transition-opacity duration-300 hover:opacity-5 rounded-xl overflow-hidden">
                  <div className="absolute inset-0" style={{
                    backgroundImage: `radial-gradient(circle at 20% 80%, ${
                      hoverGradient.includes('blue') ? '#3b82f6' : 
                      hoverGradient.includes('green') ? '#10b981' :
                      hoverGradient.includes('purple') ? '#8b5cf6' : '#6366f1'
                    } 1px, transparent 1px)`,
                    backgroundSize: '20px 20px'
                  }}></div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default FundamentalsSection;