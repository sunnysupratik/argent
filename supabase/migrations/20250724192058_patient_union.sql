/*
  # Create Sample Financial Data

  1. Sample Data Creation
    - Add sample accounts for demo users (johndoe, demo, testuser)
    - Add sample transactions for current month to show income/expenses
    - Add sample investments for portfolio tracking
    - Add sample categories for transaction organization

  2. Data Structure
    - Checking, Savings, and Investment accounts for each user
    - Mix of income and expense transactions for current month
    - Realistic amounts and descriptions
    - Proper categorization

  3. Users Covered
    - johndoe: Marketing professional with balanced finances
    - demo: Tech worker with higher income
    - testuser: Student with basic finances
*/

-- Insert sample categories
INSERT INTO categories (name, icon_name, user_name) VALUES
('Salary', 'dollar-sign', 'johndoe'),
('Groceries', 'shopping-cart', 'johndoe'),
('Rent', 'home', 'johndoe'),
('Transportation', 'car', 'johndoe'),
('Entertainment', 'film', 'johndoe'),
('Utilities', 'zap', 'johndoe'),
('Healthcare', 'heart', 'johndoe'),
('Freelance', 'briefcase', 'johndoe'),

('Salary', 'dollar-sign', 'demo'),
('Groceries', 'shopping-cart', 'demo'),
('Rent', 'home', 'demo'),
('Transportation', 'car', 'demo'),
('Entertainment', 'film', 'demo'),
('Utilities', 'zap', 'demo'),
('Healthcare', 'heart', 'demo'),
('Consulting', 'briefcase', 'demo'),

('Part-time Job', 'dollar-sign', 'testuser'),
('Groceries', 'shopping-cart', 'testuser'),
('Rent', 'home', 'testuser'),
('Transportation', 'car', 'testuser'),
('Entertainment', 'film', 'testuser'),
('Utilities', 'zap', 'testuser'),
('Books', 'book', 'testuser'),
('Tutoring', 'briefcase', 'testuser');

-- Insert sample accounts for johndoe
INSERT INTO direct_accounts (user_name, account_name, account_type, current_balance) VALUES
('johndoe', 'Chase Sapphire Checking', 'checking', 15420.75),
('johndoe', 'Chase Savings Plus', 'savings', 45890.25),
('johndoe', 'Fidelity 401k', 'investment', 89750.50),
('johndoe', 'Robinhood Trading', 'investment', 25538.00);

-- Insert sample accounts for demo
INSERT INTO direct_accounts (user_name, account_name, account_type, current_balance) VALUES
('demo', 'Bank of America Checking', 'checking', 22150.80),
('demo', 'Marcus High Yield Savings', 'savings', 67890.45),
('demo', 'Vanguard 401k', 'investment', 125750.25),
('demo', 'E*TRADE Portfolio', 'investment', 45680.30);

-- Insert sample accounts for testuser
INSERT INTO direct_accounts (user_name, account_name, account_type, current_balance) VALUES
('testuser', 'Wells Fargo Student Checking', 'checking', 2840.50),
('testuser', 'Ally Online Savings', 'savings', 8950.75),
('testuser', 'Acorns Investment', 'investment', 1250.25);

-- Insert sample transactions for johndoe (current month)
INSERT INTO direct_transactions (user_name, description, amount, type, transaction_date, category, account_name) VALUES
-- Income transactions
('johndoe', 'Marketing Manager Salary', 6500.00, 'income', CURRENT_DATE - INTERVAL '5 days', 'Salary', 'Chase Sapphire Checking'),
('johndoe', 'Freelance Project Payment', 1200.00, 'income', CURRENT_DATE - INTERVAL '10 days', 'Freelance', 'Chase Sapphire Checking'),
('johndoe', 'Investment Dividend', 450.00, 'income', CURRENT_DATE - INTERVAL '15 days', 'Salary', 'Chase Sapphire Checking'),

-- Expense transactions
('johndoe', 'Monthly Rent Payment', 2200.00, 'expense', CURRENT_DATE - INTERVAL '1 days', 'Rent', 'Chase Sapphire Checking'),
('johndoe', 'Whole Foods Grocery', 145.67, 'expense', CURRENT_DATE - INTERVAL '2 days', 'Groceries', 'Chase Sapphire Checking'),
('johndoe', 'Uber Ride', 28.50, 'expense', CURRENT_DATE - INTERVAL '3 days', 'Transportation', 'Chase Sapphire Checking'),
('johndoe', 'Netflix Subscription', 15.99, 'expense', CURRENT_DATE - INTERVAL '4 days', 'Entertainment', 'Chase Sapphire Checking'),
('johndoe', 'Electric Bill', 89.45, 'expense', CURRENT_DATE - INTERVAL '6 days', 'Utilities', 'Chase Sapphire Checking'),
('johndoe', 'Trader Joes', 78.32, 'expense', CURRENT_DATE - INTERVAL '7 days', 'Groceries', 'Chase Sapphire Checking'),
('johndoe', 'Gas Station', 52.00, 'expense', CURRENT_DATE - INTERVAL '8 days', 'Transportation', 'Chase Sapphire Checking'),
('johndoe', 'Doctor Visit Copay', 35.00, 'expense', CURRENT_DATE - INTERVAL '9 days', 'Healthcare', 'Chase Sapphire Checking'),
('johndoe', 'Starbucks', 12.75, 'expense', CURRENT_DATE - INTERVAL '11 days', 'Entertainment', 'Chase Sapphire Checking'),
('johndoe', 'Amazon Purchase', 89.99, 'expense', CURRENT_DATE - INTERVAL '12 days', 'Entertainment', 'Chase Sapphire Checking'),
('johndoe', 'Safeway Grocery', 156.43, 'expense', CURRENT_DATE - INTERVAL '14 days', 'Groceries', 'Chase Sapphire Checking'),
('johndoe', 'Internet Bill', 79.99, 'expense', CURRENT_DATE - INTERVAL '16 days', 'Utilities', 'Chase Sapphire Checking');

-- Insert sample transactions for demo (current month)
INSERT INTO direct_transactions (user_name, description, amount, type, transaction_date, category, account_name) VALUES
-- Income transactions
('demo', 'Senior Developer Salary', 9200.00, 'income', CURRENT_DATE - INTERVAL '5 days', 'Salary', 'Bank of America Checking'),
('demo', 'Consulting Project', 2500.00, 'income', CURRENT_DATE - INTERVAL '12 days', 'Consulting', 'Bank of America Checking'),
('demo', 'Stock Dividend', 680.00, 'income', CURRENT_DATE - INTERVAL '18 days', 'Salary', 'Bank of America Checking'),

-- Expense transactions
('demo', 'Luxury Apartment Rent', 3200.00, 'expense', CURRENT_DATE - INTERVAL '1 days', 'Rent', 'Bank of America Checking'),
('demo', 'Whole Foods Premium', 189.45, 'expense', CURRENT_DATE - INTERVAL '2 days', 'Groceries', 'Bank of America Checking'),
('demo', 'Tesla Supercharger', 45.80, 'expense', CURRENT_DATE - INTERVAL '3 days', 'Transportation', 'Bank of America Checking'),
('demo', 'Disney+ Bundle', 19.99, 'expense', CURRENT_DATE - INTERVAL '4 days', 'Entertainment', 'Bank of America Checking'),
('demo', 'PG&E Electric', 125.67, 'expense', CURRENT_DATE - INTERVAL '6 days', 'Utilities', 'Bank of America Checking'),
('demo', 'Costco Shopping', 234.56, 'expense', CURRENT_DATE - INTERVAL '7 days', 'Groceries', 'Bank of America Checking'),
('demo', 'Lyft Ride', 18.75, 'expense', CURRENT_DATE - INTERVAL '8 days', 'Transportation', 'Bank of America Checking'),
('demo', 'Dental Cleaning', 150.00, 'expense', CURRENT_DATE - INTERVAL '9 days', 'Healthcare', 'Bank of America Checking'),
('demo', 'Blue Bottle Coffee', 8.50, 'expense', CURRENT_DATE - INTERVAL '10 days', 'Entertainment', 'Bank of America Checking'),
('demo', 'Apple Store Purchase', 299.99, 'expense', CURRENT_DATE - INTERVAL '13 days', 'Entertainment', 'Bank of America Checking'),
('demo', 'Organic Market', 167.89, 'expense', CURRENT_DATE - INTERVAL '15 days', 'Groceries', 'Bank of America Checking'),
('demo', 'Comcast Internet', 89.99, 'expense', CURRENT_DATE - INTERVAL '17 days', 'Utilities', 'Bank of America Checking');

-- Insert sample transactions for testuser (current month)
INSERT INTO direct_transactions (user_name, description, amount, type, transaction_date, category, account_name) VALUES
-- Income transactions
('testuser', 'Part-time Barista Job', 1200.00, 'income', CURRENT_DATE - INTERVAL '5 days', 'Part-time Job', 'Wells Fargo Student Checking'),
('testuser', 'Math Tutoring Session', 150.00, 'income', CURRENT_DATE - INTERVAL '10 days', 'Tutoring', 'Wells Fargo Student Checking'),
('testuser', 'Financial Aid Refund', 800.00, 'income', CURRENT_DATE - INTERVAL '20 days', 'Part-time Job', 'Wells Fargo Student Checking'),

-- Expense transactions
('testuser', 'Shared Apartment Rent', 650.00, 'expense', CURRENT_DATE - INTERVAL '1 days', 'Rent', 'Wells Fargo Student Checking'),
('testuser', 'Grocery Outlet Shopping', 45.67, 'expense', CURRENT_DATE - INTERVAL '2 days', 'Groceries', 'Wells Fargo Student Checking'),
('testuser', 'Bus Pass', 25.00, 'expense', CURRENT_DATE - INTERVAL '3 days', 'Transportation', 'Wells Fargo Student Checking'),
('testuser', 'Spotify Student', 5.99, 'expense', CURRENT_DATE - INTERVAL '4 days', 'Entertainment', 'Wells Fargo Student Checking'),
('testuser', 'Utility Split', 35.50, 'expense', CURRENT_DATE - INTERVAL '6 days', 'Utilities', 'Wells Fargo Student Checking'),
('testuser', 'Ramen and Snacks', 23.45, 'expense', CURRENT_DATE - INTERVAL '7 days', 'Groceries', 'Wells Fargo Student Checking'),
('testuser', 'Coffee Shop Study', 8.75, 'expense', CURRENT_DATE - INTERVAL '8 days', 'Entertainment', 'Wells Fargo Student Checking'),
('testuser', 'Textbook Purchase', 89.99, 'expense', CURRENT_DATE - INTERVAL '11 days', 'Books', 'Wells Fargo Student Checking'),
('testuser', 'Campus Food Court', 12.50, 'expense', CURRENT_DATE - INTERVAL '13 days', 'Groceries', 'Wells Fargo Student Checking'),
('testuser', 'Movie Ticket', 14.00, 'expense', CURRENT_DATE - INTERVAL '16 days', 'Entertainment', 'Wells Fargo Student Checking');

-- Insert sample investments for johndoe
INSERT INTO direct_investments (user_name, symbol, name, shares, current_price, total_value, day_change, day_change_percent, sector, market_cap, pe, dividend, rating) VALUES
('johndoe', 'AAPL', 'Apple Inc.', 50, 185.42, 9271.00, 2.34, 1.28, 'Technology', 'Large Cap', 28.5, 0.96, 'Buy'),
('johndoe', 'MSFT', 'Microsoft Corporation', 25, 412.73, 10318.25, -5.67, -1.35, 'Technology', 'Large Cap', 32.1, 3.00, 'Buy'),
('johndoe', 'GOOGL', 'Alphabet Inc.', 15, 142.56, 2138.40, 0.89, 0.63, 'Technology', 'Large Cap', 25.8, 0.00, 'Hold'),
('johndoe', 'TSLA', 'Tesla Inc.', 10, 248.91, 2489.10, 12.45, 5.26, 'Automotive', 'Large Cap', 45.2, 0.00, 'Hold');

-- Insert sample investments for demo
INSERT INTO direct_investments (user_name, symbol, name, shares, current_price, total_value, day_change, day_change_percent, sector, market_cap, pe, dividend, rating) VALUES
('demo', 'NVDA', 'NVIDIA Corporation', 30, 875.28, 26258.40, 15.67, 1.82, 'Technology', 'Large Cap', 65.4, 0.16, 'Buy'),
('demo', 'AMZN', 'Amazon.com Inc.', 20, 151.94, 3038.80, -2.45, -1.59, 'Consumer Discretionary', 'Large Cap', 42.3, 0.00, 'Buy'),
('demo', 'META', 'Meta Platforms Inc.', 25, 484.20, 12105.00, 8.90, 1.87, 'Technology', 'Large Cap', 24.1, 2.00, 'Buy'),
('demo', 'NFLX', 'Netflix Inc.', 15, 486.81, 7302.15, -3.22, -0.66, 'Communication Services', 'Large Cap', 35.7, 0.00, 'Hold');

-- Insert sample investments for testuser
INSERT INTO direct_investments (user_name, symbol, name, shares, current_price, total_value, day_change, day_change_percent, sector, market_cap, pe, dividend, rating) VALUES
('testuser', 'VTI', 'Vanguard Total Stock Market ETF', 5, 245.67, 1228.35, 1.23, 0.50, 'ETF', 'Large Cap', 22.1, 1.45, 'Buy'),
('testuser', 'SPY', 'SPDR S&P 500 ETF Trust', 2, 512.34, 1024.68, 2.45, 0.48, 'ETF', 'Large Cap', 24.5, 1.32, 'Buy');