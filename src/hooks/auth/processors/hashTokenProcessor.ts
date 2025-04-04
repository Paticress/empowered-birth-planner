
import { AuthUrlInfo } from "../useAuthUrlDetection";
import { AuthProcessOptions } from "@/types/auth";
import { supabase } from "@/integrations/supabase/client";
import { cleanUrlAfterAuth } from "@/utils/auth/tokenUtils";
import { toast } from "sonner";

/**
 * Processes authentication tokens found in the URL hash
 */
export async function processHashToken(
  urlInfo: AuthUrlInfo,
  options: AuthProcessOptions
): Promise<boolean> {
  const { setIsProcessingAuth } = options;
  
  if (!urlInfo.hasAuthInHash) {
    return false;
  }
  
  console.log("HashTokenProcessor: Processing token in URL hash");
  
  try {
    // Use updated Supabase method to exchange the code for a session
    const { data, error } = await supabase.auth.exchangeCodeForSession(
      window.location.hash
    );
    
    if (error) {
      console.error("HashTokenProcessor: Error processing hash token:", error);
      toast.error("Erro ao processar token: " + error.message);
      setIsProcessingAuth(false);
      
      // Clean URL
      cleanUrlAfterAuth();
      return true; // We handled it, even though there was an error
    }
    
    console.log("HashTokenProcessor: Successfully processed hash token");
    return true; // Successfully handled
    
  } catch (err) {
    console.error("HashTokenProcessor: Exception processing hash token:", err);
    toast.error("Erro ao processar autenticação");
    setIsProcessingAuth(false);
    
    // Clean URL
    cleanUrlAfterAuth();
    return true; // We handled it, even though there was an error
  }
}
