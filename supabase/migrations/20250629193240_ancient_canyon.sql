/*
  # Fix RLS Policy for Leads Table

  1. Security Updates
    - Drop existing conflicting policies
    - Create proper RLS policies for anonymous and authenticated users
    - Ensure anonymous users can create leads via contact form
    - Ensure authenticated users can manage leads

  2. Changes
    - Remove duplicate/conflicting policies
    - Add clear policy for anonymous lead creation
    - Add policy for authenticated users to manage leads
*/

-- Drop existing policies to avoid conflicts
DROP POLICY IF EXISTS "Allow anonymous lead creation" ON leads;
DROP POLICY IF EXISTS "Allow authenticated lead creation" ON leads;
DROP POLICY IF EXISTS "Allow authenticated users to read leads" ON leads;
DROP POLICY IF EXISTS "Allow authenticated users to update leads" ON leads;
DROP POLICY IF EXISTS "Allow authenticated users to delete leads" ON leads;

-- Create new, clear policies
-- Allow anonymous users to create leads (for contact form)
CREATE POLICY "Enable insert for anonymous users"
  ON leads
  FOR INSERT
  TO anon
  WITH CHECK (true);

-- Allow public role to create leads (backup for contact form)
CREATE POLICY "Enable insert for public users"
  ON leads
  FOR INSERT
  TO public
  WITH CHECK (true);

-- Allow authenticated users to read all leads
CREATE POLICY "Enable read for authenticated users"
  ON leads
  FOR SELECT
  TO authenticated
  USING (true);

-- Allow authenticated users to update leads
CREATE POLICY "Enable update for authenticated users"
  ON leads
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Allow authenticated users to delete leads
CREATE POLICY "Enable delete for authenticated users"
  ON leads
  FOR DELETE
  TO authenticated
  USING (true);