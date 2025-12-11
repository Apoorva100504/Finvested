import React from "react";

const FundamentalsSection = ({ fundamentals }) => {

  // ---------- FORMATTERS ----------
  const formatCurrency = (value) => {
    const num = Number(value);
    if (!num || isNaN(num)) return "₹0.00";

    if (num >= 10000000) return `₹${(num / 10000000).toFixed(2)} Cr`;
    if (num >= 100000) return `₹${(num / 100000).toFixed(2)} L`;

    return `₹${num.toLocaleString("en-IN", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;
  };

  const formatPercent = (value) => {
    const num = Number(value);
    if (!num || isNaN(num)) return "0.00%";
    return `${num.toFixed(2)}%`;
  };

  const formatDecimal = (value) => {
    const num = Number(value);
    if (!num || isNaN(num)) return "N/A";
    return num.toFixed(2);
  };

  // ---------- DATA ARRAYS ----------
  const fundamentalData = [
    { label: "Market Cap", value: formatCurrency(fundamentals?.marketCap) },
    { label: "P/E Ratio (TTM)", value: formatDecimal(fundamentals?.peRatio) },
    { label: "P/B Ratio", value: formatDecimal(fundamentals?.pbRatio) },
    { label: "Industry P/E", value: formatDecimal(fundamentals?.industryPE) },
    { label: "ROE", value: formatPercent(fundamentals?.roe) },
    { label: "EPS (TTM)", value: formatDecimal(fundamentals?.eps) },
    { label: "Dividend Yield", value: formatPercent(fundamentals?.dividendYield) },
    { label: "Book Value", value: formatCurrency(fundamentals?.bookValue) },
  ];

  const financialData = [
    { label: "Revenue", value: formatCurrency(fundamentals?.revenue) },
    { label: "Profit", value: formatCurrency(fundamentals?.profit) },
    { label: "Net Worth", value: formatCurrency(fundamentals?.netWorth) },
  ];

  // ---------------------------------

  return (
    <div className="bg-white rounded-lg shadow p-6 mb-4 w-full">
      <h2 className="text-xl font-bold text-gray-900 mb-6 tracking-tight">
        Fundamentals
      </h2>

      {/* Fundamentals Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-5 mb-10">
        {fundamentalData.map((item, idx) => (
          <div key={idx} className="flex w-full justify-between text-sm">

            <span className="text-gray-500 whitespace-nowrap flex-shrink-0">
              {item.label}
            </span>

            <span className="text-gray-900 font-semibold text-right flex-1 ml-3">
              {item.value}
            </span>

          </div>
        ))}
      </div>

      {/* Financials */}
      <div>
        <h3 className="font-semibold text-gray-900 mb-4 text-sm tracking-wide">
          Financials
        </h3>

        <div className="space-y-3 text-sm">
          {financialData.map((item, i) => (
            <div key={i} className="flex justify-between border-b border-gray-100 pb-1.5">
              <span className="text-gray-500">{item.label}</span>
              <span className="text-gray-900 font-semibold ml-3">{item.value}</span>
            </div>
          ))}
        </div>

        <div className="text-xs text-gray-400 mt-4">
          * Values are approximations. Units auto-adjust (Cr / L / ₹)
        </div>
      </div>
    </div>
  );
};

export default FundamentalsSection;


