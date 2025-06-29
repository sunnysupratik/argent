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
      // First, get the database and table IDs (you'll need to configure these)
      const PICA_SECRET_KEY = import.meta.env.VITE_PICA_SECRET_KEY;
      const PICA_AIRTABLE_CONNECTION_KEY = import.meta.env.VITE_PICA_AIRTABLE_CONNECTION_KEY;
      const DATABASE_ID = import.meta.env.VITE_AIRTABLE_DATABASE_ID;
      const TABLE_ID = import.meta.env.VITE_AIRTABLE_TABLE_ID;

      if (!PICA_SECRET_KEY || !PICA_AIRTABLE_CONNECTION_KEY || !DATABASE_ID || !TABLE_ID) {
        throw new Error('Missing Airtable configuration. Please check your environment variables.');
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
        throw new Error(errorData.error?.message || `HTTP ${response.status}: ${response.statusText}`);
      }

      const result: AirtableResponse = await response.json();
      
      if (result.records && result.records.length > 0) {
        console.log('Lead created successfully:', result.records[0]);
        return true;
      } else {
        throw new Error('No record was created');
      }

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to create lead';
      console.error('Airtable error:', errorMessage);
      setError(errorMessage);
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

  return {
    createLead,
    getBases,
    getTables,
    loading,
    error
  };
}