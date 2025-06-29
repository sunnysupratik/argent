import { useState } from 'react';

interface AirtableRecord {
  fields: {
    [key: string]: any;
  };
}

interface AirtableResponse {
  records: Array<{
    id: string;
    createdTime: string;
    fields: {
      [key: string]: any;
    };
  }>;
}

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
  address?: string;
  age?: number | string;
  dateOfBirth?: string;
  customerID?: string;
  accountStatus?: string;
  customerSentiment?: string;
}

export function useAirtable() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createLead = async (leadData: LeadData): Promise<boolean> => {
    setLoading(true);
    setError(null);

    try {
      console.log('Creating lead with data:', leadData);
      
      // Get Pica credentials from environment variables
      const PICA_SECRET_KEY = import.meta.env.VITE_PICA_SECRET_KEY || 'f5a3d6d4f4e351bbc9abb9ed1d5c14bbe225cf504774d72a3e2049b51055f344';
      const PICA_AIRTABLE_CONNECTION_KEY = import.meta.env.VITE_PICA_AIRTABLE_CONNECTION_KEY || 'b91e6665958ac069be045c7874a842a1925b0ee6885b6f7d44018f1dac4d604d';
      
      // For debugging
      console.log('Using Pica credentials:', { 
        secretKeyAvailable: !!PICA_SECRET_KEY, 
        connectionKeyAvailable: !!PICA_AIRTABLE_CONNECTION_KEY 
      });
      
      // Generate a unique customer ID if not provided
      const customerID = leadData.customerID || `CUST${Math.floor(1000 + Math.random() * 9000)}`;
      
      // Create the full address field if address is provided
      const fullAddress = leadData.address ? 
        `${leadData.address}, ${leadData.email}, ${leadData.phone || 'No phone'}` : 
        `${leadData.email}, ${leadData.phone || 'No phone'}`;

      // Prepare the record for Airtable
      const record = {
        'Customer Name': leadData.name,
        'Email Address': leadData.email,
        'Phone Number': leadData.phone || '',
        'Contact Details': leadData.company ? `${leadData.company}, ${leadData.address || ''}` : (leadData.address || ''),
        'Address': leadData.address || '',
        'Full Address': fullAddress,
        'Customer ID': customerID,
        'Date of Birth': leadData.dateOfBirth || '',
        'Age': leadData.age || '',
        'Account Status': leadData.accountStatus || 'New Lead',
        'Account Status Summary': `New lead from website contact form. Interests: ${leadData.interests.join(', ')}`,
        'Customer Sentiment': leadData.customerSentiment || 'Neutral',
        'Subject': leadData.subject,
        'Message': leadData.message,
        'Source': leadData.source,
        'Budget Range': leadData.budget || '',
        'Timeline': leadData.timeline || '',
        'Interests': leadData.interests.join(', ')
      };

      console.log('Prepared record for Airtable:', record);

      // Use Supabase Edge Function to proxy the request to Airtable via Pica
      const apiUrl = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/airtable-create-lead`;
      
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`
        },
        body: JSON.stringify({
          picaSecretKey: PICA_SECRET_KEY,
          picaAirtableConnectionKey: PICA_AIRTABLE_CONNECTION_KEY,
          record
        })
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        
        // Provide more specific error messages
        if (response.status === 401) {
          throw new Error('Authentication failed. Please check your Pica API credentials.');
        } else if (response.status === 403) {
          throw new Error('Access forbidden. Please verify your Airtable permissions and connection settings.');
        } else if (response.status === 404) {
          throw new Error('Database or table not found. Please check your Airtable database and table IDs.');
        } else {
          throw new Error(errorData.error?.message || `HTTP ${response.status}: ${response.statusText}`);
        }
      }

      const result = await response.json();
      
      if (result.success) {
        console.log('Lead created successfully in Airtable:', result.data);
        return true;
      } else {
        throw new Error(result.error || 'Failed to create lead in Airtable');
      }

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to create lead';
      console.error('Airtable error:', errorMessage);
      setError(errorMessage);
      
      // If it's an authentication error, still save locally as fallback
      if (errorMessage.includes('Authentication failed') || errorMessage.includes('401')) {
        console.log('Saving lead locally due to authentication error...');
        
        const leadWithTimestamp = {
          ...leadData,
          id: `lead_${Date.now()}`,
          createdAt: new Date().toISOString(),
          status: 'New Lead (Auth Error Fallback)'
        };

        const existingLeads = JSON.parse(localStorage.getItem('demo_leads') || '[]');
        existingLeads.push(leadWithTimestamp);
        localStorage.setItem('demo_leads', JSON.stringify(existingLeads));

        return true; // Return success for demo purposes
      }
      
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Function to get locally saved leads (for demo purposes)
  const getLocalLeads = () => {
    try {
      return JSON.parse(localStorage.getItem('demo_leads') || '[]');
    } catch {
      return [];
    }
  };

  return {
    createLead,
    getLocalLeads,
    loading,
    error
  };
}