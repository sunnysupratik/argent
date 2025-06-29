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
}

export function useAirtable() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createLead = async (leadData: LeadData): Promise<boolean> => {
    setLoading(true);
    setError(null);

    try {
      // Check if Airtable integration is configured
      const PICA_SECRET_KEY = import.meta.env.VITE_PICA_SECRET_KEY;
      const PICA_AIRTABLE_CONNECTION_KEY = import.meta.env.VITE_PICA_AIRTABLE_CONNECTION_KEY;
      const DATABASE_ID = import.meta.env.VITE_AIRTABLE_DATABASE_ID;
      const TABLE_ID = import.meta.env.VITE_AIRTABLE_TABLE_ID;

      // Check if any of the required credentials are missing or are placeholder values
      const isConfigured = PICA_SECRET_KEY && 
                          PICA_AIRTABLE_CONNECTION_KEY && 
                          DATABASE_ID && 
                          TABLE_ID &&
                          PICA_SECRET_KEY !== 'your_pica_secret_key' &&
                          PICA_AIRTABLE_CONNECTION_KEY !== 'your_pica_airtable_connection_key' &&
                          DATABASE_ID !== 'your_airtable_database_id' &&
                          TABLE_ID !== 'your_airtable_table_id';

      if (!isConfigured) {
        // Fallback: Log to console and localStorage for demo purposes
        console.log('Airtable integration not configured. Saving lead data locally for demo purposes.');
        
        const leadWithTimestamp = {
          ...leadData,
          id: `lead_${Date.now()}`,
          createdAt: new Date().toISOString(),
          status: 'New Lead'
        };

        // Save to localStorage as fallback
        const existingLeads = JSON.parse(localStorage.getItem('demo_leads') || '[]');
        existingLeads.push(leadWithTimestamp);
        localStorage.setItem('demo_leads', JSON.stringify(existingLeads));

        console.log('Lead saved locally:', leadWithTimestamp);
        
        // Show a helpful message about configuration
        setError('Airtable integration not configured. Lead saved locally for demo purposes. To enable Airtable integration, please set up your Pica credentials in the .env file.');
        
        return true; // Still return success for demo purposes
      }

      // Create the record in Airtable
      const response = await fetch(`https://api.picaos.com/v1/passthrough/${DATABASE_ID}/${TABLE_ID}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-pica-secret': PICA_SECRET_KEY,
          'x-pica-connection-key': PICA_AIRTABLE_CONNECTION_KEY,
          'x-pica-action-id': 'conn_mod_def::F--Ywa8nfKA::WsZ0tL8uSD-23rubqhbfPQ'
        },
        body: JSON.stringify({
          records: [
            {
              fields: {
                'Name': leadData.name,
                'Email': leadData.email,
                'Company': leadData.company || '',
                'Phone': leadData.phone || '',
                'Subject': leadData.subject,
                'Message': leadData.message,
                'Source': leadData.source,
                'Budget Range': leadData.budget || '',
                'Timeline': leadData.timeline || '',
                'Interests': leadData.interests.join(', '),
                'Status': 'New Lead',
                'Created Date': new Date().toISOString(),
                'Priority': 'Medium'
              }
            }
          ],
          returnFieldsByFieldId: false,
          typecast: true
        })
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        
        // Provide more specific error messages
        if (response.status === 401) {
          throw new Error('Authentication failed. Please check your Pica API credentials in the .env file.');
        } else if (response.status === 403) {
          throw new Error('Access forbidden. Please verify your Airtable permissions and connection settings.');
        } else if (response.status === 404) {
          throw new Error('Database or table not found. Please check your Airtable database and table IDs.');
        } else {
          throw new Error(errorData.error?.message || `HTTP ${response.status}: ${response.statusText}`);
        }
      }

      const result: AirtableResponse = await response.json();
      
      if (result.records && result.records.length > 0) {
        console.log('Lead created successfully in Airtable:', result.records[0]);
        return true;
      } else {
        throw new Error('No record was created');
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

  // Function to get bases (for setup/debugging)
  const getBases = async () => {
    try {
      const PICA_SECRET_KEY = import.meta.env.VITE_PICA_SECRET_KEY;
      const PICA_AIRTABLE_CONNECTION_KEY = import.meta.env.VITE_PICA_AIRTABLE_CONNECTION_KEY;

      if (!PICA_SECRET_KEY || !PICA_AIRTABLE_CONNECTION_KEY) {
        console.log('Pica credentials not configured');
        return null;
      }

      const response = await fetch('https://api.picaos.com/v1/passthrough/meta/bases', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'x-pica-secret': PICA_SECRET_KEY,
          'x-pica-connection-key': PICA_AIRTABLE_CONNECTION_KEY,
          'x-pica-action-id': 'conn_mod_def::F--Y0f-gkKg::3O4KwCvSQFyFZ2a-fUSwEg'
        }
      });

      const result = await response.json();
      console.log('Available bases:', result);
      return result;
    } catch (err) {
      console.error('Error fetching bases:', err);
      return null;
    }
  };

  // Function to get tables (for setup/debugging)
  const getTables = async (databaseId: string) => {
    try {
      const PICA_SECRET_KEY = import.meta.env.VITE_PICA_SECRET_KEY;
      const PICA_AIRTABLE_CONNECTION_KEY = import.meta.env.VITE_PICA_AIRTABLE_CONNECTION_KEY;

      if (!PICA_SECRET_KEY || !PICA_AIRTABLE_CONNECTION_KEY) {
        console.log('Pica credentials not configured');
        return null;
      }

      const response = await fetch(`https://api.picaos.com/v1/passthrough/meta/bases/${databaseId}/tables`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'x-pica-secret': PICA_SECRET_KEY,
          'x-pica-connection-key': PICA_AIRTABLE_CONNECTION_KEY,
          'x-pica-action-id': 'conn_mod_def::F_IZHwpOVTI::OcKDR06kSrCJP1I1gAfU5Q'
        }
      });

      const result = await response.json();
      console.log('Available tables:', result);
      return result;
    } catch (err) {
      console.error('Error fetching tables:', err);
      return null;
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
    getBases,
    getTables,
    getLocalLeads,
    loading,
    error
  };
}