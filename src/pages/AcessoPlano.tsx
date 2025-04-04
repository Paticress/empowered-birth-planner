
import { LoginPage } from "@/components/BirthPlan/LoginPage";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { useAuth } from "@/contexts/AuthContext";
import { useEffect, useState } from "react";
import { useAuthUrlHandler } from "@/hooks/useAuthUrlHandler";
import { AuthLoadingState } from "@/components/BirthPlan/components/AuthLoadingState";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export function AcessoPlano() {
  const { user, isLoading, session } = useAuth();
  const { isProcessingAuth } = useAuthUrlHandler();
  const [isProcessingMagicLink, setIsProcessingMagicLink] = useState(false);
  
  // Process magic link tokens directly using exchangeCodeForSession
  useEffect(() => {
    // Check if we have auth params in URL
    const hasAuthParams = window.location.hash && 
                          window.location.hash.includes('access_token');
    
    if (hasAuthParams && !isLoading && !isProcessingAuth) {
      console.log("AcessoPlano: Auth parameters detected in URL, using exchangeCodeForSession");
      
      const handleMagicLink = async () => {
        setIsProcessingMagicLink(true);
        
        try {
          // Use Supabase's updated method to handle the URL
          const { data, error } = await supabase.auth.exchangeCodeForSession(window.location.hash);
          
          if (error) {
            console.error("Error processing authentication token:", error);
            toast.error("Erro ao processar o token de autenticação");
            setIsProcessingMagicLink(false);
            return;
          }
          
          if (data.session) {
            console.log("AcessoPlano: Successfully authenticated with magic link");
            toast.success("Login realizado com sucesso!");
            
            // After successful login, redirect to criar-plano
            setTimeout(() => {
              window.location.href = '/criar-plano';
            }, 1500);
          } else {
            console.error("No session returned from exchangeCodeForSession");
            toast.error("Falha na autenticação. Por favor, tente novamente.");
            setIsProcessingMagicLink(false);
          }
        } catch (err) {
          console.error("Unexpected error processing magic link:", err);
          toast.error("Erro inesperado. Por favor, tente novamente.");
          setIsProcessingMagicLink(false);
        }
      };
      
      handleMagicLink();
    }
  }, [isLoading, isProcessingAuth]);

  // Redirect if user is already authenticated
  useEffect(() => {
    if (!isLoading && !isProcessingAuth && !isProcessingMagicLink && user && session) {
      console.log("AcessoPlano: User already authenticated, redirecting to birth plan builder");
      // Use a direct location change for more reliable navigation
      window.location.href = '/criar-plano';
    }
  }, [user, isLoading, isProcessingAuth, isProcessingMagicLink, session]);

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
