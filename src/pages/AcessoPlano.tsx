
import { LoginPage } from "@/components/BirthPlan/LoginPage";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigation } from "@/hooks/useNavigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

export function AcessoPlano() {
  const { user, isLoading, session } = useAuth();
  const { navigateTo } = useNavigation();
  const [isProcessingAuth, setIsProcessingAuth] = useState(false);
  
  // Check if we're in the middle of magic link authentication
  useEffect(() => {
    const checkForAuthInUrl = async () => {
      const hash = window.location.hash;
      const hasAuthParams = hash && hash.includes('access_token');
      
      if (hasAuthParams) {
        console.log("Authentication in progress via magic link...");
        setIsProcessingAuth(true);
        
        try {
          // Process the hash fragment
          const { data, error } = await supabase.auth.getSession();
          
          if (error) {
            console.error("Error processing magic link:", error);
            toast.error("Erro ao processar o link mágico");
            setIsProcessingAuth(false);
            return;
          }
          
          if (data.session) {
            console.log("Magic link authentication successful:", data.session);
            toast.success("Login realizado com sucesso!");
            
            // Small delay to ensure auth state is updated
            setTimeout(() => {
              navigateTo('/criar-plano');
            }, 1500);
          } else {
            console.log("No session found after magic link auth");
            setIsProcessingAuth(false);
          }
        } catch (err) {
          console.error("Error during magic link auth:", err);
          setIsProcessingAuth(false);
        }
      }
    };
    
    checkForAuthInUrl();
  }, [navigateTo]);
  
  // If user is already authenticated, redirect to birth plan builder
  useEffect(() => {
    if (!isLoading && !isProcessingAuth && user && session) {
      console.log("User already authenticated, redirecting to birth plan builder");
      navigateTo('/criar-plano');
    }
  }, [user, navigateTo, isLoading, isProcessingAuth, session]);

  if (isLoading || isProcessingAuth) {
    return (
      <div className="min-h-screen flex flex-col bg-maternal-50">
        <Header />
        <main className="flex-grow flex items-center justify-center">
          <div className="text-center p-8">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-maternal-500 border-r-transparent"></div>
            <p className="mt-4 text-maternal-800">
              {isProcessingAuth 
                ? "Autenticando, por favor aguarde..." 
                : "Carregando..."}
            </p>
          </div>
        </main>
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
