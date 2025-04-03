
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

export function SupabaseTest() {
  const { toast } = useToast();
  const [testEmail, setTestEmail] = useState('test@example.com');
  const [results, setResults] = useState<any[]>([]);
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

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <h1 className="text-2xl font-bold mb-6">Supabase Integration Test</h1>
      
      <div className="bg-white shadow-md rounded-lg p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4">Test Configuration</h2>
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1" htmlFor="test-email">
            Test Email
          </label>
          <input
            id="test-email"
            type="email"
            className="w-full p-2 border rounded"
            value={testEmail}
            onChange={(e) => setTestEmail(e.target.value)}
          />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Button
            onClick={testSupabaseConnection}
            disabled={isLoading.connection}
            className="w-full"
          >
            {isLoading.connection ? 'Testing...' : 'Test Supabase Connection'}
          </Button>
          
          <Button
            onClick={testWebhookFunction}
            disabled={isLoading.webhook}
            className="w-full"
            variant="outline"
          >
            {isLoading.webhook ? 'Testing...' : 'Test Webhook Function'}
          </Button>
          
          <Button
            onClick={testSimpleFunction}
            disabled={isLoading.testFunc}
            className="w-full"
            variant="secondary"
          >
            {isLoading.testFunc ? 'Testing...' : 'Test Simple Function'}
          </Button>
        </div>
      </div>
      
      <div className="bg-white shadow-md rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-4">Test Results</h2>
        
        {results.length === 0 ? (
          <p className="text-gray-500 italic">No tests run yet</p>
        ) : (
          <div className="space-y-4">
            {results.map((result) => (
              <div 
                key={result.id} 
                className={`p-4 rounded-md ${
                  result.success ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'
                }`}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-medium flex items-center">
                      {result.success ? (
                        <svg className="w-5 h-5 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                      ) : (
                        <svg className="w-5 h-5 text-red-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                        </svg>
                      )}
                      {result.test}
                    </h3>
                    <p className={result.success ? 'text-green-800' : 'text-red-800'}>
                      {result.message}
                    </p>
                  </div>
                  <span className="text-xs text-gray-500">
                    {new Date(result.timestamp).toLocaleTimeString()}
                  </span>
                </div>
                
                {result.data && (
                  <details className="mt-2">
                    <summary className="text-sm cursor-pointer hover:text-blue-600">
                      Response Details
                    </summary>
                    <pre className="mt-2 p-2 bg-gray-100 rounded overflow-x-auto text-xs">
                      {JSON.stringify(result.data, null, 2)}
                    </pre>
                  </details>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
