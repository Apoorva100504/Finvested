
import React, { useState, useMemo } from 'react';
import { useBulkStockData } from '../../hooks/useStockData';
import MarketIndices from './MarketIndices';
import MostBoughtStocks from './MostBoughtStocks';
import TopMoversSection from './TopMoversSection';
import ToolsSection from './ToolsSection';
import './StockDashboard.css';

const StockDashboard = () => {
  const [allStockSymbols] = useState([
    'RELIANCE', 'TCS', 'HDFCBANK', 'INFY', 'ICICIBANK', 'SBIN',
    'BHARTIARTL', 'ITC', 'KOTAKBANK', 'AXISBANK', 'LT',
    'BAJFINANCE', 'WIPRO', 'HCLTECH', 'TATAMOTORS', 'SUNPHARMA',
    'MARUTI', 'ONGC', 'NTPC', 'POWERGRID', 'HIKAL', 'ROUTE', 'DOMS', 'CAPITAL', 'BBTC', 'SLOANE'
  ]);

  const [indicesSymbols] = useState(['NIFTY 50', 'SENSEX', 'BANKNIFTY']);
  const [mostBoughtSymbols] = useState(['RELIANCE', 'TCS', 'HDFCBANK', 'INFY', 'SBIN']);

  const { stocks: allStocks, loading: allLoading } = useBulkStockData(allStockSymbols);
  const { stocks: indicesStocks, loading: indicesLoading } = useBulkStockData(indicesSymbols);
  const { stocks: mostBoughtStocks, loading: mostBoughtLoading } = useBulkStockData(mostBoughtSymbols);

  const [activeTab, setActiveTab] = useState('gainers');
  const [showAll, setShowAll] = useState(false);

  const categorizedStocks = useMemo(() => {
    if (!allStocks || allStocks.length === 0) {
      return {
        gainers: [],
        losers: [],
        volumeShockers: [],
        allStocks: []
      };
    }

    const validStocks = allStocks
      .filter(stock => stock && stock.priceInfo &&
        stock.priceInfo.pChange !== undefined &&
        stock.priceInfo.lastPrice !== undefined)
      .map(stock => ({
        ...stock,
        symbol: stock.symbol,
        name: getCompanyDisplayName(stock.symbol),
        price: stock.priceInfo.lastPrice,
        change: stock.priceInfo.change || 0,
        pChange: stock.priceInfo.pChange || 0,
        volume: stock.priceInfo.totalTradedVolume || 0,
        marketCap: stock.priceInfo.marketCap || 0,
        dayHigh: stock.priceInfo.dayHigh || 0,
        dayLow: stock.priceInfo.dayLow || 0
      }));

    const volumes = validStocks.map(s => s.volume).filter(v => v > 0);
    const avgVolume = volumes.length > 0 ?
      volumes.reduce((a, b) => a + b, 0) / volumes.length : 1000000;

    const gainers = validStocks.filter(s => s.pChange > 0).sort((a, b) => b.pChange - a.pChange);
    const losers = validStocks.filter(s => s.pChange < 0).sort((a, b) => a.pChange - b.pChange);
    const volumeShockers = validStocks.filter(s => s.volume > avgVolume * 1.5).sort((a, b) => b.volume - a.volume);

    return {
      gainers: gainers.slice(0, showAll ? 20 : 6),
      losers: losers.slice(0, showAll ? 20 : 6),
      volumeShockers: volumeShockers.slice(0, showAll ? 20 : 6),
      allStocks: validStocks
    };
  }, [allStocks, showAll]);

  const getActiveStocks = () => {
    switch (activeTab) {
      case 'gainers': return categorizedStocks.gainers;
      case 'losers': return categorizedStocks.losers;
      case 'volume': return categorizedStocks.volumeShockers;
      default: return categorizedStocks.gainers;
    }
  };

  const getVolumeChangePercentage = (stock) => {
    const volumeChanges = {
      'HIKAL': 38045,
      'ROUTE': 16525,
      'DOMS': 0,
      'CAPITAL': 4646,
      'BBTC': 4291,
      'SLOANE': 2816
    };
    return volumeChanges[stock.symbol] || Math.abs(stock.pChange * 100).toFixed(0);
  };

  const getChartData = () => {
    const stocks = getActiveStocks();
    return stocks.map(stock => ({
      name: stock.symbol,
      value: activeTab === 'volume' ? stock.volume : Math.abs(stock.pChange),
      price: stock.price,
      change: stock.pChange,
      volume: stock.volume,
      color: activeTab === 'losers' ? '#ff6b6b' : '#00d09c'
    }));
  };

  const isLoading = indicesLoading || mostBoughtLoading || allLoading;

  if (isLoading) {
    return (
      <div className="dashboard-loading">
        <div className="spinner"></div>
        <p>Loading market data...</p>
      </div>
    );
  }

  const activeStocks = getActiveStocks();
  const chartData = getChartData();

  return (
    <div className="stock-dashboard-wrapper">
      <div className="stock-dashboard min-h-screen bg-gray-50 px-6 md:px-12 lg:px-20 py-6">
        <MarketIndices indicesStocks={indicesStocks} />

        <div className="main-content-grid">
          <div className="stocks-column">
            <MostBoughtStocks mostBoughtStocks={mostBoughtStocks} />

            <TopMoversSection
              activeTab={activeTab}
              setActiveTab={setActiveTab}
              chartData={chartData}
              activeStocks={activeStocks}
              showAll={showAll}
              setShowAll={setShowAll}
              getVolumeChangePercentage={getVolumeChangePercentage}
            />
          </div>

          <div className="tools-column">
            <ToolsSection />
          </div>
        </div>
      </div>
    </div>
  );
};

export default StockDashboard;