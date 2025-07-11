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
      
      if (!user?.id) {
        console.log('useTransactions.fetchTransactions - No user ID available');
        setTransactions([]);
        return;
      }

      console.log('useTransactions.fetchTransactions - Fetching transactions for user ID:', user.id);
      console.log('useTransactions.fetchTransactions - User object:', user);

      // First try to fetch by custom_user_id
      let { data, error } = await supabase
        .from('transactions')
        .select(`
          *,
          category:categories(*),
          account:accounts(*)
        `)
        .eq('custom_user_id', user.id)
        .order('transaction_date', { ascending: false })
        .limit(100);

      // If no results or error, try by user_name
      if ((!data || data.length === 0) && user.username) {
        console.log('useTransactions.fetchTransactions - No transactions found by custom_user_id, trying user_name:', user.username);
        const { data: dataByUsername, error: errorByUsername } = await supabase
          .from('transactions')
          .select(`
            *,
            category:categories(*),
            account:accounts(*)
          `)
          .eq('user_name', user.username)
          .order('transaction_date', { ascending: false })
          .limit(100);
        
        data = dataByUsername;
        error = errorByUsername;
      }

      if (error) {
        console.error('useTransactions.fetchTransactions - Database error:', error);
        throw error;
      }
      
      console.log('useTransactions.fetchTransactions - Query result for user', user.id, ':', data);
      console.log('useTransactions.fetchTransactions - Found', data?.length || 0, 'transactions');
      
      if (data && data.length > 0) {
        console.log('useTransactions.fetchTransactions - Transaction details:', data.slice(0, 5).map(txn => ({
          id: txn.id,
          description: txn.description,
          amount: txn.amount,
          type: txn.type,
          custom_user_id: txn.custom_user_id,
          date: txn.transaction_date
        })));
      }
      
      setTransactions(data || []);
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
    const currentDate = new Date();
    const currentMonth = currentDate.getMonth();
    const currentYear = currentDate.getFullYear();
    
    console.log('useTransactions.getMonthlyIncome - Current month/year:', currentMonth, currentYear);
    console.log('useTransactions.getMonthlyIncome - Total transactions:', transactions.length);
    
    const monthlyIncome = transactions
      .filter(t => {
        const transactionDate = new Date(t.transaction_date);
        const isCurrentMonth = transactionDate.getMonth() === currentMonth && 
                              transactionDate.getFullYear() === currentYear;
        const isIncome = t.type === 'income';
        
        if (isCurrentMonth && isIncome) {
          console.log('useTransactions.getMonthlyIncome - Found income transaction:', t.description, t.amount);
        }
        
        return isCurrentMonth && isIncome;
      })
      .reduce((sum, t) => sum + Number(t.amount), 0);
    
    console.log('useTransactions.getMonthlyIncome - Calculated monthly income:', monthlyIncome);
    return monthlyIncome;
  }, [transactions]);

  const getMonthlyExpenses = useCallback(() => {
    const currentDate = new Date();
    const currentMonth = currentDate.getMonth();
    const currentYear = currentDate.getFullYear();
    
    console.log('useTransactions.getMonthlyExpenses - Current month/year:', currentMonth, currentYear);
    console.log('useTransactions.getMonthlyExpenses - Total transactions:', transactions.length);
    
    const monthlyExpenses = transactions
      .filter(t => {
        const transactionDate = new Date(t.transaction_date);
        const isCurrentMonth = transactionDate.getMonth() === currentMonth && 
                              transactionDate.getFullYear() === currentYear;
        const isExpense = t.type === 'expense';
        
        if (isCurrentMonth && isExpense) {
          console.log('useTransactions.getMonthlyExpenses - Found expense transaction:', t.description, t.amount);
        }
        
        return isCurrentMonth && isExpense;
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