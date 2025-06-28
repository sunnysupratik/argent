/*
  # Fix User Data Consistency Issues

  1. Data Verification and Cleanup
    - Verify all users have proper custom_user_id relationships
    - Ensure all accounts and transactions are properly linked
    - Fix any orphaned records

  2. Enhanced Debugging
    - Add comprehensive logging for data relationships
    - Verify data integrity across all tables

  3. User Data Consistency
    - Ensure demo, testuser, and johndoe all have complete data sets
    - Verify custom_user_id foreign key relationships
*/

-- First, let's check the current state of our data
DO $$
DECLARE
  user_record RECORD;
  account_count INTEGER;
  transaction_count INTEGER;
BEGIN
  RAISE NOTICE 'Starting data consistency check...';
  
  -- Check each user's data
  FOR user_record IN SELECT id, username, full_name FROM custom_users ORDER BY username LOOP
    -- Count accounts
    SELECT COUNT(*) INTO account_count FROM accounts WHERE custom_user_id = user_record.id;
    
    -- Count transactions
    SELECT COUNT(*) INTO transaction_count FROM transactions WHERE custom_user_id = user_record.id;
    
    RAISE NOTICE 'User: % (ID: %) - Accounts: %, Transactions: %', 
      user_record.username, user_record.id, account_count, transaction_count;
  END LOOP;
END $$;

-- Fix any missing custom_user_id relationships in accounts
UPDATE accounts 
SET custom_user_id = user_id 
WHERE custom_user_id IS NULL 
AND user_id IN (SELECT id FROM custom_users);

-- Fix any missing custom_user_id relationships in transactions
UPDATE transactions 
SET custom_user_id = user_id 
WHERE custom_user_id IS NULL 
AND user_id IN (SELECT id FROM custom_users);

-- Ensure all demo users have proper profile data
INSERT INTO profiles (id, full_name, custom_user_id, location, occupation, bio)
SELECT 
  cu.id,
  cu.full_name,
  cu.id,
  CASE cu.username
    WHEN 'demo' THEN 'New York, NY'
    WHEN 'testuser' THEN 'Los Angeles, CA'
    WHEN 'johndoe' THEN 'San Francisco, CA'
    WHEN 'emma_dev' THEN 'Seattle, WA'
    WHEN 'mike_finance' THEN 'Chicago, IL'
    WHEN 'lisa_startup' THEN 'Austin, TX'
    WHEN 'david_retired' THEN 'Miami, FL'
    ELSE 'Unknown'
  END,
  CASE cu.username
    WHEN 'demo' THEN 'UX Designer'
    WHEN 'testuser' THEN 'Freelance Designer'
    WHEN 'johndoe' THEN 'Software Engineer'
    WHEN 'emma_dev' THEN 'Senior Developer'
    WHEN 'mike_finance' THEN 'Finance Executive'
    WHEN 'lisa_startup' THEN 'Startup Founder'
    WHEN 'david_retired' THEN 'Retired'
    ELSE 'Professional'
  END,
  CASE cu.username
    WHEN 'demo' THEN 'Creative UX designer focused on user-centered design and digital experiences.'
    WHEN 'testuser' THEN 'Independent designer specializing in brand identity and digital marketing materials.'
    WHEN 'johndoe' THEN 'Passionate software engineer specializing in full-stack development. Based in San Francisco, working on innovative fintech solutions.'
    WHEN 'emma_dev' THEN 'Senior software developer with expertise in React and Node.js.'
    WHEN 'mike_finance' THEN 'Finance executive with 15+ years in investment banking.'
    WHEN 'lisa_startup' THEN 'Tech entrepreneur building the next generation of SaaS tools.'
    WHEN 'david_retired' THEN 'Retired professional enjoying life and managing investments.'
    ELSE 'Professional with diverse experience.'
  END
FROM custom_users cu
WHERE NOT EXISTS (SELECT 1 FROM profiles p WHERE p.id = cu.id)
ON CONFLICT (id) DO UPDATE SET
  full_name = EXCLUDED.full_name,
  custom_user_id = EXCLUDED.custom_user_id,
  location = EXCLUDED.location,
  occupation = EXCLUDED.occupation,
  bio = EXCLUDED.bio;

-- Ensure all users have at least basic accounts
DO $$
DECLARE
  user_record RECORD;
  account_count INTEGER;
BEGIN
  FOR user_record IN SELECT id, username FROM custom_users LOOP
    -- Check if user has any accounts
    SELECT COUNT(*) INTO account_count FROM accounts WHERE custom_user_id = user_record.id;
    
    IF account_count = 0 THEN
      RAISE NOTICE 'Creating accounts for user: %', user_record.username;
      
      -- Create basic accounts for users without any
      INSERT INTO accounts (user_id, custom_user_id, account_name, account_type, current_balance) VALUES
        (user_record.id, user_record.id, 'Primary Checking', 'checking', 
          CASE user_record.username
            WHEN 'demo' THEN 8420.50
            WHEN 'testuser' THEN 6750.25
            WHEN 'johndoe' THEN 8750.25
            WHEN 'emma_dev' THEN 12500.00
            WHEN 'mike_finance' THEN 25000.00
            WHEN 'lisa_startup' THEN 18750.00
            WHEN 'david_retired' THEN 8500.00
            ELSE 5000.00
          END),
        (user_record.id, user_record.id, 'Savings Account', 'savings',
          CASE user_record.username
            WHEN 'demo' THEN 35000.00
            WHEN 'testuser' THEN 28500.00
            WHEN 'johndoe' THEN 45000.00
            WHEN 'emma_dev' THEN 45000.00
            WHEN 'mike_finance' THEN 75000.00
            WHEN 'lisa_startup' THEN 95000.00
            WHEN 'david_retired' THEN 125000.00
            ELSE 15000.00
          END);
    END IF;
  END LOOP;
END $$;

-- Ensure all users have current month income
DO $$
DECLARE
  user_record RECORD;
  account_id_var uuid;
  income_count INTEGER;
  current_month_start timestamp := date_trunc('month', now());
BEGIN
  FOR user_record IN SELECT id, username FROM custom_users LOOP
    -- Get user's checking account
    SELECT id INTO account_id_var FROM accounts 
    WHERE custom_user_id = user_record.id 
    AND account_type = 'checking' 
    LIMIT 1;
    
    IF account_id_var IS NOT NULL THEN
      -- Check if user has income this month
      SELECT COUNT(*) INTO income_count FROM transactions 
      WHERE custom_user_id = user_record.id 
      AND type = 'income' 
      AND transaction_date >= current_month_start;
      
      IF income_count = 0 THEN
        RAISE NOTICE 'Adding current month income for user: %', user_record.username;
        
        INSERT INTO transactions (user_id, custom_user_id, account_id, category_id, description, amount, type, transaction_date)
        VALUES (
          user_record.id,
          user_record.id,
          account_id_var,
          (SELECT id FROM categories WHERE name = 'Salary' AND user_id IS NULL LIMIT 1),
          CASE user_record.username
            WHEN 'demo' THEN 'Tech Corp Salary - December'
            WHEN 'testuser' THEN 'Design Client Payment - December'
            WHEN 'johndoe' THEN 'Tech Company Salary - December'
            WHEN 'emma_dev' THEN 'Software Company Salary - December'
            WHEN 'mike_finance' THEN 'Investment Bank Salary - December'
            WHEN 'lisa_startup' THEN 'Startup Revenue - December'
            WHEN 'david_retired' THEN 'Pension Payment - December'
            ELSE 'Monthly Income - December'
          END,
          CASE user_record.username
            WHEN 'demo' THEN 7500.00
            WHEN 'testuser' THEN 4500.00
            WHEN 'johndoe' THEN 9500.00
            WHEN 'emma_dev' THEN 9500.00
            WHEN 'mike_finance' THEN 15000.00
            WHEN 'lisa_startup' THEN 8000.00
            WHEN 'david_retired' THEN 4200.00
            ELSE 5000.00
          END,
          'income',
          current_month_start + interval '1 day'
        );
      END IF;
    END IF;
  END LOOP;
END $$;

-- Add some recent transactions for all users if they don't have any
DO $$
DECLARE
  user_record RECORD;
  account_id_var uuid;
  recent_count INTEGER;
BEGIN
  FOR user_record IN SELECT id, username FROM custom_users LOOP
    -- Get user's checking account
    SELECT id INTO account_id_var FROM accounts 
    WHERE custom_user_id = user_record.id 
    AND account_type = 'checking' 
    LIMIT 1;
    
    IF account_id_var IS NOT NULL THEN
      -- Check if user has recent transactions (last 7 days)
      SELECT COUNT(*) INTO recent_count FROM transactions 
      WHERE custom_user_id = user_record.id 
      AND transaction_date >= now() - interval '7 days';
      
      IF recent_count < 3 THEN
        RAISE NOTICE 'Adding recent transactions for user: %', user_record.username;
        
        -- Add some recent transactions
        INSERT INTO transactions (user_id, custom_user_id, account_id, category_id, description, amount, type, transaction_date) VALUES
          (user_record.id, user_record.id, account_id_var, (SELECT id FROM categories WHERE name = 'Coffee/Drinks' AND user_id IS NULL LIMIT 1), 'Coffee Shop', 5.50, 'expense', now() - interval '1 day'),
          (user_record.id, user_record.id, account_id_var, (SELECT id FROM categories WHERE name = 'Groceries' AND user_id IS NULL LIMIT 1), 'Grocery Store', 89.25, 'expense', now() - interval '3 days'),
          (user_record.id, user_record.id, account_id_var, (SELECT id FROM categories WHERE name = 'Transportation' AND user_id IS NULL LIMIT 1), 'Ride Share', 15.75, 'expense', now() - interval '5 days')
        ON CONFLICT DO NOTHING;
      END IF;
    END IF;
  END LOOP;
END $$;

-- Final verification
DO $$
DECLARE
  user_record RECORD;
  account_count INTEGER;
  transaction_count INTEGER;
  income_count INTEGER;
BEGIN
  RAISE NOTICE 'Final data consistency verification...';
  
  FOR user_record IN SELECT id, username, full_name FROM custom_users ORDER BY username LOOP
    -- Count accounts
    SELECT COUNT(*) INTO account_count FROM accounts WHERE custom_user_id = user_record.id;
    
    -- Count transactions
    SELECT COUNT(*) INTO transaction_count FROM transactions WHERE custom_user_id = user_record.id;
    
    -- Count current month income
    SELECT COUNT(*) INTO income_count FROM transactions 
    WHERE custom_user_id = user_record.id 
    AND type = 'income' 
    AND transaction_date >= date_trunc('month', now());
    
    RAISE NOTICE 'User: % (ID: %) - Accounts: %, Transactions: %, Current Month Income: %', 
      user_record.username, user_record.id, account_count, transaction_count, income_count;
      
    -- Verify the user has the minimum required data
    IF account_count = 0 THEN
      RAISE WARNING 'User % has no accounts!', user_record.username;
    END IF;
    
    IF transaction_count = 0 THEN
      RAISE WARNING 'User % has no transactions!', user_record.username;
    END IF;
    
    IF income_count = 0 THEN
      RAISE WARNING 'User % has no current month income!', user_record.username;
    END IF;
  END LOOP;
  
  RAISE NOTICE 'Data consistency check completed.';
END $$;