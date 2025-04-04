
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { useAuthUrlDetection } from "./useAuthUrlDetection";
import { hasAuthParameters } from "./utils/authUrlUtils";
import { processAuthError } from "./processors/errorProcessor";
import { processPathToken } from "./processors/pathTokenProcessor";
import { processHashToken } from "./processors/hashTokenProcessor";
import { processSearchToken } from "./processors/searchTokenProcessor";
import { processComplexUrlToken } from "./processors/complexUrlProcessor";
import { validateSession } from "./processors/sessionValidator";

/**
 * Hook to process authentication from URL parameters (magic links)
 */
export function useAuthProcessor() {
  const [isProcessingAuth, setIsProcessingAuth] = useState(false);
  const urlInfo = useAuthUrlDetection();

  useEffect(() => {
    // Prevent running if already processing or no auth parameters
    if (!hasAuthParameters(urlInfo) || isProcessingAuth) return;
    
    const processAuthentication = async () => {
      console.log("AuthProcessor: Auth parameters detected, starting processing");
      setIsProcessingAuth(true);
      
      try {
        // Enhanced logging
        console.log("AuthProcessor: Auth URL info:", {
          hasAuthInHash: urlInfo.hasAuthInHash,
          hasAuthInSearch: urlInfo.hasAuthInSearch,
          hasAuthInPath: urlInfo.hasAuthInPath,
          hasAuthInUrl: urlInfo.hasAuthInUrl,
          path: urlInfo.path
        });
        
        // Process auth parameters in sequence, stopping if any processor handles them
        
        // 1. Check for errors first
        const errorHandled = await processAuthError(urlInfo, { setIsProcessingAuth });
        if (errorHandled) {
          console.log("AuthProcessor: Error was handled, stopping further processing");
          return;
        }
        
        // 2. Fix path-based tokens (important to run this before hash processing)
        const pathFixed = await processPathToken(urlInfo, { setIsProcessingAuth });
        if (pathFixed) {
          console.log("AuthProcessor: Path token was fixed, now will verify session");
          // Path processing moves token to hash format but doesn't process it
          // We need to verify the session after a short delay to let Supabase process the hash
          await new Promise(resolve => setTimeout(resolve, 800));
          await validateSession({ setIsProcessingAuth });
          return;
        }
        
        // 3. Try to process the token based on its location
        const hashHandled = await processHashToken(urlInfo, { setIsProcessingAuth });
        if (hashHandled) {
          console.log("AuthProcessor: Hash token was processed successfully");
          // If hash token was processed, verify session
          await validateSession({ setIsProcessingAuth });
          return;
        }
        
        const searchHandled = await processSearchToken(urlInfo, { setIsProcessingAuth });
        if (searchHandled) {
          console.log("AuthProcessor: Search token was processed successfully");
          // If search token was processed, verify session
          await validateSession({ setIsProcessingAuth });
          return;
        }
        
        const complexUrlHandled = await processComplexUrlToken(urlInfo, { setIsProcessingAuth });
        if (complexUrlHandled) {
          console.log("AuthProcessor: Complex URL token was processed successfully");
          // If complex URL token was processed, verify session
          await validateSession({ setIsProcessingAuth });
          return;
        }
        
        // If we reached here, no processor handled the token
        console.log("AuthProcessor: No matching processor for the auth parameters");
        toast.error("Não foi possível processar o token de autenticação");
        setIsProcessingAuth(false);
        
      } catch (err) {
        console.error("AuthProcessor: Error processing authentication:", err);
        toast.error("Erro ao processar autenticação");
        setIsProcessingAuth(false);
      }
    };
    
    processAuthentication();
  }, [urlInfo, isProcessingAuth]);

  return { isProcessingAuth };
}
