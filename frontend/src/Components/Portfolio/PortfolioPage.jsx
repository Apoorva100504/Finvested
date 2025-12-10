import React, { useState, useEffect } from "react";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { FiRefreshCw, FiInfo, FiTrendingUp, FiTrendingDown } from "react-icons/fi";

// Mock API endpoint - replace with your actual backend URL
const API_ENDPOINT = "https://api.yourdomain.com/portfolio/sector-breakdown";

// Sample data structure expected from backend
// This matches the format you should return from your API
const SAMPLE_API_RESPONSE = {
  success: true,
  data: {
    summary: {
      totalValue: 1132585.01,
      totalReturns: 149580.26,
      overallReturnPercentage: 15.21,
      totalStocks: 23,
      totalSectors: 5
    },
    sectors: [
      {
        id: 1,
        name: "IT Industry",
        stocks: 7,
        percentage: 25.21,
        currentValue: 283146.38,
        investedValue: 238915.82, // Bought value from backend
        returns: 44230.56,
        // Returns can be calculated as: currentValue - investedValue
        // Color will be determined dynamically
      },
      {
        id: 2,
        name: "Financials",
        stocks: 5,
        percentage: 22.05,
        currentValue: 249168.81,
        investedValue: 219519.21,
        returns: 29649.6,
      },
      {
        id: 3,
        name: "Construction",
        stocks: 3,
        percentage: 20.37,
        currentValue: 226517.1,
        investedValue: 204415.32,
        returns: 22101.78,
      },
      {
        id: 4,
        name: "Healthcare",
        stocks: 2,
        percentage: 15.15,
        currentValue: 169887.33,
        investedValue: 131023.53,
        returns: 38863.8,
      },
      {
        id: 5,
        name: "Other sectors",
        stocks: 6,
        percentage: 17.22,
        currentValue: 203865.39,
        investedValue: 189130.87,
        returns: 14734.52,
      },
    ],
    timestamp: "2024-01-15T10:30:00Z",
    lastUpdated: "Just now"
  }
};

// Static color palette for pie chart (independent of returns)
const PIE_COLORS = ["#4CAF50", "#FFC107", "#FF9800", "#03A9F4", "#E53935", "#9C27B0", "#795548"];

const formatCurrency = (v) => `₹${v.toLocaleString("en-IN")}`;

export default function PortfolioUI() {
  const [sectorData, setSectorData] = useState([]);
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState("Just now");
  const [selectedSector, setSelectedSector] = useState(null);

  // Function to determine color based on returns
  const getReturnColor = (investedValue, currentValue) => {
    if (currentValue > investedValue) return "#10B981"; // Green for profit
    if (currentValue < investedValue) return "#EF4444"; // Red for loss
    return "#6B7280"; // Gray for neutral
  };

  // Function to format percentage with sign
  const formatPercentage = (value) => {
    const num = parseFloat(value);
    return `${num >= 0 ? '+' : ''}${num.toFixed(2)}%`;
  };

  // Fetch data from backend
  const fetchPortfolioData = async () => {
    try {
      setLoading(true);
      
      // In production, replace this with actual API call:
      // const response = await fetch(API_ENDPOINT, {
      //   headers: {
      //     'Authorization': `Bearer ${token}`,
      //     'Content-Type': 'application/json'
      //   }
      // });
      // const data = await response.json();
      
      // For demo, simulate API delay
      await new Promise(resolve => setTimeout(resolve, 800));
      
      const data = SAMPLE_API_RESPONSE;
      
      if (data.success) {
        // Process sectors with dynamic colors
        const processedSectors = data.data.sectors.map((sector, index) => ({
          ...sector,
          // Determine color based on returns (currentValue vs investedValue)
          borderColor: getReturnColor(sector.investedValue, sector.currentValue),
          // Use static colors for pie chart for consistency
          pieColor: PIE_COLORS[index % PIE_COLORS.length],
          // Calculate return percentage for display
          returnPercentage: ((sector.returns / sector.investedValue) * 100).toFixed(2)
        }));
        
        setSectorData(processedSectors);
        setSummary(data.data.summary);
        setLastUpdated(data.data.lastUpdated);
        setError(null);
      } else {
        throw new Error(data.message || "Failed to fetch portfolio data");
      }
    } catch (err) {
      console.error("Error fetching portfolio data:", err);
      setError("Unable to load portfolio data. Please try again.");
      // Fallback to static data
      const fallbackData = SAMPLE_API_RESPONSE.data.sectors.map((sector, index) => ({
        ...sector,
        borderColor: getReturnColor(sector.investedValue, sector.currentValue),
        pieColor: PIE_COLORS[index % PIE_COLORS.length],
        returnPercentage: ((sector.returns / sector.investedValue) * 100).toFixed(2)
      }));
      setSectorData(fallbackData);
      setSummary(SAMPLE_API_RESPONSE.data.summary);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPortfolioData();
    
    // Optional: Auto-refresh every 60 seconds
    const intervalId = setInterval(fetchPortfolioData, 60000);
    return () => clearInterval(intervalId);
  }, []);

  const handleSectorClick = (sector) => {
    setSelectedSector(selectedSector?.id === sector.id ? null : sector);
  };

  const handleRefresh = () => {
    fetchPortfolioData();
  };

  if (loading && sectorData.length === 0) {
    return (
      <div className="p-4 bg-[#f7f8fa] min-h-screen text-gray-900 font-sans px-24 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading portfolio analysis...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 bg-[#f7f8fa] min-h-screen text-gray-900 font-sans px-24">
      {/* Header with Summary and Refresh */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h1 className="text-2xl font-bold">Portfolio Sector Analysis</h1>
            <p className="text-gray-600 text-sm">Diversification across sectors</p>
          </div>
          <button
            onClick={handleRefresh}
            disabled={loading}
            className="flex items-center gap-2 px-4 py-2 bg-white rounded-lg border border-gray-200 hover:bg-gray-50 disabled:opacity-50 transition-all"
          >
            <FiRefreshCw className={`${loading ? 'animate-spin' : ''}`} />
            <span className="text-sm">{loading ? 'Refreshing...' : 'Refresh'}</span>
          </button>
        </div>
        
        {/* Summary Cards */}
        {summary && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-white rounded-xl p-4 shadow">
              <p className="text-sm text-gray-500 mb-1">Total Value</p>
              <p className="text-xl font-bold">{formatCurrency(summary.totalValue)}</p>
            </div>
            <div className="bg-white rounded-xl p-4 shadow">
              <p className="text-sm text-gray-500 mb-1">Total Returns</p>
              <p className={`text-xl font-bold ${summary.totalReturns >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {summary.totalReturns >= 0 ? '+' : ''}{formatCurrency(summary.totalReturns)}
              </p>
            </div>
            <div className="bg-white rounded-xl p-4 shadow">
              <p className="text-sm text-gray-500 mb-1">Return %</p>
              <p className={`text-xl font-bold ${summary.overallReturnPercentage >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {formatPercentage(summary.overallReturnPercentage)}
              </p>
            </div>
            <div className="bg-white rounded-xl p-4 shadow">
              <p className="text-sm text-gray-500 mb-1">Total Stocks</p>
              <p className="text-xl font-bold">{summary.totalStocks}</p>
            </div>
          </div>
        )}
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column - Pie Chart */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl shadow p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold">Sector Distribution</h2>
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <FiInfo size={16} />
                <span>Hover for details</span>
              </div>
            </div>
            
            <div className="w-full h-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={sectorData}
                    dataKey="percentage"
                    nameKey="name"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={2}
                    onClick={(data) => handleSectorClick(data)}
                    className="cursor-pointer"
                  >
                    {sectorData.map((item, index) => (
                      <Cell 
                        key={`cell-${index}`} 
                        fill={item.pieColor}
                        stroke="#fff"
                        strokeWidth={2}
                        className="hover:opacity-80 transition-opacity"
                      />
                    ))}
                  </Pie>
                  <Tooltip 
                    formatter={(value, name, props) => [
                      `${value}%`,
                      props.payload.name
                    ]}
                    contentStyle={{
                      backgroundColor: 'white',
                      border: '1px solid #e5e7eb',
                      borderRadius: '8px',
                      boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                      fontSize: '14px'
                    }}
                  />
                  <Legend 
                    layout="vertical"
                    align="right"
                    verticalAlign="middle"
                    iconSize={10}
                    iconType="circle"
                    formatter={(value) => <span className="text-sm">{value}</span>}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            
            {/* Legend Info */}
            <div className="mt-4 text-center text-sm text-gray-500">
              <div className="inline-flex items-center gap-4">
                <div className="flex items-center gap-1">
                  <div className="w-3 h-3 rounded-full bg-green-500"></div>
                  <span>Profitable</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-3 h-3 rounded-full bg-red-500"></div>
                  <span>Loss</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-3 h-3 rounded-full bg-gray-500"></div>
                  <span>Neutral</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column - Selected Sector Details */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl shadow p-6 sticky top-4">
            <h2 className="text-lg font-semibold mb-4">Sector Details</h2>
            
            {selectedSector ? (
              <div className="space-y-4 animate-fadeIn">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-gray-500">Sector</span>
                    <div 
                      className="w-4 h-4 rounded-full"
                      style={{ backgroundColor: selectedSector.pieColor }}
                    ></div>
                  </div>
                  <h3 className="text-xl font-bold">{selectedSector.name}</h3>
                </div>
                
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Stocks</span>
                    <span className="font-semibold">{selectedSector.stocks}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Portfolio %</span>
                    <span className="font-semibold">{selectedSector.percentage}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Invested Value</span>
                    <span className="font-semibold">{formatCurrency(selectedSector.investedValue)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Current Value</span>
                    <span className="font-semibold">{formatCurrency(selectedSector.currentValue)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Returns</span>
                    <span className={`font-semibold flex items-center ${selectedSector.returns >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {selectedSector.returns >= 0 ? '+' : ''}{formatCurrency(selectedSector.returns)}
                      {selectedSector.returns >= 0 ? <FiTrendingUp className="ml-1" /> : <FiTrendingDown className="ml-1" />}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Return %</span>
                    <span className={`font-semibold ${selectedSector.returnPercentage >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {formatPercentage(selectedSector.returnPercentage)}
                    </span>
                  </div>
                </div>
                
                <div className="pt-4 border-t border-gray-200">
                  <p className="text-sm text-gray-500">
                    Click on any sector in the chart to view details
                  </p>
                </div>
              </div>
            ) : (
              <div className="text-center py-8">
                <div className="text-gray-400 mb-2">No sector selected</div>
                <p className="text-sm text-gray-500">
                  Click on any sector in the pie chart to view detailed information
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Sector Breakdown List */}
      <div className="mt-8">
        <h2 className="text-lg font-semibold mb-4">All Sectors Breakdown</h2>
        <div className="space-y-3">
          {sectorData.map((item, index) => (
            <div
              key={index}
              className="bg-white rounded-xl p-4 shadow flex justify-between items-center border-l-4 hover:shadow-md transition-all cursor-pointer transform hover:-translate-y-0.5"
              style={{ borderColor: item.borderColor }}
              onClick={() => handleSectorClick(item)}
            >
              {/* Left Section */}
              <div>
                <div className="flex items-center gap-3">
                  <p className="font-semibold text-lg">{item.name}</p>
                  {item.returns >= 0 ? (
                    <FiTrendingUp className="text-green-500" />
                  ) : (
                    <FiTrendingDown className="text-red-500" />
                  )}
                </div>
                <p className="text-sm text-gray-500">
                  {item.stocks} stocks · {item.percentage}% of portfolio
                </p>
              </div>

              {/* Right Section */}
              <div className="text-right">
                <p className="text-black font-semibold text-base">
                  {formatCurrency(item.currentValue)}
                </p>
                <p className={`font-semibold text-base ${item.returns >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {item.returns >= 0 ? '+' : ''}{formatCurrency(item.returns)}
                  <span className="text-sm ml-2">
                    ({formatPercentage(item.returnPercentage)})
                  </span>
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div className="mt-8 pt-6 border-t border-gray-200">
        <div className="flex justify-between items-center">
          <p className="text-xs text-gray-400">
            All data is computed as of previous trading day
          </p>
          <div className="flex items-center gap-2 text-xs text-gray-400">
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
            <span>Last updated: {lastUpdated}</span>
          </div>
        </div>
        {error && (
          <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-600">
            ⚠️ {error}
          </div>
        )}
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
      `}</style>
    </div>
  );
}