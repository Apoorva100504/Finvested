import React from "react";

const OverviewSection = ({ priceInfo, fundamentals }) => {
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

  // Get the last traded price (current price) from priceInfo
  const getCurrentPrice = () => {
    // In real trading apps, this would be the last traded price
    // Check multiple possible property names
    return priceInfo?.lastPrice || 
           priceInfo?.currentPrice || 
           priceInfo?.lastTradedPrice || 
           priceInfo?.close || 
           priceInfo?.previousClose || 
           0;
  };

  // Calculate arrow position for a range
  const calculateArrowPosition = (current, low, high) => {
    // Handle edge cases
    if (!current || !low || !high || low >= high) return 50;
    
    // Ensure current is within range
    const clampedCurrent = Math.max(low, Math.min(high, current));
    
    // Calculate percentage position (0% at low, 100% at high)
    const percentage = ((clampedCurrent - low) / (high - low)) * 100;
    
    // Return with some margin (not at exact edges)
    return Math.max(5, Math.min(95, percentage));
  };

  // Calculate current price for display
  const currentPrice = getCurrentPrice();
  
  // Calculate Today's range arrow position
  const todayLow = priceInfo?.dayLow || 640.00;
  const todayHigh = priceInfo?.dayHigh || 724.80;
  const todayPosition = calculateArrowPosition(currentPrice, todayLow, todayHigh);
  
  // Calculate 52W range arrow position
  const week52Low = fundamentals?.week52Low || 570.05;
  const week52High = fundamentals?.week52High || 798.95;
  const week52Position = calculateArrowPosition(currentPrice, week52Low, week52High);

  // Calculate colored range position (visual representation of where current price falls)
  const getColoredRange = (current, low, high) => {
    const position = calculateArrowPosition(current, low, high);
    // Create a colored segment that ends at the current price position
    return {
      left: '0%',
      width: `${position}%`
    };
  };

  const todayRangeStyle = getColoredRange(currentPrice, todayLow, todayHigh);
  const week52RangeStyle = getColoredRange(currentPrice, week52Low, week52High);

  return (
    <div className="bg-white rounded-lg shadow p-6 mb-4">
      <h2 className="text-xl font-bold text-gray-900 mb-6">Performance</h2>

      {/* LOW/HIGH TRACK SECTION */}
      <div className="relative mb-12">
        {/* Today's Range Line with Arrow */}
        <div className="relative mb-8">
          <div className="flex justify-between items-center mb-2">
            <span className="text-xs text-gray-500">Today's Low</span>
            <span className="text-xs text-gray-500">Today's High</span>
          </div>
          
          {/* Line Container */}
          <div className="relative h-8">
            {/* Base Line */}
            <div className="absolute top-4 left-0 right-0 h-0.5 bg-gray-300"></div>
            
            {/* Colored Range - shows where current price is in relation to the range */}
            <div 
              className="absolute top-4 h-0.5 bg-blue-500"
              style={todayRangeStyle}
            ></div>
            
            {/* Current Price Indicator with Arrow */}
            <div 
              className="absolute top-1 transform -translate-x-1/2"
              style={{
                left: `${todayPosition}%`,
              }}
            >
              {/* Arrow pointing down to the line */}
              <div className="relative flex flex-col items-center">
                <div className="text-xs text-red-600 font-medium mb-1">
                  {formatNumber(currentPrice)}
                </div>
                <div className="w-0 h-0 border-l-4 border-r-4 border-t-4 border-l-transparent border-r-transparent border-t-red-500"></div>
              </div>
            </div>
            
            {/* End Points */}
            <div className="absolute top-3 left-0 w-2 h-2 bg-gray-500 rounded-full"></div>
            <div className="absolute top-3 right-0 w-2 h-2 bg-gray-500 rounded-full"></div>
          </div>
          
          {/* Values */}
          <div className="flex justify-between mt-2">
            <div className="text-sm font-semibold text-gray-900">
              {formatNumber(todayLow)}
            </div>
            <div className="text-sm font-semibold text-gray-900">
              {formatNumber(todayHigh)}
            </div>
          </div>
        </div>

        {/* 52W Range Line with Arrow */}
        <div className="relative">
          <div className="flex justify-between items-center mb-2">
            <span className="text-xs text-gray-500">52W Low</span>
            <span className="text-xs text-gray-500">52W High</span>
          </div>
          
          {/* Line Container */}
          <div className="relative h-8">
            {/* Base Line */}
            <div className="absolute top-4 left-0 right-0 h-0.5 bg-gray-300"></div>
            
            {/* Colored Range */}
            <div 
              className="absolute top-4 h-0.5 bg-green-500"
              style={week52RangeStyle}
            ></div>
            
            {/* Current Price Indicator with Arrow */}
            <div 
              className="absolute top-1 transform -translate-x-1/2"
              style={{
                left: `${week52Position}%`,
              }}
            >
              {/* Arrow pointing down to the line */}
              <div className="relative flex flex-col items-center">
                <div className="text-xs text-red-600 font-medium mb-1">
                  {formatNumber(currentPrice)}
                </div>
                <div className="w-0 h-0 border-l-4 border-r-4 border-t-4 border-l-transparent border-r-transparent border-t-red-500"></div>
              </div>
            </div>
            
            {/* End Points */}
            <div className="absolute top-3 left-0 w-2 h-2 bg-gray-500 rounded-full"></div>
            <div className="absolute top-3 right-0 w-2 h-2 bg-gray-500 rounded-full"></div>
          </div>
          
          {/* Values */}
          <div className="flex justify-between mt-2">
            <div className="text-sm font-semibold text-gray-900">
              {formatNumber(week52Low)}
            </div>
            <div className="text-sm font-semibold text-gray-900">
              {formatNumber(week52High)}
            </div>
          </div>
        </div>
      </div>

      {/* REMAINING STATS - NO BOXES - SMALL FONT */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-x-8 gap-y-6 text-sm">
        <div>
          <div className="text-gray-500 mb-1">Open</div>
          <div className="font-medium text-gray-800">
            {formatNumber(priceInfo?.open || 0)}
          </div>
        </div>

        <div>
          <div className="text-gray-500 mb-1">Prev. Close</div>
          <div className="font-medium text-gray-800">
            {formatNumber(priceInfo?.previousClose || 0)}
          </div>
        </div>

        <div>
          <div className="text-gray-500 mb-1">Volume</div>
          <div className="font-medium text-gray-800">
            {formatNumber(priceInfo?.totalTradedVolume || 0)}
          </div>
        </div>

        <div>
          <div className="text-gray-500 mb-1">Total traded value</div>
          <div className="font-medium text-gray-800">
            {formatCurrency(priceInfo?.totalTradedValue || 0)}
          </div>
        </div>

        <div>
          <div className="text-gray-500 mb-1">Upper Circuit</div>
          <div className="font-medium text-gray-800">
            {formatNumber(fundamentals?.upperCircuit || 0)}
          </div>
        </div>

        <div>
          <div className="text-gray-500 mb-1">Lower Circuit</div>
          <div className="font-medium text-gray-800">
            {formatNumber(fundamentals?.lowerCircuit || 0)}
          </div>
        </div>
      </div>
    </div>
  );
};

export default OverviewSection;

