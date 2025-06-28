/*
  # Rollback user_id column additions

  1. Remove user_id columns from all tables
  2. Drop indexes created for user_id columns
  3. Drop the user_data_summary view
  4. Clean up any constraints or references

  This migration undoes the previous user_id mapping changes.
*/

-- Drop the user_data_summary view
DROP VIEW IF EXISTS user_data_summary;

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
  
  RAISE NOTICE 'Rollback completed. Database structure restored to previous state.';
END $$;