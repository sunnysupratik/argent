import { createClient } from '@supabase/supabase-js'

// Get environment variables with fallbacks
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

// Check if we have valid Supabase configuration
const hasValidSupabaseConfig = 
  supabaseUrl && 
  supabaseAnonKey && 
  supabaseUrl !== 'your_supabase_project_url' && 
  supabaseAnonKey !== 'your_supabase_anon_key' &&
  supabaseUrl.startsWith('http')

// Create Supabase client with fallback for development
export const supabase = hasValidSupabaseConfig 
  ? createClient(supabaseUrl, supabaseAnonKey)
  : createClient('https://placeholder.supabase.co', 'placeholder-key')

// Export a flag to check if Supabase is properly configured
export const isSupabaseConfigured = hasValidSupabaseConfig

// Define CustomUser interface
export interface CustomUser {
  id: string
  email: string
  user_metadata?: {
    full_name?: string
  }
}

// Mock data for when Supabase is not configured
export const mockUser: CustomUser = {
  id: 'mock-user-id',
  email: 'demo@example.com',
  user_metadata: {
    full_name: 'Demo User'
  }
}

// Mock authentication functions
const mockAuthFunctions = {
  async signUp({ email, password }: { email: string; password: string }) {
    return {
      data: { user: mockUser, session: null },
      error: null
    }
  },

  async signInWithPassword({ email, password }: { email: string; password: string }) {
    return {
      data: { user: mockUser, session: { access_token: 'mock-token' } },
      error: null
    }
  },

  async signOut() {
    return { error: null }
  },

  async getUser() {
    return {
      data: { user: mockUser },
      error: null
    }
  },

  onAuthStateChange(callback: (event: string, session: any) => void) {
    // Mock implementation
    return {
      data: { subscription: { unsubscribe: () => {} } }
    }
  }
}

// Custom auth object that conditionally uses real or mock auth
export const customAuth = {
  signUp: hasValidSupabaseConfig 
    ? supabase.auth.signUp.bind(supabase.auth)
    : mockAuthFunctions.signUp,
  
  signInWithPassword: hasValidSupabaseConfig 
    ? supabase.auth.signInWithPassword.bind(supabase.auth)
    : mockAuthFunctions.signInWithPassword,
  
  signOut: hasValidSupabaseConfig 
    ? supabase.auth.signOut.bind(supabase.auth)
    : mockAuthFunctions.signOut,
  
  getUser: hasValidSupabaseConfig 
    ? supabase.auth.getUser.bind(supabase.auth)
    : mockAuthFunctions.getUser,
  
  onAuthStateChange: hasValidSupabaseConfig 
    ? supabase.auth.onAuthStateChange.bind(supabase.auth)
    : mockAuthFunctions.onAuthStateChange
}

// Test Supabase connection function
export const testSupabaseConnection = async () => {
  if (!hasValidSupabaseConfig) {
    return { connected: false, error: 'Supabase not configured' }
  }
  
  try {
    const { data, error } = await supabase.from('custom_users').select('count').limit(1)
    return { connected: !error, error: error?.message }
  } catch (err) {
    return { connected: false, error: 'Connection failed' }
  }
}