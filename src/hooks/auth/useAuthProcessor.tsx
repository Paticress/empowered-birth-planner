
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
    if (!hasAuthParameters(urlInfo) || isProcessingAuth) return;
    
    const processAuthentication = async () => {
      console.log("AuthProcessor: Auth parameters detected");
      setIsProcessingAuth(true);
      
      try {
        // Process auth parameters in sequence, stopping if any processor handles them
        
        // 1. Check for errors first
        const errorHandled = await processAuthError(urlInfo, { setIsProcessingAuth });
        if (errorHandled) return;
        
        // 2. Fix path-based tokens
        await processPathToken(urlInfo, { setIsProcessingAuth });
        
        // 3. Try to process the token based on its location
        const hashHandled = await processHashToken(urlInfo, { setIsProcessingAuth });
        if (hashHandled) {
          // If hash token was processed, verify session
          await validateSession({ setIsProcessingAuth });
          return;
        }
        
        const searchHandled = await processSearchToken(urlInfo, { setIsProcessingAuth });
        if (searchHandled) {
          // If search token was processed, verify session
          await validateSession({ setIsProcessingAuth });
          return;
        }
        
        const complexUrlHandled = await processComplexUrlToken(urlInfo, { setIsProcessingAuth });
        if (complexUrlHandled) {
          // If complex URL token was processed, verify session
          await validateSession({ setIsProcessingAuth });
          return;
        }
        
        // If we reached here, no processor handled the token
        console.log("AuthProcessor: No matching processor for the auth parameters");
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
