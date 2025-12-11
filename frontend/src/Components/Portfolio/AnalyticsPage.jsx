// src/Components/Portfolio/PortfolioPage.jsx
import React, { useEffect, useState } from "react";
import api from "../../services/api";
import { 
  TrendingUp, 
  TrendingDown, 
  BarChart3, 
  PieChart, 
  Activity, 
  DollarSign,
  Shield,
  Calendar,
  ArrowUpRight,
  ArrowDownRight,
  LineChart,
  Target,
  Clock
} from "lucide-react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

function PortfolioPage() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [useDummyData, setUseDummyData] = useState(false);
  const [timeRange, setTimeRange] = useState('1M');

  useEffect(() => {
    async function fetchPortfolio() {
      try {
        setLoading(true);
        const res = await api.get("/portfolio/overview");
        setData(res.data);
        setUseDummyData(false);
      } catch (err) {
        console.error("API Error:", err);
        // If API fails, load dummy data
        setData(getDummyData());
        setUseDummyData(true);
        setError("Using demo data - Backend API not connected");
      } finally {
        setLoading(false);
      }
    }

    fetchPortfolio();
  }, []);

  const getDummyData = () => ({
    summary: {
      totalValue: 856420,
      totalInvested: 725000,
      todayChange: 12420,
      todayChangePercent: 1.47,
      totalPnl: 131420,
      totalPnlPercent: 18.13,
    },
    holdings: [
      {
        symbol: "RELIANCE",
        name: "Reliance Industries",
        quantity: 25,
        avgPrice: 2450.5,
        currentPrice: 2850.75,
        investment: 61262.5,
        currentValue: 71268.75,
        pnl: 10006.25,
        pnlPercent: 16.33,
        sector: "Energy",
        weight: 8.32,
      },
      {
        symbol: "TCS",
        name: "Tata Consultancy Services",
        quantity: 45,
        avgPrice: 3250.75,
        currentPrice: 3750.25,
        investment: 146283.75,
        currentValue: 168761.25,
        pnl: 22477.5,
        pnlPercent: 15.37,
        sector: "Technology",
        weight: 19.71,
      },
      {
        symbol: "HDFCBANK",
        name: "HDFC Bank",
        quantity: 35,
        avgPrice: 1650.5,
        currentPrice: 1725.25,
        investment: 57767.5,
        currentValue: 60383.75,
        pnl: 2616.25,
        pnlPercent: 4.53,
        sector: "Finance",
        weight: 7.05,
      },
      {
        symbol: "INFY",
        name: "Infosys Ltd",
        quantity: 85,
        avgPrice: 1420.25,
        currentPrice: 1650.5,
        investment: 120721.25,
        currentValue: 140292.5,
        pnl: 19571.25,
        pnlPercent: 16.21,
        sector: "Technology",
        weight: 16.38,
      },
      {
        symbol: "ITC",
        name: "ITC Ltd",
        quantity: 150,
        avgPrice: 210.75,
        currentPrice: 435.5,
        investment: 31612.5,
        currentValue: 65325,
        pnl: 33712.5,
        pnlPercent: 106.65,
        sector: "Consumer Goods",
        weight: 7.63,
      },
      {
        symbol: "BAJFINANCE",
        name: "Bajaj Finance",
        quantity: 15,
        avgPrice: 6850.25,
        currentPrice: 7125.5,
        investment: 102753.75,
        currentValue: 106882.5,
        pnl: 4128.75,
        pnlPercent: 4.02,
        sector: "Finance",
        weight: 12.48,
      },
    ],
    performance: {
      dailyChange: 12420,
      dailyChangePercent: 1.47,
      weeklyChange: 35420,
      weeklyChangePercent: 4.33,
      monthlyChange: 85650,
      monthlyChangePercent: 11.06,
      yearlyChange: 131420,
      yearlyChangePercent: 18.13,
    },
    tradingActivity: [
      {
        id: 1,
        type: "BUY",
        symbol: "RELIANCE",
        quantity: 10,
        price: 2785.5,
        amount: 27855,
        time: "10:30 AM",
        date: "Today",
        status: "Completed",
      },
      {
        id: 2,
        type: "SELL",
        symbol: "TCS",
        quantity: 5,
        price: 3725.75,
        amount: 18628.75,
        time: "Yesterday",
        date: "2:45 PM",
        status: "Completed",
      },
      {
        id: 3,
        type: "BUY",
        symbol: "INFY",
        quantity: 25,
        price: 1625.25,
        amount: 40631.25,
        time: "Mar 14",
        date: "11:15 AM",
        status: "Completed",
      },
      {
        id: 4,
        type: "SELL",
        symbol: "ITC",
        quantity: 50,
        price: 430.5,
        amount: 21525,
        time: "Mar 13",
        date: "3:20 PM",
        status: "Completed",
      },
      {
        id: 5,
        type: "BUY",
        symbol: "HDFCBANK",
        quantity: 15,
        price: 1710.5,
        amount: 25657.5,
        time: "Mar 12",
        date: "9:45 AM",
        status: "Completed",
      },
      {
        id: 6,
        type: "BUY",
        symbol: "BAJFINANCE",
        quantity: 5,
        price: 7050.75,
        amount: 35253.75,
        time: "Mar 11",
        date: "1:30 PM",
        status: "Completed",
      },
    ],
    portfolioHistory: {
      labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
      values: [725000, 735000, 745000, 760000, 775000, 790000, 805000, 820000, 835000, 845000, 855000, 856420],
    },
  });

  if (loading) {
    return (
      <div className="px-32 py-8 flex flex-col items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-16 w-16 border-4 border-green-500 border-t-transparent mb-6"></div>
        <div className="text-gray-600 text-lg font-medium">Loading portfolio data...</div>
        <div className="text-gray-400 text-sm mt-2">Fetching your investments</div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="px-32 py-8">
        <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-xl text-center">
          No portfolio data available
        </div>
      </div>
    );
  }

  const { summary, holdings, performance, tradingActivity, portfolioHistory } = data;

  // Prepare chart data
  const chartData = {
    labels: portfolioHistory.labels,
    datasets: [
      {
        label: 'Portfolio Value',
        data: portfolioHistory.values,
        borderColor: '#10b981',
        backgroundColor: 'rgba(16, 185, 129, 0.1)',
        fill: true,
        tension: 0.4,
        pointBackgroundColor: '#10b981',
        pointBorderColor: '#ffffff',
        pointBorderWidth: 2,
        pointRadius: 4,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        mode: 'index',
        intersect: false,
        callbacks: {
          label: function(context) {
            return `₹${context.parsed.y.toLocaleString('en-IN')}`;
          }
        }
      },
    },
    scales: {
      x: {
        grid: {
          display: false,
        },
        ticks: {
          color: '#6b7280',
        },
      },
      y: {
        grid: {
          color: 'rgba(0, 0, 0, 0.05)',
        },
        ticks: {
          color: '#6b7280',
          callback: function(value) {
            return '₹' + (value / 1000) + 'k';
          },
        },
      },
    },
    interaction: {
      intersect: false,
      mode: 'index',
    },
  };

  return (
    <div className="px-32 py-8 space-y-8 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">My Portfolio</h1>
          <p className="text-gray-600 text-lg">
            Overview of your investments and trading activity
          </p>
        </div>
        <div className="flex items-center gap-4">
          {useDummyData && (
            <div className="bg-amber-50 border border-amber-200 text-amber-700 px-4 py-2 rounded-lg text-sm flex items-center gap-2">
              <Shield size={16} />
              Demo Mode
            </div>
          )}
          <div className="text-sm text-gray-500">
            <Clock size={16} className="inline mr-2" />
            Real-time updates
          </div>
        </div>
      </div>

      {error && !useDummyData && (
        <div className="bg-yellow-50 border border-yellow-200 text-yellow-700 px-6 py-4 rounded-xl">
          {error}
        </div>
      )}

      {/* Portfolio Value Cards */}
      <div className="grid grid-cols-4 gap-6">
        <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
              <DollarSign className="text-blue-600" size={24} />
            </div>
            <span className="text-xs font-medium px-3 py-1 bg-blue-100 text-blue-600 rounded-full">
              Total Value
            </span>
          </div>
          <h3 className="text-2xl font-bold text-gray-900">
            ₹{summary.totalValue?.toLocaleString("en-IN")}
          </h3>
          <p className="text-gray-500 mt-1">Current Portfolio Value</p>
          <div className="mt-4 pt-4 border-t border-gray-100">
            <p className="text-xs text-gray-500">Invested: ₹{summary.totalInvested?.toLocaleString("en-IN")}</p>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
              <TrendingUp className="text-green-600" size={24} />
            </div>
            <span className="text-xs font-medium px-3 py-1 bg-green-100 text-green-600 rounded-full">
              Today's P&L
            </span>
          </div>
          <div className="flex items-baseline gap-2">
            <h3 className={`text-2xl font-bold ${summary.todayChange >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              ₹{summary.todayChange?.toLocaleString("en-IN")}
            </h3>
            <span className={`text-lg font-semibold ${summary.todayChange >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              ({summary.todayChangePercent >= 0 ? '+' : ''}{summary.todayChangePercent?.toFixed(2)}%)
            </span>
          </div>
          <p className="text-gray-500 mt-1">Daily Change</p>
          <div className="mt-4 pt-4 border-t border-gray-100">
            <div className={`flex items-center text-xs ${summary.todayChange >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {summary.todayChange >= 0 ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
              <span className="ml-1">Today's performance</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
              <BarChart3 className="text-purple-600" size={24} />
            </div>
            <span className="text-xs font-medium px-3 py-1 bg-purple-100 text-purple-600 rounded-full">
              Total P&L
            </span>
          </div>
          <div className="flex items-baseline gap-2">
            <h3 className={`text-2xl font-bold ${summary.totalPnl >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              ₹{summary.totalPnl?.toLocaleString("en-IN")}
            </h3>
            <span className={`text-lg font-semibold ${summary.totalPnl >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              ({summary.totalPnlPercent >= 0 ? '+' : ''}{summary.totalPnlPercent?.toFixed(2)}%)
            </span>
          </div>
          <p className="text-gray-500 mt-1">Overall Return</p>
          <div className="mt-4 pt-4 border-t border-gray-100">
            <p className="text-xs text-gray-500">Since investment</p>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-indigo-100 rounded-xl flex items-center justify-center">
              <PieChart className="text-indigo-600" size={24} />
            </div>
            <span className="text-xs font-medium px-3 py-1 bg-indigo-100 text-indigo-600 rounded-full">
              Holdings
            </span>
          </div>
          <h3 className="text-2xl font-bold text-gray-900">{holdings.length}</h3>
          <p className="text-gray-500 mt-1">Total Stocks</p>
          <div className="mt-4 pt-4 border-t border-gray-100">
            <p className="text-xs text-gray-500">Across different sectors</p>
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-3 gap-8">
        {/* Portfolio Growth Chart */}
        <div className="col-span-2 bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-xl font-bold text-gray-900 flex items-center gap-3">
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                  <LineChart className="text-green-600" size={20} />
                </div>
                Portfolio Growth
              </h3>
              <p className="text-gray-500 mt-1">12-month performance overview</p>
            </div>
            <div className="flex items-center gap-2">
              {['1W', '1M', '3M', '1Y', 'ALL'].map((range) => (
                <button
                  key={range}
                  onClick={() => setTimeRange(range)}
                  className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                    timeRange === range
                      ? 'bg-green-600 text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {range}
                </button>
              ))}
            </div>
          </div>
          
          <div className="h-80">
            <Line data={chartData} options={chartOptions} />
          </div>
          
          <div className="mt-6 grid grid-cols-4 gap-4">
            <div className="text-center p-3 rounded-xl bg-blue-50">
              <div className="text-sm text-blue-600">Daily</div>
              <div className={`text-lg font-bold ${performance.dailyChange >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {performance.dailyChange >= 0 ? '+' : ''}{performance.dailyChangePercent.toFixed(2)}%
              </div>
            </div>
            <div className="text-center p-3 rounded-xl bg-green-50">
              <div className="text-sm text-green-600">Weekly</div>
              <div className={`text-lg font-bold ${performance.weeklyChange >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {performance.weeklyChange >= 0 ? '+' : ''}{performance.weeklyChangePercent.toFixed(2)}%
              </div>
            </div>
            <div className="text-center p-3 rounded-xl bg-purple-50">
              <div className="text-sm text-purple-600">Monthly</div>
              <div className={`text-lg font-bold ${performance.monthlyChange >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {performance.monthlyChange >= 0 ? '+' : ''}{performance.monthlyChangePercent.toFixed(2)}%
              </div>
            </div>
            <div className="text-center p-3 rounded-xl bg-indigo-50">
              <div className="text-sm text-indigo-600">Yearly</div>
              <div className={`text-lg font-bold ${performance.yearlyChange >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {performance.yearlyChange >= 0 ? '+' : ''}{performance.yearlyChangePercent.toFixed(2)}%
              </div>
            </div>
          </div>
        </div>

        {/* Performance Summary */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-xl font-bold text-gray-900 flex items-center gap-3">
                <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center">
                  <Target className="text-indigo-600" size={20} />
                </div>
                Performance Summary
              </h3>
              <p className="text-gray-500 mt-1">Key metrics at a glance</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-500">Current Return</p>
              <p className={`text-xl font-bold ${summary.totalPnlPercent >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {summary.totalPnlPercent >= 0 ? '+' : ''}{summary.totalPnlPercent.toFixed(2)}%
              </p>
            </div>
          </div>
          
          <div className="space-y-4">
            <div className="p-4 rounded-xl bg-gray-50">
              <div className="flex justify-between items-center mb-2">
                <span className="font-medium text-gray-900">Best Performer</span>
                <span className="text-sm text-gray-500">Return</span>
              </div>
              {(() => {
                const bestStock = holdings.reduce((best, stock) => 
                  stock.pnlPercent > best.pnlPercent ? stock : best
                );
                return (
                  <div className="flex justify-between items-center">
                    <div>
                      <h4 className="font-bold text-gray-900">{bestStock.symbol}</h4>
                      <p className="text-sm text-gray-500">{bestStock.name}</p>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-bold text-green-600">+{bestStock.pnlPercent.toFixed(2)}%</div>
                      <div className="text-sm text-green-500">₹{bestStock.pnl.toLocaleString('en-IN')}</div>
                    </div>
                  </div>
                );
              })()}
            </div>
            
            <div className="p-4 rounded-xl bg-gray-50">
              <div className="flex justify-between items-center mb-2">
                <span className="font-medium text-gray-900">Worst Performer</span>
                <span className="text-sm text-gray-500">Return</span>
              </div>
              {(() => {
                const worstStock = holdings.reduce((worst, stock) => 
                  stock.pnlPercent < worst.pnlPercent ? stock : worst
                );
                return (
                  <div className="flex justify-between items-center">
                    <div>
                      <h4 className="font-bold text-gray-900">{worstStock.symbol}</h4>
                      <p className="text-sm text-gray-500">{worstStock.name}</p>
                    </div>
                    <div className="text-right">
                      <div className={`text-lg font-bold ${worstStock.pnlPercent >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {worstStock.pnlPercent >= 0 ? '+' : ''}{worstStock.pnlPercent.toFixed(2)}%
                      </div>
                      <div className={`text-sm ${worstStock.pnl >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                        {worstStock.pnl >= 0 ? '+' : ''}₹{worstStock.pnl.toLocaleString('en-IN')}
                      </div>
                    </div>
                  </div>
                );
              })()}
            </div>
            
            <div className="p-4 rounded-xl bg-gray-50">
              <div className="flex justify-between items-center mb-2">
                <span className="font-medium text-gray-900">Largest Holding</span>
                <span className="text-sm text-gray-500">Weight</span>
              </div>
              {(() => {
                const largestHolding = holdings.reduce((largest, stock) => 
                  stock.weight > largest.weight ? stock : largest
                );
                return (
                  <div className="flex justify-between items-center">
                    <div>
                      <h4 className="font-bold text-gray-900">{largestHolding.symbol}</h4>
                      <p className="text-sm text-gray-500">{largestHolding.sector}</p>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-bold text-blue-600">{largestHolding.weight.toFixed(2)}%</div>
                      <div className="text-sm text-blue-500">₹{largestHolding.currentValue.toLocaleString('en-IN')}</div>
                    </div>
                  </div>
                );
              })()}
            </div>
            
            <div className="p-4 rounded-xl bg-gray-50">
              <div className="flex justify-between items-center mb-2">
                <span className="font-medium text-gray-900">Average Return</span>
                <span className="text-sm text-gray-500">Per Stock</span>
              </div>
              <div className="flex justify-between items-center">
                <div>
                  <h4 className="font-bold text-gray-900">All Holdings</h4>
                  <p className="text-sm text-gray-500">Weighted average</p>
                </div>
                <div className="text-right">
                  <div className="text-lg font-bold text-green-600">
                    +{(holdings.reduce((sum, stock) => sum + stock.pnlPercent, 0) / holdings.length).toFixed(2)}%
                  </div>
                  <div className="text-sm text-green-500">
                    ₹{(summary.totalPnl / holdings.length).toLocaleString('en-IN')}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Trading Activity */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-xl font-bold text-gray-900 flex items-center gap-3">
              <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                <Activity className="text-orange-600" size={20} />
              </div>
              Recent Trading Activity
            </h3>
            <p className="text-gray-500 mt-1">Your latest buy and sell transactions</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-sm text-gray-500">
              <Calendar size={16} className="inline mr-2" />
              Last 7 days
            </div>
            <button className="text-blue-600 hover:text-blue-700 font-medium flex items-center gap-2">
              View All <ArrowUpRight size={16} />
            </button>
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="py-3 px-4 text-left text-sm font-semibold text-gray-900">Type</th>
                <th className="py-3 px-4 text-left text-sm font-semibold text-gray-900">Stock</th>
                <th className="py-3 px-4 text-left text-sm font-semibold text-gray-900">Quantity</th>
                <th className="py-3 px-4 text-left text-sm font-semibold text-gray-900">Price</th>
                <th className="py-3 px-4 text-left text-sm font-semibold text-gray-900">Amount</th>
                <th className="py-3 px-4 text-left text-sm font-semibold text-gray-900">Time</th>
                <th className="py-3 px-4 text-left text-sm font-semibold text-gray-900">Status</th>
              </tr>
            </thead>
            <tbody>
              {tradingActivity.map((trade) => (
                <tr key={trade.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                  <td className="py-3 px-4">
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                      trade.type === 'BUY' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {trade.type}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <div>
                      <div className="font-medium text-gray-900">{trade.symbol}</div>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-gray-700">{trade.quantity}</td>
                  <td className="py-3 px-4">
                    <div className="font-medium text-gray-900">₹{trade.price.toFixed(2)}</div>
                  </td>
                  <td className="py-3 px-4">
                    <div className="font-bold text-gray-900">₹{trade.amount.toLocaleString('en-IN')}</div>
                  </td>
                  <td className="py-3 px-4">
                    <div className="text-sm text-gray-700">{trade.time}</div>
                    <div className="text-xs text-gray-500">{trade.date}</div>
                  </td>
                  <td className="py-3 px-4">
                    <span className="inline-flex items-center gap-1 text-green-600">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      {trade.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        <div className="mt-6 pt-6 border-t border-gray-100">
          <div className="flex justify-between items-center">
            <div className="text-gray-500 text-sm">
              Showing {tradingActivity.length} recent transactions
            </div>
            <div className="flex items-center gap-4">
              <div className="text-sm">
                <span className="text-gray-500">Total Buy:</span>
                <span className="font-bold text-green-600 ml-2">
                  ₹{tradingActivity
                    .filter(t => t.type === 'BUY')
                    .reduce((sum, t) => sum + t.amount, 0)
                    .toLocaleString('en-IN')}
                </span>
              </div>
              <div className="text-sm">
                <span className="text-gray-500">Total Sell:</span>
                <span className="font-bold text-red-600 ml-2">
                  ₹{tradingActivity
                    .filter(t => t.type === 'SELL')
                    .reduce((sum, t) => sum + t.amount, 0)
                    .toLocaleString('en-IN')}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-4 gap-6">
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl p-6 text-white">
          <div className="flex items-center justify-between mb-4">
            <div className="text-sm opacity-90">Total Investment</div>
            <DollarSign size={20} />
          </div>
          <div className="text-2xl font-bold">₹{summary.totalInvested?.toLocaleString("en-IN")}</div>
          <div className="text-sm opacity-90 mt-2">Initial capital</div>
        </div>
        
        <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-2xl p-6 text-white">
          <div className="flex items-center justify-between mb-4">
            <div className="text-sm opacity-90">Current Value</div>
            <TrendingUp size={20} />
          </div>
          <div className="text-2xl font-bold">₹{summary.totalValue?.toLocaleString("en-IN")}</div>
          <div className="text-sm opacity-90 mt-2">Market value</div>
        </div>
        
        <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl p-6 text-white">
          <div className="flex items-center justify-between mb-4">
            <div className="text-sm opacity-90">Total P&L</div>
            <BarChart3 size={20} />
          </div>
          <div className="text-2xl font-bold">₹{summary.totalPnl?.toLocaleString("en-IN")}</div>
          <div className="text-sm opacity-90 mt-2">
            {summary.totalPnlPercent >= 0 ? 'Profit' : 'Loss'} ({summary.totalPnlPercent.toFixed(2)}%)
          </div>
        </div>
        
        <div className="bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-2xl p-6 text-white">
          <div className="flex items-center justify-between mb-4">
            <div className="text-sm opacity-90">Holdings</div>
            <PieChart size={20} />
          </div>
          <div className="text-2xl font-bold">{holdings.length}</div>
          <div className="text-sm opacity-90 mt-2">Different stocks</div>
        </div>
      </div>
    </div>
  );
}

export default PortfolioPage;