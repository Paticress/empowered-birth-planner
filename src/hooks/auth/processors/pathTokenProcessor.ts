
import { AuthProcessOptions, AuthUrlInfo } from "@/types/auth";
import { fixAuthTokenFormat } from "@/utils/auth/tokenUtils";

/**
 * Processor for auth tokens in the URL path
 */
export async function processPathToken(
  urlInfo: AuthUrlInfo,
  options: AuthProcessOptions
): Promise<boolean> {
  if (!urlInfo.hasAuthInPath) return false;

  console.log("PathTokenProcessor: Auth token in URL path detected - fixing format before processing");
  
  const { path, fullUrl } = urlInfo;
  const tokenPart = fixAuthTokenFormat(path, fullUrl);
  
  if (tokenPart) {
    console.log("PathTokenProcessor: Successfully extracted token part from path");
    
    // Update the URL to use hash format for Supabase
    window.history.replaceState(
      null, 
      document.title,
      '/acesso-plano#' + tokenPart
    );
    
    // Set the hash directly as well to ensure it's detected
    window.location.hash = tokenPart;
    
    // Allow a moment for hash change to propagate
    await new Promise(resolve => setTimeout(resolve, 500));
    console.log("PathTokenProcessor: URL format fixed, token moved to hash format");
    return true;
  }
  
  console.log("PathTokenProcessor: Could not extract token from path", {path, fullUrl: fullUrl.includes('access_token') ? 'contains-token' : fullUrl});
  return false;
}
