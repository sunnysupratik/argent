/*
  # Disable RLS on leads table

  1. Security Changes
    - Disable Row Level Security on `leads` table
    - Remove all existing policies on `leads` table
    - Allow unrestricted access to leads table for all operations

  This migration removes all security restrictions from the leads table to allow
  anonymous users to insert leads without authentication requirements.
*/

-- Disable Row Level Security on leads table
ALTER TABLE leads DISABLE ROW LEVEL SECURITY;

-- Drop all existing policies on leads table
DROP POLICY IF EXISTS "Allow anonymous users to insert leads" ON leads;
DROP POLICY IF EXISTS "Allow authenticated users full access to leads" ON leads;
DROP POLICY IF EXISTS "Allow public users to insert leads" ON leads;