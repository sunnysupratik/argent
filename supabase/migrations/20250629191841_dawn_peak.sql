/*
  # Create Leads Table for Contact Form Submissions

  1. New Table
    - `leads`
      - `id` (uuid, primary key)
      - `name` (text, not null)
      - `email` (text, not null)
      - `company` (text)
      - `phone` (text)
      - `subject` (text, not null)
      - `message` (text, not null)
      - `source` (text)
      - `budget` (text)
      - `timeline` (text)
      - `interests` (text[])
      - `status` (text, default 'New')
      - `priority` (text, default 'Medium')
      - `created_at` (timestamptz, default now())
      - `updated_at` (timestamptz, default now())
      - `assigned_to` (text)
      - `last_contacted` (timestamptz)
      - `notes` (text)

  2. Security
    - Enable RLS on the leads table
    - Add policies for authenticated users to create leads
    - Add policies for admins to manage leads

  3. Indexes
    - Create indexes for better query performance
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
  source text,
  budget text,
  timeline text,
  interests text[],
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

-- Create policy for creating leads (anyone can submit a lead)
CREATE POLICY "Anyone can create leads"
  ON leads
  FOR INSERT
  TO public
  WITH CHECK (true);

-- Create policy for admins to manage leads
CREATE POLICY "Admins can manage leads"
  ON leads
  FOR ALL
  TO authenticated
  USING (auth.uid() IN (
    SELECT id FROM auth.users WHERE auth.jwt() ->> 'role' = 'admin'
  ));

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_leads_email ON leads(email);
CREATE INDEX IF NOT EXISTS idx_leads_status ON leads(status);
CREATE INDEX IF NOT EXISTS idx_leads_created_at ON leads(created_at);

-- Create function to update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_leads_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to update the updated_at timestamp
CREATE TRIGGER update_leads_updated_at
BEFORE UPDATE ON leads
FOR EACH ROW
EXECUTE FUNCTION update_leads_updated_at();

-- Create a view for leads with additional information
CREATE OR REPLACE VIEW leads_summary AS
SELECT 
  l.*,
  EXTRACT(EPOCH FROM (now() - l.created_at))/86400 AS days_since_creation,
  CASE 
    WHEN l.status = 'New' THEN 'Needs Review'
    WHEN l.status = 'Contacted' AND l.last_contacted < now() - interval '7 days' THEN 'Follow Up'
    ELSE l.status
  END AS action_status
FROM leads l;

-- Grant access to the view
GRANT SELECT ON leads_summary TO authenticated;