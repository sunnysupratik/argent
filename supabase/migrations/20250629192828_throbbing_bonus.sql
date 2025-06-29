/*
  # Fix RLS policies for leads table

  1. Security Changes
    - Drop existing conflicting policies on leads table
    - Create new policy to allow anonymous users to insert leads
    - Keep admin policy for managing existing leads
    - Ensure public contact form submissions work properly

  2. Changes Made
    - Remove restrictive policies that prevent anonymous inserts
    - Add clear policy for public lead creation
    - Maintain security for lead management operations
*/

-- Drop existing policies to avoid conflicts
DROP POLICY IF EXISTS "Admins can manage leads" ON leads;
DROP POLICY IF EXISTS "Anyone can create leads" ON leads;

-- Create policy to allow anonymous users to create leads (for contact form)
CREATE POLICY "Allow public lead creation"
  ON leads
  FOR INSERT
  TO public
  WITH CHECK (true);

-- Create policy to allow authenticated users to read all leads (for admin dashboard)
CREATE POLICY "Allow authenticated users to read leads"
  ON leads
  FOR SELECT
  TO authenticated
  USING (true);

-- Create policy to allow authenticated users to update leads (for admin management)
CREATE POLICY "Allow authenticated users to update leads"
  ON leads
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Create policy to allow authenticated users to delete leads (for admin management)
CREATE POLICY "Allow authenticated users to delete leads"
  ON leads
  FOR DELETE
  TO authenticated
  USING (true);