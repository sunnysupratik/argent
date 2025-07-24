/*
  # Enhanced User Profiles Table

  1. New Tables
    - `user_profiles`
      - `id` (uuid, primary key)
      - `custom_user_id` (uuid, foreign key to custom_users)
      - `first_name` (text)
      - `last_name` (text)
      - `email` (text)
      - `phone` (text)
      - `bio` (text)
      - `location` (text) - city information
      - `occupation` (text)
      - `profile_picture_url` (text)
      - `credit_score` (integer, default 700)
      - `total_balance` (numeric, default 0.00)
      - `monthly_income` (numeric, default 0.00)
      - `monthly_expenses` (numeric, default 0.00)
      - `savings_rate` (numeric, default 0.00)
      - `timezone` (text, default 'America/New_York')
      - `currency` (text, default 'USD')
      - `language` (text, default 'en')
      - `join_date` (timestamptz, default now())
      - `created_at` (timestamptz, default now())
      - `updated_at` (timestamptz, default now())

  2. Security
    - Enable RLS on `user_profiles` table
    - Add policies for users to manage their own profiles
    - Add trigger for updating `updated_at` timestamp

  3. Sample Data
    - Create profiles for existing demo users with realistic data
</*/

-- Create the enhanced user_profiles table
CREATE TABLE IF NOT EXISTS user_profiles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  custom_user_id uuid REFERENCES custom_users(id) ON DELETE CASCADE,
  first_name text,
  last_name text,
  email text,
  phone text,
  bio text,
  location text, -- City information like "San Francisco, CA"
  occupation text,
  profile_picture_url text,
  credit_score integer DEFAULT 700,
  total_balance numeric(15,2) DEFAULT 0.00,
  monthly_income numeric(12,2) DEFAULT 0.00,
  monthly_expenses numeric(12,2) DEFAULT 0.00,
  savings_rate numeric(5,2) DEFAULT 0.00, -- Percentage
  timezone text DEFAULT 'America/New_York',
  currency text DEFAULT 'USD',
  language text DEFAULT 'en',
  join_date timestamptz DEFAULT now(),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;

-- Create policies for user_profiles
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

-- Create trigger function for updating updated_at
CREATE OR REPLACE FUNCTION update_user_profiles_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger
CREATE TRIGGER update_user_profiles_updated_at
  BEFORE UPDATE ON user_profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_user_profiles_updated_at();

-- Insert sample profile data for existing users
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
  join_date
) VALUES 
-- John Doe profile (matches the interface screenshot)
(
  (SELECT id FROM custom_users WHERE username = 'johndoe'),
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
  '2025-07-24 00:00:00+00'
),
-- Demo user profile
(
  (SELECT id FROM custom_users WHERE username = 'demo'),
  'Alex',
  'Johnson',
  'demo@example.com',
  '+1 (555) 987-6543',
  'Experienced investor with a focus on diversified portfolio management and risk assessment.',
  'New York, NY',
  'Financial Analyst',
  758,
  245750.00,
  6500.00,
  3200.00,
  50.8,
  '2025-06-25 00:00:00+00'
),
-- Test user profile
(
  (SELECT id FROM custom_users WHERE username = 'testuser'),
  'Sarah',
  'Wilson',
  'testuser@example.com',
  '+1 (555) 456-7890',
  'Young professional starting their financial journey with a focus on building emergency funds and learning about investments.',
  'Austin, TX',
  'Marketing Manager',
  695,
  45250.00,
  4200.00,
  2800.00,
  33.3,
  '2025-06-25 00:00:00+00'
),
-- Lisa Thompson (startup founder)
(
  (SELECT id FROM custom_users WHERE username = 'lisa_startup'),
  'Lisa',
  'Thompson',
  'lisa.thompson@example.com',
  '+1 (555) 234-5678',
  'Startup founder focused on scaling business while maintaining personal financial health.',
  'Seattle, WA',
  'Startup Founder',
  720,
  125000.00,
  12000.00,
  5500.00,
  54.2,
  '2025-06-25 00:00:00+00'
),
-- Emma Rodriguez (developer)
(
  (SELECT id FROM custom_users WHERE username = 'emma_dev'),
  'Emma',
  'Rodriguez',
  'emma.rodriguez@example.com',
  '+1 (555) 345-6789',
  'Software developer passionate about fintech and building wealth through technology investments.',
  'Denver, CO',
  'Senior Developer',
  735,
  89500.00,
  7800.00,
  3100.00,
  60.3,
  '2025-06-25 00:00:00+00'
),
-- David Williams (retired)
(
  (SELECT id FROM custom_users WHERE username = 'david_retired'),
  'David',
  'Williams',
  'david.williams@example.com',
  '+1 (555) 567-8901',
  'Retired professional focused on wealth preservation and generating passive income streams.',
  'Phoenix, AZ',
  'Retired Executive',
  780,
  850000.00,
  4500.00,
  3200.00,
  28.9,
  '2025-06-25 00:00:00+00'
),
-- Michael Chen (finance professional)
(
  (SELECT id FROM custom_users WHERE username = 'mike_finance'),
  'Michael',
  'Chen',
  'michael.chen@example.com',
  '+1 (555) 678-9012',
  'Finance professional specializing in portfolio optimization and risk management strategies.',
  'Chicago, IL',
  'Portfolio Manager',
  765,
  320000.00,
  9500.00,
  4200.00,
  55.8,
  '2025-06-25 00:00:00+00'
)
ON CONFLICT (custom_user_id) DO NOTHING;