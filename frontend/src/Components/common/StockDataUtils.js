export const getCompanyDisplayName = (symbol) => {
  const names = {
    'RELIANCE': 'Reliance Industries',
    'TCS': 'Tata Consultancy',
    'HDFCBANK': 'HDFC Bank',
    'INFY': 'Infosys',
    'SBIN': 'State Bank India',
    'ICICIBANK': 'ICICI Bank',
    'HINDUNILVR': 'Hindustan Unilever',
    'ITC': 'ITC',
    'KOTAKBANK': 'Kotak Mahindra Bank',
    'AXISBANK': 'Axis Bank',
    'LT': 'Larsen & Toubro',
    'BAJFINANCE': 'Bajaj Finance',
    'WIPRO': 'Wipro',
    'HCLTECH': 'HCL Technologies',
    'TATAMOTORS': 'Tata Motors',
    'SUNPHARMA': 'Sun Pharmaceutical',
    'BHARTIARTL': 'Bharti Airtel',
    'MARUTI': 'Maruti Suzuki',
    'ONGC': 'ONGC',
    'NTPC': 'NTPC',
    'POWERGRID': 'Power Grid',
    'HINDALCO': 'Hindalco',
    'HINDZINC': 'Hindustan Zinc',
    'BAJAJHLDNG': 'Bajaj Holdings',
    'JSWSTEEL': 'JSW Steel',
    'TATASTEEL': 'Tata Steel',
    'UPL': 'UPL',
    'VEDL': 'Vedanta',
    'ASIANPAINT': 'Asian Paints',
    'ULTRACEMCO': 'UltraTech Cement',
    'TITAN': 'Titan Company',
    'NESTLEIND': 'Nestle India',
    'BRITANNIA': 'Britannia',
    'HEROMOTOCO': 'Hero Motocorp',
    'EICHERMOT': 'Eicher Motors',
    'DIVISLAB': 'Divis Labs',
    'DRREDDY': 'Dr Reddys Labs',
    'CIPLA': 'Cipla',
    'GRASIM': 'Grasim Industries',
    'ADANIPORTS': 'Adani Ports',
    'SHREECEM': 'Shree Cement',
    'COALINDIA': 'Coal India',
    'IOC': 'Indian Oil Corp',
    'BPCL': 'BPCL',
    'GAIL': 'GAIL',
    'HINDPETRO': 'HPCL',
    'ZEEL': 'Zee Entertainment',
    'PIDILITIND': 'Pidilite Industries',
    'INDUSINDBK': 'IndusInd Bank',
    'TECHM': 'Tech Mahindra',
    'BAJAJFINSV': 'Bajaj Finserv',
    'NIFTY 50': 'NIFTY 50',
    'SENSEX': 'SENSEX',
    'BANKNIFTY': 'BANK NIFTY',
    'MIDCPNIFTY': 'MIDCAP NIFTY',
    'FINNIFTY': 'FINANCIAL NIFTY',
    'NIFTY 100': 'NIFTY 100',
    'HIKAL': 'HIKAL',
    'ROUTE': 'Route Mobile',
    'DOMS': 'DOMS Industries',
    'CAPITAL': 'Capital India Finance',
    'BBTC': 'Bombay Burmah Trading',
    'SLOANE': 'Sploe Lounge Food Works'
  };
  return names[symbol] || symbol;
};

export const formatCurrency = (value) => {
  if (value === undefined || value === null || isNaN(value)) {
    return '₹0.00';
  }
  
  const numValue = parseFloat(value);
  if (numValue >= 10000000) {
    return `₹${(numValue / 10000000).toFixed(2)} Cr`;
  } else if (numValue >= 100000) {
    return `₹${(numValue / 100000).toFixed(2)} L`;
  }
  
  return `₹${numValue.toLocaleString('en-IN', { 
    minimumFractionDigits: 2, 
    maximumFractionDigits: 2 
  })}`;
};

export const formatPercentage = (value) => {
  if (value === undefined || value === null || isNaN(value)) {
    return '0.00%';
  }
  const numValue = parseFloat(value);
  const sign = numValue >= 0 ? '+' : '';
  return `${sign}${numValue.toFixed(2)}%`;
};

export const formatNumber = (value) => {
  if (value === undefined || value === null || isNaN(value)) {
    return '0.00';
  }
  return parseFloat(value).toFixed(2);
};

export const formatVolume = (volume) => {
  if (!volume || volume === 0) return '0';
  const num = parseFloat(volume);
  if (num >= 10000000) return `${(num / 10000000).toFixed(2).toLocaleString('en-IN')} Cr`;
  if (num >= 100000) return `${(num / 100000).toFixed(2).toLocaleString('en-IN')} L`;
  return `${num.toLocaleString('en-IN')}`;
};

export const getChangeClass = (change) => {
  if (change > 0) return 'positive';
  if (change < 0) return 'negative';
  return 'neutral';
};