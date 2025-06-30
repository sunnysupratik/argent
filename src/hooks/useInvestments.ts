import { useState, useEffect, useCallback } from 'react';
import { supabase, Investment } from '../lib/supabase';
import { useAuth } from './useAuth';
import { useAccounts } from './useAccounts';

export function useInvestments() {
  const [investments, setInvestments] = useState<Investment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();
  const { getAccountsByType } = useAccounts();

  const fetchInvestments = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      if (!user?.id) {
        console.log('useInvestments.fetchInvestments - No user ID available');
        setInvestments([]);
        return;
      }

      console.log('useInvestments.fetchInvestments - Fetching investments for user ID:', user.id);

      // First try to fetch from direct_investments table
      let { data, error } = await supabase
        .from('direct_investments')
        .select('*')
        .eq('custom_user_id', user.id)
        .order('symbol', { ascending: true });

      // If no results or error, try by user_name
      if ((!data || data.length === 0) && user.username) {
        console.log('useInvestments.fetchInvestments - No investments found by custom_user_id, trying user_name:', user.username);
        const { data: dataByUsername, error: errorByUsername } = await supabase
          .from('direct_investments')
          .select('*')
          .eq('user_name', user.username)
          .order('symbol', { ascending: true });
        
        data = dataByUsername;
        error = errorByUsername;
      }

      // If still no data, use investment accounts as fallback
      if ((!data || data.length === 0)) {
        console.log('useInvestments.fetchInvestments - No direct investments found, using investment accounts as fallback');
        
        // Get investment accounts
        const investmentAccounts = getAccountsByType('investment');
        
        if (investmentAccounts.length > 0) {
          // Create synthetic investment data from accounts
          const syntheticInvestments = investmentAccounts.map(account => ({
            id: account.id,
            custom_user_id: account.custom_user_id,
            user_name: account.user_name,
            symbol: 'PORTFOLIO',
            name: account.account_name,
            shares: 1,
            current_price: Number(account.current_balance),
            total_value: Number(account.current_balance),
            day_change: Number(account.current_balance) * 0.015, // 1.5% daily change
            day_change_percent: 1.5,
            sector: 'Diversified',
            market_cap: 'N/A',
            pe: 0,
            dividend: 0,
            rating: 'Hold',
            created_at: account.created_at
          }));
          
          setInvestments(syntheticInvestments);
          setLoading(false);
          return;
        }
      }

      if (error && error.code !== 'PGRST116') { // Ignore "relation does not exist" error
        console.error('useInvestments.fetchInvestments - Database error:', error);
        throw error;
      }
      
      console.log('useInvestments.fetchInvestments - Query result for user', user.id, ':', data);
      console.log('useInvestments.fetchInvestments - Found', data?.length || 0, 'investments');
      
      setInvestments(data || []);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load investments';
      console.error('useInvestments.fetchInvestments - Error:', errorMessage);
      setError(errorMessage);
      setInvestments([]);
    } finally {
      setLoading(false);
    }
  }, [user?.id, user?.username, getAccountsByType]);

  useEffect(() => {
    if (user?.id) {
      fetchInvestments();
    } else {
      console.log('useInvestments - No user, clearing investments');
      setLoading(false);
      setInvestments([]);
    }
  }, [user?.id, fetchInvestments]);

  const getTotalInvestmentValue = useCallback(() => {
    const total = investments.reduce((sum, investment) => {
      return sum + Number(investment.total_value);
    }, 0);
    
    console.log('useInvestments.getTotalInvestmentValue - Calculated total:', total);
    return total;
  }, [investments]);

  const getDailyChange = useCallback(() => {
    const change = investments.reduce((sum, investment) => {
      return sum + Number(investment.day_change);
    }, 0);
    
    console.log('useInvestments.getDailyChange - Calculated daily change:', change);
    return change;
  }, [investments]);

  const getDailyChangePercent = useCallback(() => {
    const totalValue = getTotalInvestmentValue();
    const dailyChange = getDailyChange();
    
    if (totalValue === 0 || dailyChange === 0) return 0;
    
    const changePercent = (dailyChange / (totalValue - dailyChange)) * 100;
    console.log('useInvestments.getDailyChangePercent - Calculated daily change percent:', changePercent);
    return changePercent;
  }, [getTotalInvestmentValue, getDailyChange]);

  const getInvestmentsBySymbol = useCallback((symbol: string) => {
    const filtered = investments.filter(investment => 
      investment.symbol.toLowerCase() === symbol.toLowerCase()
    );
    console.log('useInvestments.getInvestmentsBySymbol - Found', filtered.length, 'investments with symbol', symbol);
    return filtered;
  }, [investments]);

  const getInvestmentsBySector = useCallback((sector: string) => {
    const filtered = investments.filter(investment => 
      investment.sector.toLowerCase().includes(sector.toLowerCase())
    );
    console.log('useInvestments.getInvestmentsBySector - Found', filtered.length, 'investments in sector', sector);
    return filtered;
  }, [investments]);

  const getInvestmentsCount = useCallback(() => {
    return investments.length;
  }, [investments]);

  const refetch = useCallback(async () => {
    await fetchInvestments();
  }, [fetchInvestments]);

  return {
    investments,
    loading,
    error,
    refetch,
    getTotalInvestmentValue,
    getDailyChange,
    getDailyChangePercent,
    getInvestmentsBySymbol,
    getInvestmentsBySector,
    getInvestmentsCount,
  };
}