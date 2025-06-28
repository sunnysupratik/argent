/*
  # Add user_id column mapping to all tables

  1. Schema Updates
    - Add user_id column to custom_users table (self-reference for consistency)
    - Add user_id column to profiles table (if not exists)
    - Add user_id column to accounts table (if not exists) 
    - Add user_id column to categories table (if not exists)
    - Add user_id column to transactions table (if not exists)

  2. Data Mapping
    - Update all existing records to have proper user_id mapping
    - Ensure data consistency across all tables

  3. Indexes
    - Add indexes on user_id columns for better query performance
*/

-- Add user_id column to custom_users table (self-reference for consistency)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'custom_users' AND column_name = 'user_id'
  ) THEN
    ALTER TABLE custom_users ADD COLUMN user_id uuid;
  END IF;
END $$;

-- Add user_id column to profiles table if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'profiles' AND column_name = 'user_id'
  ) THEN
    ALTER TABLE profiles ADD COLUMN user_id uuid;
  END IF;
END $$;

-- Add user_id column to accounts table if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'accounts' AND column_name = 'user_id'
  ) THEN
    ALTER TABLE accounts ADD COLUMN user_id uuid;
  END IF;
END $$;

-- Add user_id column to categories table if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'categories' AND column_name = 'user_id'
  ) THEN
    ALTER TABLE categories ADD COLUMN user_id uuid;
  END IF;
END $$;

-- Add user_id column to transactions table if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'transactions' AND column_name = 'user_id'
  ) THEN
    ALTER TABLE transactions ADD COLUMN user_id uuid;
  END IF;
END $$;

-- Update custom_users table to have self-referencing user_id
UPDATE custom_users SET user_id = id WHERE user_id IS NULL;

-- Update profiles table to have proper user_id mapping
UPDATE profiles 
SET user_id = custom_user_id 
WHERE user_id IS NULL AND custom_user_id IS NOT NULL;

-- Update accounts table to have proper user_id mapping
UPDATE accounts 
SET user_id = custom_user_id 
WHERE user_id IS NULL AND custom_user_id IS NOT NULL;

-- Update categories table to have proper user_id mapping
UPDATE categories 
SET user_id = custom_user_id 
WHERE user_id IS NULL AND custom_user_id IS NOT NULL;

-- Update transactions table to have proper user_id mapping
UPDATE transactions 
SET user_id = custom_user_id 
WHERE user_id IS NULL AND custom_user_id IS NOT NULL;

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_custom_users_user_id ON custom_users(user_id);
CREATE INDEX IF NOT EXISTS idx_profiles_user_id ON profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_accounts_user_id ON accounts(user_id);
CREATE INDEX IF NOT EXISTS idx_categories_user_id ON categories(user_id);
CREATE INDEX IF NOT EXISTS idx_transactions_user_id ON transactions(user_id);

-- Add foreign key constraints for data integrity (optional but recommended)
-- Note: We're not adding these as constraints since they might conflict with existing data structure
-- But the columns are now available for proper mapping

-- Verify the mapping by showing counts
DO $$
DECLARE
  table_name TEXT;
  user_count INTEGER;
  total_count INTEGER;
BEGIN
  RAISE NOTICE 'User ID mapping verification:';
  
  FOR table_name IN VALUES ('custom_users'), ('profiles'), ('accounts'), ('categories'), ('transactions') LOOP
    EXECUTE format('SELECT COUNT(*) FROM %I WHERE user_id IS NOT NULL', table_name) INTO user_count;
    EXECUTE format('SELECT COUNT(*) FROM %I', table_name) INTO total_count;
    
    RAISE NOTICE 'Table %: % out of % records have user_id mapped', table_name, user_count, total_count;
  END LOOP;
END $$;

-- Create a view for easy user data querying (optional)
CREATE OR REPLACE VIEW user_data_summary AS
SELECT 
  cu.id as user_id,
  cu.username,
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
LEFT JOIN profiles p ON p.user_id = cu.id
LEFT JOIN accounts a ON a.user_id = cu.id
LEFT JOIN transactions t ON t.user_id = cu.id
GROUP BY cu.id, cu.username, cu.full_name, cu.email, p.location, p.occupation, p.bio;

-- Grant access to the view
GRANT SELECT ON user_data_summary TO authenticated, anon;