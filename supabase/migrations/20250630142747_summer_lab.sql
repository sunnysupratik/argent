/*
  # Create Leads Table for Contact Form Submissions

  1. New Table
    - `leads`
      - `id` (uuid, primary key)
      - `name` (text, required)
      - `email` (text, required)
      - `company` (text, optional)
      - `phone` (text, optional)
      - `subject` (text, required)
      - `message` (text, required)
      - `source` (text, optional)
      - `budget` (text, optional)
      - `timeline` (text, optional)
      - `interests` (text, optional)
      - `status` (text, default: 'New')
      - `priority` (text, default: 'Medium')
      - `created_at` (timestamptz, default: now())
      - `updated_at` (timestamptz, default: now())
      - `assigned_to` (text, optional)
      - `last_contacted` (timestamptz, optional)
      - `notes` (text, optional)

  2. Security
    - Enable RLS on the leads table
    - Add policies for authenticated users to manage leads
*/

-- Create leads table
CREATE TABLE IF NOT EXISTS leads (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text NOT NULL,
  company text,
  phone text,
  subject text NOT NULL,
  message text NOT NULL,
  source text DEFAULT 'Website Contact Form',
  budget text,
  timeline text,
  interests text,
  status text DEFAULT 'New',
  priority text DEFAULT 'Medium',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  assigned_to text,
  last_contacted timestamptz,
  notes text
);

-- Enable Row Level Security
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Authenticated users can insert leads"
  ON leads
  FOR INSERT
  TO public
  WITH CHECK (true);

CREATE POLICY "Authenticated users can view leads"
  ON leads
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can update leads"
  ON leads
  FOR UPDATE
  TO authenticated
  USING (true);

-- Create index for better performance
CREATE INDEX IF NOT EXISTS idx_leads_created_at ON leads(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_leads_status ON leads(status);
CREATE INDEX IF NOT EXISTS idx_leads_email ON leads(email);