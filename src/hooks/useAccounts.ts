import { useState, useEffect, useCallback } from 'react';
import { supabase, Account } from '../lib/supabase';
import { useAuth } from './useAuth';

// Mock data for development/demo
const MOCK_ACCOUNTS: Account[] = [
  {
    id: 'acc-1',
    user_id: 'demo-id-123',
    custom_user_id: 'demo-id-123',
    account_name: 'Chase Primary Checking',
    account_type: 'checking',
    current_balance: 4582.50,
    created_at: new Date().toISOString()
  },
  {
    id: 'acc-2',
    user_id: 'demo-id-123',
    custom_user_id: 'demo-id-123',
    account_name: 'Marcus High-Yield Savings',
    account_type: 'savings',
    current_balance: 15104.40,
    created_at: new Date().toISOString()
  },
  {
    id: 'acc-3',
    user_id: 'demo-id-123',
    custom_user_id: 'demo-id-123',
    account_name: 'Chase Freedom Credit Card',
    account_type: 'credit_card',
    current_balance: -1240.80,
    created_at: new Date().toISOString()
  },
  {
    id: 'acc-4',
    user_id: 'demo-id-123',
    custom_user_id: 'demo-id-123',
    account_name: 'Vanguard Investment',
    account_type: 'investment',
    current_balance: 127500.75,
    created_at: new Date().toISOString()
  }
];

export function useAccounts() {
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  const fetchAccounts = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      if (!user?.id) {
        console.log('useAccounts.fetchAccounts - No user ID available');
        setAccounts([]);
        return;
      }

      console.log('useAccounts.fetchAccounts - Fetching accounts for user ID:', user.id);
      
      // For development/demo purposes
      if (import.meta.env.DEV || !import.meta.env.VITE_SUPABASE_URL || import.meta.env.VITE_SUPABASE_URL.includes('example')) {
        console.log('useAccounts.fetchAccounts - Using mock data for development');
        
        // Filter mock accounts based on user ID
        const filteredAccounts = MOCK_ACCOUNTS.filter(acc => 
          acc.custom_user_id === user.id || 
          acc.user_id === user.id || 
          user.username === 'demo' // Always show demo accounts for demo user
        );
        
        setAccounts(filteredAccounts);
        setLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from('accounts')
        .select('*')
        .eq('custom_user_id', user.id)
        .order('account_name', { ascending: true });

      if (error) {
        console.error('useAccounts.fetchAccounts - Database error:', error);
        throw error;
      }
      
      console.log('useAccounts.fetchAccounts - Found', data?.length || 0, 'accounts');
      
      setAccounts(data || []);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load accounts';
      console.error('useAccounts.fetchAccounts - Error:', errorMessage);
      setError(errorMessage);
      setAccounts([]);
    } finally {
      setLoading(false);
    }
  }, [user?.id, user?.username]);

  useEffect(() => {
    if (user?.id) {
      fetchAccounts();
    } else {
      console.log('useAccounts - No user, clearing accounts');
      setLoading(false);
      setAccounts([]);
    }
  }, [user?.id, fetchAccounts]);

  const getTotalBalance = useCallback(() => {
    const total = accounts.reduce((sum, account) => {
      // For credit cards, the balance is already negative in the database
      return sum + Number(account.current_balance);
    }, 0);
    
    console.log('useAccounts.getTotalBalance - Calculated total:', total, 'from', accounts.length, 'accounts');
    return total;
  }, [accounts]);

  const getAccountsByType = useCallback((type: string) => {
    const filtered = accounts.filter(account => 
      account.account_type.toLowerCase().includes(type.toLowerCase())
    );
    console.log('useAccounts.getAccountsByType - Found', filtered.length, 'accounts of type', type);
    return filtered;
  }, [accounts]);

  const getAccountsCount = useCallback(() => {
    return accounts.length;
  }, [accounts]);

  const getAccountBalance = useCallback((accountType: string) => {
    const account = accounts.find(acc => acc.account_type === accountType);
    const balance = account ? Number(account.current_balance) : 0;
    console.log('useAccounts.getAccountBalance - Balance for', accountType, ':', balance);
    return balance;
  }, [accounts]);

  const getNetWorth = useCallback(() => {
    const netWorth = accounts.reduce((sum, account) => {
      return sum + Number(account.current_balance);
    }, 0);
    console.log('useAccounts.getNetWorth - Calculated net worth:', netWorth);
    return netWorth;
  }, [accounts]);

  const refetch = useCallback(async () => {
    await fetchAccounts();
  }, [fetchAccounts]);

  return {
    accounts,
    loading,
    error,
    refetch,
    getTotalBalance,
    getAccountsByType,
    getAccountsCount,
    getAccountBalance,
    getNetWorth,
  };
}