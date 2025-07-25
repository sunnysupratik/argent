import React, { useState, useEffect, useMemo } from 'react';
import { Plus, Search, Filter, RefreshCw, Download, Calendar, TrendingUp, ArrowUpDown } from 'lucide-react';
import { motion } from 'framer-motion';
import AnimatedSection from './AnimatedSection';
import { useTransactions } from '../hooks/useTransactions';
import { InteractiveHoverButton } from './ui/interactive-hover-button';
import { convertToCSV, downloadCSV, formatTransactionsForCSV } from '../utils/csvExport';

const Transactions: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [sortBy, setSortBy] = useState('date');
  const [filterType, setFilterType] = useState('all');
  const { transactions, loading, refetch, error } = useTransactions();
  
  // Memoized filtered and sorted transactions for better performance
  const filteredTransactions = useMemo(() => {
    let filtered = transactions.filter(transaction => {
      const matchesSearch = transaction.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           transaction.category?.name.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesFilter = filterType === 'all' || transaction.type === filterType;
      return matchesSearch && matchesFilter;
    });

    // Sort transactions
    switch (sortBy) {
      case 'amount':
        filtered.sort((a, b) => Math.abs(Number(b.amount)) - Math.abs(Number(a.amount)));
        break;
      case 'category':
        filtered.sort((a, b) => (a.category?.name || 'Uncategorized').localeCompare(b.category?.name || 'Uncategorized'));
        break;
      case 'date':
      default:
        filtered.sort((a, b) => new Date(b.transaction_date).getTime() - new Date(a.transaction_date).getTime());
        break;
    }

    return filtered;
  }, [transactions, searchTerm, filterType, sortBy]);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      await refetch();
    } catch (error) {
      console.error('Failed to refresh transactions:', error);
    } finally {
      setIsRefreshing(false);
    }
  };

  const handleExport = () => {
    try {
      const csvData = formatTransactionsForCSV(filteredTransactions);
      const csvContent = convertToCSV(csvData);
      const filename = `transactions_${new Date().toISOString().split('T')[0]}.csv`;
      downloadCSV(csvContent, filename);
    } catch (error) {
      console.error('Failed to export transactions:', error);
    }
  };

  // Auto-refresh every 30 seconds when not loading
  useEffect(() => {
    const interval = setInterval(() => {
      if (!loading && !isRefreshing) {
        refetch();
      }
    }, 30000);

    return () => clearInterval(interval);
  }, [loading, isRefreshing, refetch]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.03,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.4,
        ease: [0.25, 0.46, 0.45, 0.94],
      },
    },
  };

  // Show loading state
  if (loading && !isRefreshing) {
    return (
      <div className="mobile-spacing lg:p-8 space-y-6 lg:space-y-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-300/50 rounded w-48 mb-4"></div>
          <div className="space-y-4">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="h-16 bg-gray-300/50 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Show error state
  if (error && !loading) {
    return (
      <div className="mobile-spacing lg:p-8 space-y-6 lg:space-y-8">
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <TrendingUp size={24} className="text-red-600" />
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">Failed to Load Transactions</h3>
          <p className="text-gray-500 mb-6">{error}</p>
          <InteractiveHoverButton
            variant="blue"
            text="Try Again"
            icon={<RefreshCw size={16} />}
            onClick={handleRefresh}
            className="px-6 py-3"
          />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="p-3 lg:p-8">
        <div className="max-w-7xl mx-auto space-y-4 lg:space-y-6">
      {/* Enhanced Page Header */}
      <AnimatedSection className="mb-8 lg:mb-12">
        <div className="flex flex-col lg:flex-row lg:justify-between lg:items-start space-y-4 lg:space-y-0">
          <div>
            <h1 className="text-base md:text-lg lg:text-xl xl:text-2xl mb-2 font-bold tracking-wide">Transactions</h1>
            <motion.div 
              className="w-8 md:w-10 lg:w-12 xl:w-16 h-px bg-accent-blue"
              initial={{ width: 0 }}
              animate={{ width: window.innerWidth >= 1280 ? 64 : window.innerWidth >= 1024 ? 48 : window.innerWidth >= 768 ? 40 : 32 }}
              transition={{ duration: 0.4, delay: 0.1 }}
            />
            <p className="text-gray-600 mt-2 text-xs md:text-sm lg:text-base">Manage and track all your financial transactions</p>
          </div>
          
          {/* Enhanced Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-1 md:gap-2 lg:gap-3">
            <div className="flex gap-1 md:gap-2">
              <InteractiveHoverButton
                variant="white"
                text={isRefreshing ? "Refreshing..." : "Refresh"}
                icon={<RefreshCw size={16} className={isRefreshing ? "animate-spin" : ""} />}
                onClick={handleRefresh}
                disabled={isRefreshing}
                className="px-2 md:px-3 py-1 md:py-2 disabled:opacity-50 text-xs"
              />

              <InteractiveHoverButton
                variant="white"
                text="Export"
                icon={<Download size={16} />}
                onClick={handleExport}
                className="px-2 md:px-3 py-1 md:py-2 text-xs"
              />

              <InteractiveHoverButton
                variant="white"
                text="Filter"
                icon={<Filter size={16} />}
                className="px-2 md:px-3 py-1 md:py-2 text-xs lg:hidden"
              />
            </div>

            <InteractiveHoverButton
              variant="blue"
              text="New Transaction"
              icon={<Plus size={16} />}
              className="px-3 md:px-4 py-1 md:py-2 text-xs font-medium"
            />
          </div>
        </div>
      </AnimatedSection>

      {/* Enhanced Search and Filter Section */}
      <AnimatedSection className="mb-4 lg:mb-6" delay={0.2}>
        <div className="bg-white/80 backdrop-blur-xl rounded-xl lg:rounded-2xl border border-gray-200/50 p-4 lg:p-6">
          <div className="flex flex-col lg:flex-row gap-3 lg:gap-4">
            {/* Search Input */}
            <div className="flex-1 relative">
              <div className="absolute left-3 top-1/2 transform -translate-y-1/2 sleek-icon p-1 flex items-center justify-center">
                <Search size={16} className="text-white" />
              </div>
              <motion.input
                type="text"
                placeholder="Search transactions, categories, or amounts..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-2 lg:py-3 border border-gray-200/50 rounded-lg lg:rounded-xl bg-white/80 backdrop-blur-xl text-text-primary placeholder-gray-500 focus:outline-none focus:border-accent-blue transition-all duration-300 text-sm lg:text-base"
                whileFocus={{ scale: 1.01 }}
              />
            </div>
            
            {/* Filter Controls - Desktop */}
            <div className="hidden lg:flex gap-2">
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="px-3 py-2 border border-gray-200/50 rounded-lg bg-white/80 backdrop-blur-xl focus:outline-none focus:border-accent-blue transition-colors text-sm"
              >
                <option value="all">All Types</option>
                <option value="income">Income</option>
                <option value="expense">Expenses</option>
              </select>

              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-3 py-2 border border-gray-200/50 rounded-lg bg-white/80 backdrop-blur-xl focus:outline-none focus:border-accent-blue transition-colors text-sm"
              >
                <option value="date">Sort by Date</option>
                <option value="amount">Sort by Amount</option>
                <option value="category">Sort by Category</option>
              </select>

              <InteractiveHoverButton
                variant="white"
                text="Date Range"
                icon={<Calendar size={16} />}
                className="px-3 py-2 text-xs"
              />
            </div>

            {/* Mobile Filter Toggle */}
            <div className="lg:hidden flex gap-2">
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="flex-1 px-3 py-2 border border-gray-200/50 rounded-lg bg-white/80 backdrop-blur-xl focus:outline-none focus:border-accent-blue transition-colors text-sm"
              >
                <option value="all">All Types</option>
                <option value="income">Income</option>
                <option value="expense">Expenses</option>
              </select>

              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="flex-1 px-3 py-2 border border-gray-200/50 rounded-lg bg-white/80 backdrop-blur-xl focus:outline-none focus:border-accent-blue transition-colors text-sm"
              >
                <option value="date">Date</option>
                <option value="amount">Amount</option>
                <option value="category">Category</option>
              </select>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-4 mt-4 lg:mt-6 pt-4 lg:pt-6 border-t border-gray-200/50">
            <div className="text-center">
              <div className="text-xs lg:text-sm text-gray-500 uppercase tracking-wide mb-1">Total</div>
              <div className="text-base lg:text-lg font-bold text-text-primary">{filteredTransactions.length}</div>
            </div>
            <div className="text-center">
              <div className="text-xs lg:text-sm text-gray-500 uppercase tracking-wide mb-1">Income</div>
              <div className="text-base lg:text-lg font-bold text-green-600">
                {filteredTransactions.filter(t => t.type === 'income').length}
              </div>
            </div>
            <div className="text-center">
              <div className="text-xs lg:text-sm text-gray-500 uppercase tracking-wide mb-1">Expenses</div>
              <div className="text-base lg:text-lg font-bold text-red-600">
                {filteredTransactions.filter(t => t.type === 'expense').length}
              </div>
            </div>
            <div className="text-center">
              <div className="text-xs lg:text-sm text-gray-500 uppercase tracking-wide mb-1">This Month</div>
              <div className="text-base lg:text-lg font-bold text-accent-blue">
                {filteredTransactions.filter(t => {
                  const date = new Date(t.transaction_date);
                  const now = new Date();
                  return date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear();
                }).length}
              </div>
            </div>
          </div>
        </div>
      </AnimatedSection>

      {/* Transactions Table with Enhanced Design */}
      <AnimatedSection className="space-y-4" delay={0.3}>
        {/* Desktop Table Header */}
        <motion.div 
          className="hidden lg:grid grid-cols-5 gap-4 pb-4 border-b border-gray-300/50 bg-white/80 backdrop-blur-xl rounded-t-2xl px-6 pt-6"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <div className="font-bold text-text-primary text-sm tracking-wide uppercase flex items-center gap-2">
            Description
            <TrendingUp size={14} className="text-gray-400" />
          </div>
          <div className="font-bold text-text-primary text-sm tracking-wide uppercase">
            Category
          </div>
          <div className="font-bold text-text-primary text-sm tracking-wide uppercase">
            Account
          </div>
          <div className="font-bold text-text-primary text-sm tracking-wide uppercase">
            Date
          </div>
          <div className="font-bold text-text-primary text-sm tracking-wide uppercase text-right">
            Amount
          </div>
        </motion.div>

        {/* Transaction Rows */}
        {filteredTransactions.length === 0 ? (
          <div className="text-center py-12 bg-white/80 backdrop-blur-xl rounded-2xl border border-gray-200/50">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search size={24} className="text-gray-400" />
            </div>
            <p className="text-gray-500 text-base lg:text-lg mb-2">
              {searchTerm ? 'No transactions match your search' : 'No transactions found'}
            </p>
            <p className="text-gray-400 text-xs lg:text-sm">
              {searchTerm ? 'Try adjusting your search terms' : 'Add your first transaction to get started'}
            </p>
          </div>
        ) : (
          <motion.div 
            className="bg-white/80 backdrop-blur-xl rounded-xl lg:rounded-2xl border border-gray-200/50 overflow-hidden"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {filteredTransactions.map((transaction, index) => (
              <React.Fragment key={transaction.id}>
                {/* Desktop Layout */}
                <motion.div 
                  className="hidden lg:grid table-row-interactive grid-cols-5 gap-3 lg:gap-4 py-3 lg:py-4 px-4 lg:px-6 cursor-pointer"
                  variants={itemVariants}
                  whileHover={{ 
                    backgroundColor: 'rgba(0, 122, 255, 0.02)',
                    scale: 1.005,
                    transition: { duration: 0.2 }
                  }}
                >
                  <div className="font-normal text-text-primary row-main-text">
                    {transaction.description}
                  </div>
                  <div className="font-normal text-text-primary">
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-gray-100 text-gray-800">
                      {transaction.category?.name || 'Uncategorized'}
                    </span>
                  </div>
                  <div className="font-normal text-text-primary">
                    {transaction.account?.account_name || 'Unknown Account'}
                  </div>
                  <div className="font-normal text-text-primary">
                    {new Date(transaction.transaction_date).toLocaleDateString()}
                  </div>
                  <div className={`text-right font-bold ${
                    transaction.type === 'income' ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {transaction.type === 'income' ? '+' : '-'}${Math.abs(Number(transaction.amount)).toFixed(2)}
                  </div>
                </motion.div>

                {/* Mobile Layout */}
                <motion.div 
                  className="lg:hidden mobile-table-row table-row-interactive p-3 lg:p-4"
                  variants={itemVariants}
                  whileHover={{ 
                    backgroundColor: 'rgba(0, 122, 255, 0.02)',
                    transition: { duration: 0.2 }
                  }}
                >
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex-1">
                      <div className="font-medium text-text-primary row-main-text mb-1 text-sm lg:text-base">
                        {transaction.description}
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs lg:text-sm bg-gray-100 text-gray-800">
                          {transaction.category?.name || 'Uncategorized'}
                        </span>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className={`font-bold text-base lg:text-lg ${
                        transaction.type === 'income' ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {transaction.type === 'income' ? '+' : '-'}${Math.abs(Number(transaction.amount)).toFixed(2)}
                      </div>
                      <div className="text-xs lg:text-sm text-gray-500">
                        {new Date(transaction.transaction_date).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                  
                  <div className="text-xs lg:text-sm text-gray-600">
                    {transaction.account?.account_name || 'Unknown Account'}
                  </div>
                </motion.div>

                {index < filteredTransactions.length - 1 && (
                  <motion.hr 
                    className="border-0 h-px bg-gray-300/50 mx-6"
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: 1 }}
                    transition={{ duration: 0.3, delay: 0.5 + (index * 0.02) }}
                  />
                )}
              </React.Fragment>
            ))}
          </motion.div>
        )}
      </AnimatedSection>
        </div>
      </div>
    </div>

      {/* Enhanced Summary Section */}
      <AnimatedSection className="pt-6" delay={0.6}>
        <motion.div 
          className="bg-white/80 backdrop-blur-xl rounded-2xl border border-gray-200/50 p-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.8 }}
        >
          <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center space-y-4 lg:space-y-0">
            <div className="flex items-center space-x-4">
              <span className="text-text-primary font-medium">
                Showing {filteredTransactions.length} of {transactions.length} transactions
              </span>
              {isRefreshing && (
                <span className="flex items-center space-x-2 text-accent-blue">
                  <RefreshCw size={16} className="animate-spin" />
                  <span className="text-sm">Refreshing...</span>
                </span>
              )}
            </div>
            
            <div className="text-center lg:text-right">
              <div className="text-sm text-gray-500 uppercase tracking-wide font-normal">Net Total</div>
              <motion.div 
                className="text-2xl font-bold text-accent-blue"
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.3, delay: 1.0 }}
              >
                ${filteredTransactions.reduce((sum, t) => {
                  return sum + (t.type === 'income' ? Number(t.amount) : -Number(t.amount));
                }, 0).toFixed(2)}
              </motion.div>
            </div>
          </div>
        </motion.div>
      </AnimatedSection>
    </div>
  );
};

export default Transactions;