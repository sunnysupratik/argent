import { useState, useEffect, useCallback } from 'react';
import { supabase, Investment } from '../lib/supabase';
import { useAuth } from './useAuth';

export function useInvestments() {
  const [investments, setInvestments] = useState<Investment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

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
      
      // Try to fetch from direct_investments first
      const { data: directInvestments, error: directError } = await supabase
        .from('direct_investments')
        .select('*')
        .eq('user_name', user.username);
      
      if (!directError && directInvestments && directInvestments.length > 0) {
        console.log('useInvestments.fetchInvestments - Found', directInvestments.length, 'investments in direct_investments');
        setInvestments(directInvestments);
        setLoading(false);
        return;
      }
      
      // Fall back to original investments table if it exists
      const { data, error } = await supabase
        .from('investments')
        .select('*')
        .eq('user_name', user.username);

      if (error) {
        console.error('useInvestments.fetchInvestments - Database error:', error);
        throw error;
      }
      
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
  }, [user?.username]);

  useEffect(() => {
    if (user?.username) {
      fetchInvestments();
    } else {
      console.log('useInvestments - No user, clearing investments');
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
    const totalChange = investments.reduce((sum, investment) => {
      return sum + Number(investment.day_change) * Number(investment.shares);
    }, 0);
    
    console.log('useInvestments.getDailyChange - Calculated daily change:', totalChange);
    return totalChange;
  }, [investments]);

  const getDailyChangePercent = useCallback(() => {
    const totalValue = getTotalInvestmentValue();
    const totalChange = getDailyChange();
    
    if (totalValue === 0) return 0;
    
    const changePercent = (totalChange / (totalValue - totalChange)) * 100;
    console.log('useInvestments.getDailyChangePercent - Calculated daily change percent:', changePercent);
    return changePercent;
  }, [getTotalInvestmentValue, getDailyChange]);

  const getInvestmentsBySymbol = useCallback((symbol: string) => {
    const filtered = investments.filter(investment => 
      investment.symbol.toLowerCase() === symbol.toLowerCase()
    );
    console.log('useInvestments.getInvestmentsBySymbol - Found', filtered.length, 'investments for symbol', symbol);
    return filtered;
  }, [investments]);

  const getInvestmentsBySector = useCallback((sector: string) => {
    const filtered = investments.filter(investment => 
      investment.sector?.toLowerCase().includes(sector.toLowerCase())
    );
    console.log('useInvestments.getInvestmentsBySector - Found', filtered.length, 'investments in sector', sector);
    return filtered;
  }, [investments]);

  const getSectorAllocation = useCallback(() => {
    const sectorTotals: { [key: string]: number } = {};
    const totalValue = getTotalInvestmentValue();
    
    investments.forEach(investment => {
      const sector = investment.sector || 'Other';
      sectorTotals[sector] = (sectorTotals[sector] || 0) + Number(investment.total_value);
    });
    
    const result = Object.entries(sectorTotals)
      .map(([name, value]) => ({ 
        name, 
        value, 
        percentage: totalValue > 0 ? (value / totalValue) * 100 : 0 
      }))
      .sort((a, b) => b.value - a.value);
    
    console.log('useInvestments.getSectorAllocation - Sector allocation:', result);
    return result;
  }, [investments, getTotalInvestmentValue]);

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
    getSectorAllocation,
  };
}