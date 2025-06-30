import { useState, useEffect, useCallback } from 'react';
import { supabase, Account } from '../lib/supabase';
import { useAuth } from './useAuth';

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
      console.log('useAccounts.fetchAccounts - User object:', user);

      // First try to fetch by custom_user_id
      let { data, error } = await supabase
        .from('accounts')
        .select('*')
        .eq('custom_user_id', user.id)
        .order('account_name', { ascending: true });

      // If no results or error, try by user_name
      if ((!data || data.length === 0) && user.username) {
        console.log('useAccounts.fetchAccounts - No accounts found by custom_user_id, trying user_name:', user.username);
        const { data: dataByUsername, error: errorByUsername } = await supabase
          .from('accounts')
          .select('*')
          .eq('user_name', user.username)
          .order('account_name', { ascending: true });
        
        data = dataByUsername;
        error = errorByUsername;
      }

      if (error) {
        console.error('useAccounts.fetchAccounts - Database error:', error);
        throw error;
      }
      
      console.log('useAccounts.fetchAccounts - Query result for user', user.id, ':', data);
      console.log('useAccounts.fetchAccounts - Found', data?.length || 0, 'accounts');
      
      if (data && data.length > 0) {
        console.log('useAccounts.fetchAccounts - Account details:', data.map(acc => ({
          id: acc.id,
          name: acc.account_name,
          type: acc.account_type,
          balance: acc.current_balance,
          custom_user_id: acc.custom_user_id
        })));
      }
      
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