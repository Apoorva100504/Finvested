import React, { useState } from "react";

const OverviewSection = ({ priceInfo, fundamentals }) => {
  const [hoveredMetric, setHoveredMetric] = useState(null);

  const formatNumber = (value) => {
    if (!value || isNaN(value)) return "0.00";
    return parseFloat(value).toLocaleString("en-IN", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  };

  const formatCurrency = (value) => {
    if (!value || isNaN(value)) return "₹0.00";
    const numValue = parseFloat(value);
    if (numValue >= 10000000) {
      return `₹${(numValue / 10000000).toFixed(2)} Cr`;
    } else if (numValue >= 100000) {
      return `₹${(numValue / 100000).toFixed(2)} L`;
    }
    return `₹${numValue.toLocaleString("en-IN", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;
  };

  // Calculate price change
  const getPriceChange = () => {
    const current = getCurrentPrice();
    const previous = priceInfo?.previousClose || 0;
    const change = current - previous;
    const percent = (change / previous) * 100;
    return {
      value: Math.abs(change),
      percent: Math.abs(percent),
      isPositive: change >= 0
    };
  };

  // Get the last traded price
  const getCurrentPrice = () => {
    return priceInfo?.lastPrice || 
           priceInfo?.currentPrice || 
           priceInfo?.lastTradedPrice || 
           priceInfo?.close || 
           priceInfo?.previousClose || 
           0;
  };

  // Calculate arrow position for a range
  const calculateArrowPosition = (current, low, high) => {
    if (!current || !low || !high || low >= high) return 50;
    const clampedCurrent = Math.max(low, Math.min(high, current));
    const percentage = ((clampedCurrent - low) / (high - low)) * 100;
    return Math.max(5, Math.min(95, percentage));
  };

  const currentPrice = getCurrentPrice();
  const priceChange = getPriceChange();
  
  const todayLow = priceInfo?.dayLow || 640.00;
  const todayHigh = priceInfo?.dayHigh || 724.80;
  const todayPosition = calculateArrowPosition(currentPrice, todayLow, todayHigh);
  
  const week52Low = fundamentals?.week52Low || 570.05;
  const week52High = fundamentals?.week52High || 798.95;
  const week52Position = calculateArrowPosition(currentPrice, week52Low, week52High);

  // Get colored range with gradient
  const getColoredRange = (current, low, high) => {
    const position = calculateArrowPosition(current, low, high);
    return {
      left: '0%',
      width: `${position}%`,
      background: priceChange.isPositive 
        ? 'linear-gradient(90deg, #48E1C4, #5064FF)'
        : 'linear-gradient(90deg, #ff6b6b, #ff8787)'
    };
  };

  const todayRangeStyle = getColoredRange(currentPrice, todayLow, todayHigh);
  const week52RangeStyle = getColoredRange(currentPrice, week52Low, week52High);

  // Metrics data
  const metrics = [
    {
      id: 'open',
      label: 'Open',
      value: priceInfo?.open || 0,
      formatter: formatNumber,
      hoverColor: 'from-blue-50 to-cyan-50'
    },
    {
      id: 'prevClose',
      label: 'Prev. Close',
      value: priceInfo?.previousClose || 0,
      formatter: formatNumber,
      hoverColor: 'from-purple-50 to-indigo-50'
    },
    {
      id: 'volume',
      label: 'Volume',
      value: priceInfo?.totalTradedVolume || 0,
      formatter: formatNumber,
      hoverColor: 'from-green-50 to-emerald-50'
    },
    {
      id: 'totalValue',
      label: 'Total traded value',
      value: priceInfo?.totalTradedValue || 0,
      formatter: formatCurrency,
      hoverColor: 'from-amber-50 to-orange-50'
    },
    {
      id: 'upperCircuit',
      label: 'Upper Circuit',
      value: fundamentals?.upperCircuit || 0,
      formatter: formatNumber,
      hoverColor: 'from-red-50 to-pink-50'
    },
    {
      id: 'lowerCircuit',
      label: 'Lower Circuit',
      value: fundamentals?.lowerCircuit || 0,
      formatter: formatNumber,
      hoverColor: 'from-blue-50 to-indigo-50'
    },
    {
      id: 'vwap',
      label: 'VWAP',
      value: priceInfo?.vwap || (currentPrice * 0.985).toFixed(2),
      formatter: formatNumber,
      hoverColor: 'from-violet-50 to-purple-50'
    },
    {
      id: 'delivery',
      label: 'Delivery %',
      value: priceInfo?.deliveryPercentage || 45.6,
      formatter: (val) => `${formatNumber(val)}%`,
      hoverColor: 'from-teal-50 to-cyan-50'
    }
  ];

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 mb-6 transition-all duration-300 hover:shadow-xl">
      {/* Header with gradient effect */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold bg-gray-700  bg-clip-text text-transparent mb-4">
          Performance
        </h2>
        
        {/* Price Display with hover effects */}
        <div className="flex items-baseline gap-4 group">
          <div className="text-1xl font-bold text-gray-900 transition-all duration-300 group-hover:scale-105 group-hover:text-gray-800">
            ₹{formatNumber(currentPrice)}
          </div>
          
          <div className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-all duration-300 
                         ${priceChange.isPositive 
                           ? 'bg-gradient-to-r from-green-50 to-emerald-50 hover:from-green-100 hover:to-emerald-100 text-green-700 hover:text-green-800 hover:shadow-md' 
                           : 'bg-gradient-to-r from-red-50 to-pink-50 hover:from-red-100 hover:to-pink-100 text-red-700 hover:text-red-800 hover:shadow-md'
                         }`}>
            <span className="font-semibold">
              {priceChange.isPositive ? '↗' : '↘'} {formatNumber(priceChange.value)}
            </span>
            <span className="text-sm opacity-80">
              ({formatNumber(priceChange.percent)}%)
            </span>
          </div>
        </div>
      </div>

      {/* RANGE TRACKS WITH HOVER EFFECTS */}
      <div className="space-y-10 mb-10">
        {/* Today's Range */}
        <div className="relative group">
          <div className="flex justify-between items-center mb-4">
            <span className="text-sm font-medium text-gray-600 transition-colors duration-300 group-hover:text-gray-900">
              Today's Range
            </span>
            <div className="text-sm text-gray-500 transition-colors duration-300 group-hover:text-gray-700">
              <span className="font-medium">{formatNumber(todayLow)}</span> • 
              <span className="font-medium ml-1">{formatNumber(todayHigh)}</span>
            </div>
          </div>
          
          {/* Line Container */}
          <div className="relative h-10">
            {/* Base Line with hover effect */}
            <div className="absolute top-5 left-0 right-0 h-1 bg-gray-200 rounded-full transition-all duration-300 group-hover:h-1.5 group-hover:bg-gray-300"></div>
            
            {/* Colored Range with gradient */}
            <div 
              className="absolute top-5 h-1 rounded-full transition-all duration-500 group-hover:h-1.5"
              style={todayRangeStyle}
            ></div>
            
            {/* Current Price Indicator */}
            <div 
              className="absolute top-0 transform -translate-x-1/2 transition-all duration-300 group-hover:scale-110"
              style={{ left: `${todayPosition}%` }}
            >
              <div className="relative flex flex-col items-center">
                <div className="text-xs font-medium bg-gradient-to-r from-gray-900 to-gray-700 text-white px-3 py-1.5 rounded-lg shadow-lg mb-2 transition-all duration-300 hover:scale-105 hover:shadow-xl">
                  ₹{formatNumber(currentPrice)}
                </div>
                <div className="w-0 h-0 border-l-4 border-r-4 border-t-4 border-l-transparent border-r-transparent border-t-gray-900 transition-all duration-300 group-hover:border-t-gray-800"></div>
              </div>
            </div>
            
            {/* End Points with hover effects */}
            <div className="absolute top-4 left-0 w-3 h-3 bg-gradient-to-br from-gray-400 to-gray-600 rounded-full shadow transition-all duration-300 group-hover:w-4 group-hover:h-4 group-hover:shadow-lg"></div>
            <div className="absolute top-4 right-0 w-3 h-3 bg-gradient-to-br from-gray-400 to-gray-600 rounded-full shadow transition-all duration-300 group-hover:w-4 group-hover:h-4 group-hover:shadow-lg"></div>
          </div>
        </div>

        {/* 52W Range */}
        <div className="relative group">
          <div className="flex justify-between items-center mb-4">
            <span className="text-sm font-medium text-gray-600 transition-colors duration-300 group-hover:text-gray-900">
              52 Week Range
            </span>
            <div className="text-sm text-gray-500 transition-colors duration-300 group-hover:text-gray-700">
              <span className="font-medium">{formatNumber(week52Low)}</span> • 
              <span className="font-medium ml-1">{formatNumber(week52High)}</span>
            </div>
          </div>
          
          {/* Line Container */}
          <div className="relative h-10">
            {/* Base Line with hover effect */}
            <div className="absolute top-5 left-0 right-0 h-1 bg-gray-200 rounded-full transition-all duration-300 group-hover:h-1.5 group-hover:bg-gray-300"></div>
            
            {/* Colored Range with gradient */}
            <div 
              className="absolute top-5 h-1 rounded-full transition-all duration-500 group-hover:h-1.5"
              style={week52RangeStyle}
            ></div>
            
            {/* Current Price Indicator */}
            <div 
              className="absolute top-0 transform -translate-x-1/2 transition-all duration-300 group-hover:scale-110"
              style={{ left: `${week52Position}%` }}
            >
              <div className="relative flex flex-col items-center">
                <div className="text-xs font-medium bg-gradient-to-r from-gray-900 to-gray-700 text-white px-3 py-1.5 rounded-lg shadow-lg mb-2 transition-all duration-300 hover:scale-105 hover:shadow-xl">
                  ₹{formatNumber(currentPrice)}
                </div>
                <div className="w-0 h-0 border-l-4 border-r-4 border-t-4 border-l-transparent border-r-transparent border-t-gray-900 transition-all duration-300 group-hover:border-t-gray-800"></div>
              </div>
            </div>
            
            {/* End Points with hover effects */}
            <div className="absolute top-4 left-0 w-3 h-3 bg-gradient-to-br from-gray-400 to-gray-600 rounded-full shadow transition-all duration-300 group-hover:w-4 group-hover:h-4 group-hover:shadow-lg"></div>
            <div className="absolute top-4 right-0 w-3 h-3 bg-gradient-to-br from-gray-400 to-gray-600 rounded-full shadow transition-all duration-300 group-hover:w-4 group-hover:h-4 group-hover:shadow-lg"></div>
          </div>
        </div>
      </div>

      {/* METRICS GRID WITH HOVER EFFECTS */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {metrics.map((metric) => (
          <div
            key={metric.id}
            className={`relative p-4 rounded-lg border border-gray-100 transition-all duration-300 
                       hover:scale-[1.02] hover:shadow-lg hover:border-transparent
                       ${hoveredMetric === metric.id ? 'scale-[1.02] shadow-lg border-transparent' : ''}
                       bg-gradient-to-br from-white to-gray-50 hover:${metric.hoverColor}`}
            onMouseEnter={() => setHoveredMetric(metric.id)}
            onMouseLeave={() => setHoveredMetric(null)}
          >
            {/* Hover Indicator */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-gray-200 to-transparent opacity-0 transition-opacity duration-300 hover:opacity-100"></div>
            
            {/* Metric Content */}
            <div className="relative">
              <div className="text-xs text-gray-500 mb-2 transition-colors duration-300 hover:text-gray-700">
                {metric.label}
              </div>
              
              <div className="text-lg font-semibold text-gray-900 transition-all duration-300 hover:scale-105 hover:text-gray-800">
                {metric.formatter(metric.value)}
              </div>
              
              {/* Hover Arrow */}
              <div className="absolute -right-2 top-1/2 transform -translate-y-1/2 opacity-0 transition-all duration-300 hover:opacity-100 hover:right-0">
                <div className="w-4 h-4 text-gray-300 transition-colors duration-300 hover:text-blue-500">
                  <svg fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
            </div>
            
            {/* Subtle background pattern on hover */}
            <div className="absolute inset-0 opacity-0 transition-opacity duration-300 hover:opacity-5">
              <div className="absolute inset-0" style={{
                backgroundImage: `radial-gradient(circle at 20% 80%, ${
                  metric.hoverColor.includes('blue') ? '#3b82f6' : 
                  metric.hoverColor.includes('green') ? '#10b981' :
                  metric.hoverColor.includes('red') ? '#ef4444' :
                  metric.hoverColor.includes('purple') ? '#8b5cf6' : '#6366f1'
                } 1px, transparent 1px)`,
                backgroundSize: '20px 20px'
              }}></div>
            </div>
          </div>
        ))}
      </div>

      
    </div>
  );
};

export default OverviewSection;