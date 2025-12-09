// src/Components/Analytics/AnalyticsPage.jsx
import React, { useEffect, useState } from "react";
import api from "../../services/api";

function AnalyticsPage() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchAnalytics() {
      try {
        setLoading(true);
        const res = await api.get("/analytics/portfolio");
        setData(res.data);
      } catch (err) {
        console.error(err);
        const msg =
          err.response?.data?.error ||
          err.response?.data?.message ||
          "Failed to load analytics.";
        setError(msg);
      } finally {
        setLoading(false);
      }
    }

    fetchAnalytics();
  }, []);

  if (loading) {
    return (
      <div className="p-6 flex justify-center">
        <div className="text-gray-500">Loading analytics...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
          {error}
        </div>
      </div>
    );
  }

  if (!data) return null;

  const { summary, sectorAllocation, performance, tradingActivity } = data;

  return (
    <div className="p-6 space-y-6">
      <h2 className="text-2xl font-semibold text-gray-900 mb-2">
        Portfolio Analytics
      </h2>
      <p className="text-sm text-gray-500 mb-4">
        Insights into your returns, diversification and trading behaviour.
      </p>

      {/* Summary cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100">
          <p className="text-xs uppercase text-gray-400">Total Holdings</p>
          <p className="mt-2 text-xl font-semibold text-gray-900">
            {summary.totalHoldings}
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100">
          <p className="text-xs uppercase text-gray-400">Total Invested</p>
          <p className="mt-2 text-xl font-semibold text-gray-900">
            ₹{summary.totalInvested?.toLocaleString("en-IN")}
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100">
          <p className="text-xs uppercase text-gray-400">Current Value</p>
          <p className="mt-2 text-xl font-semibold text-gray-900">
            ₹{summary.totalCurrentValue?.toLocaleString("en-IN")}
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100">
          <p className="text-xs uppercase text-gray-400">Total P&L</p>
          <p
            className={`mt-2 text-xl font-semibold ${
              summary.totalPnl >= 0 ? "text-emerald-600" : "text-red-600"
            }`}
          >
            ₹{summary.totalPnl?.toLocaleString("en-IN")}{" "}
            <span className="text-sm font-medium">
              ({summary.totalPnlPercentage.toFixed(2)}%)
            </span>
          </p>
        </div>
      </div>

      {/* Sector allocation + Top/Worst performers */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
        {/* Sector allocation */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 xl:col-span-1">
          <div className="p-4 border-b border-gray-100">
            <h3 className="text-lg font-semibold text-gray-900">
              Sector Allocation
            </h3>
            <p className="text-xs text-gray-500 mt-1">
              How your portfolio is distributed across sectors.
            </p>
          </div>

          <div className="p-4 space-y-3">
            {sectorAllocation.length === 0 ? (
              <p className="text-sm text-gray-500">
                No sector allocation data yet.
              </p>
            ) : (
              sectorAllocation.map((s) => (
                <div key={s.sector} className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="font-medium text-gray-800">
                      {s.sector || "Others"}
                    </span>
                    <span className="text-gray-500">
                      {s.allocationPercentage.toFixed(2)}% • ₹
                      {s.currentValue.toLocaleString("en-IN")}
                    </span>
                  </div>
                  <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
                    <div
                      className="h-2 bg-emerald-500 rounded-full"
                      style={{
                        width: `${Math.min(
                          Math.max(s.allocationPercentage, 0),
                          100
                        )}%`,
                      }}
                    ></div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Top performers */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 xl:col-span-1">
          <div className="p-4 border-b border-gray-100">
            <h3 className="text-lg font-semibold text-gray-900">
              Top Performers
            </h3>
            <p className="text-xs text-gray-500 mt-1">
              Stocks with the highest returns in your portfolio.
            </p>
          </div>
          <div className="p-4">
            {performance.topPerformers.length === 0 ? (
              <p className="text-sm text-gray-500">No data yet.</p>
            ) : (
              <ul className="space-y-3">
                {performance.topPerformers.map((p) => (
                  <li
                    key={p.symbol}
                    className="flex items-center justify-between"
                  >
                    <div>
                      <p className="text-sm font-semibold text-gray-900">
                        {p.symbol}{" "}
                        <span className="text-xs text-gray-500 font-normal">
                          {p.companyName}
                        </span>
                      </p>
                      <p className="text-[11px] text-gray-500">
                        Qty: {p.quantity} • Avg: ₹{p.averageBuyPrice.toFixed(2)} •
                        Curr: ₹{p.currentValue.toLocaleString("en-IN")}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs font-semibold text-emerald-600">
                        +{p.pnlPercentage.toFixed(2)}%
                      </p>
                      <p className="text-[11px] text-emerald-500">
                        ₹{p.pnl.toLocaleString("en-IN")}
                      </p>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        {/* Worst performers */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 xl:col-span-1">
          <div className="p-4 border-b border-gray-100">
            <h3 className="text-lg font-semibold text-gray-900">
              Worst Performers
            </h3>
            <p className="text-xs text-gray-500 mt-1">
              Stocks dragging your portfolio down.
            </p>
          </div>
          <div className="p-4">
            {performance.worstPerformers.length === 0 ? (
              <p className="text-sm text-gray-500">No data yet.</p>
            ) : (
              <ul className="space-y-3">
                {performance.worstPerformers.map((p) => (
                  <li
                    key={p.symbol}
                    className="flex items-center justify-between"
                  >
                    <div>
                      <p className="text-sm font-semibold text-gray-900">
                        {p.symbol}{" "}
                        <span className="text-xs text-gray-500 font-normal">
                          {p.companyName}
                        </span>
                      </p>
                      <p className="text-[11px] text-gray-500">
                        Qty: {p.quantity} • Avg: ₹{p.averageBuyPrice.toFixed(2)} •
                        Curr: ₹{p.currentValue.toLocaleString("en-IN")}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs font-semibold text-red-600">
                        {p.pnlPercentage.toFixed(2)}%
                      </p>
                      <p className="text-[11px] text-red-500">
                        ₹{p.pnl.toLocaleString("en-IN")}
                      </p>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>

      {/* Trading activity */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="p-4 border-b border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900">
            Trading Activity (Last 30 Days)
          </h3>
          <p className="text-xs text-gray-500 mt-1">
            Daily buy and sell amounts and number of trades.
          </p>
        </div>
        <div className="p-4 overflow-x-auto">
          {tradingActivity.length === 0 ? (
            <p className="text-sm text-gray-500">
              No trading activity in the last 30 days.
            </p>
          ) : (
            <table className="min-w-full text-xs">
              <thead className="bg-gray-50 text-gray-500">
                <tr>
                  <th className="px-4 py-2 text-left font-medium">Date</th>
                  <th className="px-4 py-2 text-right font-medium">
                    Buy (₹)
                  </th>
                  <th className="px-4 py-2 text-right font-medium">
                    Sell (₹)
                  </th>
                  <th className="px-4 py-2 text-right font-medium">
                    Trades
                  </th>
                </tr>
              </thead>
              <tbody>
                {tradingActivity.map((d, idx) => (
                  <tr
                    key={idx}
                    className="border-b border-gray-50 hover:bg-gray-50/60"
                  >
                    <td className="px-4 py-2 text-gray-700">
                      {new Date(d.date).toLocaleDateString("en-IN", {
                        day: "2-digit",
                        month: "short",
                      })}
                    </td>
                    <td className="px-4 py-2 text-right text-gray-700">
                      ₹{(d.buyAmount || 0).toLocaleString("en-IN")}
                    </td>
                    <td className="px-4 py-2 text-right text-gray-700">
                      ₹{(d.sellAmount || 0).toLocaleString("en-IN")}
                    </td>
                    <td className="px-4 py-2 text-right text-gray-700">
                      {d.tradeCount}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}

export default AnalyticsPage;

