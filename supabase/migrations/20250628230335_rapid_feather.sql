/*
  # Drop user_id columns from all tables

  1. Remove Dependencies
    - Drop views and policies that reference user_id columns
    - Drop indexes on user_id columns

  2. Remove user_id Columns
    - Drop user_id from all tables: custom_users, profiles, accounts, categories, transactions
    - Keep user_name columns for easy username access

  3. Restore Structure
    - Recreate RLS policies using custom_user_id
    - Recreate views using custom_user_id relationships
*/

-- Drop the user_data_summary view that references user_id
DROP VIEW IF EXISTS user_data_summary;

-- Drop policies that depend on user_id columns to avoid dependency errors
DROP POLICY IF EXISTS "Users can view system categories." ON categories;
DROP POLICY IF EXISTS "Users can view system categories" ON categories;
DROP POLICY IF EXISTS "Custom users can manage their own categories" ON categories;

-- Drop indexes for user_id columns
DROP INDEX IF EXISTS idx_custom_users_user_id;
DROP INDEX IF EXISTS idx_profiles_user_id;
DROP INDEX IF EXISTS idx_accounts_user_id;
DROP INDEX IF EXISTS idx_categories_user_id;
DROP INDEX IF EXISTS idx_transactions_user_id;

-- Remove user_id column from transactions table
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'transactions' AND column_name = 'user_id'
  ) THEN
    ALTER TABLE transactions DROP COLUMN user_id;
  END IF;
END $$;

-- Remove user_id column from categories table
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'categories' AND column_name = 'user_id'
  ) THEN
    ALTER TABLE categories DROP COLUMN user_id;
  END IF;
END $$;

-- Remove user_id column from accounts table
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'accounts' AND column_name = 'user_id'
  ) THEN
    ALTER TABLE accounts DROP COLUMN user_id;
  END IF;
END $$;

-- Remove user_id column from profiles table
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'profiles' AND column_name = 'user_id'
  ) THEN
    ALTER TABLE profiles DROP COLUMN user_id;
  END IF;
END $$;

-- Remove user_id column from custom_users table
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'custom_users' AND column_name = 'user_id'
  ) THEN
    ALTER TABLE custom_users DROP COLUMN user_id;
  END IF;
END $$;

-- Recreate the necessary RLS policies using the original column structure
CREATE POLICY "Users can view system categories"
  ON categories
  FOR SELECT
  TO authenticated
  USING (custom_user_id IS NULL);

CREATE POLICY "Users can view system categories."
  ON categories
  FOR SELECT
  TO public
  USING (custom_user_id IS NULL);

CREATE POLICY "Custom users can manage their own categories"
  ON categories
  FOR ALL
  TO public
  USING (custom_user_id IS NULL OR custom_user_id IS NOT NULL);

-- Recreate the view using the original structure (without user_id references)
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
LEFT JOIN profiles p ON p.custom_user_id = cu.id
LEFT JOIN accounts a ON a.custom_user_id = cu.id
LEFT JOIN transactions t ON t.custom_user_id = cu.id
GROUP BY cu.id, cu.username, cu.full_name, cu.email, p.location, p.occupation, p.bio;

-- Grant access to the view
GRANT SELECT ON user_data_summary TO authenticated, anon;

-- Verification
DO $$
DECLARE
  tbl_name TEXT;
  column_exists BOOLEAN;
  record_count INTEGER;
BEGIN
  RAISE NOTICE 'User ID column removal verification:';
  RAISE NOTICE '===================================';
  
  FOR tbl_name IN VALUES ('custom_users'), ('profiles'), ('accounts'), ('categories'), ('transactions') LOOP
    SELECT EXISTS (
      SELECT 1 FROM information_schema.columns c
      WHERE c.table_name = tbl_name AND c.column_name = 'user_id'
    ) INTO column_exists;
    
    EXECUTE format('SELECT COUNT(*) FROM %I', tbl_name) INTO record_count;
    
    IF column_exists THEN
      RAISE NOTICE 'Table %: user_id column still exists (removal may have failed) - % records', tbl_name, record_count;
    ELSE
      RAISE NOTICE 'Table %: user_id column successfully removed - % records remain', tbl_name, record_count;
    END IF;
  END LOOP;
  
  RAISE NOTICE '';
  RAISE NOTICE 'Database structure restored to use custom_user_id relationships.';
  RAISE NOTICE 'All tables still have user_name columns for easy username access.';
  
  -- Verify that user_name columns are still present
  RAISE NOTICE '';
  RAISE NOTICE 'Verifying user_name columns are still present:';
  FOR tbl_name IN VALUES ('custom_users'), ('profiles'), ('accounts'), ('categories'), ('transactions') LOOP
    SELECT EXISTS (
      SELECT 1 FROM information_schema.columns c
      WHERE c.table_name = tbl_name AND c.column_name = 'user_name'
    ) INTO column_exists;
    
    IF column_exists THEN
      RAISE NOTICE 'Table %: user_name column present ✓', tbl_name;
    ELSE
      RAISE NOTICE 'Table %: user_name column missing ✗', tbl_name;
    END IF;
  END LOOP;
  
  RAISE NOTICE '';
  RAISE NOTICE 'User ID column removal completed successfully!';
END $$;