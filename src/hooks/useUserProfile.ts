import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from './useAuth';

export interface UserProfile {
  id: string;
  custom_user_id: string;
  first_name: string | null;
  last_name: string | null;
  email: string | null;
  phone: string | null;
  bio: string | null;
  location: string | null;
  occupation: string | null;
  profile_picture_url: string | null;
  credit_score: number;
  total_balance: number;
  monthly_income: number;
  monthly_expenses: number;
  savings_rate: number;
  timezone: string;
  currency: string;
  language: string;
  join_date: string;
  created_at: string;
  updated_at: string;
}

export function useUserProfile() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  const fetchProfile = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      if (!user?.id) {
        console.log('No user ID available for profile');
        setProfile(null);
        setLoading(false);
        return;
      }

      console.log('Fetching profile for user ID:', user.id);

      const { data, error: fetchError } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('custom_user_id', user.id)
        .maybeSingle();

      if (fetchError) {
        console.error('Error fetching profile:', fetchError);
        throw fetchError;
      }

      if (!data) {
        // No profile found, create a default one
        console.log('No profile found, creating default profile');
        await createDefaultProfile();
        return;
      }

      console.log('Profile data fetched:', data);
      setProfile(data);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load profile';
      console.error('Profile fetch error:', errorMessage);
      setError(errorMessage);
      setProfile(null);
    } finally {
      setLoading(false);
    }
  }, [user?.id]);

  const createDefaultProfile = useCallback(async () => {
    try {
      if (!user?.id) {
        console.log('No user available for profile creation');
        return;
      }

      console.log('Creating default profile for user:', user.username);

      // Get the user's join date from custom_users table
      const { data: userData } = await supabase
        .from('custom_users')
        .select('created_at, full_name, email')
        .eq('id', user.id)
        .single();

      const defaultProfile = {
        custom_user_id: user.id,
        first_name: userData?.full_name?.split(' ')[0] || user.full_name?.split(' ')[0] || 'User',
        last_name: userData?.full_name?.split(' ').slice(1).join(' ') || user.full_name?.split(' ').slice(1).join(' ') || '',
        email: userData?.email || user.email || 'user@example.com',
        phone: null,
        bio: 'Financial enthusiast focused on building long-term wealth through smart investments and disciplined budgeting.',
        location: 'San Francisco, CA',
        occupation: 'Software Engineer',
        profile_picture_url: null,
        credit_score: 742,
        total_balance: 381499.50,
        monthly_income: 8150.00,
        monthly_expenses: 2984.09,
        savings_rate: 63.4,
        timezone: 'America/New_York',
        currency: 'USD',
        language: 'en',
        join_date: userData?.created_at || user.created_at || new Date().toISOString()
      };

      const { data, error } = await supabase
        .from('user_profiles')
        .insert([defaultProfile])
        .select()
        .single();

      if (error) {
        console.error('Error creating default profile:', error);
        throw error;
      }

      console.log('Default profile created:', data);
      setProfile(data);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to create profile';
      console.error('Profile creation error:', errorMessage);
      setError(errorMessage);
    }
  }, [user]);

  const updateProfile = useCallback(async (updates: Partial<UserProfile>) => {
    try {
      setLoading(true);
      setError(null);

      if (!user?.id || !profile) {
        throw new Error('No user or profile available');
      }

      console.log('Updating profile with:', updates);

      const { data, error } = await supabase
        .from('user_profiles')
        .update(updates)
        .eq('custom_user_id', user.id)
        .select()
        .single();

      if (error) {
        console.error('Error updating profile:', error);
        throw error;
      }

      console.log('Profile updated:', data);
      setProfile(data);
      return { success: true, data };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update profile';
      console.error('Profile update error:', errorMessage);
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  }, [user?.id, profile]);

  const getFullName = useCallback(() => {
    if (!profile) return 'User';
    const firstName = profile.first_name || '';
    const lastName = profile.last_name || '';
    return `${firstName} ${lastName}`.trim() || 'User';
  }, [profile]);

  const getDisplayName = useCallback(() => {
    if (!profile) return 'User';
    return profile.first_name || 'User';
  }, [profile]);

  const getSavingsRate = useCallback(() => {
    if (!profile || profile.monthly_income <= 0) return 0;
    return ((profile.monthly_income - profile.monthly_expenses) / profile.monthly_income) * 100;
  }, [profile]);

  const getNetIncome = useCallback(() => {
    if (!profile) return 0;
    return profile.monthly_income - profile.monthly_expenses;
  }, [profile]);

  const formatCurrency = useCallback((amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: profile?.currency || 'USD',
    }).format(amount);
  }, [profile?.currency]);

  const formatDate = useCallback((dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  }, []);

  useEffect(() => {
    if (user?.id) {
      fetchProfile();
    } else {
      setProfile(null);
      setLoading(false);
    }
  }, [fetchProfile, user?.id]);

  const refetch = useCallback(async () => {
    await fetchProfile();
  }, [fetchProfile]);

  return {
    profile,
    loading,
    error,
    updateProfile,
    refetch,
    getFullName,
    getDisplayName,
    getSavingsRate,
    getNetIncome,
    formatCurrency,
    formatDate,
  };
}