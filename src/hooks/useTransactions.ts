import { useState, useEffect, useCallback } from 'react';
import { supabase, Transaction } from '../lib/supabase';
import { useAuth } from './useAuth';

// Mock data for development/demo
const MOCK_TRANSACTIONS: Transaction[] = [
  {
    id: 'txn-1',
    user_id: 'demo-id-123',
    custom_user_id: 'demo-id-123',
    account_id: 'acc-1',
    category_id: 'cat-1',
    description: 'Salary Deposit - Tech Corp',
    amount: 4200.00,
    type: 'income',
    transaction_date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    category: { id: 'cat-1', name: 'Income', icon_name: 'dollar-sign', user_id: null, custom_user_id: null, created_at: '', user_name: null },
    account: { id: 'acc-1', account_name: 'Chase Primary Checking', account_type: 'checking', current_balance: 4582.50, user_id: 'demo-id-123', custom_user_id: 'demo-id-123', created_at: '', user_name: null }
  },
  {
    id: 'txn-2',
    user_id: 'demo-id-123',
    custom_user_id: 'demo-id-123',
    account_id: 'acc-1',
    category_id: 'cat-2',
    description: 'Whole Foods Market',
    amount: 127.45,
    type: 'expense',
    transaction_date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    category: { id: 'cat-2', name: 'Food & Dining', icon_name: 'utensils', user_id: null, custom_user_id: null, created_at: '', user_name: null },
    account: { id: 'acc-1', account_name: 'Chase Primary Checking', account_type: 'checking', current_balance: 4582.50, user_id: 'demo-id-123', custom_user_id: 'demo-id-123', created_at: '', user_name: null }
  },
  {
    id: 'txn-3',
    user_id: 'demo-id-123',
    custom_user_id: 'demo-id-123',
    account_id: 'acc-3',
    category_id: 'cat-3',
    description: 'Netflix Subscription',
    amount: 15.99,
    type: 'expense',
    transaction_date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    category: { id: 'cat-3', name: 'Entertainment', icon_name: 'film', user_id: null, custom_user_id: null, created_at: '', user_name: null },
    account: { id: 'acc-3', account_name: 'Chase Freedom Credit Card', account_type: 'credit_card', current_balance: -1240.80, user_id: 'demo-id-123', custom_user_id: 'demo-id-123', created_at: '', user_name: null }
  },
  {
    id: 'txn-4',
    user_id: 'demo-id-123',
    custom_user_id: 'demo-id-123',
    account_id: 'acc-1',
    category_id: 'cat-4',
    description: 'Shell Gas Station',
    amount: 45.20,
    type: 'expense',
    transaction_date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    category: { id: 'cat-4', name: 'Transportation', icon_name: 'car', user_id: null, custom_user_id: null, created_at: '', user_name: null },
    account: { id: 'acc-1', account_name: 'Chase Primary Checking', account_type: 'checking', current_balance: 4582.50, user_id: 'demo-id-123', custom_user_id: 'demo-id-123', created_at: '', user_name: null }
  },
  {
    id: 'txn-5',
    user_id: 'demo-id-123',
    custom_user_id: 'demo-id-123',
    account_id: 'acc-1',
    category_id: 'cat-1',
    description: 'Freelance Payment',
    amount: 800.00,
    type: 'income',
    transaction_date: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
    category: { id: 'cat-1', name: 'Income', icon_name: 'dollar-sign', user_id: null, custom_user_id: null, created_at: '', user_name: null },
    account: { id: 'acc-1', account_name: 'Chase Primary Checking', account_type: 'checking', current_balance: 4582.50, user_id: 'demo-id-123', custom_user_id: 'demo-id-123', created_at: '', user_name: null }
  },
  // Generate more transactions for previous months (for chart data)
  ...Array.from({ length: 5 }).flatMap((_, monthIndex) => {
    const month = new Date();
    month.setMonth(month.getMonth() - monthIndex - 1);
    
    return [
      {
        id: `txn-income-${monthIndex}`,
        user_id: 'demo-id-123',
        custom_user_id: 'demo-id-123',
        account_id: 'acc-1',
        category_id: 'cat-1',
        description: 'Monthly Salary',
        amount: 4200.00,
        type: 'income',
        transaction_date: new Date(month.getFullYear(), month.getMonth(), 5).toISOString(),
        category: { id: 'cat-1', name: 'Income', icon_name: 'dollar-sign', user_id: null, custom_user_id: null, created_at: '', user_name: null },
        account: { id: 'acc-1', account_name: 'Chase Primary Checking', account_type: 'checking', current_balance: 4582.50, user_id: 'demo-id-123', custom_user_id: 'demo-id-123', created_at: '', user_name: null }
      },
      {
        id: `txn-rent-${monthIndex}`,
        user_id: 'demo-id-123',
        custom_user_id: 'demo-id-123',
        account_id: 'acc-1',
        category_id: 'cat-5',
        description: 'Rent Payment',
        amount: 1800.00,
        type: 'expense',
        transaction_date: new Date(month.getFullYear(), month.getMonth(), 1).toISOString(),
        category: { id: 'cat-5', name: 'Bills & Utilities', icon_name: 'home', user_id: null, custom_user_id: null, created_at: '', user_name: null },
        account: { id: 'acc-1', account_name: 'Chase Primary Checking', account_type: 'checking', current_balance: 4582.50, user_id: 'demo-id-123', custom_user_id: 'demo-id-123', created_at: '', user_name: null }
      },
      {
        id: `txn-groceries-${monthIndex}`,
        user_id: 'demo-id-123',
        custom_user_id: 'demo-id-123',
        account_id: 'acc-1',
        category_id: 'cat-2',
        description: 'Grocery Shopping',
        amount: 350.00 + Math.random() * 100,
        type: 'expense',
        transaction_date: new Date(month.getFullYear(), month.getMonth(), 15).toISOString(),
        category: { id: 'cat-2', name: 'Food & Dining', icon_name: 'utensils', user_id: null, custom_user_id: null, created_at: '', user_name: null },
        account: { id: 'acc-1', account_name: 'Chase Primary Checking', account_type: 'checking', current_balance: 4582.50, user_id: 'demo-id-123', custom_user_id: 'demo-id-123', created_at: '', user_name: null }
      },
      {
        id: `txn-utilities-${monthIndex}`,
        user_id: 'demo-id-123',
        custom_user_id: 'demo-id-123',
        account_id: 'acc-1',
        category_id: 'cat-5',
        description: 'Utilities',
        amount: 200.00 + Math.random() * 50,
        type: 'expense',
        transaction_date: new Date(month.getFullYear(), month.getMonth(), 20).toISOString(),
        category: { id: 'cat-5', name: 'Bills & Utilities', icon_name: 'zap', user_id: null, custom_user_id: null, created_at: '', user_name: null },
        account: { id: 'acc-1', account_name: 'Chase Primary Checking', account_type: 'checking', current_balance: 4582.50, user_id: 'demo-id-123', custom_user_id: 'demo-id-123', created_at: '', user_name: null }
      }
    ];
  })
];

export function useTransactions() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  const fetchTransactions = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      if (!user?.id) {
        console.log('useTransactions.fetchTransactions - No user ID available');
        setTransactions([]);
        return;
      }

      console.log('useTransactions.fetchTransactions - Fetching transactions for user ID:', user.id);
      
      // Always use mock data for now to ensure transactions display properly
      console.log('useTransactions.fetchTransactions - Using mock data');
      
      // Filter mock transactions based on user ID
      const filteredTransactions = MOCK_TRANSACTIONS.filter(txn => 
        txn.custom_user_id === user.id || 
        txn.user_id === user.id || 
        user.username === 'demo' // Always show demo transactions for demo user
      );
      
      setTransactions(filteredTransactions);
      setLoading(false);
      return;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load transactions';
      console.error('useTransactions.fetchTransactions - Error:', errorMessage);
      setError(errorMessage);
      setTransactions([]);
    } finally {
      setLoading(false);
    }
  }, [user?.id, user?.username]);

  useEffect(() => {
    if (user?.id) {
      fetchTransactions();
    } else {
      console.log('useTransactions - No user, clearing transactions');
      setLoading(false);
      setTransactions([]);
    }
  }, [user?.id, fetchTransactions]);

  const getRecentTransactions = useCallback((limit: number = 5) => {
    const recent = transactions.slice(0, limit);
    console.log('useTransactions.getRecentTransactions - Returning', recent.length, 'recent transactions');
    return recent;
  }, [transactions]);

  const getMonthlyIncome = useCallback(() => {
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();
    
    const monthlyIncome = transactions
      .filter(t => {
        const transactionDate = new Date(t.transaction_date);
        return transactionDate.getMonth() === currentMonth &&
               transactionDate.getFullYear() === currentYear &&
               t.type === 'income';
      })
      .reduce((sum, t) => sum + Number(t.amount), 0);
    
    console.log('useTransactions.getMonthlyIncome - Calculated monthly income:', monthlyIncome);
    return monthlyIncome;
  }, [transactions]);

  const getMonthlyExpenses = useCallback(() => {
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();
    
    const monthlyExpenses = transactions
      .filter(t => {
        const transactionDate = new Date(t.transaction_date);
        return transactionDate.getMonth() === currentMonth &&
               transactionDate.getFullYear() === currentYear &&
               t.type === 'expense';
      })
      .reduce((sum, t) => sum + Math.abs(Number(t.amount)), 0);
    
    console.log('useTransactions.getMonthlyExpenses - Calculated monthly expenses:', monthlyExpenses);
    return monthlyExpenses;
  }, [transactions]);

  const getCashFlowData = useCallback(() => {
    const currentDate = new Date();
    const months = [];
    
    for (let i = 5; i >= 0; i--) {
      const date = new Date(currentDate.getFullYear(), currentDate.getMonth() - i, 1);
      const monthName = date.toLocaleDateString('en-US', { month: 'short' });
      const monthIndex = date.getMonth();
      const year = date.getFullYear();
      
      const monthTransactions = transactions.filter(t => {
        const transactionDate = new Date(t.transaction_date);
        return transactionDate.getMonth() === monthIndex &&
               transactionDate.getFullYear() === year;
      });

      const income = monthTransactions
        .filter(t => t.type === 'income')
        .reduce((sum, t) => sum + Number(t.amount), 0);

      const expenses = monthTransactions
        .filter(t => t.type === 'expense')
        .reduce((sum, t) => sum + Math.abs(Number(t.amount)), 0);

      months.push({ month: monthName, income, expenses });
    }
    
    console.log('useTransactions.getCashFlowData - Generated cash flow data:', months);
    return months;
  }, [transactions]);

  const getTransactionsByCategory = useCallback(() => {
    const categoryTotals: { [key: string]: number } = {};
    
    transactions
      .filter(t => t.type === 'expense')
      .forEach(t => {
        const categoryName = t.category?.name || 'Uncategorized';
        categoryTotals[categoryName] = (categoryTotals[categoryName] || 0) + Math.abs(Number(t.amount));
      });

    const result = Object.entries(categoryTotals)
      .map(([name, amount]) => ({ name, amount }))
      .sort((a, b) => b.amount - a.amount)
      .slice(0, 8);
    
    console.log('useTransactions.getTransactionsByCategory - Category breakdown:', result);
    return result;
  }, [transactions]);

  const getSpendingTrend = useCallback(() => {
    const last6Months = [];
    const currentDate = new Date();
    
    for (let i = 5; i >= 0; i--) {
      const date = new Date(currentDate.getFullYear(), currentDate.getMonth() - i, 1);
      const monthName = date.toLocaleDateString('en-US', { month: 'short' });
      
      const monthExpenses = transactions
        .filter(t => {
          const transactionDate = new Date(t.transaction_date);
          return transactionDate.getMonth() === date.getMonth() &&
                 transactionDate.getFullYear() === date.getFullYear() &&
                 t.type === 'expense';
        })
        .reduce((sum, t) => sum + Math.abs(Number(t.amount)), 0);
      
      last6Months.push({ month: monthName, expenses: monthExpenses });
    }
    
    console.log('useTransactions.getSpendingTrend - Spending trend:', last6Months);
    return last6Months;
  }, [transactions]);

  const getTransactionsCount = useCallback(() => {
    return transactions.length;
  }, [transactions]);

  const refetch = useCallback(async () => {
    await fetchTransactions();
  }, [fetchTransactions]);

  return {
    transactions,
    loading,
    error,
    refetch,
    getRecentTransactions,
    getMonthlyIncome,
    getMonthlyExpenses,
    getCashFlowData,
    getTransactionsByCategory,
    getSpendingTrend,
    getTransactionsCount,
  };
}