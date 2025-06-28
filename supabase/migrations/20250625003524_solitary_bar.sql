/*
  # Comprehensive Dummy Data Migration

  1. Enhanced Demo Users
    - Add more demo users with varied profiles
    - Different financial situations and backgrounds

  2. Diverse Account Types
    - Multiple accounts per user
    - Various account types (checking, savings, investment, business, retirement)
    - Realistic balance distributions

  3. Comprehensive Categories
    - System categories for all common expense types
    - User-specific custom categories
    - Proper categorization for better analytics

  4. Rich Transaction History
    - 6+ months of transaction history per user
    - Varied transaction patterns
    - Realistic amounts and frequencies
    - Income and expense cycles for meaningful graphs
*/

-- Add more demo users with diverse profiles
INSERT INTO custom_users (username, password, full_name, email) VALUES
  ('emma_dev', 'DevPass123!', 'Emma Rodriguez', 'emma.rodriguez@example.com'),
  ('mike_finance', 'FinancePass123!', 'Michael Chen', 'michael.chen@example.com'),
  ('lisa_startup', 'StartupPass123!', 'Lisa Thompson', 'lisa.thompson@example.com'),
  ('david_retired', 'RetiredPass123!', 'David Williams', 'david.williams@example.com')
ON CONFLICT (username) DO NOTHING;

-- Create comprehensive system categories
INSERT INTO categories (user_id, custom_user_id, name, icon_name) VALUES
  -- Income categories
  (NULL, NULL, 'Salary', 'dollar-sign'),
  (NULL, NULL, 'Freelance', 'briefcase'),
  (NULL, NULL, 'Investment Returns', 'trending-up'),
  (NULL, NULL, 'Business Income', 'building'),
  (NULL, NULL, 'Rental Income', 'home'),
  (NULL, NULL, 'Side Hustle', 'zap'),
  
  -- Essential expenses
  (NULL, NULL, 'Rent/Mortgage', 'home'),
  (NULL, NULL, 'Utilities', 'zap'),
  (NULL, NULL, 'Internet/Phone', 'wifi'),
  (NULL, NULL, 'Insurance', 'shield'),
  (NULL, NULL, 'Healthcare', 'heart'),
  (NULL, NULL, 'Groceries', 'shopping-cart'),
  
  -- Transportation
  (NULL, NULL, 'Gas', 'fuel'),
  (NULL, NULL, 'Public Transit', 'bus'),
  (NULL, NULL, 'Car Maintenance', 'wrench'),
  (NULL, NULL, 'Parking', 'square'),
  
  -- Lifestyle
  (NULL, NULL, 'Dining Out', 'utensils'),
  (NULL, NULL, 'Coffee/Drinks', 'coffee'),
  (NULL, NULL, 'Subscriptions', 'repeat'),
  (NULL, NULL, 'Gym/Fitness', 'dumbbell'),
  (NULL, NULL, 'Hobbies', 'palette'),
  (NULL, NULL, 'Travel', 'plane'),
  (NULL, NULL, 'Clothing', 'shirt'),
  
  -- Financial
  (NULL, NULL, 'Savings Transfer', 'piggy-bank'),
  (NULL, NULL, 'Investment', 'bar-chart'),
  (NULL, NULL, 'Loan Payment', 'credit-card'),
  (NULL, NULL, 'Tax Payment', 'file-text'),
  
  -- Business (for business accounts)
  (NULL, NULL, 'Office Supplies', 'paperclip'),
  (NULL, NULL, 'Software/Tools', 'laptop'),
  (NULL, NULL, 'Marketing', 'megaphone'),
  (NULL, NULL, 'Professional Services', 'users')
ON CONFLICT (name) WHERE user_id IS NULL DO NOTHING;

-- Create comprehensive accounts for all users
DO $$
DECLARE
  demo_user_id uuid;
  testuser_id uuid;
  johndoe_id uuid;
  emma_id uuid;
  mike_id uuid;
  lisa_id uuid;
  david_id uuid;
BEGIN
  -- Get all user IDs
  SELECT id INTO demo_user_id FROM custom_users WHERE username = 'demo';
  SELECT id INTO testuser_id FROM custom_users WHERE username = 'testuser';
  SELECT id INTO johndoe_id FROM custom_users WHERE username = 'johndoe';
  SELECT id INTO emma_id FROM custom_users WHERE username = 'emma_dev';
  SELECT id INTO mike_id FROM custom_users WHERE username = 'mike_finance';
  SELECT id INTO lisa_id FROM custom_users WHERE username = 'lisa_startup';
  SELECT id INTO david_id FROM custom_users WHERE username = 'david_retired';

  -- Create profiles for new users
  INSERT INTO profiles (id, full_name, custom_user_id) VALUES
    (emma_id, 'Emma Rodriguez', emma_id),
    (mike_id, 'Michael Chen', mike_id),
    (lisa_id, 'Lisa Thompson', lisa_id),
    (david_id, 'David Williams', david_id)
  ON CONFLICT (id) DO NOTHING;

  -- Enhanced accounts for demo user (Alex Johnson - Tech Professional)
  INSERT INTO accounts (user_id, custom_user_id, account_name, account_type, current_balance) VALUES
    (demo_user_id, demo_user_id, 'Chase Freedom Checking', 'checking', 8420.50),
    (demo_user_id, demo_user_id, 'Chase Sapphire Savings', 'savings', 35000.00),
    (demo_user_id, demo_user_id, 'Vanguard Investment', 'investment', 127500.75),
    (demo_user_id, demo_user_id, 'Tech Consulting LLC', 'business', 15750.25),
    (demo_user_id, demo_user_id, 'Roth IRA', 'retirement', 45200.00)
  ON CONFLICT DO NOTHING;

  -- Enhanced accounts for testuser (Sarah Wilson - Designer)
  INSERT INTO accounts (user_id, custom_user_id, account_name, account_type, current_balance) VALUES
    (testuser_id, testuser_id, 'Wells Fargo Checking', 'checking', 6750.25),
    (testuser_id, testuser_id, 'Marcus High Yield Savings', 'savings', 28500.00),
    (testuser_id, testuser_id, 'Design Studio Business', 'business', 12750.00),
    (testuser_id, testuser_id, 'Fidelity Investment', 'investment', 67100.40),
    (testuser_id, testuser_id, 'SEP-IRA', 'retirement', 32800.00)
  ON CONFLICT DO NOTHING;

  -- Enhanced accounts for johndoe (John Doe - Marketing Professional)
  INSERT INTO accounts (user_id, custom_user_id, account_name, account_type, current_balance) VALUES
    (johndoe_id, johndoe_id, 'Bank of America Checking', 'checking', 4890.75),
    (johndoe_id, johndoe_id, 'Ally Online Savings', 'savings', 22500.00),
    (johndoe_id, johndoe_id, 'Charles Schwab Investment', 'investment', 89200.30),
    (johndoe_id, johndoe_id, 'Company 401k', 'retirement', 156000.00)
  ON CONFLICT DO NOTHING;

  -- Accounts for Emma (Software Developer)
  IF emma_id IS NOT NULL THEN
    INSERT INTO accounts (user_id, custom_user_id, account_name, account_type, current_balance) VALUES
      (emma_id, emma_id, 'Capital One 360 Checking', 'checking', 12500.00),
      (emma_id, emma_id, 'Emergency Fund Savings', 'savings', 45000.00),
      (emma_id, emma_id, 'Tech Stock Portfolio', 'investment', 185000.00),
      (emma_id, emma_id, 'Freelance Business', 'business', 8900.00),
      (emma_id, emma_id, 'Traditional IRA', 'retirement', 78500.00)
    ON CONFLICT DO NOTHING;
  END IF;

  -- Accounts for Mike (Finance Professional)
  IF mike_id IS NOT NULL THEN
    INSERT INTO accounts (user_id, custom_user_id, account_name, account_type, current_balance) VALUES
      (mike_id, mike_id, 'JPMorgan Private Checking', 'checking', 25000.00),
      (mike_id, mike_id, 'Goldman Sachs Savings', 'savings', 75000.00),
      (mike_id, mike_id, 'Diversified Portfolio', 'investment', 450000.00),
      (mike_id, mike_id, 'Financial Consulting', 'business', 35000.00),
      (mike_id, mike_id, 'Executive 401k', 'retirement', 380000.00)
    ON CONFLICT DO NOTHING;
  END IF;

  -- Accounts for Lisa (Startup Founder)
  IF lisa_id IS NOT NULL THEN
    INSERT INTO accounts (user_id, custom_user_id, account_name, account_type, current_balance) VALUES
      (lisa_id, lisa_id, 'Silicon Valley Bank Checking', 'checking', 18750.00),
      (lisa_id, lisa_id, 'Startup Emergency Fund', 'savings', 95000.00),
      (lisa_id, lisa_id, 'Growth Investment Portfolio', 'investment', 275000.00),
      (lisa_id, lisa_id, 'TechStart Inc Business', 'business', 125000.00),
      (lisa_id, lisa_id, 'Solo 401k', 'retirement', 85000.00)
    ON CONFLICT DO NOTHING;
  END IF;

  -- Accounts for David (Retired)
  IF david_id IS NOT NULL THEN
    INSERT INTO accounts (user_id, custom_user_id, account_name, account_type, current_balance) VALUES
      (david_id, david_id, 'Local Credit Union Checking', 'checking', 8500.00),
      (david_id, david_id, 'Conservative Savings', 'savings', 125000.00),
      (david_id, david_id, 'Retirement Portfolio', 'investment', 850000.00),
      (david_id, david_id, 'Traditional IRA Rollover', 'retirement', 1200000.00)
    ON CONFLICT DO NOTHING;
  END IF;
END $$;

-- Create extensive transaction history for rich data visualization
DO $$
DECLARE
  user_record RECORD;
  account_record RECORD;
  category_record RECORD;
  month_offset INTEGER;
  day_offset INTEGER;
  transaction_date TIMESTAMP;
  amount DECIMAL;
  description TEXT;
  transaction_type TEXT;
BEGIN
  -- Loop through each user to create 6 months of transaction history
  FOR user_record IN SELECT id, username FROM custom_users LOOP
    
    -- Get user's accounts
    FOR account_record IN SELECT id, account_type FROM accounts WHERE custom_user_id = user_record.id LOOP
      
      -- Create monthly income transactions
      FOR month_offset IN 0..5 LOOP
        transaction_date := date_trunc('month', now()) - interval '1 month' * month_offset + interval '1 day';
        
        -- Monthly salary/income based on user type
        IF user_record.username = 'demo' THEN
          amount := 7500.00 + (random() * 1000 - 500); -- Tech salary with bonus variation
          description := CASE 
            WHEN random() < 0.8 THEN 'Tech Corp Salary'
            ELSE 'Consulting Bonus'
          END;
        ELSIF user_record.username = 'testuser' THEN
          amount := 4500.00 + (random() * 2000 - 1000); -- Freelance variation
          description := CASE 
            WHEN random() < 0.6 THEN 'Design Client Payment'
            WHEN random() < 0.8 THEN 'Freelance Project'
            ELSE 'Creative Services'
          END;
        ELSIF user_record.username = 'johndoe' THEN
          amount := 5200.00 + (random() * 800 - 400); -- Marketing salary
          description := 'Marketing Agency Salary';
        ELSIF user_record.username = 'emma_dev' THEN
          amount := 9500.00 + (random() * 2000 - 1000); -- Senior dev salary
          description := CASE 
            WHEN random() < 0.7 THEN 'Software Company Salary'
            ELSE 'Open Source Contribution Bonus'
          END;
        ELSIF user_record.username = 'mike_finance' THEN
          amount := 15000.00 + (random() * 5000 - 2500); -- Finance executive
          description := CASE 
            WHEN random() < 0.6 THEN 'Investment Bank Salary'
            WHEN random() < 0.8 THEN 'Performance Bonus'
            ELSE 'Client Advisory Fee'
          END;
        ELSIF user_record.username = 'lisa_startup' THEN
          amount := 8000.00 + (random() * 10000 - 5000); -- Startup founder (variable)
          description := CASE 
            WHEN random() < 0.4 THEN 'Startup Revenue'
            WHEN random() < 0.7 THEN 'Investor Distribution'
            ELSE 'Consulting Income'
          END;
        ELSIF user_record.username = 'david_retired' THEN
          amount := 4200.00 + (random() * 800 - 400); -- Retirement income
          description := CASE 
            WHEN random() < 0.5 THEN 'Social Security'
            WHEN random() < 0.8 THEN 'Pension Payment'
            ELSE 'Investment Dividend'
          END;
        ELSE
          amount := 5000.00;
          description := 'Monthly Income';
        END IF;

        -- Insert income transaction (only for checking accounts)
        IF account_record.account_type = 'checking' THEN
          INSERT INTO transactions (user_id, custom_user_id, account_id, category_id, description, amount, type, transaction_date)
          SELECT 
            user_record.id,
            user_record.id,
            account_record.id,
            c.id,
            description,
            amount,
            'income',
            transaction_date
          FROM categories c 
          WHERE c.name IN ('Salary', 'Freelance', 'Business Income', 'Investment Returns')
          AND c.user_id IS NULL
          ORDER BY random()
          LIMIT 1
          ON CONFLICT DO NOTHING;
        END IF;

        -- Create daily expense transactions throughout the month
        FOR day_offset IN 1..28 LOOP
          transaction_date := date_trunc('month', now()) - interval '1 month' * month_offset + interval '1 day' * day_offset + interval '1 hour' * (random() * 12 + 8);
          
          -- Skip some days randomly
          CONTINUE WHEN random() < 0.3;
          
          -- Generate expense transactions based on categories
          FOR category_record IN 
            SELECT id, name FROM categories 
            WHERE user_id IS NULL 
            AND name NOT IN ('Salary', 'Freelance', 'Business Income', 'Investment Returns', 'Rental Income', 'Side Hustle')
            ORDER BY random() 
            LIMIT CASE WHEN random() < 0.7 THEN 1 ELSE 2 END
          LOOP
            
            -- Generate realistic amounts based on category
            amount := CASE category_record.name
              WHEN 'Rent/Mortgage' THEN -(1800 + random() * 1200) -- $1800-3000
              WHEN 'Groceries' THEN -(45 + random() * 85) -- $45-130
              WHEN 'Dining Out' THEN -(25 + random() * 75) -- $25-100
              WHEN 'Coffee/Drinks' THEN -(4 + random() * 12) -- $4-16
              WHEN 'Gas' THEN -(35 + random() * 45) -- $35-80
              WHEN 'Utilities' THEN -(80 + random() * 120) -- $80-200
              WHEN 'Internet/Phone' THEN -(75 + random() * 50) -- $75-125
              WHEN 'Subscriptions' THEN -(12 + random() * 38) -- $12-50
              WHEN 'Entertainment' THEN -(20 + random() * 80) -- $20-100
              WHEN 'Shopping' THEN -(50 + random() * 200) -- $50-250
              WHEN 'Healthcare' THEN -(100 + random() * 300) -- $100-400
              WHEN 'Insurance' THEN -(200 + random() * 300) -- $200-500
              WHEN 'Travel' THEN -(300 + random() * 1200) -- $300-1500
              WHEN 'Investment' THEN -(500 + random() * 2000) -- $500-2500
              WHEN 'Savings Transfer' THEN -(1000 + random() * 2000) -- $1000-3000
              ELSE -(10 + random() * 90) -- Default $10-100
            END;

            -- Generate realistic descriptions
            description := CASE category_record.name
              WHEN 'Groceries' THEN (ARRAY['Whole Foods', 'Safeway', 'Trader Joes', 'Local Market', 'Costco'])[floor(random() * 5 + 1)]
              WHEN 'Dining Out' THEN (ARRAY['Italian Bistro', 'Sushi Restaurant', 'Local Cafe', 'Pizza Place', 'Thai Kitchen', 'Burger Joint'])[floor(random() * 6 + 1)]
              WHEN 'Coffee/Drinks' THEN (ARRAY['Starbucks', 'Local Coffee Shop', 'Blue Bottle', 'Peets Coffee', 'Dunkin'])[floor(random() * 5 + 1)]
              WHEN 'Gas' THEN (ARRAY['Shell Station', 'Chevron', 'BP Gas', 'Exxon', '76 Station'])[floor(random() * 5 + 1)]
              WHEN 'Subscriptions' THEN (ARRAY['Netflix', 'Spotify', 'Adobe Creative', 'Amazon Prime', 'Disney+', 'Gym Membership'])[floor(random() * 6 + 1)]
              WHEN 'Shopping' THEN (ARRAY['Amazon Purchase', 'Target', 'Best Buy', 'Local Store', 'Online Shopping', 'Department Store'])[floor(random() * 6 + 1)]
              WHEN 'Entertainment' THEN (ARRAY['Movie Theater', 'Concert Tickets', 'Streaming Service', 'Gaming', 'Books', 'Museum'])[floor(random() * 6 + 1)]
              WHEN 'Travel' THEN (ARRAY['Flight Booking', 'Hotel Stay', 'Car Rental', 'Train Ticket', 'Vacation Package'])[floor(random() * 5 + 1)]
              WHEN 'Utilities' THEN (ARRAY['Electric Bill', 'Water Bill', 'Gas Bill', 'Trash Service'])[floor(random() * 4 + 1)]
              WHEN 'Internet/Phone' THEN (ARRAY['Comcast Internet', 'Verizon Phone', 'AT&T Service', 'T-Mobile Bill'])[floor(random() * 4 + 1)]
              ELSE category_record.name || ' Expense'
            END;

            -- Only create expense if it makes sense for the day and category
            IF (category_record.name = 'Rent/Mortgage' AND day_offset = 1) OR
               (category_record.name NOT IN ('Rent/Mortgage') AND random() < 0.4) THEN
              
              INSERT INTO transactions (user_id, custom_user_id, account_id, category_id, description, amount, type, transaction_date)
              VALUES (
                user_record.id,
                user_record.id,
                account_record.id,
                category_record.id,
                description,
                amount,
                'expense',
                transaction_date
              )
              ON CONFLICT DO NOTHING;
            END IF;
          END LOOP;
        END LOOP;
      END LOOP;
    END LOOP;
  END LOOP;
END $$;

-- Create some custom categories for specific users
DO $$
DECLARE
  demo_user_id uuid;
  emma_id uuid;
  mike_id uuid;
  lisa_id uuid;
BEGIN
  SELECT id INTO demo_user_id FROM custom_users WHERE username = 'demo';
  SELECT id INTO emma_id FROM custom_users WHERE username = 'emma_dev';
  SELECT id INTO mike_id FROM custom_users WHERE username = 'mike_finance';
  SELECT id INTO lisa_id FROM custom_users WHERE username = 'lisa_startup';

  -- Custom categories for demo user (tech professional)
  IF demo_user_id IS NOT NULL THEN
    INSERT INTO categories (user_id, custom_user_id, name, icon_name) VALUES
      (demo_user_id, demo_user_id, 'Tech Gadgets', 'smartphone'),
      (demo_user_id, demo_user_id, 'Online Courses', 'book-open'),
      (demo_user_id, demo_user_id, 'Conferences', 'users')
    ON CONFLICT DO NOTHING;
  END IF;

  -- Custom categories for Emma (developer)
  IF emma_id IS NOT NULL THEN
    INSERT INTO categories (user_id, custom_user_id, name, icon_name) VALUES
      (emma_id, emma_id, 'Development Tools', 'code'),
      (emma_id, emma_id, 'Open Source Donations', 'heart'),
      (emma_id, emma_id, 'Hackathons', 'zap')
    ON CONFLICT DO NOTHING;
  END IF;

  -- Custom categories for Mike (finance)
  IF mike_id IS NOT NULL THEN
    INSERT INTO categories (user_id, custom_user_id, name, icon_name) VALUES
      (mike_id, mike_id, 'Financial Publications', 'newspaper'),
      (mike_id, mike_id, 'Professional Networking', 'users'),
      (mike_id, mike_id, 'Investment Research', 'search')
    ON CONFLICT DO NOTHING;
  END IF;

  -- Custom categories for Lisa (startup)
  IF lisa_id IS NOT NULL THEN
    INSERT INTO categories (user_id, custom_user_id, name, icon_name) VALUES
      (lisa_id, lisa_id, 'Startup Events', 'calendar'),
      (lisa_id, lisa_id, 'Product Development', 'settings'),
      (lisa_id, lisa_id, 'Investor Relations', 'trending-up')
    ON CONFLICT DO NOTHING;
  END IF;
END $$;