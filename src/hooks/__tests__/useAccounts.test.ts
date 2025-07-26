import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { useAccounts } from '../useAccounts';
import { supabase } from '../../lib/supabase';
import { mockAccount, mockUser } from '../../test/utils/test-utils';

// Mock the auth hook
vi.mock('../useAuth', () => ({
  useAuth: () => ({
    user: mockUser,
  }),
}));

// Mock supabase
vi.mock('../../lib/supabase', () => ({
  supabase: {
    from: vi.fn(() => ({
      select: vi.fn(() => ({
        eq: vi.fn(() => ({
          order: vi.fn(() => Promise.resolve({ data: [], error: null })),
        })),
      })),
    })),
  },
}));

describe('useAccounts', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should fetch accounts successfully', async () => {
    const mockAccounts = [
      { ...mockAccount, account_name: 'Checking Account', account_type: 'checking', current_balance: 5000 },
      { ...mockAccount, id: 'account-2', account_name: 'Savings Account', account_type: 'savings', current_balance: 10000 },
    ];

    const mockSupabaseChain = {
      select: vi.fn(() => ({
        eq: vi.fn(() => ({
          order: vi.fn(() => Promise.resolve({ data: mockAccounts, error: null })),
        })),
      })),
    };

    vi.mocked(supabase.from).mockReturnValue(mockSupabaseChain as any);

    const { result } = renderHook(() => useAccounts());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.accounts).toHaveLength(2);
    expect(result.current.accounts[0].account_name).toBe('Checking Account');
    expect(result.current.error).toBeNull();
  });

  it('should handle fetch error', async () => {
    const mockError = { message: 'Database connection failed' };

    const mockSupabaseChain = {
      select: vi.fn(() => ({
        eq: vi.fn(() => ({
          order: vi.fn(() => Promise.resolve({ data: null, error: mockError })),
        })),
      })),
    };

    vi.mocked(supabase.from).mockReturnValue(mockSupabaseChain as any);

    const { result } = renderHook(() => useAccounts());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.accounts).toHaveLength(0);
    expect(result.current.error).toBe('Database connection failed');
  });

  it('should calculate total balance correctly', async () => {
    const mockAccounts = [
      { ...mockAccount, current_balance: 5000 },
      { ...mockAccount, id: 'account-2', current_balance: 10000 },
      { ...mockAccount, id: 'account-3', current_balance: 2500 },
    ];

    const mockSupabaseChain = {
      select: vi.fn(() => ({
        eq: vi.fn(() => ({
          order: vi.fn(() => Promise.resolve({ data: mockAccounts, error: null })),
        })),
      })),
    };

    vi.mocked(supabase.from).mockReturnValue(mockSupabaseChain as any);

    const { result } = renderHook(() => useAccounts());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.getTotalBalance()).toBe(17500);
  });

  it('should filter accounts by type', async () => {
    const mockAccounts = [
      { ...mockAccount, account_type: 'checking', current_balance: 5000 },
      { ...mockAccount, id: 'account-2', account_type: 'savings', current_balance: 10000 },
      { ...mockAccount, id: 'account-3', account_type: 'checking', current_balance: 2500 },
    ];

    const mockSupabaseChain = {
      select: vi.fn(() => ({
        eq: vi.fn(() => ({
          order: vi.fn(() => Promise.resolve({ data: mockAccounts, error: null })),
        })),
      })),
    };

    vi.mocked(supabase.from).mockReturnValue(mockSupabaseChain as any);

    const { result } = renderHook(() => useAccounts());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    const checkingAccounts = result.current.getAccountsByType('checking');
    expect(checkingAccounts).toHaveLength(2);
    
    const savingsAccounts = result.current.getAccountsByType('savings');
    expect(savingsAccounts).toHaveLength(1);
  });

  it('should return correct accounts count', async () => {
    const mockAccounts = [
      { ...mockAccount },
      { ...mockAccount, id: 'account-2' },
      { ...mockAccount, id: 'account-3' },
    ];

    const mockSupabaseChain = {
      select: vi.fn(() => ({
        eq: vi.fn(() => ({
          order: vi.fn(() => Promise.resolve({ data: mockAccounts, error: null })),
        })),
      })),
    };

    vi.mocked(supabase.from).mockReturnValue(mockSupabaseChain as any);

    const { result } = renderHook(() => useAccounts());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.getAccountsCount()).toBe(3);
  });

  it('should calculate net worth correctly', async () => {
    const mockAccounts = [
      { ...mockAccount, current_balance: 5000 },
      { ...mockAccount, id: 'account-2', current_balance: -1000 }, // Credit card debt
      { ...mockAccount, id: 'account-3', current_balance: 15000 },
    ];

    const mockSupabaseChain = {
      select: vi.fn(() => ({
        eq: vi.fn(() => ({
          order: vi.fn(() => Promise.resolve({ data: mockAccounts, error: null })),
        })),
      })),
    };

    vi.mocked(supabase.from).mockReturnValue(mockSupabaseChain as any);

    const { result } = renderHook(() => useAccounts());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.getNetWorth()).toBe(19000);
  });

  it('should handle empty accounts array', async () => {
    const mockSupabaseChain = {
      select: vi.fn(() => ({
        eq: vi.fn(() => ({
          order: vi.fn(() => Promise.resolve({ data: [], error: null })),
        })),
      })),
    };

    vi.mocked(supabase.from).mockReturnValue(mockSupabaseChain as any);

    const { result } = renderHook(() => useAccounts());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.accounts).toHaveLength(0);
    expect(result.current.getTotalBalance()).toBe(0);
    expect(result.current.getAccountsCount()).toBe(0);
    expect(result.current.getNetWorth()).toBe(0);
  });
});