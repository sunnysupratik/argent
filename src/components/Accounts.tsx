import React from 'react';
import { ExternalLink, Plus, RefreshCw, TrendingUp, TrendingDown, DollarSign, CreditCard, Wallet } from 'lucide-react';
import { useAccounts } from '../hooks/useAccounts';
import { InteractiveHoverButton } from './ui/interactive-hover-button';
import { motion } from 'framer-motion';
import AnimatedSection from './AnimatedSection';

const Accounts: React.FC = () => {
  const { accounts, loading, getTotalBalance, getAccountsByType } = useAccounts();

  if (loading) {
    return (
      <div className="mobile-spacing lg:p-8 space-y-6 lg:space-y-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-300/50 rounded w-48 mb-4"></div>
          <div className="space-y-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-24 bg-gray-300/50 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  const totalBalance = getTotalBalance();
  const checkingAccounts = getAccountsByType('checking');
  const savingsAccounts = getAccountsByType('savings');
  const investmentAccounts = getAccountsByType('investment');

  const getAccountIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case 'checking':
        return <CreditCard size={20} />;
      case 'savings':
        return <DollarSign size={20} />;
      case 'investment':
        return <TrendingUp size={20} />;
      default:
        return <Wallet size={20} />;
    }
  };

  const getAccountColor = (type: string) => {
    switch (type.toLowerCase()) {
      case 'checking':
        return 'from-blue-500 to-blue-600';
      case 'savings':
        return 'from-green-500 to-green-600';
      case 'investment':
        return 'from-purple-500 to-purple-600';
      default:
        return 'from-gray-500 to-gray-600';
    }
  };

  return (
    <div className="mobile-spacing lg:p-8 space-y-6 lg:space-y-8">
      {/* Enhanced Page Header */}
      <AnimatedSection className="mb-8 lg:mb-12">
        <div className="flex flex-col lg:flex-row lg:justify-between lg:items-start space-y-6 lg:space-y-0">
          <div>
            <h1 className="text-xl lg:text-2xl mb-2 font-bold uppercase tracking-wide">ACCOUNTS</h1>
            <motion.div 
              className="w-12 lg:w-16 h-px bg-accent-blue"
              initial={{ width: 0 }}
              animate={{ width: window.innerWidth >= 1024 ? 64 : 48 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            />
            <p className="text-gray-600 mt-3">Manage your bank accounts and financial portfolios</p>
          </div>
          
          {/* Enhanced Action Buttons */}
          <div className="flex flex-col lg:flex-row gap-3 lg:gap-4">
            <div className="flex gap-3">
              <InteractiveHoverButton
                variant="white"
                text="Refresh"
                icon={<RefreshCw size={16} />}
                className="px-4 py-3 text-sm"
              />

              <InteractiveHoverButton
                variant="white"
                text="Export"
                icon={<ExternalLink size={16} />}
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

      {/* Enhanced Total Balance Summary */}
      <AnimatedSection className="mb-8 lg:mb-12" delay={0.2}>
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200/50 rounded-2xl p-8">
          <div className="text-center space-y-4">
            <div className="flex items-center justify-center space-x-3 mb-4">
              <div className="w-12 h-12 bg-gradient-to-r from-accent-blue to-blue-600 rounded-xl flex items-center justify-center">
                <DollarSign size={24} className="text-white" />
              </div>
              <h2 className="text-lg font-medium text-blue-700 tracking-wide uppercase">
                Total Portfolio Value
              </h2>
            </div>
            <motion.p 
              className="text-4xl lg:text-6xl font-bold text-blue-900"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              ${totalBalance.toLocaleString('en-US', { minimumFractionDigits: 2 })}
            </motion.p>
            <div className="flex items-center justify-center space-x-2 text-green-600">
              <TrendingUp size={16} />
              <span className="text-sm font-medium">+2.5% from last month</span>
            </div>
          </div>
        </div>
      </AnimatedSection>

      {/* Enhanced Accounts List */}
      {accounts.length === 0 ? (
        <AnimatedSection className="text-center py-12 bg-white/80 backdrop-blur-xl rounded-2xl border border-gray-200/50" delay={0.3}>
          <div className="w-20 h-20 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <Wallet size={32} className="text-gray-400" />
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">No accounts connected</h3>
          <p className="text-gray-500 mb-6 max-w-md mx-auto">
            Connect your first bank account or investment portfolio to start tracking your finances.
          </p>
          <InteractiveHoverButton
            variant="blue"
            text="Connect Your First Account"
            icon={<Plus size={16} />}
            className="px-8 py-3"
          />
        </AnimatedSection>
      ) : (
        <AnimatedSection className="space-y-4 lg:space-y-6 mb-8 lg:mb-12" delay={0.3}>
          <div className="bg-white/80 backdrop-blur-xl rounded-2xl border border-gray-200/50 overflow-hidden">
            {/* Desktop Header */}
            <div className="hidden lg:grid grid-cols-4 gap-6 p-6 border-b border-gray-200/50 bg-gray-50/50">
              <div className="font-bold text-gray-700 text-sm uppercase tracking-wide">Account Details</div>
              <div className="font-bold text-gray-700 text-sm uppercase tracking-wide text-center">Type</div>
              <div className="font-bold text-gray-700 text-sm uppercase tracking-wide text-center">Balance</div>
              <div className="font-bold text-gray-700 text-sm uppercase tracking-wide text-center">Actions</div>
            </div>

            {accounts.map((account, index) => (
              <React.Fragment key={account.id}>
                {/* Desktop Layout */}
                <motion.div 
                  className="hidden lg:grid grid-cols-4 gap-6 items-center py-6 px-6 hover:bg-gray-50/50 transition-colors cursor-pointer"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  whileHover={{ scale: 1.01 }}
                >
                  {/* Account Info */}
                  <div className="flex items-center space-x-4">
                    <div className={`w-12 h-12 bg-gradient-to-r ${getAccountColor(account.account_type)} rounded-xl flex items-center justify-center text-white shadow-lg`}>
                      {getAccountIcon(account.account_type)}
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-text-primary">
                        {account.account_name}
                      </h3>
                      <p className="text-sm text-gray-500">
                        ****{account.id.slice(-4)}
                      </p>
                    </div>
                  </div>

                  {/* Account Type */}
                  <div className="text-center">
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-gray-100 text-gray-800 capitalize">
                      {account.account_type.replace('_', ' ')}
                    </span>
                  </div>

                  {/* Balance */}
                  <div className="text-center">
                    <div className="text-2xl font-bold text-text-primary">
                      ${Number(account.current_balance).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                    </div>
                    <div className="text-sm text-gray-500">Available</div>
                  </div>

                  {/* Actions */}
                  <div className="flex justify-center space-x-2">
                    <InteractiveHoverButton
                      variant="white"
                      text="View"
                      icon={<ExternalLink size={14} />}
                      className="px-4 py-2 text-sm"
                    />
                    <InteractiveHoverButton
                      variant="blue"
                      text="Manage"
                      className="px-4 py-2 text-sm"
                    />
                  </div>
                </motion.div>

                {/* Mobile Layout */}
                <motion.div 
                  className="lg:hidden p-6 hover:bg-gray-50/50 transition-colors"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                >
                  <div className="flex items-start space-x-4 mb-4">
                    <div className={`w-14 h-14 bg-gradient-to-r ${getAccountColor(account.account_type)} rounded-xl flex items-center justify-center text-white shadow-lg`}>
                      {getAccountIcon(account.account_type)}
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-bold text-text-primary mb-1">
                        {account.account_name}
                      </h3>
                      <div className="flex items-center space-x-3 mb-2">
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-gray-100 text-gray-800 capitalize">
                          {account.account_type.replace('_', ' ')}
                        </span>
                        <span className="text-sm text-gray-500">
                          ****{account.id.slice(-4)}
                        </span>
                      </div>
                      <div className="text-2xl font-bold text-text-primary">
                        ${Number(account.current_balance).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex space-x-3">
                    <InteractiveHoverButton
                      variant="white"
                      text="View Details"
                      icon={<ExternalLink size={14} />}
                      className="flex-1 text-center text-sm px-4 py-3"
                    />
                    <InteractiveHoverButton
                      variant="blue"
                      text="Manage"
                      className="flex-1 text-center text-sm px-4 py-3"
                    />
                  </div>
                </motion.div>

                {index < accounts.length - 1 && (
                  <hr className="border-0 h-px bg-gray-300/50 mx-6" />
                )}
              </React.Fragment>
            ))}
          </div>
        </AnimatedSection>
      )}

      {/* Enhanced Account Types Summary */}
      {accounts.length > 0 && (
        <AnimatedSection className="pt-6 lg:pt-8" delay={0.5}>
          <div className="bg-white/80 backdrop-blur-xl rounded-2xl border border-gray-200/50 p-6">
            <h3 className="text-lg font-bold text-text-primary mb-6 text-center lg:text-left">Account Summary</h3>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <motion.div 
                className="text-center p-6 bg-gradient-to-r from-blue-50 to-blue-100 rounded-xl border border-blue-200/50"
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.2 }}
              >
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl flex items-center justify-center mx-auto mb-3">
                  <CreditCard size={20} className="text-white" />
                </div>
                <div className="text-sm font-medium text-blue-700 uppercase tracking-wide mb-2">
                  Checking Accounts
                </div>
                <div className="text-2xl lg:text-3xl font-bold text-blue-900">
                  ${checkingAccounts.reduce((sum, a) => sum + Number(a.current_balance), 0).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                </div>
                <div className="text-sm text-blue-600 mt-1">{checkingAccounts.length} accounts</div>
              </motion.div>

              <motion.div 
                className="text-center p-6 bg-gradient-to-r from-green-50 to-green-100 rounded-xl border border-green-200/50"
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.2 }}
              >
                <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-green-600 rounded-xl flex items-center justify-center mx-auto mb-3">
                  <DollarSign size={20} className="text-white" />
                </div>
                <div className="text-sm font-medium text-green-700 uppercase tracking-wide mb-2">
                  Savings Accounts
                </div>
                <div className="text-2xl lg:text-3xl font-bold text-green-900">
                  ${savingsAccounts.reduce((sum, a) => sum + Number(a.current_balance), 0).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                </div>
                <div className="text-sm text-green-600 mt-1">{savingsAccounts.length} accounts</div>
              </motion.div>

              <motion.div 
                className="text-center p-6 bg-gradient-to-r from-purple-50 to-purple-100 rounded-xl border border-purple-200/50"
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.2 }}
              >
                <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl flex items-center justify-center mx-auto mb-3">
                  <TrendingUp size={20} className="text-white" />
                </div>
                <div className="text-sm font-medium text-purple-700 uppercase tracking-wide mb-2">
                  Investment Accounts
                </div>
                <div className="text-2xl lg:text-3xl font-bold text-purple-900">
                  ${investmentAccounts.reduce((sum, a) => sum + Number(a.current_balance), 0).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                </div>
                <div className="text-sm text-purple-600 mt-1">{investmentAccounts.length} accounts</div>
              </motion.div>
            </div>
          </div>
        </AnimatedSection>
      )}
    </div>
  );
};

export default Accounts;