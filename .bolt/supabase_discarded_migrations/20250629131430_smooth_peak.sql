/*
  # Add user_name column to all tables for consistent data access

  1. Schema Updates
    - Add user_name column to all tables if it doesn't exist already
    - Populate user_name values from custom_users table
    - Create indexes for better query performance

  2. Data Consistency
    - Ensure all records have proper user_name values
    - Maintain existing functionality
    - Improve query performance for username-based lookups

  3. Views
    - Update user_data_with_names view to use user_name column
*/

-- Add user_name column to custom_users table if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'custom_users' AND column_name = 'user_name'
  ) THEN
    ALTER TABLE custom_users ADD COLUMN user_name text;
  END IF;
END $$;

-- Add user_name column to profiles table if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'profiles' AND column_name = 'user_name'
  ) THEN
    ALTER TABLE profiles ADD COLUMN user_name text;
  END IF;
END $$;

-- Add user_name column to accounts table if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'accounts' AND column_name = 'user_name'
  ) THEN
    ALTER TABLE accounts ADD COLUMN user_name text;
  END IF;
END $$;

-- Add user_name column to categories table if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'categories' AND column_name = 'user_name'
  ) THEN
    ALTER TABLE categories ADD COLUMN user_name text;
  END IF;
END $$;

-- Add user_name column to transactions table if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'transactions' AND column_name = 'user_name'
  ) THEN
    ALTER TABLE transactions ADD COLUMN user_name text;
  END IF;
END $$;

-- Update custom_users table with username (redundant but for consistency)
UPDATE custom_users SET user_name = username WHERE user_name IS NULL;

-- Update profiles table with username from custom_users
UPDATE profiles 
SET user_name = cu.username
FROM custom_users cu
WHERE profiles.custom_user_id = cu.id 
AND profiles.user_name IS NULL;

-- Update accounts table with username from custom_users
UPDATE accounts 
SET user_name = cu.username
FROM custom_users cu
WHERE accounts.custom_user_id = cu.id 
AND accounts.user_name IS NULL;

-- Update categories table with username from custom_users (only for user categories, not system)
UPDATE categories 
SET user_name = cu.username
FROM custom_users cu
WHERE categories.custom_user_id = cu.id 
AND categories.user_name IS NULL;

-- Update transactions table with username from custom_users
UPDATE transactions 
SET user_name = cu.username
FROM custom_users cu
WHERE transactions.custom_user_id = cu.id 
AND transactions.user_name IS NULL;

-- Create indexes for better query performance on username columns
CREATE INDEX IF NOT EXISTS idx_custom_users_user_name ON custom_users(user_name);
CREATE INDEX IF NOT EXISTS idx_profiles_user_name ON profiles(user_name);
CREATE INDEX IF NOT EXISTS idx_accounts_user_name ON accounts(user_name);
CREATE INDEX IF NOT EXISTS idx_categories_user_name ON categories(user_name);
CREATE INDEX IF NOT EXISTS idx_transactions_user_name ON transactions(user_name);

-- Verify the username mapping by showing counts
DO $$
DECLARE
  table_name TEXT;
  username_count INTEGER;
  total_count INTEGER;
  null_count INTEGER;
BEGIN
  RAISE NOTICE 'Username mapping verification:';
  RAISE NOTICE '==============================';
  
  FOR table_name IN VALUES ('custom_users'), ('profiles'), ('accounts'), ('categories'), ('transactions') LOOP
    EXECUTE format('SELECT COUNT(*) FROM %I WHERE user_name IS NOT NULL', table_name) INTO username_count;
    EXECUTE format('SELECT COUNT(*) FROM %I WHERE user_name IS NULL', table_name) INTO null_count;
    EXECUTE format('SELECT COUNT(*) FROM %I', table_name) INTO total_count;
    
    RAISE NOTICE 'Table %:', table_name;
    RAISE NOTICE '  - Total records: %', total_count;
    RAISE NOTICE '  - With username: %', username_count;
    RAISE NOTICE '  - NULL username: % %', null_count, 
      CASE WHEN table_name = 'categories' THEN '(system categories)' ELSE '' END;
  END LOOP;
  
  RAISE NOTICE '';
  RAISE NOTICE 'Username mapping completed successfully!';
END $$;

-- Create or update the user_data_with_names view
CREATE OR REPLACE VIEW user_data_with_names AS
SELECT 
  cu.id as user_id,
  cu.username,
  cu.user_name,
  cu.full_name,
  cu.email,
  p.location,
  p.occupation,
  p.bio,
  COUNT(DISTINCT a.id) as account_count,
  COUNT(DISTINCT t.id) as transaction_count,
  COALESCE(SUM(CASE WHEN a.account_type = 'checking' THEN a.current_balance ELSE 0 END), 0) as checking_balance,
  COALESCE(SUM(CASE WHEN a.account_type = 'savings' THEN a.current_balance ELSE 0 END), 0) as savings_balance,
  COALESCE(SUM(CASE WHEN a.account_type = 'investment' THEN a.current_balance ELSE 0 END), 0) as investment_balance
FROM custom_users cu
LEFT JOIN profiles p ON p.custom_user_id = cu.id
LEFT JOIN accounts a ON a.custom_user_id = cu.id
LEFT JOIN transactions t ON t.custom_user_id = cu.id
GROUP BY cu.id, cu.username, cu.user_name, cu.full_name, cu.email, p.location, p.occupation, p.bio;

-- Grant access to the view
GRANT SELECT ON user_data_with_names TO authenticated, anon;