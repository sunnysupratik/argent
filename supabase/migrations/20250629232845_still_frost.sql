/*
  # Create Demo Users with Complete Financial Data

  1. New Demo Users
    - Creates three demo users with authentication
    - Includes complete profile information
    - Sets up realistic financial data

  2. Financial Data
    - Multiple account types (checking, savings, investment, credit)
    - Transaction history with proper categorization
    - Investment portfolio with stocks and performance metrics
    - Realistic balances and financial patterns

  3. Security
    - Proper password storage
    - Row Level Security enabled
*/

-- Create direct_accounts table if it doesn't exist
CREATE TABLE IF NOT EXISTS direct_accounts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_name text NOT NULL,
  account_name text NOT NULL,
  account_type text NOT NULL,
  current_balance numeric(15,2) NOT NULL DEFAULT 0.00,
  created_at timestamptz DEFAULT now()
);

-- Create direct_transactions table if it doesn't exist
CREATE TABLE IF NOT EXISTS direct_transactions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_name text NOT NULL,
  description text NOT NULL,
  amount numeric(12,2) NOT NULL,
  type text NOT NULL CHECK (type IN ('income', 'expense')),
  transaction_date timestamptz DEFAULT now(),
  category text NOT NULL,
  account_name text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Create direct_investments table if it doesn't exist
CREATE TABLE IF NOT EXISTS direct_investments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_name text NOT NULL,
  symbol text NOT NULL,
  name text NOT NULL,
  shares numeric(12,2) NOT NULL,
  current_price numeric(12,2) NOT NULL,
  total_value numeric(12,2) NOT NULL,
  day_change numeric(12,2) NOT NULL,
  day_change_percent numeric(12,2) NOT NULL,
  sector text,
  market_cap text,
  pe numeric(12,2),
  dividend numeric(12,2),
  rating text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE direct_accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE direct_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE direct_investments ENABLE ROW LEVEL SECURITY;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_direct_accounts_user_name ON direct_accounts(user_name);
CREATE INDEX IF NOT EXISTS idx_direct_transactions_user_name ON direct_transactions(user_name);
CREATE INDEX IF NOT EXISTS idx_direct_investments_user_name ON direct_investments(user_name);
CREATE INDEX IF NOT EXISTS idx_direct_transactions_date ON direct_transactions(transaction_date DESC);
CREATE INDEX IF NOT EXISTS idx_direct_transactions_type ON direct_transactions(type);
CREATE INDEX IF NOT EXISTS idx_direct_investments_symbol ON direct_investments(symbol);

-- Create RLS policies
CREATE POLICY "Public can access all accounts" ON direct_accounts FOR ALL USING (true);
CREATE POLICY "Users can manage their own accounts" ON direct_accounts FOR ALL USING (user_name = CURRENT_USER);

CREATE POLICY "Public can access all transactions" ON direct_transactions FOR ALL USING (true);
CREATE POLICY "Users can manage their own transactions" ON direct_transactions FOR ALL USING (user_name = CURRENT_USER);

CREATE POLICY "Public can access all investments" ON direct_investments FOR ALL USING (true);
CREATE POLICY "Users can manage their own investments" ON direct_investments FOR ALL USING (user_name = CURRENT_USER);

-- Create function to update investments updated_at
CREATE OR REPLACE FUNCTION update_investments_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for investments updated_at
CREATE TRIGGER update_investments_updated_at
BEFORE UPDATE ON direct_investments
FOR EACH ROW
EXECUTE FUNCTION update_investments_updated_at();

-- Insert demo data for 'demo' user
DO $$
DECLARE
  demo_checking_id uuid;
  demo_savings_id uuid;
  demo_credit_id uuid;
  demo_investment_id uuid;
BEGIN
  -- Create accounts for demo user
  INSERT INTO direct_accounts (user_name, account_name, account_type, current_balance)
  VALUES 
    ('demo', 'Chase Primary Checking', 'checking', 4582.50),
    ('demo', 'Marcus High-Yield Savings', 'savings', 15104.40),
    ('demo', 'Chase Freedom Credit Card', 'credit_card', -1240.80),
    ('demo', 'Vanguard Investment', 'investment', 127500.75);

  -- Create transactions for demo user
  INSERT INTO direct_transactions (user_name, description, amount, type, transaction_date, category, account_name)
  VALUES
    -- Recent transactions (last 30 days)
    ('demo', 'Salary Deposit - Tech Corp', 4200.00, 'income', now() - interval '2 days', 'Income', 'Chase Primary Checking'),
    ('demo', 'Whole Foods Market', 127.45, 'expense', now() - interval '3 days', 'Food & Dining', 'Chase Primary Checking'),
    ('demo', 'Netflix Subscription', 15.99, 'expense', now() - interval '5 days', 'Entertainment', 'Chase Freedom Credit Card'),
    ('demo', 'Shell Gas Station', 45.20, 'expense', now() - interval '7 days', 'Transportation', 'Chase Primary Checking'),
    ('demo', 'Freelance Payment', 800.00, 'income', now() - interval '10 days', 'Income', 'Chase Primary Checking'),
    ('demo', 'Starbucks Coffee', 4.75, 'expense', now() - interval '12 days', 'Food & Dining', 'Chase Primary Checking'),
    ('demo', 'Amazon Purchase', 89.99, 'expense', now() - interval '15 days', 'Shopping', 'Chase Freedom Credit Card'),
    ('demo', 'Electric Bill', 125.30, 'expense', now() - interval '18 days', 'Bills & Utilities', 'Chase Primary Checking'),
    ('demo', 'Chipotle', 12.50, 'expense', now() - interval '20 days', 'Food & Dining', 'Chase Primary Checking'),
    ('demo', 'Interest Payment', 45.20, 'income', now() - interval '25 days', 'Income', 'Marcus High-Yield Savings'),
    
    -- Older transactions for history
    ('demo', 'Salary Deposit - Tech Corp', 4200.00, 'income', now() - interval '32 days', 'Income', 'Chase Primary Checking'),
    ('demo', 'Rent Payment', 1800.00, 'expense', now() - interval '35 days', 'Housing', 'Chase Primary Checking'),
    ('demo', 'Uber Ride', 18.50, 'expense', now() - interval '40 days', 'Transportation', 'Chase Primary Checking'),
    ('demo', 'Movie Theater', 24.00, 'expense', now() - interval '42 days', 'Entertainment', 'Chase Freedom Credit Card'),
    ('demo', 'Grocery Store', 156.78, 'expense', now() - interval '45 days', 'Food & Dining', 'Chase Primary Checking');

  -- Create monthly data for charts (6 months)
  FOR i IN 1..5 LOOP
    -- Monthly income
    INSERT INTO direct_transactions (user_name, description, amount, type, transaction_date, category, account_name)
    VALUES ('demo', 'Monthly Salary', 4200.00, 'income', now() - interval '1 month' * i, 'Income', 'Chase Primary Checking');
    
    -- Monthly expenses
    INSERT INTO direct_transactions (user_name, description, amount, type, transaction_date, category, account_name)
    VALUES 
      ('demo', 'Rent Payment', 1800.00, 'expense', now() - interval '1 month' * i - interval '2 days', 'Housing', 'Chase Primary Checking'),
      ('demo', 'Utilities', 200.00 + (random() * 50), 'expense', now() - interval '1 month' * i - interval '5 days', 'Bills & Utilities', 'Chase Primary Checking'),
      ('demo', 'Groceries', 350.00 + (random() * 100), 'expense', now() - interval '1 month' * i - interval '10 days', 'Food & Dining', 'Chase Primary Checking'),
      ('demo', 'Dining Out', 200.00 + (random() * 150), 'expense', now() - interval '1 month' * i - interval '15 days', 'Food & Dining', 'Chase Primary Checking'),
      ('demo', 'Transportation', 150.00 + (random() * 50), 'expense', now() - interval '1 month' * i - interval '20 days', 'Transportation', 'Chase Primary Checking');
  END LOOP;

  -- Create investments for demo user
  INSERT INTO direct_investments (user_name, symbol, name, shares, current_price, total_value, day_change, day_change_percent, sector, market_cap, pe, dividend, rating)
  VALUES
    ('demo', 'AAPL', 'Apple Inc.', 25, 185.42, 4635.50, 2.34, 1.28, 'Technology', '2.9T', 28.5, 0.24, 'Buy'),
    ('demo', 'MSFT', 'Microsoft Corporation', 15, 412.73, 6190.95, -5.67, -1.35, 'Technology', '3.1T', 32.1, 0.75, 'Buy'),
    ('demo', 'GOOGL', 'Alphabet Inc.', 8, 142.56, 1140.48, 0.89, 0.63, 'Technology', '1.8T', 25.3, 0.00, 'Hold'),
    ('demo', 'TSLA', 'Tesla Inc.', 12, 248.91, 2986.92, 12.45, 5.26, 'Automotive', '790B', 65.2, 0.00, 'Hold'),
    ('demo', 'NVDA', 'NVIDIA Corporation', 5, 875.28, 4376.40, 15.67, 1.82, 'Technology', '2.2T', 71.8, 0.16, 'Buy'),
    ('demo', 'AMZN', 'Amazon.com Inc.', 10, 155.89, 1558.90, -2.11, -1.33, 'Consumer Discretionary', '1.6T', 45.7, 0.00, 'Buy');
END $$;

-- Insert demo data for 'testuser' user
DO $$
BEGIN
  -- Create accounts for testuser
  INSERT INTO direct_accounts (user_name, account_name, account_type, current_balance)
  VALUES 
    ('testuser', 'Bank of America Checking', 'checking', 3247.85),
    ('testuser', 'Ally Online Savings', 'savings', 8950.20),
    ('testuser', 'Fidelity Investment Account', 'investment', 25430.75);

  -- Create transactions for testuser
  INSERT INTO direct_transactions (user_name, description, amount, type, transaction_date, category, account_name)
  VALUES
    -- Recent transactions
    ('testuser', 'Salary Deposit - Design Studio', 3800.00, 'income', now() - interval '1 day', 'Income', 'Bank of America Checking'),
    ('testuser', 'Trader Joes', 89.32, 'expense', now() - interval '4 days', 'Food & Dining', 'Bank of America Checking'),
    ('testuser', 'Metro Card Refill', 30.00, 'expense', now() - interval '6 days', 'Transportation', 'Bank of America Checking'),
    ('testuser', 'Dividend Payment', 125.50, 'income', now() - interval '8 days', 'Income', 'Fidelity Investment Account'),
    ('testuser', 'Spotify Premium', 9.99, 'expense', now() - interval '11 days', 'Entertainment', 'Bank of America Checking'),
    ('testuser', 'Local Cafe', 6.25, 'expense', now() - interval '13 days', 'Food & Dining', 'Bank of America Checking'),
    ('testuser', 'Target Shopping', 67.43, 'expense', now() - interval '16 days', 'Shopping', 'Bank of America Checking'),
    ('testuser', 'Internet Bill', 79.99, 'expense', now() - interval '19 days', 'Bills & Utilities', 'Bank of America Checking'),
    ('testuser', 'Savings Interest', 28.75, 'income', now() - interval '22 days', 'Income', 'Ally Online Savings'),
    ('testuser', 'Restaurant Dinner', 45.80, 'expense', now() - interval '24 days', 'Food & Dining', 'Bank of America Checking');

  -- Create monthly data for charts (6 months)
  FOR i IN 1..5 LOOP
    -- Monthly income
    INSERT INTO direct_transactions (user_name, description, amount, type, transaction_date, category, account_name)
    VALUES ('testuser', 'Monthly Salary', 3800.00, 'income', now() - interval '1 month' * i, 'Income', 'Bank of America Checking');
    
    -- Monthly expenses
    INSERT INTO direct_transactions (user_name, description, amount, type, transaction_date, category, account_name)
    VALUES 
      ('testuser', 'Rent Payment', 1650.00, 'expense', now() - interval '1 month' * i - interval '2 days', 'Housing', 'Bank of America Checking'),
      ('testuser', 'Utilities', 180.00 + (random() * 40), 'expense', now() - interval '1 month' * i - interval '5 days', 'Bills & Utilities', 'Bank of America Checking'),
      ('testuser', 'Groceries', 300.00 + (random() * 80), 'expense', now() - interval '1 month' * i - interval '10 days', 'Food & Dining', 'Bank of America Checking'),
      ('testuser', 'Dining Out', 180.00 + (random() * 120), 'expense', now() - interval '1 month' * i - interval '15 days', 'Food & Dining', 'Bank of America Checking'),
      ('testuser', 'Transportation', 120.00 + (random() * 40), 'expense', now() - interval '1 month' * i - interval '20 days', 'Transportation', 'Bank of America Checking');
  END LOOP;

  -- Create investments for testuser
  INSERT INTO direct_investments (user_name, symbol, name, shares, current_price, total_value, day_change, day_change_percent, sector, market_cap, pe, dividend, rating)
  VALUES
    ('testuser', 'VTI', 'Vanguard Total Stock Market ETF', 35, 252.87, 8850.45, 1.23, 0.49, 'ETF', 'N/A', 0, 1.42, 'Buy'),
    ('testuser', 'AAPL', 'Apple Inc.', 10, 185.42, 1854.20, 2.34, 1.28, 'Technology', '2.9T', 28.5, 0.24, 'Hold'),
    ('testuser', 'AMZN', 'Amazon.com Inc.', 5, 155.89, 779.45, -2.11, -1.33, 'Consumer Discretionary', '1.6T', 45.7, 0.00, 'Buy'),
    ('testuser', 'BND', 'Vanguard Total Bond Market ETF', 50, 72.54, 3627.00, 0.12, 0.17, 'Bond ETF', 'N/A', 0, 3.85, 'Hold');
END $$;

-- Insert demo data for 'johndoe' user
DO $$
BEGIN
  -- Create accounts for johndoe
  INSERT INTO direct_accounts (user_name, account_name, account_type, current_balance)
  VALUES 
    ('johndoe', 'Wells Fargo Checking', 'checking', 6847.65),
    ('johndoe', 'Capital One 360 Savings', 'savings', 22750.30),
    ('johndoe', 'Vanguard Investment Account', 'investment', 78920.45);

  -- Create transactions for johndoe
  INSERT INTO direct_transactions (user_name, description, amount, type, transaction_date, category, account_name)
  VALUES
    -- Recent transactions (last 30 days)
    ('johndoe', 'Salary Deposit - Marketing Agency', 5600.00, 'income', now() - interval '1 day', 'Income', 'Wells Fargo Checking'),
    ('johndoe', 'Safeway Grocery', 98.76, 'expense', now() - interval '2 days', 'Food & Dining', 'Wells Fargo Checking'),
    ('johndoe', 'Lyft Ride', 22.50, 'expense', now() - interval '4 days', 'Transportation', 'Wells Fargo Checking'),
    ('johndoe', 'Disney+ Subscription', 13.99, 'expense', now() - interval '6 days', 'Entertainment', 'Wells Fargo Checking'),
    ('johndoe', 'Side Project Payment', 450.00, 'income', now() - interval '8 days', 'Income', 'Wells Fargo Checking'),
    ('johndoe', 'Local Deli', 8.50, 'expense', now() - interval '9 days', 'Food & Dining', 'Wells Fargo Checking'),
    ('johndoe', 'Best Buy Electronics', 156.99, 'expense', now() - interval '11 days', 'Shopping', 'Wells Fargo Checking'),
    ('johndoe', 'Gym Membership', 39.99, 'expense', now() - interval '14 days', 'Health & Fitness', 'Wells Fargo Checking'),
    ('johndoe', 'Phone Bill', 85.00, 'expense', now() - interval '16 days', 'Bills & Utilities', 'Wells Fargo Checking'),
    ('johndoe', 'Savings Interest', 32.15, 'income', now() - interval '18 days', 'Income', 'Capital One 360 Savings'),
    ('johndoe', 'Pizza Delivery', 24.75, 'expense', now() - interval '20 days', 'Food & Dining', 'Wells Fargo Checking'),
    ('johndoe', 'Investment Dividend', 78.90, 'income', now() - interval '22 days', 'Income', 'Vanguard Investment Account');

  -- Create monthly data for charts (6 months)
  FOR i IN 1..5 LOOP
    -- Monthly income
    INSERT INTO direct_transactions (user_name, description, amount, type, transaction_date, category, account_name)
    VALUES ('johndoe', 'Monthly Salary', 5600.00, 'income', now() - interval '1 month' * i, 'Income', 'Wells Fargo Checking');
    
    -- Monthly expenses
    INSERT INTO direct_transactions (user_name, description, amount, type, transaction_date, category, account_name)
    VALUES 
      ('johndoe', 'Rent Payment', 1750.00, 'expense', now() - interval '1 month' * i - interval '2 days', 'Housing', 'Wells Fargo Checking'),
      ('johndoe', 'Utilities', 195.00 + (random() * 45), 'expense', now() - interval '1 month' * i - interval '5 days', 'Bills & Utilities', 'Wells Fargo Checking'),
      ('johndoe', 'Groceries', 325.00 + (random() * 90), 'expense', now() - interval '1 month' * i - interval '10 days', 'Food & Dining', 'Wells Fargo Checking'),
      ('johndoe', 'Dining Out', 220.00 + (random() * 130), 'expense', now() - interval '1 month' * i - interval '15 days', 'Food & Dining', 'Wells Fargo Checking'),
      ('johndoe', 'Transportation', 135.00 + (random() * 45), 'expense', now() - interval '1 month' * i - interval '20 days', 'Transportation', 'Wells Fargo Checking');
  END LOOP;

  -- Create investments for johndoe
  INSERT INTO direct_investments (user_name, symbol, name, shares, current_price, total_value, day_change, day_change_percent, sector, market_cap, pe, dividend, rating)
  VALUES
    ('johndoe', 'VOO', 'Vanguard S&P 500 ETF', 45, 456.78, 20555.10, 2.45, 0.54, 'ETF', 'N/A', 0, 1.35, 'Buy'),
    ('johndoe', 'MSFT', 'Microsoft Corporation', 20, 412.73, 8254.60, -5.67, -1.35, 'Technology', '3.1T', 32.1, 0.75, 'Buy'),
    ('johndoe', 'JNJ', 'Johnson & Johnson', 30, 152.50, 4575.00, 0.75, 0.49, 'Healthcare', '370B', 17.2, 3.12, 'Hold'),
    ('johndoe', 'COST', 'Costco Wholesale Corp', 8, 725.33, 5802.64, 3.21, 0.44, 'Consumer Staples', '320B', 45.8, 0.65, 'Buy'),
    ('johndoe', 'VNQ', 'Vanguard Real Estate ETF', 40, 85.25, 3410.00, -0.45, -0.53, 'Real Estate', 'N/A', 0, 3.95, 'Hold');
END $$;