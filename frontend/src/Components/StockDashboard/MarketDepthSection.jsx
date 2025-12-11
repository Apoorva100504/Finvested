import React, { useState } from 'react';

const MarketDepthSection = ({ marketDepth, priceInfo }) => {
  const [hoveredRow, setHoveredRow] = useState(null);
  const [lastPrice, setLastPrice] = useState(priceInfo?.lastPrice || 675.50);

  const formatNumber = (value) => {
    if (!value || isNaN(value)) return '0.00';
    return parseFloat(value).toLocaleString('en-IN', { 
      minimumFractionDigits: 2, 
      maximumFractionDigits: 2 
    });
  };

  // Calculate depth percentages for visualization
  const calculateDepthPercentages = (bids, asks) => {
    if (!bids || !asks) return { bids: [], asks: [] };
    
    const maxBidQuantity = Math.max(...bids.map(b => b.quantity));
    const maxAskQuantity = Math.max(...asks.map(a => a.quantity));
    
    const bidsWithPercent = bids.map(bid => ({
      ...bid,
      percentage: (bid.quantity / maxBidQuantity) * 100
    }));
    
    const asksWithPercent = asks.map(ask => ({
      ...ask,
      percentage: (ask.quantity / maxAskQuantity) * 100
    }));
    
    return { bids: bidsWithPercent, asks: asksWithPercent };
  };

  // Calculate bid-ask spread
  const calculateSpread = () => {
    if (!marketDepth?.bids?.[0] || !marketDepth?.asks?.[0]) return 0;
    const bestAsk = marketDepth.asks[0].price;
    const bestBid = marketDepth.bids[0].price;
    return bestAsk - bestBid;
  };

  const spread = calculateSpread();
  const depthData = calculateDepthPercentages(marketDepth?.bids, marketDepth?.asks);
  
  // Get best bid and ask
  const bestBid = marketDepth?.bids?.[0];
  const bestAsk = marketDepth?.asks?.[0];

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 mb-6 transition-all duration-300 hover:shadow-xl">
      {/* Header with Gradient */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold bg-gray-700 bg-clip-text text-transparent mb-2">
          Market Depth
        </h2>
        
        {/* Spread Indicator */}
        <div className="flex items-center justify-between bg-gradient-to-r from-gray-50 to-white p-4 rounded-lg border border-gray-100">
          <div className="flex items-center gap-4">
            <div className="text-sm text-gray-500">Spread</div>
            <div className="text-lg font-bold text-gray-900">
              {formatNumber(spread)}
            </div>
          </div>
          
          <div className="flex items-center gap-6">
            {bestBid && (
              <div className="text-center group">
                <div className="text-xs text-gray-500 mb-1">Best Bid</div>
                <div className="text-lg font-bold text-green-600 transition-all duration-300 group-hover:scale-110">
                  {formatNumber(bestBid.price)}
                </div>
              </div>
            )}
            
            <div className="text-center">
              <div className="text-xs text-gray-500 mb-1">LTP</div>
              <div className="text-lg font-bold text-blue-600 animate-pulse">
                {formatNumber(lastPrice)}
              </div>
            </div>
            
            {bestAsk && (
              <div className="text-center group">
                <div className="text-xs text-gray-500 mb-1">Best Ask</div>
                <div className="text-lg font-bold text-red-600 transition-all duration-300 group-hover:scale-110">
                  {formatNumber(bestAsk.price)}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Visual Depth Chart */}
      <div className="mb-6">
        <div className="text-sm font-medium text-gray-700 mb-4">Depth Visualization</div>
        <div className="flex h-40 mb-2">
          {/* Bid Side */}
          <div className="flex-1 pr-2">
            <div className="text-xs text-gray-500 mb-1 text-center">Bid Depth</div>
            <div className="h-full flex flex-col-reverse justify-end gap-0.5">
              {depthData.bids?.slice(0, 5).map((bid, index) => (
                <div 
                  key={index}
                  className="relative group transition-all duration-300 hover:shadow-md"
                  style={{ height: '20%' }}
                  onMouseEnter={() => setHoveredRow(`bid-${index}`)}
                  onMouseLeave={() => setHoveredRow(null)}
                >
                  <div 
                    className="absolute inset-0 bg-gradient-to-r from-green-100 to-green-200 rounded-r-lg transition-all duration-300 hover:from-green-200 hover:to-green-300"
                    style={{ 
                      width: `${bid.percentage}%`,
                      right: '0'
                    }}
                  ></div>
                  {hoveredRow === `bid-${index}` && (
                    <div className="absolute left-0 top-1/2 transform -translate-y-1/2 bg-gray-900 text-white text-xs px-2 py-1 rounded shadow-lg z-10">
                      Qty: {bid.quantity.toLocaleString()}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
          
          {/* Middle Line */}
          <div className="w-0.5 bg-gradient-to-b from-gray-300 to-gray-400"></div>
          
          {/* Ask Side */}
          <div className="flex-1 pl-2">
            <div className="text-xs text-gray-500 mb-1 text-center">Ask Depth</div>
            <div className="h-full flex flex-col-reverse justify-end gap-0.5">
              {depthData.asks?.slice(0, 5).map((ask, index) => (
                <div 
                  key={index}
                  className="relative group transition-all duration-300 hover:shadow-md"
                  style={{ height: '20%' }}
                  onMouseEnter={() => setHoveredRow(`ask-${index}`)}
                  onMouseLeave={() => setHoveredRow(null)}
                >
                  <div 
                    className="absolute inset-0 bg-gradient-to-l from-red-100 to-red-200 rounded-l-lg transition-all duration-300 hover:from-red-200 hover:to-red-300"
                    style={{ 
                      width: `${ask.percentage}%`,
                      left: '0'
                    }}
                  ></div>
                  {hoveredRow === `ask-${index}` && (
                    <div className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-gray-900 text-white text-xs px-2 py-1 rounded shadow-lg z-10">
                      Qty: {ask.quantity.toLocaleString()}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Market Depth Table */}
      <div className="overflow-hidden rounded-lg border border-gray-200">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
              <tr>
                <th className="text-left py-4 px-6 text-sm font-semibold text-gray-700">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-green-500"></div>
                    Bid Price
                  </div>
                </th>
                <th className="text-left py-4 px-6 text-sm font-semibold text-gray-700">Quantity</th>
                <th className="text-left py-4 px-6 text-sm font-semibold text-gray-700">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-red-500"></div>
                    Ask Price
                  </div>
                </th>
                <th className="text-left py-4 px-6 text-sm font-semibold text-gray-700">Quantity</th>
              </tr>
            </thead>

            <tbody>
              {marketDepth?.bids && marketDepth?.asks ? (
                marketDepth.bids.slice(0, 5).map((bid, index) => {
                  const ask = marketDepth.asks[index];
                  const isHovered = hoveredRow === `row-${index}`;
                  
                  return (
                    <tr 
                      key={index}
                      className={`transition-all duration-200 ${isHovered ? 'bg-gradient-to-r from-blue-50/30 to-cyan-50/30' : 'hover:bg-gradient-to-r from-gray-50/50 to-gray-100/50'}`}
                      onMouseEnter={() => setHoveredRow(`row-${index}`)}
                      onMouseLeave={() => setHoveredRow(null)}
                    >
                      {/* Bid Price */}
                      <td className={`py-4 px-6 ${isHovered ? 'scale-105' : ''} transition-transform duration-200`}>
                        <div className="flex items-center gap-3 group">
                          <div className="relative">
                            <div className="text-green-600 font-bold group-hover:text-green-700 transition-colors duration-200">
                              {formatNumber(bid.price)}
                            </div>
                            <div className="absolute -left-4 top-1/2 transform -translate-y-1/2 w-2 h-2 bg-green-400 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200"></div>
                          </div>
                        </div>
                      </td>

                      {/* Bid Quantity */}
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-2">
                          <div className="flex-1 h-2 bg-gradient-to-r from-green-100 to-green-200 rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-gradient-to-r from-green-400 to-green-500 rounded-full transition-all duration-300 group-hover:from-green-500 group-hover:to-green-600"
                              style={{ width: `${depthData.bids?.[index]?.percentage || 0}%` }}
                            ></div>
                          </div>
                          <span className="font-medium text-gray-700 min-w-[60px] text-right">
                            {bid.quantity.toLocaleString()}
                          </span>
                        </div>
                      </td>

                      {/* Ask Price */}
                      <td className={`py-4 px-6 ${isHovered ? 'scale-105' : ''} transition-transform duration-200`}>
                        <div className="flex items-center gap-3 group">
                          <div className="relative">
                            <div className="text-red-600 font-bold group-hover:text-red-700 transition-colors duration-200">
                              {ask ? formatNumber(ask.price) : '-'}
                            </div>
                            <div className="absolute -left-4 top-1/2 transform -translate-y-1/2 w-2 h-2 bg-red-400 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200"></div>
                          </div>
                        </div>
                      </td>

                      {/* Ask Quantity */}
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-gray-700 min-w-[60px]">
                            {ask ? ask.quantity.toLocaleString() : '-'}
                          </span>
                          <div className="flex-1 h-2 bg-gradient-to-l from-red-100 to-red-200 rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-gradient-to-l from-red-400 to-red-500 rounded-full transition-all duration-300 group-hover:from-red-500 group-hover:to-red-600"
                              style={{ width: `${depthData.asks?.[index]?.percentage || 0}%` }}
                            ></div>
                          </div>
                        </div>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan="4" className="py-12 text-center">
                    <div className="flex flex-col items-center gap-3">
                      <div className="w-16 h-16 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center">
                        <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                        </svg>
                      </div>
                      <div className="text-gray-500">No market depth data available</div>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>

            <tfoot className="bg-gradient-to-r from-gray-50 to-gray-100">
              <tr>
                <td colSpan="2" className="py-4 px-6">
                  <div className="flex items-center gap-3">
                    <span className="font-semibold text-gray-700">Total Bid</span>
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  </div>
                </td>
                <td colSpan="2" className="py-4 px-6 text-right">
                  <span className="text-xl font-bold text-gray-900 bg-gradient-to-r from-green-50 to-green-100 px-4 py-2 rounded-lg">
                    {marketDepth?.bidTotal ? marketDepth.bidTotal.toLocaleString() : '0'}
                  </span>
                </td>
              </tr>
              <tr>
                <td colSpan="2" className="py-4 px-6">
                  <div className="flex items-center gap-3">
                    <span className="font-semibold text-gray-700">Total Ask</span>
                    <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                  </div>
                </td>
                <td colSpan="2" className="py-4 px-6 text-right">
                  <span className="text-xl font-bold text-gray-900 bg-gradient-to-r from-red-50 to-red-100 px-4 py-2 rounded-lg">
                    {marketDepth?.askTotal ? marketDepth.askTotal.toLocaleString() : '0'}
                  </span>
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>

      
    </div>
  );
};

export default MarketDepthSection;