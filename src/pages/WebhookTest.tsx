
import { WebhookForm } from '@/components/WebhookTest/WebhookForm';
import { TestResults } from '@/components/WebhookTest/TestResults';
import { useWebhookTesting } from '@/components/WebhookTest/hooks/useWebhookTesting';

export function WebhookTest() {
  const PROJECT_ID = 'xzgbdaejjcdusbtwejom'; // This is your Supabase project ID
  
  const {
    email,
    setEmail,
    loading,
    results,
    testWebhookDirect,
    testDatabaseDirect,
    copyWebhookUrl
  } = useWebhookTesting(PROJECT_ID);

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-2xl font-bold mb-6">Webhook Test Page</h1>
      
      <div className="grid md:grid-cols-2 gap-6">
        <WebhookForm
          email={email}
          setEmail={setEmail}
          loading={loading}
          testWebhookDirect={testWebhookDirect}
          testDatabaseDirect={testDatabaseDirect}
          copyWebhookUrl={copyWebhookUrl}
          projectId={PROJECT_ID}
        />
        
        <TestResults results={results} />
      </div>
    </div>
  );
}
