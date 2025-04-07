
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { Card, CardContent } from '@/components/ui/card';
import { useAuthProcessor } from '@/hooks/auth/useAuthProcessor';
import { useAuthUrlDetection } from '@/hooks/auth/useAuthUrlDetection';
import { LoginContent } from '@/components/Login/LoginContent';
import { getSessionFromUrl } from '@/utils/auth/token';

export function Login() {
  const [error, setError] = useState<string | null>(null);
  const [isProcessingSession, setIsProcessingSession] = useState(false);
  const navigate = useNavigate();
  const { isProcessingAuth, setIsProcessingAuth, processAuth, debugInfo } = useAuthProcessor();
  const { getAuthUrlInfo } = useAuthUrlDetection();

  useEffect(() => {
    console.log("Login page loaded, checking for session from URL");
    
    // Novo método para processar sessão diretamente da URL
    const processSessionFromUrl = async () => {
      setIsProcessingSession(true);
      toast.loading("Processando autenticação...");
      
      try {
        // Use our updated utility function instead of getSessionFromUrl
        const { data, error } = await getSessionFromUrl();
        
        if (error) {
          console.error("Erro ao obter sessão da URL:", error);
          setError(`Erro ao processar autenticação: ${error.message}`);
          toast.error("Erro ao processar link de acesso");
          setIsProcessingSession(false);
          return false;
        }
        
        if (data?.session) {
          console.log("Sessão obtida com sucesso da URL:", data.session.user?.email);
          toast.success("Login realizado com sucesso!");
          
          // Guardar email no localStorage como backup
          if (data.session.user?.email) {
            localStorage.setItem('birthPlanLoggedIn', 'true');
            localStorage.setItem('birthPlanEmail', data.session.user.email);
          }
          
          // Limpar a URL
          window.history.replaceState({}, document.title, '/');
          
          // Redirecionar para a página principal
          setTimeout(() => {
            navigate('/criar-plano', { replace: true });
          }, 1000);
          
          return true;
        }
        
        return false;
      } catch (err) {
        console.error("Exceção ao processar sessão da URL:", err);
        setError("Erro inesperado ao processar autenticação");
        toast.error("Erro ao processar link de acesso");
        setIsProcessingSession(false);
        return false;
      }
    };

    // Tenta processar sessão da URL primeiro
    processSessionFromUrl().then((success) => {
      // Se não conseguiu processar a sessão da URL, tenta o método antigo
      if (!success && !isProcessingSession) {
        const handleAuthProcess = async () => {
          // Get URL information for auth detection
          const urlInfo = getAuthUrlInfo();
          
          // Debug logging
          console.log("Fallback: Verificando URL info:", {
            urlInfo,
            hasAuth: urlInfo.hasAuthInUrl
          });
          
          // If there are no auth parameters, redirect to access page after a delay
          if (!urlInfo.hasAuthInUrl) {
            console.log("Nenhum token de autenticação encontrado na URL, redirecionando para acesso-plano");
            
            setTimeout(() => {
              navigate('/acesso-plano', { replace: true });
            }, 2000);
            
            return;
          }
          
          // Process authentication
          setIsProcessingAuth(true);
          
          const success = await processAuth(urlInfo);
          
          if (!success) {
            setError("Falha ao processar autenticação após tentar múltiplos métodos.");
            toast.error("Erro no processamento de autenticação");
          }
        };
        
        handleAuthProcess();
      }
    });
  }, [navigate, getAuthUrlInfo, processAuth, setIsProcessingAuth, isProcessingSession]);

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
              isProcessing={isProcessingAuth || isProcessingSession}
              error={error}
              debugInfo={{...debugInfo, isProcessingSession}}
              onRetry={handleRetry}
            />
          </CardContent>
        </Card>
      </main>
      <Footer />
    </div>
  );
}
