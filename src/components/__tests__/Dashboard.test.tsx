import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '../../test/utils/test-utils';
import Dashboard from '../Dashboard';
import { mockUser, mockAccount, mockTransaction } from '../../test/utils/test-utils';

// Mock the hooks
vi.mock('../../hooks/useAuth', () => ({
  useAuth: () => ({
    user: mockUser,
  }),
}));

vi.mock('../../hooks/useAccounts', () => ({
  useAccounts: () => ({
    accounts: [mockAccount],
    loading: false,
    getTotalBalance: () => 5000,
    getAccountsCount: () => 1,
    getNetWorth: () => 5000,
  }),
}));

vi.mock('../../hooks/useTransactions', () => ({
  useTransactions: () => ({
    transactions: [mockTransaction],
    loading: false,
    getMonthlyIncome: () => 3000,
    getMonthlyExpenses: () => 2000,
    getTransactionsCount: () => 1,
    getRecentTransactions: () => [mockTransaction],
  }),
}));

// Mock chart components
vi.mock('../CashFlowChart', () => ({
  default: () => <div data-testid="cash-flow-chart">Cash Flow Chart</div>,
}));

vi.mock('../RecentTransactions', () => ({
  default: () => <div data-testid="recent-transactions">Recent Transactions</div>,
}));

vi.mock('../ExpenseBreakdownChart', () => ({
  default: () => <div data-testid="expense-breakdown-chart">Expense Breakdown Chart</div>,
}));

vi.mock('../AccountBalanceChart', () => ({
  default: () => <div data-testid="account-balance-chart">Account Balance Chart</div>,
}));

vi.mock('../MonthlyTrendChart', () => ({
  default: () => <div data-testid="monthly-trend-chart">Monthly Trend Chart</div>,
}));

vi.mock('../InvestmentPerformanceChart', () => ({
  default: () => <div data-testid="investment-performance-chart">Investment Performance Chart</div>,
}));

vi.mock('../SavingsRateChart', () => ({
  default: () => <div data-testid="savings-rate-chart">Savings Rate Chart</div>,
}));

describe('Dashboard', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render dashboard with main sections', async () => {
    render(<Dashboard />);

    await waitFor(() => {
      expect(screen.getByText('Dashboard')).toBeInTheDocument();
    });

    // Check for main sections
    expect(screen.getByText('Account Summary')).toBeInTheDocument();
    expect(screen.getByText('Total Portfolio Value')).toBeInTheDocument();
    expect(screen.getByText('Monthly Income')).toBeInTheDocument();
    expect(screen.getByText('Monthly Expenses')).toBeInTheDocument();
  });

  it('should display correct financial values', async () => {
    render(<Dashboard />);

    await waitFor(() => {
      expect(screen.getByText('$5,000.00')).toBeInTheDocument(); // Total balance
      expect(screen.getByText('$3,000.00')).toBeInTheDocument(); // Monthly income
      expect(screen.getByText('$2,000.00')).toBeInTheDocument(); // Monthly expenses
    });
  });

  it('should render all chart components', async () => {
    render(<Dashboard />);

    await waitFor(() => {
      expect(screen.getByTestId('cash-flow-chart')).toBeInTheDocument();
      expect(screen.getByTestId('recent-transactions')).toBeInTheDocument();
      expect(screen.getByTestId('expense-breakdown-chart')).toBeInTheDocument();
      expect(screen.getByTestId('account-balance-chart')).toBeInTheDocument();
      expect(screen.getByTestId('monthly-trend-chart')).toBeInTheDocument();
      expect(screen.getByTestId('investment-performance-chart')).toBeInTheDocument();
      expect(screen.getByTestId('savings-rate-chart')).toBeInTheDocument();
    });
  });

  it('should display quick action buttons', async () => {
    render(<Dashboard />);

    await waitFor(() => {
      expect(screen.getByText('View Reports')).toBeInTheDocument();
      expect(screen.getByText('Export Data')).toBeInTheDocument();
      expect(screen.getByText('Invest')).toBeInTheDocument();
      expect(screen.getByText('AI Advisor')).toBeInTheDocument();
    });
  });

  it('should show account overview stats', async () => {
    render(<Dashboard />);

    await waitFor(() => {
      expect(screen.getByText('Total Accounts')).toBeInTheDocument();
      expect(screen.getByText('Transactions')).toBeInTheDocument();
      expect(screen.getByText('Net Income')).toBeInTheDocument();
    });
  });

  it('should display credit utilization section', async () => {
    render(<Dashboard />);

    await waitFor(() => {
      expect(screen.getByText('Credit Utilization')).toBeInTheDocument();
      expect(screen.getByText('Utilization Rate')).toBeInTheDocument();
    });
  });

  it('should display savings rate section', async () => {
    render(<Dashboard />);

    await waitFor(() => {
      expect(screen.getByText('Savings Rate')).toBeInTheDocument();
      expect(screen.getByText('Monthly Savings Rate')).toBeInTheDocument();
    });
  });

  it('should show my card section', async () => {
    render(<Dashboard />);

    await waitFor(() => {
      expect(screen.getByText('My Card')).toBeInTheDocument();
      expect(screen.getByText('Available Balance')).toBeInTheDocument();
    });
  });
});