import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import "./StockDetailsPage.css"
import { useStockDetails } from '../hooks/useStockData';
import StockHeader from './StockHeader';
import OverviewSection from './OverviewSection';
import MarketDepthSection from './MarketDepthSection';
import FundamentalsSection from './FundamentalsSection';
import FinancialsSection from './FinancialsSection';

const StockDetailsPage = ({ stockSymbol, onBack }) => {
  const { stock, loading, error, historicalData, refresh } = useStockDetails(stockSymbol);
  const [chartLoading, setChartLoading] = useState(true);

  useEffect(() => {
    if (historicalData && historicalData.length > 0) {
      setChartLoading(false);
    }
  }, [historicalData]);

  const renderFloatingEffects = () => (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
      <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-[#48E1C4]/20 rounded-full mix-blend-multiply filter blur-3xl animate-blob"></div>
      <div className="absolute top-1/3 right-1/4 w-64 h-64 bg-[#5064FF]/20 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-2000"></div>
      <div className="absolute bottom-1/4 left-1/2 w-64 h-64 bg-[#48E1C4]/20 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-4000"></div>
    </div>
  );

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen px-4 md:px-8 lg:px-16 relative overflow-hidden bg-gradient-to-br from-gray-50 via-white to-blue-50/30">
        {renderFloatingEffects()}
        
        <div className="relative z-10">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="relative"
          >
            <motion.div 
              className="animate-spin rounded-full h-20 w-20 border-4 border-[#5064FF]/20"
              animate={{ rotate: 360 }}
              transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
            />
            <motion.div 
              className="absolute top-0 left-0 animate-spin rounded-full h-20 w-20 border-t-4 border-[#5064FF]"
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            />
          </motion.div>
          
          <motion.p 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mt-8 text-lg font-medium text-gray-800"
          >
            Loading stock details...
          </motion.p>
          <motion.p 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mt-2 text-sm text-[#5064FF]"
          >
            Fetching {stockSymbol || 'stock'} data
          </motion.p>
          
          <div className="mt-6 flex gap-2 justify-center">
            <motion.div 
              className="h-3 w-3 bg-gradient-to-br from-[#5064FF] to-[#48E1C4] rounded-full"
              animate={{ scale: [1, 1.5, 1] }}
              transition={{ duration: 1, repeat: Infinity, delay: 0 }}
            />
            <motion.div 
              className="h-3 w-3 bg-gradient-to-br from-[#5064FF] to-[#48E1C4] rounded-full"
              animate={{ scale: [1, 1.5, 1] }}
              transition={{ duration: 1, repeat: Infinity, delay: 0.2 }}
            />
            <motion.div 
              className="h-3 w-3 bg-gradient-to-br from-[#5064FF] to-[#48E1C4] rounded-full"
              animate={{ scale: [1, 1.5, 1] }}
              transition={{ duration: 1, repeat: Infinity, delay: 0.4 }}
            />
          </div>
          
          <motion.div 
            className="mt-8 w-64 h-2 bg-[#5064FF]/10 rounded-full overflow-hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            <motion.div 
              className="h-full bg-gradient-to-r from-[#5064FF] to-[#48E1C4] rounded-full"
              initial={{ width: "0%" }}
              animate={{ width: "100%" }}
              transition={{ duration: 2, ease: "easeInOut" }}
            />
          </motion.div>
        </div>
      </div>
    );
  }

  if (error || !stock) {
    return (
      <div className="min-h-screen px-4 md:px-8 lg:px-24 flex items-center justify-center relative overflow-hidden bg-gradient-to-br from-gray-50 via-white to-blue-50/30">
        {renderFloatingEffects()}
        
        <motion.div 
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          className="relative z-10 bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-8 max-w-md w-full border border-gray-100/50 gradient-hover"
        >
          <motion.div 
            className="absolute -top-8 -right-8 w-16 h-16 bg-gradient-to-br from-[#5064FF]/10 to-[#48E1C4]/10 rounded-full flex items-center justify-center"
            animate={{ rotate: [0, 10, -10, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <span className="text-3xl">⚠️</span>
          </motion.div>
          
          <h3 className="text-2xl font-bold text-gray-800 mb-3 mt-4">Unable to load stock details</h3>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-gray-600 mb-8"
          >
            {error || 'Stock data not available'}
          </motion.p>
          
          <div className="space-y-4">
            <motion.button 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full px-6 py-4 bg-gradient-to-r from-[#5064FF] to-[#48E1C4] text-white rounded-xl font-medium transition-all duration-300 shadow-lg hover:shadow-xl"
              onClick={onBack}
            >
              ← Back to Dashboard
            </motion.button>
            <motion.button 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full px-6 py-4 bg-gradient-to-r from-[#5064FF]/5 to-[#48E1C4]/5 text-[#5064FF] rounded-xl font-medium transition-all duration-300 border border-[#5064FF]/20 hover:border-[#5064FF]/40 flex items-center justify-center gap-2"
              onClick={refresh}
            >
              <motion.span 
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                className="text-lg"
              >
                🔄
              </motion.span>
              Try Again
            </motion.button>
          </div>
          
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="mt-8 p-4 bg-gradient-to-r from-[#5064FF]/5 to-[#48E1C4]/5 rounded-lg border border-[#5064FF]/20"
          >
            <p className="text-sm text-[#5064FF] flex items-center gap-2">
              <motion.span 
                className="w-2 h-2 bg-[#5064FF] rounded-full"
                animate={{ scale: [1, 1.5, 1] }}
                transition={{ duration: 1, repeat: Infinity }}
              />
              Real-time data connection
            </p>
          </motion.div>
        </motion.div>
      </div>
    );
  }

  const priceInfo = stock.priceInfo || {};
  const fundamentals = stock.fundamentals || {};
  const marketDepth = stock.marketDepth || {};
  const financials = stock.financials || {};

  return (
    <div className="min-h-screen px-4 md:px-8 lg:px-24 space-y-8 pb-32 relative bg-gradient-to-br from-gray-50 via-white to-blue-50/30">
      {renderFloatingEffects()}
      
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="absolute top-0 left-0 right-0 h-64 bg-gradient-to-b from-[#5064FF]/10 via-[#48E1C4]/5 to-transparent pointer-events-none z-0"
      />
      
      <div className="relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <StockHeader 
            companyName={stock.companyName || stock.symbol}
            priceInfo={priceInfo}
            historicalData={historicalData}
            fundamentals={fundamentals}
            isLoading={chartLoading}
            onBack={onBack}
          />
        </motion.div>

        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="my-8 flex items-center"
        >
          <div className="flex-1 h-px bg-gradient-to-r from-transparent via-[#5064FF]/20 to-transparent"></div>
          <motion.div 
            className="mx-4 px-4 py-2 bg-gradient-to-r from-[#5064FF]/5 to-[#48E1C4]/5 rounded-full border border-[#5064FF]/20"
            whileHover={{ scale: 1.05 }}
          >
            <span className="text-sm font-medium text-[#5064FF]">Investment Insights</span>
          </motion.div>
          <div className="flex-1 h-px bg-gradient-to-r from-transparent via-[#5064FF]/20 to-transparent"></div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <OverviewSection 
            priceInfo={priceInfo}
            fundamentals={fundamentals}
            marketDepth={marketDepth}
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <MarketDepthSection 
            marketDepth={marketDepth}
            priceInfo={priceInfo}
          />
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="my-8 p-6 bg-gradient-to-r from-[#5064FF]/5 to-[#48E1C4]/5 rounded-2xl border border-[#5064FF]/20 shadow-sm gradient-hover"
          whileHover={{ scale: 1.01 }}
        >
          <div className="flex items-center gap-4">
            <motion.div 
              className="w-12 h-12 bg-gradient-to-br from-[#5064FF]/10 to-[#48E1C4]/10 rounded-xl flex items-center justify-center"
              whileHover={{ rotate: 5, scale: 1.1 }}
            >
              <span className="text-xl">📊</span>
            </motion.div>
            <div>
              <h4 className="font-semibold text-gray-800">Live Market Data</h4>
              <p className="text-sm text-gray-600">Real-time updates • Secure connection • Verified sources</p>
            </div>
            <div className="ml-auto flex items-center gap-2">
              <motion.div 
                className="w-2 h-2 bg-[#5064FF] rounded-full"
                animate={{ scale: [1, 1.5, 1] }}
                transition={{ duration: 1, repeat: Infinity }}
              />
              <span className="text-xs font-medium text-[#5064FF]">Active</span>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
        >
          <FundamentalsSection 
            fundamentals={fundamentals}
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.7 }}
        >
          <FinancialsSection 
            financialData={financials}
          />
        </motion.div>

        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="fixed bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#5064FF]/10 to-transparent pointer-events-none z-0"
        />
      </div>

      
    </div>
  );
};

export default StockDetailsPage;