/*
  # Enhanced Demo Data for John Doe and All Users

  1. Enhanced User Profiles
    - Add detailed profile information for John Doe
    - Include location, occupation, and other details
    - Ensure all users have comprehensive data

  2. Enhanced Account Data
    - More realistic account balances
    - Better account names and types
    - Proper account relationships

  3. Enhanced Transaction Data
    - More realistic transaction patterns
    - Better categorization
    - Comprehensive 6-month history

  4. Profile Enhancement
    - Add location, occupation, and other profile fields
*/

-- Add additional profile fields
DO $$
BEGIN
  -- Add location column to profiles if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'profiles' AND column_name = 'location'
  ) THEN
    ALTER TABLE profiles ADD COLUMN location text;
  END IF;

  -- Add occupation column to profiles if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'profiles' AND column_name = 'occupation'
  ) THEN
    ALTER TABLE profiles ADD COLUMN occupation text;
  END IF;

  -- Add bio column to profiles if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'profiles' AND column_name = 'bio'
  ) THEN
    ALTER TABLE profiles ADD COLUMN bio text;
  END IF;
END $$;

-- Update John Doe's profile with comprehensive information
UPDATE profiles 
SET 
  full_name = 'John Doe',
  location = 'San Francisco, CA',
  occupation = 'Software Engineer',
  bio = 'Passionate software engineer specializing in full-stack development. Based in San Francisco, working on innovative fintech solutions.'
WHERE id = (SELECT id FROM custom_users WHERE username = 'johndoe');

-- Update other user profiles
UPDATE profiles 
SET 
  location = 'New York, NY',
  occupation = 'UX Designer',
  bio = 'Creative UX designer focused on user-centered design and digital experiences.'
WHERE id = (SELECT id FROM custom_users WHERE username = 'demo');

UPDATE profiles 
SET 
  location = 'Los Angeles, CA',
  occupation = 'Freelance Designer',
  bio = 'Independent designer specializing in brand identity and digital marketing materials.'
WHERE id = (SELECT id FROM custom_users WHERE username = 'testuser');

-- Enhance John Doe's accounts with more realistic data
DO $$
DECLARE
  johndoe_id uuid;
  checking_account_id uuid;
  savings_account_id uuid;
  investment_account_id uuid;
  credit_account_id uuid;
BEGIN
  -- Get John Doe's user ID
  SELECT id INTO johndoe_id FROM custom_users WHERE username = 'johndoe';
  
  IF johndoe_id IS NOT NULL THEN
    -- Clear existing accounts for John Doe
    DELETE FROM transactions WHERE custom_user_id = johndoe_id;
    DELETE FROM accounts WHERE custom_user_id = johndoe_id;
    
    -- Create comprehensive accounts for John Doe (Software Engineer in SF)
    INSERT INTO accounts (user_id, custom_user_id, account_name, account_type, current_balance) VALUES
      (johndoe_id, johndoe_id, 'Chase Sapphire Checking', 'checking', 8750.25),
      (johndoe_id, johndoe_id, 'Marcus High-Yield Savings', 'savings', 45000.00),
      (johndoe_id, johndoe_id, 'Fidelity Tech Stock Portfolio', 'investment', 125000.00),
      (johndoe_id, johndoe_id, 'Chase Freedom Credit Card', 'credit_card', -2150.75)
    ON CONFLICT DO NOTHING;

    -- Get account IDs
    SELECT id INTO checking_account_id FROM accounts WHERE custom_user_id = johndoe_id AND account_type = 'checking';
    SELECT id INTO savings_account_id FROM accounts WHERE custom_user_id = johndoe_id AND account_type = 'savings';
    SELECT id INTO investment_account_id FROM accounts WHERE custom_user_id = johndoe_id AND account_type = 'investment';
    SELECT id INTO credit_account_id FROM accounts WHERE custom_user_id = johndoe_id AND account_type = 'credit_card';

    -- Create comprehensive transaction history for John Doe
    -- Current month income
    INSERT INTO transactions (user_id, custom_user_id, account_id, category_id, description, amount, type, transaction_date) VALUES
      (johndoe_id, johndoe_id, checking_account_id, (SELECT id FROM categories WHERE name = 'Salary' LIMIT 1), 'Tech Company Salary - December', 9500.00, 'income', date_trunc('month', now()) + interval '1 day'),
      (johndoe_id, johndoe_id, checking_account_id, (SELECT id FROM categories WHERE name = 'Freelance' LIMIT 1), 'Side Project Consulting', 2500.00, 'income', now() - interval '5 days');

    -- Recent expenses (last 7 days)
    INSERT INTO transactions (user_id, custom_user_id, account_id, category_id, description, amount, type, transaction_date) VALUES
      (johndoe_id, johndoe_id, checking_account_id, (SELECT id FROM categories WHERE name = 'Coffee/Drinks' LIMIT 1), 'Blue Bottle Coffee', 6.50, 'expense', now() - interval '1 day'),
      (johndoe_id, johndoe_id, credit_account_id, (SELECT id FROM categories WHERE name = 'Groceries' LIMIT 1), 'Whole Foods Market', 127.45, 'expense', now() - interval '2 days'),
      (johndoe_id, johndoe_id, checking_account_id, (SELECT id FROM categories WHERE name = 'Transportation' LIMIT 1), 'Uber to Office', 18.75, 'expense', now() - interval '3 days'),
      (johndoe_id, johndoe_id, credit_account_id, (SELECT id FROM categories WHERE name = 'Dining Out' LIMIT 1), 'Mission Chinese Food', 67.80, 'expense', now() - interval '4 days'),
      (johndoe_id, johndoe_id, checking_account_id, (SELECT id FROM categories WHERE name = 'Subscriptions' LIMIT 1), 'GitHub Pro Subscription', 4.00, 'expense', now() - interval '5 days'),
      (johndoe_id, johndoe_id, credit_account_id, (SELECT id FROM categories WHERE name = 'Shopping' LIMIT 1), 'Apple Store - MacBook Accessories', 299.99, 'expense', now() - interval '6 days'),
      (johndoe_id, johndoe_id, checking_account_id, (SELECT id FROM categories WHERE name = 'Coffee/Drinks' LIMIT 1), 'Philz Coffee', 5.25, 'expense', now() - interval '7 days');

    -- Monthly recurring expenses
    INSERT INTO transactions (user_id, custom_user_id, account_id, category_id, description, amount, type, transaction_date) VALUES
      (johndoe_id, johndoe_id, checking_account_id, (SELECT id FROM categories WHERE name = 'Rent/Mortgage' LIMIT 1), 'Apartment Rent - SOMA District', 3200.00, 'expense', date_trunc('month', now()) + interval '1 day'),
      (johndoe_id, johndoe_id, checking_account_id, (SELECT id FROM categories WHERE name = 'Utilities' LIMIT 1), 'PG&E Electric Bill', 89.50, 'expense', date_trunc('month', now()) + interval '3 days'),
      (johndoe_id, johndoe_id, checking_account_id, (SELECT id FROM categories WHERE name = 'Internet/Phone' LIMIT 1), 'Comcast Internet + Phone', 125.00, 'expense', date_trunc('month', now()) + interval '5 days'),
      (johndoe_id, johndoe_id, checking_account_id, (SELECT id FROM categories WHERE name = 'Insurance' LIMIT 1), 'Health Insurance Premium', 450.00, 'expense', date_trunc('month', now()) + interval '7 days'),
      (johndoe_id, johndoe_id, checking_account_id, (SELECT id FROM categories WHERE name = 'Gym/Fitness' LIMIT 1), 'Equinox Gym Membership', 185.00, 'expense', date_trunc('month', now()) + interval '10 days');

    -- Tech-specific expenses
    INSERT INTO transactions (user_id, custom_user_id, account_id, category_id, description, amount, type, transaction_date) VALUES
      (johndoe_id, johndoe_id, credit_account_id, (SELECT id FROM categories WHERE name = 'Software/Tools' LIMIT 1), 'JetBrains IntelliJ License', 149.00, 'expense', now() - interval '15 days'),
      (johndoe_id, johndoe_id, checking_account_id, (SELECT id FROM categories WHERE name = 'Education' LIMIT 1), 'Udemy Advanced React Course', 89.99, 'expense', now() - interval '20 days'),
      (johndoe_id, johndoe_id, credit_account_id, (SELECT id FROM categories WHERE name = 'Professional Services' LIMIT 1), 'AWS Cloud Services', 67.50, 'expense', now() - interval '25 days');

    -- Investment transactions
    INSERT INTO transactions (user_id, custom_user_id, account_id, category_id, description, amount, type, transaction_date) VALUES
      (johndoe_id, johndoe_id, investment_account_id, (SELECT id FROM categories WHERE name = 'Investment Returns' LIMIT 1), 'AAPL Dividend Payment', 125.50, 'income', now() - interval '10 days'),
      (johndoe_id, johndoe_id, investment_account_id, (SELECT id FROM categories WHERE name = 'Investment Returns' LIMIT 1), 'GOOGL Stock Appreciation', 2340.75, 'income', now() - interval '20 days'),
      (johndoe_id, johndoe_id, savings_account_id, (SELECT id FROM categories WHERE name = 'Investment Returns' LIMIT 1), 'High-Yield Savings Interest', 187.50, 'income', now() - interval '30 days');

    -- Previous months for chart data
    FOR month_offset IN 1..5 LOOP
      -- Monthly salary
      INSERT INTO transactions (user_id, custom_user_id, account_id, category_id, description, amount, type, transaction_date) VALUES
        (johndoe_id, johndoe_id, checking_account_id, (SELECT id FROM categories WHERE name = 'Salary' LIMIT 1), 'Tech Company Salary', 9500.00, 'income', date_trunc('month', now()) - interval '1 month' * month_offset + interval '1 day');
      
      -- Monthly rent
      INSERT INTO transactions (user_id, custom_user_id, account_id, category_id, description, amount, type, transaction_date) VALUES
        (johndoe_id, johndoe_id, checking_account_id, (SELECT id FROM categories WHERE name = 'Rent/Mortgage' LIMIT 1), 'Apartment Rent - SOMA District', 3200.00, 'expense', date_trunc('month', now()) - interval '1 month' * month_offset + interval '1 day');
      
      -- Various monthly expenses
      INSERT INTO transactions (user_id, custom_user_id, account_id, category_id, description, amount, type, transaction_date) VALUES
        (johndoe_id, johndoe_id, checking_account_id, (SELECT id FROM categories WHERE name = 'Groceries' LIMIT 1), 'Monthly Groceries', 450.00 + (random() * 200 - 100), 'expense', date_trunc('month', now()) - interval '1 month' * month_offset + interval '5 days'),
        (johndoe_id, johndoe_id, credit_account_id, (SELECT id FROM categories WHERE name = 'Dining Out' LIMIT 1), 'Restaurants & Takeout', 380.00 + (random() * 150 - 75), 'expense', date_trunc('month', now()) - interval '1 month' * month_offset + interval '10 days'),
        (johndoe_id, johndoe_id, checking_account_id, (SELECT id FROM categories WHERE name = 'Transportation' LIMIT 1), 'Uber & Public Transit', 125.00 + (random() * 50 - 25), 'expense', date_trunc('month', now()) - interval '1 month' * month_offset + interval '15 days'),
        (johndoe_id, johndoe_id, checking_account_id, (SELECT id FROM categories WHERE name = 'Entertainment' LIMIT 1), 'Movies & Events', 150.00 + (random() * 100 - 50), 'expense', date_trunc('month', now()) - interval '1 month' * month_offset + interval '20 days');
    END LOOP;
  END IF;
END $$;

-- Ensure all users have recent transactions for dashboard display
DO $$
DECLARE
  user_record RECORD;
  account_id_var uuid;
  category_id uuid;
BEGIN
  FOR user_record IN SELECT id, username FROM custom_users WHERE username IN ('demo', 'testuser') LOOP
    -- Get user's primary checking account ID
    SELECT id INTO account_id_var FROM accounts 
    WHERE custom_user_id = user_record.id 
    AND account_type = 'checking' 
    LIMIT 1;
    
    IF account_id_var IS NOT NULL THEN
      -- Ensure current month income
      IF NOT EXISTS (
        SELECT 1 FROM transactions 
        WHERE custom_user_id = user_record.id 
        AND type = 'income' 
        AND transaction_date >= date_trunc('month', now())
      ) THEN
        INSERT INTO transactions (user_id, custom_user_id, account_id, category_id, description, amount, type, transaction_date)
        VALUES (
          user_record.id,
          user_record.id,
          account_id_var,
          (SELECT id FROM categories WHERE name = 'Salary' LIMIT 1),
          CASE user_record.username
            WHEN 'demo' THEN 'Tech Corp Salary - December'
            WHEN 'testuser' THEN 'Design Client Payment - December'
            ELSE 'Monthly Income'
          END,
          CASE user_record.username
            WHEN 'demo' THEN 7500.00
            WHEN 'testuser' THEN 4500.00
            ELSE 5000.00
          END,
          'income',
          date_trunc('month', now()) + interval '1 day'
        );
      END IF;

      -- Add some recent expenses if none exist
      IF NOT EXISTS (
        SELECT 1 FROM transactions 
        WHERE custom_user_id = user_record.id 
        AND type = 'expense' 
        AND transaction_date >= now() - interval '7 days'
      ) THEN
        INSERT INTO transactions (user_id, custom_user_id, account_id, category_id, description, amount, type, transaction_date) VALUES
          (user_record.id, user_record.id, account_id_var, (SELECT id FROM categories WHERE name = 'Coffee/Drinks' LIMIT 1), 'Coffee Shop', 5.50, 'expense', now() - interval '1 day'),
          (user_record.id, user_record.id, account_id_var, (SELECT id FROM categories WHERE name = 'Groceries' LIMIT 1), 'Grocery Store', 89.25, 'expense', now() - interval '3 days'),
          (user_record.id, user_record.id, account_id_var, (SELECT id FROM categories WHERE name = 'Transportation' LIMIT 1), 'Ride Share', 15.75, 'expense', now() - interval '5 days');
      END IF;
    END IF;
  END LOOP;
END $$;

-- Update account balances to be more realistic
UPDATE accounts SET current_balance = 8750.25 WHERE custom_user_id = (SELECT id FROM custom_users WHERE username = 'johndoe') AND account_type = 'checking';
UPDATE accounts SET current_balance = 45000.00 WHERE custom_user_id = (SELECT id FROM custom_users WHERE username = 'johndoe') AND account_type = 'savings';
UPDATE accounts SET current_balance = 125000.00 WHERE custom_user_id = (SELECT id FROM custom_users WHERE username = 'johndoe') AND account_type = 'investment';

-- Add indexes for better performance
CREATE INDEX IF NOT EXISTS idx_transactions_user_date ON transactions(custom_user_id, transaction_date DESC);
CREATE INDEX IF NOT EXISTS idx_transactions_user_type ON transactions(custom_user_id, type);
CREATE INDEX IF NOT EXISTS idx_accounts_user_type ON accounts(custom_user_id, account_type);