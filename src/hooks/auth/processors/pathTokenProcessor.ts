import { toast } from "sonner";
import { AuthUrlInfo, AuthProcessOptions } from "@/types/auth";
import { fixAuthTokenFormat } from "@/utils/auth/token";

/**
 * Process authentication tokens that come in the URL path
 * This handles both standard URLs and custom domain URLs
 */
export async function processPathToken(
  urlInfo: AuthUrlInfo,
  options: AuthProcessOptions
): Promise<boolean> {
  const { hasAuthInPath, fullUrl, path } = urlInfo;
  const { setIsProcessingAuth } = options;
  
  // Skip if there's no auth in path
  if (!hasAuthInPath) return false;
  
  console.log("PathTokenProcessor: Found auth parameters in URL path");
  setIsProcessingAuth(true);
  
  try {
    // Try to extract and fix the token format for proper processing
    const fixedToken = fixAuthTokenFormat(path, fullUrl);
    
    if (fixedToken) {
      console.log("PathTokenProcessor: Successfully extracted token from path");
      
      // Update URL to standard hash format that Supabase expects
      // Use a slight delay to ensure browser has time to process
      await new Promise(resolve => setTimeout(resolve, 300));
      
      // Get the domain from the URL so we maintain consistent references
      const domain = window.location.origin;
      const cleanPath = '/acesso-plano';
      
      // Replace state and update hash
      window.history.replaceState(
        null, 
        document.title,
        cleanPath + '#' + fixedToken
      );
      
      // Directly set the hash to ensure it's detected
      window.location.hash = fixedToken;
      
      console.log("PathTokenProcessor: URL updated with token in hash format");
      
      // Return true to indicate we processed the token
      return true;
    }
    
    // If we couldn't fix the token format, log and clean up
    console.error("PathTokenProcessor: Could not extract or fix auth token from path");
    toast.error("Formato de token inválido");
    setIsProcessingAuth(false);
    return false;
  } catch (error) {
    console.error("PathTokenProcessor: Error processing path token:", error);
    toast.error("Erro ao processar token de autenticação");
    setIsProcessingAuth(false);
    return false;
  }
}
