import { useState } from 'react';
import { supabase } from '../lib/supabase';

interface LeadData {
  name: string;
  email: string;
  company?: string;
  phone?: string;
  subject: string;
  message: string;
  source: string;
  budget?: string;
  timeline?: string;
  interests: string[];
  status?: string;
  priority?: string;
}

export function useLeads() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createLead = async (leadData: LeadData): Promise<boolean> => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('Creating lead in Supabase:', leadData);
      
      // Insert the lead into the leads table
      const { data, error } = await supabase
        .from('leads')
        .insert([{
          name: leadData.name,
          email: leadData.email,
          company: leadData.company || null,
          phone: leadData.phone || null,
          subject: leadData.subject,
          message: leadData.message,
          source: leadData.source,
          budget: leadData.budget || null,
          timeline: leadData.timeline || null,
          interests: leadData.interests.join(', '),
          status: leadData.status || 'New',
          priority: leadData.priority || 'Medium'
        }])
        .select();

      if (error) {
        console.error('Error creating lead:', error);
        throw error;
      }

      console.log('Lead created successfully:', data);
      return true;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to create lead';
      console.error('Lead creation error:', errorMessage);
      setError(errorMessage);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const getLeads = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const { data, error } = await supabase
        .from('leads')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        throw error;
      }

      return data;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch leads';
      console.error('Error fetching leads:', errorMessage);
      setError(errorMessage);
      return [];
    } finally {
      setLoading(false);
    }
  };

  return {
    createLead,
    getLeads,
    loading,
    error
  };
}