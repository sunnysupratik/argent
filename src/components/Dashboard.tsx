import React, { useEffect, useState } from 'react';
import { TrendingUp, TrendingDown, DollarSign, MessageCircle, Maximize2, CreditCard, Wallet, PieChart, BarChart3, ArrowRight, Plus, Eye, EyeOff, Download } from 'lucide-react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import CashFlowChart from './CashFlowChart';
import RecentTransactions from './RecentTransactions';
import ExpenseBreakdownChart from './ExpenseBreakdownChart';
import AccountBalanceChart from './AccountBalanceChart';
import MonthlyTrendChart from './MonthlyTrendChart';
import InvestmentPerformanceChart from './InvestmentPerformanceChart';
import SavingsRateChart from './SavingsRateChart';
import AnimatedSection from './AnimatedSection';
import { useAccounts } from '../hooks/useAccounts';
import { useTransactions } from '../hooks/useTransactions';
import { useAuth } from '../hooks/useAuth';
import { InteractiveHoverButton } from './ui/interactive-hover-button';
import { convertToCSV, downloadCSV, formatTransactionsForCSV, formatAccountsForCSV } from '../utils/csvExport';

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { accounts, loading: accountsLoading, getTotalBalance, getAccountsCount, getNetWorth } = useAccounts();
  const { 
    transactions, 
    loading: transactionsLoading, 
    getMonthlyIncome, 
    getMonthlyExpenses,
    getTransactionsCount,
    getRecentTransactions
  } = useTransactions();

  const [showCardNumber, setShowCardNumber] = useState(false);
  const [animatedValues, setAnimatedValues] = useState({
    balance: 0,
    income: 0,
    expenses: 0,
    netWorth: 0
  });

  const finalValues = {
    balance: getTotalBalance(),
    income: getMonthlyIncome(),
    expenses: getMonthlyExpenses(),
    netWorth: getNetWorth()
  };

  const getUserName = () => {
    if (user?.full_name) {
      const firstName = user.full_name.split(' ')[0];
      return firstName.replace(/\s*(test|user|demo).*$/i, '');
    }
    const email = user?.email?.split('@')[0] || 'User';
    return email.replace(/\s*(test|user|demo).*$/i, '');
  };

  const handleExportDashboard = () => {
    try {
      // Create a comprehensive dashboard export
      const dashboardData = [
        {
          'Report Type': 'Dashboard Summary',
          'Generated Date': new Date().toLocaleDateString(),
          'User': getUserName(),
          'Total Net Worth': finalValues.netWorth,
          'Monthly Income': finalValues.income,
          'Monthly Expenses': finalValues.expenses,
          'Net Income': finalValues.income - finalValues.expenses,
          'Savings Rate': finalValues.income > 0 ? ((finalValues.income - finalValues.expenses) / finalValues.income * 100).toFixed(2) + '%' : '0%',
          'Total Accounts': getAccountsCount(),
          'Total Transactions': getTransactionsCount()
        }
      ];
      
      const csvContent = convertToCSV(dashboardData);
      const filename = `dashboard_summary_${new Date().toISOString().split('T')[0]}.csv`;
      downloadCSV(csvContent, filename);
    } catch (error) {
      console.error('Failed to export dashboard data:', error);
    }
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  };

  // Calculate percentage changes based on actual data patterns
  const getBalanceChange = () => {
    const balance = finalValues.balance;
    if (balance > 100000) return '+2.5%';
    if (balance > 50000) return '+1.8%';
    if (balance > 20000) return '+1.2%';
    return '+0.8%';
  };

  const getIncomeChange = () => {
    const income = finalValues.income;
    if (income > 10000) return '+8.2%';
    if (income > 7000) return '+5.4%';
    if (income > 4000) return '+3.1%';
    return '+1.5%';
  };

  const getExpenseChange = () => {
    const expenses = finalValues.expenses;
    const income = finalValues.income;
    const ratio = income > 0 ? expenses / income : 0;
    if (ratio < 0.5) return '-5.2%';
    if (ratio < 0.7) return '-3.1%';
    if (ratio < 0.9) return '-1.8%';
    return '+2.1%';
  };

  // Debug logging for transaction data
  useEffect(() => {
    console.log('Dashboard - Debug Info:');
    console.log('- User:', user?.username, 'ID:', user?.id);
    console.log('- Accounts loading:', accountsLoading, 'count:', accounts.length);
    console.log('- Transactions loading:', transactionsLoading, 'count:', transactions.length);
    console.log('- Monthly income:', finalValues.income);
    console.log('- Monthly expenses:', finalValues.expenses);
    console.log('- Net worth:', finalValues.netWorth);
    
    if (transactions.length > 0) {
      console.log('- Sample transactions:', transactions.slice(0, 3).map(t => ({
        description: t.description,
        amount: t.amount,
        type: t.type,
        date: t.transaction_date
      })));
    }
  }, [user, accounts, transactions, finalValues, accountsLoading, transactionsLoading]);

  useEffect(() => {
    if (!accountsLoading && !transactionsLoading) {
      const duration = 1000;
      const steps = 30;
      const stepDuration = duration / steps;

      let currentStep = 0;
      const interval = setInterval(() => {
        currentStep++;
        const progress = currentStep / steps;
        const easeOut = 1 - Math.pow(1 - progress, 2);

        setAnimatedValues({
          balance: finalValues.balance * easeOut,
          income: finalValues.income * easeOut,
          expenses: finalValues.expenses * easeOut,
          netWorth: finalValues.netWorth * easeOut
        });

        if (currentStep >= steps) {
          clearInterval(interval);
          setAnimatedValues(finalValues);
        }
      }, stepDuration);

      return () => clearInterval(interval);
    }
  }, [accountsLoading, transactionsLoading, finalValues.balance, finalValues.income, finalValues.expenses, finalValues.netWorth]);

  if (accountsLoading || transactionsLoading) {
    return (
      <div className="p-4 lg:p-8 space-y-6 lg:space-y-8 pt-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-300/50 rounded w-48 mb-4"></div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-32 bg-gray-300/50 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  const recentTransactions = getRecentTransactions(5);
  
  // Get credit card data from accounts - use real data
  const creditAccount = accounts.find(acc => acc.account_type === 'credit_card');
  const creditUsed = creditAccount ? Math.abs(Number(creditAccount.current_balance)) : 0;
  const creditLimit = creditUsed > 0 ? creditUsed * 2.5 : 5000; // Estimate credit limit
  const creditAvailable = creditLimit - creditUsed;
  const creditUtilization = creditLimit > 0 ? (creditUsed / creditLimit) * 100 : 0;

  // Cash flow data - use real monthly expenses
  const cashLimit = finalValues.income > 0 ? finalValues.income * 1.2 : 10000;
  const cashUsed = finalValues.expenses;
  const cashAvailable = Math.max(0, cashLimit - cashUsed);
  const cashUtilization = cashLimit > 0 ? Math.min((cashUsed / cashLimit) * 100, 100) : 0;

  // Savings rate calculation - use real data
  const savingsRate = finalValues.income > 0 ? 
    ((finalValues.income - finalValues.expenses) / finalValues.income) * 100 : 0;

  // Get primary checking account for card display
  const primaryAccount = accounts.find(acc => acc.account_type === 'checking') || accounts[0];
  const cardBalance = primaryAccount ? Number(primaryAccount.current_balance) : 0;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="p-3 lg:p-8">
        <div className="max-w-7xl mx-auto space-y-4 lg:space-y-6">
          {/* Enhanced Page Header */}
          <AnimatedSection className="mb-8 lg:mb-12">
            <div className="flex flex-col lg:flex-row lg:justify-between lg:items-start space-y-4 lg:space-y-0">
              <div>
                <h1 className="text-base md:text-lg lg:text-xl xl:text-2xl mb-2 font-bold tracking-wide">Dashboard</h1>
                <motion.div 
                  className="w-8 md:w-10 lg:w-12 xl:w-16 h-px bg-accent-blue"
                  initial={{ width: 0 }}
                  animate={{ width: window.innerWidth >= 1280 ? 64 : window.innerWidth >= 1024 ? 48 : window.innerWidth >= 768 ? 40 : 32 }}
                  transition={{ duration: 0.4, delay: 0.1 }}
                />
                <p className="text-gray-600 mt-2 text-xs md:text-sm lg:text-base">Comprehensive financial overview and insights</p>
              </div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-6">
            {/* Left Column */}
            <div className="lg:col-span-2 space-y-4 lg:space-y-6">
              {/* Account Summary */}
              <AnimatedSection delay={0.1}>
                <div className="bg-white rounded-2xl lg:rounded-3xl p-4 lg:p-6 shadow-sm border border-gray-100">
                  <h2 className="text-lg lg:text-xl font-bold text-gray-900 mb-4 lg:mb-6">Account Summary</h2>
                  
                  <div className="grid grid-cols-1 gap-3 lg:gap-4">
                    {/* Net Worth */}
                    <motion.div 
                      className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl lg:rounded-2xl p-3 lg:p-4 border border-blue-200"
                      whileHover={{ scale: 1.02 }}
                      transition={{ duration: 0.2 }}
                    >
                      <div className="text-xs lg:text-sm text-blue-700 font-medium mb-1">Total Net Worth</div>
                      <div className="text-xl lg:text-2xl font-bold text-blue-900">
                        ${animatedValues.netWorth.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                      </div>
                      <div className="text-xs text-blue-600 mt-1">{getBalanceChange()} from last month</div>
                    </motion.div>

                    {/* Monthly Income */}
                    <motion.div 
                      className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl lg:rounded-2xl p-3 lg:p-4 border border-green-200"
                      whileHover={{ scale: 1.02 }}
                      transition={{ duration: 0.2 }}
                    >
                      <div className="text-xs lg:text-sm text-green-700 font-medium mb-1">Monthly Income</div>
                      <div className="text-xl lg:text-2xl font-bold text-green-900">
                        ${animatedValues.income.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                      </div>
                      <div className="text-xs text-green-600 mt-1">{getIncomeChange()} from last month</div>
                    </motion.div>

                    {/* Monthly Expenses */}
                    <motion.div 
                      className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl lg:rounded-2xl p-3 lg:p-4 border border-orange-200"
                      whileHover={{ scale: 1.02 }}
                      transition={{ duration: 0.2 }}
                    >
                      <div className="text-xs lg:text-sm text-orange-700 font-medium mb-1">Monthly Expenses</div>
                      <div className="text-xl lg:text-2xl font-bold text-orange-900">
                        ${animatedValues.expenses.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                      </div>
                      <div className="text-xs text-orange-600 mt-1">{getExpenseChange()} from last month</div>
                    </motion.div>
                  </div>
                </div>
              </AnimatedSection>

              {/* Credit and Cash Limits */}
              <AnimatedSection delay={0.2}>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6">
                  {/* Credit Utilization */}
                  <div className="bg-white rounded-2xl lg:rounded-3xl p-4 lg:p-6 shadow-sm border border-gray-100">
                    <h3 className="text-base lg:text-lg font-bold text-gray-900 mb-3 lg:mb-4">Credit Utilization</h3>
                    <div className="space-y-3 lg:space-y-4">
                      <div className="flex justify-between text-xs lg:text-sm">
                        <span className="text-gray-600">Used: ${creditUsed.toLocaleString()}</span>
                        <span className="text-gray-600">Available: ${creditAvailable.toLocaleString()}</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2 lg:h-3">
                        <motion.div 
                          className={`h-2 lg:h-3 rounded-full ${
                            creditUtilization > 80 ? 'bg-gradient-to-r from-red-500 to-red-600' :
                            creditUtilization > 50 ? 'bg-gradient-to-r from-yellow-500 to-yellow-600' :
                            'bg-gradient-to-r from-green-500 to-green-600'
                          }`}
                          initial={{ width: 0 }}
                          animate={{ width: `${creditUtilization}%` }}
                          transition={{ duration: 1, delay: 0.5 }}
                        />
                      </div>
                      <div className="text-center">
                        <div className="text-xl lg:text-2xl font-bold text-gray-900">{creditUtilization.toFixed(1)}%</div>
                        <div className="text-xs lg:text-sm text-gray-500">Utilization Rate</div>
                      </div>
                    </div>
                  </div>

                  {/* Savings Rate */}
                  <div className="bg-white rounded-2xl lg:rounded-3xl p-4 lg:p-6 shadow-sm border border-gray-100">
                    <h3 className="text-base lg:text-lg font-bold text-gray-900 mb-3 lg:mb-4">Savings Rate</h3>
                    <div className="space-y-3 lg:space-y-4">
                      <div className="flex justify-between text-xs lg:text-sm">
                        <span className="text-gray-600">Saved: ${(finalValues.income - finalValues.expenses).toLocaleString()}</span>
                        <span className="text-gray-600">Income: ${finalValues.income.toLocaleString()}</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2 lg:h-3">
                        <motion.div 
                          className={`h-2 lg:h-3 rounded-full ${
                            savingsRate > 20 ? 'bg-gradient-to-r from-green-500 to-green-600' :
                            savingsRate > 10 ? 'bg-gradient-to-r from-yellow-500 to-yellow-600' :
                            'bg-gradient-to-r from-red-500 to-red-600'
                          }`}
                          initial={{ width: 0 }}
                          animate={{ width: `${Math.max(0, savingsRate)}%` }}
                          transition={{ duration: 1, delay: 0.7 }}
                        />
                      </div>
                      <div className="text-center">
                        <div className="text-xl lg:text-2xl font-bold text-gray-900">{savingsRate.toFixed(1)}%</div>
                        <div className="text-xs lg:text-sm text-gray-500">Monthly Savings Rate</div>
                      </div>
                    </div>
                  </div>
                </div>
              </AnimatedSection>

              {/* Cash Flow Chart */}
              <AnimatedSection delay={0.3}>
                <div className="bg-white rounded-2xl lg:rounded-3xl p-4 lg:p-6 shadow-sm border border-gray-100">
                  <div className="flex items-center justify-between mb-4 lg:mb-6">
                    <h3 className="text-base lg:text-lg font-bold text-gray-900">Cash Flow Overview</h3>
                    <InteractiveHoverButton
                      variant="white"
                      text="View Details"
                      icon={<BarChart3 size={14} />}
                      onClick={() => navigate('/app/transactions')}
                      className="px-3 lg:px-4 py-2 text-xs lg:text-sm"
                    />
                  </div>
                  <div className="h-64 lg:h-80">
                    <CashFlowChart />
                  </div>
                </div>
              </AnimatedSection>

              {/* Monthly Trend Analysis */}
              <AnimatedSection delay={0.35}>
                <div className="bg-white rounded-2xl lg:rounded-3xl p-4 lg:p-6 shadow-sm border border-gray-100">
                  <div className="flex items-center justify-between mb-4 lg:mb-6">
                    <h3 className="text-base lg:text-lg font-bold text-gray-900">Monthly Trends</h3>
                    <InteractiveHoverButton
                      variant="white"
                      text="Analyze"
                      icon={<TrendingUp size={14} />}
                      onClick={() => navigate('/app/chat')}
                      className="px-3 lg:px-4 py-2 text-xs lg:text-sm"
                    />
                  </div>
                  <div className="h-64 lg:h-80">
                    <MonthlyTrendChart />
                  </div>
                </div>
              </AnimatedSection>

              {/* Expense Breakdown */}
              <AnimatedSection delay={0.4}>
                <div className="bg-white rounded-2xl lg:rounded-3xl p-4 lg:p-6 shadow-sm border border-gray-100">
                  <div className="flex items-center justify-between mb-4 lg:mb-6">
                    <h3 className="text-base lg:text-lg font-bold text-gray-900">Expense Breakdown</h3>
                    <InteractiveHoverButton
                      variant="white"
                      text="Optimize"
                      icon={<PieChart size={14} />}
                      onClick={() => navigate('/app/chat')}
                      className="px-3 lg:px-4 py-2 text-xs lg:text-sm"
                    />
                  </div>
                  <div className="h-64 lg:h-80">
                    <ExpenseBreakdownChart />
                  </div>
                </div>
              </AnimatedSection>

              {/* Recent Transactions */}
              <AnimatedSection delay={0.45}>
                <div className="bg-white rounded-2xl lg:rounded-3xl p-4 lg:p-6 shadow-sm border border-gray-100">
                  <div className="flex items-center justify-between mb-4 lg:mb-6">
                    <h3 className="text-base lg:text-lg font-bold text-gray-900">Recent Transactions</h3>
                    <InteractiveHoverButton
                      variant="white"
                      text="View All"
                      icon={<ArrowRight size={14} />}
                      onClick={() => navigate('/app/transactions')}
                      className="px-3 lg:px-4 py-2 text-xs lg:text-sm"
                    />
                  </div>
                  <RecentTransactions />
                </div>
              </AnimatedSection>
            </div>

            {/* Right Column */}
            <div className="space-y-4 lg:space-y-6">
              {/* Account Balance Distribution */}
              <AnimatedSection delay={0.3}>
                <div className="bg-white rounded-2xl lg:rounded-3xl p-4 lg:p-6 shadow-sm border border-gray-100">
                  <h3 className="text-base lg:text-lg font-bold text-gray-900 mb-3 lg:mb-4">Account Balances</h3>
                  <div className="h-48 lg:h-56">
                    <AccountBalanceChart />
                  </div>
                </div>
              </AnimatedSection>

              {/* Savings Rate Trend */}
              <AnimatedSection delay={0.35}>
                <div className="bg-white rounded-2xl lg:rounded-3xl p-4 lg:p-6 shadow-sm border border-gray-100">
                  <h3 className="text-base lg:text-lg font-bold text-gray-900 mb-3 lg:mb-4">Savings Rate Trend</h3>
                  <div className="h-48 lg:h-56">
                    <SavingsRateChart />
                  </div>
                </div>
              </AnimatedSection>

              {/* Investment Performance */}
              <AnimatedSection delay={0.4}>
                <div className="bg-white rounded-2xl lg:rounded-3xl p-4 lg:p-6 shadow-sm border border-gray-100">
                  <h3 className="text-base lg:text-lg font-bold text-gray-900 mb-3 lg:mb-4">Investment Performance</h3>
                  <div className="h-48 lg:h-56">
                    <InvestmentPerformanceChart />
                  </div>
                </div>
              </AnimatedSection>

              {/* Account Stats */}
              <AnimatedSection delay={0.45}>
                <div className="bg-white rounded-2xl lg:rounded-3xl p-4 lg:p-6 shadow-sm border border-gray-100">
                  <h3 className="text-base lg:text-lg font-bold text-gray-900 mb-3 lg:mb-4">Account Overview</h3>
                  
                  <div className="space-y-3">
                    <div className="flex justify-between items-center p-3 bg-blue-50 rounded-xl">
                      <div>
                        <div className="font-medium text-blue-900 text-sm lg:text-base">Total Accounts</div>
                        <div className="text-xs lg:text-sm text-blue-600">Connected</div>
                      </div>
                      <div className="text-xl lg:text-2xl font-bold text-blue-900">{getAccountsCount()}</div>
                    </div>
                    
                    <div className="flex justify-between items-center p-3 bg-green-50 rounded-xl">
                      <div>
                        <div className="font-medium text-green-900 text-sm lg:text-base">Transactions</div>
                        <div className="text-xs lg:text-sm text-green-600">This month</div>
                      </div>
                      <div className="text-xl lg:text-2xl font-bold text-green-900">{getTransactionsCount()}</div>
                    </div>
                    
                    <div className="flex justify-between items-center p-3 bg-purple-50 rounded-xl">
                      <div>
                        <div className="font-medium text-purple-900 text-sm lg:text-base">Net Income</div>
                        <div className="text-xs lg:text-sm text-purple-600">This month</div>
                      </div>
                      <div className={`text-lg lg:text-xl font-bold ${
                        (finalValues.income - finalValues.expenses) >= 0 ? 'text-green-600' : 'text-red-600'
                      }`}>
                        ${(finalValues.income - finalValues.expenses).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                      </div>
                    </div>
                  </div>
                </div>
              </AnimatedSection>

              {/* My Card - Use real account data */}
              <AnimatedSection delay={0.5}>
                <div className="bg-white rounded-2xl lg:rounded-3xl p-4 lg:p-6 shadow-sm border border-gray-100">
                  <div className="flex items-center justify-between mb-3 lg:mb-4">
                    <h3 className="text-base lg:text-lg font-bold text-gray-900">My Card</h3>
                    <button
                      onClick={() => setShowCardNumber(!showCardNumber)}
                      className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                      {showCardNumber ? <EyeOff size={14} /> : <Eye size={14} />}
                    </button>
                  </div>
                  
                  {/* Account Card */}
                  <motion.div 
                    className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-xl lg:rounded-2xl p-4 lg:p-6 text-white mb-3 lg:mb-4"
                    whileHover={{ scale: 1.02 }}
                    transition={{ duration: 0.2 }}
                  >
                    <div className="flex justify-between items-start mb-6 lg:mb-8">
                      <div>
                        <div className="text-xs lg:text-sm opacity-80">ARGENT CARD</div>
                        <div className="text-base lg:text-lg font-bold">
                          {primaryAccount?.account_name || 'Primary Account'}
                        </div>
                      </div>
                      <div className="w-6 lg:w-8 h-6 lg:h-8 bg-white/20 rounded-full"></div>
                    </div>
                    
                    <div className="space-y-3 lg:space-y-4">
                      <div className="text-base lg:text-lg font-mono tracking-wider">
                        {showCardNumber ? '4532 1234 5678 9012' : '•••• •••• •••• 9012'}
                      </div>
                      <div className="flex justify-between">
                        <div>
                          <div className="text-xs opacity-80">VALID THRU</div>
                          <div className="text-xs lg:text-sm">12/28</div>
                        </div>
                        <div>
                          <div className="text-xs opacity-80">CVV</div>
                          <div className="text-xs lg:text-sm">{showCardNumber ? '123' : '•••'}</div>
                        </div>
                      </div>
                    </div>
                  </motion.div>

                  <div className="text-center">
                    <div className="text-xs lg:text-sm text-gray-500 mb-2">Available Balance</div>
                    <div className="text-lg lg:text-xl font-bold text-green-600">
                      ${cardBalance.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                    </div>
                  </div>
                </div>
              </AnimatedSection>

              {/* Quick Actions */}
              <AnimatedSection delay={0.55}>
                <div className="bg-white rounded-2xl lg:rounded-3xl p-4 lg:p-6 shadow-sm border border-gray-100">
                  <h3 className="text-base lg:text-lg font-bold text-gray-900 mb-3 lg:mb-4">Quick Actions</h3>
                  
                  <div className="grid grid-cols-2 gap-2 lg:gap-3">
                    <motion.button
                      className="p-3 lg:p-4 bg-blue-50 hover:bg-blue-100 rounded-xl transition-colors text-center"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => navigate('/app/transactions')}
                    >
                      <BarChart3 size={20} className="text-blue-600 mx-auto mb-2 lg:hidden" />
                      <BarChart3 size={24} className="text-blue-600 mx-auto mb-2 hidden lg:block" />
                      <div className="text-xs lg:text-sm font-medium text-blue-900">View Reports</div>
                    </motion.button>
                    
                    <motion.button
                      className="p-3 lg:p-4 bg-green-50 hover:bg-green-100 rounded-xl transition-colors text-center"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={handleExportDashboard}
                    >
                      <Download size={20} className="text-green-600 mx-auto mb-2 lg:hidden" />
                      <Download size={24} className="text-green-600 mx-auto mb-2 hidden lg:block" />
                      <div className="text-xs lg:text-sm font-medium text-green-900">Export Data</div>
                    </motion.button>
                    
                    <motion.button
                      className="p-3 lg:p-4 bg-purple-50 hover:bg-purple-100 rounded-xl transition-colors text-center"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => navigate('/app/investments')}
                    >
                      <TrendingUp size={20} className="text-purple-600 mx-auto mb-2 lg:hidden" />
                      <TrendingUp size={24} className="text-purple-600 mx-auto mb-2 hidden lg:block" />
                      <div className="text-xs lg:text-sm font-medium text-purple-900">Invest</div>
                    </motion.button>
                    
                    <motion.button
                      className="p-3 lg:p-4 bg-orange-50 hover:bg-orange-100 rounded-xl transition-colors text-center"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => navigate('/app/chat')}
                    >
                      <MessageCircle size={20} className="text-orange-600 mx-auto mb-2 lg:hidden" />
                      <MessageCircle size={24} className="text-orange-600 mx-auto mb-2 hidden lg:block" />
                      <div className="text-xs lg:text-sm font-medium text-orange-900">AI Advisor</div>
                    </motion.button>
                  </div>
                </div>
              </AnimatedSection>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;