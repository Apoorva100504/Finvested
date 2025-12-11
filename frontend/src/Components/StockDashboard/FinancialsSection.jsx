import React, { useState } from "react";

const FinancialsSection = ({ financialData }) => {
  const [timeFrame, setTimeFrame] = useState("yearly"); // "yearly" or "quarterly"
  const [selectedMetric, setSelectedMetric] = useState("revenue"); // "revenue", "profit", "netWorth"

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
  
  // Get metric color - USING SOLID COLORS
  const getMetricColor = () => {
    switch(selectedMetric) {
      case "revenue": return "bg-blue-500";
      case "profit": return "bg-green-500";
      case "netWorth": return "bg-purple-500";
      default: return "bg-blue-500";
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

  // Calculate max value for scaling
  const maxValue = Math.max(...currentMetricData, 100);

  // Calculate bar height percentage
  const calculateBarHeight = (value) => {
    if (!value || maxValue === 0) return 0;
    return (value / maxValue) * 100;
  };

  return (
    <div className="bg-white rounded-lg shadow p-6 mb-4">
      <h2 className="text-xl font-bold text-gray-900 mb-6">Financials</h2>

      {/* Metric Selector */}
      <div className="flex flex-wrap gap-3 mb-6">
        <button
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            selectedMetric === "revenue"
              ? "bg-blue-100 text-blue-600 border border-blue-200"
              : "bg-gray-100 text-gray-600 hover:bg-gray-200"
          }`}
          onClick={() => setSelectedMetric("revenue")}
        >
          Revenue
        </button>
        <button
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            selectedMetric === "profit"
              ? "bg-green-100 text-green-600 border border-green-200"
              : "bg-gray-100 text-gray-600 hover:bg-gray-200"
          }`}
          onClick={() => setSelectedMetric("profit")}
        >
          Profit
        </button>
        <button
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            selectedMetric === "netWorth"
              ? "bg-purple-100 text-purple-600 border border-purple-200"
              : "bg-gray-100 text-gray-600 hover:bg-gray-200"
          }`}
          onClick={() => setSelectedMetric("netWorth")}
        >
          Net Worth
        </button>
      </div>

      {/* Time Frame Selector */}
      <div className="flex justify-between items-center mb-6">
        <div className="flex space-x-2 bg-gray-100 p-1 rounded-lg">
          <button
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              timeFrame === "quarterly"
                ? "bg-white text-blue-600 shadow-sm"
                : "text-gray-600 hover:text-gray-800"
            }`}
            onClick={() => setTimeFrame("quarterly")}
          >
            Quarterly
          </button>
          <button
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              timeFrame === "yearly"
                ? "bg-white text-blue-600 shadow-sm"
                : "text-gray-600 hover:text-gray-800"
            }`}
            onClick={() => setTimeFrame("yearly")}
          >
            Yearly
          </button>
        </div>
        
        {/* Current Metric Display */}
        <div className="flex items-center space-x-2">
          <div className={`w-3 h-3 rounded ${getMetricColor()}`}></div>
          <span className="text-sm font-medium text-gray-700">{getMetricLabel()}</span>
        </div>
      </div>

      {/* Bar Chart - FIXED WITH SOLID COLORS */}
      <div className="mb-8">
        <div className="relative h-64">
          {/* Y-axis grid lines */}
          <div className="absolute inset-0 flex flex-col justify-between">
            {[0, 25, 50, 75, 100].map((percent) => (
              <div key={percent} className="relative">
                <div className="absolute left-0 right-0 h-px bg-gray-200"></div>
                <div className="absolute -left-10 text-xs text-gray-400 -translate-y-1/2">
                  {Math.round((maxValue * percent) / 100)} Cr
                </div>
              </div>
            ))}
          </div>

          {/* Bars Container - FIXED with proper positioning */}
          <div className="absolute inset-0 flex items-end space-x-4 pl-12 pr-4">
            {data.labels.map((label, index) => (
              <div key={label} className="flex-1 flex flex-col items-center h-full">
                <div className="relative w-1/2 h-full flex flex-col justify-end">
                  {/* Bar */}
                  <div
                    className={`w-full rounded-t-lg ${getMetricColor()} transition-all hover:opacity-90`}
                    style={{ 
                      height: `${calculateBarHeight(currentMetricData[index])}%`,
                      minHeight: '4px' // Ensure bars are visible even for small values
                    }}
                  >
                    {/* Hover tooltip */}
                    <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                      {label}: ₹{formatNumber(currentMetricData[index])} Cr
                    </div>
                  </div>
                </div>
                
                {/* X-axis label */}
                <div className="mt-2 text-sm font-medium text-gray-700">{label}</div>
                
                {/* Value below bar */}
                <div className="mt-1 text-xs text-gray-500">
                  ₹{formatNumber(currentMetricData[index])} Cr
                </div>
              </div>
            ))}
          </div>

          {/* Y-axis label */}
          <div className="absolute -left-8 top-1/2 transform -translate-y-1/2 -rotate-90 text-xs text-gray-500 whitespace-nowrap">
            Value (₹ Cr)
          </div>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="text-center p-3 bg-blue-50 rounded-lg">
          <div className="text-sm text-gray-500 mb-1">Current</div>
          <div className="text-lg font-bold text-gray-900">
            ₹{formatNumber(currentMetricData[currentMetricData.length - 1])} Cr
          </div>
        </div>
        <div className="text-center p-3 bg-gray-50 rounded-lg">
          <div className="text-sm text-gray-500 mb-1">Growth</div>
          <div className="text-lg font-bold text-green-600">
            {currentMetricData.length > 1 
              ? `${Math.round(
                  ((currentMetricData[currentMetricData.length - 1] - currentMetricData[currentMetricData.length - 2]) / 
                  currentMetricData[currentMetricData.length - 2]) * 100
                )}%`
              : "0%"
            }
          </div>
        </div>
        <div className="text-center p-3 bg-gray-50 rounded-lg">
          <div className="text-sm text-gray-500 mb-1">Periods</div>
          <div className="text-lg font-bold text-gray-900">
            {timeFrame === "yearly" ? "3 Years" : "4 Quarters"}
          </div>
        </div>
      </div>

      {/* Notes Section */}
      <div className="border-t border-gray-200 pt-4">
        <div className="flex items-start">
          <div className="text-sm text-gray-500 mr-4 min-w-[60px]">Notes:</div>
          <div className="flex-1">
            <div className="text-sm text-gray-600 mb-2">
              • All values are in Rs. Cr
            </div>
            <div className="text-sm text-gray-600">
              • Current view: {getMetricLabel()} ({timeFrame === "yearly" ? "Yearly" : "Quarterly"})
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