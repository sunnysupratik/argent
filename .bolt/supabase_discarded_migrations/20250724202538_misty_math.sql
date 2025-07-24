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
    - Create indexes for performance optimization

  3. Sample Data
    - Pre-populate profiles for existing demo users
    - Include realistic financial data matching the interface
*/

-- Create the user_profiles table
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

-- Enable Row Level Security
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;

-- Create policies for user access
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
  timezone,
  currency,
  language
) VALUES 
-- John Doe profile (matching the interface data)
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
  'America/Los_Angeles',
  'USD',
  'en'
),
-- Demo user profile
(
  (SELECT id FROM custom_users WHERE username = 'demo'),
  'Alex',
  'Johnson',
  'demo@example.com',
  '+1 (555) 234-5678',
  'Marketing professional with a passion for personal finance and investment strategies.',
  'New York, NY',
  'Marketing Manager',
  728,
  125750.25,
  6500.00,
  4200.00,
  35.4,
  'America/New_York',
  'USD',
  'en'
),
-- Test user profile
(
  (SELECT id FROM custom_users WHERE username = 'testuser'),
  'Sarah',
  'Wilson',
  'testuser@example.com',
  '+1 (555) 345-6789',
  'Business analyst focused on data-driven financial decisions and retirement planning.',
  'Austin, TX',
  'Business Analyst',
  756,
  89320.75,
  5800.00,
  3100.00,
  46.6,
  'America/Chicago',
  'USD',
  'en'
),
-- Lisa Thompson profile
(
  (SELECT id FROM custom_users WHERE username = 'lisa_startup'),
  'Lisa',
  'Thompson',
  'lisa.thompson@example.com',
  '+1 (555) 456-7890',
  'Startup founder passionate about financial technology and building wealth through entrepreneurship.',
  'Seattle, WA',
  'Startup Founder',
  698,
  245680.00,
  12000.00,
  7500.00,
  37.5,
  'America/Los_Angeles',
  'USD',
  'en'
),
-- Emma Rodriguez profile
(
  (SELECT id FROM custom_users WHERE username = 'emma_dev'),
  'Emma',
  'Rodriguez',
  'emma.rodriguez@example.com',
  '+1 (555) 567-8901',
  'Software developer with expertise in fintech applications and personal investment strategies.',
  'Miami, FL',
  'Software Developer',
  715,
  156890.30,
  7200.00,
  4800.00,
  33.3,
  'America/New_York',
  'USD',
  'en'
),
-- David Williams profile
(
  (SELECT id FROM custom_users WHERE username = 'david_retired'),
  'David',
  'Williams',
  'david.williams@example.com',
  '+1 (555) 678-9012',
  'Retired financial advisor enjoying the fruits of decades of smart investing and financial planning.',
  'Phoenix, AZ',
  'Retired Financial Advisor',
  780,
  892450.75,
  4500.00,
  3200.00,
  28.9,
  'America/Phoenix',
  'USD',
  'en'
),
-- Michael Chen profile
(
  (SELECT id FROM custom_users WHERE username = 'mike_finance'),
  'Michael',
  'Chen',
  'michael.chen@example.com',
  '+1 (555) 789-0123',
  'Finance professional specializing in portfolio management and wealth optimization strategies.',
  'Chicago, IL',
  'Finance Manager',
  765,
  324567.80,
  9800.00,
  5600.00,
  42.9,
  'America/Chicago',
  'USD',
  'en'
)
ON CONFLICT (custom_user_id) DO UPDATE SET
  first_name = EXCLUDED.first_name,
  last_name = EXCLUDED.last_name,
  email = EXCLUDED.email,
  phone = EXCLUDED.phone,
  bio = EXCLUDED.bio,
  location = EXCLUDED.location,
  occupation = EXCLUDED.occupation,
  credit_score = EXCLUDED.credit_score,
  total_balance = EXCLUDED.total_balance,
  monthly_income = EXCLUDED.monthly_income,
  monthly_expenses = EXCLUDED.monthly_expenses,
  savings_rate = EXCLUDED.savings_rate,
  timezone = EXCLUDED.timezone,
  currency = EXCLUDED.currency,
  language = EXCLUDED.language,
  updated_at = now();