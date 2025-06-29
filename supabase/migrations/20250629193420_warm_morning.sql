/*
  # Fix RLS policies for leads table

  1. Security Updates
    - Drop existing problematic policies for leads table
    - Create new, properly configured policies for anonymous and authenticated users
    - Ensure anonymous users can insert leads (for contact form submissions)
    - Ensure authenticated users can manage leads (for admin access)

  2. Policy Details
    - Allow anonymous users to insert new leads
    - Allow authenticated users full access to leads
    - Maintain data security while enabling contact form functionality
*/

-- Drop existing policies that might be causing issues
DROP POLICY IF EXISTS "Enable insert for anonymous users" ON leads;
DROP POLICY IF EXISTS "Enable insert for public users" ON leads;
DROP POLICY IF EXISTS "Enable read for authenticated users" ON leads;
DROP POLICY IF EXISTS "Enable update for authenticated users" ON leads;
DROP POLICY IF EXISTS "Enable delete for authenticated users" ON leads;

-- Create new policies with proper configuration
CREATE POLICY "Allow anonymous users to insert leads"
  ON leads
  FOR INSERT
  TO anon
  WITH CHECK (true);

CREATE POLICY "Allow public users to insert leads"
  ON leads
  FOR INSERT
  TO public
  WITH CHECK (true);

CREATE POLICY "Allow authenticated users full access to leads"
  ON leads
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Ensure RLS is enabled
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;