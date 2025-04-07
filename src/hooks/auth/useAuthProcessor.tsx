
import { useState, useCallback } from 'react';
import { toast } from 'sonner';
import { extractTokenDebugInfo } from '@/utils/auth/token/debug';
import { AuthUrlInfo } from '@/types/auth';

// Import specialized processors
import { processHashToken } from './processors/hashTokenProcessor';
import { processSearchToken } from './processors/searchTokenProcessor';
import { processPathToken } from './processors/pathTokenProcessor';
import { processComplexUrlToken } from './processors/complexUrlProcessor';
import { processAuthError } from './processors/errorProcessor';
import { validateSession } from './processors/sessionValidator';

/**
 * Hook for processing authentication tokens in URLs
 */
export function useAuthProcessor() {
  const [isProcessingAuth, setIsProcessingAuth] = useState(false);
  const [debugInfo, setDebugInfo] = useState<any>({});

  // Process auth tokens from URL
  const processAuth = useCallback(async (urlInfo: AuthUrlInfo) => {
    // Already set state to avoid duplicate processing
    setIsProcessingAuth(true);
    
    // Debug logging
    console.log("Processing authentication with URL info:", {
      hasAuthInHash: urlInfo.hasAuthInHash,
      hasAuthInSearch: urlInfo.hasAuthInSearch,
      hasAuthInPath: urlInfo.hasAuthInPath,
      hash: urlInfo.hash ? urlInfo.hash.substring(0, 20) + '...' : 'none',
      search: urlInfo.search ? urlInfo.search.substring(0, 20) + '...' : 'none'
    });
    
    // Save debug info
    setDebugInfo({
      urlInfo,
      tokenInfo: extractTokenDebugInfo(),
      timestamp: new Date().toISOString()
    });
    
    // Create options object for processors
    const processorOptions = {
      setIsProcessingAuth
    };
    
    // Try to process with specialized processors in order of priority
    try {
      // Check for error parameters first
      if (await processAuthError(urlInfo, processorOptions)) {
        console.log("Auth error processed");
        return false;
      }
      
      // Process hash tokens (most common with magic links)
      if (await processHashToken(urlInfo, processorOptions)) {
        console.log("Hash token processed");
        return true;
      }
      
      // Process search query parameters
      if (await processSearchToken(urlInfo, processorOptions)) {
        console.log("Search token processed");
        return true;
      }
      
      // Process tokens in path
      if (await processPathToken(urlInfo, processorOptions)) {
        console.log("Path token processed");
        
        // After fixing the token format, validate the session
        await validateSession(processorOptions);
        return true;
      }
      
      // Process complex URL formats as a fallback
      if (await processComplexUrlToken(urlInfo, processorOptions)) {
        console.log("Complex URL token processed");
        return true;
      }
      
      // If all processors failed to handle the token
      console.error("All authentication methods failed");
      toast.error("Falha ao processar autenticação após tentar múltiplos métodos.");
      setIsProcessingAuth(false);
      return false;
      
    } catch (err) {
      console.error("Unexpected error processing authentication:", err);
      setDebugInfo(prev => ({
        ...prev,
        finalError: err instanceof Error ? err.message : String(err)
      }));
      toast.error("Erro inesperado durante autenticação");
      setIsProcessingAuth(false);
      return false;
    }
  }, []);

  return {
    isProcessingAuth,
    debugInfo,
    processAuth,
    setIsProcessingAuth
  };
}
