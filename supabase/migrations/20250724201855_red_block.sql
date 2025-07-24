/*
  # Create User Profiles Table

  1. New Tables
    - `user_profiles`
      - `id` (uuid, primary key)
      - `custom_user_id` (uuid, foreign key to custom_users)
      - `first_name` (text)
      - `last_name` (text)
      - `email` (text)
      - `phone` (text)
      - `bio` (text)
      - `location` (text)
      - `occupation` (text)
      - `profile_picture_url` (text)
      - `credit_score` (integer)
      - `total_balance` (numeric)
      - `monthly_income` (numeric)
      - `monthly_expenses` (numeric)
      - `savings_rate` (numeric)
      - `timezone` (text)
      - `currency` (text)
      - `language` (text)
      - `join_date` (timestamp)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on `user_profiles` table
    - Add policy for users to manage their own profiles
    - Add indexes for performance

  3. Sample Data
    - Insert sample profiles for demo users
*/

-- Create user_profiles table
CREATE TABLE IF NOT EXISTS user_profiles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  custom_user_id uuid REFERENCES custom_users(id) ON DELETE CASCADE,
  first_name text,
  last_name text,
  email text,
  phone text,
  bio text,
  location text,
  occupation text,
  profile_picture_url text,
  credit_score integer DEFAULT 700,
  total_balance numeric(15,2) DEFAULT 0.00,
  monthly_income numeric(12,2) DEFAULT 0.00,
  monthly_expenses numeric(12,2) DEFAULT 0.00,
  savings_rate numeric(5,2) DEFAULT 0.00,
  timezone text DEFAULT 'America/New_York',
  currency text DEFAULT 'USD',
  language text DEFAULT 'en',
  join_date timestamptz DEFAULT now(),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view their own profile"
  ON user_profiles
  FOR SELECT
  TO public
  USING (custom_user_id IN (
    SELECT id FROM custom_users WHERE username = CURRENT_USER
  ));

CREATE POLICY "Users can insert their own profile"
  ON user_profiles
  FOR INSERT
  TO public
  WITH CHECK (custom_user_id IN (
    SELECT id FROM custom_users WHERE username = CURRENT_USER
  ));

CREATE POLICY "Users can update their own profile"
  ON user_profiles
  FOR UPDATE
  TO public
  USING (custom_user_id IN (
    SELECT id FROM custom_users WHERE username = CURRENT_USER
  ))
  WITH CHECK (custom_user_id IN (
    SELECT id FROM custom_users WHERE username = CURRENT_USER
  ));

CREATE POLICY "Users can delete their own profile"
  ON user_profiles
  FOR DELETE
  TO public
  USING (custom_user_id IN (
    SELECT id FROM custom_users WHERE username = CURRENT_USER
  ));

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_user_profiles_custom_user_id ON user_profiles(custom_user_id);
CREATE INDEX IF NOT EXISTS idx_user_profiles_email ON user_profiles(email);
CREATE INDEX IF NOT EXISTS idx_user_profiles_updated_at ON user_profiles(updated_at DESC);

-- Create trigger function for updated_at
CREATE OR REPLACE FUNCTION update_user_profiles_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger
DROP TRIGGER IF EXISTS update_user_profiles_updated_at ON user_profiles;
CREATE TRIGGER update_user_profiles_updated_at
  BEFORE UPDATE ON user_profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_user_profiles_updated_at();

-- Insert sample profile data for demo users
DO $$
BEGIN
  -- Profile for johndoe user
  IF EXISTS (SELECT 1 FROM custom_users WHERE username = 'johndoe') THEN
    INSERT INTO user_profiles (
      custom_user_id,
      first_name,
      last_name,
      email,
      phone,
      bio,
      location,
      occupation,
      credit_score,
      total_balance,
      monthly_income,
      monthly_expenses,
      savings_rate,
      timezone,
      currency,
      language
    )
    SELECT 
      id,
      'John',
      'Doe',
      'john.doe@example.com',
      '+1 (555) 123-4567',
      'Financial enthusiast focused on building long-term wealth through smart investments and disciplined budgeting.',
      'San Francisco, CA',
      'Software Engineer',
      742,
      381499.50,
      8150.00,
      2984.09,
      63.4,
      'America/Los_Angeles',
      'USD',
      'en'
    FROM custom_users 
    WHERE username = 'johndoe'
    ON CONFLICT DO NOTHING;
  END IF;

  -- Profile for demo user
  IF EXISTS (SELECT 1 FROM custom_users WHERE username = 'demo') THEN
    INSERT INTO user_profiles (
      custom_user_id,
      first_name,
      last_name,
      email,
      phone,
      bio,
      location,
      occupation,
      credit_score,
      total_balance,
      monthly_income,
      monthly_expenses,
      savings_rate,
      timezone,
      currency,
      language
    )
    SELECT 
      id,
      'Demo',
      'User',
      'demo@example.com',
      '+1 (555) 987-6543',
      'Exploring financial management tools and learning about investment strategies.',
      'New York, NY',
      'Marketing Manager',
      698,
      125750.00,
      5500.00,
      3200.00,
      41.8,
      'America/New_York',
      'USD',
      'en'
    FROM custom_users 
    WHERE username = 'demo'
    ON CONFLICT DO NOTHING;
  END IF;

  -- Profile for testuser
  IF EXISTS (SELECT 1 FROM custom_users WHERE username = 'testuser') THEN
    INSERT INTO user_profiles (
      custom_user_id,
      first_name,
      last_name,
      email,
      phone,
      bio,
      location,
      occupation,
      credit_score,
      total_balance,
      monthly_income,
      monthly_expenses,
      savings_rate,
      timezone,
      currency,
      language
    )
    SELECT 
      id,
      'Test',
      'User',
      'testuser@example.com',
      '+1 (555) 456-7890',
      'Testing various financial scenarios and budgeting approaches.',
      'Austin, TX',
      'Product Manager',
      715,
      89250.00,
      4800.00,
      2950.00,
      38.5,
      'America/Chicago',
      'USD',
      'en'
    FROM custom_users 
    WHERE username = 'testuser'
    ON CONFLICT DO NOTHING;
  END IF;
END $$;