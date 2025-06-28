import React from 'react';
import { motion } from 'framer-motion';
import { useTransactions } from '../hooks/useTransactions';
import { DollarSign, TrendingUp, TrendingDown } from 'lucide-react';

const RecentTransactions: React.FC = () => {
  const { getRecentTransactions, loading, error } = useTransactions();
  const recentTransactions = getRecentTransactions(5);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08,
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

  if (loading) {
    return (
      <div className="space-y-4">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="animate-pulse">
            <div className="flex items-center space-x-3 p-3">
              <div className="w-10 h-10 bg-gray-300 rounded-full"></div>
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-gray-300 rounded w-3/4"></div>
                <div className="h-3 bg-gray-300 rounded w-1/2"></div>
              </div>
              <div className="h-4 bg-gray-300 rounded w-16"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-3">
          <TrendingDown size={20} className="text-red-600" />
        </div>
        <p className="text-red-600 text-sm mb-2">Failed to load transactions</p>
        <p className="text-gray-400 text-xs">{error}</p>
      </div>
    );
  }

  if (recentTransactions.length === 0) {
    return (
      <div className="text-center py-8">
        <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
          <DollarSign size={20} className="text-gray-400" />
        </div>
        <p className="text-gray-500 mb-2">No recent transactions found</p>
        <p className="text-sm text-gray-400">Your recent transactions will appear here</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Desktop Table Header */}
      <motion.div 
        className="hidden lg:grid grid-cols-4 gap-4 pb-3 border-b border-gray-300"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="font-bold text-text-primary text-sm tracking-wide uppercase">
          Description
        </div>
        <div className="font-bold text-text-primary text-sm tracking-wide uppercase">
          Category
        </div>
        <div className="font-bold text-text-primary text-sm tracking-wide uppercase">
          Date
        </div>
        <div className="font-bold text-text-primary text-sm tracking-wide uppercase text-right">
          Amount
        </div>
      </motion.div>

      {/* Transaction Rows with Responsive Design */}
      <motion.div 
        className="space-y-0"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {recentTransactions.map((transaction, index) => (
          <React.Fragment key={transaction.id}>
            {/* Desktop Layout */}
            <motion.div 
              className="hidden lg:grid table-row-interactive grid-cols-4 gap-4 py-3 transition-colors cursor-pointer"
              variants={itemVariants}
              whileHover={{ 
                backgroundColor: 'rgba(0, 122, 255, 0.02)',
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
              className="lg:hidden mobile-table-row table-row-interactive"
              variants={itemVariants}
              whileHover={{ 
                backgroundColor: 'rgba(0, 122, 255, 0.02)',
                transition: { duration: 0.2 }
              }}
            >
              <div className="flex items-center justify-between p-3">
                <div className="flex items-center space-x-3">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    transaction.type === 'income' ? 'bg-green-100' : 'bg-red-100'
                  }`}>
                    {transaction.type === 'income' ? 
                      <TrendingUp size={16} className="text-green-600" /> : 
                      <TrendingDown size={16} className="text-red-600" />
                    }
                  </div>
                  <div>
                    <div className="font-medium text-text-primary row-main-text">
                      {transaction.description}
                    </div>
                    <div className="text-sm text-gray-500">
                      {transaction.category?.name || 'Uncategorized'} • {new Date(transaction.transaction_date).toLocaleDateString()}
                    </div>
                  </div>
                </div>
                <div className={`font-bold ${
                  transaction.type === 'income' ? 'text-green-600' : 'text-red-600'
                }`}>
                  {transaction.type === 'income' ? '+' : '-'}${Math.abs(Number(transaction.amount)).toFixed(2)}
                </div>
              </div>
            </motion.div>

            {index < recentTransactions.length - 1 && (
              <motion.hr 
                className="border-0 h-px bg-gray-300"
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ duration: 0.3, delay: index * 0.08 }}
              />
            )}
          </React.Fragment>
        ))}
      </motion.div>
    </div>
  );
};

export default RecentTransactions;