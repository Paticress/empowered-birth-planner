
import { supabase } from "@/integrations/supabase/client";
import { extractTokenFromUrl } from "@/utils/auth/tokenUtils";
import { AuthProcessOptions, AuthUrlInfo } from "@/types/auth";
import { toast } from "sonner";

/**
 * Processor for auth tokens in complex URL formats
 */
export async function processComplexUrlToken(
  urlInfo: AuthUrlInfo,
  options: AuthProcessOptions
): Promise<boolean> {
  const { hasAuthInUrl, fullUrl } = urlInfo;
  
  if (!hasAuthInUrl) return false;
  
  console.log("ComplexUrlProcessor: Auth token in complex URL format");
  
  try {
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
        console.error("ComplexUrlProcessor: Error processing token:", error);
        toast.error("Erro ao processar token: " + error.message);
        throw error;
      }
      
      return true;
    }
    
    return false;
  } catch (error) {
    console.error("ComplexUrlProcessor: Error:", error);
    return false;
  }
}
