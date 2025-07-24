import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from './useAuth';

interface DirectInvestment {
  id: string;
  user_name: string;
  symbol: string;
  name: string;
  shares: number;
  current_price: number;
  total_value: number;
  day_change: number;
  day_change_percent: number;
  sector: string;
  market_cap: string;
  pe: number;
  dividend: number;
  rating: string;
  created_at: string;
  updated_at: string;
  custom_user_id: string | null;
}

export function useInvestments() {
  const [investments, setInvestments] = useState<DirectInvestment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  const fetchInvestments = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      if (!user?.username) {
        console.log('No username available for investments');
        setInvestments([]);
        return;
      }

      console.log('Fetching investments for user:', user.username);

      const { data, error: fetchError } = await supabase
        .from('direct_investments')
        .select('*')
        .eq('user_name', user.username)
        .order('symbol', { ascending: true });

      if (fetchError) {
        console.error('Error fetching investments:', fetchError);
        // Don't throw error for investments, just log and continue
        setInvestments([]);
        return;
      }

      console.log('Raw investment data:', data);
      console.log('Number of investments found:', data?.length || 0);

      if (data && data.length > 0) {
        console.log('Investment details:', data.map(inv => ({
          symbol: inv.symbol,
          name: inv.name,
          shares: inv.shares,
          value: inv.total_value
        })));
        setInvestments(data);
      } else {
        console.log('No investments found');
        setInvestments([]);
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load investments';
      console.error('Investment fetch error:', errorMessage);
      setError(errorMessage);
      setInvestments([]);
    } finally {
      setLoading(false);
    }
  }, [user?.username]);

  useEffect(() => {
    fetchInvestments();
  }, [fetchInvestments]);

  const getTotalInvestmentValue = useCallback(() => {
    const total = investments.reduce((sum, investment) => {
      return sum + Number(investment.total_value);
    }, 0);
    
    console.log('Total investment value:', total);
    return total;
  }, [investments]);

  const getDailyChange = useCallback(() => {
    const change = investments.reduce((sum, investment) => {
      return sum + Number(investment.day_change);
    }, 0);
    
    console.log('Daily change:', change);
    return change;
  }, [investments]);

  const getDailyChangePercent = useCallback(() => {
    const totalValue = getTotalInvestmentValue();
    const dailyChange = getDailyChange();
    
    if (totalValue === 0 || dailyChange === 0) return 0;
    
    const changePercent = (dailyChange / (totalValue - dailyChange)) * 100;
    console.log('Daily change percent:', changePercent);
    return changePercent;
  }, [getTotalInvestmentValue, getDailyChange]);

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
    getInvestmentsCount,
  };
}