
import { AuthUrlInfo } from "@/types/auth";
import { AuthProcessOptions } from "@/types/auth";
import { supabase } from "@/integrations/supabase/client";
import { cleanUrlAfterAuth } from "@/utils/auth/token";
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
    // For search parameters with magic links or access tokens
    const search = window.location.search;
    
    // Handle both standard access_token and magic link parameters
    const hasMagicLink = search.includes('access_entry=magiclink');
    const hasAccessToken = search.includes('access_token=');
    
    if (!hasMagicLink && !hasAccessToken) {
      console.log("SearchTokenProcessor: No access_token or magic link found in search params");
      return false;
    }
    
    console.log("SearchTokenProcessor: Using exchangeCodeForSession with current URL directly");
    
    // Pass the entire URL when calling exchangeCodeForSession for best compatibility
    const { data, error } = await supabase.auth.exchangeCodeForSession(window.location.href);
    
    if (error) {
      console.error("SearchTokenProcessor: Error processing search token:", error);
      console.error("Error details:", error.message, error.status);
      toast.error("Erro ao processar token: " + error.message);
      setIsProcessingAuth(false);
      
      // Clean URL
      cleanUrlAfterAuth();
      return true; // We handled it, even though there was an error
    }
    
    console.log("SearchTokenProcessor: Successfully processed search token");
    
    // If we have a valid session, clean up the URL
    if (data.session) {
      console.log("SearchTokenProcessor: Valid session created");
      cleanUrlAfterAuth();
    } else {
      console.log("SearchTokenProcessor: No session created from token");
    }
    
    return true; // Successfully handled
    
  } catch (err) {
    console.error("SearchTokenProcessor: Exception processing search token:", err);
    console.error("Error type:", typeof err, "Error object:", JSON.stringify(err, Object.getOwnPropertyNames(err)));
    toast.error("Erro ao processar autenticação");
    setIsProcessingAuth(false);
    
    // Clean URL
    cleanUrlAfterAuth();
    return true; // We handled it, even though there was an error
  }
}
