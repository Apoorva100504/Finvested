import React, { useState, useEffect } from "react";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { FiRefreshCw, FiInfo, FiTrendingUp, FiTrendingDown } from "react-icons/fi";

// Mock API endpoint - replace with your actual backend URL
const API_ENDPOINT = "https://api.yourdomain.com/portfolio/sector-breakdown";

// Sample data structure expected from backend
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
        investedValue: 238915.82,
        returns: 44230.56,
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

// Color system with aquaMint mixed in
const NEON_BLUE = "#5064FF";
const AQUA_MINT = "#48E1C4";
const AQUA_MINT_DARK = "#3BC9B0";
const AQUA_MINT_LIGHT = "#E8FCF8";
const AQUA_MINT_VERY_LIGHT = "#F7FEFD";

// Mixed color combinations with aquaMint
const MIXED_COLORS = {
  // AquaMint + Neon Blue mix
  aquaBlueMix: "#6A8BFF", // 60% blue, 40% aqua
  blueAquaMix: "#5AD8FF", // 40% blue, 60% aqua
  
  // AquaMint + Green mix
  aquaGreenMix: "#48D9A8", // 70% aqua, 30% green
  greenAquaMix: "#5AE1C4", // 50% green, 50% aqua
  
  // AquaMint + Purple mix
  aquaPurpleMix: "#7A6BFF", // 60% purple, 40% aqua
  purpleAquaMix: "#8B7BFF", // 50% purple, 50% aqua
  
  // AquaMint + Orange mix
  aquaOrangeMix: "#6AD1A4", // 70% aqua, 30% orange
  orangeAquaMix: "#FFC870", // 60% orange, 40% aqua
  
  // AquaMint + Pink mix
  aquaPinkMix: "#6A8BFF", // 60% pink, 40% aqua
  pinkAquaMix: "#FF7BE1", // 70% pink, 30% aqua
};

// Very light shades with aquaMint base
const VERY_LIGHT_SHADES = {
  aquaMint5: "#F7FEFD", // 5% aquaMint
  aquaMint10: "#EFFDFB", // 10% aquaMint
  aquaMint15: "#E8FCF8", // 15% aquaMint
  aquaMint20: "#E0FAF6", // 20% aquaMint
  aquaMint25: "#D9F9F3", // 25% aquaMint
  blueAquaMix5: "#F7F9FF", // 5% blue-aqua mix
  blueAquaMix10: "#EFF3FF", // 10% blue-aqua mix
  blueAquaMix15: "#E8EDFF", // 15% blue-aqua mix
};

// Pie chart colors with aquaMint mixed
const PIE_COLORS = [
  MIXED_COLORS.aquaBlueMix,    // Sector 1
  MIXED_COLORS.aquaGreenMix,   // Sector 2
  MIXED_COLORS.aquaPurpleMix,  // Sector 3
  MIXED_COLORS.aquaOrangeMix,  // Sector 4
  MIXED_COLORS.aquaPinkMix,    // Sector 5
  "#4FFFC6",                   // Additional aqua variant
  "#7BA9FF",                   // Additional blue variant
];

const formatCurrency = (v) => `₹${v.toLocaleString("en-IN")}`;

// Function to blend colors
const blendColors = (color1, color2, percentage = 50) => {
  // Simple color blending (you can use a more sophisticated method if needed)
  return percentage >= 50 ? color1 : color2;
};

// 3D Hover Effect Component Wrapper
const Card3DWrapper = ({ children, className = "", intensity = 3, ...props }) => {
  const handleMouseMove = (e) => {
    const card = e.currentTarget;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const midX = rect.width / 2;
    const midY = rect.height / 2;

    const rotateX = ((y - midY) / midY) * -intensity;
    const rotateY = ((x - midX) / midX) * intensity;

    card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-5px)`;
    card.style.boxShadow = `${rotateY * 2}px ${rotateX * 2}px 25px rgba(72, 225, 196, 0.15)`;
  };

  const handleMouseLeave = (e) => {
    const card = e.currentTarget;
    card.style.transform = "perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0px)";
    card.style.boxShadow = "";
  };

  return (
    <div
      className={`transform-style-3d transition-transform duration-300 ease-out ${className}`}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      {...props}
    >
      {children}
    </div>
  );
};

// Enhanced Hover Card Component with aquaMint shades
const HoverCard = ({ children, className = "", intensity = "medium", ...props }) => {
  const getGlowColor = () => {
    switch(intensity) {
      case "light": return "rgba(72, 225, 196, 0.15)";
      case "medium": return "rgba(72, 225, 196, 0.25)";
      case "strong": return "rgba(72, 225, 196, 0.35)";
      default: return "rgba(72, 225, 196, 0.25)";
    }
  };

  const getBackground = () => {
    switch(intensity) {
      case "light": return VERY_LIGHT_SHADES.aquaMint5;
      case "medium": return VERY_LIGHT_SHADES.aquaMint10;
      case "strong": return VERY_LIGHT_SHADES.aquaMint15;
      default: return VERY_LIGHT_SHADES.aquaMint10;
    }
  };

  return (
    <div
      className={`
        backdrop-blur-lg 
        border border-aquaMint/20
        rounded-xl p-5 shadow-sm
        
        hover:-translate-y-1 
        hover:shadow-[0_4px_25px_${getGlowColor()}]
        hover:border-aquaMint/30
        
        transition-all duration-400 ease-out cursor-pointer 
        group relative
        ${className}
      `}
      style={{ backgroundColor: getBackground() }}
      {...props}
    >
      {children}
    </div>
  );
};

export default function PortfolioUI() {
  const [sectorData, setSectorData] = useState([]);
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState("Just now");
  const [selectedSector, setSelectedSector] = useState(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Function to determine color based on returns with aquaMint influence
  const getReturnColor = (investedValue, currentValue) => {
    if (currentValue > investedValue) {
      // Green with aquaMint influence
      return blendColors("#10B981", AQUA_MINT, 70); // 70% green, 30% aqua
    }
    if (currentValue < investedValue) {
      // Red with subtle aquaMint influence
      return blendColors("#EF4444", AQUA_MINT, 20); // 80% red, 20% aqua
    }
    // Neutral with aquaMint influence
    return blendColors("#6B7280", AQUA_MINT, 30); // 70% gray, 30% aqua
  };

  // Function to get a very light shade based on sector
  const getLightShade = (index) => {
    const shades = [
      VERY_LIGHT_SHADES.aquaMint5,
      VERY_LIGHT_SHADES.aquaMint10,
      VERY_LIGHT_SHADES.aquaMint15,
      VERY_LIGHT_SHADES.aquaMint20,
      VERY_LIGHT_SHADES.blueAquaMix5,
      VERY_LIGHT_SHADES.blueAquaMix10,
      VERY_LIGHT_SHADES.blueAquaMix15,
    ];
    return shades[index % shades.length];
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
      setIsRefreshing(true);
      
      // For demo, simulate API delay
      await new Promise(resolve => setTimeout(resolve, 800));
      
      const data = SAMPLE_API_RESPONSE;
      
      if (data.success) {
        // Process sectors with dynamic colors
        const processedSectors = data.data.sectors.map((sector, index) => ({
          ...sector,
          // Determine color based on returns (currentValue vs investedValue)
          borderColor: getReturnColor(sector.investedValue, sector.currentValue),
          // Use mixed colors for pie chart
          pieColor: PIE_COLORS[index % PIE_COLORS.length],
          // Get light shade for backgrounds
          lightShade: getLightShade(index),
          // Calculate return percentage for display
          returnPercentage: ((sector.returns / sector.investedValue) * 100).toFixed(2),
          // Get a gradient for visual effects
          gradient: `linear-gradient(135deg, ${PIE_COLORS[index % PIE_COLORS.length]}, ${AQUA_MINT})`
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
        lightShade: getLightShade(index),
        returnPercentage: ((sector.returns / sector.investedValue) * 100).toFixed(2),
        gradient: `linear-gradient(135deg, ${PIE_COLORS[index % PIE_COLORS.length]}, ${AQUA_MINT})`
      }));
      setSectorData(fallbackData);
      setSummary(SAMPLE_API_RESPONSE.data.summary);
    } finally {
      setLoading(false);
      setIsRefreshing(false);
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
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-aquaMint/5 to-white px-32">
        <Card3DWrapper intensity={2}>
          <div className="text-center p-8 rounded-xl border border-aquaMint/20 bg-white/80 backdrop-blur-sm">
            {/* Animated aquaMint spinner */}
            <div 
              className="animate-spin rounded-full h-16 w-16 border-4 border-aquaMint/20 border-t-aquaMint mx-auto mb-6"
              style={{ 
                boxShadow: `0 0 15px ${AQUA_MINT}40`,
                background: `linear-gradient(135deg, ${VERY_LIGHT_SHADES.aquaMint10}, ${VERY_LIGHT_SHADES.aquaMint20})`
              }}
            ></div>

            {/* Gradient Title with aquaMint */}
            <h3 
              className="text-xl font-semibold mb-3"
              style={{
                background: `linear-gradient(135deg, ${NEON_BLUE}, ${AQUA_MINT})`,
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text'
              }}
            >
              Loading Portfolio Analysis
            </h3>
            <p className="text-gray-600">Fetching your investment data...</p>
            
            {/* Subtle aquaMint pulse effect */}
            <div className="mt-4 flex justify-center">
              <div className="flex space-x-1">
                {[1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className="w-2 h-2 rounded-full bg-aquaMint/50 animate-pulse"
                    style={{ animationDelay: `${i * 0.15}s` }}
                  ></div>
                ))}
              </div>
            </div>
          </div>
        </Card3DWrapper>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-aquaMint/1 to-white px-32">
      {/* Header with Summary and Refresh */}
      <div className="mb-8 pt-8">
        <div className="flex justify-between items-center mb-8">
          
            <div className="group">
              {/* Title with aquaMint gradient */}
             <h1 className="text-4xl font-bold text-gray-600">
  Portfolio Sector Analysis
</h1>

{/* Subtitle with aquaMint underline */}
<div className="flex items-center gap-3 relative">
  <p className="text-gray-700 text-sm relative z-10">
    Diversification across sectors
  </p>
  {/* Light underline effect */}
  <span className="absolute bottom-0 left-0 w-full h-1 rounded-full bg-gradient-to-r from-[#48E1C4]/50 to-[#5064FF]/50 blur-md z-0"></span>


                
                
              </div>
            </div>
          
        </div>
        
        {/* Summary Cards with aquaMint light shades */}
        {summary && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            {[
              {
                label: "Total Value",
                value: formatCurrency(summary.totalValue),
                positive: true,
                icon: "💰",
                description: "Current portfolio value",
                intensity: "low"
              },
              {
                label: "Total Returns",
                value: (summary.totalReturns >= 0 ? "+" : "") + formatCurrency(summary.totalReturns),
                positive: summary.totalReturns >= 0,
                icon: summary.totalReturns >= 0 ? "📈" : "📉",
                description: "Total profit/loss",
                intensity: "low"
              },
              {
                label: "Return %",
                value: formatPercentage(summary.overallReturnPercentage),
                positive: summary.overallReturnPercentage >= 0,
                icon: summary.overallReturnPercentage >= 0 ? "🔥" : "⚠️",
                description: "Overall return percentage",
                intensity: "low"
              },
              {
                label: "Total Stocks",
                value: summary.totalStocks,
                positive: true,
                icon: "📦",
                description: "Number of holdings",
                intensity: "low"
              }
            ].map((item, i) => (
              <Card3DWrapper key={i} intensity={3}>
                <HoverCard intensity={item.intensity}>
                  {/* Icon with aquaMint glow */}
                  <div 
                    className="text-3xl mb-3 transition-all duration-400 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:scale-110"
                    style={{ 
                      textShadow: `0 0 10px ${AQUA_MINT}40`,
                      filter: 'drop-shadow(0 2px 4px rgba(72, 225, 196, 0.3))'
                    }}
                  >
                    {item.icon}
                  </div>

                  {/* Label */}
                  <p className="text-sm text-gray-600 mb-1 group-hover:text-gray-700 transition-colors duration-300">
                    {item.label}
                  </p>

                  {/* Value with aquaMint gradient */}
                  <p 
                    className="text-2xl font-bold transition-all duration-400 group-hover:scale-105"
                    style={{
                      background: `linear-gradient(135deg, ${NEON_BLUE}, ${AQUA_MINT})`,
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      backgroundClip: 'text'
                    }}
                  >
                    {item.value}
                  </p>

                  {/* Description */}
                  <p className="text-xs text-aquaMintDark/70 mt-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    {item.description}
                  </p>

                  {/* Status Indicator with aquaMint glow */}
                  <div 
                    className={`absolute bottom-3 right-3 w-2 h-2 rounded-full transition-all duration-300 group-hover:scale-150 ${
                      item.positive ? 'bg-green-500' : 'bg-red-500'
                    }`}
                    style={{
                      boxShadow: `0 0 8px ${item.positive ? AQUA_MINT : '#EF4444'}80`
                    }}
                  ></div>

                  {/* AquaMint corner accent */}
                  <div className="absolute top-0 right-0 w-4 h-4 overflow-hidden">
                    <div 
                      className="absolute top-0 right-0 w-8 h-8 bg-aquaMint/20 transform rotate-45 translate-x-4 -translate-y-4"
                    ></div>
                  </div>
                </HoverCard>
              </Card3DWrapper>
            ))}
          </div>
        )}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column - Pie Chart */}
        <div className="lg:col-span-2">
          <Card3DWrapper intensity={2}>
            <HoverCard className="h-full" intensity="light">
              <div className="flex justify-between items-center mb-6">
                <h2 
                  className="text-xl font-semibold"
                  style={{
                    background: `linear-gradient(135deg, ${NEON_BLUE}, ${AQUA_MINT})`,
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text'
                  }}
                >
                  Sector Distribution
                </h2>
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2 text-sm text-gray-500 group-hover:text-gray-600 transition-colors duration-300">
                    <FiInfo size={16} className="text-aquaMintDark" />
                    <span>Hover for details</span>
                  </div>
                  <div 
                    className="w-8 h-8 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300"
                    style={{
                      background: `linear-gradient(135deg, ${AQUA_MINT}, ${NEON_BLUE})`,
                      boxShadow: `0 0 10px ${AQUA_MINT}40`
                    }}
                  >
                    <span className="text-white text-sm font-bold">{summary?.totalSectors || 5}</span>
                  </div>
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
                          stroke={VERY_LIGHT_SHADES.aquaMint10}
                          strokeWidth={2}
                          className="transition-all duration-300 hover:opacity-80 hover:scale-105"
                          style={{ filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.1))' }}
                        />
                      ))}
                    </Pie>

                    <Tooltip
                      formatter={(value, name, props) => [
                        `${value}%`,
                        props.payload.name
                      ]}
                      contentStyle={{
                        backgroundColor: VERY_LIGHT_SHADES.aquaMint10,
                        border: `1px solid ${AQUA_MINT}30`,
                        borderRadius: '8px',
                        boxShadow: `0 4px 20px ${AQUA_MINT}20`,
                        fontSize: '14px',
                        backdropFilter: 'blur(10px)'
                      }}
                    />

                    <Legend
                      layout="vertical"
                      align="right"
                      verticalAlign="middle"
                      iconSize={12}
                      iconType="circle"
                      formatter={(value) => (
                        <span className="text-sm group-hover:text-gray-700 transition-colors duration-200">
                          {value}
                        </span>
                      )}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              {/* Legend Info with aquaMint styling */}
              <div className="mt-6">
                <div className="flex flex-wrap gap-4 justify-center">
                  <div 
                    className="flex items-center gap-2 px-3 py-2 rounded-lg transition-all duration-300 cursor-pointer group"
                    style={{ backgroundColor: VERY_LIGHT_SHADES.aquaMint5 }}
                  >
                    <div 
                      className="w-3 h-3 rounded-full transition-transform duration-300 group-hover:scale-125"
                      style={{ backgroundColor: MIXED_COLORS.aquaBlueMix }}
                    ></div>
                    <span className="text-sm text-gray-600 group-hover:text-gray-800">Profitable</span>
                  </div>
                  <div 
                    className="flex items-center gap-2 px-3 py-2 rounded-lg transition-all duration-300 cursor-pointer group"
                    style={{ backgroundColor: VERY_LIGHT_SHADES.aquaMint10 }}
                  >
                    <div 
                      className="w-3 h-3 rounded-full transition-transform duration-300 group-hover:scale-125"
                      style={{ backgroundColor: MIXED_COLORS.aquaGreenMix }}
                    ></div>
                    <span className="text-sm text-gray-600 group-hover:text-gray-800">Neutral</span>
                  </div>
                  <div 
                    className="flex items-center gap-2 px-3 py-2 rounded-lg transition-all duration-300 cursor-pointer group"
                    style={{ backgroundColor: VERY_LIGHT_SHADES.aquaMint15 }}
                  >
                    <div 
                      className="w-3 h-3 rounded-full transition-transform duration-300 group-hover:scale-125"
                      style={{ backgroundColor: MIXED_COLORS.aquaPurpleMix }}
                    ></div>
                    <span className="text-sm text-gray-600 group-hover:text-gray-800">Loss</span>
                  </div>
                </div>
              </div>
            </HoverCard>
          </Card3DWrapper>
        </div>

        {/* Right Column - Selected Sector Details */}
        <div className="lg:col-span-1">
          <Card3DWrapper intensity={2}>
            <HoverCard className="h-full" intensity="light">
              <div className="flex justify-between items-center mb-6">
                <h2 
                  className="text-xl font-semibold"
                  style={{
                    background: `linear-gradient(135deg, ${NEON_BLUE}, ${AQUA_MINT})`,
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text'
                  }}
                >
                  Sector Details
                </h2>
                <div 
                  className="w-8 h-8 rounded-full flex items-center justify-center group-hover:rotate-12 transition-transform duration-300"
                  style={{
                    background: `linear-gradient(135deg, ${AQUA_MINT}, ${NEON_BLUE})`,
                    boxShadow: `0 0 10px ${AQUA_MINT}40`
                  }}
                >
                  <span className="text-white text-sm font-bold">i</span>
                </div>
              </div>
              
              {selectedSector ? (
                <div className="space-y-6 animate-fadeIn">
                  {/* Sector Header with gradient background */}
                  <div 
                    className="flex items-center gap-4 p-4 rounded-xl"
                    style={{ 
                      background: `linear-gradient(135deg, ${selectedSector.lightShade}, ${VERY_LIGHT_SHADES.aquaMint10})`,
                      border: `1px solid ${AQUA_MINT}20`
                    }}
                  >
                    <div 
                      className="w-12 h-12 rounded-xl flex items-center justify-center text-white font-bold text-lg transition-transform duration-300 group-hover:scale-110"
                      style={{ 
                        background: selectedSector.gradient,
                        boxShadow: `0 4px 15px ${selectedSector.pieColor}40`
                      }}
                    >
                      {selectedSector.name.charAt(0)}
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-gray-900">{selectedSector.name}</h3>
                      <p className="text-sm text-gray-500">{selectedSector.stocks} stocks</p>
                    </div>
                  </div>
                  
                  {/* Stats Grid with aquaMint backgrounds */}
                  <div className="grid grid-cols-2 gap-4">
                    <div 
                      className="p-3 rounded-lg transition-colors duration-200 hover:scale-105"
                      style={{ 
                        backgroundColor: VERY_LIGHT_SHADES.aquaMint5,
                        border: `1px solid ${AQUA_MINT}15`
                      }}
                    >
                      <p className="text-xs text-gray-500 mb-1">Portfolio %</p>
                      <p className="font-semibold text-lg">{selectedSector.percentage}%</p>
                    </div>
                    <div 
                      className="p-3 rounded-lg transition-colors duration-200 hover:scale-105"
                      style={{ 
                        backgroundColor: VERY_LIGHT_SHADES.aquaMint10,
                        border: `1px solid ${AQUA_MINT}15`
                      }}
                    >
                      <p className="text-xs text-gray-500 mb-1">Return %</p>
                      <p className={`font-semibold text-lg ${selectedSector.returnPercentage >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {formatPercentage(selectedSector.returnPercentage)}
                      </p>
                    </div>
                  </div>
                  
                  {/* Detailed Values */}
                  <div className="space-y-3">
                    {[
                      { label: "Invested Value", value: formatCurrency(selectedSector.investedValue) },
                      { label: "Current Value", value: formatCurrency(selectedSector.currentValue) },
                    ].map((item, idx) => (
                      <div 
                        key={idx}
                        className="flex justify-between items-center p-3 rounded-lg transition-colors duration-200 hover:bg-aquaMint/5"
                        style={{ border: `1px solid ${AQUA_MINT}10` }}
                      >
                        <span className="text-sm text-gray-600">{item.label}</span>
                        <span className="font-semibold">{item.value}</span>
                      </div>
                    ))}
                    
                    {/* Returns with special styling */}
                    <div 
                      className="flex justify-between items-center p-4 rounded-lg transition-all duration-200 hover:scale-105"
                      style={{ 
                        background: `linear-gradient(135deg, ${selectedSector.returns >= 0 ? VERY_LIGHT_SHADES.aquaMint10 : '#FEE2E2'}, ${selectedSector.returns >= 0 ? VERY_LIGHT_SHADES.aquaMint20 : '#FECACA'})`,
                        border: `1px solid ${selectedSector.returns >= 0 ? AQUA_MINT : '#EF4444'}30`
                      }}
                    >
                      <span className="text-sm text-gray-600">Returns</span>
                      <span className={`font-semibold text-lg flex items-center ${selectedSector.returns >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {selectedSector.returns >= 0 ? '+' : ''}{formatCurrency(selectedSector.returns)}
                        {selectedSector.returns >= 0 ? 
                          <FiTrendingUp className="ml-2" style={{ filter: `drop-shadow(0 0 4px ${AQUA_MINT}40)` }} /> : 
                          <FiTrendingDown className="ml-2" />
                        }
                      </span>
                    </div>
                  </div>
                  
                  {/* Performance Indicator with aquaMint */}
                  <div className="pt-4 border-t border-aquaMint/20">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-gray-600">Performance</span>
                      <span 
                        className={`text-sm font-medium px-3 py-1 rounded-full ${
                          selectedSector.returns >= 0 ? 
                            'bg-green-100 text-green-800 border border-green-200' : 
                            'bg-red-100 text-red-800 border border-red-200'
                        }`}
                      >
                        {selectedSector.returns >= 0 ? 'Outperforming' : 'Underperforming'}
                      </span>
                    </div>
                    <div 
                      className="h-2 rounded-full overflow-hidden"
                      style={{ backgroundColor: VERY_LIGHT_SHADES.aquaMint20 }}
                    >
                      <div 
                        className="h-full transition-all duration-500"
                        style={{
                          width: `${selectedSector.percentage}%`,
                          background: selectedSector.gradient
                        }}
                      ></div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-10">
                  <div 
                    className="w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300"
                    style={{
                      background: `linear-gradient(135deg, ${VERY_LIGHT_SHADES.aquaMint10}, ${VERY_LIGHT_SHADES.aquaMint20})`,
                      border: `1px solid ${AQUA_MINT}30`
                    }}
                  >
                    <FiInfo className="text-aquaMint" size={24} />
                  </div>
                  <h3 
                    className="text-lg font-semibold mb-2"
                    style={{
                      background: `linear-gradient(135deg, ${NEON_BLUE}, ${AQUA_MINT})`,
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      backgroundClip: 'text'
                    }}
                  >
                    Select a Sector
                  </h3>
                  <p className="text-sm text-gray-500">
                    Click on any sector in the chart to view detailed information
                  </p>
                </div>
              )}
            </HoverCard>
          </Card3DWrapper>
        </div>
      </div>

      {/* Sector Breakdown List */}
      <div className="mt-8">
        <div className="flex justify-between items-center mb-6">
          <h2 
            className="text-xl bg-white font-semibold"
          
          >
            All Sectors Breakdown
          </h2>
          <span 
            className="text-sm text-gray-500 bg-white px-3 py-1 rounded-full"
           
          >
            {sectorData.length} Sectors
          </span>
        </div>
        
        <div className="space-y-4">
          {sectorData.map((item, index) => (
            <Card3DWrapper key={index} intensity={1}>
              <div
                className="group relative rounded-xl p-5 shadow-sm 
                           flex justify-between items-center border-l-4
                           hover:shadow-xl transition-all duration-300 cursor-pointer 
                           hover:-translate-y-1 overflow-hidden"
                style={{ 
                  borderColor: item.borderColor,
                  
                  borderLeftColor: item.pieColor
                }}
                onClick={() => handleSectorClick(item)}
              >
                {/* Animated Gradient Border */}
                <div 
                  className="absolute left-0 top-0 h-full w-1 transition-all duration-300 group-hover:w-2 group-hover:opacity-100 opacity-50"
                  style={{ 
                    background: item.gradient
                  }}
                ></div>

                {/* Sector Icon & Name */}
                <div className="relative z-10 flex items-center gap-4">
                  <div 
                    className="w-10 h-10 rounded-lg flex items-center justify-center text-white font-bold transition-all duration-300 group-hover:scale-110 group-hover:rotate-6"
                    
                  >
                    {item.name.charAt(0)}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="font-semibold text-lg text-gray-800 group-hover:text-gray-900 transition-colors duration-200">
                        {item.name}
                      </p>
                      <div className="transform group-hover:scale-110 transition-transform duration-200">
                        {item.returns >= 0 ? (
                          <FiTrendingUp className="text-green-500" size={18} />
                        ) : (
                          <FiTrendingDown className="text-red-500" size={18} />
                        )}
                      </div>
                    </div>
                    <p className="text-sm text-gray-500 group-hover:text-gray-700 transition-colors duration-200">
                      {item.stocks} stocks · {item.percentage}% of portfolio
                    </p>
                  </div>
                </div>

                {/* Value & Returns */}
                <div className="relative z-10 text-right">
                  <p 
                    className="font-bold text-lg group-hover:text-neonBlue transition-colors duration-200"
                    style={{
                      background: `linear-gradient(135deg, ${NEON_BLUE}, ${AQUA_MINT})`,
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      backgroundClip: 'text'
                    }}
                  >
                    {formatCurrency(item.currentValue)}
                  </p>
                  <div className="relative">
                    <p className={`font-semibold text-base transition-all duration-200 group-hover:translate-x-1 ${
                      item.returns >= 0 ? 'text-green-600 group-hover:text-green-700' : 'text-red-600 group-hover:text-red-700'
                    }`}>
                      {item.returns >= 0 ? '+' : ''}
                      {formatCurrency(item.returns)}
                      <span className="text-sm ml-2 opacity-80 group-hover:opacity-100 transition-opacity duration-200">
                        ({formatPercentage(item.returnPercentage)})
                      </span>
                    </p>
                    {/* Mini performance bar */}
                    <div 
                      className="mt-1 h-1 rounded-full overflow-hidden"
                      style={{ backgroundColor: VERY_LIGHT_SHADES.aquaMint20 }}
                    >
                      <div 
                        className="h-full transition-all duration-500"
                        style={{
                          width: `${item.percentage}%`,
                          background: item.gradient
                        }}
                      ></div>
                    </div>
                  </div>
                </div>

                {/* AquaMint hover glow effect */}
                <div 
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                  style={{
                    background: `linear-gradient(90deg, transparent, ${VERY_LIGHT_SHADES.aquaMint5}, transparent)`,
                    transform: 'translateX(-100%)',
                    animation: 'shimmer 2s infinite'
                  }}
                ></div>
              </div>
            </Card3DWrapper>
          ))}
        </div>
      </div>

      {/* Footer with aquaMint styling */}
      <div className="mt-10 pt-6 border-t border-aquaMint/20">
        <Card3DWrapper intensity={1}>
          <div 
            className="rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow duration-300"
            style={{ 
              backgroundColor: VERY_LIGHT_SHADES.aquaMint5,
              border: `1px solid ${AQUA_MINT}15`
            }}
          >
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-3 group cursor-pointer">
                <div 
                  className="w-3 h-3 rounded-full animate-pulse group-hover:animate-none group-hover:scale-125 transition-all duration-200"
                  style={{ backgroundColor: AQUA_MINT }}
                ></div>
                <div>
                  <p className="text-sm text-gray-400 group-hover:text-gray-600 transition-colors duration-200">
                    Last updated: <span className="font-medium text-aquaMintDark">{lastUpdated}</span>
                  </p>
                  <p className="text-xs text-gray-400 group-hover:text-gray-500 transition-colors duration-200">
                    All data is computed as of previous trading day
                  </p>
                </div>
              </div>
              
              <button
                onClick={handleRefresh}
                className="flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-300 hover:-translate-y-0.5"
                style={{ 
                  backgroundColor: VERY_LIGHT_SHADES.aquaMint10,
                  border: `1px solid ${AQUA_MINT}20`,
                  color: AQUA_MINT_DARK
                }}
              >
                <FiRefreshCw className={`${isRefreshing ? 'animate-spin' : ''}`} size={14} />
                <span className="text-sm font-medium">Refresh</span>
              </button>
            </div>
            
            {error && (
              <div 
                className="mt-4 p-4 rounded-lg text-sm transition-all duration-200 transform hover:scale-[1.005] cursor-pointer"
                style={{ 
                  backgroundColor: '#FEF2F2',
                  border: '1px solid #FECACA',
                  color: '#DC2626'
                }}
              >
                <div className="flex items-center gap-2">
                  <div 
                    className="w-2 h-2 rounded-full animate-pulse"
                    style={{ backgroundColor: '#DC2626' }}
                  ></div>
                  <span>⚠️ {error}</span>
                </div>
                <button 
                  onClick={fetchPortfolioData}
                  className="mt-2 text-xs font-medium hover:underline"
                  style={{ color: '#DC2626' }}
                >
                  Try again →
                </button>
              </div>
            )}
          </div>
        </Card3DWrapper>
      </div>

      {/* Add CSS animations */}
      <style >{`
        @keyframes gradient {
          0%, 100% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
        }
        
        @keyframes shimmer {
          0% {
            transform: translateX(-100%);
          }
          100% {
            transform: translateX(100%);
          }
        }
      `}</style>
    </div>
  );
}