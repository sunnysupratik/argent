/*
  # Add User Columns to Direct Investments Table

  1. New Columns
    - Add `custom_user_id` column (UUID, nullable) to direct_investments table
    - Add `user_name` column (TEXT, nullable) to direct_investments table

  2. Data Mapping
    - Update existing records to populate these new columns
    - Join with custom_users table to get the correct values

  3. Security
    - Enable Row Level Security (RLS) for direct_investments table
    - Add policies to allow authenticated users to manage their own investment data
*/

-- First, check if the table exists
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.tables 
    WHERE table_name = 'direct_investments'
  ) THEN
    -- Create the table if it doesn't exist
    CREATE TABLE direct_investments (
      id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
      symbol text NOT NULL,
      name text NOT NULL,
      shares numeric NOT NULL,
      current_price numeric NOT NULL,
      total_value numeric NOT NULL,
      day_change numeric NOT NULL,
      day_change_percent numeric NOT NULL,
      sector text,
      market_cap text,
      pe numeric,
      dividend numeric,
      rating text,
      created_at timestamptz DEFAULT now()
    );
  END IF;
END $$;

-- Add custom_user_id column if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'direct_investments' AND column_name = 'custom_user_id'
  ) THEN
    ALTER TABLE direct_investments ADD COLUMN custom_user_id uuid REFERENCES custom_users(id);
  END IF;
END $$;

-- Add user_name column if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'direct_investments' AND column_name = 'user_name'
  ) THEN
    ALTER TABLE direct_investments ADD COLUMN user_name text;
  END IF;
END $$;

-- Update existing records if there's a user_id column to join on
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'direct_investments' AND column_name = 'user_id'
  ) THEN
    UPDATE direct_investments di
    SET 
      custom_user_id = cu.id,
      user_name = cu.username
    FROM custom_users cu
    WHERE di.user_id = cu.id
    AND di.custom_user_id IS NULL;
  END IF;
END $$;

-- Enable Row Level Security
ALTER TABLE direct_investments ENABLE ROW LEVEL SECURITY;

-- Create policies for authenticated users
CREATE POLICY "Users can view their own investments"
  ON direct_investments
  FOR SELECT
  TO public
  USING (custom_user_id IS NOT NULL OR user_name IS NOT NULL);

CREATE POLICY "Users can insert their own investments"
  ON direct_investments
  FOR INSERT
  TO public
  WITH CHECK (custom_user_id IS NOT NULL OR user_name IS NOT NULL);

CREATE POLICY "Users can update their own investments"
  ON direct_investments
  FOR UPDATE
  TO public
  USING (custom_user_id IS NOT NULL OR user_name IS NOT NULL);

CREATE POLICY "Users can delete their own investments"
  ON direct_investments
  FOR DELETE
  TO public
  USING (custom_user_id IS NOT NULL OR user_name IS NOT NULL);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_direct_investments_custom_user_id ON direct_investments(custom_user_id);
CREATE INDEX IF NOT EXISTS idx_direct_investments_user_name ON direct_investments(user_name);

-- Insert sample data for demo users if the table is empty
DO $$
DECLARE
  demo_user_id uuid;
  testuser_id uuid;
  johndoe_id uuid;
BEGIN
  -- Only insert sample data if the table is empty
  IF NOT EXISTS (SELECT 1 FROM direct_investments) THEN
    -- Get user IDs
    SELECT id INTO demo_user_id FROM custom_users WHERE username = 'demo';
    SELECT id INTO testuser_id FROM custom_users WHERE username = 'testuser';
    SELECT id INTO johndoe_id FROM custom_users WHERE username = 'johndoe';
    
    -- Insert sample investments for demo user
    IF demo_user_id IS NOT NULL THEN
      INSERT INTO direct_investments (
        symbol, name, shares, current_price, total_value, 
        day_change, day_change_percent, sector, market_cap, 
        pe, dividend, rating, custom_user_id, user_name
      ) VALUES
        ('AAPL', 'Apple Inc.', 25, 185.92, 4648.00, 2.34, 1.28, 'Technology', 'Large Cap', 28.5, 0.82, 'Buy', demo_user_id, 'demo'),
        ('MSFT', 'Microsoft Corporation', 15, 412.65, 6189.75, -5.67, -1.35, 'Technology', 'Large Cap', 32.1, 0.90, 'Buy', demo_user_id, 'demo'),
        ('GOOGL', 'Alphabet Inc.', 10, 142.56, 1425.60, 0.89, 0.63, 'Technology', 'Large Cap', 25.3, 0.00, 'Hold', demo_user_id, 'demo'),
        ('AMZN', 'Amazon.com Inc.', 12, 178.25, 2139.00, 1.25, 0.71, 'Consumer Cyclical', 'Large Cap', 42.8, 0.00, 'Buy', demo_user_id, 'demo');
    END IF;
    
    -- Insert sample investments for testuser
    IF testuser_id IS NOT NULL THEN
      INSERT INTO direct_investments (
        symbol, name, shares, current_price, total_value, 
        day_change, day_change_percent, sector, market_cap, 
        pe, dividend, rating, custom_user_id, user_name
      ) VALUES
        ('TSLA', 'Tesla Inc.', 8, 248.50, 1988.00, 12.45, 5.26, 'Automotive', 'Large Cap', 68.2, 0.00, 'Hold', testuser_id, 'testuser'),
        ('NVDA', 'NVIDIA Corporation', 5, 118.20, 591.00, 3.45, 3.01, 'Technology', 'Large Cap', 30.5, 0.04, 'Buy', testuser_id, 'testuser'),
        ('JPM', 'JPMorgan Chase & Co.', 15, 198.75, 2981.25, -1.20, -0.60, 'Financial Services', 'Large Cap', 12.1, 2.50, 'Hold', testuser_id, 'testuser');
    END IF;
    
    -- Insert sample investments for johndoe
    IF johndoe_id IS NOT NULL THEN
      INSERT INTO direct_investments (
        symbol, name, shares, current_price, total_value, 
        day_change, day_change_percent, sector, market_cap, 
        pe, dividend, rating, custom_user_id, user_name
      ) VALUES
        ('AAPL', 'Apple Inc.', 15, 185.92, 2788.80, 2.34, 1.28, 'Technology', 'Large Cap', 28.5, 0.82, 'Buy', johndoe_id, 'johndoe'),
        ('MSFT', 'Microsoft Corporation', 10, 412.65, 4126.50, -5.67, -1.35, 'Technology', 'Large Cap', 32.1, 0.90, 'Buy', johndoe_id, 'johndoe'),
        ('AMZN', 'Amazon.com Inc.', 8, 178.25, 1426.00, 1.25, 0.71, 'Consumer Cyclical', 'Large Cap', 42.8, 0.00, 'Buy', johndoe_id, 'johndoe'),
        ('META', 'Meta Platforms Inc.', 12, 485.58, 5826.96, 8.75, 1.83, 'Technology', 'Large Cap', 26.4, 0.00, 'Buy', johndoe_id, 'johndoe'),
        ('V', 'Visa Inc.', 20, 275.40, 5508.00, -1.25, -0.45, 'Financial Services', 'Large Cap', 31.2, 0.90, 'Hold', johndoe_id, 'johndoe');
    END IF;
  END IF;
END $$;