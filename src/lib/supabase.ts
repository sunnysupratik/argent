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
      
      // For development/demo purposes, allow direct login with demo accounts
      if (import.meta.env.DEV || !supabaseUrl.includes('example.supabase.co')) {
        if ((username === 'demo' && password === 'Password123!') ||
            (username === 'testuser' && password === 'TestPass123!') ||
            (username === 'johndoe' && password === 'Demo123!')) {
          
          // Create a mock user for demo purposes
          const mockUser = {
            id: username === 'demo' ? 'demo-id-123' : 
                username === 'testuser' ? 'testuser-id-456' : 'johndoe-id-789',
            username: username,
            password: password, // In a real app, never store passwords in client-side code
            full_name: username === 'demo' ? 'Alex Johnson' : 
                      username === 'testuser' ? 'Sarah Wilson' : 'John Doe',
            email: `${username}@example.com`,
            created_at: new Date().toISOString()
          };
          
          // Store user in localStorage for session management
          localStorage.setItem('customUser', JSON.stringify(mockUser));
          
          console.log('CustomAuth.signIn - Demo login successful for user:', mockUser.username);
          return { user: mockUser, error: null };
        }
      }
      
      // Try to fetch from direct_accounts to verify if we should use direct tables
      const { data: directAccountsExist } = await supabase
        .from('direct_accounts')
        .select('id')
        .limit(1);
      
      if (directAccountsExist && directAccountsExist.length > 0) {
        console.log('Using direct tables for authentication');
        
        // For direct tables, we use user_name instead of username
        const { data, error } = await supabase
          .from('custom_users')
          .select('*')
          .eq('username', username)
          .eq('password', password)
          .single();

        if (error || !data) {
          console.log('CustomAuth.signIn - Login failed:', error?.message || 'User not found');
          return { user: null, error: { message: 'Invalid username or password' } };
        }

        console.log('CustomAuth.signIn - Login successful for user:', data.username, 'ID:', data.id);
        
        // Store user in localStorage for session management
        localStorage.setItem('customUser', JSON.stringify(data));
        
        return { user: data, error: null };
      } else {
        // Fall back to original custom_users table
        const { data, error } = await supabase
          .from('custom_users')
          .select('*')
          .eq('username', username)
          .eq('password', password)
          .single();

        if (error || !data) {
          console.log('CustomAuth.signIn - Login failed:', error?.message || 'User not found');
          return { user: null, error: { message: 'Invalid username or password' } };
        }

        console.log('CustomAuth.signIn - Login successful for user:', data.username, 'ID:', data.id);
        
        // Store user in localStorage for session management
        localStorage.setItem('customUser', JSON.stringify(data));
        
        return { user: data, error: null };
      }
    } catch (err) {
      console.error('CustomAuth.signIn - Unexpected error:', err);
      return { user: null, error: { message: 'Authentication failed' } };
    }
  },

  signUp: async (username: string, password: string, fullName: string, email: string) => {
    try {
      console.log('CustomAuth.signUp - Attempting signup for:', username);
      
      // For development/demo purposes
      if (import.meta.env.DEV || !supabaseUrl.includes('example.supabase.co')) {
        // Create a mock user for demo purposes
        const mockUser = {
          id: `${username}-id-${Math.floor(Math.random() * 1000)}`,
          username: username,
          password: password, // In a real app, never store passwords in client-side code
          full_name: fullName,
          email: email,
          created_at: new Date().toISOString()
        };
        
        // Store user in localStorage for session management
        localStorage.setItem('customUser', JSON.stringify(mockUser));
        
        console.log('CustomAuth.signUp - Demo signup successful for user:', mockUser.username);
        return { user: mockUser, error: null };
      }
      
      const { data, error } = await supabase
        .from('custom_users')
        .insert([{
          username,
          password,
          full_name: fullName,
          email
        }])
        .select()
        .single();

      if (error) {
        console.log('CustomAuth.signUp - Signup failed:', error.message);
        return { user: null, error: { message: error.message } };
      }

      console.log('CustomAuth.signUp - Signup successful for user:', data.username, 'ID:', data.id);
      
      // Store user in localStorage for session management
      localStorage.setItem('customUser', JSON.stringify(data));
      
      return { user: data, error: null };
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