
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
      const hasAuthParams = hash && (hash.includes('access_token') || hash.includes('error'));
      
      if (hasAuthParams) {
        console.log("Authentication in progress via magic link...", { hash });
        setIsProcessingAuth(true);
        
        // Check if there's an error in the URL
        if (hash.includes('error=')) {
          const errorMessage = decodeURIComponent(hash.split('error=')[1].split('&')[0]);
          console.error("Error in magic link authentication:", errorMessage);
          toast.error("Erro ao processar o link mágico: " + errorMessage);
          setIsProcessingAuth(false);
          
          // Clean the URL to remove error parameters
          window.history.replaceState(null, "", window.location.pathname);
          return;
        }
        
        try {
          // Process the hash fragment
          const { data, error } = await supabase.auth.getSession();
          
          if (error) {
            console.error("Error processing magic link:", error);
            toast.error("Erro ao processar o link mágico: " + error.message);
            setIsProcessingAuth(false);
            
            // Clean the URL to remove error parameters
            window.history.replaceState(null, "", window.location.pathname);
            return;
          }
          
          if (data.session) {
            console.log("Magic link authentication successful:", data.session);
            
            // Make sure user is added to the database
            try {
              if (data.session.user?.email) {
                const email = data.session.user.email;
                
                // Add user to database
                const { error: insertError } = await supabase
                  .from('users_db_birthplanbuilder')
                  .upsert({ email }, { onConflict: 'email' });
                  
                if (insertError) {
                  console.error("Error adding user to database:", insertError);
                }
              }
            } catch (dbError) {
              console.error("Error updating user database:", dbError);
            }
            
            toast.success("Login realizado com sucesso!");
            
            // Remove hash from URL without reloading and redirect
            window.history.replaceState(null, "", window.location.pathname);
            
            // Use a direct location change instead of navigateTo to ensure a clean navigation
            window.location.href = '/criar-plano';
            return;
          } else {
            console.log("No session found after magic link auth");
            toast.error("Sessão de autenticação não encontrada");
            setIsProcessingAuth(false);
            
            // Clean the URL anyway
            window.history.replaceState(null, "", window.location.pathname);
          }
        } catch (err) {
          console.error("Error during magic link auth:", err);
          toast.error("Erro durante a autenticação com link mágico");
          setIsProcessingAuth(false);
          
          // Clean the URL to remove auth parameters
          window.history.replaceState(null, "", window.location.pathname);
        }
      }
    };
    
    checkForAuthInUrl();
  }, [navigateTo]);
  
  // If user is already authenticated, redirect to birth plan builder
  useEffect(() => {
    if (!isLoading && !isProcessingAuth && user && session) {
      console.log("User already authenticated, redirecting to birth plan builder");
      
      // Use direct location change for more reliable redirection
      window.location.href = '/criar-plano';
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
