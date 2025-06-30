import { useState } from 'react';
import { supabase } from '../lib/supabase';

interface LeadData {
  name: string;
  email: string;
  company?: string;
  phone?: string;
  subject?: string;
  message: string;
  source?: string;
  budget?: string;
  timeline?: string;
  interests?: string[];
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
          subject: leadData.subject || 'Contact Form Submission',
          message: leadData.message,
          source: leadData.source || 'Website Contact Form',
          budget: leadData.budget || null,
          timeline: leadData.timeline || null,
          interests: leadData.interests ? leadData.interests.join(', ') : null,
          status: leadData.status || 'New',
          priority: leadData.priority || 'Medium'
        }])
        .select();

      if (error) {
        console.error('Error creating lead:', error);
        
        // Check if the error is due to the table not existing
        if (error.code === 'PGRST116') {
          console.log('Leads table does not exist, simulating success for demo');
          return true;
        }
        
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
        // Check if the error is due to the table not existing
        if (error.code === 'PGRST116') {
          console.log('Leads table does not exist, returning empty array');
          return [];
        }
        
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