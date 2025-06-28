/*
  # Create Demo Users with Sample Data

  1. New Tables
    - Creates system categories for transactions
    - Creates two demo users with authentication
    - Creates multiple accounts per user
    - Creates realistic transaction history

  2. Security
    - Uses existing RLS policies
    - Properly handles user authentication

  3. Demo Accounts
    - demo@example.com / Password123!
    - testuser@example.com / TestPass123!
*/

-- First, ensure we have the necessary system categories
INSERT INTO categories (name, icon_name) VALUES 
  ('Income', 'dollar-sign'),
  ('Food & Dining', 'utensils'),
  ('Transportation', 'car'),
  ('Shopping', 'shopping-bag'),
  ('Entertainment', 'film'),
  ('Bills & Utilities', 'zap'),
  ('Health & Fitness', 'heart'),
  ('Travel', 'plane'),
  ('Education', 'book'),
  ('Other', 'more-horizontal')
ON CONFLICT (name) WHERE user_id IS NULL DO NOTHING;

-- Create our demo users and all related data
DO $$
DECLARE
    demo_user_id uuid := 'a1b2c3d4-e5f6-7890-1234-567890abcdef';
    test_user_id uuid := 'b2c3d4e5-f6a7-8901-2345-678901bcdefb';
    demo_checking_id uuid;
    demo_savings_id uuid;
    demo_credit_id uuid;
    test_checking_id uuid;
    test_savings_id uuid;
    test_investment_id uuid;
    income_category_id uuid;
    food_category_id uuid;
    transport_category_id uuid;
    shopping_category_id uuid;
    entertainment_category_id uuid;
    bills_category_id uuid;
BEGIN
    -- Clean up any existing demo data first
    DELETE FROM transactions WHERE user_id IN (demo_user_id, test_user_id);
    DELETE FROM accounts WHERE user_id IN (demo_user_id, test_user_id);
    DELETE FROM profiles WHERE id IN (demo_user_id, test_user_id);
    DELETE FROM auth.users WHERE email IN ('demo@example.com', 'testuser@example.com');
    
    -- Temporarily disable the trigger to avoid conflicts
    DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
    
    -- Create demo user 1: demo@example.com
    INSERT INTO auth.users (
        id, 
        aud, 
        role, 
        email, 
        encrypted_password, 
        email_confirmed_at,
        raw_user_meta_data,
        created_at,
        updated_at,
        confirmation_token,
        email_change,
        email_change_token_new,
        recovery_token
    ) VALUES (
        demo_user_id,
        'authenticated',
        'authenticated',
        'demo@example.com',
        crypt('Password123!', gen_salt('bf')),
        now(),
        '{"full_name": "Alex Johnson"}',
        now(),
        now(),
        '',
        '',
        '',
        ''
    );

    -- Create demo user 2: testuser@example.com
    INSERT INTO auth.users (
        id, 
        aud, 
        role, 
        email, 
        encrypted_password, 
        email_confirmed_at,
        raw_user_meta_data,
        created_at,
        updated_at,
        confirmation_token,
        email_change,
        email_change_token_new,
        recovery_token
    ) VALUES (
        test_user_id,
        'authenticated',
        'authenticated',
        'testuser@example.com',
        crypt('TestPass123!', gen_salt('bf')),
        now(),
        '{"full_name": "Sarah Wilson"}',
        now(),
        now(),
        '',
        '',
        '',
        ''
    );

    -- Re-enable the trigger
    CREATE TRIGGER on_auth_user_created 
        AFTER INSERT ON auth.users 
        FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

    -- Manually create profiles since we bypassed the trigger
    INSERT INTO profiles (id, full_name) VALUES 
        (demo_user_id, 'Alex Johnson'),
        (test_user_id, 'Sarah Wilson');

    -- Get category IDs for transactions
    SELECT id INTO income_category_id FROM categories WHERE name = 'Income' AND user_id IS NULL;
    SELECT id INTO food_category_id FROM categories WHERE name = 'Food & Dining' AND user_id IS NULL;
    SELECT id INTO transport_category_id FROM categories WHERE name = 'Transportation' AND user_id IS NULL;
    SELECT id INTO shopping_category_id FROM categories WHERE name = 'Shopping' AND user_id IS NULL;
    SELECT id INTO entertainment_category_id FROM categories WHERE name = 'Entertainment' AND user_id IS NULL;
    SELECT id INTO bills_category_id FROM categories WHERE name = 'Bills & Utilities' AND user_id IS NULL;

    -- Create accounts for demo user (Alex Johnson)
    INSERT INTO accounts (user_id, account_name, account_type, current_balance) 
    VALUES (demo_user_id, 'Chase Primary Checking', 'checking', 4582.50) 
    RETURNING id INTO demo_checking_id;
    
    INSERT INTO accounts (user_id, account_name, account_type, current_balance) 
    VALUES (demo_user_id, 'Marcus High-Yield Savings', 'savings', 15104.40) 
    RETURNING id INTO demo_savings_id;
    
    INSERT INTO accounts (user_id, account_name, account_type, current_balance) 
    VALUES (demo_user_id, 'Chase Freedom Credit Card', 'credit_card', -1240.80) 
    RETURNING id INTO demo_credit_id;

    -- Create accounts for test user (Sarah Wilson)
    INSERT INTO accounts (user_id, account_name, account_type, current_balance) 
    VALUES (test_user_id, 'Bank of America Checking', 'checking', 3247.85) 
    RETURNING id INTO test_checking_id;
    
    INSERT INTO accounts (user_id, account_name, account_type, current_balance) 
    VALUES (test_user_id, 'Ally Online Savings', 'savings', 8950.20) 
    RETURNING id INTO test_savings_id;
    
    INSERT INTO accounts (user_id, account_name, account_type, current_balance) 
    VALUES (test_user_id, 'Fidelity Investment Account', 'investment', 25430.75) 
    RETURNING id INTO test_investment_id;

    -- Create transactions for demo user (Alex Johnson)
    INSERT INTO transactions (user_id, account_id, category_id, description, amount, type, transaction_date) VALUES
        -- Recent transactions (last 30 days)
        (demo_user_id, demo_checking_id, income_category_id, 'Salary Deposit - Tech Corp', 4200.00, 'income', now() - interval '2 days'),
        (demo_user_id, demo_checking_id, food_category_id, 'Whole Foods Market', -127.45, 'expense', now() - interval '3 days'),
        (demo_user_id, demo_credit_id, entertainment_category_id, 'Netflix Subscription', -15.99, 'expense', now() - interval '5 days'),
        (demo_user_id, demo_checking_id, transport_category_id, 'Shell Gas Station', -45.20, 'expense', now() - interval '7 days'),
        (demo_user_id, demo_checking_id, income_category_id, 'Freelance Payment', 800.00, 'income', now() - interval '10 days'),
        (demo_user_id, demo_checking_id, food_category_id, 'Starbucks Coffee', -4.75, 'expense', now() - interval '12 days'),
        (demo_user_id, demo_credit_id, shopping_category_id, 'Amazon Purchase', -89.99, 'expense', now() - interval '15 days'),
        (demo_user_id, demo_checking_id, bills_category_id, 'Electric Bill', -125.30, 'expense', now() - interval '18 days'),
        (demo_user_id, demo_checking_id, food_category_id, 'Chipotle', -12.50, 'expense', now() - interval '20 days'),
        (demo_user_id, demo_savings_id, income_category_id, 'Interest Payment', 45.20, 'income', now() - interval '25 days'),
        
        -- Older transactions for history
        (demo_user_id, demo_checking_id, income_category_id, 'Salary Deposit - Tech Corp', 4200.00, 'income', now() - interval '32 days'),
        (demo_user_id, demo_checking_id, bills_category_id, 'Rent Payment', -1800.00, 'expense', now() - interval '35 days'),
        (demo_user_id, demo_checking_id, transport_category_id, 'Uber Ride', -18.50, 'expense', now() - interval '40 days'),
        (demo_user_id, demo_credit_id, entertainment_category_id, 'Movie Theater', -24.00, 'expense', now() - interval '42 days'),
        (demo_user_id, demo_checking_id, food_category_id, 'Grocery Store', -156.78, 'expense', now() - interval '45 days');

    -- Create transactions for test user (Sarah Wilson)
    INSERT INTO transactions (user_id, account_id, category_id, description, amount, type, transaction_date) VALUES
        -- Recent transactions
        (test_user_id, test_checking_id, income_category_id, 'Salary Deposit - Design Studio', 3800.00, 'income', now() - interval '1 day'),
        (test_user_id, test_checking_id, food_category_id, 'Trader Joes', -89.32, 'expense', now() - interval '4 days'),
        (test_user_id, test_checking_id, transport_category_id, 'Metro Card Refill', -30.00, 'expense', now() - interval '6 days'),
        (test_user_id, test_investment_id, income_category_id, 'Dividend Payment', 125.50, 'income', now() - interval '8 days'),
        (test_user_id, test_checking_id, entertainment_category_id, 'Spotify Premium', -9.99, 'expense', now() - interval '11 days'),
        (test_user_id, test_checking_id, food_category_id, 'Local Cafe', -6.25, 'expense', now() - interval '13 days'),
        (test_user_id, test_checking_id, shopping_category_id, 'Target Shopping', -67.43, 'expense', now() - interval '16 days'),
        (test_user_id, test_checking_id, bills_category_id, 'Internet Bill', -79.99, 'expense', now() - interval '19 days'),
        (test_user_id, test_savings_id, income_category_id, 'Savings Interest', 28.75, 'income', now() - interval '22 days'),
        (test_user_id, test_checking_id, food_category_id, 'Restaurant Dinner', -45.80, 'expense', now() - interval '24 days'),
        
        -- Older transactions
        (test_user_id, test_checking_id, income_category_id, 'Salary Deposit - Design Studio', 3800.00, 'income', now() - interval '31 days'),
        (test_user_id, test_checking_id, bills_category_id, 'Rent Payment', -1650.00, 'expense', now() - interval '33 days'),
        (test_user_id, test_checking_id, transport_category_id, 'Gas Station', -52.30, 'expense', now() - interval '38 days'),
        (test_user_id, test_investment_id, income_category_id, 'Stock Dividend', 89.25, 'income', now() - interval '41 days'),
        (test_user_id, test_checking_id, entertainment_category_id, 'Concert Tickets', -120.00, 'expense', now() - interval '44 days');

    -- Output success message
    RAISE NOTICE 'Demo users created successfully!';
    RAISE NOTICE 'User 1: demo@example.com / Password123!';
    RAISE NOTICE 'User 2: testuser@example.com / TestPass123!';

END $$;