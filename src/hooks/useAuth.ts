import { useState, useEffect } from 'react';
import { customAuth, CustomUser, supabase } from '../lib/supabase';

export function useAuth() {
  const [user, setUser] = useState<CustomUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for existing user session
    const currentUser = customAuth.getCurrentUser();
    console.log('Auth check - current user:', currentUser);
    
    // Debug: Log the user ID that will be used for queries
    if (currentUser) {
      console.log('User ID for database queries:', currentUser.id);
      console.log('Username:', currentUser.username);
      console.log('Full user object:', currentUser);
      
      // Verify user exists in database
      const verifyUser = async () => {
        try {
          // First try by ID
          const { data, error } = await supabase
            .from('custom_users')
            .select('*')
            .eq('id', currentUser.id)
            .single();
            
          if (error || !data) {
            console.log('User not found by ID, trying by username');
            // Try by username as fallback
            const { data: usernameData, error: usernameError } = await supabase
              .from('custom_users')
              .select('*')
              .eq('username', currentUser.username)
              .single();
              
            if (usernameError || !usernameData) {
              console.error('User verification failed:', usernameError?.message || 'User not found in database');
              // Clear invalid session
              localStorage.removeItem('customUser');
              setUser(null);
            } else {
              console.log('User verified by username:', usernameData);
              // Update user with latest data from database
              localStorage.setItem('customUser', JSON.stringify(usernameData));
              setUser(usernameData);
            }
          } else {
            console.log('User verified in database:', data);
            // Update user with latest data from database
            localStorage.setItem('customUser', JSON.stringify(data));
            setUser(data);
          }
        } catch (err) {
          console.error('Error verifying user:', err);
        } finally {
          setLoading(false);
        }
      };
      
      verifyUser();
    } else {
      setUser(null);
      setLoading(false);
    }
  }, []);

  const signIn = async (username: string, password: string) => {
    try {
      setLoading(true);
      console.log('Attempting sign in for username:', username);
      
      const { user, error } = await customAuth.signIn(username, password);

      if (error) {
        console.error('Sign in error:', error);
        return { data: null, error };
      }

      console.log('Sign in successful for user:', user?.username);
      console.log('User ID that will be used for queries:', user?.id);
      setUser(user);
      return { data: { user }, error: null };
    } catch (error) {
      console.error('Unexpected sign in error:', error);
      return { 
        data: null, 
        error: { message: 'An unexpected error occurred during sign in' }
      };
    } finally {
      setLoading(false);
    }
  };

  const signUp = async (username: string, password: string, fullName: string, email: string) => {
    try {
      setLoading(true);
      console.log('Attempting sign up for username:', username);
      
      const { user, error } = await customAuth.signUp(username, password, fullName, email);

      if (error) {
        console.error('Sign up error:', error);
        return { data: null, error };
      }

      console.log('Sign up successful for user:', user?.username);
      console.log('User ID that will be used for queries:', user?.id);
      setUser(user);
      return { data: { user }, error: null };
    } catch (error) {
      console.error('Unexpected sign up error:', error);
      return { 
        data: null, 
        error: { message: 'An unexpected error occurred during sign up' }
      };
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    try {
      console.log('Signing out user:', user?.username);
      const { error } = await customAuth.signOut();
      if (error) {
        console.error('Sign out error:', error);
      }
      setUser(null);
      return { error };
    } catch (error) {
      console.error('Unexpected sign out error:', error);
      return { error: { message: 'An unexpected error occurred during sign out' } };
    }
  };

  return {
    user,
    loading,
    signIn,
    signUp,
    signOut,
  };
}