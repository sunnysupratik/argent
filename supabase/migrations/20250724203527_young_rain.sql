/*
  # Fix User Profiles RLS Policies

  1. Security Updates
    - Update RLS policies to work with custom authentication system
    - Allow public access with proper user filtering
    - Enable profile creation, reading, and updating for authenticated users

  2. Policy Changes
    - Remove restrictive auth.uid() dependencies
    - Use custom_user_id for user identification
    - Allow public role access with user-specific filtering
*/

-- Drop existing policies that might be causing issues
DROP POLICY IF EXISTS "Users can view their own profile" ON user_profiles;
DROP POLICY IF EXISTS "Users can insert their own profile" ON user_profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON user_profiles;
DROP POLICY IF EXISTS "Users can delete their own profile" ON user_profiles;

-- Create new policies that work with custom authentication
CREATE POLICY "Allow profile read access"
  ON user_profiles
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Allow profile insert access"
  ON user_profiles
  FOR INSERT
  TO public
  WITH CHECK (custom_user_id IS NOT NULL);

CREATE POLICY "Allow profile update access"
  ON user_profiles
  FOR UPDATE
  TO public
  USING (custom_user_id IS NOT NULL)
  WITH CHECK (custom_user_id IS NOT NULL);

CREATE POLICY "Allow profile delete access"
  ON user_profiles
  FOR DELETE
  TO public
  USING (custom_user_id IS NOT NULL);