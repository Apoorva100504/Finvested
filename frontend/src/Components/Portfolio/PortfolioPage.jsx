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
      totalValue: 11385.01,
      totalReturns: 14950.26,
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
<div className="min-h-screen bg-[#EAFDFC] px-4 md:px-32 py-6 text-gray-900 font-sans">


      {/* Header with Summary and Refresh */}
      <div className="mb-8 px-32">
        <div className="flex justify-between items-center mb-6">
  <div 
    className="group animate-fadeInUp"
  >
    {/* Title */}
  <h1
  className="
    text-3xl font-bold
    bg-gradient-to-r from-neonBlue via-aquaMintDark to-neonBlue
    bg-clip-text text-transparent
    transition-all duration-300
    group-hover:tracking-wide
  "
>
  Portfolio Sector Analysis
</h1>


    {/* Subtitle */}
    <p 
      className="text-neonBlue text-sm mt-1 relative inline-block 
        group-hover:font-medium
      "
    >
      Diversification across sectors

      {/* Underline hover glow */}
      <span className="absolute left-0 -bottom-1 w-0 h-[2px] bg-aquaMintDark
        rounded-full transition-all duration-300 group-hover:w-full">
      </span>
    </p>
  </div>

          
        </div>
        
       {/* Summary Cards */}
{summary && (
  <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">

    {[
      {
        label: "Total Value",
        value: formatCurrency(summary.totalValue),
        positive: true,
        icon: "💰"
      },
      {
        label: "Total Returns",
        value:
          (summary.totalReturns >= 0 ? "+" : "") +
          formatCurrency(summary.totalReturns),
        positive: summary.totalReturns >= 0,
        icon: summary.totalReturns >= 0 ? "📈" : "📉"
      },
      {
        label: "Return %",
        value: formatPercentage(summary.overallReturnPercentage),
        positive: summary.overallReturnPercentage >= 0,
        icon: summary.overallReturnPercentage >= 0 ? "🔥" : "⚠️"
      },
      {
        label: "Total Stocks",
        value: summary.totalStocks,
        positive: true,
        icon: "📦"
      }
    ].map((item, i) => (
      <div
        key={i}

  className="
    bg-aquaMintDark/5 backdrop-blur-lg 
    border border-neonBlue/30
    rounded-xl p-5 shadow-sm

    hover:-translate-y-1 
    hover:shadow-[0_4px_25px_rgba(80,100,255,0.25)]
    hover:border-neonBlue/50 hover:bg-aquaMintDark/10

    transition-all duration-400 ease-out cursor-pointer 
    group relative
  "
  style={{ transformStyle: "preserve-3d" }}
  onMouseMove={(e) => {
    const card = e.currentTarget;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const midX = rect.width / 2;
    const midY = rect.height / 2;

    const rotateX = ((y - midY) / midY) * -3;
    const rotateY = ((x - midX) / midX) * 3;

    card.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-3px)`;
  }}
  onMouseLeave={(e) => {
    e.currentTarget.style.transform =
      "rotateX(0deg) rotateY(0deg) translateY(0px)";
  }}
>

  {/* Icon */}
  <div className="
    text-2xl mb-2 transition-all duration-400
    group-hover:translate-x-0.5 group-hover:-translate-y-0.5
  ">
    {item.icon}
  </div>

  {/* Label */}
  <p className="text-sm text-gray-600 mb-1">{item.label}</p>

  {/* Value */}
  <p
    className="
      text-xl font-semibold transition-all duration-400
      bg-gradient-to-r from-neonBlue via-aquaMintDark to-neonBlue
      bg-clip-text text-transparent
      group-hover:scale-105
    "
  >
    {item.value}
  </p>

</div>


    ))}
  </div>
)}

</div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
     {/* Left Column - Pie Chart */}
<div className="lg:col-span-2">
  <div
    className="
      bg-aquaMintDark/10 border border-neonBlue/30 
      rounded-xl shadow p-6

      hover:bg-aquaMintDark/20 
      hover:border-neonBlue/50 
      hover:shadow-[0_4px_20px_rgba(80,100,255,0.2)]
      hover:-translate-y-1

      transition-all duration-300 ease-out
    "
  >
    <div className="flex justify-between items-center mb-4">
      <h2 className="text-lg font-semibold 
        bg-gradient-to-r from-neonBlue via-aquaMintDark to-neonBlue 
        bg-clip-text text-transparent">
        Sector Distribution
      </h2>

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
                className="
                  transition-all duration-300 
                  hover:opacity-80 hover:scale-105
                "
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
              fontSize: '14px',
              transition: 'all 0.3s ease'
            }}
          />

          <Legend
            layout="vertical"
            align="right"
            verticalAlign="middle"
            iconSize={10}
            iconType="circle"
            formatter={(value) => (
              <span className="text-sm">{value}</span>
            )}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>

    {/* Legend Info */}
    <div className="mt-4 text-center text-sm text-gray-500">
      <div className="inline-flex items-center gap-4">

        <div className="flex items-center gap-1">
          <div className="w-3 h-3 rounded-full bg-neonBlue transition-transform duration-300 hover:scale-125"></div>
          <span>Profitable</span>
        </div>

        <div className="flex items-center gap-1">
          <div className="w-3 h-3 rounded-full bg-aquaMintDark transition-transform duration-300 hover:scale-125"></div>
          <span>Loss</span>
        </div>

        <div className="flex items-center gap-1">
          <div className="w-3 h-3 rounded-full bg-gray-400 transition-transform duration-300 hover:scale-125"></div>
          <span>Neutral</span>
        </div>

      </div>
    </div>

  </div>


</div>

{/* Right Column - Selected Sector Details */}
<div className="lg:col-span-1">
  <div cclassName="
      bg-aquaMintDark/10 border border-neonBlue/30
      rounded-xl shadow p-6 sticky top-4
      hover:bg-aquaMintDark/20 hover:border-neonBlue/50
      hover:shadow-[0_4px_20px_rgba(80,100,255,0.25)]
      hover:-translate-y-1
      transition-all duration-300 ease-out
    ">
    <h2 className="text-lg font-semibold mb-4 
      bg-gradient-to-r from-neonBlue via-aquaMintDark to-neonBlue
      bg-clip-text text-transparent">Sector Details</h2>
    
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
            <span className={`font-semibold flex items-center ${selectedSector.returns >= 0 ? 'text-neonBlue': 'text-red-600'}`}>
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
  <h2 className="text-lg font-semibold mb-4
    bg-gradient-to-r from-neonBlue via-aquaMintDark to-neonBlue
    bg-clip-text text-transparent">All Sectors Breakdown</h2>
  <div className="space-y-3">
    {sectorData.map((item, index) => (
      <div
  key={index}
  className="group relative bg-white rounded-xl p-4 shadow-[0_2px_10px_rgba(0,0,0,0.05)] 
             flex justify-between items-center border-l-4 border-transparent
             hover:shadow-xl transition-all duration-300 cursor-pointer transform 
             hover:-translate-y-1 hover:scale-[1.005] overflow-hidden"
  style={{ borderColor: item.borderColor }}
  onClick={() => handleSectorClick(item)}
>

        {/* Gradient overlay on hover */}
        <div className="group relative bg-white rounded-xl p-4
          shadow-[0_2px_10px_rgba(0,0,0,0.05)]
          flex justify-between items-center
          border-l-4 border-transparent
          hover:shadow-[0_4px_20px_rgba(80,100,255,0.15)]
          hover:border-neonBlue
          transition-all duration-300 cursor-pointer
          transform hover:-translate-y-1 hover:scale-[1.005]
          overflow-hidden"></div>
        
        {/* Animated border */}
        <div 
          className="absolute left-0 top-0 h-full w-1 transition-all duration-300 group-hover:w-4 group-hover:opacity-100 opacity-50"
          style={{ backgroundColor: item.borderColor }}
        ></div>

        {/* Left Section */}
        <div className="relative z-10">
          <div className="flex items-center gap-3">
            <p className="font-semibold text-lg text-gray-800 group-hover:text-gray-900 transition-colors duration-200">
              {item.name}
            </p>
            <div className="transform group-hover:scale-110 transition-transform duration-200">
              {item.returns >= 0 ? (
                <FiTrendingUp className="text-neonBlue" />
              ) : (
                <FiTrendingDown className="text-red-500" />
              )}
            </div>
          </div>
          <p className="text-sm text-gray-500 group-hover:text-gray-700 transition-colors duration-200 mt-1">
            {item.stocks} stocks · {item.percentage}% of portfolio
          </p>
        </div>
{/* Right Section */}
<div className="relative z-10 text-right">
  <p className="font-semibold">
    {formatCurrency(item.currentValue)}
  </p>

  <div className="relative">
    <p
      className={`
        font-semibold text-base transition-all duration-200
        group-hover:translate-x-1
        ${item.returns >= 0
          ? 'text-neonBlue group-hover:text-aquaMintDark'
          : 'text-red-500 group-hover:text-red-600'
        }
      `}
    >
      {item.returns >= 0 ? '+' : ''}
      {formatCurrency(item.returns)}

      <span
        className="
          text-sm ml-2 opacity-80
          group-hover:opacity-100
          transition-opacity duration-200
        "
      >
        ({formatPercentage(item.returnPercentage)})
      </span>
    </p>
  </div>
</div>

      </div>
    ))}
  </div>
</div>

{/* Footer */}
<div className="mt-8 pt-6 border-t border-gray-200 group">
  <div className="flex justify-between items-center">
    
    <p className="text-xs text-gray-400 group-hover:text-gray-600 transition-colors duration-200 cursor-default">
      All data is computed as of previous trading day
    </p>

    <div className="flex items-center gap-2 text-xs text-gray-400 group-hover:text-gray-600 transition-colors duration-200 cursor-default">
      <div className="
        w-2 h-2 rounded-full bg-aquaMintDark animate-pulse
        group-hover:animate-none group-hover:scale-125
        transition-all duration-200
      "></div>

      <span>Last updated: {lastUpdated}</span>
    </div>
  </div>

  {error && (
    <div className="
      mt-4 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-600
      hover:bg-red-100 hover:border-red-300 transition-all duration-200 
      transform hover:scale-[1.005] cursor-pointer
    ">
      ⚠️ {error}
    </div>
  )}
</div>

    </div>
  );
}