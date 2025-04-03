
import React from 'react';
import { TestConfiguration } from './TestConfiguration';
import { TestResults } from './TestResults';
import { useSupabaseTest } from './hooks/useSupabaseTest';

export function SupabaseTest() {
  const {
    testEmail,
    setTestEmail,
    results,
    isLoading,
    testSupabaseConnection,
    testWebhookFunction,
    testSimpleFunction
  } = useSupabaseTest();

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <h1 className="text-2xl font-bold mb-6">Supabase Integration Test</h1>
      
      <TestConfiguration
        testEmail={testEmail}
        setTestEmail={setTestEmail}
        isLoading={isLoading}
        testSupabaseConnection={testSupabaseConnection}
        testWebhookFunction={testWebhookFunction}
        testSimpleFunction={testSimpleFunction}
      />
      
      <TestResults results={results} />
    </div>
  );
}
