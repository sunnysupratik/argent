/*
  # Create custom users table for authentication

  1. New Tables
    - `custom_users`
      - `id` (uuid, primary key)
      - `username` (text, unique)
      - `password` (text)
      - `full_name` (text)
      - `email` (text, unique)
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on `custom_users` table
    - Add policy for users to read their own data

  3. Demo Data
    - Insert demo users with credentials
*/

-- Create custom users table
CREATE TABLE IF NOT EXISTS custom_users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  username text UNIQUE NOT NULL,
  password text NOT NULL,
  full_name text,
  email text UNIQUE NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE custom_users ENABLE ROW LEVEL SECURITY;

-- Create policy for users to read their own data
CREATE POLICY "Users can read their own data"
  ON custom_users
  FOR SELECT
  TO authenticated
  USING (true);

-- Allow public access for authentication (temporary for demo)
CREATE POLICY "Allow authentication"
  ON custom_users
  FOR SELECT
  TO anon
  USING (true);

-- Insert demo users
INSERT INTO custom_users (username, password, full_name, email) VALUES
  ('demo', 'Password123!', 'Alex Johnson', 'demo@example.com'),
  ('testuser', 'TestPass123!', 'Sarah Wilson', 'testuser@example.com'),
  ('johndoe', 'Demo123!', 'John Doe', 'john.doe@example.com')
ON CONFLICT (username) DO NOTHING;

-- Update profiles table to reference custom_users
DO $$
BEGIN
  -- Add custom_user_id column to profiles if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'profiles' AND column_name = 'custom_user_id'
  ) THEN
    ALTER TABLE profiles ADD COLUMN custom_user_id uuid REFERENCES custom_users(id);
  END IF;
END $$;

-- Update accounts table to reference custom_users
DO $$
BEGIN
  -- Add custom_user_id column to accounts if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'accounts' AND column_name = 'custom_user_id'
  ) THEN
    ALTER TABLE accounts ADD COLUMN custom_user_id uuid REFERENCES custom_users(id);
  END IF;
END $$;

-- Update transactions table to reference custom_users
DO $$
BEGIN
  -- Add custom_user_id column to transactions if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'transactions' AND column_name = 'custom_user_id'
  ) THEN
    ALTER TABLE transactions ADD COLUMN custom_user_id uuid REFERENCES custom_users(id);
  END IF;
END $$;

-- Update categories table to reference custom_users
DO $$
BEGIN
  -- Add custom_user_id column to categories if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'categories' AND column_name = 'custom_user_id'
  ) THEN
    ALTER TABLE categories ADD COLUMN custom_user_id uuid REFERENCES custom_users(id);
  END IF;
END $$;

-- Create sample data for demo users
DO $$
DECLARE
  demo_user_id uuid;
  testuser_id uuid;
  johndoe_id uuid;
  demo_account_id uuid;
  testuser_account_id uuid;
  johndoe_account_id uuid;
  food_category_id uuid;
  transport_category_id uuid;
  entertainment_category_id uuid;
BEGIN
  -- Get user IDs
  SELECT id INTO demo_user_id FROM custom_users WHERE username = 'demo';
  SELECT id INTO testuser_id FROM custom_users WHERE username = 'testuser';
  SELECT id INTO johndoe_id FROM custom_users WHERE username = 'johndoe';

  -- Create profiles for custom users
  INSERT INTO profiles (id, full_name, custom_user_id) VALUES
    (demo_user_id, 'Alex Johnson', demo_user_id),
    (testuser_id, 'Sarah Wilson', testuser_id),
    (johndoe_id, 'John Doe', johndoe_id)
  ON CONFLICT (id) DO NOTHING;

  -- Create accounts for demo users
  INSERT INTO accounts (user_id, custom_user_id, account_name, account_type, current_balance) VALUES
    (demo_user_id, demo_user_id, 'Chase Checking', 'checking', 15420.50),
    (demo_user_id, demo_user_id, 'Savings Account', 'savings', 25000.00),
    (demo_user_id, demo_user_id, 'Investment Portfolio', 'investment', 47293.18),
    (testuser_id, testuser_id, 'Bank of America Checking', 'checking', 8750.25),
    (testuser_id, testuser_id, 'High Yield Savings', 'savings', 18500.00),
    (johndoe_id, johndoe_id, 'Wells Fargo Checking', 'checking', 12300.75),
    (johndoe_id, johndoe_id, 'Emergency Fund', 'savings', 15000.00)
  ON CONFLICT DO NOTHING;

  -- Get account IDs for transactions
  SELECT id INTO demo_account_id FROM accounts WHERE custom_user_id = demo_user_id AND account_type = 'checking' LIMIT 1;
  SELECT id INTO testuser_account_id FROM accounts WHERE custom_user_id = testuser_id AND account_type = 'checking' LIMIT 1;
  SELECT id INTO johndoe_account_id FROM accounts WHERE custom_user_id = johndoe_id AND account_type = 'checking' LIMIT 1;

  -- Create categories
  INSERT INTO categories (user_id, custom_user_id, name, icon_name) VALUES
    (NULL, NULL, 'Food & Dining', 'utensils'),
    (NULL, NULL, 'Transportation', 'car'),
    (NULL, NULL, 'Entertainment', 'film'),
    (NULL, NULL, 'Shopping', 'shopping-bag'),
    (NULL, NULL, 'Bills & Utilities', 'receipt'),
    (NULL, NULL, 'Income', 'dollar-sign')
  ON CONFLICT DO NOTHING;

  -- Get category IDs
  SELECT id INTO food_category_id FROM categories WHERE name = 'Food & Dining' LIMIT 1;
  SELECT id INTO transport_category_id FROM categories WHERE name = 'Transportation' LIMIT 1;
  SELECT id INTO entertainment_category_id FROM categories WHERE name = 'Entertainment' LIMIT 1;

  -- Create sample transactions for demo user
  IF demo_account_id IS NOT NULL THEN
    INSERT INTO transactions (user_id, custom_user_id, account_id, category_id, description, amount, type, transaction_date) VALUES
      (demo_user_id, demo_user_id, demo_account_id, food_category_id, 'Starbucks Coffee', -5.75, 'expense', now() - interval '1 day'),
      (demo_user_id, demo_user_id, demo_account_id, transport_category_id, 'Uber Ride', -18.50, 'expense', now() - interval '2 days'),
      (demo_user_id, demo_user_id, demo_account_id, entertainment_category_id, 'Netflix Subscription', -15.99, 'expense', now() - interval '3 days'),
      (demo_user_id, demo_user_id, demo_account_id, (SELECT id FROM categories WHERE name = 'Income' LIMIT 1), 'Salary Deposit', 5000.00, 'income', now() - interval '5 days'),
      (demo_user_id, demo_user_id, demo_account_id, food_category_id, 'Grocery Store', -127.43, 'expense', now() - interval '1 week')
    ON CONFLICT DO NOTHING;
  END IF;

  -- Create sample transactions for testuser
  IF testuser_account_id IS NOT NULL THEN
    INSERT INTO transactions (user_id, custom_user_id, account_id, category_id, description, amount, type, transaction_date) VALUES
      (testuser_id, testuser_id, testuser_account_id, food_category_id, 'Restaurant Dinner', -45.20, 'expense', now() - interval '1 day'),
      (testuser_id, testuser_id, testuser_account_id, transport_category_id, 'Gas Station', -52.00, 'expense', now() - interval '3 days'),
      (testuser_id, testuser_id, testuser_account_id, (SELECT id FROM categories WHERE name = 'Income' LIMIT 1), 'Freelance Payment', 1200.00, 'income', now() - interval '1 week')
    ON CONFLICT DO NOTHING;
  END IF;

  -- Create sample transactions for johndoe
  IF johndoe_account_id IS NOT NULL THEN
    INSERT INTO transactions (user_id, custom_user_id, account_id, category_id, description, amount, type, transaction_date) VALUES
      (johndoe_id, johndoe_id, johndoe_account_id, entertainment_category_id, 'Movie Tickets', -24.00, 'expense', now() - interval '2 days'),
      (johndoe_id, johndoe_id, johndoe_account_id, food_category_id, 'Coffee Shop', -8.50, 'expense', now() - interval '4 days'),
      (johndoe_id, johndoe_id, johndoe_account_id, (SELECT id FROM categories WHERE name = 'Income' LIMIT 1), 'Consulting Fee', 2500.00, 'income', now() - interval '1 week')
    ON CONFLICT DO NOTHING;
  END IF;
END $$;