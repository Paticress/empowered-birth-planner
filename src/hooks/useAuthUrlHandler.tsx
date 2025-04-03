
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";

export function useAuthUrlHandler() {
  const [isProcessingAuth, setIsProcessingAuth] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const checkForAuthInUrl = async () => {
      try {
        // Check all possible locations for auth tokens
        const fullUrl = window.location.href;
        const hash = window.location.hash;
        const search = window.location.search;
        const path = window.location.pathname;
        
        // Enhanced logging for better debugging
        console.log("AuthUrlHandler: Page loaded, URL check:", { 
          path: path,
          fullUrl: fullUrl.includes('access_token=') ? 'contains-token' : 'normal',
          hash: hash ? hash.substring(0, Math.min(20, hash.length)) + '...' : 'none',
          search: search ? search.substring(0, Math.min(20, search.length)) + '...' : 'none'
        });
        
        // Detect auth parameters in all possible locations
        const hasAuthInHash = hash && hash.includes('access_token=');
        const hasAuthInSearch = search && search.includes('access_token=');
        const hasAuthInPath = path.includes('access_token=');
        const hasAuthInUrl = fullUrl.includes('access_token=');
        const hasError = (hash && hash.includes('error=')) || 
                        (search && search.includes('error=')) || 
                        (path.includes('error='));
        
        // Only process if we have auth parameters and are not already processing
        if ((hasAuthInHash || hasAuthInSearch || hasAuthInPath || (hasAuthInUrl && !hasAuthInHash && !hasAuthInSearch && !hasAuthInPath)) && !isProcessingAuth) {
          console.log("AuthUrlHandler: Auth parameters detected");
          
          setIsProcessingAuth(true);
          
          // If auth params are in the wrong place (path), fix them
          if (hasAuthInPath) {
            console.log("AuthUrlHandler: Auth token in URL path - fixing format before processing");
            
            // Extract token and other params
            const tokenPart = path.substring(path.indexOf('access_token='));
            
            // Fix the URL without reloading
            window.history.replaceState(
              null, 
              document.title,
              '/acesso-plano#' + tokenPart
            );
            
            // Now set auth in hash for subsequent processing
            window.location.hash = tokenPart;
            
            // Allow a moment for hash change to propagate
            await new Promise(resolve => setTimeout(resolve, 300));
          }
          
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
              console.error("AuthUrlHandler: Error parsing error message:", e);
            }
            
            console.error("AuthUrlHandler: Authentication error:", errorMessage);
            toast.error("Erro na autenticação: " + errorMessage);
            setIsProcessingAuth(false);
            
            // Clean URL
            window.history.replaceState(null, document.title, window.location.pathname);
            return;
          }
          
          // Process the authentication - wait a bit to ensure everything is ready
          await new Promise(resolve => setTimeout(resolve, 800));
          
          try {
            // For hash-based tokens (most common with magic links)
            if (hasAuthInHash) {
              console.log("AuthUrlHandler: Processing auth token from hash");
              
              // For supabase magic links, we need to let Supabase handle it directly
              const { data, error } = await supabase.auth.getSession();
              
              if (error) {
                console.error("AuthUrlHandler: Error getting session from hash:", error);
                toast.error("Erro ao processar magic link: " + error.message);
                setIsProcessingAuth(false);
                
                // Clean URL
                window.history.replaceState(null, document.title, window.location.pathname);
                return;
              }
            } 
            // For query parameter tokens
            else if (hasAuthInSearch) {
              console.log("AuthUrlHandler: Processing auth token from query parameters");
              
              // Extract token
              const params = new URLSearchParams(search);
              const token = params.get('access_token');
              
              if (token) {
                // Update the URL to use hash format for Supabase
                window.history.replaceState(
                  null, 
                  document.title,
                  '/acesso-plano#access_token=' + token
                );
                
                // Let Supabase process the hash-based token
                await new Promise(resolve => setTimeout(resolve, 500));
                
                const { error } = await supabase.auth.getSession();
                if (error) {
                  console.error("AuthUrlHandler: Error processing token:", error);
                  toast.error("Erro ao processar token: " + error.message);
                  setIsProcessingAuth(false);
                  
                  // Clean URL
                  window.history.replaceState(null, document.title, window.location.pathname);
                  return;
                }
              } else {
                console.error("AuthUrlHandler: No token found in query parameters");
                toast.error("Token de autenticação não encontrado");
                setIsProcessingAuth(false);
                
                // Clean URL
                window.history.replaceState(null, document.title, window.location.pathname);
                return;
              }
            }
            // For token in URL but not in hash or search
            else if (hasAuthInUrl && !hasAuthInHash && !hasAuthInSearch && !hasAuthInPath) {
              console.log("AuthUrlHandler: Auth token in complex URL format");
              
              // Extract token
              const tokenIndex = fullUrl.indexOf('access_token=');
              if (tokenIndex !== -1) {
                const tokenPart = fullUrl.substring(tokenIndex);
                
                // Update the URL to use hash format for Supabase
                window.history.replaceState(
                  null, 
                  document.title,
                  '/acesso-plano#' + tokenPart
                );
                
                // Let Supabase process the hash-based token
                await new Promise(resolve => setTimeout(resolve, 500));
                
                const { error } = await supabase.auth.getSession();
                if (error) {
                  console.error("AuthUrlHandler: Error processing complex token:", error);
                  toast.error("Erro ao processar token: " + error.message);
                  setIsProcessingAuth(false);
                  
                  // Clean URL
                  window.history.replaceState(null, document.title, window.location.pathname);
                  return;
                }
              }
            }
            
            // Now check if we got a valid session
            const { data, error } = await supabase.auth.getSession();
            
            if (error) {
              console.error("AuthUrlHandler: Error getting session after processing:", error);
              toast.error("Erro ao obter sessão: " + error.message);
              setIsProcessingAuth(false);
              
              // Clean URL
              window.history.replaceState(null, document.title, window.location.pathname);
              return;
            }
            
            if (data.session) {
              console.log("AuthUrlHandler: Authentication successful, session established");
              
              // Ensure user is in the database (for permissions)
              try {
                if (data.session.user?.email) {
                  const email = data.session.user.email;
                  
                  // Add/update user in database
                  const { error: insertError } = await supabase
                    .from('users_db_birthplanbuilder')
                    .upsert({ email }, { onConflict: 'email' });
                    
                  if (insertError) {
                    console.error("AuthUrlHandler: Error adding user to database:", insertError);
                    // Continue anyway - this shouldn't block login
                  } else {
                    console.log("AuthUrlHandler: User added/updated in the database");
                  }
                }
              } catch (dbError) {
                console.error("AuthUrlHandler: Database error:", dbError);
                // Continue anyway - database error shouldn't block login
              }
              
              // Clean URL before showing success message
              window.history.replaceState(null, document.title, window.location.pathname);
              
              toast.success("Login realizado com sucesso!");
              
              // Short delay to allow toast to be seen
              setTimeout(() => {
                // Redirect to criar-plano page
                console.log("AuthUrlHandler: Redirecting to criar-plano after successful auth");
                // Use direct location change to ensure clean navigation
                window.location.href = '/criar-plano';
              }, 1500);
              return;
            } else {
              console.log("AuthUrlHandler: No session found after processing auth parameters");
              toast.error("Sessão não encontrada após autenticação");
              setIsProcessingAuth(false);
              
              // Clean URL
              window.history.replaceState(null, document.title, window.location.pathname);
            }
          } catch (err) {
            console.error("AuthUrlHandler: Error processing authentication:", err);
            toast.error("Erro ao processar autenticação");
            setIsProcessingAuth(false);
            
            // Clean URL
            window.history.replaceState(null, document.title, window.location.pathname);
          }
        }
      } catch (err) {
        console.error("AuthUrlHandler: Unexpected error during auth processing:", err);
        toast.error("Erro inesperado durante autenticação");
        setIsProcessingAuth(false);
        
        // Clean URL
        window.history.replaceState(null, document.title, window.location.pathname);
      }
    };
    
    // Run auth check on component mount
    checkForAuthInUrl();
  }, [isProcessingAuth, navigate]);

  return { isProcessingAuth };
}
