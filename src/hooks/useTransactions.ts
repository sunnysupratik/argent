import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from './useAuth';

interface DirectTransaction {
  id: string;
  user_name: string;
  description: string;
  amount: number;
  type: 'income' | 'expense';
  transaction_date: string;
  category: string;
  account_name: string;
  created_at: string;
}

export function useTransactions() {
  const [transactions, setTransactions] = useState<DirectTransaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  const fetchTransactions = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Check if Supabase is properly configured
      const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
      const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
      
      if (!supabaseUrl || !supabaseAnonKey || 
          supabaseUrl.includes('your-project-id') || 
          supabaseAnonKey.includes('your-anon-key')) {
        setError('Supabase not configured. Please set up your environment variables.');
        setTransactions([]);
        return;
      }
      
      if (!user?.username) {
        console.log('No username available for transactions');
        setTransactions([]);
        return;
      }

      console.log('Fetching transactions for user:', user.username);

      const { data, error: fetchError } = await supabase
        .from('direct_transactions')
        .select('*')
        .eq('user_name', user.username)
        .order('transaction_date', { ascending: false });

      if (fetchError) {
        console.error('Error fetching transactions:', fetchError);
        throw fetchError;
      }

      console.log('Raw transaction data:', data);
      console.log('Number of transactions found:', data?.length || 0);

      if (data) {
        // Log sample transactions for debugging
        if (data.length > 0) {
          console.log('Sample transactions:', data.slice(0, 3).map(t => ({
            description: t.description,
            amount: t.amount,
            type: t.type,
            date: t.transaction_date,
            category: t.category
          })));
        }
        setTransactions(data);
      } else {
        setTransactions([]);
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load transactions';
      console.error('Transaction fetch error:', errorMessage);
      setError(errorMessage);
      setTransactions([]);
    } finally {
      setLoading(false);
    }
  }, [user?.username]);

  useEffect(() => {
    fetchTransactions();
  }, [fetchTransactions]);

  const getRecentTransactions = useCallback((limit: number = 5) => {
    const recent = transactions.slice(0, limit).map(t => ({
      id: t.id,
      description: t.description,
      amount: t.amount,
      type: t.type,
      transaction_date: t.transaction_date,
      category: { name: t.category },
      account: { account_name: t.account_name }
    }));
    console.log('Recent transactions:', recent);
    return recent;
  }, [transactions]);

  const getMonthlyIncome = useCallback(() => {
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();
    
    console.log('Calculating monthly income for:', currentMonth + 1, currentYear);
    console.log('Total transactions to check:', transactions.length);
    
    const monthlyIncomeTransactions = transactions.filter(t => {
      const transactionDate = new Date(t.transaction_date);
      const isCurrentMonth = transactionDate.getMonth() === currentMonth && 
                            transactionDate.getFullYear() === currentYear;
      const isIncome = t.type === 'income';
      
      if (isCurrentMonth && isIncome) {
        console.log('Found income transaction:', {
          description: t.description,
          amount: t.amount,
          date: t.transaction_date
        });
      }
      
      return isCurrentMonth && isIncome;
    });

    const totalIncome = monthlyIncomeTransactions.reduce((sum, t) => {
      const amount = Number(t.amount);
      console.log('Adding income amount:', amount);
      return sum + amount;
    }, 0);
    
    console.log('Monthly income calculation:', {
      incomeTransactions: monthlyIncomeTransactions.length,
      totalIncome
    });
    
    return totalIncome;
  }, [transactions]);

  const getMonthlyExpenses = useCallback(() => {
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();
    
    console.log('Calculating monthly expenses for:', currentMonth + 1, currentYear);
    
    const monthlyExpenseTransactions = transactions.filter(t => {
      const transactionDate = new Date(t.transaction_date);
      const isCurrentMonth = transactionDate.getMonth() === currentMonth && 
                            transactionDate.getFullYear() === currentYear;
      const isExpense = t.type === 'expense';
      
      if (isCurrentMonth && isExpense) {
        console.log('Found expense transaction:', {
          description: t.description,
          amount: t.amount,
          date: t.transaction_date
        });
      }
      
      return isCurrentMonth && isExpense;
    });

    const totalExpenses = monthlyExpenseTransactions.reduce((sum, t) => {
      const amount = Math.abs(Number(t.amount));
      console.log('Adding expense amount:', amount);
      return sum + amount;
    }, 0);
    
    console.log('Monthly expenses calculation:', {
      expenseTransactions: monthlyExpenseTransactions.length,
      totalExpenses
    });
    
    return totalExpenses;
  }, [transactions]);

  const getCashFlowData = useCallback(() => {
    const months = [];
    const currentDate = new Date();
    
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
    
    return months;
  }, [transactions]);

  const getTransactionsCount = useCallback(() => {
    return transactions.length;
  }, [transactions]);

  const refetch = useCallback(async () => {
    await fetchTransactions();
  }, [fetchTransactions]);

  return {
    transactions: transactions.map(t => ({
      id: t.id,
      custom_user_id: null,
      account_id: t.account_name,
      category_id: null,
      description: t.description,
      amount: t.amount,
      type: t.type,
      transaction_date: t.transaction_date,
      user_name: t.user_name,
      category: { name: t.category },
      account: { account_name: t.account_name }
    })),
    loading,
    error,
    refetch,
    getRecentTransactions,
    getMonthlyIncome,
    getMonthlyExpenses,
    getCashFlowData,
    getTransactionsCount,
  };
}