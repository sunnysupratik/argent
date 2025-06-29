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
}

export function useLeads() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const createLead = async (leadData: LeadData): Promise<boolean> => {
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      console.log('Creating lead:', leadData);
      
      // Insert the lead into the database
      const { data, error } = await supabase
        .from('leads')
        .insert([{
          name: leadData.name,
          email: leadData.email,
          company: leadData.company || null,
          phone: leadData.phone || null,
          subject: leadData.subject,
          message: leadData.message,
          source: leadData.source || 'Website Contact Form',
          budget: leadData.budget || null,
          timeline: leadData.timeline || null,
          interests: leadData.interests || [],
          status: 'New',
          priority: 'Medium'
        }])
        .select();

      if (error) {
        console.error('Error creating lead:', error);
        throw error;
      }

      console.log('Lead created successfully:', data);
      setSuccess(true);
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

  return {
    createLead,
    loading,
    error,
    success
  };
}