import { useState, useEffect, useCallback } from 'react';
import { supabase, Transaction } from '../lib/supabase';
import { useAuth } from './useAuth';

export function useTransactions() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  const fetchTransactions = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      if (!user?.username) {
        console.log('useTransactions.fetchTransactions - No username available');
        setTransactions([]);
        return;
      }

      console.log('useTransactions.fetchTransactions - Fetching transactions for username:', user.username);

      // Query direct_transactions table using user_name field
      const { data: directTransactions, error: directError } = await supabase
        .from('direct_transactions')
        .select('*')
        .eq('user_name', user.username)
        .order('transaction_date', { ascending: false });

      if (directError) {
        console.error('useTransactions.fetchTransactions - Error from direct_transactions:', directError);
        throw directError;
      }

      console.log('useTransactions.fetchTransactions - Found', directTransactions?.length || 0, 'transactions');
      
      if (directTransactions && directTransactions.length > 0) {
        console.log('useTransactions.fetchTransactions - Sample transactions:', directTransactions.slice(0, 3).map(txn => ({
          id: txn.id,
          description: txn.description,
          amount: txn.amount,
          type: txn.type,
          date: txn.transaction_date,
          category: txn.category,
          account_name: txn.account_name
        })));

        // Convert direct_transactions to match the Transaction interface
        const convertedTransactions = directTransactions.map(dt => ({
          id: dt.id,
          custom_user_id: null,
          account_id: dt.account_name, // Use account_name as account_id
          category_id: null,
          description: dt.description,
          amount: dt.amount,
          type: dt.type,
          transaction_date: dt.transaction_date,
          user_name: dt.user_name,
          category: { name: dt.category },
          account: { account_name: dt.account_name }
        }));
        
        setTransactions(convertedTransactions);
      } else {
        console.log('useTransactions.fetchTransactions - No transactions found for user:', user.username);
        setTransactions([]);
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load transactions';
      console.error('useTransactions.fetchTransactions - Error:', errorMessage);
      setError(errorMessage);
      setTransactions([]);
    } finally {
      setLoading(false);
    }
  }, [user?.username]);

  useEffect(() => {
    if (user?.username) {
      fetchTransactions();
    } else {
      console.log('useTransactions - No username, clearing transactions');
      setLoading(false);
      setTransactions([]);
    }
  }, [user?.username, fetchTransactions]);

  const getRecentTransactions = useCallback((limit: number = 5) => {
    const recent = transactions.slice(0, limit);
    console.log('useTransactions.getRecentTransactions - Returning', recent.length, 'recent transactions');
    return recent;
  }, [transactions]);

  const getMonthlyIncome = useCallback(() => {
    const currentDate = new Date();
    const currentMonth = currentDate.getMonth();
    const currentYear = currentDate.getFullYear();
    
    console.log('useTransactions.getMonthlyIncome - Current month/year:', currentMonth + 1, currentYear);
    console.log('useTransactions.getMonthlyIncome - Total transactions:', transactions.length);
    
    const incomeTransactions = transactions.filter(t => {
      const transactionDate = new Date(t.transaction_date);
      const isCurrentMonth = transactionDate.getMonth() === currentMonth && 
                            transactionDate.getFullYear() === currentYear;
      const isIncome = t.type === 'income';
      
      if (isCurrentMonth && isIncome) {
        console.log('useTransactions.getMonthlyIncome - Found income transaction:', {
          description: t.description,
          amount: t.amount,
          date: t.transaction_date,
          type: t.type
        });
      }
      
      return isCurrentMonth && isIncome;
    });

    const monthlyIncome = incomeTransactions.reduce((sum, t) => {
      const amount = Number(t.amount);
      console.log('useTransactions.getMonthlyIncome - Adding income amount:', amount);
      return sum + amount;
    }, 0);
    
    console.log('useTransactions.getMonthlyIncome - Income transactions found:', incomeTransactions.length);
    console.log('useTransactions.getMonthlyIncome - Calculated monthly income:', monthlyIncome);
    return monthlyIncome;
  }, [transactions]);

  const getMonthlyExpenses = useCallback(() => {
    const currentDate = new Date();
    const currentMonth = currentDate.getMonth();
    const currentYear = currentDate.getFullYear();
    
    console.log('useTransactions.getMonthlyExpenses - Current month/year:', currentMonth + 1, currentYear);
    console.log('useTransactions.getMonthlyExpenses - Total transactions:', transactions.length);
    
    const expenseTransactions = transactions.filter(t => {
      const transactionDate = new Date(t.transaction_date);
      const isCurrentMonth = transactionDate.getMonth() === currentMonth && 
                            transactionDate.getFullYear() === currentYear;
      const isExpense = t.type === 'expense';
      
      if (isCurrentMonth && isExpense) {
        console.log('useTransactions.getMonthlyExpenses - Found expense transaction:', {
          description: t.description,
          amount: t.amount,
          date: t.transaction_date,
          type: t.type
        });
      }
      
      return isCurrentMonth && isExpense;
    });

    const monthlyExpenses = expenseTransactions.reduce((sum, t) => {
      const amount = Math.abs(Number(t.amount));
      console.log('useTransactions.getMonthlyExpenses - Adding expense amount:', amount);
      return sum + amount;
    }, 0);
    
    console.log('useTransactions.getMonthlyExpenses - Expense transactions found:', expenseTransactions.length);
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