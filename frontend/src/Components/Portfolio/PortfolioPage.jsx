// src/Components/Portfolio/PortfolioPage.jsx
import React, { useEffect, useState } from "react";
import api from "../../services/api";

function PortfolioPage() {
  const [portfolio, setPortfolio] = useState(null);
  const [trades, setTrades] = useState([]);
  const [loadingPortfolio, setLoadingPortfolio] = useState(true);
  const [loadingTrades, setLoadingTrades] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchPortfolio() {
      try {
        setLoadingPortfolio(true);
        const res = await api.get("/portfolio");
        setPortfolio(res.data.portfolio);
      } catch (err) {
        console.error(err);
        const msg =
          err.response?.data?.error ||
          err.response?.data?.message ||
          "Failed to load portfolio.";
        setError(msg);
      } finally {
        setLoadingPortfolio(false);
      }
    }

    async function fetchTrades() {
      try {
        setLoadingTrades(true);
        const res = await api.get("/portfolio/history");
        setTrades(res.data.trades || []);
      } catch (err) {
        console.error(err);
        // Don’t override error from portfolio if already set
        if (!error) {
          const msg =
            err.response?.data?.error ||
            err.response?.data?.message ||
            "Failed to load trade history.";
          setError(msg);
        }
      } finally {
        setLoadingTrades(false);
      }
    }

    fetchPortfolio();
    fetchTrades();
  }, []);

  if (loadingPortfolio) {
    return (
      <div className="p-6 flex justify-center">
        <div className="text-gray-500">Loading portfolio...</div>
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

  if (!portfolio) {
    return (
      <div className="p-6">
        <div className="text-gray-500">No portfolio data available.</div>
      </div>
    );
  }

  const { summary, holdings } = portfolio;

  return (
    <div className="p-6 space-y-6">

      {/* Summary cards */}
      <h2 className="text-2xl font-semibold text-gray-900 mb-2">My Portfolio</h2>
      <p className="text-sm text-gray-500 mb-4">
        Track your investments, returns and recent trades.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
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
          <p className="text-xs uppercase text-gray-400">Unrealized P&L</p>
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

        <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100">
          <p className="text-xs uppercase text-gray-400">Total Holdings</p>
          <p className="mt-2 text-xl font-semibold text-gray-900">
            {summary.totalHoldings}
          </p>
        </div>
      </div>

      {/* Holdings table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="p-4 border-b border-gray-100 flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900">Holdings</h3>
          <span className="text-xs text-gray-400">
            {holdings.length} stocks
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="bg-gray-50 text-gray-500">
              <tr>
                <th className="px-4 py-2 text-left font-medium">Stock</th>
                <th className="px-4 py-2 text-right font-medium">Qty</th>
                <th className="px-4 py-2 text-right font-medium">
                  Avg Buy Price
                </th>
                <th className="px-4 py-2 text-right font-medium">
                  Invested (₹)
                </th>
                <th className="px-4 py-2 text-right font-medium">
                  LTP (₹)
                </th>
                <th className="px-4 py-2 text-right font-medium">
                  Current Value (₹)
                </th>
                <th className="px-4 py-2 text-right font-medium">
                  P&L (₹)
                </th>
                <th className="px-4 py-2 text-right font-medium">
                  P&L %
                </th>
              </tr>
            </thead>
            <tbody>
              {holdings.length === 0 ? (
                <tr>
                  <td
                    colSpan={8}
                    className="px-4 py-6 text-center text-gray-400"
                  >
                    You don’t have any holdings yet.
                  </td>
                </tr>
              ) : (
                holdings.map((h) => (
                  <tr
                    key={h.id}
                    className="border-b border-gray-50 hover:bg-gray-50/60"
                  >
                    <td className="px-4 py-3">
                      <div className="flex flex-col">
                        <span className="font-semibold text-gray-900">
                          {h.stock.symbol}
                        </span>
                        <span className="text-xs text-gray-500">
                          {h.stock.companyName}
                        </span>
                        <span className="text-[10px] text-gray-400">
                          {h.stock.sector} • {h.stock.exchange}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-right text-gray-700">
                      {h.quantity}
                    </td>
                    <td className="px-4 py-3 text-right text-gray-700">
                      ₹{h.averageBuyPrice.toFixed(2)}
                    </td>
                    <td className="px-4 py-3 text-right text-gray-700">
                      ₹{h.investedAmount.toLocaleString("en-IN")}
                    </td>
                    <td className="px-4 py-3 text-right text-gray-700">
                      ₹{h.currentPrice.toFixed(2)}
                    </td>
                    <td className="px-4 py-3 text-right text-gray-700">
                      ₹{h.currentValue.toLocaleString("en-IN")}
                    </td>
                    <td
                      className={`px-4 py-3 text-right font-medium ${
                        h.unrealizedPnl >= 0
                          ? "text-emerald-600"
                          : "text-red-600"
                      }`}
                    >
                      ₹{h.unrealizedPnl.toLocaleString("en-IN")}
                    </td>
                    <td
                      className={`px-4 py-3 text-right text-xs font-semibold ${
                        h.pnlPercentage >= 0
                          ? "text-emerald-600"
                          : "text-red-600"
                      }`}
                    >
                      {h.pnlPercentage.toFixed(2)}%
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Trade history */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="p-4 border-b border-gray-100 flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900">
            Recent Orders / Trades
          </h3>
          <span className="text-xs text-gray-400">
            Last {trades.length} rows
          </span>
        </div>

        {loadingTrades ? (
          <div className="p-4 text-gray-500 text-sm">Loading trade history...</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full text-xs">
              <thead className="bg-gray-50 text-gray-500">
                <tr>
                  <th className="px-4 py-2 text-left font-medium">Stock</th>
                  <th className="px-4 py-2 text-left font-medium">Type</th>
                  <th className="px-4 py-2 text-left font-medium">Category</th>
                  <th className="px-4 py-2 text-right font-medium">Qty</th>
                  <th className="px-4 py-2 text-right font-medium">
                    Exec Qty
                  </th>
                  <th className="px-4 py-2 text-right font-medium">
                    Avg Price (₹)
                  </th>
                  <th className="px-4 py-2 text-right font-medium">
                    Amount (₹)
                  </th>
                  <th className="px-4 py-2 text-left font-medium">
                    Status
                  </th>
                  <th className="px-4 py-2 text-left font-medium">
                    Time
                  </th>
                </tr>
              </thead>
              <tbody>
                {trades.length === 0 ? (
                  <tr>
                    <td
                      colSpan={9}
                      className="px-4 py-6 text-center text-gray-400"
                    >
                      No completed trades yet.
                    </td>
                  </tr>
                ) : (
                  trades.map((t) => (
                    <tr
                      key={t.id}
                      className="border-b border-gray-50 hover:bg-gray-50/60"
                    >
                      <td className="px-4 py-2 text-gray-900 font-medium">
                        {t.symbol}
                        <span className="block text-[10px] text-gray-500">
                          {t.companyName}
                        </span>
                      </td>
                      <td className="px-4 py-2">
                        <span
                          className={`inline-flex px-2 py-1 rounded-full text-[10px] font-semibold ${
                            t.type === "buy"
                              ? "bg-emerald-50 text-emerald-700"
                              : "bg-red-50 text-red-700"
                          }`}
                        >
                          {t.type.toUpperCase()}
                        </span>
                      </td>
                      <td className="px-4 py-2 text-gray-600">
                        {t.category?.toUpperCase()}
                      </td>
                      <td className="px-4 py-2 text-right text-gray-700">
                        {t.quantity}
                      </td>
                      <td className="px-4 py-2 text-right text-gray-700">
                        {t.executedQuantity}
                      </td>
                      <td className="px-4 py-2 text-right text-gray-700">
                        ₹{t.averagePrice?.toFixed(2)}
                      </td>
                      <td className="px-4 py-2 text-right text-gray-700">
                        ₹{t.totalAmount?.toLocaleString("en-IN")}
                      </td>
                      <td className="px-4 py-2">
                        <span className="inline-flex px-2 py-1 rounded-full text-[10px] font-medium bg-blue-50 text-blue-700">
                          {t.status.toUpperCase()}
                        </span>
                      </td>
                      <td className="px-4 py-2 text-gray-500">
                        {new Date(t.executedAt).toLocaleString("en-IN")}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

export default PortfolioPage;

