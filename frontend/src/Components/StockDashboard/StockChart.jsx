import React from 'react';

const StockChart = ({ historicalData }) => {
  // Debug: Log what we're receiving
  console.log('StockChart - historicalData:', historicalData);
  console.log('Type:', typeof historicalData);
  console.log('Is array?', Array.isArray(historicalData));
  console.log('Length:', historicalData?.length || 0);
  
  // Check if we have valid data
  const isValidData = Array.isArray(historicalData) && 
                     historicalData.length > 0 && 
                     historicalData.every(item => {
                       const hasValidPrice = item && 
                                            item.price !== undefined && 
                                            item.price !== null &&
                                            !isNaN(Number(item.price));
                       return hasValidPrice;
                     });

  if (!isValidData) {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center bg-gray-50 rounded-lg">
        <div className="text-gray-400 mb-3">
          <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
        </div>
        <h3 className="text-lg font-semibold text-gray-700 mb-1">Chart Loading...</h3>
        <p className="text-sm text-gray-500 text-center px-4">
          {historicalData ? 'Processing chart data...' : 'Fetching historical data...'}
        </p>
        <div className="mt-4 flex gap-2">
          <div className="h-2 w-2 bg-gray-300 rounded-full animate-pulse"></div>
          <div className="h-2 w-2 bg-gray-300 rounded-full animate-pulse" style={{animationDelay: '0.2s'}}></div>
          <div className="h-2 w-2 bg-gray-300 rounded-full animate-pulse" style={{animationDelay: '0.4s'}}></div>
        </div>
      </div>
    );
  }

  // Calculate dynamic chart values
  const prices = historicalData.map(d => Number(d.price));
  const minPrice = Math.min(...prices);
  const maxPrice = Math.max(...prices);
  
  // Calculate dynamic Y-axis tick values
  const getYTickValues = () => {
    const tickCount = Math.min(5, historicalData.length);
    const step = (maxPrice - minPrice) / (tickCount - 1);
    const ticks = [];
    
    for (let i = 0; i < tickCount; i++) {
      let tickValue;
      if (i === 0) tickValue = minPrice;
      else if (i === tickCount - 1) tickValue = maxPrice;
      else tickValue = minPrice + (step * i);
      
      ticks.push({
        value: tickValue,
        label: `₹${tickValue.toFixed(2)}`,
        position: i / (tickCount - 1)
      });
    }
    
    return ticks;
  };

  const yTicks = getYTickValues();
  
  // Add padding for visualization
  const padding = (maxPrice - minPrice) * 0.1;
  const paddedMin = minPrice - padding;
  const paddedMax = maxPrice + padding;
  const range = paddedMax - paddedMin;
  
  const isPositive = historicalData[historicalData.length - 1].price > historicalData[0].price;

  // Calculate X-axis labels dynamically
  const getXLabels = () => {
    if (historicalData.length <= 3) {
      return historicalData.map(item => item.time);
    }
    
    const first = historicalData[0].time;
    const last = historicalData[historicalData.length - 1].time;
    
    let middle;
    if (historicalData.length >= 5) {
      middle = historicalData[Math.floor(historicalData.length / 2)].time;
    } else {
      middle = historicalData[Math.floor(historicalData.length / 2)]?.time || '';
    }
    
    return [first, middle, last].filter(Boolean);
  };

  const xLabels = getXLabels();

  return (
    <div className="relative w-full h-full">
      {/* Grid background */}
      <div className="absolute inset-0">
        {yTicks.map((tick, index) => (
          <div 
            key={index}
            className="absolute left-0 right-0 border-t border-gray-100"
            style={{ top: `${(1 - tick.position) * 100}%` }}
          ></div>
        ))}
      </div>

      {/* Chart area */}
      <svg 
        className="absolute inset-0 w-full h-full" 
        preserveAspectRatio="none"
        viewBox="0 0 100 100"
      >
        {/* Line path */}
        <path
          d={historicalData.map((point, index) => {
            const x = (index / (historicalData.length - 1)) * 100;
            const y = 100 - ((Number(point.price) - paddedMin) / range) * 100;
            return `${index === 0 ? 'M' : 'L'} ${x} ${y}`;
          }).join(' ')}
          stroke={isPositive ? '#10b981' : '#ef4444'}
          strokeWidth="2.5"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        
        {/* Area under the curve gradient */}
        <defs>
          <linearGradient id="chartGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor={isPositive ? 'rgba(16, 185, 129, 0.2)' : 'rgba(239, 68, 68, 0.2)'} />
            <stop offset="100%" stopColor={isPositive ? 'rgba(16, 185, 129, 0)' : 'rgba(239, 68, 68, 0)'} />
          </linearGradient>
        </defs>
        
        <path
          d={`
            ${historicalData.map((point, index) => {
              const x = (index / (historicalData.length - 1)) * 100;
              const y = 100 - ((Number(point.price) - paddedMin) / range) * 100;
              return `${index === 0 ? 'M' : 'L'} ${x} ${y}`;
            }).join(' ')}
            L 100 100
            L 0 100
            Z
          `}
          fill="url(#chartGradient)"
        />
      </svg>

      {/* Dynamic Y-axis labels - FIXED with proper z-index */}
      <div className="absolute right-1 top-0 h-full z-30">
        {yTicks.map((tick, index) => (
          <div
            key={index}
            className="absolute text-right bg-white/90 backdrop-blur-sm px-1.5 py-0.5 rounded shadow-sm"
            style={{
              top: `${(1 - tick.position) * 100}%`,
              transform: "translateY(-50%)",
              right: 0,
            }}
          >
            <span className="text-[10px] font-medium text-gray-700 leading-4 tracking-wide">
              {tick.label}
            </span>
          </div>
        ))}
      </div>

      {/* Dynamic X-axis labels */}
      <div className="absolute bottom-2 left-0 right-0 z-20">
        {xLabels.map((label, index) => (
          <div 
            key={index}
            className="absolute text-center"
            style={{
              left: `${(index / (xLabels.length - 1)) * 100}%`,
              transform: index === 0 ? 'translateX(0)' : 
                        index === xLabels.length - 1 ? 'translateX(-100%)' : 'translateX(-50%)',
              bottom: 0
            }}
          >
            <span className="text-xs text-gray-600 bg-white/90 px-2 py-1 rounded shadow-sm">
              {label}
            </span>
          </div>
        ))}
      </div>

      {/* Current price indicator */}
      <div className="absolute top-2 left-2 z-20">
        <div className={`px-3 py-1.5 rounded-lg ${isPositive ? 'bg-green-50 border border-green-200 text-green-800' : 'bg-red-50 border border-red-200 text-red-800'} shadow-sm`}>
          <span className="text-sm font-bold">
            ₹{Number(historicalData[historicalData.length - 1].price).toFixed(2)}
          </span>
          <span className={`ml-1.5 text-xs font-medium ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
            {isPositive ? '↗' : '↘'} 
            {((Number(historicalData[historicalData.length - 1].price) - Number(historicalData[0].price)) / Number(historicalData[0].price) * 100).toFixed(2)}%
          </span>
        </div>
      </div>

      {/* Timeframe indicator */}
      <div className="absolute top-2 right-2 z-20">
        <div className="flex items-center gap-1.5">
          <div className={`w-2.5 h-2.5 rounded-full ${isPositive ? 'bg-green-500' : 'bg-red-500'}`}></div>
          <span className="text-xs font-medium text-gray-700 bg-white/90 px-2.5 py-1 rounded-lg shadow-sm">
            1D
          </span>
        </div>
      </div>
    </div>
  );
};

export default StockChart;