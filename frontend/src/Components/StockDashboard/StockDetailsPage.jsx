import React, { useState, useEffect } from 'react';
import { useStockDetails } from '../hooks/useStockData';
import StockHeader from './StockHeader';
import OverviewSection from './OverviewSection';
import MarketDepthSection from './MarketDepthSection';
import FundamentalsSection from './FundamentalsSection';
import FinancialsSection from './FinancialsSection';

const StockDetailsPage = ({ stockSymbol, onBack }) => {
  const { stock, loading, error, historicalData, refresh } = useStockDetails(stockSymbol);
  const [chartLoading, setChartLoading] = useState(true);

  // Debug logs
  useEffect(() => {
    console.log('StockDetailsPage - loading:', loading);
    console.log('StockDetailsPage - stock:', stock);
    console.log('StockDetailsPage - historicalData length:', historicalData?.length);
  }, [loading, stock, historicalData]);

  useEffect(() => {
    if (historicalData && historicalData.length > 0) {
      setChartLoading(false);
    }
  }, [historicalData]);

  // Add floating green particles effect
  const renderFloatingEffects = () => (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {/* Green gradient orbs */}
      <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-emerald-200/20 to-green-200/10 rounded-full blur-3xl"></div>
      <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-tr from-emerald-100/15 to-green-100/10 rounded-full blur-3xl"></div>
      
      {/* Floating particles */}
      {[...Array(8)].map((_, i) => (
        <div
          key={i}
          className="absolute w-1 h-1 bg-emerald-300/30 rounded-full animate-float"
          style={{
            left: `${10 + (i * 12)}%`,
            top: `${20 + (i * 8)}%`,
            animationDelay: `${i * 0.5}s`,
            animationDuration: `${3 + (i % 3)}s`
          }}
        ></div>
      ))}
    </div>
  );

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen px-4 md:px-8 lg:px-16 relative overflow-hidden">
        {/* Green loading background effects */}
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-50/30 to-green-50/20"></div>
        <div className="absolute -top-32 -right-32 w-64 h-64 bg-emerald-200/20 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-32 -left-32 w-64 h-64 bg-green-200/20 rounded-full blur-3xl"></div>
        
        <div className="relative z-10">
          {/* Animated green loading spinner */}
          <div className="relative">
            <div className="animate-spin rounded-full h-20 w-20 border-4 border-emerald-100"></div>
            <div className="absolute top-0 left-0 animate-spin rounded-full h-20 w-20 border-t-4 border-green-500"></div>
          </div>
          
          <p className="mt-8 text-lg font-medium text-gray-800">Loading stock details...</p>
          <p className="mt-2 text-sm text-gray-600">Fetching {stockSymbol || 'stock'} data</p>
          
          {/* Green animated dots */}
          <div className="mt-6 flex gap-2 justify-center">
            <div className="h-3 w-3 bg-gradient-to-br from-emerald-400 to-green-400 rounded-full animate-pulse"></div>
            <div className="h-3 w-3 bg-gradient-to-br from-emerald-400 to-green-400 rounded-full animate-pulse" style={{animationDelay: '0.2s'}}></div>
            <div className="h-3 w-3 bg-gradient-to-br from-emerald-400 to-green-400 rounded-full animate-pulse" style={{animationDelay: '0.4s'}}></div>
          </div>
          
          {/* Progress bar */}
          <div className="mt-8 w-64 h-2 bg-emerald-100 rounded-full overflow-hidden">
            <div className="h-full bg-gradient-to-r from-emerald-400 to-green-500 rounded-full animate-progress"></div>
          </div>
        </div>
        
        <style jsx>{`
          @keyframes progress {
            0% { width: 0%; }
            50% { width: 70%; }
            100% { width: 100%; }
          }
          .animate-progress {
            animation: progress 2s ease-in-out infinite;
          }
          @keyframes float {
            0%, 100% { transform: translateY(0px); }
            50% { transform: translateY(-20px); }
          }
          .animate-float {
            animation: float 3s ease-in-out infinite;
          }
        `}</style>
      </div>
    );
  }

  if (error || !stock) {
    return (
      <div className="min-h-screen px-4 md:px-8 lg:px-24 flex items-center justify-center relative overflow-hidden">
        {/* Green error background effects */}
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-50/40 to-green-50/30"></div>
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-emerald-200/20 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-green-200/20 rounded-full blur-3xl"></div>
        
        <div className="relative z-10 bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-8 max-w-md w-full border border-emerald-100">
          <div className="relative">
            <div className="absolute -top-8 -right-8 w-16 h-16 bg-gradient-to-br from-emerald-100 to-green-100 rounded-full flex items-center justify-center">
              <span className="text-3xl">⚠️</span>
            </div>
          </div>
          
          <h3 className="text-2xl font-bold text-gray-800 mb-3 mt-4">Unable to load stock details</h3>
          <p className="text-gray-600 mb-8">{error || 'Stock data not available'}</p>
          
          <div className="space-y-4">
            <button 
              className="w-full px-6 py-4 bg-gradient-to-r from-emerald-500 to-green-500 text-white rounded-xl hover:from-emerald-600 hover:to-green-600 font-medium transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
              onClick={onBack}
            >
              ← Back to Dashboard
            </button>
            <button 
              className="w-full px-6 py-4 bg-gradient-to-r from-emerald-50 to-green-50 text-emerald-700 rounded-xl hover:from-emerald-100 hover:to-green-100 font-medium transition-all duration-300 border border-emerald-200 hover:border-emerald-300 flex items-center justify-center gap-2"
              onClick={refresh}
            >
              <span className="text-lg">🔄</span>
              Try Again
            </button>
          </div>
          
          {/* Green status indicator */}
          <div className="mt-8 p-4 bg-gradient-to-r from-emerald-50/80 to-green-50/80 rounded-lg border border-emerald-200">
            <p className="text-sm text-emerald-700 flex items-center gap-2">
              <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></span>
              Real-time data connection
            </p>
          </div>
        </div>
      </div>
    );
  }

  const priceInfo = stock.priceInfo || {};
  const fundamentals = stock.fundamentals || {};
  const marketDepth = stock.marketDepth || {};
  const financials = stock.financials || {};

  return (
    <div className="min-h-screen px-4 md:px-8 lg:px-24 space-y-8 pb-32 relative">
      {/* Green background effects */}
      {renderFloatingEffects()}
      
      {/* Green gradient overlay at top */}
      <div className="absolute top-0 left-0 right-0 h-64 bg-gradient-to-b from-emerald-50/40 to-transparent pointer-events-none z-0"></div>
      
      <div className="relative z-10">
        {/* Stock Header with Chart */}
        <StockHeader 
          companyName={stock.companyName || stock.symbol}
          priceInfo={priceInfo}
          historicalData={historicalData}
          fundamentals={fundamentals}
          isLoading={chartLoading}
          onBack={onBack}
        />

        {/* Green separator */}
        <div className="my-8 flex items-center">
          <div className="flex-1 h-px bg-gradient-to-r from-transparent via-emerald-200 to-transparent"></div>
          <div className="mx-4 px-4 py-2 bg-gradient-to-r from-emerald-50 to-green-50 rounded-full border border-emerald-200">
            <span className="text-sm font-medium text-emerald-700">Investment Insights</span>
          </div>
          <div className="flex-1 h-px bg-gradient-to-r from-transparent via-emerald-200 to-transparent"></div>
        </div>

        {/* Overview Section */}
        <OverviewSection 
          priceInfo={priceInfo}
          fundamentals={fundamentals}
          marketDepth={marketDepth}
        />

        {/* Market Depth Section */}
        <MarketDepthSection 
          marketDepth={marketDepth}
          priceInfo={priceInfo}
        />

        {/* Green success indicator */}
        <div className="my-8 p-6 bg-gradient-to-r from-emerald-50 to-green-50 rounded-2xl border border-emerald-200 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gradient-to-br from-emerald-100 to-green-100 rounded-xl flex items-center justify-center">
              <span className="text-xl">📊</span>
            </div>
            <div>
              <h4 className="font-semibold text-gray-800">Live Market Data</h4>
              <p className="text-sm text-gray-600">Real-time updates • Secure connection • Verified sources</p>
            </div>
            <div className="ml-auto flex items-center gap-2">
              <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
              <span className="text-xs font-medium text-emerald-600">Active</span>
            </div>
          </div>
        </div>

        {/* Fundamentals Section */}
        <FundamentalsSection 
          fundamentals={fundamentals}
        />

        {/* Financials Section */}
        <FinancialsSection 
          financialData={financials}
        />

        {/* Bottom green gradient */}
        <div className="fixed bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-emerald-50/30 to-transparent pointer-events-none z-0"></div>
      </div>

      {/* Add CSS for animations */}
      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(5deg); }
        }
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
        
        @keyframes pulse-glow {
          0%, 100% { opacity: 0.3; }
          50% { opacity: 0.6; }
        }
        .animate-pulse-glow {
          animation: pulse-glow 2s ease-in-out infinite;
        }
        
        .hover-lift {
          transition: transform 0.2s ease, box-shadow 0.2s ease;
        }
        .hover-lift:hover {
          transform: translateY(-2px);
          box-shadow: 0 10px 25px -5px rgba(16, 185, 129, 0.1);
        }
      `}</style>
    </div>
  );
};

export default StockDetailsPage;