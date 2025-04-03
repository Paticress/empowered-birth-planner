
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

  console.log("PathTokenProcessor: Auth token in URL path - fixing format before processing");
  
  const { path, fullUrl } = urlInfo;
  const tokenPart = fixAuthTokenFormat(path, fullUrl);
  
  if (tokenPart) {
    // Update the URL to use hash format for proper processing
    window.history.replaceState(
      null, 
      document.title,
      '/acesso-plano#' + tokenPart
    );
    
    // Set auth in hash for subsequent processing
    window.location.hash = tokenPart;
    
    // Allow a moment for hash change to propagate
    await new Promise(resolve => setTimeout(resolve, 300));
    return true;
  }
  
  return false;
}
