/*
  # Create Third Demo User

  1. New Demo User
    - Creates a third demo user: john.doe@example.com / Demo123!
    - Full name: John Doe
    - Includes sample accounts and transactions

  2. Security
    - Uses Supabase's built-in authentication
    - Encrypted password storage
    - Row Level Security enabled
*/

-- Create third demo user with sample data
DO $$
DECLARE
    new_user_id uuid := 'c3d4e5f6-a7b8-9012-3456-789012cdefab';
    new_checking_id uuid;
    new_savings_id uuid;
    new_investment_id uuid;
    income_category_id uuid;
    food_category_id uuid;
    transport_category_id uuid;
    shopping_category_id uuid;
    entertainment_category_id uuid;
    bills_category_id uuid;
    health_category_id uuid;
BEGIN
    -- Clean up any existing data for this user
    DELETE FROM transactions WHERE user_id = new_user_id;
    DELETE FROM accounts WHERE user_id = new_user_id;
    DELETE FROM profiles WHERE id = new_user_id;
    DELETE FROM auth.users WHERE email = 'john.doe@example.com';
    
    -- Temporarily disable the trigger to avoid conflicts
    DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
    
    -- Create new demo user: john.doe@example.com
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
        new_user_id,
        'authenticated',
        'authenticated',
        'john.doe@example.com',
        crypt('Demo123!', gen_salt('bf')),
        now(),
        '{"full_name": "John Doe"}',
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

    -- Manually create profile since we bypassed the trigger
    INSERT INTO profiles (id, full_name) VALUES 
        (new_user_id, 'John Doe');

    -- Get category IDs for transactions
    SELECT id INTO income_category_id FROM categories WHERE name = 'Income' AND user_id IS NULL;
    SELECT id INTO food_category_id FROM categories WHERE name = 'Food & Dining' AND user_id IS NULL;
    SELECT id INTO transport_category_id FROM categories WHERE name = 'Transportation' AND user_id IS NULL;
    SELECT id INTO shopping_category_id FROM categories WHERE name = 'Shopping' AND user_id IS NULL;
    SELECT id INTO entertainment_category_id FROM categories WHERE name = 'Entertainment' AND user_id IS NULL;
    SELECT id INTO bills_category_id FROM categories WHERE name = 'Bills & Utilities' AND user_id IS NULL;
    SELECT id INTO health_category_id FROM categories WHERE name = 'Health & Fitness' AND user_id IS NULL;

    -- Create accounts for new user (John Doe)
    INSERT INTO accounts (user_id, account_name, account_type, current_balance) 
    VALUES (new_user_id, 'Wells Fargo Checking', 'checking', 2847.65) 
    RETURNING id INTO new_checking_id;
    
    INSERT INTO accounts (user_id, account_name, account_type, current_balance) 
    VALUES (new_user_id, 'Capital One 360 Savings', 'savings', 12750.30) 
    RETURNING id INTO new_savings_id;
    
    INSERT INTO accounts (user_id, account_name, account_type, current_balance) 
    VALUES (new_user_id, 'Vanguard Investment Account', 'investment', 18920.45) 
    RETURNING id INTO new_investment_id;

    -- Create transactions for new user (John Doe)
    INSERT INTO transactions (user_id, account_id, category_id, description, amount, type, transaction_date) VALUES
        -- Recent transactions (last 30 days)
        (new_user_id, new_checking_id, income_category_id, 'Salary Deposit - Marketing Agency', 3600.00, 'income', now() - interval '1 day'),
        (new_user_id, new_checking_id, food_category_id, 'Safeway Grocery', 98.76, 'expense', now() - interval '2 days'),
        (new_user_id, new_checking_id, transport_category_id, 'Lyft Ride', 22.50, 'expense', now() - interval '4 days'),
        (new_user_id, new_checking_id, entertainment_category_id, 'Disney+ Subscription', 13.99, 'expense', now() - interval '6 days'),
        (new_user_id, new_checking_id, income_category_id, 'Side Project Payment', 450.00, 'income', now() - interval '8 days'),
        (new_user_id, new_checking_id, food_category_id, 'Local Deli', 8.50, 'expense', now() - interval '9 days'),
        (new_user_id, new_checking_id, shopping_category_id, 'Best Buy Electronics', 156.99, 'expense', now() - interval '11 days'),
        (new_user_id, new_checking_id, health_category_id, 'Gym Membership', 39.99, 'expense', now() - interval '14 days'),
        (new_user_id, new_checking_id, bills_category_id, 'Phone Bill', 85.00, 'expense', now() - interval '16 days'),
        (new_user_id, new_savings_id, income_category_id, 'Savings Interest', 32.15, 'income', now() - interval '18 days'),
        (new_user_id, new_checking_id, food_category_id, 'Pizza Delivery', 24.75, 'expense', now() - interval '20 days'),
        (new_user_id, new_investment_id, income_category_id, 'Investment Dividend', 78.90, 'income', now() - interval '22 days'),
        (new_user_id, new_checking_id, transport_category_id, 'Gas Station Fill-up', 48.30, 'expense', now() - interval '25 days'),
        (new_user_id, new_checking_id, entertainment_category_id, 'Movie Tickets', 28.00, 'expense', now() - interval '27 days'),
        (new_user_id, new_checking_id, shopping_category_id, 'Clothing Store', 89.50, 'expense', now() - interval '29 days'),
        
        -- Older transactions for history
        (new_user_id, new_checking_id, income_category_id, 'Salary Deposit - Marketing Agency', 3600.00, 'income', now() - interval '31 days'),
        (new_user_id, new_checking_id, bills_category_id, 'Rent Payment', 1450.00, 'expense', now() - interval '33 days'),
        (new_user_id, new_checking_id, bills_category_id, 'Utilities Bill', 145.67, 'expense', now() - interval '35 days'),
        (new_user_id, new_checking_id, food_category_id, 'Restaurant Lunch', 32.40, 'expense', now() - interval '37 days'),
        (new_user_id, new_checking_id, health_category_id, 'Doctor Visit Copay', 25.00, 'expense', now() - interval '39 days'),
        (new_user_id, new_investment_id, income_category_id, 'Stock Sale Profit', 234.50, 'income', now() - interval '41 days'),
        (new_user_id, new_checking_id, transport_category_id, 'Car Insurance', 167.50, 'expense', now() - interval '43 days'),
        (new_user_id, new_checking_id, entertainment_category_id, 'Streaming Services', 45.97, 'expense', now() - interval '45 days');

    -- Output success message
    RAISE NOTICE 'Third demo user created successfully!';
    RAISE NOTICE 'User 3: john.doe@example.com / Demo123!';

END $$;