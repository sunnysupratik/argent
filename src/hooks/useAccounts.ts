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
      
      if (!user?.username) {
        console.log('useAccounts.fetchAccounts - No username available');
        setAccounts([]);
        return;
      }

      console.log('useAccounts.fetchAccounts - Fetching accounts for username:', user.username);

      // Query direct_accounts table using user_name field
      const { data: directAccounts, error: directError } = await supabase
        .from('direct_accounts')
        .select('*')
        .eq('user_name', user.username)
        .order('account_name', { ascending: true });

      if (directError) {
        console.error('useAccounts.fetchAccounts - Error from direct_accounts:', directError);
        throw directError;
      }

      console.log('useAccounts.fetchAccounts - Found', directAccounts?.length || 0, 'accounts');
      
      if (directAccounts && directAccounts.length > 0) {
        console.log('useAccounts.fetchAccounts - Account details:', directAccounts.map(acc => ({
          id: acc.id,
          name: acc.account_name,
          type: acc.account_type,
          balance: acc.current_balance
        })));

        // Convert direct_accounts to match the Account interface
        const convertedAccounts = directAccounts.map(da => ({
          id: da.id,
          custom_user_id: null,
          account_name: da.account_name,
          account_type: da.account_type,
          current_balance: da.current_balance,
          created_at: da.created_at,
          user_name: da.user_name
        }));
        
        setAccounts(convertedAccounts);
      } else {
        console.log('useAccounts.fetchAccounts - No accounts found for user:', user.username);
        setAccounts([]);
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load accounts';
      console.error('useAccounts.fetchAccounts - Error:', errorMessage);
      setError(errorMessage);
      setAccounts([]);
    } finally {
      setLoading(false);
    }
  }, [user?.username]);

  useEffect(() => {
    if (user?.username) {
      fetchAccounts();
    } else {
      console.log('useAccounts - No username, clearing accounts');
      setLoading(false);
      setAccounts([]);
    }
  }, [user?.username, fetchAccounts]);

  const getTotalBalance = useCallback(() => {
    const total = accounts.reduce((sum, account) => {
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