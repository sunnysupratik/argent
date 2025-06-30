import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
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
  user_name?: string;
}

export interface Profile {
  id: string;
  full_name: string | null;
  custom_user_id: string | null;
  created_at: string;
  location?: string | null;
  occupation?: string | null;
  bio?: string | null;
  user_name?: string;
}

export interface Account {
  id: string;
  custom_user_id: string | null;
  account_name: string;
  account_type: string;
  current_balance: number;
  created_at: string;
  user_name?: string;
}

export interface Category {
  id: string;
  custom_user_id: string | null;
  name: string;
  icon_name: string | null;
  created_at: string;
  user_name?: string;
}

export interface Transaction {
  id: string;
  custom_user_id: string | null;
  account_id: string;
  category_id: string | null;
  description: string;
  amount: number;
  type: string;
  transaction_date: string;
  category?: Category;
  account?: Account;
  user_name?: string;
}

export interface Investment {
  id: string;
  custom_user_id: string | null;
  user_name?: string;
  symbol: string;
  name: string;
  shares: number;
  current_price: number;
  total_value: number;
  day_change: number;
  day_change_percent: number;
  sector: string;
  market_cap: string;
  pe: number;
  dividend: number;
  rating: string;
  created_at: string;
}

// Custom authentication functions
export const customAuth = {
  signIn: async (username: string, password: string) => {
    try {
      console.log('CustomAuth.signIn - Attempting login for:', username);
      
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
    } catch (err) {
      console.error('CustomAuth.signIn - Unexpected error:', err);
      return { user: null, error: { message: 'Authentication failed' } };
    }
  },

  signUp: async (username: string, password: string, fullName: string, email: string) => {
    try {
      console.log('CustomAuth.signUp - Attempting signup for:', username);
      
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