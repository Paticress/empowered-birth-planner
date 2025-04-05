
import { LoginPage } from "@/components/BirthPlan/LoginPage";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { useAuth } from "@/contexts/AuthContext";
import { useEffect, useState } from "react";
import { useAuthUrlHandler } from "@/hooks/useAuthUrlHandler";
import { AuthLoadingState } from "@/components/BirthPlan/components/AuthLoadingState";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

export function AcessoPlano() {
  const { user, isLoading, session } = useAuth();
  const { isProcessingAuth } = useAuthUrlHandler();
  const [isProcessingMagicLink, setIsProcessingMagicLink] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const navigate = useNavigate();
  
  useEffect(() => {
    console.log("AcessoPlano.tsx carregado.");
    console.log("URL atual:", window.location.href);

    const hash = window.location.hash;
    console.log("Hash extraído:", hash);

    if (hash.startsWith("#access_token=")) {
      const token = hash.replace("#access_token=", "");
      console.log("Token extraído:", token);
    } else {
      console.error("Nenhum token encontrado na URL.");
    }
  }, []);
  
  useEffect(() => {
    const handleAuth = async () => {
      if (isLoading || isProcessingAuth || isProcessingMagicLink) {
        return;
      }
      
      const hasAuthInHash = window.location.hash && 
                            window.location.hash.includes('access_token');
      const hasAuthInQuery = window.location.search && 
                            (window.location.search.includes('access_token') || 
                             window.location.search.includes('access_entry=magiclink'));
                            
      if (!hasAuthInHash && !hasAuthInQuery) {
        console.log("AcessoPlano: No auth parameters detected in URL");
        return;
      }
      
      console.log("AcessoPlano: Auth parameters detected, processing authentication");
      console.log("Current URL: ", window.location.href);
      
      toast.info("Processando autenticação...");
      
      setIsProcessingMagicLink(true);
      
      try {
        console.log("AcessoPlano: Calling exchangeCodeForSession with current URL");
        
        if (hasAuthInHash) {
          console.log("Token in hash format: detected");
        } else if (hasAuthInQuery) {
          console.log("Token in query format: detected");
        }
        
        const { data, error } = await supabase.auth.exchangeCodeForSession(
          window.location.href
        );
        
        if (error) {
          console.error("AcessoPlano: Error processing authentication:", error);
          console.error("Error details:", error.message, error.status, error.stack);
          
          setAuthError(error.message);
          
          toast.error("Erro ao processar o token de autenticação: " + error.message);
          setIsProcessingMagicLink(false);
          return;
        }
        
        if (data.session) {
          console.log("AcessoPlano: Successfully authenticated user:", data.session.user.email);
          console.log("Session data:", JSON.stringify({
            user: data.session.user.email,
            expires_at: data.session.expires_at,
            token_type: data.session.token_type
          }));
          
          window.history.replaceState(null, document.title, window.location.pathname);
          
          toast.success("Login realizado com sucesso!");
          
          setTimeout(() => {
            navigate('/criar-plano', { replace: true });
          }, 1500);
        } else {
          console.error("AcessoPlano: No session returned from exchangeCodeForSession");
          console.log("Response data:", data);
          
          setAuthError("Nenhuma sessão retornada após a autenticação");
          
          toast.error("Falha na autenticação. Por favor, tente novamente.");
          setIsProcessingMagicLink(false);
        }
      } catch (err) {
        console.error("AcessoPlano: Unexpected error processing authentication:", err);
        console.error("Error type:", typeof err, "Error object:", JSON.stringify(err, Object.getOwnPropertyNames(err)));
        
        setAuthError(err instanceof Error ? err.message : "Erro inesperado");
        
        toast.error("Erro inesperado. Por favor, tente novamente.");
        setIsProcessingMagicLink(false);
      }
    };
    
    handleAuth();
  }, [isLoading, isProcessingAuth, isProcessingMagicLink, navigate]);

  useEffect(() => {
    if (!isLoading && !isProcessingAuth && !isProcessingMagicLink && user && session) {
      console.log("AcessoPlano: User already authenticated, redirecting to birth plan builder");
      navigate('/criar-plano', { replace: true });
    }
  }, [user, isLoading, isProcessingAuth, isProcessingMagicLink, session, navigate]);

  // Enhanced error detection specifically for magic links
  useEffect(() => {
    const checkAuthError = () => {
      const hash = window.location.hash;
      const search = window.location.search;
      const url = window.location.href;
      
      // Check for error in hash
      const hashError = hash.match(/error=([^&]+)/);
      // Check for error in search params
      const searchError = search.match(/error=([^&]+)/);
      // Check for specific OTP expired error in URL
      const hasOtpExpiredError = url.includes('error_code=otp_expired') || 
                                url.includes('error_description=Email+link+is+invalid+or+has+expired');
      
      if (hashError || searchError || hasOtpExpiredError) {
        let errorMessage;
        
        if (hasOtpExpiredError) {
          errorMessage = "O link de acesso expirou ou é inválido";
        } else {
          errorMessage = decodeURIComponent(hashError?.[1] || searchError?.[1] || 'Erro desconhecido');
        }
        
        console.error("Erro de autenticação detectado:", errorMessage);
        console.error("URL completa:", url);
        
        setAuthError(errorMessage);
        
        toast.error("Erro ao autenticar", {
          description: "O link pode ter expirado. Tente solicitar um novo link de acesso.",
          duration: 5000
        });
      }
    };

    checkAuthError();
  }, []);

  if (isLoading || isProcessingAuth || isProcessingMagicLink) {
    return (
      <div className="min-h-screen flex flex-col bg-maternal-50">
        <Header />
        <AuthLoadingState isProcessingAuth={isProcessingAuth || isProcessingMagicLink} />
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
          <LoginPage />
        </div>
      </main>
      <Footer />
    </div>
  );
}
