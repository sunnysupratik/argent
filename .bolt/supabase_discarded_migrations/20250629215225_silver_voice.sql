/*
  # Create Demo Users

  1. New Demo Users
    - Creates demo users for testing the application
    - Includes John Doe (johndoe) with password Demo123!
    - Includes additional test users for comprehensive testing

  2. Security
    - Uses the existing custom_users table structure
    - Maintains password security (in production, passwords should be hashed)
    - Creates corresponding profiles for each demo user

  3. Sample Data
    - Provides realistic user data for testing
    - Includes various account types and balances
    - Creates sample transactions for demonstration
*/

-- Insert demo users
INSERT INTO custom_users (id, username, password, full_name, email, user_name) VALUES
  ('550e8400-e29b-41d4-a716-446655440001', 'johndoe', 'Demo123!', 'John Doe', 'john.doe@example.com', 'johndoe'),
  ('550e8400-e29b-41d4-a716-446655440002', 'demo', 'Password123!', 'Demo User', 'demo@example.com', 'demo'),
  ('550e8400-e29b-41d4-a716-446655440003', 'testuser', 'TestPass123!', 'Test User', 'testuser@example.com', 'testuser')
ON CONFLICT (username) DO NOTHING;

-- Insert corresponding profiles
INSERT INTO profiles (id, full_name, custom_user_id, location, occupation, bio, user_name) VALUES
  ('550e8400-e29b-41d4-a716-446655440001', 'John Doe', '550e8400-e29b-41d4-a716-446655440001', 'San Francisco, CA', 'Marketing Professional', 'Experienced marketing professional with a passion for financial planning and investment strategies.', 'johndoe'),
  ('550e8400-e29b-41d4-a716-446655440002', 'Demo User', '550e8400-e29b-41d4-a716-446655440002', 'New York, NY', 'Software Developer', 'Tech enthusiast exploring personal finance and budgeting tools.', 'demo'),
  ('550e8400-e29b-41d4-a716-446655440003', 'Test User', '550e8400-e29b-41d4-a716-446655440003', 'Austin, TX', 'Financial Analyst', 'Financial analyst with expertise in portfolio management and risk assessment.', 'testuser')
ON CONFLICT (id) DO NOTHING;

-- Insert sample accounts for John Doe
INSERT INTO accounts (id, account_name, account_type, current_balance, custom_user_id, user_name) VALUES
  ('660e8400-e29b-41d4-a716-446655440001', 'Primary Checking', 'checking', 5420.50, '550e8400-e29b-41d4-a716-446655440001', 'johndoe'),
  ('660e8400-e29b-41d4-a716-446655440002', 'Emergency Savings', 'savings', 15000.00, '550e8400-e29b-41d4-a716-446655440001', 'johndoe'),
  ('660e8400-e29b-41d4-a716-446655440003', 'Investment Portfolio', 'investment', 32500.75, '550e8400-e29b-41d4-a716-446655440001', 'johndoe')
ON CONFLICT (id) DO NOTHING;

-- Insert sample accounts for Demo User
INSERT INTO accounts (id, account_name, account_type, current_balance, custom_user_id, user_name) VALUES
  ('660e8400-e29b-41d4-a716-446655440004', 'Main Checking', 'checking', 2150.25, '550e8400-e29b-41d4-a716-446655440002', 'demo'),
  ('660e8400-e29b-41d4-a716-446655440005', 'Savings Goal', 'savings', 8500.00, '550e8400-e29b-41d4-a716-446655440002', 'demo')
ON CONFLICT (id) DO NOTHING;

-- Insert sample accounts for Test User
INSERT INTO accounts (id, account_name, account_type, current_balance, custom_user_id, user_name) VALUES
  ('660e8400-e29b-41d4-a716-446655440006', 'Business Checking', 'checking', 12750.80, '550e8400-e29b-41d4-a716-446655440003', 'testuser'),
  ('660e8400-e29b-41d4-a716-446655440007', 'High Yield Savings', 'savings', 25000.00, '550e8400-e29b-41d4-a716-446655440003', 'testuser'),
  ('660e8400-e29b-41d4-a716-446655440008', 'Stock Portfolio', 'investment', 45000.25, '550e8400-e29b-41d4-a716-446655440003', 'testuser')
ON CONFLICT (id) DO NOTHING;

-- Insert sample categories
INSERT INTO categories (id, name, icon_name, custom_user_id, user_name) VALUES
  ('770e8400-e29b-41d4-a716-446655440001', 'Groceries', 'shopping-cart', NULL, NULL),
  ('770e8400-e29b-41d4-a716-446655440002', 'Transportation', 'car', NULL, NULL),
  ('770e8400-e29b-41d4-a716-446655440003', 'Entertainment', 'film', NULL, NULL),
  ('770e8400-e29b-41d4-a716-446655440004', 'Utilities', 'zap', NULL, NULL),
  ('770e8400-e29b-41d4-a716-446655440005', 'Salary', 'dollar-sign', NULL, NULL),
  ('770e8400-e29b-41d4-a716-446655440006', 'Investment', 'trending-up', NULL, NULL)
ON CONFLICT (id) DO NOTHING;

-- Insert sample transactions for John Doe
INSERT INTO transactions (id, account_id, category_id, description, amount, type, transaction_date, custom_user_id, user_name) VALUES
  ('880e8400-e29b-41d4-a716-446655440001', '660e8400-e29b-41d4-a716-446655440001', '770e8400-e29b-41d4-a716-446655440005', 'Monthly Salary', 4500.00, 'income', NOW() - INTERVAL '5 days', '550e8400-e29b-41d4-a716-446655440001', 'johndoe'),
  ('880e8400-e29b-41d4-a716-446655440002', '660e8400-e29b-41d4-a716-446655440001', '770e8400-e29b-41d4-a716-446655440001', 'Whole Foods Market', -125.50, 'expense', NOW() - INTERVAL '3 days', '550e8400-e29b-41d4-a716-446655440001', 'johndoe'),
  ('880e8400-e29b-41d4-a716-446655440003', '660e8400-e29b-41d4-a716-446655440001', '770e8400-e29b-41d4-a716-446655440002', 'Uber Ride', -18.75, 'expense', NOW() - INTERVAL '2 days', '550e8400-e29b-41d4-a716-446655440001', 'johndoe'),
  ('880e8400-e29b-41d4-a716-446655440004', '660e8400-e29b-41d4-a716-446655440001', '770e8400-e29b-41d4-a716-446655440003', 'Netflix Subscription', -15.99, 'expense', NOW() - INTERVAL '1 day', '550e8400-e29b-41d4-a716-446655440001', 'johndoe'),
  ('880e8400-e29b-41d4-a716-446655440005', '660e8400-e29b-41d4-a716-446655440003', '770e8400-e29b-41d4-a716-446655440006', 'Stock Purchase - AAPL', -1000.00, 'expense', NOW() - INTERVAL '7 days', '550e8400-e29b-41d4-a716-446655440001', 'johndoe')
ON CONFLICT (id) DO NOTHING;

-- Insert sample transactions for Demo User
INSERT INTO transactions (id, account_id, category_id, description, amount, type, transaction_date, custom_user_id, user_name) VALUES
  ('880e8400-e29b-41d4-a716-446655440006', '660e8400-e29b-41d4-a716-446655440004', '770e8400-e29b-41d4-a716-446655440005', 'Freelance Payment', 1200.00, 'income', NOW() - INTERVAL '4 days', '550e8400-e29b-41d4-a716-446655440002', 'demo'),
  ('880e8400-e29b-41d4-a716-446655440007', '660e8400-e29b-41d4-a716-446655440004', '770e8400-e29b-41d4-a716-446655440001', 'Grocery Shopping', -85.30, 'expense', NOW() - INTERVAL '2 days', '550e8400-e29b-41d4-a716-446655440002', 'demo'),
  ('880e8400-e29b-41d4-a716-446655440008', '660e8400-e29b-41d4-a716-446655440004', '770e8400-e29b-41d4-a716-446655440004', 'Electric Bill', -120.45, 'expense', NOW() - INTERVAL '1 day', '550e8400-e29b-41d4-a716-446655440002', 'demo')
ON CONFLICT (id) DO NOTHING;

-- Insert sample transactions for Test User
INSERT INTO transactions (id, account_id, category_id, description, amount, type, transaction_date, custom_user_id, user_name) VALUES
  ('880e8400-e29b-41d4-a716-446655440009', '660e8400-e29b-41d4-a716-446655440006', '770e8400-e29b-41d4-a716-446655440005', 'Consulting Fee', 3500.00, 'income', NOW() - INTERVAL '6 days', '550e8400-e29b-41d4-a716-446655440003', 'testuser'),
  ('880e8400-e29b-41d4-a716-446655440010', '660e8400-e29b-41d4-a716-446655440006', '770e8400-e29b-41d4-a716-446655440001', 'Business Lunch', -65.00, 'expense', NOW() - INTERVAL '3 days', '550e8400-e29b-41d4-a716-446655440003', 'testuser'),
  ('880e8400-e29b-41d4-a716-446655440011', '660e8400-e29b-41d4-a716-446655440008', '770e8400-e29b-41d4-a716-446655440006', 'ETF Investment', -2000.00, 'expense', NOW() - INTERVAL '5 days', '550e8400-e29b-41d4-a716-446655440003', 'testuser')
ON CONFLICT (id) DO NOTHING;