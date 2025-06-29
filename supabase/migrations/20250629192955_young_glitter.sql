/*
  # Fix RLS policy for leads table

  1. Security Updates
    - Update the INSERT policy for leads table to properly allow public/anonymous users to create leads
    - Ensure the policy allows form submissions from the contact form without authentication requirements

  2. Changes
    - Drop the existing restrictive INSERT policy
    - Create a new INSERT policy that allows anonymous users to submit leads
    - Keep other policies intact for authenticated operations
*/

-- Drop the existing INSERT policy that might be too restrictive
DROP POLICY IF EXISTS "Allow public lead creation" ON leads;

-- Create a new INSERT policy that allows anonymous users to create leads
CREATE POLICY "Allow anonymous lead creation"
  ON leads
  FOR INSERT
  TO anon, public
  WITH CHECK (true);

-- Ensure authenticated users can also create leads
CREATE POLICY "Allow authenticated lead creation"
  ON leads
  FOR INSERT
  TO authenticated
  WITH CHECK (true);