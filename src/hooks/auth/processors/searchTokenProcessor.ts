
import { AuthUrlInfo } from "@/types/auth";
import { AuthProcessOptions } from "@/types/auth";
import { supabase } from "@/integrations/supabase/client";
import { cleanUrlAfterAuth } from "@/utils/auth/tokenUtils";
import { toast } from "sonner";

/**
 * Processes authentication tokens found in the URL search parameters
 */
export async function processSearchToken(
  urlInfo: AuthUrlInfo,
  options: AuthProcessOptions
): Promise<boolean> {
  const { setIsProcessingAuth } = options;
  
  if (!urlInfo.hasAuthInSearch) {
    return false;
  }
  
  console.log("SearchTokenProcessor: Processing token in URL search parameters");
  
  try {
    // For search parameters, we need to convert them to a hash format
    const search = window.location.search;
    const tokenIndex = search.indexOf('access_token=');
    
    if (tokenIndex === -1) {
      console.log("SearchTokenProcessor: No access_token found in search params");
      return false;
    }
    
    // Extract just the token part and create a hash fragment
    const tokenPart = search.substring(tokenIndex);
    const hashFragment = '#' + tokenPart.replace(/^\?/, ''); // Remove leading ? if present
    
    console.log("SearchTokenProcessor: Converting search params to hash format");
    
    // Process the hash fragment using exchangeCodeForSession
    const { data, error } = await supabase.auth.exchangeCodeForSession(hashFragment);
    
    if (error) {
      console.error("SearchTokenProcessor: Error processing search token:", error);
      toast.error("Erro ao processar token: " + error.message);
      setIsProcessingAuth(false);
      
      // Clean URL
      cleanUrlAfterAuth();
      return true; // We handled it, even though there was an error
    }
    
    console.log("SearchTokenProcessor: Successfully processed search token");
    return true; // Successfully handled
    
  } catch (err) {
    console.error("SearchTokenProcessor: Exception processing search token:", err);
    toast.error("Erro ao processar autenticação");
    setIsProcessingAuth(false);
    
    // Clean URL
    cleanUrlAfterAuth();
    return true; // We handled it, even though there was an error
  }
}
