import { useState, useEffect, useCallback } from 'react';
import { supabase, Account } from '../lib/supabase';
import { useAuth } from './useAuth';
import { getMockAccountsByUsername } from '../lib/mockData';

export function useAccounts() {
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  const fetchAccounts = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      if (!user?.username) {
        console.log('useAccounts.fetchAccounts - No username available');
        setAccounts([]);
        return;
      }

      console.log('useAccounts.fetchAccounts - Fetching accounts for username:', user.username);
      
      // Check if we have a valid Supabase connection
      const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
      const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
      const isValidSupabase = supabaseUrl && !supabaseUrl.includes('example.supabase.co') && supabaseAnonKey && supabaseAnonKey !== 'public-anon-key';
      
      if (isValidSupabase) {
        console.log('Using real Supabase for accounts');
        
        // Try to fetch from direct_accounts first
        const { data: directAccounts, error: directError } = await supabase
          .from('direct_accounts')
          .select('*')
          .eq('user_name', user.username);
        
        if (!directError && directAccounts && directAccounts.length > 0) {
          console.log('useAccounts.fetchAccounts - Found', directAccounts.length, 'accounts in direct_accounts');
          setAccounts(directAccounts);
          setLoading(false);
          return;
        }
        
        // Fall back to original accounts table
        const { data, error } = await supabase
          .from('accounts')
          .select('*')
          .eq('user_name', user.username);

        if (error) {
          console.error('useAccounts.fetchAccounts - Database error:', error);
          throw error;
        }
        
        if (data && data.length > 0) {
          console.log('useAccounts.fetchAccounts - Found', data.length, 'accounts');
          setAccounts(data);
          setLoading(false);
          return;
        }
      }
      
      // Use mock data as fallback
      console.log('Using mock data for accounts');
      const mockAccounts = getMockAccountsByUsername(user.username);
      console.log('useAccounts.fetchAccounts - Found', mockAccounts.length, 'mock accounts');
      setAccounts(mockAccounts);
      
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load accounts';
      console.error('useAccounts.fetchAccounts - Error:', errorMessage);
      
      // Fall back to mock data on error
      console.log('Falling back to mock data due to error');
      const mockAccounts = getMockAccountsByUsername(user?.username || '');
      setAccounts(mockAccounts);
      setError(null); // Clear error since we have fallback data
    } finally {
      setLoading(false);
    }
  }, [user?.username]);

  useEffect(() => {
    if (user?.username) {
      fetchAccounts();
    } else {
      console.log('useAccounts - No user, clearing accounts');
      setLoading(false);
      setAccounts([]);
    }
  }, [user?.username, fetchAccounts]);

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