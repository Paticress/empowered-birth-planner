
import React from 'react';
import { Button } from '@/components/ui/button';

interface TestConfigurationProps {
  testEmail: string;
  setTestEmail: (email: string) => void;
  isLoading: {[key: string]: boolean};
  testSupabaseConnection: () => Promise<void>;
  testWebhookFunction: () => Promise<void>;
  testSimpleFunction: () => Promise<void>;
}

export function TestConfiguration({
  testEmail,
  setTestEmail,
  isLoading,
  testSupabaseConnection,
  testWebhookFunction,
  testSimpleFunction
}: TestConfigurationProps) {
  return (
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
  );
}
