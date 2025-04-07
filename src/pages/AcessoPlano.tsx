
import { LoginPage } from "@/components/BirthPlan/LoginPage";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { useAuth } from "@/contexts/AuthContext";
import { useEffect, useState } from "react";
import { useAuthUrlHandler } from "@/hooks/useAuthUrlHandler";
import { AuthLoadingState } from "@/components/BirthPlan/components/AuthLoadingState";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuthUrlDetection } from "@/hooks/auth/useAuthUrlDetection";
import { useAuthProcessor } from "@/hooks/auth/useAuthProcessor";

export function AcessoPlano() {
  const { user, isLoading, session } = useAuth();
  const { isProcessingAuth: legacyProcessingAuth } = useAuthUrlHandler();
  const { getAuthUrlInfo } = useAuthUrlDetection();
  const { isProcessingAuth, processAuth, setIsProcessingAuth } = useAuthProcessor();
  const [isProcessingMagicLink, setIsProcessingMagicLink] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const [authenticatedUser, setAuthenticatedUser] = useState<any>(null);
  const navigate = useNavigate();
  const location = useLocation();
  
  // Debug logging
  useEffect(() => {
    console.log("AcessoPlano.tsx carregado.");
    console.log("🔍 URL atual:", window.location.href);
    console.log("Hash extraído:", location.hash);
    console.log("Session status:", session ? "Active" : "None");
    console.log("Auth state:", { isProcessingAuth, isProcessingMagicLink });
  }, [session, isProcessingAuth, isProcessingMagicLink, location.hash]);
  
  // Process auth tokens in URL if any
  useEffect(() => {
    const handleAuthTokens = async () => {
      if (isLoading || isProcessingAuth || isProcessingMagicLink) {
        return;
      }
      
      // Get URL information for auth detection
      const urlInfo = getAuthUrlInfo();
      
      // Skip if no auth tokens in URL
      if (!urlInfo.hasAuthInUrl) {
        return;
      }
      
      console.log("Auth tokens detected in URL, processing...");
      
      // Process authentication
      setIsProcessingAuth(true);
      toast.loading("Processando autenticação...");
      
      const success = await processAuth(urlInfo);
      
      if (!success) {
        console.error("Auth processing failed after trying multiple methods");
        setAuthError("Falha na autenticação. O link pode ter expirado ou ser inválido.");
        setIsProcessingAuth(false);
      }
    };

    handleAuthTokens();
  }, [isLoading, processAuth, isProcessingAuth, isProcessingMagicLink, getAuthUrlInfo, setIsProcessingAuth]);
  
  // Handle magic link authentication
  useEffect(() => {
    const handleMagicLinkAuth = async () => {
      if (isLoading || isProcessingAuth || isProcessingMagicLink) {
        return;
      }

      // Recupera tokens da URL hash (parte após "#")
      const fullHash = location.hash.substring(1); // remove "#"
      const hashParams = new URLSearchParams(fullHash);
      
      const accessToken = hashParams.get("access_token");
      const refreshToken = hashParams.get("refresh_token");
      
      if (!accessToken || !refreshToken) {
        console.warn("❌ Tokens ausentes na URL.");
        return;
      }
      
      console.log("✅ Tokens detectados! Iniciando login...");
      setIsProcessingMagicLink(true);
      toast.info("Conectando...");
      
      try {
        // Set the session with Supabase
        const { error } = await supabase.auth.setSession({
          access_token: accessToken,
          refresh_token: refreshToken
        });
        
        if (error) {
          console.error("Erro ao configurar sessão:", error.message);
          setAuthError(error.message);
          toast.error("Erro ao autenticar. Tente novamente.");
          setIsProcessingMagicLink(false);
          return;
        }
        
        console.log("Usuário autenticado com sucesso!");
        
        // Get user information
        const { data } = await supabase.auth.getUser();
        setAuthenticatedUser(data.user);
        
        // Store login info in localStorage for backup
        if (data.user?.email) {
          localStorage.setItem('birthPlanLoggedIn', 'true');
          localStorage.setItem('birthPlanEmail', data.user.email);
        }
        
        toast.success("Login realizado com sucesso!");
        
        // Clean URL after successful authentication
        navigate('/acesso-plano', { replace: true });
        
        // Short delay before redirecting
        setTimeout(() => {
          navigate('/criar-plano', { replace: true });
        }, 1500);
        
      } catch (err) {
        console.error("Erro inesperado durante autenticação:", err);
        setAuthError(err instanceof Error ? err.message : "Erro inesperado");
        toast.error("Erro ao autenticar. Tente novamente.");
        setIsProcessingMagicLink(false);
      }
    };
    
    handleMagicLinkAuth();
  }, [isLoading, isProcessingAuth, isProcessingMagicLink, navigate, location.hash]);

  // Redirect if already authenticated
  useEffect(() => {
    if (!isLoading && !isProcessingAuth && !isProcessingMagicLink && user && session) {
      console.log("AcessoPlano: User already authenticated, redirecting to birth plan builder");
      navigate('/criar-plano', { replace: true });
    }
  }, [user, isLoading, isProcessingAuth, isProcessingMagicLink, session, navigate]);

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
