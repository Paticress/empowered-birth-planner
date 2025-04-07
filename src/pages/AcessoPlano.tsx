
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
import { cleanUrlAfterAuth } from "@/utils/auth/token";

export function AcessoPlano() {
  const { user, isLoading, session } = useAuth();
  const { isProcessingAuth } = useAuthUrlHandler();
  const [isProcessingMagicLink, setIsProcessingMagicLink] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const navigate = useNavigate();
  
  // Debug logging
  useEffect(() => {
    console.log("AcessoPlano.tsx carregado.");
    console.log("URL atual:", window.location.href);
    console.log("Hash extraído:", window.location.hash);
    console.log("Session status:", session ? "Active" : "None");
    console.log("Auth state:", { isProcessingAuth, isProcessingMagicLink });
  }, [session, isProcessingAuth, isProcessingMagicLink]);
  
  // Handle magic link authentication
  useEffect(() => {
    const handleMagicLinkAuth = async () => {
      if (isLoading || isProcessingAuth || isProcessingMagicLink) {
        return;
      }
      
      const hash = window.location.hash;
      
      if (!hash || !hash.includes("access_token")) {
        console.log("Nenhum token encontrado na URL.");
        return;
      }
      
      console.log("Tokens detectados. Iniciando autenticação...");
      setIsProcessingMagicLink(true);
      toast.info("Conectando...");
      
      try {
        // Parse hash params (remove the '#' first)
        const hashParams = new URLSearchParams(hash.substring(1));
        const accessToken = hashParams.get("access_token");
        const refreshToken = hashParams.get("refresh_token");
        
        if (!accessToken || !refreshToken) {
          console.error("Tokens ausentes no hash da URL.");
          toast.error("Erro ao autenticar. Tokens não encontrados.");
          setIsProcessingMagicLink(false);
          return;
        }
        
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
        
        // Store login info in localStorage for backup
        const { data } = await supabase.auth.getSession();
        if (data.session?.user?.email) {
          localStorage.setItem('birthPlanLoggedIn', 'true');
          localStorage.setItem('birthPlanEmail', data.session.user.email);
        }
        
        // Clean URL after successful authentication
        cleanUrlAfterAuth();
        
        toast.success("Login realizado com sucesso!");
        
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
  }, [isLoading, isProcessingAuth, isProcessingMagicLink, navigate]);

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
          <LoginPage />
        </div>
      </main>
      <Footer />
    </div>
  );
}
