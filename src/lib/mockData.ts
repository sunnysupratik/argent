// Mock data for offline functionality
export interface MockUser {
  id: string;
  username: string;
  password: string;
  full_name: string;
  email: string;
  created_at: string;
}

export interface MockProfile {
  id: string;
  full_name: string;
  user_name: string;
  location: string;
  occupation: string;
  bio: string;
  created_at: string;
}

export interface MockAccount {
  id: string;
  user_name: string;
  account_name: string;
  account_type: string;
  current_balance: number;
  created_at: string;
}

export interface MockTransaction {
  id: string;
  user_name: string;
  description: string;
  amount: number;
  type: string;
  transaction_date: string;
  category: string;
  account_name: string;
  created_at: string;
}

export interface MockInvestment {
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
}

// Mock Users
export const mockUsers: MockUser[] = [
  {
    id: 'demo-id-123',
    username: 'demo',
    password: 'Password123!',
    full_name: 'Alex Johnson',
    email: 'demo@example.com',
    created_at: '2024-01-01T00:00:00Z'
  },
  {
    id: 'testuser-id-456',
    username: 'testuser',
    password: 'TestPass123!',
    full_name: 'Sarah Wilson',
    email: 'testuser@example.com',
    created_at: '2024-01-01T00:00:00Z'
  },
  {
    id: 'johndoe-id-789',
    username: 'johndoe',
    password: 'Demo123!',
    full_name: 'John Doe',
    email: 'john.doe@example.com',
    created_at: '2024-01-01T00:00:00Z'
  }
];

// Mock Profiles
export const mockProfiles: MockProfile[] = [
  {
    id: 'demo-id-123',
    full_name: 'Alex Johnson',
    user_name: 'demo',
    location: 'San Francisco, CA',
    occupation: 'Marketing Manager',
    bio: 'Passionate about financial planning and investment strategies. Always looking for ways to optimize spending and maximize savings.',
    created_at: '2024-01-01T00:00:00Z'
  },
  {
    id: 'testuser-id-456',
    full_name: 'Sarah Wilson',
    user_name: 'testuser',
    location: 'Austin, TX',
    occupation: 'Software Developer',
    bio: 'Tech enthusiast focused on building wealth through smart investments and disciplined budgeting.',
    created_at: '2024-01-01T00:00:00Z'
  },
  {
    id: 'johndoe-id-789',
    full_name: 'John Doe',
    user_name: 'johndoe',
    location: 'New York, NY',
    occupation: 'Financial Consultant',
    bio: 'Experienced investor with a focus on long-term wealth building and diversified portfolio management.',
    created_at: '2024-01-01T00:00:00Z'
  }
];

// Mock Accounts
export const mockAccounts: MockAccount[] = [
  // Demo User (Alex Johnson) - Balanced finances
  {
    id: 'acc-demo-1',
    user_name: 'demo',
    account_name: 'Chase Checking',
    account_type: 'checking',
    current_balance: 8500.00,
    created_at: '2024-01-01T00:00:00Z'
  },
  {
    id: 'acc-demo-2',
    user_name: 'demo',
    account_name: 'Chase Savings',
    account_type: 'savings',
    current_balance: 25000.00,
    created_at: '2024-01-01T00:00:00Z'
  },
  {
    id: 'acc-demo-3',
    user_name: 'demo',
    account_name: 'Fidelity 401k',
    account_type: 'investment',
    current_balance: 85000.00,
    created_at: '2024-01-01T00:00:00Z'
  },
  {
    id: 'acc-demo-4',
    user_name: 'demo',
    account_name: 'Chase Freedom Credit Card',
    account_type: 'credit_card',
    current_balance: -1240.80,
    created_at: '2024-01-01T00:00:00Z'
  },

  // Test User (Sarah Wilson) - Young professional
  {
    id: 'acc-testuser-1',
    user_name: 'testuser',
    account_name: 'Bank of America Checking',
    account_type: 'checking',
    current_balance: 3200.00,
    created_at: '2024-01-01T00:00:00Z'
  },
  {
    id: 'acc-testuser-2',
    user_name: 'testuser',
    account_name: 'Bank of America Savings',
    account_type: 'savings',
    current_balance: 12000.00,
    created_at: '2024-01-01T00:00:00Z'
  },
  {
    id: 'acc-testuser-3',
    user_name: 'testuser',
    account_name: 'Vanguard Roth IRA',
    account_type: 'investment',
    current_balance: 28000.00,
    created_at: '2024-01-01T00:00:00Z'
  },
  {
    id: 'acc-testuser-4',
    user_name: 'testuser',
    account_name: 'Capital One Credit Card',
    account_type: 'credit_card',
    current_balance: -890.50,
    created_at: '2024-01-01T00:00:00Z'
  },

  // John Doe - Experienced investor
  {
    id: 'acc-johndoe-1',
    user_name: 'johndoe',
    account_name: 'Wells Fargo Checking',
    account_type: 'checking',
    current_balance: 12000.00,
    created_at: '2024-01-01T00:00:00Z'
  },
  {
    id: 'acc-johndoe-2',
    user_name: 'johndoe',
    account_name: 'Wells Fargo Savings',
    account_type: 'savings',
    current_balance: 45000.00,
    created_at: '2024-01-01T00:00:00Z'
  },
  {
    id: 'acc-johndoe-3',
    user_name: 'johndoe',
    account_name: 'Charles Schwab Brokerage',
    account_type: 'investment',
    current_balance: 150000.00,
    created_at: '2024-01-01T00:00:00Z'
  },
  {
    id: 'acc-johndoe-4',
    user_name: 'johndoe',
    account_name: 'American Express Gold',
    account_type: 'credit_card',
    current_balance: -2100.00,
    created_at: '2024-01-01T00:00:00Z'
  }
];

// Mock Transactions - Comprehensive transaction history for cash flow
export const mockTransactions: MockTransaction[] = [
  // Demo User Transactions (December 2024)
  {
    id: 'txn-demo-1',
    user_name: 'demo',
    description: 'Salary Deposit',
    amount: 6500.00,
    type: 'income',
    transaction_date: '2024-12-01T00:00:00Z',
    category: 'Salary',
    account_name: 'Chase Checking',
    created_at: '2024-12-01T00:00:00Z'
  },
  {
    id: 'txn-demo-2',
    user_name: 'demo',
    description: 'Grocery Store',
    amount: 125.50,
    type: 'expense',
    transaction_date: '2024-12-02T00:00:00Z',
    category: 'Food & Dining',
    account_name: 'Chase Checking',
    created_at: '2024-12-02T00:00:00Z'
  },
  {
    id: 'txn-demo-3',
    user_name: 'demo',
    description: 'Gas Station',
    amount: 65.00,
    type: 'expense',
    transaction_date: '2024-12-03T00:00:00Z',
    category: 'Transportation',
    account_name: 'Chase Checking',
    created_at: '2024-12-03T00:00:00Z'
  },
  {
    id: 'txn-demo-4',
    user_name: 'demo',
    description: 'Netflix Subscription',
    amount: 15.99,
    type: 'expense',
    transaction_date: '2024-12-04T00:00:00Z',
    category: 'Entertainment',
    account_name: 'Chase Checking',
    created_at: '2024-12-04T00:00:00Z'
  },
  {
    id: 'txn-demo-5',
    user_name: 'demo',
    description: 'Investment Transfer',
    amount: 1000.00,
    type: 'expense',
    transaction_date: '2024-12-05T00:00:00Z',
    category: 'Investment',
    account_name: 'Chase Checking',
    created_at: '2024-12-05T00:00:00Z'
  },
  {
    id: 'txn-demo-6',
    user_name: 'demo',
    description: 'Rent Payment',
    amount: 2200.00,
    type: 'expense',
    transaction_date: '2024-12-01T00:00:00Z',
    category: 'Housing',
    account_name: 'Chase Checking',
    created_at: '2024-12-01T00:00:00Z'
  },
  {
    id: 'txn-demo-7',
    user_name: 'demo',
    description: 'Electricity Bill',
    amount: 120.00,
    type: 'expense',
    transaction_date: '2024-12-06T00:00:00Z',
    category: 'Utilities',
    account_name: 'Chase Checking',
    created_at: '2024-12-06T00:00:00Z'
  },
  {
    id: 'txn-demo-8',
    user_name: 'demo',
    description: 'Restaurant Dinner',
    amount: 85.00,
    type: 'expense',
    transaction_date: '2024-12-07T00:00:00Z',
    category: 'Food & Dining',
    account_name: 'Chase Checking',
    created_at: '2024-12-07T00:00:00Z'
  },
  {
    id: 'txn-demo-9',
    user_name: 'demo',
    description: 'Online Shopping',
    amount: 150.00,
    type: 'expense',
    transaction_date: '2024-12-08T00:00:00Z',
    category: 'Shopping',
    account_name: 'Chase Checking',
    created_at: '2024-12-08T00:00:00Z'
  },
  {
    id: 'txn-demo-10',
    user_name: 'demo',
    description: 'Gym Membership',
    amount: 50.00,
    type: 'expense',
    transaction_date: '2024-12-09T00:00:00Z',
    category: 'Health & Fitness',
    account_name: 'Chase Checking',
    created_at: '2024-12-09T00:00:00Z'
  },

  // Demo User November transactions
  {
    id: 'txn-demo-11',
    user_name: 'demo',
    description: 'Salary Deposit',
    amount: 6500.00,
    type: 'income',
    transaction_date: '2024-11-01T00:00:00Z',
    category: 'Salary',
    account_name: 'Chase Checking',
    created_at: '2024-11-01T00:00:00Z'
  },
  {
    id: 'txn-demo-12',
    user_name: 'demo',
    description: 'Freelance Project',
    amount: 1200.00,
    type: 'income',
    transaction_date: '2024-11-15T00:00:00Z',
    category: 'Freelance',
    account_name: 'Chase Checking',
    created_at: '2024-11-15T00:00:00Z'
  },
  {
    id: 'txn-demo-13',
    user_name: 'demo',
    description: 'Grocery Store',
    amount: 110.00,
    type: 'expense',
    transaction_date: '2024-11-02T00:00:00Z',
    category: 'Food & Dining',
    account_name: 'Chase Checking',
    created_at: '2024-11-02T00:00:00Z'
  },
  {
    id: 'txn-demo-14',
    user_name: 'demo',
    description: 'Rent Payment',
    amount: 2200.00,
    type: 'expense',
    transaction_date: '2024-11-01T00:00:00Z',
    category: 'Housing',
    account_name: 'Chase Checking',
    created_at: '2024-11-01T00:00:00Z'
  },

  // Demo User October transactions
  {
    id: 'txn-demo-15',
    user_name: 'demo',
    description: 'Salary Deposit',
    amount: 6500.00,
    type: 'income',
    transaction_date: '2024-10-01T00:00:00Z',
    category: 'Salary',
    account_name: 'Chase Checking',
    created_at: '2024-10-01T00:00:00Z'
  },
  {
    id: 'txn-demo-16',
    user_name: 'demo',
    description: 'Rent Payment',
    amount: 2200.00,
    type: 'expense',
    transaction_date: '2024-10-01T00:00:00Z',
    category: 'Housing',
    account_name: 'Chase Checking',
    created_at: '2024-10-01T00:00:00Z'
  },
  {
    id: 'txn-demo-17',
    user_name: 'demo',
    description: 'Groceries',
    amount: 95.00,
    type: 'expense',
    transaction_date: '2024-10-05T00:00:00Z',
    category: 'Food & Dining',
    account_name: 'Chase Checking',
    created_at: '2024-10-05T00:00:00Z'
  },

  // Demo User September transactions
  {
    id: 'txn-demo-18',
    user_name: 'demo',
    description: 'Salary Deposit',
    amount: 6500.00,
    type: 'income',
    transaction_date: '2024-09-01T00:00:00Z',
    category: 'Salary',
    account_name: 'Chase Checking',
    created_at: '2024-09-01T00:00:00Z'
  },
  {
    id: 'txn-demo-19',
    user_name: 'demo',
    description: 'Rent Payment',
    amount: 2200.00,
    type: 'expense',
    transaction_date: '2024-09-01T00:00:00Z',
    category: 'Housing',
    account_name: 'Chase Checking',
    created_at: '2024-09-01T00:00:00Z'
  },

  // Demo User August transactions
  {
    id: 'txn-demo-20',
    user_name: 'demo',
    description: 'Salary Deposit',
    amount: 6500.00,
    type: 'income',
    transaction_date: '2024-08-01T00:00:00Z',
    category: 'Salary',
    account_name: 'Chase Checking',
    created_at: '2024-08-01T00:00:00Z'
  },
  {
    id: 'txn-demo-21',
    user_name: 'demo',
    description: 'Rent Payment',
    amount: 2200.00,
    type: 'expense',
    transaction_date: '2024-08-01T00:00:00Z',
    category: 'Housing',
    account_name: 'Chase Checking',
    created_at: '2024-08-01T00:00:00Z'
  },

  // Demo User July transactions
  {
    id: 'txn-demo-22',
    user_name: 'demo',
    description: 'Salary Deposit',
    amount: 6500.00,
    type: 'income',
    transaction_date: '2024-07-01T00:00:00Z',
    category: 'Salary',
    account_name: 'Chase Checking',
    created_at: '2024-07-01T00:00:00Z'
  },
  {
    id: 'txn-demo-23',
    user_name: 'demo',
    description: 'Rent Payment',
    amount: 2200.00,
    type: 'expense',
    transaction_date: '2024-07-01T00:00:00Z',
    category: 'Housing',
    account_name: 'Chase Checking',
    created_at: '2024-07-01T00:00:00Z'
  },

  // Test User Transactions (December 2024)
  {
    id: 'txn-testuser-1',
    user_name: 'testuser',
    description: 'Salary Deposit',
    amount: 4200.00,
    type: 'income',
    transaction_date: '2024-12-01T00:00:00Z',
    category: 'Salary',
    account_name: 'Bank of America Checking',
    created_at: '2024-12-01T00:00:00Z'
  },
  {
    id: 'txn-testuser-2',
    user_name: 'testuser',
    description: 'Grocery Store',
    amount: 95.00,
    type: 'expense',
    transaction_date: '2024-12-02T00:00:00Z',
    category: 'Food & Dining',
    account_name: 'Bank of America Checking',
    created_at: '2024-12-02T00:00:00Z'
  },
  {
    id: 'txn-testuser-3',
    user_name: 'testuser',
    description: 'Gas Station',
    amount: 45.00,
    type: 'expense',
    transaction_date: '2024-12-03T00:00:00Z',
    category: 'Transportation',
    account_name: 'Bank of America Checking',
    created_at: '2024-12-03T00:00:00Z'
  },
  {
    id: 'txn-testuser-4',
    user_name: 'testuser',
    description: 'Spotify Premium',
    amount: 9.99,
    type: 'expense',
    transaction_date: '2024-12-04T00:00:00Z',
    category: 'Entertainment',
    account_name: 'Bank of America Checking',
    created_at: '2024-12-04T00:00:00Z'
  },
  {
    id: 'txn-testuser-5',
    user_name: 'testuser',
    description: 'Rent Payment',
    amount: 1800.00,
    type: 'expense',
    transaction_date: '2024-12-01T00:00:00Z',
    category: 'Housing',
    account_name: 'Bank of America Checking',
    created_at: '2024-12-01T00:00:00Z'
  },
  {
    id: 'txn-testuser-6',
    user_name: 'testuser',
    description: 'Investment Contribution',
    amount: 500.00,
    type: 'expense',
    transaction_date: '2024-12-08T00:00:00Z',
    category: 'Investment',
    account_name: 'Bank of America Checking',
    created_at: '2024-12-08T00:00:00Z'
  },

  // Test User November transactions
  {
    id: 'txn-testuser-7',
    user_name: 'testuser',
    description: 'Salary Deposit',
    amount: 4200.00,
    type: 'income',
    transaction_date: '2024-11-01T00:00:00Z',
    category: 'Salary',
    account_name: 'Bank of America Checking',
    created_at: '2024-11-01T00:00:00Z'
  },
  {
    id: 'txn-testuser-8',
    user_name: 'testuser',
    description: 'Side Hustle',
    amount: 300.00,
    type: 'income',
    transaction_date: '2024-11-20T00:00:00Z',
    category: 'Freelance',
    account_name: 'Bank of America Checking',
    created_at: '2024-11-20T00:00:00Z'
  },
  {
    id: 'txn-testuser-9',
    user_name: 'testuser',
    description: 'Rent Payment',
    amount: 1800.00,
    type: 'expense',
    transaction_date: '2024-11-01T00:00:00Z',
    category: 'Housing',
    account_name: 'Bank of America Checking',
    created_at: '2024-11-01T00:00:00Z'
  },

  // John Doe Transactions (December 2024)
  {
    id: 'txn-johndoe-1',
    user_name: 'johndoe',
    description: 'Salary Deposit',
    amount: 8500.00,
    type: 'income',
    transaction_date: '2024-12-01T00:00:00Z',
    category: 'Salary',
    account_name: 'Wells Fargo Checking',
    created_at: '2024-12-01T00:00:00Z'
  },
  {
    id: 'txn-johndoe-2',
    user_name: 'johndoe',
    description: 'Dividend Payment',
    amount: 450.00,
    type: 'income',
    transaction_date: '2024-12-15T00:00:00Z',
    category: 'Investment',
    account_name: 'Wells Fargo Checking',
    created_at: '2024-12-15T00:00:00Z'
  },
  {
    id: 'txn-johndoe-3',
    user_name: 'johndoe',
    description: 'Grocery Store',
    amount: 180.00,
    type: 'expense',
    transaction_date: '2024-12-02T00:00:00Z',
    category: 'Food & Dining',
    account_name: 'Wells Fargo Checking',
    created_at: '2024-12-02T00:00:00Z'
  },
  {
    id: 'txn-johndoe-4',
    user_name: 'johndoe',
    description: 'Mortgage Payment',
    amount: 3200.00,
    type: 'expense',
    transaction_date: '2024-12-01T00:00:00Z',
    category: 'Housing',
    account_name: 'Wells Fargo Checking',
    created_at: '2024-12-01T00:00:00Z'
  },
  {
    id: 'txn-johndoe-5',
    user_name: 'johndoe',
    description: 'Investment Purchase',
    amount: 2000.00,
    type: 'expense',
    transaction_date: '2024-12-07T00:00:00Z',
    category: 'Investment',
    account_name: 'Wells Fargo Checking',
    created_at: '2024-12-07T00:00:00Z'
  },

  // John Doe November transactions
  {
    id: 'txn-johndoe-6',
    user_name: 'johndoe',
    description: 'Salary Deposit',
    amount: 8500.00,
    type: 'income',
    transaction_date: '2024-11-01T00:00:00Z',
    category: 'Salary',
    account_name: 'Wells Fargo Checking',
    created_at: '2024-11-01T00:00:00Z'
  },
  {
    id: 'txn-johndoe-7',
    user_name: 'johndoe',
    description: 'Consulting Fee',
    amount: 2500.00,
    type: 'income',
    transaction_date: '2024-11-25T00:00:00Z',
    category: 'Freelance',
    account_name: 'Wells Fargo Checking',
    created_at: '2024-11-25T00:00:00Z'
  },
  {
    id: 'txn-johndoe-8',
    user_name: 'johndoe',
    description: 'Mortgage Payment',
    amount: 3200.00,
    type: 'expense',
    transaction_date: '2024-11-01T00:00:00Z',
    category: 'Housing',
    account_name: 'Wells Fargo Checking',
    created_at: '2024-11-01T00:00:00Z'
  }
];

// Mock Investments
export const mockInvestments: MockInvestment[] = [
  // Demo User Portfolio
  {
    id: 'inv-demo-1',
    user_name: 'demo',
    symbol: 'AAPL',
    name: 'Apple Inc.',
    shares: 50.00,
    current_price: 195.89,
    total_value: 9794.50,
    day_change: 2.45,
    day_change_percent: 1.27,
    sector: 'Technology',
    market_cap: 'Large Cap',
    pe: 29.8,
    dividend: 0.96,
    rating: 'Buy',
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-12-29T00:00:00Z'
  },
  {
    id: 'inv-demo-2',
    user_name: 'demo',
    symbol: 'MSFT',
    name: 'Microsoft Corporation',
    shares: 25.00,
    current_price: 378.85,
    total_value: 9471.25,
    day_change: -1.23,
    day_change_percent: -0.32,
    sector: 'Technology',
    market_cap: 'Large Cap',
    pe: 32.1,
    dividend: 3.00,
    rating: 'Buy',
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-12-29T00:00:00Z'
  },
  {
    id: 'inv-demo-3',
    user_name: 'demo',
    symbol: 'GOOGL',
    name: 'Alphabet Inc.',
    shares: 15.00,
    current_price: 141.80,
    total_value: 2127.00,
    day_change: 0.85,
    day_change_percent: 0.60,
    sector: 'Technology',
    market_cap: 'Large Cap',
    pe: 25.4,
    dividend: 0.00,
    rating: 'Hold',
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-12-29T00:00:00Z'
  },

  // Test User Portfolio
  {
    id: 'inv-testuser-1',
    user_name: 'testuser',
    symbol: 'AAPL',
    name: 'Apple Inc.',
    shares: 25.00,
    current_price: 195.89,
    total_value: 4897.25,
    day_change: 2.45,
    day_change_percent: 1.27,
    sector: 'Technology',
    market_cap: 'Large Cap',
    pe: 29.8,
    dividend: 0.96,
    rating: 'Buy',
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-12-29T00:00:00Z'
  },
  {
    id: 'inv-testuser-2',
    user_name: 'testuser',
    symbol: 'MSFT',
    name: 'Microsoft Corporation',
    shares: 15.00,
    current_price: 378.85,
    total_value: 5682.75,
    day_change: -1.23,
    day_change_percent: -0.32,
    sector: 'Technology',
    market_cap: 'Large Cap',
    pe: 32.1,
    dividend: 3.00,
    rating: 'Buy',
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-12-29T00:00:00Z'
  },

  // John Doe Portfolio
  {
    id: 'inv-johndoe-1',
    user_name: 'johndoe',
    symbol: 'AAPL',
    name: 'Apple Inc.',
    shares: 100.00,
    current_price: 195.89,
    total_value: 19589.00,
    day_change: 2.45,
    day_change_percent: 1.27,
    sector: 'Technology',
    market_cap: 'Large Cap',
    pe: 29.8,
    dividend: 0.96,
    rating: 'Buy',
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-12-29T00:00:00Z'
  },
  {
    id: 'inv-johndoe-2',
    user_name: 'johndoe',
    symbol: 'MSFT',
    name: 'Microsoft Corporation',
    shares: 75.00,
    current_price: 378.85,
    total_value: 28413.75,
    day_change: -1.23,
    day_change_percent: -0.32,
    sector: 'Technology',
    market_cap: 'Large Cap',
    pe: 32.1,
    dividend: 3.00,
    rating: 'Buy',
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-12-29T00:00:00Z'
  }
];

// Mock data access functions
export const getMockUserByCredentials = (username: string, password: string): MockUser | null => {
  return mockUsers.find(user => user.username === username && user.password === password) || null;
};

export const getMockProfileByUsername = (username: string): MockProfile | null => {
  return mockProfiles.find(profile => profile.user_name === username) || null;
};

export const getMockAccountsByUsername = (username: string): MockAccount[] => {
  return mockAccounts.filter(account => account.user_name === username);
};

export const getMockTransactionsByUsername = (username: string): MockTransaction[] => {
  return mockTransactions.filter(transaction => transaction.user_name === username);
};

export const getMockInvestmentsByUsername = (username: string): MockInvestment[] => {
  return mockInvestments.filter(investment => investment.user_name === username);
};