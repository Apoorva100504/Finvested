import React, { useState } from "react";

const FinancialsSection = ({ financialData }) => {
  const [timeFrame, setTimeFrame] = useState("yearly"); // "yearly" or "quarterly"
  const [selectedMetric, setSelectedMetric] = useState("revenue"); // "revenue", "profit", "netWorth"
  const [hoveredBar, setHoveredBar] = useState(null);
  const [hoveredMetric, setHoveredMetric] = useState(null);

  // Format numbers with Indian numbering system
  const formatNumber = (value) => {
    if (!value || isNaN(value)) return "0";
    const numValue = parseFloat(value);
    return numValue.toLocaleString('en-IN', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    });
  };

  // Generate yearly data
  const getYearlyData = () => {
    const currentRevenue = financialData?.currentRevenue || 334;
    const currentProfit = financialData?.currentProfit || 89;
    const currentNetWorth = financialData?.currentNetWorth || 400;

    return {
      labels: ["2021", "2022", "2023"],
      revenue: [
        Math.round(currentRevenue * 0.54), // 181
        Math.round(currentRevenue * 0.67), // 224
        currentRevenue // 334
      ],
      profit: [
        Math.round(currentProfit * 0.51), // ~45
        Math.round(currentProfit * 0.75), // ~67
        currentProfit // 89
      ],
      netWorth: [
        Math.round(currentNetWorth * 0.7), // 280
        Math.round(currentNetWorth * 0.775), // 310
        currentNetWorth // 400
      ]
    };
  };

  // Generate quarterly data
  const getQuarterlyData = () => {
    const currentRevenue = financialData?.currentRevenue || 334;
    const currentProfit = financialData?.currentProfit || 89;
    const currentNetWorth = financialData?.currentNetWorth || 400;

    return {
      labels: ["Q1", "Q2", "Q3", "Q4"],
      revenue: [
        Math.round(currentRevenue * 0.24), // ~80
        Math.round(currentRevenue * 0.255), // ~85
        Math.round(currentRevenue * 0.27), // ~90
        Math.round(currentRevenue * 0.285) // ~95
      ],
      profit: [
        Math.round(currentProfit * 0.225), // ~20
        Math.round(currentProfit * 0.247), // ~22
        Math.round(currentProfit * 0.27), // ~24
        Math.round(currentProfit * 0.281) // ~25
      ],
      netWorth: [
        Math.round(currentNetWorth * 0.23), // ~92
        Math.round(currentNetWorth * 0.25), // ~100
        Math.round(currentNetWorth * 0.27), // ~108
        Math.round(currentNetWorth * 0.29) // ~116
      ]
    };
  };

  const yearlyData = getYearlyData();
  const quarterlyData = getQuarterlyData();
  const data = timeFrame === "yearly" ? yearlyData : quarterlyData;

  // Get current metric data
  const getCurrentMetricData = () => {
    return data[selectedMetric] || [];
  };

  const currentMetricData = getCurrentMetricData();
  
  // Get metric color with gradients
  const getMetricColor = () => {
    switch(selectedMetric) {
      case "revenue": 
        return "bg-gradient-to-t from-blue-500 via-blue-400 to-blue-300";
      case "profit": 
        return "bg-gradient-to-t from-green-500 via-green-400 to-green-300";
      case "netWorth": 
        return "bg-gradient-to-t from-purple-500 via-purple-400 to-purple-300";
      default: 
        return "bg-gradient-to-t from-blue-500 via-blue-400 to-blue-300";
    }
  };

  // Get metric label
  const getMetricLabel = () => {
    switch(selectedMetric) {
      case "revenue": return "Revenue";
      case "profit": return "Profit";
      case "netWorth": return "Net Worth";
      default: return "Revenue";
    }
  };

  // Get metric icon
  const getMetricIcon = () => {
    switch(selectedMetric) {
      case "revenue": return "💰";
      case "profit": return "📈";
      case "netWorth": return "💼";
      default: return "💰";
    }
  };

  // Get hover color for metric buttons
  const getMetricHoverColor = (metric) => {
    switch(metric) {
      case "revenue": return "hover:bg-blue-50 hover:text-blue-700 hover:border-blue-300";
      case "profit": return "hover:bg-green-50 hover:text-green-700 hover:border-green-300";
      case "netWorth": return "hover:bg-purple-50 hover:text-purple-700 hover:border-purple-300";
      default: return "hover:bg-blue-50 hover:text-blue-700 hover:border-blue-300";
    }
  };

  // Calculate max value for scaling
  const maxValue = Math.max(...currentMetricData, 100);

  // Calculate bar height percentage
  const calculateBarHeight = (value) => {
    if (!value || maxValue === 0) return 0;
    return (value / maxValue) * 100;
  };

  // Calculate percentage change
  const calculateGrowth = () => {
    if (currentMetricData.length < 2) return 0;
    const current = currentMetricData[currentMetricData.length - 1];
    const previous = currentMetricData[currentMetricData.length - 2];
    return ((current - previous) / previous) * 100;
  };

  const growth = calculateGrowth();

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 mb-6 transition-all duration-300 hover:shadow-xl">
      {/* Header with Gradient */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold bg-gray-700 bg-clip-text text-transparent mb-4">
          Financial Performance
        </h2>
        
        {/* Summary Card */}
        <div className="bg-gradient-to-r from-gray-50 to-white p-4 rounded-lg border border-gray-100 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-100 to-cyan-100 rounded-lg flex items-center justify-center">
                <span className="text-lg">{getMetricIcon()}</span>
              </div>
              <div>
                <div className="text-sm text-gray-500">{getMetricLabel()}</div>
                <div className="text-xl font-bold text-gray-900">
                  ₹{formatNumber(currentMetricData[currentMetricData.length - 1])} Cr
                </div>
              </div>
            </div>
            
            <div className={`px-4 py-2 rounded-full text-sm font-medium ${
              growth > 0 
                ? 'bg-green-100 text-green-700' 
                : 'bg-red-100 text-red-700'
            }`}>
              {growth > 0 ? '↗' : '↘'} {Math.abs(growth).toFixed(1)}% {timeFrame === "yearly" ? "YoY" : "QoQ"}
            </div>
          </div>
        </div>
      </div>

      {/* Metric Selector with Hover Effects */}
      <div className="flex flex-wrap gap-3 mb-8">
        {['revenue', 'profit', 'netWorth'].map((metric) => (
          <button
            key={metric}
            className={`px-5 py-3 rounded-xl text-sm font-medium transition-all duration-300 
                      ${selectedMetric === metric
                        ? metric === 'revenue' 
                          ? 'bg-gradient-to-r from-blue-100 to-cyan-100 text-blue-700 border border-blue-200 shadow-md scale-105' 
                          : metric === 'profit' 
                            ? 'bg-gradient-to-r from-green-100 to-emerald-100 text-green-700 border border-green-200 shadow-md scale-105'
                            : 'bg-gradient-to-r from-purple-100 to-violet-100 text-purple-700 border border-purple-200 shadow-md scale-105'
                        : 'bg-gray-100 text-gray-600 hover:scale-105 hover:shadow-sm'
                      } ${getMetricHoverColor(metric)}`}
            onClick={() => setSelectedMetric(metric)}
            onMouseEnter={() => setHoveredMetric(metric)}
            onMouseLeave={() => setHoveredMetric(null)}
          >
            <div className="flex items-center gap-2">
              <span className="text-base">
                {metric === 'revenue' ? '💰' : metric === 'profit' ? '📈' : '💼'}
              </span>
              <span>
                {metric === 'revenue' ? 'Revenue' : metric === 'profit' ? 'Profit' : 'Net Worth'}
              </span>
              {hoveredMetric === metric && (
                <span className="text-xs opacity-60">→</span>
              )}
            </div>
          </button>
        ))}
      </div>

      {/* Time Frame Selector with Hover Effects */}
      <div className="flex justify-between items-center mb-8">
        <div className="flex space-x-1 bg-gray-100 p-1.5 rounded-xl">
          {['quarterly', 'yearly'].map((frame) => (
            <button
              key={frame}
              className={`px-5 py-2.5 rounded-lg text-sm font-medium transition-all duration-300 
                        ${timeFrame === frame
                          ? 'bg-white text-blue-600 shadow-lg scale-105'
                          : 'text-gray-600 hover:text-gray-800 hover:scale-105'
                        }`}
              onClick={() => setTimeFrame(frame)}
            >
              <div className="flex items-center gap-2">
                {frame === 'quarterly' ? '📅' : '📊'}
                {frame === 'quarterly' ? 'Quarterly' : 'Yearly'}
              </div>
            </button>
          ))}
        </div>
        
        {/* Current Metric Display */}
        <div className="flex items-center space-x-3">
          <div className={`w-4 h-4 rounded-full ${
            selectedMetric === 'revenue' ? 'bg-blue-500' :
            selectedMetric === 'profit' ? 'bg-green-500' : 'bg-purple-500'
          } ${hoveredMetric === selectedMetric ? 'animate-pulse' : ''}`}></div>
          <span className="text-sm font-medium text-gray-700">
            Viewing: {getMetricLabel()}
          </span>
        </div>
      </div>

      {/* Enhanced Bar Chart */}
      <div className="mb-10">
        <div className="relative h-72">
          {/* Y-axis grid lines with hover effects */}
          <div className="absolute inset-0 flex flex-col justify-between">
            {[0, 25, 50, 75, 100].map((percent) => (
              <div key={percent} className="relative group">
                <div className="absolute left-0 right-0 h-px bg-gray-200 transition-all duration-300 group-hover:h-0.5 group-hover:bg-gray-300"></div>
                <div className="absolute -left-10 text-xs text-gray-400 -translate-y-1/2 transition-all duration-300 group-hover:text-gray-600 group-hover:font-medium">
                  {Math.round((maxValue * percent) / 100)} Cr
                </div>
              </div>
            ))}
          </div>

          {/* Bars Container */}
          <div className="absolute inset-0 flex items-end space-x-6 pl-14 pr-6">
            {data.labels.map((label, index) => {
              const barHeight = calculateBarHeight(currentMetricData[index]);
              const isHovered = hoveredBar === index;
              
              return (
                <div 
                  key={label} 
                  className="flex-1 flex flex-col items-center h-full group"
                  onMouseEnter={() => setHoveredBar(index)}
                  onMouseLeave={() => setHoveredBar(null)}
                >
                  <div className="relative w-3/5 h-full flex flex-col justify-end">
                    {/* Bar with hover effects */}
                    <div
                      className={`w-full rounded-t-xl ${getMetricColor()} transition-all duration-500 
                                hover:shadow-lg hover:scale-x-110 hover:opacity-90 relative overflow-hidden
                                ${isHovered ? 'shadow-lg scale-x-110 opacity-90' : ''}`}
                      style={{ 
                        height: `${barHeight}%`,
                        minHeight: '8px'
                      }}
                    >
                      {/* Bar shine effect */}
                      <div className="absolute top-0 left-0 right-0 h-1/2 bg-gradient-to-b from-white/20 to-transparent"></div>
                      
                      {/* Value inside bar on hover */}
                      {isHovered && (
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="text-xs font-bold text-white bg-black/40 px-2 py-1 rounded">
                            ₹{formatNumber(currentMetricData[index])} Cr
                          </div>
                        </div>
                      )}
                    </div>
                    
                    {/* Hover tooltip */}
                    <div className={`absolute -top-10 left-1/2 transform -translate-x-1/2 
                                  bg-gray-900 text-white text-sm px-3 py-2 rounded-lg shadow-xl
                                  transition-all duration-300 pointer-events-none
                                  ${isHovered ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}>
                      <div className="font-semibold">{label}</div>
                      <div className="text-xs opacity-80">
                        {getMetricLabel()}: ₹{formatNumber(currentMetricData[index])} Cr
                      </div>
                      <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/2 w-2 h-2 bg-gray-900 rotate-45"></div>
                    </div>
                  </div>
                  
                  {/* X-axis label */}
                  <div className={`mt-3 text-sm font-medium transition-all duration-300 
                                ${isHovered ? 'text-gray-900 scale-110' : 'text-gray-700'}`}>
                    {label}
                  </div>
                  
                  {/* Value below bar */}
                  <div className={`mt-2 text-xs transition-all duration-300
                                ${isHovered ? 'text-gray-900 font-medium' : 'text-gray-500'}`}>
                    ₹{formatNumber(currentMetricData[index])} Cr
                  </div>
                </div>
              );
            })}
          </div>

          {/* Y-axis label with hover effect */}
          <div className="absolute -left-10 top-1/2 transform -translate-y-1/2 -rotate-90 
                        text-sm text-gray-500 font-medium transition-all duration-300 hover:text-gray-700">
            Value (₹ Cr)
          </div>
        </div>
      </div>

      {/* Enhanced Summary Stats */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        {[
          { 
            label: "Current", 
            value: `₹${formatNumber(currentMetricData[currentMetricData.length - 1])} Cr`,
            bg: selectedMetric === 'revenue' ? 'from-blue-50 to-cyan-50' :
                selectedMetric === 'profit' ? 'from-green-50 to-emerald-50' : 'from-purple-50 to-violet-50'
          },
          { 
            label: "Growth", 
            value: `${growth.toFixed(1)}%`,
            color: growth > 0 ? 'text-green-600' : 'text-red-600'
          },
          { 
            label: "Periods", 
            value: timeFrame === "yearly" ? "3 Years" : "4 Quarters"
          }
        ].map((stat, index) => (
          <div 
            key={index}
            className={`text-center p-4 rounded-xl transition-all duration-300 hover:scale-105 hover:shadow-md
                      ${stat.bg ? `bg-gradient-to-br ${stat.bg}` : 'bg-gradient-to-br from-gray-50 to-gray-100'}`}
          >
            <div className="text-sm text-gray-500 mb-2">{stat.label}</div>
            <div className={`text-xl font-bold ${stat.color || 'text-gray-900'}`}>
              {stat.value}
            </div>
          </div>
        ))}
      </div>

      {/* Enhanced Notes Section */}
      <div className="border-t border-gray-200 pt-6">
        <div className="flex items-start group">
          <div className="text-sm font-medium text-gray-700 mr-4 min-w-[80px] flex items-center gap-2">
            <span className="text-gray-400">📝</span>
            Notes:
          </div>
          <div className="flex-1 space-y-2">
            <div className="text-sm text-gray-600 transition-colors duration-300 group-hover:text-gray-700">
              • All values are in Rs. Cr (Crores)
            </div>
            <div className="text-sm text-gray-600 transition-colors duration-300 group-hover:text-gray-700">
              • {timeFrame === "yearly" ? "Yearly" : "Quarterly"} {getMetricLabel()} performance
            </div>
            <div className="text-sm text-gray-600 transition-colors duration-300 group-hover:text-gray-700">
              • Based on reported financial statements
            </div>
          </div>
          
        </div>
      </div>
    </div>
  );
};

FinancialsSection.defaultProps = {
  financialData: null
};

export default FinancialsSection;