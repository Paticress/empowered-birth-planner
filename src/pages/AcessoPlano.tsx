
import { LoginPage } from "@/components/BirthPlan/LoginPage";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { useAuth } from "@/contexts/AuthContext";
import { useEffect, useState } from "react";
import { AuthLoadingState } from "@/components/BirthPlan/components/AuthLoadingState";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

export function AcessoPlano() {
  const { user, isLoading, session } = useAuth();
  const [isProcessingAuth, setIsProcessingAuth] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const [authenticatedUser, setAuthenticatedUser] = useState<any>(null);
  const navigate = useNavigate();
  
  // Debug logging
  useEffect(() => {
    console.log("AcessoPlano.tsx carregado.");
    console.log("🔍 URL atual:", window.location.href);
    console.log("Session status:", session ? "Active" : "None");
    console.log("Auth state:", { isProcessingAuth });
  }, [session, isProcessingAuth]);
  
  // Processo de autenticação com getSessionFromUrl
  useEffect(() => {
    if (isLoading || isProcessingAuth || user) {
      return;
    }
    
    const processSessionFromUrl = async () => {
      // Verifica se há hash ou token na URL
      if (window.location.hash || 
          window.location.href.includes('access_token=') || 
          window.location.search.includes('code=')) {
        
        console.log("Tokens de autenticação detectados na URL, processando...");
        setIsProcessingAuth(true);
        toast.loading("Processando autenticação...");
        
        try {
          // Usar o método recomendado para obter a sessão diretamente da URL
          const { data, error } = await supabase.auth.getSessionFromUrl();
          
          if (error) {
            console.error("Erro ao obter sessão da URL:", error);
            setAuthError(`Falha na autenticação: ${error.message}`);
            toast.error("Erro ao processar link de acesso");
            setIsProcessingAuth(false);
            return;
          }
          
          if (data?.session) {
            console.log("Sessão obtida com sucesso:", data.session.user?.email);
            toast.success("Login realizado com sucesso!");
            
            // Guardar email no localStorage como backup
            if (data.session.user?.email) {
              localStorage.setItem('birthPlanLoggedIn', 'true');
              localStorage.setItem('birthPlanEmail', data.session.user.email);
            }
            
            setAuthenticatedUser(data.session.user);
            
            // Limpar a URL
            window.history.replaceState({}, document.title, '/acesso-plano');
            
            // Redirecionar para a página principal
            setTimeout(() => {
              navigate('/criar-plano', { replace: true });
            }, 1500);
            
            return;
          }
          
          // Se chegou aqui, não conseguiu processar a sessão
          console.log("Nenhuma sessão encontrada na URL");
          setIsProcessingAuth(false);
        } catch (err) {
          console.error("Exceção ao processar sessão da URL:", err);
          setAuthError("Erro inesperado ao processar autenticação");
          toast.error("Erro ao processar link de acesso");
          setIsProcessingAuth(false);
        }
      }
    };

    processSessionFromUrl();
  }, [isLoading, isProcessingAuth, user, navigate]);

  // Redirect if already authenticated
  useEffect(() => {
    if (!isLoading && !isProcessingAuth && user && session) {
      console.log("AcessoPlano: User already authenticated, redirecting to birth plan builder");
      navigate('/criar-plano', { replace: true });
    }
  }, [user, isLoading, isProcessingAuth, session, navigate]);

  if (isLoading || isProcessingAuth) {
    return (
      <div className="min-h-screen flex flex-col bg-maternal-50">
        <Header />
        <AuthLoadingState isProcessingAuth={isProcessingAuth} />
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-maternal-50">
      <Header />
      <main className="flex-grow">
        <div className="container mx-auto px-4 py-8">
          {authError && (
            <div className="mb-6 p-4 rounded-lg bg-red-50 border border-red-200 text-red-800">
              <h3 className="text-lg font-medium mb-2">Erro na autenticação</h3>
              <p className="mb-3">{authError}</p>
              <p>O link de acesso pode ter expirado. Por favor, solicite um novo link de acesso abaixo.</p>
            </div>
          )}
          
          {authenticatedUser && process.env.NODE_ENV !== "production" && (
            <div className="mb-6 p-4 rounded-lg bg-green-50 border border-green-200 text-green-800">
              <h3 className="text-lg font-medium mb-2">✅ Autenticação bem-sucedida</h3>
              <p className="mb-3">Você será redirecionada para o construtor de plano de parto em instantes.</p>
              <div className="mt-2">
                <p className="text-sm text-green-700 mb-1">
                  (Debug) Dados do usuário logado:
                </p>
                <pre className="bg-green-100 p-4 rounded text-sm">
                  {JSON.stringify(authenticatedUser, null, 2)}
                </pre>
              </div>
            </div>
          )}
          
          <LoginPage />
        </div>
      </main>
      <Footer />
    </div>
  );
}
