
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
      try {
        // Check both hash fragments and query parameters for auth tokens
        const fullUrl = window.location.href;
        const hash = window.location.hash;
        const search = window.location.search;
        
        // Detect auth parameters
        const hasAuthInHash = hash && hash.includes('access_token=');
        const hasAuthInSearch = search && search.includes('access_token=');
        const hasError = (hash && hash.includes('error=')) || (search && search.includes('error='));
        
        if (hasAuthInHash || hasAuthInSearch || hasError) {
          console.log("Auth parameters detected in URL:", { 
            hasAuthInHash,
            hasAuthInSearch,
            hasError,
            pathname: window.location.pathname
          });
          
          setIsProcessingAuth(true);
          
          // Handle error case first
          if (hasError) {
            let errorMessage = "Erro desconhecido na autenticação";
            
            try {
              if (hash.includes('error=')) {
                errorMessage = decodeURIComponent(hash.split('error=')[1].split('&')[0]);
              } else if (search.includes('error=')) {
                errorMessage = decodeURIComponent(search.split('error=')[1].split('&')[0]);
              }
            } catch (e) {
              console.error("Error parsing error message:", e);
            }
            
            console.error("Authentication error:", errorMessage);
            toast.error("Erro na autenticação: " + errorMessage);
            setIsProcessingAuth(false);
            
            // Clean the URL to remove error parameters
            window.history.replaceState(null, "", window.location.pathname);
            return;
          }
          
          // Process Supabase authentication
          const { data, error } = await supabase.auth.getSession();
          
          if (error) {
            console.error("Error getting session:", error);
            toast.error("Erro ao processar autenticação: " + error.message);
            setIsProcessingAuth(false);
            
            // Clean the URL
            window.history.replaceState(null, "", window.location.pathname);
            return;
          }
          
          if (data.session) {
            console.log("Authentication successful:", data.session.user?.email);
            
            // Ensure user is in the database
            try {
              if (data.session.user?.email) {
                const email = data.session.user.email;
                
                // Add/update user in database
                const { error: insertError } = await supabase
                  .from('users_db_birthplanbuilder')
                  .upsert({ email }, { onConflict: 'email' });
                  
                if (insertError) {
                  console.error("Error adding user to database:", insertError);
                  // Continue anyway - this shouldn't block login
                }
              }
            } catch (dbError) {
              console.error("Database error:", dbError);
              // Continue anyway - database error shouldn't block login
            }
            
            toast.success("Login realizado com sucesso!");
            
            // Clean URL before redirecting
            window.history.replaceState(null, "", window.location.pathname);
            
            // Redirect to criar-plano page
            console.log("Redirecting to criar-plano after successful auth");
            window.location.href = '/criar-plano';
            return;
          } else {
            console.log("No session found after processing auth parameters");
            toast.error("Sessão não encontrada após autenticação");
            setIsProcessingAuth(false);
            
            // Clean URL
            window.history.replaceState(null, "", window.location.pathname);
          }
        }
      } catch (err) {
        console.error("Unexpected error during auth processing:", err);
        toast.error("Erro inesperado durante autenticação");
        setIsProcessingAuth(false);
        
        // Clean URL
        window.history.replaceState(null, "", window.location.pathname);
      }
    };
    
    checkForAuthInUrl();
  }, [navigateTo]);
  
  // Redirect if user is already authenticated
  useEffect(() => {
    if (!isLoading && !isProcessingAuth && user && session) {
      console.log("User already authenticated, redirecting to birth plan builder");
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
