
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { 
  processAuthToken, 
  fixAuthTokenFormat, 
  extractTokenFromUrl, 
  handleAuthError,
  ensureUserInDatabase,
  cleanUrlAfterAuth
} from "@/utils/auth/tokenUtils";
import { useAuthUrlDetection } from "./useAuthUrlDetection";

/**
 * Hook to process authentication from URL parameters (magic links)
 */
export function useAuthProcessor() {
  const [isProcessingAuth, setIsProcessingAuth] = useState(false);
  const urlInfo = useAuthUrlDetection();

  useEffect(() => {
    const processAuth = async () => {
      // Only process if we have auth parameters and are not already processing
      const { 
        hasAuthInHash, 
        hasAuthInSearch, 
        hasAuthInPath, 
        hasAuthInUrl,
        hasError,
        fullUrl,
        hash,
        search,
        path
      } = urlInfo;
      
      if ((hasAuthInHash || hasAuthInSearch || hasAuthInPath || hasAuthInUrl) && !isProcessingAuth) {
        console.log("AuthProcessor: Auth parameters detected");
        
        setIsProcessingAuth(true);
        
        try {
          // If auth params are in the wrong place (path), fix them
          if (hasAuthInPath) {
            console.log("AuthProcessor: Auth token in URL path - fixing format before processing");
            
            // Extract token and other params - handle different URL formats
            const tokenPart = fixAuthTokenFormat(path, fullUrl);
            
            // Fix the URL without reloading
            if (tokenPart) {
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
          }
          
          // Handle error case first
          if (hasError) {
            const errorMessage = handleAuthError(hash, search) || "Erro desconhecido na autenticação";
            
            console.error("AuthProcessor: Authentication error:", errorMessage);
            toast.error("Erro na autenticação: " + errorMessage);
            setIsProcessingAuth(false);
            
            // Clean URL
            cleanUrlAfterAuth();
            return;
          }
          
          // Process the authentication - wait a bit to ensure everything is ready
          await new Promise(resolve => setTimeout(resolve, 800));
          
          // Process tokens based on their location
          if (hasAuthInHash || hasAuthInPath) {
            const { error } = await processAuthToken({ 
              hasAuthInHash, 
              hasAuthInPath, 
              hasAuthInSearch, 
              fullUrl, 
              search 
            });
            
            if (error) {
              console.error("AuthProcessor: Error processing token:", error);
              toast.error("Erro ao processar token: " + error.message);
              setIsProcessingAuth(false);
              
              // Clean URL
              cleanUrlAfterAuth();
              return;
            }
          } 
          else if (hasAuthInSearch) {
            const { error } = await processAuthToken({ 
              hasAuthInHash, 
              hasAuthInPath, 
              hasAuthInSearch, 
              fullUrl, 
              search 
            });
            
            if (error) {
              console.error("AuthProcessor: Error processing token:", error);
              toast.error("Erro ao processar token: " + error.message);
              setIsProcessingAuth(false);
              
              // Clean URL
              cleanUrlAfterAuth();
              return;
            }
          }
          // For token in URL but not in hash or search
          else if (hasAuthInUrl) {
            console.log("AuthProcessor: Auth token in complex URL format");
            
            // Extract token
            const tokenPart = extractTokenFromUrl(fullUrl);
            
            if (tokenPart) {
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
                console.error("AuthProcessor: Error processing complex token:", error);
                toast.error("Erro ao processar token: " + error.message);
                setIsProcessingAuth(false);
                
                // Clean URL
                cleanUrlAfterAuth();
                return;
              }
            }
          }
          
          // Now check if we got a valid session
          const { data, error } = await supabase.auth.getSession();
          
          if (error) {
            console.error("AuthProcessor: Error getting session after processing:", error);
            toast.error("Erro ao obter sessão: " + error.message);
            setIsProcessingAuth(false);
            
            // Clean URL
            cleanUrlAfterAuth();
            return;
          }
          
          if (data.session) {
            console.log("AuthProcessor: Authentication successful, session established");
            
            // Ensure user is in the database (for permissions)
            await ensureUserInDatabase(data.session.user);
            
            // Clean URL before showing success message
            cleanUrlAfterAuth();
            
            toast.success("Login realizado com sucesso!");
            
            // Short delay to allow toast to be seen
            setTimeout(() => {
              // Redirect to criar-plano page
              console.log("AuthProcessor: Redirecting to criar-plano after successful auth");
              // Use direct location change to ensure clean navigation
              window.location.href = '/criar-plano';
            }, 1500);
            return;
          } else {
            console.log("AuthProcessor: No session found after processing auth parameters");
            toast.error("Sessão não encontrada após autenticação");
            setIsProcessingAuth(false);
            
            // Clean URL
            cleanUrlAfterAuth();
          }
        } catch (err) {
          console.error("AuthProcessor: Error processing authentication:", err);
          toast.error("Erro ao processar autenticação");
          setIsProcessingAuth(false);
          
          // Clean URL
          cleanUrlAfterAuth();
        }
      }
    };
    
    processAuth();
  }, [urlInfo, isProcessingAuth]);

  return { isProcessingAuth };
}
