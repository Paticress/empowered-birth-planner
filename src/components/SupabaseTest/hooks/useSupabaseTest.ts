
import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { TestResultItemType } from '../ResultItem';

export const useSupabaseTest = () => {
  const { toast } = useToast();
  const [testEmail, setTestEmail] = useState('test@example.com');
  const [results, setResults] = useState<TestResultItemType[]>([]);
  const [isLoading, setIsLoading] = useState<{[key: string]: boolean}>({});

  // Function to add a result to the list
  const addResult = (test: string, success: boolean, message: string, data: any = null) => {
    const timestamp = new Date().toISOString();
    setResults(prev => [{
      id: timestamp,
      test,
      success,
      message,
      data,
      timestamp
    }, ...prev]);
  };

  // Test direct Supabase connection
  const testSupabaseConnection = async () => {
    setIsLoading(prev => ({ ...prev, connection: true }));
    try {
      const { data, error } = await supabase.from('users_db_birthplanbuilder').select('count(*)');
      
      if (error) throw error;
      
      addResult(
        'Supabase Connection', 
        true, 
        'Successfully connected to Supabase database',
        data
      );
      
      toast({
        title: "Success!",
        description: "Connected to Supabase database",
      });
    } catch (error) {
      console.error('Supabase connection test error:', error);
      addResult(
        'Supabase Connection', 
        false, 
        `Failed to connect to Supabase: ${error instanceof Error ? error.message : String(error)}`,
        error
      );
      
      toast({
        title: "Connection Failed",
        description: error instanceof Error ? error.message : String(error),
        variant: "destructive"
      });
    } finally {
      setIsLoading(prev => ({ ...prev, connection: false }));
    }
  };
  
  // Test webhook function
  const testWebhookFunction = async () => {
    setIsLoading(prev => ({ ...prev, webhook: true }));
    try {
      // First try the health check endpoint
      const healthResponse = await fetch('https://xzgbdaejjcdusbtwejom.functions.supabase.co/wix-purchase-webhook/health');
      
      if (!healthResponse.ok) {
        throw new Error(`Health check failed with status: ${healthResponse.status}`);
      }
      
      const healthData = await healthResponse.json();
      addResult(
        'Webhook Health Check',
        true,
        'Health check endpoint is responding',
        healthData
      );
      
      // Now test the actual webhook with a test payload
      const response = await fetch('https://xzgbdaejjcdusbtwejom.functions.supabase.co/wix-purchase-webhook', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          data: {
            email: testEmail
          }
        })
      });
      
      const data = await response.json();
      
      if (response.ok) {
        addResult(
          'Webhook Function',
          true,
          'Successfully called webhook function',
          data
        );
        
        toast({
          title: "Webhook Test Success",
          description: `Email ${testEmail} was processed`,
        });
      } else {
        throw new Error(data.error || 'Unknown error');
      }
    } catch (error) {
      console.error('Webhook test error:', error);
      addResult(
        'Webhook Function',
        false,
        `Failed to call webhook: ${error instanceof Error ? error.message : String(error)}`,
        error
      );
      
      toast({
        title: "Webhook Test Failed",
        description: error instanceof Error ? error.message : String(error),
        variant: "destructive"
      });
    } finally {
      setIsLoading(prev => ({ ...prev, webhook: false }));
    }
  };
  
  // Test the simple test function
  const testSimpleFunction = async () => {
    setIsLoading(prev => ({ ...prev, testFunc: true }));
    try {
      // First check if the function is accessible with a GET request
      const getResponse = await fetch('https://xzgbdaejjcdusbtwejom.functions.supabase.co/test-function');
      
      if (!getResponse.ok) {
        throw new Error(`GET request failed with status: ${getResponse.status}`);
      }
      
      const getData = await getResponse.json();
      addResult(
        'Test Function GET',
        true,
        'Test function is accessible',
        getData
      );
      
      // Now test with a POST request to check database operation
      const postResponse = await fetch('https://xzgbdaejjcdusbtwejom.functions.supabase.co/test-function', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: testEmail
        })
      });
      
      const postData = await postResponse.json();
      
      if (postResponse.ok) {
        addResult(
          'Test Function POST',
          true,
          'Test function database operation successful',
          postData
        );
        
        toast({
          title: "Test Function Success",
          description: `Database operation with email ${testEmail} succeeded`,
        });
      } else {
        throw new Error(postData.error || 'Unknown error');
      }
    } catch (error) {
      console.error('Test function error:', error);
      addResult(
        'Test Function',
        false,
        `Failed to call test function: ${error instanceof Error ? error.message : String(error)}`,
        error
      );
      
      toast({
        title: "Test Function Failed",
        description: error instanceof Error ? error.message : String(error),
        variant: "destructive"
      });
    } finally {
      setIsLoading(prev => ({ ...prev, testFunc: false }));
    }
  };
  
  // Run a quick database check on component mount
  useEffect(() => {
    testSupabaseConnection();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return {
    testEmail,
    setTestEmail,
    results,
    isLoading,
    testSupabaseConnection,
    testWebhookFunction,
    testSimpleFunction
  };
};
