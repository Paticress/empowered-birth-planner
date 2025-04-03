
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import { AlertTriangle, Clipboard, Database, RefreshCw } from 'lucide-react';

interface WebhookFormProps {
  email: string;
  setEmail: (email: string) => void;
  loading: {[key: string]: boolean};
  testWebhookDirect: () => Promise<void>;
  testDatabaseDirect: () => Promise<void>;
  copyWebhookUrl: () => void;
  projectId: string;
}

export function WebhookForm({
  email,
  setEmail,
  loading,
  testWebhookDirect,
  testDatabaseDirect,
  copyWebhookUrl,
  projectId
}: WebhookFormProps) {
  return (
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
                https://{projectId}.functions.supabase.co/wix-purchase-webhook
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
  );
}
