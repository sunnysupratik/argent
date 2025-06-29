/*
  # Populate Demo Data for Direct Tables

  1. Demo Data Overview
    - Creates comprehensive financial data for 3 demo users
    - Includes accounts, transactions, and investments
    - Provides 6 months of historical data for realistic charts

  2. Demo Users
    - demo (Alex Johnson) - Balanced portfolio with good savings
    - testuser (Sarah Wilson) - Young professional building wealth
    - johndoe (John Doe) - Experienced investor with diverse portfolio

  3. Data Structure
    - Multiple account types per user
    - Realistic transaction patterns
    - Diversified investment portfolios
    - Historical data for trend analysis
*/

-- Clear existing demo data first
DELETE FROM direct_investments WHERE user_name IN ('demo', 'testuser', 'johndoe');
DELETE FROM direct_transactions WHERE user_name IN ('demo', 'testuser', 'johndoe');
DELETE FROM direct_accounts WHERE user_name IN ('demo', 'testuser', 'johndoe');

-- Insert Demo Accounts
INSERT INTO direct_accounts (user_name, account_name, account_type, current_balance) VALUES
-- Demo User (Alex Johnson) - Balanced finances
('demo', 'Chase Checking', 'checking', 8500.00),
('demo', 'Chase Savings', 'savings', 25000.00),
('demo', 'Fidelity 401k', 'investment', 85000.00),
('demo', 'Chase Freedom Credit Card', 'credit_card', -1240.80),

-- Test User (Sarah Wilson) - Young professional
('testuser', 'Bank of America Checking', 'checking', 3200.00),
('testuser', 'Bank of America Savings', 'savings', 12000.00),
('testuser', 'Vanguard Roth IRA', 'investment', 28000.00),
('testuser', 'Capital One Credit Card', 'credit_card', -890.50),

-- John Doe - Experienced investor
('johndoe', 'Wells Fargo Checking', 'checking', 12000.00),
('johndoe', 'Wells Fargo Savings', 'savings', 45000.00),
('johndoe', 'Charles Schwab Brokerage', 'investment', 150000.00),
('johndoe', 'American Express Gold', 'credit_card', -2100.00);

-- Insert Demo Transactions (Last 6 months)
INSERT INTO direct_transactions (user_name, description, amount, type, transaction_date, category, account_name) VALUES
-- Demo User Transactions
('demo', 'Salary Deposit', 6500.00, 'income', '2024-12-01', 'Salary', 'Chase Checking'),
('demo', 'Grocery Store', -125.50, 'expense', '2024-12-02', 'Food & Dining', 'Chase Checking'),
('demo', 'Gas Station', -65.00, 'expense', '2024-12-03', 'Transportation', 'Chase Checking'),
('demo', 'Netflix Subscription', -15.99, 'expense', '2024-12-04', 'Entertainment', 'Chase Checking'),
('demo', 'Investment Transfer', -1000.00, 'expense', '2024-12-05', 'Investment', 'Chase Checking'),
('demo', 'Rent Payment', -2200.00, 'expense', '2024-12-01', 'Housing', 'Chase Checking'),
('demo', 'Electricity Bill', -120.00, 'expense', '2024-12-06', 'Utilities', 'Chase Checking'),
('demo', 'Restaurant Dinner', -85.00, 'expense', '2024-12-07', 'Food & Dining', 'Chase Checking'),
('demo', 'Online Shopping', -150.00, 'expense', '2024-12-08', 'Shopping', 'Chase Checking'),
('demo', 'Gym Membership', -50.00, 'expense', '2024-12-09', 'Health & Fitness', 'Chase Checking'),

-- November transactions
('demo', 'Salary Deposit', 6500.00, 'income', '2024-11-01', 'Salary', 'Chase Checking'),
('demo', 'Freelance Project', 1200.00, 'income', '2024-11-15', 'Freelance', 'Chase Checking'),
('demo', 'Grocery Store', -110.00, 'expense', '2024-11-02', 'Food & Dining', 'Chase Checking'),
('demo', 'Gas Station', -70.00, 'expense', '2024-11-03', 'Transportation', 'Chase Checking'),
('demo', 'Rent Payment', -2200.00, 'expense', '2024-11-01', 'Housing', 'Chase Checking'),
('demo', 'Phone Bill', -80.00, 'expense', '2024-11-05', 'Utilities', 'Chase Checking'),
('demo', 'Coffee Shop', -25.00, 'expense', '2024-11-06', 'Food & Dining', 'Chase Checking'),
('demo', 'Investment Transfer', -1000.00, 'expense', '2024-11-10', 'Investment', 'Chase Checking'),

-- Test User Transactions
('testuser', 'Salary Deposit', 4200.00, 'income', '2024-12-01', 'Salary', 'Bank of America Checking'),
('testuser', 'Grocery Store', -95.00, 'expense', '2024-12-02', 'Food & Dining', 'Bank of America Checking'),
('testuser', 'Gas Station', -45.00, 'expense', '2024-12-03', 'Transportation', 'Bank of America Checking'),
('testuser', 'Spotify Premium', -9.99, 'expense', '2024-12-04', 'Entertainment', 'Bank of America Checking'),
('testuser', 'Rent Payment', -1800.00, 'expense', '2024-12-01', 'Housing', 'Bank of America Checking'),
('testuser', 'Electricity Bill', -85.00, 'expense', '2024-12-05', 'Utilities', 'Bank of America Checking'),
('testuser', 'Restaurant Lunch', -35.00, 'expense', '2024-12-06', 'Food & Dining', 'Bank of America Checking'),
('testuser', 'Online Shopping', -120.00, 'expense', '2024-12-07', 'Shopping', 'Bank of America Checking'),
('testuser', 'Investment Contribution', -500.00, 'expense', '2024-12-08', 'Investment', 'Bank of America Checking'),

-- November transactions for testuser
('testuser', 'Salary Deposit', 4200.00, 'income', '2024-11-01', 'Salary', 'Bank of America Checking'),
('testuser', 'Side Hustle', 300.00, 'income', '2024-11-20', 'Freelance', 'Bank of America Checking'),
('testuser', 'Grocery Store', -85.00, 'expense', '2024-11-02', 'Food & Dining', 'Bank of America Checking'),
('testuser', 'Gas Station', -50.00, 'expense', '2024-11-03', 'Transportation', 'Bank of America Checking'),
('testuser', 'Rent Payment', -1800.00, 'expense', '2024-11-01', 'Housing', 'Bank of America Checking'),
('testuser', 'Phone Bill', -65.00, 'expense', '2024-11-05', 'Utilities', 'Bank of America Checking'),
('testuser', 'Investment Contribution', -500.00, 'expense', '2024-11-15', 'Investment', 'Bank of America Checking'),

-- John Doe Transactions
('johndoe', 'Salary Deposit', 8500.00, 'income', '2024-12-01', 'Salary', 'Wells Fargo Checking'),
('johndoe', 'Dividend Payment', 450.00, 'income', '2024-12-15', 'Investment', 'Wells Fargo Checking'),
('johndoe', 'Grocery Store', -180.00, 'expense', '2024-12-02', 'Food & Dining', 'Wells Fargo Checking'),
('johndoe', 'Gas Station', -85.00, 'expense', '2024-12-03', 'Transportation', 'Wells Fargo Checking'),
('johndoe', 'Mortgage Payment', -3200.00, 'expense', '2024-12-01', 'Housing', 'Wells Fargo Checking'),
('johndoe', 'Utilities Bundle', -220.00, 'expense', '2024-12-05', 'Utilities', 'Wells Fargo Checking'),
('johndoe', 'Fine Dining', -150.00, 'expense', '2024-12-06', 'Food & Dining', 'Wells Fargo Checking'),
('johndoe', 'Investment Purchase', -2000.00, 'expense', '2024-12-07', 'Investment', 'Wells Fargo Checking'),
('johndoe', 'Home Improvement', -500.00, 'expense', '2024-12-08', 'Home & Garden', 'Wells Fargo Checking'),

-- November transactions for johndoe
('johndoe', 'Salary Deposit', 8500.00, 'income', '2024-11-01', 'Salary', 'Wells Fargo Checking'),
('johndoe', 'Dividend Payment', 420.00, 'income', '2024-11-15', 'Investment', 'Wells Fargo Checking'),
('johndoe', 'Consulting Fee', 2500.00, 'income', '2024-11-25', 'Freelance', 'Wells Fargo Checking'),
('johndoe', 'Grocery Store', -165.00, 'expense', '2024-11-02', 'Food & Dining', 'Wells Fargo Checking'),
('johndoe', 'Gas Station', -90.00, 'expense', '2024-11-03', 'Transportation', 'Wells Fargo Checking'),
('johndoe', 'Mortgage Payment', -3200.00, 'expense', '2024-11-01', 'Housing', 'Wells Fargo Checking'),
('johndoe', 'Investment Purchase', -2000.00, 'expense', '2024-11-10', 'Investment', 'Wells Fargo Checking');

-- Insert Demo Investments
INSERT INTO direct_investments (user_name, symbol, name, shares, current_price, total_value, day_change, day_change_percent, sector, market_cap, pe, dividend, rating) VALUES
-- Demo User Portfolio
('demo', 'AAPL', 'Apple Inc.', 50.00, 195.89, 9794.50, 2.45, 1.27, 'Technology', 'Large Cap', 29.8, 0.96, 'Buy'),
('demo', 'MSFT', 'Microsoft Corporation', 25.00, 378.85, 9471.25, -1.23, -0.32, 'Technology', 'Large Cap', 32.1, 3.00, 'Buy'),
('demo', 'GOOGL', 'Alphabet Inc.', 15.00, 141.80, 2127.00, 0.85, 0.60, 'Technology', 'Large Cap', 25.4, 0.00, 'Hold'),
('demo', 'TSLA', 'Tesla Inc.', 20.00, 248.50, 4970.00, -5.20, -2.05, 'Automotive', 'Large Cap', 65.2, 0.00, 'Hold'),
('demo', 'AMZN', 'Amazon.com Inc.', 12.00, 155.74, 1868.88, 1.15, 0.74, 'Consumer Discretionary', 'Large Cap', 48.7, 0.00, 'Buy'),
('demo', 'NVDA', 'NVIDIA Corporation', 8.00, 140.15, 1121.20, 3.25, 2.37, 'Technology', 'Large Cap', 75.8, 0.16, 'Buy'),

-- Test User Portfolio (Smaller, growth-focused)
('testuser', 'AAPL', 'Apple Inc.', 25.00, 195.89, 4897.25, 2.45, 1.27, 'Technology', 'Large Cap', 29.8, 0.96, 'Buy'),
('testuser', 'MSFT', 'Microsoft Corporation', 15.00, 378.85, 5682.75, -1.23, -0.32, 'Technology', 'Large Cap', 32.1, 3.00, 'Buy'),
('testuser', 'NVDA', 'NVIDIA Corporation', 12.00, 140.15, 1681.80, 3.25, 2.37, 'Technology', 'Large Cap', 75.8, 0.16, 'Buy'),
('testuser', 'AMD', 'Advanced Micro Devices', 30.00, 152.33, 4569.90, 4.67, 3.16, 'Technology', 'Large Cap', 22.1, 0.00, 'Buy'),
('testuser', 'TSLA', 'Tesla Inc.', 15.00, 248.50, 3727.50, -5.20, -2.05, 'Automotive', 'Large Cap', 65.2, 0.00, 'Hold'),

-- John Doe Portfolio (Diversified, dividend-focused)
('johndoe', 'AAPL', 'Apple Inc.', 100.00, 195.89, 19589.00, 2.45, 1.27, 'Technology', 'Large Cap', 29.8, 0.96, 'Buy'),
('johndoe', 'MSFT', 'Microsoft Corporation', 75.00, 378.85, 28413.75, -1.23, -0.32, 'Technology', 'Large Cap', 32.1, 3.00, 'Buy'),
('johndoe', 'JNJ', 'Johnson & Johnson', 80.00, 156.42, 12513.60, 0.35, 0.22, 'Healthcare', 'Large Cap', 15.2, 3.05, 'Hold'),
('johndoe', 'KO', 'The Coca-Cola Company', 150.00, 62.18, 9327.00, -0.15, -0.24, 'Consumer Staples', 'Large Cap', 26.8, 3.38, 'Hold'),
('johndoe', 'PG', 'Procter & Gamble', 60.00, 157.89, 9473.40, 0.85, 0.54, 'Consumer Staples', 'Large Cap', 24.1, 2.41, 'Hold'),
('johndoe', 'JPM', 'JPMorgan Chase & Co.', 45.00, 198.25, 8921.25, 1.25, 0.63, 'Financial Services', 'Large Cap', 12.5, 4.00, 'Buy'),
('johndoe', 'GOOGL', 'Alphabet Inc.', 35.00, 141.80, 4963.00, 0.85, 0.60, 'Technology', 'Large Cap', 25.4, 0.00, 'Hold'),
('johndoe', 'NVDA', 'NVIDIA Corporation', 25.00, 140.15, 3503.75, 3.25, 2.37, 'Technology', 'Large Cap', 75.8, 0.16, 'Buy'),
('johndoe', 'BRK.B', 'Berkshire Hathaway Inc.', 20.00, 445.20, 8904.00, 0.95, 0.21, 'Financial Services', 'Large Cap', 8.9, 0.00, 'Hold'),
('johndoe', 'VTI', 'Vanguard Total Stock Market ETF', 100.00, 285.45, 28545.00, 1.15, 0.40, 'ETF', 'Large Cap', 0.0, 1.25, 'Buy');