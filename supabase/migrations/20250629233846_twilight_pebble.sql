/*
  # Fix Demo User Authentication

  1. Demo Users Setup
    - Ensure demo users exist in custom_users table
    - Set up proper credentials for demo, testuser, and johndoe
    - Match the credentials expected by the frontend

  2. Authentication
    - Verify user credentials match frontend expectations
    - Ensure proper user_name mapping
*/

-- Insert or update demo users in custom_users table
INSERT INTO custom_users (username, password, full_name, email, user_name) VALUES
('demo', 'Password123!', 'Alex Johnson', 'demo@example.com', 'demo'),
('testuser', 'TestPass123!', 'Sarah Wilson', 'testuser@example.com', 'testuser'),
('johndoe', 'Demo123!', 'John Doe', 'john.doe@example.com', 'johndoe')
ON CONFLICT (username) DO UPDATE SET
  password = EXCLUDED.password,
  full_name = EXCLUDED.full_name,
  email = EXCLUDED.email,
  user_name = EXCLUDED.user_name;

-- Ensure profiles exist for demo users
INSERT INTO profiles (id, full_name, user_name, location, occupation, bio) VALUES
(
  (SELECT id FROM custom_users WHERE username = 'demo'),
  'Alex Johnson',
  'demo',
  'San Francisco, CA',
  'Marketing Manager',
  'Passionate about financial planning and investment strategies. Always looking for ways to optimize spending and maximize savings.'
),
(
  (SELECT id FROM custom_users WHERE username = 'testuser'),
  'Sarah Wilson',
  'testuser',
  'Austin, TX',
  'Software Developer',
  'Tech enthusiast focused on building wealth through smart investments and disciplined budgeting.'
),
(
  (SELECT id FROM custom_users WHERE username = 'johndoe'),
  'John Doe',
  'johndoe',
  'New York, NY',
  'Financial Consultant',
  'Experienced investor with a focus on long-term wealth building and diversified portfolio management.'
)
ON CONFLICT (id) DO UPDATE SET
  full_name = EXCLUDED.full_name,
  user_name = EXCLUDED.user_name,
  location = EXCLUDED.location,
  occupation = EXCLUDED.occupation,
  bio = EXCLUDED.bio;