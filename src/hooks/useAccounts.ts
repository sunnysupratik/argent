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

      // Try to fetch from both account tables
      let allAccounts: any[] = [];

      // First try the main accounts table
      const { data: mainAccounts, error: mainError } = await supabase
        .from('accounts')
        .select('*')
        .eq('custom_user_id', user.id)
        .order('account_name', { ascending: true });

      if (mainError) {
        console.log('useAccounts.fetchAccounts - Error from main accounts table:', mainError);
      } else if (mainAccounts && mainAccounts.length > 0) {
        console.log('useAccounts.fetchAccounts - Found', mainAccounts.length, 'accounts in main table');
        allAccounts = [...allAccounts, ...mainAccounts];
      }

      // Also try the direct_accounts table
      const { data: directAccounts, error: directError } = await supabase
        .from('direct_accounts')
        .select('*')
        .eq('user_name', user.username)
        .order('account_name', { ascending: true });

      if (directError) {
        console.log('useAccounts.fetchAccounts - Error from direct_accounts table:', directError);
      } else if (directAccounts && directAccounts.length > 0) {
        console.log('useAccounts.fetchAccounts - Found', directAccounts.length, 'accounts in direct_accounts table');
        
        // Convert direct_accounts to match the Account interface
        const convertedAccounts = directAccounts.map(da => ({
          id: da.id,
          custom_user_id: user.id,
          account_name: da.account_name,
          account_type: da.account_type,
          current_balance: da.current_balance,
          created_at: da.created_at,
          user_name: da.user_name
        }));
        
        allAccounts = [...allAccounts, ...convertedAccounts];
      }

      // If no accounts found by custom_user_id, try by user_name in main table
      if (allAccounts.length === 0 && user.username) {
        console.log('useAccounts.fetchAccounts - No accounts found, trying user_name:', user.username);
        const { data: dataByUsername, error: errorByUsername } = await supabase
          .from('accounts')
          .select('*')
          .eq('user_name', user.username)
          .order('account_name', { ascending: true });
        
        if (!errorByUsername && dataByUsername && dataByUsername.length > 0) {
          console.log('useAccounts.fetchAccounts - Found', dataByUsername.length, 'accounts by user_name');
          allAccounts = [...allAccounts, ...dataByUsername];
        }
      }

      console.log('useAccounts.fetchAccounts - Total accounts found:', allAccounts.length);
      
      if (allAccounts.length > 0) {
        console.log('useAccounts.fetchAccounts - Account details:', allAccounts.map(acc => ({
          id: acc.id,
          name: acc.account_name,
          type: acc.account_type,
          balance: acc.current_balance,
          custom_user_id: acc.custom_user_id,
          source_table: acc.user_name && !acc.custom_user_id ? 'direct_accounts' : 'accounts'
        })));
      }
      
      setAccounts(allAccounts || []);
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