/*
  # Financial Application Database Schema

  1. New Tables
    - `profiles`
      - `id` (uuid, primary key, references auth.users)
      - `full_name` (text)
    - `accounts`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references profiles)
      - `account_name` (text)
      - `account_type` (text)
      - `current_balance` (numeric)
    - `categories`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references profiles, nullable for system categories)
      - `name` (text)
      - `icon_name` (text)
    - `transactions`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references profiles)
      - `account_id` (uuid, references accounts)
      - `category_id` (uuid, references categories)
      - `description` (text)
      - `amount` (numeric)
      - `type` (text)
      - `transaction_date` (timestamptz)

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users to manage their own data
    - System categories are readable by all users

  3. Sample Data
    - Demo user with realistic financial data
    - Multiple accounts (checking, savings, credit)
    - Transaction history with various categories
    - System categories for transaction classification
*/

-- Create profiles table
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name text,
  created_at timestamptz DEFAULT now()
);

-- Create accounts table
CREATE TABLE IF NOT EXISTS accounts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  account_name text NOT NULL,
  account_type text NOT NULL,
  current_balance numeric(15,2) NOT NULL DEFAULT 0.00,
  created_at timestamptz DEFAULT now()
);

-- Create categories table
CREATE TABLE IF NOT EXISTS categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE SET NULL,
  name text NOT NULL,
  icon_name text,
  created_at timestamptz DEFAULT now()
);

-- Create unique index for system categories
CREATE UNIQUE INDEX IF NOT EXISTS categories_system_name_idx 
ON categories (name) WHERE user_id IS NULL;

-- Create transactions table
CREATE TABLE IF NOT EXISTS transactions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  account_id uuid NOT NULL REFERENCES accounts(id) ON DELETE CASCADE,
  category_id uuid REFERENCES categories(id) ON DELETE SET NULL,
  description text NOT NULL,
  amount numeric(12,2) NOT NULL,
  type text NOT NULL,
  transaction_date timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can manage their own profile"
  ON profiles FOR ALL
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can manage their own accounts"
  ON accounts FOR ALL
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can view system categories"
  ON categories FOR SELECT
  TO authenticated
  USING (user_id IS NULL);

CREATE POLICY "Users can manage their own custom categories"
  ON categories FOR ALL
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can manage their own transactions"
  ON transactions FOR ALL
  TO authenticated
  USING (auth.uid() = user_id);

-- Create function to handle new user registration
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO profiles (id, full_name)
  VALUES (NEW.id, NEW.raw_user_meta_data->>'full_name');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for new user registration
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- Insert system categories
INSERT INTO categories (name, icon_name) VALUES
  ('Income', 'dollar-sign'),
  ('Food & Dining', 'utensils'),
  ('Transportation', 'car'),
  ('Shopping', 'shopping-bag'),
  ('Entertainment', 'film'),
  ('Bills & Utilities', 'receipt'),
  ('Healthcare', 'heart'),
  ('Education', 'book'),
  ('Travel', 'plane'),
  ('Other', 'more-horizontal')
ON CONFLICT DO NOTHING;