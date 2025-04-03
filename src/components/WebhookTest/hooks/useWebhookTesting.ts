
import { useState } from 'react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { TestResultType } from '../TestResult';

export function useWebhookTesting(projectId: string) {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState<{[key: string]: boolean}>({});
  const [results, setResults] = useState<TestResultType[]>([]);

  // Helper function to add a result
  const addResult = (success: boolean, message: string, details?: any) => {
    const timestamp = new Date().toISOString();
    setResults(prev => [
      {
        id: timestamp,
        success,
        message,
        details,
        timestamp
      },
      ...prev
    ]);
  };

  // Test webhook with direct HTTP request
  const testWebhookDirect = async () => {
    if (!email.trim() || !email.includes('@')) {
      toast.error('Please enter a valid email address');
      return;
    }

    setLoading(prev => ({ ...prev, direct: true }));
    
    try {
      // This is the URL structure for your Supabase Edge Function
      const webhookUrl = `https://${projectId}.functions.supabase.co/wix-purchase-webhook`;
      
      const response = await fetch(webhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          data: {
            email: email.trim()
          }
        })
      });
      
      const data = await response.json();
      
      if (response.ok) {
        toast.success('Webhook test successful!');
        addResult(true, 'Webhook successfully processed the request', data);
      } else {
        toast.error('Webhook test failed');
        addResult(false, 'Webhook returned an error', data);
      }
    } catch (error) {
      console.error('Error testing webhook:', error);
      toast.error('Failed to connect to webhook');
      addResult(false, 'Connection to webhook failed', { 
        error: error instanceof Error ? error.message : String(error) 
      });
    } finally {
      setLoading(prev => ({ ...prev, direct: false }));
    }
  };
  
  // Test the database directly
  const testDatabaseDirect = async () => {
    if (!email.trim() || !email.includes('@')) {
      toast.error('Please enter a valid email address');
      return;
    }

    setLoading(prev => ({ ...prev, database: true }));
    
    try {
      // Direct database insertion - Fix the table name to use lowercase
      const { data, error } = await supabase
        .from('users_db_birthplanbuilder')
        .upsert({ email: email.trim() }, { onConflict: 'email' });
        
      if (error) {
        toast.error('Database insertion failed');
        addResult(false, 'Failed to insert email directly to database', { 
          error: error.message,
          code: error.code
        });
      } else {
        toast.success('Email added to database!');
        addResult(true, 'Successfully inserted email directly to database');
        
        // Check if the email was actually inserted - Fix the table name to use lowercase
        const { data: checkData, error: checkError } = await supabase
          .from('users_db_birthplanbuilder')
          .select('*')
          .eq('email', email.trim());
          
        if (checkError) {
          addResult(false, 'Failed to verify database insertion', { 
            error: checkError.message 
          });
        } else if (checkData && checkData.length > 0) {
          addResult(true, 'Verified email exists in database', { record: checkData[0] });
        } else {
          addResult(false, 'Email not found in database after insertion');
        }
      }
    } catch (error) {
      console.error('Error inserting to database:', error);
      toast.error('Database operation failed');
      addResult(false, 'Exception during database operation', { 
        error: error instanceof Error ? error.message : String(error) 
      });
    } finally {
      setLoading(prev => ({ ...prev, database: false }));
    }
  };
  
  // Copy webhook URL to clipboard
  const copyWebhookUrl = () => {
    const webhookUrl = `https://${projectId}.functions.supabase.co/wix-purchase-webhook`;
    navigator.clipboard.writeText(webhookUrl)
      .then(() => toast.success('Webhook URL copied to clipboard!'))
      .catch(err => toast.error('Failed to copy webhook URL'));
  };

  return {
    email,
    setEmail,
    loading,
    results,
    testWebhookDirect,
    testDatabaseDirect,
    copyWebhookUrl
  };
}
