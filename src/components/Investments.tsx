import React, { useState } from 'react';
import { TrendingUp, TrendingDown, Plus, RefreshCw, BarChart3, PieChart, DollarSign, Target, Filter, Search, Download, Star, AlertTriangle } from 'lucide-react';
import { motion } from 'framer-motion';
import { InteractiveHoverButton } from './ui/interactive-hover-button';
import AnimatedSection from './AnimatedSection';

const Investments: React.FC = () => {
  const [activeTab, setActiveTab] = useState('portfolio');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('value');
  const [isRefreshing, setIsRefreshing] = useState(false);

  const portfolio = [
    {
      symbol: 'AAPL',
      name: 'Apple Inc.',
      shares: 25,
      currentPrice: 185.42,
      totalValue: 4635.50,
      dayChange: 2.34,
      dayChangePercent: 1.28,
      sector: 'Technology',
      marketCap: '2.9T',
      pe: 28.5,
      dividend: 0.24,
      rating: 'Buy'
    },
    {
      symbol: 'MSFT',
      name: 'Microsoft Corporation',
      shares: 15,
      currentPrice: 412.73,
      totalValue: 6190.95,
      dayChange: -5.67,
      dayChangePercent: -1.35,
      sector: 'Technology',
      marketCap: '3.1T',
      pe: 32.1,
      dividend: 0.75,
      rating: 'Buy'
    },
    {
      symbol: 'GOOGL',
      name: 'Alphabet Inc.',
      shares: 8,
      currentPrice: 142.56,
      totalValue: 1140.48,
      dayChange: 0.89,
      dayChangePercent: 0.63,
      sector: 'Technology',
      marketCap: '1.8T',
      pe: 25.3,
      dividend: 0.00,
      rating: 'Hold'
    },
    {
      symbol: 'TSLA',
      name: 'Tesla Inc.',
      shares: 12,
      currentPrice: 248.91,
      totalValue: 2986.92,
      dayChange: 12.45,
      dayChangePercent: 5.26,
      sector: 'Automotive',
      marketCap: '790B',
      pe: 65.2,
      dividend: 0.00,
      rating: 'Hold'
    },
    {
      symbol: 'NVDA',
      name: 'NVIDIA Corporation',
      shares: 5,
      currentPrice: 875.28,
      totalValue: 4376.40,
      dayChange: 15.67,
      dayChangePercent: 1.82,
      sector: 'Technology',
      marketCap: '2.2T',
      pe: 71.8,
      dividend: 0.16,
      rating: 'Buy'
    },
    {
      symbol: 'AMZN',
      name: 'Amazon.com Inc.',
      shares: 10,
      currentPrice: 155.89,
      totalValue: 1558.90,
      dayChange: -2.11,
      dayChangePercent: -1.33,
      sector: 'Consumer Discretionary',
      marketCap: '1.6T',
      pe: 45.7,
      dividend: 0.00,
      rating: 'Buy'
    }
  ];

  const watchlist = [
    { symbol: 'META', name: 'Meta Platforms Inc.', price: 498.37, change: 3.45, changePercent: 0.70, rating: 'Buy' },
    { symbol: 'NFLX', name: 'Netflix Inc.', price: 486.81, change: -8.23, changePercent: -1.66, rating: 'Hold' },
    { symbol: 'AMD', name: 'Advanced Micro Devices', price: 152.33, change: 4.67, changePercent: 3.16, rating: 'Buy' },
    { symbol: 'CRM', name: 'Salesforce Inc.', price: 267.12, change: 1.89, changePercent: 0.71, rating: 'Hold' }
  ];

  const marketNews = [
    {
      title: "Tech Stocks Rally on AI Optimism",
      summary: "Major technology companies see gains as investors remain bullish on artificial intelligence prospects.",
      time: "2 hours ago",
      impact: "positive",
      relevance: "high"
    },
    {
      title: "Federal Reserve Signals Rate Stability",
      summary: "Fed officials indicate potential pause in rate hikes, boosting market sentiment.",
      time: "4 hours ago",
      impact: "positive",
      relevance: "medium"
    },
    {
      title: "Energy Sector Faces Headwinds",
      summary: "Oil prices decline amid global economic uncertainty, affecting energy stocks.",
      time: "6 hours ago",
      impact: "negative",
      relevance: "low"
    }
  ];

  const filteredPortfolio = portfolio.filter(stock =>
    stock.symbol.toLowerCase().includes(searchTerm.toLowerCase()) ||
    stock.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPortfolioValue = portfolio.reduce((sum, stock) => sum + stock.totalValue, 0);
  const totalDayChange = portfolio.reduce((sum, stock) => sum + (stock.dayChange * stock.shares), 0);
  const totalDayChangePercent = (totalDayChange / (totalPortfolioValue - totalDayChange)) * 100;

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await new Promise(resolve => setTimeout(resolve, 2000));
    setIsRefreshing(false);
  };

  const getRatingColor = (rating: string) => {
    switch (rating.toLowerCase()) {
      case 'buy': return 'text-green-600 bg-green-50 border-green-200';
      case 'hold': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'sell': return 'text-red-600 bg-red-50 border-red-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const tabs = [
    { id: 'portfolio', label: 'Portfolio', icon: PieChart },
    { id: 'watchlist', label: 'Watchlist', icon: Star },
    { id: 'news', label: 'Market News', icon: TrendingUp },
    { id: 'analysis', label: 'Analysis', icon: Target }
  ];

  const renderPortfolioTab = () => (
    <div className="space-y-6">
      {/* Enhanced Portfolio Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <motion.div 
          className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200/50 rounded-xl p-6"
          whileHover={{ scale: 1.02 }}
          transition={{ duration: 0.2 }}
        >
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl flex items-center justify-center">
              <DollarSign size={20} className="text-white" />
            </div>
            <div className="text-sm font-medium text-blue-700 uppercase tracking-wide">Total Portfolio Value</div>
          </div>
          <div className="text-3xl font-bold text-blue-900">
            ${totalPortfolioValue.toLocaleString('en-US', { minimumFractionDigits: 2 })}
          </div>
          <div className="text-sm text-blue-600 mt-2">6 holdings</div>
        </motion.div>
        
        <motion.div 
          className={`bg-gradient-to-r ${totalDayChange >= 0 ? 'from-green-50 to-emerald-50 border-green-200/50' : 'from-red-50 to-rose-50 border-red-200/50'} border rounded-xl p-6`}
          whileHover={{ scale: 1.02 }}
          transition={{ duration: 0.2 }}
        >
          <div className="flex items-center space-x-3 mb-4">
            <div className={`w-12 h-12 bg-gradient-to-r ${totalDayChange >= 0 ? 'from-green-500 to-green-600' : 'from-red-500 to-red-600'} rounded-xl flex items-center justify-center`}>
              {totalDayChange >= 0 ? <TrendingUp size={20} className="text-white" /> : <TrendingDown size={20} className="text-white" />}
            </div>
            <div className={`text-sm font-medium ${totalDayChange >= 0 ? 'text-green-700' : 'text-red-700'} uppercase tracking-wide`}>Today's Change</div>
          </div>
          <div className={`text-3xl font-bold ${totalDayChange >= 0 ? 'text-green-900' : 'text-red-900'}`}>
            {totalDayChange >= 0 ? '+' : ''}${totalDayChange.toFixed(2)}
          </div>
          <div className={`text-sm ${totalDayChange >= 0 ? 'text-green-600' : 'text-red-600'} mt-2`}>
            {totalDayChangePercent >= 0 ? '+' : ''}{totalDayChangePercent.toFixed(2)}%
          </div>
        </motion.div>
        
        <motion.div 
          className="bg-gradient-to-r from-purple-50 to-violet-50 border border-purple-200/50 rounded-xl p-6"
          whileHover={{ scale: 1.02 }}
          transition={{ duration: 0.2 }}
        >
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl flex items-center justify-center">
              <BarChart3 size={20} className="text-white" />
            </div>
            <div className="text-sm font-medium text-purple-700 uppercase tracking-wide">Performance</div>
          </div>
          <div className="text-3xl font-bold text-purple-900">+18.67%</div>
          <div className="text-sm text-purple-600 mt-2">YTD Return</div>
        </motion.div>
      </div>

      {/* Enhanced Search and Filter */}
      <div className="bg-white/80 backdrop-blur-xl rounded-2xl border border-gray-200/50 p-6">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1 relative">
            <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search stocks by symbol or company name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl bg-white/80 backdrop-blur-sm focus:outline-none focus:border-accent-blue transition-colors"
            />
          </div>
          <div className="flex gap-3">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-4 py-3 border border-gray-200 rounded-xl bg-white/80 backdrop-blur-sm focus:outline-none focus:border-accent-blue transition-colors"
            >
              <option value="value">Sort by Value</option>
              <option value="change">Sort by Change</option>
              <option value="symbol">Sort by Symbol</option>
            </select>
            <InteractiveHoverButton
              variant="white"
              text="Export"
              icon={<Download size={16} />}
              className="px-4 py-3 text-sm"
            />
          </div>
        </div>
      </div>

      {/* Enhanced Holdings Table */}
      <div className="bg-white/80 backdrop-blur-xl rounded-2xl border border-gray-200/50 overflow-hidden">
        {/* Desktop Header */}
        <div className="hidden lg:grid grid-cols-8 gap-4 p-6 border-b border-gray-200/50 bg-gray-50/50">
          <div className="font-bold text-gray-700 text-sm uppercase tracking-wide">Stock</div>
          <div className="font-bold text-gray-700 text-sm uppercase tracking-wide">Company</div>
          <div className="font-bold text-gray-700 text-sm uppercase tracking-wide text-center">Shares</div>
          <div className="font-bold text-gray-700 text-sm uppercase tracking-wide text-right">Price</div>
          <div className="font-bold text-gray-700 text-sm uppercase tracking-wide text-right">Day Change</div>
          <div className="font-bold text-gray-700 text-sm uppercase tracking-wide text-right">Total Value</div>
          <div className="font-bold text-gray-700 text-sm uppercase tracking-wide text-center">Rating</div>
          <div className="font-bold text-gray-700 text-sm uppercase tracking-wide text-center">Actions</div>
        </div>

        {/* Stock Rows */}
        <div className="divide-y divide-gray-200/50">
          {filteredPortfolio.map((stock, index) => (
            <motion.div 
              key={stock.symbol}
              className="p-6 hover:bg-gray-50/50 transition-colors cursor-pointer"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
              whileHover={{ scale: 1.005 }}
            >
              {/* Desktop Layout */}
              <div className="hidden lg:grid grid-cols-8 gap-4 items-center">
                <div className="font-bold text-accent-blue text-lg">{stock.symbol}</div>
                <div>
                  <div className="font-medium text-gray-900">{stock.name}</div>
                  <div className="text-sm text-gray-500">{stock.sector}</div>
                </div>
                <div className="text-center text-gray-900">{stock.shares}</div>
                <div className="text-right text-gray-900">${stock.currentPrice.toFixed(2)}</div>
                <div className={`text-right font-bold flex items-center justify-end space-x-2 ${
                  stock.dayChange >= 0 ? 'text-green-600' : 'text-red-600'
                }`}>
                  <div className="w-6 h-6 rounded-md bg-gray-100 flex items-center justify-center">
                    {stock.dayChange >= 0 ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
                  </div>
                  <span>{stock.dayChange >= 0 ? '+' : ''}{stock.dayChangePercent.toFixed(2)}%</span>
                </div>
                <div className="text-right font-bold text-gray-900">${stock.totalValue.toFixed(2)}</div>
                <div className="text-center">
                  <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs border ${getRatingColor(stock.rating)}`}>
                    {stock.rating}
                  </span>
                </div>
                <div className="text-center">
                  <div className="flex space-x-2 justify-center">
                    <InteractiveHoverButton
                      variant="white"
                      text="Buy"
                      className="px-3 py-1 text-xs"
                    />
                    <InteractiveHoverButton
                      variant="white"
                      text="Sell"
                      className="px-3 py-1 text-xs"
                    />
                  </div>
                </div>
              </div>

              {/* Mobile Layout */}
              <div className="lg:hidden space-y-4">
                <div className="flex justify-between items-start">
                  <div>
                    <div className="font-bold text-accent-blue text-lg">{stock.symbol}</div>
                    <div className="font-medium text-gray-900">{stock.name}</div>
                    <div className="text-sm text-gray-500">{stock.sector}</div>
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs border mt-2 ${getRatingColor(stock.rating)}`}>
                      {stock.rating}
                    </span>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-gray-900">${stock.totalValue.toFixed(2)}</div>
                    <div className={`text-sm font-medium ${
                      stock.dayChange >= 0 ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {stock.dayChange >= 0 ? '+' : ''}{stock.dayChangePercent.toFixed(2)}%
                    </div>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-500">Shares: </span>
                    <span className="text-gray-900">{stock.shares}</span>
                  </div>
                  <div>
                    <span className="text-gray-500">Price: </span>
                    <span className="text-gray-900">${stock.currentPrice.toFixed(2)}</span>
                  </div>
                  <div>
                    <span className="text-gray-500">P/E: </span>
                    <span className="text-gray-900">{stock.pe}</span>
                  </div>
                  <div>
                    <span className="text-gray-500">Dividend: </span>
                    <span className="text-gray-900">${stock.dividend}</span>
                  </div>
                </div>

                <div className="flex space-x-3">
                  <InteractiveHoverButton
                    variant="white"
                    text="Buy More"
                    className="flex-1 text-center text-sm px-4 py-2"
                  />
                  <InteractiveHoverButton
                    variant="blue"
                    text="Sell"
                    className="flex-1 text-center text-sm px-4 py-2"
                  />
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderWatchlistTab = () => (
    <div className="space-y-6">
      <div className="bg-white/80 backdrop-blur-xl rounded-2xl border border-gray-200/50 overflow-hidden">
        <div className="p-6 border-b border-gray-200/50 bg-gradient-to-r from-yellow-50 to-orange-50">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-bold text-gray-900 flex items-center space-x-2">
                <Star size={20} className="text-yellow-500" />
                <span>Your Watchlist</span>
              </h3>
              <p className="text-sm text-gray-600">Track stocks you're interested in</p>
            </div>
            <InteractiveHoverButton
              variant="blue"
              text="Add Stock"
              icon={<Plus size={16} />}
              className="px-4 py-2 text-sm"
            />
          </div>
        </div>
        
        <div className="divide-y divide-gray-200/50">
          {watchlist.map((stock, index) => (
            <motion.div 
              key={stock.symbol}
              className="p-6 hover:bg-gray-50/50 transition-colors cursor-pointer"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              whileHover={{ scale: 1.005 }}
            >
              <div className="flex justify-between items-center">
                <div className="flex items-center space-x-4">
                  <div>
                    <div className="font-bold text-accent-blue text-lg">{stock.symbol}</div>
                    <div className="text-gray-600">{stock.name}</div>
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs border mt-1 ${getRatingColor(stock.rating)}`}>
                      {stock.rating}
                    </span>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-bold text-gray-900">${stock.price.toFixed(2)}</div>
                  <div className={`text-sm font-medium ${
                    stock.change >= 0 ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {stock.change >= 0 ? '+' : ''}${stock.change.toFixed(2)} ({stock.change >= 0 ? '+' : ''}{stock.changePercent.toFixed(2)}%)
                  </div>
                  <div className="flex space-x-2 mt-2">
                    <InteractiveHoverButton
                      variant="blue"
                      text="Buy"
                      className="px-3 py-1 text-xs"
                    />
                    <InteractiveHoverButton
                      variant="white"
                      text="Remove"
                      className="px-3 py-1 text-xs"
                    />
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderNewsTab = () => (
    <div className="space-y-6">
      {marketNews.map((news, index) => (
        <motion.div
          key={index}
          className="bg-white/80 backdrop-blur-xl rounded-2xl border border-gray-200/50 p-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: index * 0.1 }}
          whileHover={{ scale: 1.01 }}
        >
          <div className="flex items-start space-x-4">
            <div className={`w-4 h-4 rounded-full mt-2 ${
              news.impact === 'positive' ? 'bg-green-500' : news.impact === 'negative' ? 'bg-red-500' : 'bg-yellow-500'
            }`} />
            <div className="flex-1">
              <div className="flex items-start justify-between mb-2">
                <h3 className="font-bold text-gray-900">{news.title}</h3>
                <div className="flex items-center space-x-2">
                  <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs ${
                    news.relevance === 'high' ? 'bg-red-100 text-red-800' :
                    news.relevance === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {news.relevance} relevance
                  </span>
                </div>
              </div>
              <p className="text-gray-600 mb-3">{news.summary}</p>
              <div className="flex items-center justify-between">
                <div className="text-sm text-gray-500">{news.time}</div>
                <InteractiveHoverButton
                  variant="white"
                  text="Read More"
                  className="px-3 py-1 text-xs"
                />
              </div>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );

  const renderAnalysisTab = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white/80 backdrop-blur-xl rounded-2xl border border-gray-200/50 p-6">
          <h3 className="font-bold text-gray-900 mb-4 flex items-center space-x-2">
            <PieChart size={20} className="text-accent-blue" />
            <span>Sector Allocation</span>
          </h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Technology</span>
              <div className="flex items-center space-x-2">
                <div className="w-24 bg-gray-200 rounded-full h-2">
                  <div className="bg-accent-blue h-2 rounded-full" style={{ width: '75.2%' }}></div>
                </div>
                <span className="font-medium text-sm">75.2%</span>
              </div>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Automotive</span>
              <div className="flex items-center space-x-2">
                <div className="w-24 bg-gray-200 rounded-full h-2">
                  <div className="bg-green-500 h-2 rounded-full" style={{ width: '15.8%' }}></div>
                </div>
                <span className="font-medium text-sm">15.8%</span>
              </div>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Consumer Discretionary</span>
              <div className="flex items-center space-x-2">
                <div className="w-24 bg-gray-200 rounded-full h-2">
                  <div className="bg-purple-500 h-2 rounded-full" style={{ width: '9.0%' }}></div>
                </div>
                <span className="font-medium text-sm">9.0%</span>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white/80 backdrop-blur-xl rounded-2xl border border-gray-200/50 p-6">
          <h3 className="font-bold text-gray-900 mb-4 flex items-center space-x-2">
            <BarChart3 size={20} className="text-accent-blue" />
            <span>Performance Metrics</span>
          </h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">1 Day Return</span>
              <span className="font-medium text-green-600">+1.24%</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">1 Week Return</span>
              <span className="font-medium text-green-600">+3.45%</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">1 Month Return</span>
              <span className="font-medium text-red-600">-2.18%</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">YTD Return</span>
              <span className="font-medium text-green-600">+18.67%</span>
            </div>
          </div>
        </div>
      </div>

      {/* Risk Analysis */}
      <div className="bg-white/80 backdrop-blur-xl rounded-2xl border border-gray-200/50 p-6">
        <h3 className="font-bold text-gray-900 mb-4 flex items-center space-x-2">
          <AlertTriangle size={20} className="text-yellow-500" />
          <span>Risk Analysis</span>
        </h3>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="text-center p-4 bg-green-50 rounded-xl border border-green-200">
            <div className="text-2xl font-bold text-green-600 mb-1">Low</div>
            <div className="text-sm text-green-700">Portfolio Risk</div>
          </div>
          <div className="text-center p-4 bg-blue-50 rounded-xl border border-blue-200">
            <div className="text-2xl font-bold text-blue-600 mb-1">0.85</div>
            <div className="text-sm text-blue-700">Beta Coefficient</div>
          </div>
          <div className="text-center p-4 bg-purple-50 rounded-xl border border-purple-200">
            <div className="text-2xl font-bold text-purple-600 mb-1">1.42</div>
            <div className="text-sm text-purple-700">Sharpe Ratio</div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="mobile-spacing lg:p-8 space-y-6 lg:space-y-8">
      {/* Enhanced Page Header */}
      <AnimatedSection className="mb-8 lg:mb-12">
        <div className="flex flex-col lg:flex-row lg:justify-between lg:items-start space-y-6 lg:space-y-0">
          <div>
            <h1 className="text-xl lg:text-2xl mb-2 font-bold uppercase tracking-wide">INVESTMENTS</h1>
            <motion.div 
              className="w-12 lg:w-16 h-px bg-accent-blue"
              initial={{ width: 0 }}
              animate={{ width: window.innerWidth >= 1024 ? 64 : 48 }}
              transition={{ duration: 0.4, delay: 0.1 }}
            />
            <p className="text-gray-600 mt-3">Monitor and manage your investment portfolio</p>
          </div>
          
          {/* Enhanced Action Buttons */}
          <div className="flex flex-col lg:flex-row gap-3 lg:gap-4">
            <div className="flex gap-3">
              <InteractiveHoverButton
                variant="white"
                text={isRefreshing ? "Refreshing..." : "Refresh"}
                icon={<RefreshCw size={16} className={isRefreshing ? "animate-spin" : ""} />}
                onClick={handleRefresh}
                disabled={isRefreshing}
                className="px-4 py-3 disabled:opacity-50 text-sm"
              />

              <InteractiveHoverButton
                variant="white"
                text="Export"
                icon={<Download size={16} />}
                className="px-4 py-3 text-sm"
              />
            </div>

            <InteractiveHoverButton
              variant="blue"
              text="Buy Stock"
              icon={<Plus size={16} />}
              className="px-6 py-3 text-sm font-medium"
            />
          </div>
        </div>
      </AnimatedSection>

      {/* Enhanced Tab Navigation */}
      <div className="bg-white/80 backdrop-blur-xl rounded-2xl border border-gray-200/50 p-2">
        <nav className="flex space-x-1 overflow-x-auto">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <motion.button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 px-4 py-3 rounded-xl transition-all whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'bg-accent-blue text-white shadow-lg'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
                whileHover={{ y: -1 }}
                whileTap={{ scale: 0.98 }}
              >
                <Icon size={16} />
                <span className="font-medium">{tab.label}</span>
              </motion.button>
            );
          })}
        </nav>
      </div>

      {/* Tab Content */}
      <motion.div
        key={activeTab}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        {activeTab === 'portfolio' && renderPortfolioTab()}
        {activeTab === 'watchlist' && renderWatchlistTab()}
        {activeTab === 'news' && renderNewsTab()}
        {activeTab === 'analysis' && renderAnalysisTab()}
      </motion.div>
    </div>
  );
};

export default Investments;