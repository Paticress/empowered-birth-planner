
import { AuthUrlInfo } from "@/types/auth";
import { AuthProcessOptions } from "@/types/auth";
import { supabase } from "@/integrations/supabase/client";
import { cleanUrlAfterAuth } from "@/utils/auth/tokenUtils";
import { toast } from "sonner";

/**
 * Processes auth tokens that appear in complex URL formats
 * (e.g., when the token is in a format we don't specifically handle elsewhere)
 */
export async function processComplexUrlToken(
  urlInfo: AuthUrlInfo,
  options: AuthProcessOptions
): Promise<boolean> {
  const { setIsProcessingAuth } = options;
  
  if (!urlInfo.hasAuthInUrl) {
    return false;
  }
  
  console.log("ComplexUrlProcessor: Processing complex URL token format");
  
  try {
    // Try to extract token from full URL if other methods failed
    const fullUrl = window.location.href;
    const tokenIndex = fullUrl.indexOf('access_token=');
    
    if (tokenIndex === -1) {
      console.log("ComplexUrlProcessor: No access_token found in URL");
      return false;
    }
    
    // Create a hash fragment with just the token part
    const tokenPart = fullUrl.substring(tokenIndex);
    const hashFragment = '#' + tokenPart;
    
    console.log("ComplexUrlProcessor: Extracted token from complex URL");
    
    // Process the extracted token using exchangeCodeForSession
    const { data, error } = await supabase.auth.exchangeCodeForSession(hashFragment);
    
    if (error) {
      console.error("ComplexUrlProcessor: Error processing token:", error);
      toast.error("Erro ao processar token: " + error.message);
      setIsProcessingAuth(false);
      
      // Clean URL
      cleanUrlAfterAuth();
      return true; // We handled it, even though there was an error
    }
    
    console.log("ComplexUrlProcessor: Successfully processed complex URL token");
    return true; // Successfully handled
    
  } catch (err) {
    console.error("ComplexUrlProcessor: Exception processing token:", err);
    toast.error("Erro ao processar autenticação");
    setIsProcessingAuth(false);
    
    // Clean URL
    cleanUrlAfterAuth();
    return true; // We handled it, even though there was an error
  }
}
