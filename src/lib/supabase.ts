import { createClient } from '@supabase/supabase-js';

// Get environment variables with fallbacks for development
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://example.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'public-anon-key';

// Log environment variables for debugging (only in development)
if (import.meta.env.DEV) {
  console.log('Supabase URL:', supabaseUrl);
  console.log('Supabase Anon Key:', supabaseAnonKey ? 'Exists (not shown for security)' : 'Missing');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Database types
export interface CustomUser {
  id: string;
  username: string;
  password: string;
  full_name: string | null;
  email: string;
  created_at: string;
}

export interface Profile {
  id: string;
  full_name: string | null;
  custom_user_id: string | null;
  created_at: string;
  location?: string | null;
  occupation?: string | null;
  bio?: string | null;
  user_name?: string | null;
}

export interface Account {
  id: string;
  user_name: string;
  account_name: string;
  account_type: string;
  current_balance: number;
  created_at: string;
}

export interface Category {
  id: string;
  user_name: string | null;
  name: string;
  icon_name: string | null;
  created_at: string;
}

export interface Transaction {
  id: string;
  user_name: string;
  description: string;
  amount: number;
  type: string;
  transaction_date: string;
  category: string;
  account_name: string;
  created_at?: string;
}

export interface Investment {
  id: string;
  user_name: string;
  symbol: string;
  name: string;
  shares: number;
  current_price: number;
  total_value: number;
  day_change: number;
  day_change_percent: number;
  sector?: string;
  market_cap?: string;
  pe?: number;
  dividend?: number;
  rating?: string;
  created_at?: string;
  updated_at?: string;
}

// Custom authentication functions
export const customAuth = {
  signIn: async (username: string, password: string) => {
    try {
      console.log('CustomAuth.signIn - Attempting login for:', username);
      
      // Check if we have a valid Supabase connection
      const isValidSupabase = supabaseUrl && !supabaseUrl.includes('example.supabase.co') && supabaseAnonKey && supabaseAnonKey !== 'public-anon-key';
      
      if (isValidSupabase) {
        console.log('Using real Supabase authentication');
        
        // Try to authenticate with the database
        const { data, error } = await supabase
          .from('custom_users')
          .select('*')
          .eq('username', username)
          .eq('password', password)
          .single();

        if (error || !data) {
          console.log('CustomAuth.signIn - Database login failed:', error?.message || 'User not found');
          // Fall through to demo mode
        } else {
          console.log('CustomAuth.signIn - Database login successful for user:', data.username, 'ID:', data.id);
          
          // Store user in localStorage for session management
          localStorage.setItem('customUser', JSON.stringify(data));
          
          return { user: data, error: null };
        }
      }
      
      // Demo mode - allow hardcoded demo accounts
      console.log('Using demo authentication mode');
      
      const demoUsers = [
        { username: 'demo', password: 'Password123!', full_name: 'Alex Johnson', email: 'demo@example.com' },
        { username: 'testuser', password: 'TestPass123!', full_name: 'Sarah Wilson', email: 'testuser@example.com' },
        { username: 'johndoe', password: 'Demo123!', full_name: 'John Doe', email: 'john.doe@example.com' }
      ];
      
      const demoUser = demoUsers.find(u => u.username === username && u.password === password);
      
      if (demoUser) {
        // Create a mock user for demo purposes
        const mockUser = {
          id: `${username}-id-${Date.now()}`,
          username: demoUser.username,
          password: demoUser.password,
          full_name: demoUser.full_name,
          email: demoUser.email,
          created_at: new Date().toISOString()
        };
        
        // Store user in localStorage for session management
        localStorage.setItem('customUser', JSON.stringify(mockUser));
        
        console.log('CustomAuth.signIn - Demo login successful for user:', mockUser.username);
        return { user: mockUser, error: null };
      }
      
      console.log('CustomAuth.signIn - Login failed: Invalid credentials');
      return { user: null, error: { message: 'Invalid username or password' } };
      
    } catch (err) {
      console.error('CustomAuth.signIn - Unexpected error:', err);
      return { user: null, error: { message: 'Authentication failed' } };
    }
  },

  signUp: async (username: string, password: string, fullName: string, email: string) => {
    try {
      console.log('CustomAuth.signUp - Attempting signup for:', username);
      
      // Check if we have a valid Supabase connection
      const isValidSupabase = supabaseUrl && !supabaseUrl.includes('example.supabase.co') && supabaseAnonKey && supabaseAnonKey !== 'public-anon-key';
      
      if (isValidSupabase) {
        console.log('Using real Supabase for signup');
        
        const { data, error } = await supabase
          .from('custom_users')
          .insert([{
            username,
            password,
            full_name: fullName,
            email,
            user_name: username
          }])
          .select()
          .single();

        if (error) {
          console.log('CustomAuth.signUp - Database signup failed:', error.message);
          return { user: null, error: { message: error.message } };
        }

        console.log('CustomAuth.signUp - Database signup successful for user:', data.username, 'ID:', data.id);
        
        // Store user in localStorage for session management
        localStorage.setItem('customUser', JSON.stringify(data));
        
        return { user: data, error: null };
      }
      
      // Demo mode - create a mock user
      console.log('Using demo mode for signup');
      
      const mockUser = {
        id: `${username}-id-${Date.now()}`,
        username: username,
        password: password,
        full_name: fullName,
        email: email,
        created_at: new Date().toISOString()
      };
      
      // Store user in localStorage for session management
      localStorage.setItem('customUser', JSON.stringify(mockUser));
      
      console.log('CustomAuth.signUp - Demo signup successful for user:', mockUser.username);
      return { user: mockUser, error: null };
      
    } catch (err) {
      console.error('CustomAuth.signUp - Unexpected error:', err);
      return { user: null, error: { message: 'Sign up failed' } };
    }
  },

  signOut: async () => {
    console.log('CustomAuth.signOut - Clearing user session');
    localStorage.removeItem('customUser');
    return { error: null };
  },

  getCurrentUser: () => {
    const userStr = localStorage.getItem('customUser');
    const user = userStr ? JSON.parse(userStr) : null;
    
    if (user) {
      console.log('CustomAuth.getCurrentUser - Found stored user:', user.username, 'ID:', user.id);
    } else {
      console.log('CustomAuth.getCurrentUser - No stored user found');
    }
    
    return user;
  }
};