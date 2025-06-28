/*
  # Add username column to all tables

  1. New Columns
    - Add `username` column to all 6 tables
    - Map usernames from custom_users table based on relationships

  2. Data Mapping
    - custom_users: username = username (direct)
    - profiles: username from custom_users via custom_user_id
    - accounts: username from custom_users via custom_user_id
    - categories: username from custom_users via custom_user_id (NULL for system categories)
    - transactions: username from custom_users via custom_user_id

  3. Performance
    - Add indexes on username columns
    - Provide verification and sample data
*/

-- Add username column to custom_users table (redundant but for consistency)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'custom_users' AND column_name = 'user_name'
  ) THEN
    ALTER TABLE custom_users ADD COLUMN user_name text;
  END IF;
END $$;

-- Add username column to profiles table
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'profiles' AND column_name = 'user_name'
  ) THEN
    ALTER TABLE profiles ADD COLUMN user_name text;
  END IF;
END $$;

-- Add username column to accounts table
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'accounts' AND column_name = 'user_name'
  ) THEN
    ALTER TABLE accounts ADD COLUMN user_name text;
  END IF;
END $$;

-- Add username column to categories table
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'categories' AND column_name = 'user_name'
  ) THEN
    ALTER TABLE categories ADD COLUMN user_name text;
  END IF;
END $$;

-- Add username column to transactions table
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

-- Verify the username mapping by showing counts and sample data
DO $$
DECLARE
  table_name TEXT;
  username_count INTEGER;
  total_count INTEGER;
  null_count INTEGER;
  sample_record RECORD;
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
    RAISE NOTICE '';
  END LOOP;
  
  RAISE NOTICE 'Sample username data from each table:';
  RAISE NOTICE '====================================';
  
  -- Sample from custom_users
  FOR sample_record IN 
    SELECT user_name, full_name FROM custom_users WHERE user_name IS NOT NULL LIMIT 3
  LOOP
    RAISE NOTICE 'custom_users: % (%)', sample_record.user_name, sample_record.full_name;
  END LOOP;
  
  -- Sample from profiles
  FOR sample_record IN 
    SELECT user_name, full_name FROM profiles WHERE user_name IS NOT NULL LIMIT 3
  LOOP
    RAISE NOTICE 'profiles: % (%)', sample_record.user_name, sample_record.full_name;
  END LOOP;
  
  -- Sample from accounts
  FOR sample_record IN 
    SELECT user_name, account_name, account_type FROM accounts WHERE user_name IS NOT NULL LIMIT 3
  LOOP
    RAISE NOTICE 'accounts: % (% - %)', sample_record.user_name, sample_record.account_name, sample_record.account_type;
  END LOOP;
  
  -- Sample from categories (user categories only)
  FOR sample_record IN 
    SELECT user_name, name FROM categories WHERE user_name IS NOT NULL LIMIT 3
  LOOP
    RAISE NOTICE 'categories: % (%)', sample_record.user_name, sample_record.name;
  END LOOP;
  
  -- Sample from transactions
  FOR sample_record IN 
    SELECT user_name, description, amount FROM transactions WHERE user_name IS NOT NULL LIMIT 3
  LOOP
    RAISE NOTICE 'transactions: % (% - $%)', sample_record.user_name, sample_record.description, sample_record.amount;
  END LOOP;
  
  RAISE NOTICE '';
  RAISE NOTICE 'Username mapping completed successfully!';
  RAISE NOTICE 'All tables now have user_name column with proper username mapping.';
END $$;

-- Create an updated view that includes usernames
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
LEFT JOIN profiles p ON p.user_name = cu.username
LEFT JOIN accounts a ON a.user_name = cu.username
LEFT JOIN transactions t ON t.user_name = cu.username
GROUP BY cu.id, cu.username, cu.user_name, cu.full_name, cu.email, p.location, p.occupation, p.bio;

-- Grant access to the new view
GRANT SELECT ON user_data_with_names TO authenticated, anon;

-- Show final summary
DO $$
DECLARE
  user_summary RECORD;
BEGIN
  RAISE NOTICE 'Final username summary by user:';
  RAISE NOTICE '==============================';
  
  FOR user_summary IN 
    SELECT username, user_name, full_name, account_count, transaction_count
    FROM user_data_with_names 
    ORDER BY username 
  LOOP
    RAISE NOTICE 'Username: % | Name: % | Full Name: % | Accounts: % | Transactions: %', 
      user_summary.username,
      user_summary.user_name,
      user_summary.full_name, 
      user_summary.account_count, 
      user_summary.transaction_count;
  END LOOP;
END $$;