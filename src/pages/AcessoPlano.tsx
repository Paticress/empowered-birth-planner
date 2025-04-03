
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
        // Check all possible locations for auth tokens
        const fullUrl = window.location.href;
        const hash = window.location.hash;
        const search = window.location.search;
        const path = window.location.pathname;
        
        console.log("AcessoPlano page loaded, URL check:", { 
          path: path,
          hasHash: hash ? true : false,
          hasSearch: search ? true : false,
          hasAuthInPath: path.includes('access_token='),
          fullUrl: fullUrl.includes('access_token=') ? 'contains-token' : 'normal',
          isProcessing: isProcessingAuth
        });
        
        // Detect auth parameters in all possible locations
        const hasAuthInHash = hash && hash.includes('access_token=');
        const hasAuthInSearch = search && search.includes('access_token=');
        const hasAuthInPath = path.includes('access_token=');
        const hasError = (hash && hash.includes('error=')) || 
                        (search && search.includes('error=')) || 
                        (path.includes('error='));
        
        // If auth params are in the wrong place (path), fix them
        if (hasAuthInPath) {
          console.log("Auth token in URL path - fixing format before processing");
          
          // Extract token and other params
          const tokenPart = path.substring(path.indexOf('access_token='));
          
          // Fix the URL without reloading
          window.history.replaceState(
            null, 
            document.title,
            '/acesso-plano#' + tokenPart
          );
          
          // Now set auth in hash for subsequent processing
          const newHash = '#' + tokenPart;
          window.location.hash = tokenPart;
          
          // Allow a moment for hash change to propagate
          await new Promise(resolve => setTimeout(resolve, 100));
        }
        
        // Only process if we have auth parameters and are not already processing
        if ((hasAuthInHash || hasAuthInSearch || hasError) && !isProcessingAuth) {
          console.log("Auth parameters detected in AcessoPlano");
          
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
            
            // Clean URL
            window.history.replaceState(null, document.title, window.location.pathname);
            return;
          }
          
          // Process the authentication - wait a bit to ensure everything is ready
          await new Promise(resolve => setTimeout(resolve, 500));
          
          try {
            // For hash-based tokens (most common with magic links)
            if (hasAuthInHash) {
              console.log("Processing auth token from hash");
              
              // For supabase magic links, we need to let Supabase handle it directly
              const { error } = await supabase.auth.getSession();
              
              if (error) {
                console.error("Error getting session from hash:", error);
                toast.error("Erro ao processar magic link: " + error.message);
                setIsProcessingAuth(false);
                
                // Clean URL
                window.history.replaceState(null, document.title, window.location.pathname);
                return;
              }
              
              // Supabase should have set up the session automatically
              console.log("Supabase processed the hash-based auth token");
            } 
            // For query parameter tokens
            else if (hasAuthInSearch) {
              console.log("Processing auth token from query parameters");
              
              // Extract token
              const params = new URLSearchParams(search);
              const token = params.get('access_token');
              
              if (token) {
                // Set session manually
                const { error } = await supabase.auth.setSession({
                  access_token: token,
                  refresh_token: ''
                });
                
                if (error) {
                  console.error("Error setting session from query params:", error);
                  toast.error("Erro ao processar token: " + error.message);
                  setIsProcessingAuth(false);
                  
                  // Clean URL
                  window.history.replaceState(null, document.title, window.location.pathname);
                  return;
                }
              } else {
                console.error("No token found in query parameters");
                toast.error("Token de autenticação não encontrado");
                setIsProcessingAuth(false);
                
                // Clean URL
                window.history.replaceState(null, document.title, window.location.pathname);
                return;
              }
            }
            
            // Now check if we got a valid session
            const { data, error } = await supabase.auth.getSession();
            
            if (error) {
              console.error("Error getting session after processing:", error);
              toast.error("Erro ao obter sessão: " + error.message);
              setIsProcessingAuth(false);
              
              // Clean URL
              window.history.replaceState(null, document.title, window.location.pathname);
              return;
            }
            
            if (data.session) {
              console.log("Authentication successful, session established");
              
              // Ensure user is in the database (for permissions)
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
                  } else {
                    console.log("User added/updated in the database");
                  }
                }
              } catch (dbError) {
                console.error("Database error:", dbError);
                // Continue anyway - database error shouldn't block login
              }
              
              // Clean URL before showing success message
              window.history.replaceState(null, document.title, window.location.pathname);
              
              toast.success("Login realizado com sucesso!");
              
              // Short delay to allow toast to be seen
              setTimeout(() => {
                // Redirect to criar-plano page
                console.log("Redirecting to criar-plano after successful auth");
                // Use direct location change to ensure clean navigation
                window.location.href = '/criar-plano';
              }, 1500);
              return;
            } else {
              console.log("No session found after processing auth parameters");
              toast.error("Sessão não encontrada após autenticação");
              setIsProcessingAuth(false);
              
              // Clean URL
              window.history.replaceState(null, document.title, window.location.pathname);
            }
          } catch (err) {
            console.error("Error processing authentication:", err);
            toast.error("Erro ao processar autenticação");
            setIsProcessingAuth(false);
            
            // Clean URL
            window.history.replaceState(null, document.title, window.location.pathname);
          }
        }
      } catch (err) {
        console.error("Unexpected error during auth processing:", err);
        toast.error("Erro inesperado durante autenticação");
        setIsProcessingAuth(false);
        
        // Clean URL
        window.history.replaceState(null, document.title, window.location.pathname);
      }
    };
    
    // Only run this when the component mounts or when URL changes
    checkForAuthInUrl();
  }, [isProcessingAuth]);
  
  // Redirect if user is already authenticated
  useEffect(() => {
    if (!isLoading && !isProcessingAuth && user && session) {
      console.log("User already authenticated, redirecting to birth plan builder");
      // Use a direct location change for more reliable navigation
      window.location.href = '/criar-plano';
    }
  }, [user, isLoading, isProcessingAuth, session]);

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
