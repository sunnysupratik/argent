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
      
      if (!user?.username) {
        console.log('useInvestments.fetchInvestments - No username available');
        setInvestments([]);
        return;
      }

      console.log('useInvestments.fetchInvestments - Fetching investments for username:', user.username);

      // Query direct_investments table using user_name field
      const { data: directInvestments, error: directError } = await supabase
        .from('direct_investments')
        .select('*')
        .eq('user_name', user.username)
        .order('symbol', { ascending: true });

      if (directError) {
        console.error('useInvestments.fetchInvestments - Error from direct_investments:', directError);
        // Don't throw error, just log it and continue with empty array
        setInvestments([]);
        return;
      }

      console.log('useInvestments.fetchInvestments - Found', directInvestments?.length || 0, 'investments');
      
      if (directInvestments && directInvestments.length > 0) {
        console.log('useInvestments.fetchInvestments - Sample investments:', directInvestments.slice(0, 3).map(inv => ({
          id: inv.id,
          symbol: inv.symbol,
          name: inv.name,
          shares: inv.shares,
          current_price: inv.current_price,
          total_value: inv.total_value
        })));
        
        setInvestments(directInvestments);
      } else {
        console.log('useInvestments.fetchInvestments - No investments found for user:', user.username);
        setInvestments([]);
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load investments';
      console.error('useInvestments.fetchInvestments - Error:', errorMessage);
      setError(errorMessage);
      setInvestments([]);
    } finally {
      setLoading(false);
    }
  }, [user?.username]);

  useEffect(() => {
    if (user?.username) {
      fetchInvestments();
    } else {
      console.log('useInvestments - No username, clearing investments');
      setLoading(false);
      setInvestments([]);
    }
  }, [user?.username, fetchInvestments]);

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