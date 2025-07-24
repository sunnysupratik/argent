import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from './useAuth';

interface DirectAccount {
  id: string;
  user_name: string;
  account_name: string;
  account_type: string;
  current_balance: number;
  created_at: string;
}

export function useAccounts() {
  const [accounts, setAccounts] = useState<DirectAccount[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  const fetchAccounts = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      if (!user?.username) {
        console.log('No username available for accounts');
        setAccounts([]);
        return;
      }

      console.log('Fetching accounts for user:', user.username);

      const { data, error: fetchError } = await supabase
        .from('direct_accounts')
        .select('*')
        .eq('user_name', user.username)
        .order('account_name', { ascending: true });

      if (fetchError) {
        console.error('Error fetching accounts:', fetchError);
        throw fetchError;
      }

      console.log('Raw account data:', data);
      console.log('Number of accounts found:', data?.length || 0);

      if (data) {
        // Log account details for debugging
        if (data.length > 0) {
          console.log('Account details:', data.map(acc => ({
            name: acc.account_name,
            type: acc.account_type,
            balance: acc.current_balance
          })));
        }
        setAccounts(data);
      } else {
        setAccounts([]);
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load accounts';
      console.error('Account fetch error:', errorMessage);
      setError(errorMessage);
      setAccounts([]);
    } finally {
      setLoading(false);
    }
  }, [user?.username]);

  useEffect(() => {
    fetchAccounts();
  }, [fetchAccounts]);

  const getTotalBalance = useCallback(() => {
    const total = accounts.reduce((sum, account) => {
      return sum + Number(account.current_balance);
    }, 0);
    
    console.log('Total balance calculation:', {
      accountCount: accounts.length,
      total,
      accountBalances: accounts.map(a => ({ name: a.account_name, balance: a.current_balance }))
    });
    
    return total;
  }, [accounts]);

  const getAccountsByType = useCallback((type: string) => {
    const filtered = accounts.filter(account => 
      account.account_type.toLowerCase().includes(type.toLowerCase())
    );
    console.log(`Accounts of type "${type}":`, filtered.length);
    return filtered.map(acc => ({
      id: acc.id,
      custom_user_id: null,
      account_name: acc.account_name,
      account_type: acc.account_type,
      current_balance: acc.current_balance,
      created_at: acc.created_at,
      user_name: acc.user_name
    }));
  }, [accounts]);

  const getAccountsCount = useCallback(() => {
    return accounts.length;
  }, [accounts]);

  const getNetWorth = useCallback(() => {
    const netWorth = accounts.reduce((sum, account) => {
      return sum + Number(account.current_balance);
    }, 0);
    console.log('Net worth calculation:', netWorth);
    return netWorth;
  }, [accounts]);

  const refetch = useCallback(async () => {
    await fetchAccounts();
  }, [fetchAccounts]);

  return {
    accounts: accounts.map(acc => ({
      id: acc.id,
      custom_user_id: null,
      account_name: acc.account_name,
      account_type: acc.account_type,
      current_balance: acc.current_balance,
      created_at: acc.created_at,
      user_name: acc.user_name
    })),
    loading,
    error,
    refetch,
    getTotalBalance,
    getAccountsByType,
    getAccountsCount,
    getNetWorth,
  };
}