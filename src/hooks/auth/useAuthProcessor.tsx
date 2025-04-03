
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
    if (!hasAuthParameters(urlInfo) || isProcessingAuth) return;
    
    const processAuthentication = async () => {
      console.log("AuthProcessor: Auth parameters detected");
      setIsProcessingAuth(true);
      
      try {
        // Fix auth token format if needed
        if (urlInfo.hasAuthInPath) {
          await handlePathBasedToken(urlInfo.path, urlInfo.fullUrl);
        }
        
        // Handle error case
        if (urlInfo.hasError) {
          handleAuthenticationError(urlInfo.hash, urlInfo.search);
          return;
        }
        
        // Process the auth tokens based on their location
        await processTokensByLocation(urlInfo);
        
        // Verify session after processing
        await validateAndHandleSession();
      } catch (err) {
        console.error("AuthProcessor: Error processing authentication:", err);
        toast.error("Erro ao processar autenticação");
        setIsProcessingAuth(false);
        cleanUrlAfterAuth();
      }
    };
    
    processAuthentication();
  }, [urlInfo, isProcessingAuth]);

  return { isProcessingAuth };
}

/**
 * Check if URL contains authentication parameters
 */
function hasAuthParameters(urlInfo: ReturnType<typeof useAuthUrlDetection>): boolean {
  const { hasAuthInHash, hasAuthInSearch, hasAuthInPath, hasAuthInUrl } = urlInfo;
  return hasAuthInHash || hasAuthInSearch || hasAuthInPath || hasAuthInUrl;
}

/**
 * Fix token format for path-based auth tokens
 */
async function handlePathBasedToken(path: string, fullUrl: string): Promise<void> {
  console.log("AuthProcessor: Auth token in URL path - fixing format before processing");
  
  const tokenPart = fixAuthTokenFormat(path, fullUrl);
  
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

/**
 * Handle authentication errors
 */
function handleAuthenticationError(hash: string, search: string): void {
  const errorMessage = handleAuthError(hash, search) || "Erro desconhecido na autenticação";
  
  console.error("AuthProcessor: Authentication error:", errorMessage);
  toast.error("Erro na autenticação: " + errorMessage);
  setIsProcessingAuth(false);
  
  // Clean URL
  cleanUrlAfterAuth();
}

/**
 * Process tokens based on their location in the URL
 */
async function processTokensByLocation(urlInfo: ReturnType<typeof useAuthUrlDetection>): Promise<void> {
  const {
    hasAuthInHash,
    hasAuthInPath,
    hasAuthInSearch,
    hasAuthInUrl,
    fullUrl,
    search
  } = urlInfo;
  
  // Wait a bit to ensure everything is ready
  await new Promise(resolve => setTimeout(resolve, 800));
  
  // Process hash or path based tokens
  if (hasAuthInHash || hasAuthInPath) {
    await processHashOrPathToken(hasAuthInHash, hasAuthInPath, hasAuthInSearch, fullUrl, search);
  } 
  // Process search based tokens
  else if (hasAuthInSearch) {
    await processSearchToken(hasAuthInHash, hasAuthInPath, hasAuthInSearch, fullUrl, search);
  }
  // Process tokens in complex URL formats
  else if (hasAuthInUrl) {
    await processComplexUrlToken(fullUrl);
  }
}

/**
 * Process hash or path based tokens
 */
async function processHashOrPathToken(
  hasAuthInHash: boolean,
  hasAuthInPath: boolean,
  hasAuthInSearch: boolean,
  fullUrl: string,
  search: string
): Promise<void> {
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
    throw error;
  }
}

/**
 * Process search based tokens
 */
async function processSearchToken(
  hasAuthInHash: boolean,
  hasAuthInPath: boolean,
  hasAuthInSearch: boolean,
  fullUrl: string,
  search: string
): Promise<void> {
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
    throw error;
  }
}

/**
 * Process tokens in complex URL formats
 */
async function processComplexUrlToken(fullUrl: string): Promise<void> {
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
      throw error;
    }
  }
}

/**
 * Validate session and handle successful authentication
 */
async function validateAndHandleSession(): Promise<void> {
  // Check if we got a valid session
  const { data, error } = await supabase.auth.getSession();
  
  if (error) {
    console.error("AuthProcessor: Error getting session after processing:", error);
    toast.error("Erro ao obter sessão: " + error.message);
    setIsProcessingAuth(false);
    
    // Clean URL
    cleanUrlAfterAuth();
    throw error;
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
  } else {
    console.log("AuthProcessor: No session found after processing auth parameters");
    toast.error("Sessão não encontrada após autenticação");
    setIsProcessingAuth(false);
    
    // Clean URL
    cleanUrlAfterAuth();
  }
}
