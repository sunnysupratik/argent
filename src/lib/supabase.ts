import { createClient } from '@supabase/supabase-js';

// Get environment variables with fallbacks for development
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://example.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'public-anon-key';

// Check if we're using placeholder values
const isUsingPlaceholders = supabaseUrl === 'https://example.supabase.co' || supabaseAnonKey === 'public-anon-key';

// Log environment variables for debugging (only in development)
if (import.meta.env.DEV) {
  console.log('Supabase URL:', supabaseUrl);
  console.log('Supabase Anon Key:', supabaseAnonKey ? 'Exists (not shown for security)' : 'Missing');
  
  if (isUsingPlaceholders) {
    console.warn('⚠️ SUPABASE NOT CONFIGURED: Using placeholder values. Please connect to Supabase to enable authentication.');
  }
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
  user_name?: string | null;
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
  user_id: string;
  custom_user_id: string | null;
  account_name: string;
  account_type: string;
  current_balance: number;
  created_at: string;
  user_name?: string | null;
}

export interface Category {
  id: string;
  user_id: string | null;
  custom_user_id: string | null;
  name: string;
  icon_name: string | null;
  created_at: string;
  user_name?: string | null;
}

export interface Transaction {
  id: string;
  user_id: string;
  custom_user_id: string | null;
  account_id: string;
  category_id: string | null;
  description: string;
  amount: number;
  type: string;
  transaction_date: string;
  category?: Category;
  account?: Account;
  user_name?: string | null;
}

// Custom authentication functions
export const customAuth = {
  signIn: async (username: string, password: string) => {
    try {
      console.log('CustomAuth.signIn - Attempting login for:', username);
      
      // Check if Supabase is properly configured
      if (isUsingPlaceholders) {
        console.error('CustomAuth.signIn - Supabase not configured');
        return { 
          user: null, 
          error: { 
            message: 'Database connection not configured. Please connect to Supabase first.',
            code: 'SUPABASE_NOT_CONFIGURED'
          } 
        };
      }
      
      // Try to authenticate with Supabase
      const { data, error } = await supabase
        .from('custom_users')
        .select('*')
        .eq('username', username)
        .eq('password', password)
        .single();

      if (error || !data) {
        console.log('CustomAuth.signIn - Login failed:', error?.message || 'User not found');
        
        // Provide more helpful error messages
        if (error?.code === 'PGRST116') {
          return { 
            user: null, 
            error: { 
              message: 'Invalid username or password. If this is a demo account, make sure the demo users have been created in your database.',
              code: 'INVALID_CREDENTIALS'
            } 
          };
        }
        
        return { user: null, error: { message: 'Invalid username or password' } };
      }

      console.log('CustomAuth.signIn - Login successful for user:', data.username, 'ID:', data.id);
      
      // Store user in localStorage for session management
      localStorage.setItem('customUser', JSON.stringify(data));
      
      return { user: data, error: null };
    } catch (err: any) {
      console.error('CustomAuth.signIn - Unexpected error:', err);
      
      // Handle network errors specifically
      if (err.name === 'TypeError' && err.message.includes('Failed to fetch')) {
        return { 
          user: null, 
          error: { 
            message: 'Unable to connect to database. Please check your Supabase configuration and ensure you have an active internet connection.',
            code: 'NETWORK_ERROR'
          } 
        };
      }
      
      return { user: null, error: { message: 'Authentication failed. Please try again.' } };
    }
  },

  signUp: async (username: string, password: string, fullName: string, email: string) => {
    try {
      console.log('CustomAuth.signUp - Attempting signup for:', username);
      
      // Check if Supabase is properly configured
      if (isUsingPlaceholders) {
        console.error('CustomAuth.signUp - Supabase not configured');
        return { 
          user: null, 
          error: { 
            message: 'Database connection not configured. Please connect to Supabase first.',
            code: 'SUPABASE_NOT_CONFIGURED'
          } 
        };
      }
      
      // Check if username or email already exists
      const { data: existingUser, error: checkError } = await supabase
        .from('custom_users')
        .select('*')
        .or(`username.eq.${username},email.eq.${email}`)
        .maybeSingle();
        
      if (existingUser) {
        return { 
          user: null, 
          error: { 
            message: existingUser.username === username 
              ? 'Username already exists' 
              : 'Email already exists' 
          } 
        };
      }
      
      // Create new user
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
        console.log('CustomAuth.signUp - Signup failed:', error.message);
        return { user: null, error: { message: error.message } };
      }

      console.log('CustomAuth.signUp - Signup successful for user:', data.username, 'ID:', data.id);
      
      // Store user in localStorage for session management
      localStorage.setItem('customUser', JSON.stringify(data));
      
      return { user: data, error: null };
    } catch (err: any) {
      console.error('CustomAuth.signUp - Unexpected error:', err);
      
      // Handle network errors specifically
      if (err.name === 'TypeError' && err.message.includes('Failed to fetch')) {
        return { 
          user: null, 
          error: { 
            message: 'Unable to connect to database. Please check your Supabase configuration and ensure you have an active internet connection.',
            code: 'NETWORK_ERROR'
          } 
        };
      }
      
      return { user: null, error: { message: 'Sign up failed. Please try again.' } };
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
  },

  // Helper function to check if Supabase is configured
  isConfigured: () => !isUsingPlaceholders
};