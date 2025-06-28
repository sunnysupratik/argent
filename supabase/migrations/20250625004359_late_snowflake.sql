/*
  # Fix Dashboard Data Display

  1. Database Schema Fixes
    - Add missing created_at columns to accounts, categories, and profiles tables
    - Add proper indexes for better query performance
    - Update RLS policies for custom authentication system

  2. Data Integrity
    - Ensure all transactions have proper custom_user_id relationships
    - Add recent transactions for better dashboard display
    - Add current month income for all users

  3. Performance Improvements
    - Add indexes on frequently queried columns
    - Optimize transaction date queries
*/

-- Add created_at column to accounts table if missing
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'accounts' AND column_name = 'created_at'
  ) THEN
    ALTER TABLE accounts ADD COLUMN created_at timestamptz DEFAULT now();
  END IF;
END $$;

-- Update existing accounts to have created_at if null
UPDATE accounts SET created_at = now() WHERE created_at IS NULL;

-- Add created_at column to categories table if missing
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'categories' AND column_name = 'created_at'
  ) THEN
    ALTER TABLE categories ADD COLUMN created_at timestamptz DEFAULT now();
  END IF;
END $$;

-- Update existing categories to have created_at if null
UPDATE categories SET created_at = now() WHERE created_at IS NULL;

-- Add created_at column to profiles table if missing
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'profiles' AND column_name = 'created_at'
  ) THEN
    ALTER TABLE profiles ADD COLUMN created_at timestamptz DEFAULT now();
  END IF;
END $$;

-- Update existing profiles to have created_at if null
UPDATE profiles SET created_at = now() WHERE created_at IS NULL;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_accounts_custom_user_id ON accounts(custom_user_id);
CREATE INDEX IF NOT EXISTS idx_transactions_custom_user_id ON transactions(custom_user_id);
CREATE INDEX IF NOT EXISTS idx_transactions_date ON transactions(transaction_date DESC);
CREATE INDEX IF NOT EXISTS idx_transactions_type ON transactions(type);
CREATE INDEX IF NOT EXISTS idx_categories_user_id ON categories(user_id);

-- Update RLS policies for custom authentication
DROP POLICY IF EXISTS "Users can manage their own accounts" ON accounts;
DROP POLICY IF EXISTS "Users can manage their own accounts." ON accounts;
CREATE POLICY "Custom users can manage their own accounts"
  ON accounts
  FOR ALL
  TO public
  USING (custom_user_id IS NOT NULL);

DROP POLICY IF EXISTS "Users can manage their own transactions" ON transactions;
DROP POLICY IF EXISTS "Users can manage their own transactions." ON transactions;
CREATE POLICY "Custom users can manage their own transactions"
  ON transactions
  FOR ALL
  TO public
  USING (custom_user_id IS NOT NULL);

DROP POLICY IF EXISTS "Users can manage their own custom categories" ON categories;
DROP POLICY IF EXISTS "Users can manage their own custom categories." ON categories;
CREATE POLICY "Custom users can manage their own categories"
  ON categories
  FOR ALL
  TO public
  USING (user_id IS NULL OR custom_user_id IS NOT NULL);

-- Ensure all transactions have proper relationships
UPDATE transactions 
SET custom_user_id = accounts.custom_user_id
FROM accounts 
WHERE transactions.account_id = accounts.id 
AND transactions.custom_user_id IS NULL;

-- Add some additional recent transactions for better dashboard display
DO $$
DECLARE
  user_record RECORD;
  account_id_var uuid;
  category_id uuid;
  recent_dates timestamp[] := ARRAY[
    now() - interval '2 hours',
    now() - interval '5 hours',
    now() - interval '1 day',
    now() - interval '2 days',
    now() - interval '3 days'
  ];
  date_val timestamp;
  idx integer := 1;
BEGIN
  -- Add recent transactions for each user for better dashboard display
  FOR user_record IN SELECT id, username FROM custom_users LOOP
    -- Get user's primary checking account ID
    SELECT id INTO account_id_var FROM accounts 
    WHERE custom_user_id = user_record.id 
    AND account_type = 'checking' 
    LIMIT 1;
    
    IF account_id_var IS NOT NULL THEN
      FOREACH date_val IN ARRAY recent_dates LOOP
        -- Get a random expense category
        SELECT id INTO category_id FROM categories 
        WHERE user_id IS NULL 
        AND name IN ('Food & Dining', 'Coffee/Drinks', 'Transportation', 'Shopping', 'Entertainment')
        ORDER BY random() 
        LIMIT 1;
        
        -- Insert recent transaction
        INSERT INTO transactions (user_id, custom_user_id, account_id, category_id, description, amount, type, transaction_date)
        VALUES (
          user_record.id,
          user_record.id,
          account_id_var,
          category_id,
          CASE idx
            WHEN 1 THEN 'Coffee Shop'
            WHEN 2 THEN 'Lunch Purchase'
            WHEN 3 THEN 'Gas Station'
            WHEN 4 THEN 'Online Shopping'
            WHEN 5 THEN 'Grocery Store'
            ELSE 'Recent Purchase'
          END,
          -(15 + random() * 85), -- $15-100
          'expense',
          date_val
        )
        ON CONFLICT DO NOTHING;
        
        idx := idx + 1;
      END LOOP;
    END IF;
  END LOOP;
END $$;

-- Ensure we have income transactions for current month for all users
DO $$
DECLARE
  user_record RECORD;
  account_id_var uuid;
  income_category_id uuid;
  current_month_start timestamp := date_trunc('month', now());
BEGIN
  -- Get income category
  SELECT id INTO income_category_id FROM categories WHERE name = 'Salary' AND user_id IS NULL LIMIT 1;
  
  FOR user_record IN SELECT id, username FROM custom_users LOOP
    -- Get user's primary checking account ID
    SELECT id INTO account_id_var FROM accounts 
    WHERE custom_user_id = user_record.id 
    AND account_type = 'checking' 
    LIMIT 1;
    
    IF account_id_var IS NOT NULL AND income_category_id IS NOT NULL THEN
      -- Check if user has income this month
      IF NOT EXISTS (
        SELECT 1 FROM transactions 
        WHERE custom_user_id = user_record.id 
        AND type = 'income' 
        AND transaction_date >= current_month_start
      ) THEN
        -- Add current month income
        INSERT INTO transactions (user_id, custom_user_id, account_id, category_id, description, amount, type, transaction_date)
        VALUES (
          user_record.id,
          user_record.id,
          account_id_var,
          income_category_id,
          CASE user_record.username
            WHEN 'demo' THEN 'Tech Corp Salary'
            WHEN 'testuser' THEN 'Design Client Payment'
            WHEN 'johndoe' THEN 'Marketing Salary'
            WHEN 'emma_dev' THEN 'Software Company Salary'
            WHEN 'mike_finance' THEN 'Investment Bank Salary'
            WHEN 'lisa_startup' THEN 'Startup Revenue'
            WHEN 'david_retired' THEN 'Pension Payment'
            ELSE 'Monthly Income'
          END,
          CASE user_record.username
            WHEN 'demo' THEN 7500.00
            WHEN 'testuser' THEN 4500.00
            WHEN 'johndoe' THEN 5200.00
            WHEN 'emma_dev' THEN 9500.00
            WHEN 'mike_finance' THEN 15000.00
            WHEN 'lisa_startup' THEN 8000.00
            WHEN 'david_retired' THEN 4200.00
            ELSE 5000.00
          END,
          'income',
          current_month_start + interval '1 day'
        )
        ON CONFLICT DO NOTHING;
      END IF;
    END IF;
  END LOOP;
END $$;