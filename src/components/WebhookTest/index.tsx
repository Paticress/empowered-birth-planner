
import { WebhookForm } from './WebhookForm';
import { TestResults } from './TestResults';
import { useWebhookTesting } from './hooks/useWebhookTesting';
import { Link } from 'react-router-dom';
import { AuthDebugger } from './AuthDebugger';

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
      <h1 className="text-2xl font-bold mb-6">Webhook & Auth Test Page</h1>
      
      <div className="mb-6">
        <Link to="/acesso-plano" className="text-blue-600 hover:underline">
          Go to Login Page
        </Link>
      </div>
      
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
      
      <div className="mt-8">
        <AuthDebugger />
      </div>
    </div>
  );
}
