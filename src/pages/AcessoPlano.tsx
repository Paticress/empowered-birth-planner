
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
  const navigate = useNavigate();
  
  // Process magic link tokens directly using exchangeCodeForSession
  useEffect(() => {
    const handleAuth = async () => {
      // Don't process if already handled by other components
      if (isLoading || isProcessingAuth || isProcessingMagicLink) {
        return;
      }
      
      // Detect auth in URL (either in hash or query parameters)
      const hasAuthInHash = window.location.hash && 
                            window.location.hash.includes('access_token');
      const hasAuthInQuery = window.location.search && 
                            (window.location.search.includes('access_token') || 
                             window.location.search.includes('access_entry=magiclink'));
                            
      if (!hasAuthInHash && !hasAuthInQuery) {
        console.log("AcessoPlano: No auth parameters detected in URL");
        return; // No auth parameters to process
      }
      
      console.log("AcessoPlano: Auth parameters detected, processing authentication");
      console.log("Current URL: ", window.location.href);
      setIsProcessingMagicLink(true);
      
      try {
        // Let Supabase process the authentication
        console.log("AcessoPlano: Calling exchangeCodeForSession with current URL");
        const { data, error } = await supabase.auth.exchangeCodeForSession(
          hasAuthInHash ? window.location.hash : window.location.search
        );
        
        if (error) {
          console.error("AcessoPlano: Error processing authentication:", error);
          console.error("Error details:", error.message, error.status);
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
          
          // Clean URL after successful authentication
          window.history.replaceState(null, document.title, window.location.pathname);
          
          toast.success("Login realizado com sucesso!");
          
          // After successful login, redirect to criar-plano
          setTimeout(() => {
            navigate('/criar-plano', { replace: true });
          }, 1500);
        } else {
          console.error("AcessoPlano: No session returned from exchangeCodeForSession");
          console.log("Response data:", data);
          toast.error("Falha na autenticação. Por favor, tente novamente.");
          setIsProcessingMagicLink(false);
        }
      } catch (err) {
        console.error("AcessoPlano: Unexpected error processing authentication:", err);
        console.error("Error type:", typeof err, "Error object:", JSON.stringify(err, Object.getOwnPropertyNames(err)));
        toast.error("Erro inesperado. Por favor, tente novamente.");
        setIsProcessingMagicLink(false);
      }
    };
    
    // Process auth parameters 
    handleAuth();
  }, [isLoading, isProcessingAuth, isProcessingMagicLink, navigate]);

  // Redirect if user is already authenticated
  useEffect(() => {
    if (!isLoading && !isProcessingAuth && !isProcessingMagicLink && user && session) {
      console.log("AcessoPlano: User already authenticated, redirecting to birth plan builder");
      // Use navigate for more consistent routing within the React app
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
          <LoginPage />
        </div>
      </main>
      <Footer />
    </div>
  );
}
