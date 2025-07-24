import React, { useState, useEffect } from 'react';
import { TrendingUp, TrendingDown, Plus, RefreshCw, BarChart3, PieChart, DollarSign, Target, Filter, Search, Download, Star, AlertTriangle } from 'lucide-react';
import { motion } from 'framer-motion';
import { InteractiveHoverButton } from './ui/interactive-hover-button';
import AnimatedSection from './AnimatedSection';
import { useAccounts } from '../hooks/useAccounts';
import { useTransactions } from '../hooks/useTransactions';
import { useInvestments } from '../hooks/useInvestments';
import { convertToCSV, downloadCSV, formatInvestmentsForCSV, formatAccountsForCSV } from '../utils/csvExport';

const Investments: React.FC = () => {
  const [activeTab, setActiveTab] = useState('portfolio');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('value');
  const [isRefreshing, setIsRefreshing] = useState(false);

  const { accounts, loading: accountsLoading, getAccountsByType } = useAccounts();
  const { transactions, loading: transactionsLoading } = useTransactions();
  const { 
    investments, 
    loading: investmentsLoading, 
    refetch: refetchInvestments,
    getTotalInvestmentValue,
    getDailyChange,
    getDailyChangePercent
  } = useInvestments();

  // Get investment accounts from real data
  const investmentAccounts = getAccountsByType('investment');
  
  // Calculate total portfolio value from both direct investments and investment accounts
  const directInvestmentsValue = getTotalInvestmentValue();
  const accountInvestmentsValue = investmentAccounts.reduce((sum, account) => sum + Number(account.current_balance), 0);
  const totalPortfolioValue = directInvestmentsValue + accountInvestmentsValue;

  // Daily change calculations
  const dailyChange = getDailyChange();
  const dailyChangePercent = getDailyChangePercent();

  // Filter investments based on search term
  const filteredInvestments = investments.filter(investment =>
    investment.symbol.toLowerCase().includes(searchTerm.toLowerCase()) ||
    investment.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Watchlist data (mock for now)
  const watchlist = [
    { symbol: 'AAPL', name: 'Apple Inc.', price: 185.42, change: 2.34, changePercent: 1.28, rating: 'Buy' },
    { symbol: 'MSFT', name: 'Microsoft Corporation', price: 412.73, change: -5.67, changePercent: -1.35, rating: 'Buy' },
    { symbol: 'GOOGL', name: 'Alphabet Inc.', price: 142.56, change: 0.89, changePercent: 0.63, rating: 'Hold' },
    { symbol: 'TSLA', name: 'Tesla Inc.', price: 248.91, change: 12.45, changePercent: 5.26, rating: 'Hold' }
  ];

  // Market news (mock for now)
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

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await refetchInvestments();
    setIsRefreshing(false);
  };

  const handleExport = () => {
    try {
      let csvData: any[] = [];
      let filename = '';
      
      if (activeTab === 'portfolio') {
        // Export both direct investments and investment accounts
        const investmentData = formatInvestmentsForCSV(investments);
        const accountData = formatAccountsForCSV(investmentAccounts);
        
        // Combine both datasets
        csvData = [
          ...investmentData,
          ...accountData.map(acc => ({
            'Symbol': 'ACCOUNT',
            'Company Name': acc['Account Name'],
            'Shares': 1,
            'Current Price': acc['Current Balance'],
            'Total Value': acc['Current Balance'],
            'Day Change': 0,
            'Day Change %': 0,
            'Sector': 'Banking',
            'Market Cap': 'N/A',
            'P/E Ratio': 'N/A',
            'Dividend': 0,
            'Rating': 'N/A',
            'Last Updated': acc['Created At']
          }))
        ];
        filename = `portfolio_${new Date().toISOString().split('T')[0]}.csv`;
      } else if (activeTab === 'watchlist') {
        csvData = watchlist.map(stock => ({
          'Symbol': stock.symbol,
          'Company Name': stock.name,
          'Current Price': stock.price,
          'Day Change': stock.change,
          'Day Change %': stock.changePercent,
          'Rating': stock.rating
        }));
        filename = `watchlist_${new Date().toISOString().split('T')[0]}.csv`;
      } else {
        // Default to portfolio export
        csvData = formatInvestmentsForCSV(investments);
        filename = `investments_${new Date().toISOString().split('T')[0]}.csv`;
      }
      
      const csvContent = convertToCSV(csvData);
      downloadCSV(csvContent, filename);
    } catch (error) {
      console.error('Failed to export investment data:', error);
    }
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

  if (accountsLoading || transactionsLoading || investmentsLoading) {
    return (
      <div className="mobile-spacing lg:p-8 space-y-6 lg:space-y-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-300/50 rounded w-48 mb-4"></div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-32 bg-gray-300/50 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  const renderPortfolioTab = () => (
    <div className="space-y-6">
      {/* Portfolio Summary - Real Data */}
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
          <div className="text-sm text-blue-600 mt-2">
            {investments.length + investmentAccounts.length} holdings
          </div>
        </motion.div>
        
        <motion.div 
          className={`bg-gradient-to-r ${dailyChange >= 0 ? 'from-green-50 to-emerald-50 border-green-200/50' : 'from-red-50 to-rose-50 border-red-200/50'} border rounded-xl p-6`}
          whileHover={{ scale: 1.02 }}
          transition={{ duration: 0.2 }}
        >
          <div className="flex items-center space-x-3 mb-4">
            <div className={`w-12 h-12 bg-gradient-to-r ${dailyChange >= 0 ? 'from-green-500 to-green-600' : 'from-red-500 to-red-600'} rounded-xl flex items-center justify-center`}>
              {dailyChange >= 0 ? <TrendingUp size={20} className="text-white" /> : <TrendingDown size={20} className="text-white" />}
            </div>
            <div className={`text-sm font-medium ${dailyChange >= 0 ? 'text-green-700' : 'text-red-700'} uppercase tracking-wide`}>Today's Change</div>
          </div>
          <div className={`text-3xl font-bold ${dailyChange >= 0 ? 'text-green-900' : 'text-red-900'}`}>
            {dailyChange >= 0 ? '+' : ''}${Math.abs(dailyChange).toFixed(2)}
          </div>
          <div className={`text-sm ${dailyChange >= 0 ? 'text-green-600' : 'text-red-600'} mt-2`}>
            {dailyChangePercent >= 0 ? '+' : ''}{dailyChangePercent.toFixed(2)}%
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
              placeholder="Search investments by name or symbol..."
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
              onClick={handleExport}
              className="px-4 py-3 text-sm"
            />
          </div>
        </div>
      </div>

      {/* Holdings Table */}
      {investments.length === 0 && investmentAccounts.length === 0 ? (
        <div className="text-center py-12 bg-white/80 backdrop-blur-xl rounded-2xl border border-gray-200/50">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <PieChart size={24} className="text-gray-400" />
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">No investments found</h3>
          <p className="text-gray-500 mb-6 max-w-md mx-auto">
            Connect your investment accounts or add individual investments to start tracking your portfolio.
          </p>
          <InteractiveHoverButton
            variant="blue"
            text="Connect Investment Account"
            icon={<Plus size={16} />}
            className="px-8 py-3"
          />
        </div>
      ) : (
        <div className="bg-white/80 backdrop-blur-xl rounded-2xl border border-gray-200/50 overflow-hidden">
          {/* Direct Investments Section */}
          {investments.length > 0 && (
            <div>
              <div className="p-6 border-b border-gray-200/50">
                <h3 className="text-lg font-bold text-gray-900">Direct Investments</h3>
              </div>
              
              {/* Desktop Header */}
              <div className="hidden lg:grid grid-cols-8 gap-4 p-6 border-b border-gray-200/50 bg-gray-50/50">
                <div className="font-bold text-gray-700 text-sm uppercase tracking-wide">Symbol</div>
                <div className="font-bold text-gray-700 text-sm uppercase tracking-wide">Company</div>
                <div className="font-bold text-gray-700 text-sm uppercase tracking-wide text-center">Shares</div>
                <div className="font-bold text-gray-700 text-sm uppercase tracking-wide text-right">Price</div>
                <div className="font-bold text-gray-700 text-sm uppercase tracking-wide text-right">Day Change</div>
                <div className="font-bold text-gray-700 text-sm uppercase tracking-wide text-right">Total Value</div>
                <div className="font-bold text-gray-700 text-sm uppercase tracking-wide text-center">Rating</div>
                <div className="font-bold text-gray-700 text-sm uppercase tracking-wide text-center">Actions</div>
              </div>

              {/* Investment Rows */}
              <div className="divide-y divide-gray-200/50">
                {filteredInvestments.map((investment, index) => (
                  <motion.div 
                    key={investment.id}
                    className="p-6 hover:bg-gray-50/50 transition-colors cursor-pointer"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                    whileHover={{ scale: 1.005 }}
                  >
                    {/* Desktop Layout */}
                    <div className="hidden lg:grid grid-cols-8 gap-4 items-center">
                      <div className="font-bold text-accent-blue text-lg">{investment.symbol}</div>
                      <div>
                        <div className="font-medium text-gray-900">{investment.name}</div>
                        <div className="text-sm text-gray-500">{investment.sector}</div>
                      </div>
                      <div className="text-center text-gray-900">{investment.shares}</div>
                      <div className="text-right text-gray-900">${investment.current_price.toFixed(2)}</div>
                      <div className={`text-right font-bold flex items-center justify-end space-x-2 ${
                        investment.day_change >= 0 ? 'text-green-600' : 'text-red-600'
                      }`}>
                        <div className="w-6 h-6 rounded-md bg-gray-100 flex items-center justify-center">
                          {investment.day_change >= 0 ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
                        </div>
                        <span>{investment.day_change >= 0 ? '+' : ''}{investment.day_change_percent.toFixed(2)}%</span>
                      </div>
                      <div className="text-right font-bold text-gray-900">${investment.total_value.toFixed(2)}</div>
                      <div className="text-center">
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs border ${getRatingColor(investment.rating)}`}>
                          {investment.rating}
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
                          <div className="font-bold text-accent-blue text-lg">{investment.symbol}</div>
                          <div className="font-medium text-gray-900">{investment.name}</div>
                          <div className="text-sm text-gray-500">{investment.sector}</div>
                          <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs border mt-2 ${getRatingColor(investment.rating)}`}>
                            {investment.rating}
                          </span>
                        </div>
                        <div className="text-right">
                          <div className="font-bold text-gray-900">${investment.total_value.toFixed(2)}</div>
                          <div className={`text-sm font-medium ${
                            investment.day_change >= 0 ? 'text-green-600' : 'text-red-600'
                          }`}>
                            {investment.day_change >= 0 ? '+' : ''}{investment.day_change_percent.toFixed(2)}%
                          </div>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="text-gray-500">Shares: </span>
                          <span className="text-gray-900">{investment.shares}</span>
                        </div>
                        <div>
                          <span className="text-gray-500">Price: </span>
                          <span className="text-gray-900">${investment.current_price.toFixed(2)}</span>
                        </div>
                        <div>
                          <span className="text-gray-500">P/E: </span>
                          <span className="text-gray-900">{investment.pe || 'N/A'}</span>
                        </div>
                        <div>
                          <span className="text-gray-500">Dividend: </span>
                          <span className="text-gray-900">${investment.dividend}</span>
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
          )}

          {/* Investment Accounts Section */}
          {investmentAccounts.length > 0 && (
            <div>
              <div className="p-6 border-b border-gray-200/50">
                <h3 className="text-lg font-bold text-gray-900">Investment Accounts</h3>
              </div>
              
              <div className="divide-y divide-gray-200/50">
                {investmentAccounts.map((account, index) => (
                  <motion.div
                    key={account.id}
                    className="p-6 hover:bg-gray-50/50 transition-colors cursor-pointer"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                    whileHover={{ scale: 1.01 }}
                  >
                    <div className="flex justify-between items-center">
                      <div>
                        <h4 className="font-bold text-gray-900">{account.account_name}</h4>
                        <p className="text-sm text-gray-600 capitalize">{account.account_type.replace('_', ' ')}</p>
                      </div>
                      <div className="text-right">
                        <div className="text-xl font-bold text-gray-900">
                          ${Number(account.current_balance).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                        </div>
                        <div className="text-sm text-green-600">+1.5% today</div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
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
            <span>Account Allocation</span>
          </h3>
          <div className="space-y-4">
            {investmentAccounts.length > 0 ? (
              investmentAccounts.map((account, index) => {
                const percentage = totalPortfolioValue > 0 ? (Number(account.current_balance) / totalPortfolioValue) * 100 : 0;
                return (
                  <div key={account.id} className="flex justify-between items-center">
                    <span className="text-gray-600">{account.account_name}</span>
                    <div className="flex items-center space-x-2">
                      <div className="w-24 bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-accent-blue h-2 rounded-full transition-all duration-300"
                          style={{ width: `${percentage}%` }}
                        ></div>
                      </div>
                      <span className="font-medium text-sm">{percentage.toFixed(1)}%</span>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="text-center text-gray-500">
                No investment accounts to analyze
              </div>
            )}
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
              text="Connect Account"
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