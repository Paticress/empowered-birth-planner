
import { LoginPage } from "@/components/BirthPlan/LoginPage";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { useAuth } from "@/contexts/AuthContext";
import { useEffect, useState } from "react";
import { AuthLoadingState } from "@/components/BirthPlan/components/AuthLoadingState";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

export function AcessoPlano() {
  const { user, isLoading, session, refreshSession, isAuthenticated } = useAuth();
  const [isProcessingAuth, setIsProcessingAuth] = useState(false);
  const navigate = useNavigate();
  
  // Debug logging
  useEffect(() => {
    console.log("AcessoPlano.tsx carregado.");
    console.log("🔍 URL atual:", window.location.href);
    console.log("Session status:", session ? "Active" : "None");
    console.log("User status:", user ? "Logged in" : "Not logged in");
    console.log("Authentication status:", isAuthenticated ? "Authenticated" : "Not authenticated");
  }, [session, user, isAuthenticated]);

  // Verifica a sessão ativamente quando a página carrega
  useEffect(() => {
    const checkAndRefreshSession = async () => {
      // Se estiver carregando, aguardar
      if (isLoading) {
        return;
      }
      
      // Se o usuário já está autenticado, redirecionar para criar-plano
      if (isAuthenticated) {
        console.log("AcessoPlano: Usuário já autenticado, redirecionando para criar-plano");
        navigate('/criar-plano', { replace: true });
        return;
      }
      
      // Check explicitly for auth tokens in URL that might not have been processed yet
      const hasAuthParams = 
        window.location.hash.includes('access_token=') || 
        window.location.search.includes('code=') ||
        window.location.pathname.includes('access_token=');
      
      if (hasAuthParams) {
        console.log("AcessoPlano: Auth parameters detected in URL, waiting...");
        setIsProcessingAuth(true);
        // Add a slight delay to allow auth processing
        setTimeout(() => {
          setIsProcessingAuth(false);
        }, 2500);
        return;
      }
      
      // If we're not authenticated and there are no URL parameters, try a final recovery
      setIsProcessingAuth(true);
      
      // Verificar session diretamente com o Supabase
      try {
        const { data } = await supabase.auth.getSession();
        
        if (data.session) {
          console.log("Session found directly from Supabase:", data.session.user?.email);
          // Tentar atualizar o contexto com a sessão encontrada
          await refreshSession();
          
          // Give a moment for state to update
          setTimeout(() => {
            navigate('/criar-plano', { replace: true });
          }, 500);
        } else {
          console.log("No session found with direct check");
          
          // Check localStorage as last resort
          const isLoggedInLocally = localStorage.getItem('birthPlanLoggedIn') === 'true';
          const storedEmail = localStorage.getItem('birthPlanEmail');
          
          if (isLoggedInLocally && storedEmail) {
            console.log("Found login info in localStorage, attempting to restore session");
            const success = await refreshSession();
            
            if (success) {
              setTimeout(() => {
                navigate('/criar-plano', { replace: true });
              }, 500);
              return;
            }
          }
          
          setIsProcessingAuth(false);
        }
      } catch (error) {
        console.error("Error during session check:", error);
        setIsProcessingAuth(false);
      }
    };
    
    checkAndRefreshSession();
  }, [user, session, isLoading, refreshSession, navigate, isAuthenticated]);

  if (isLoading || isProcessingAuth) {
    return (
      <div className="min-h-screen flex flex-col bg-maternal-50">
        <Header />
        <AuthLoadingState isProcessingAuth={isProcessingAuth} />
        <Footer />
      </div>
    );
  }

  // Se chegou aqui, o usuário não está autenticado e não está processando auth
  return (
    <div className="min-h-screen flex flex-col bg-maternal-50">
      <Header />
      <main className="flex-grow">
        <div className="container mx-auto px-4 py-8">
          <LoginPage />
        </div>
      </main>
      <Footer />
    </div>
  );
}
