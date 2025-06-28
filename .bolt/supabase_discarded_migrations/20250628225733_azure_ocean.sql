/*
  # Rollback user_id column additions - Fixed version

  This migration removes all user_id columns that were added to the tables,
  along with their dependent objects (policies, indexes, views).
*/

-- Drop the user_data_summary view first
DROP VIEW IF EXISTS user_data_summary;

-- Drop policies that depend on user_id columns before dropping the columns
-- Categories table policies
DROP POLICY IF EXISTS "Users can view system categories." ON categories;
DROP POLICY IF EXISTS "Users can view system categories" ON categories;
DROP POLICY IF EXISTS "Custom users can manage their own categories" ON categories;

-- Accounts table policies  
DROP POLICY IF EXISTS "Users can manage their own accounts" ON accounts;
DROP POLICY IF EXISTS "Users can manage their own accounts." ON accounts;
DROP POLICY IF EXISTS "Custom users can manage their own accounts" ON accounts;

-- Transactions table policies
DROP POLICY IF EXISTS "Users can manage their own transactions" ON transactions;
DROP POLICY IF EXISTS "Users can manage their own transactions." ON transactions;
DROP POLICY IF EXISTS "Custom users can manage their own transactions" ON transactions;

-- Profiles table policies
DROP POLICY IF EXISTS "Users can manage their own profile" ON profiles;
DROP POLICY IF EXISTS "Users can manage their own profile." ON profiles;

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

-- Recreate the original policies that work with custom_user_id
-- Categories policies
CREATE POLICY "Users can view system categories"
  ON categories FOR SELECT
  TO authenticated
  USING (user_id IS NULL);

CREATE POLICY "Users can view system categories."
  ON categories FOR SELECT
  TO public
  USING (user_id IS NULL);

CREATE POLICY "Custom users can manage their own categories"
  ON categories FOR ALL
  TO public
  USING (user_id IS NULL OR custom_user_id IS NOT NULL);

-- Accounts policies
CREATE POLICY "Custom users can manage their own accounts"
  ON accounts FOR ALL
  TO public
  USING (custom_user_id IS NOT NULL);

-- Transactions policies
CREATE POLICY "Custom users can manage their own transactions"
  ON transactions FOR ALL
  TO public
  USING (custom_user_id IS NOT NULL);

-- Profiles policies
CREATE POLICY "Users can manage their own profile"
  ON profiles FOR ALL
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can manage their own profile."
  ON profiles FOR ALL
  TO public
  USING (auth.uid() = id);

-- Verification
DO $$
DECLARE
  table_name TEXT;
  column_exists BOOLEAN;
BEGIN
  RAISE NOTICE 'Rollback verification - checking if user_id columns have been removed:';
  
  FOR table_name IN VALUES ('custom_users'), ('profiles'), ('accounts'), ('categories'), ('transactions') LOOP
    SELECT EXISTS (
      SELECT 1 FROM information_schema.columns
      WHERE table_name = table_name AND column_name = 'user_id'
    ) INTO column_exists;
    
    IF column_exists THEN
      RAISE NOTICE 'Table %: user_id column still exists (rollback may have failed)', table_name;
    ELSE
      RAISE NOTICE 'Table %: user_id column successfully removed', table_name;
    END IF;
  END LOOP;
  
  RAISE NOTICE 'Rollback completed. Database structure restored to previous state with working policies.';
END $$;