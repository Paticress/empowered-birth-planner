
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { Card, CardContent } from '@/components/ui/card';
import { useAuthProcessor } from '@/hooks/auth/useAuthProcessor';
import { useAuthUrlDetection } from '@/hooks/auth/useAuthUrlDetection';
import { LoginContent } from '@/components/Login/LoginContent';

export function Login() {
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const { isProcessingAuth, setIsProcessingAuth, processAuth, debugInfo } = useAuthProcessor();
  const { getAuthUrlInfo } = useAuthUrlDetection();

  useEffect(() => {
    // Process authentication as soon as the page loads
    const handleAuthProcess = async () => {
      // Get URL information for auth detection
      const urlInfo = getAuthUrlInfo();
      const { hasAuthInHash, hasAuthInSearch, hasAuthInPath, hasAuthInUrl } = urlInfo;
      
      // Debug logging
      console.log("Login page loaded with URL info:", {
        urlInfo,
        hasAuth: hasAuthInUrl
      });
      
      // If there are no auth parameters, redirect to access page after a delay
      if (!hasAuthInUrl) {
        console.log("No auth tokens found in URL, redirecting to acesso-plano after delay");
        
        // Don't redirect immediately so we can see the debug info if needed
        setTimeout(() => {
          navigate('/acesso-plano', { replace: true });
        }, 3000); // 3 second delay
        
        return;
      }
      
      // Process authentication
      setIsProcessingAuth(true);
      toast.loading("Processando autenticação...");
      
      const success = await processAuth(urlInfo);
      
      if (!success) {
        setError("Falha ao processar autenticação após tentar múltiplos métodos.");
        toast.error("Erro no processamento de autenticação");
      }
    };
    
    handleAuthProcess();
  }, [navigate, getAuthUrlInfo, processAuth, setIsProcessingAuth]);

  const handleRetry = () => {
    navigate('/acesso-plano');
  };

  return (
    <div className="min-h-screen flex flex-col bg-maternal-50">
      <Header />
      <main className="flex-grow flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6 pb-6">
            <LoginContent 
              isProcessing={isProcessingAuth}
              error={error}
              debugInfo={debugInfo}
              onRetry={handleRetry}
            />
          </CardContent>
        </Card>
      </main>
      <Footer />
    </div>
  );
}
