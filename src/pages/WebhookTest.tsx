
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import { AlertTriangle, CheckCircle, Clipboard, Database, RefreshCw } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

export function WebhookTest() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState<{[key: string]: boolean}>({});
  const [results, setResults] = useState<Array<{
    id: string;
    success: boolean;
    message: string;
    details?: any;
    timestamp: string;
  }>>([]);

  const PROJECT_ID = 'xzgbdaejjcdusbtwejom'; // This is your Supabase project ID
  
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
      const webhookUrl = `https://${PROJECT_ID}.functions.supabase.co/wix-purchase-webhook`;
      
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
      // Direct database insertion
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
        
        // Check if the email was actually inserted
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
    const webhookUrl = `https://${PROJECT_ID}.functions.supabase.co/wix-purchase-webhook`;
    navigator.clipboard.writeText(webhookUrl)
      .then(() => toast.success('Webhook URL copied to clipboard!'))
      .catch(err => toast.error('Failed to copy webhook URL'));
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-2xl font-bold mb-6">Webhook Test Page</h1>
      
      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Test Webhook</CardTitle>
            <CardDescription>
              Test the Wix purchase webhook integration with a sample email
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Webhook URL</label>
                <div className="flex items-center">
                  <code className="bg-muted px-3 py-2 rounded-l text-xs flex-1 overflow-x-auto">
                    https://{PROJECT_ID}.functions.supabase.co/wix-purchase-webhook
                  </code>
                  <Button 
                    variant="outline" 
                    size="icon" 
                    onClick={copyWebhookUrl}
                    className="rounded-l-none"
                  >
                    <Clipboard className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1" htmlFor="test-email">
                  Test Email
                </label>
                <Input
                  id="test-email"
                  type="email"
                  placeholder="Enter email for testing"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              
              <div className="bg-amber-50 border border-amber-200 rounded-md p-3">
                <div className="flex items-start">
                  <AlertTriangle className="h-5 w-5 text-amber-500 mt-0.5 mr-2" />
                  <div>
                    <p className="text-sm font-medium text-amber-800">Test Information</p>
                    <p className="text-xs text-amber-700 mt-1">
                      This page allows you to test the Wix purchase webhook by simulating a purchase 
                      with the email address you provide. The payload format matches what Wix sends:
                    </p>
                    <pre className="mt-2 bg-amber-100 p-2 rounded text-xs overflow-x-auto">
                      {`{
  "data": {
    "email": "your-test-email@example.com"
  }
}`}
                    </pre>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button
              variant="outline"
              onClick={testDatabaseDirect}
              disabled={loading.database}
            >
              {loading.database ? (
                <>
                  <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                  Testing...
                </>
              ) : (
                <>
                  <Database className="mr-2 h-4 w-4" />
                  Test Database Directly
                </>
              )}
            </Button>
            <Button
              onClick={testWebhookDirect}
              disabled={loading.direct}
            >
              {loading.direct ? (
                <>
                  <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                  Testing...
                </>
              ) : (
                'Test Webhook'
              )}
            </Button>
          </CardFooter>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Test Results</CardTitle>
            <CardDescription>
              Results of your webhook and database tests
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2">
              {results.length === 0 ? (
                <p className="text-muted-foreground text-sm italic">No tests run yet</p>
              ) : (
                results.map(result => (
                  <div 
                    key={result.id}
                    className={`border p-3 rounded-md ${
                      result.success 
                        ? 'bg-green-50 border-green-200' 
                        : 'bg-red-50 border-red-200'
                    }`}
                  >
                    <div className="flex items-start">
                      {result.success ? (
                        <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 mr-2 flex-shrink-0" />
                      ) : (
                        <AlertTriangle className="h-5 w-5 text-red-500 mt-0.5 mr-2 flex-shrink-0" />
                      )}
                      <div className="flex-1 min-w-0">
                        <p className={`text-sm font-medium ${
                          result.success ? 'text-green-800' : 'text-red-800'
                        }`}>
                          {result.message}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          {new Date(result.timestamp).toLocaleTimeString()}
                        </p>
                        
                        {result.details && (
                          <details className="mt-2">
                            <summary className="text-xs cursor-pointer">
                              View Details
                            </summary>
                            <pre className="mt-2 p-2 bg-gray-100 rounded text-xs overflow-x-auto">
                              {JSON.stringify(result.details, null, 2)}
                            </pre>
                          </details>
                        )}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
