import React from 'react';

const MarketDepthSection = ({ marketDepth, priceInfo }) => {
  const formatNumber = (value) => {
    if (!value || isNaN(value)) return '0.00';
    return parseFloat(value).toLocaleString('en-IN', { 
      minimumFractionDigits: 2, 
      maximumFractionDigits: 2 
    });
  };

  return (
    <div className="bg-white rounded-lg shadow p-6 mb-4">
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-xl font-bold text-gray-900 mb-2">Market depth</h2>
      </div>

      {/* Market Depth Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="border-b border-gray-200">
            <tr>
              <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Bid Price</th>
              <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Qty</th>
              <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Ask Price</th>
              <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Qty</th>
            </tr>
          </thead>

          <tbody>
            {marketDepth?.bids && marketDepth?.asks ? (
              marketDepth.bids.slice(0, 5).map((bid, index) => (
                <tr key={index} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-3 px-4 text-green-600 font-medium">
                    {formatNumber(bid.price)}
                  </td>

                  <td className="py-3 px-4">
                    {bid.quantity.toLocaleString()}
                  </td>

                  <td className="py-3 px-4 text-red-600 font-medium">
                    {marketDepth.asks[index] ? formatNumber(marketDepth.asks[index].price) : '-'}
                  </td>

                  <td className="py-3 px-4">
                    {marketDepth.asks[index] ? marketDepth.asks[index].quantity.toLocaleString() : '-'}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" className="py-8 text-center text-gray-500">
                  No market depth data available
                </td>
              </tr>
            )}
          </tbody>

          <tfoot className="bg-gray-50">
            <tr>
              <td colSpan="2" className="py-3 px-4">
                <span className="font-medium">Bid Total</span>
              </td>
              <td colSpan="2" className="py-3 px-4 text-right font-medium">
                {marketDepth?.bidTotal ? marketDepth.bidTotal.toLocaleString() : '0'}
              </td>
            </tr>
            <tr>
              <td colSpan="2" className="py-3 px-4">
                <span className="font-medium">Ask Total</span>
              </td>
              <td colSpan="2" className="py-3 px-4 text-right font-medium">
                {marketDepth?.askTotal ? marketDepth.askTotal.toLocaleString() : '0'}
              </td>
            </tr>
          </tfoot>

        </table>
      </div>
    </div>
  );
};

export default MarketDepthSection;




