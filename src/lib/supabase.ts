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

// Mock data for when Supabase is not configured
export const mockUser = {
  id: 'mock-user-id',
  email: 'demo@example.com',
  user_metadata: {
    full_name: 'Demo User'
  }
}