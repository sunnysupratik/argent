import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '../../test/utils/test-utils';
import Transactions from '../Transactions';
import { mockTransaction, mockUser } from '../../test/utils/test-utils';
import userEvent from '@testing-library/user-event';

// Mock the hooks
vi.mock('../../hooks/useTransactions', () => ({
  useTransactions: () => ({
    transactions: [
      mockTransaction,
      {
        ...mockTransaction,
        id: 'transaction-2',
        description: 'Salary Payment',
        amount: 5000,
        type: 'income',
        category: { name: 'Salary' },
      },
    ],
    loading: false,
    error: null,
    refetch: vi.fn(),
  }),
}));

describe('Transactions', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render transactions page with header', async () => {
    render(<Transactions />);

    await waitFor(() => {
      expect(screen.getByText('Transactions')).toBeInTheDocument();
      expect(screen.getByText('Manage and track all your financial transactions')).toBeInTheDocument();
    });
  });

  it('should display search and filter controls', async () => {
    render(<Transactions />);

    await waitFor(() => {
      expect(screen.getByPlaceholderText('Search transactions, categories, or amounts...')).toBeInTheDocument();
      expect(screen.getByDisplayValue('All Types')).toBeInTheDocument();
      expect(screen.getByDisplayValue('Sort by Date')).toBeInTheDocument();
    });
  });

  it('should show transaction statistics', async () => {
    render(<Transactions />);

    await waitFor(() => {
      expect(screen.getByText('Total')).toBeInTheDocument();
      expect(screen.getByText('Income')).toBeInTheDocument();
      expect(screen.getByText('Expenses')).toBeInTheDocument();
      expect(screen.getByText('This Month')).toBeInTheDocument();
    });
  });

  it('should display transactions in the list', async () => {
    render(<Transactions />);

    await waitFor(() => {
      expect(screen.getByText('Test Transaction')).toBeInTheDocument();
      expect(screen.getByText('Salary Payment')).toBeInTheDocument();
      expect(screen.getByText('Food')).toBeInTheDocument();
      expect(screen.getByText('Salary')).toBeInTheDocument();
    });
  });

  it('should filter transactions by search term', async () => {
    const user = userEvent.setup();
    render(<Transactions />);

    const searchInput = screen.getByPlaceholderText('Search transactions, categories, or amounts...');
    
    await user.type(searchInput, 'Salary');

    await waitFor(() => {
      expect(screen.getByText('Salary Payment')).toBeInTheDocument();
      expect(screen.queryByText('Test Transaction')).not.toBeInTheDocument();
    });
  });

  it('should filter transactions by type', async () => {
    const user = userEvent.setup();
    render(<Transactions />);

    const typeFilter = screen.getByDisplayValue('All Types');
    
    await user.selectOptions(typeFilter, 'income');

    await waitFor(() => {
      expect(screen.getByText('Salary Payment')).toBeInTheDocument();
      expect(screen.queryByText('Test Transaction')).not.toBeInTheDocument();
    });
  });

  it('should show action buttons', async () => {
    render(<Transactions />);

    await waitFor(() => {
      expect(screen.getByText('Refresh')).toBeInTheDocument();
      expect(screen.getByText('Export')).toBeInTheDocument();
      expect(screen.getByText('New Transaction')).toBeInTheDocument();
    });
  });

  it('should display net total calculation', async () => {
    render(<Transactions />);

    await waitFor(() => {
      expect(screen.getByText('Net Total')).toBeInTheDocument();
      // Should show $4,900.00 (5000 income - 100 expense)
      expect(screen.getByText('$4900.00')).toBeInTheDocument();
    });
  });

  it('should show transaction count', async () => {
    render(<Transactions />);

    await waitFor(() => {
      expect(screen.getByText('Showing 2 of 2 transactions')).toBeInTheDocument();
    });
  });

  it('should handle empty state', async () => {
    // Mock empty transactions
    vi.doMock('../../hooks/useTransactions', () => ({
      useTransactions: () => ({
        transactions: [],
        loading: false,
        error: null,
        refetch: vi.fn(),
      }),
    }));

    render(<Transactions />);

    await waitFor(() => {
      expect(screen.getByText('No transactions found')).toBeInTheDocument();
      expect(screen.getByText('Add your first transaction to get started')).toBeInTheDocument();
    });
  });
});