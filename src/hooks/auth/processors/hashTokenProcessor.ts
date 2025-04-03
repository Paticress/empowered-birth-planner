
import { supabase } from "@/integrations/supabase/client";
import { processAuthToken } from "@/utils/auth/tokenUtils";
import { AuthProcessOptions, AuthUrlInfo } from "@/types/auth";
import { toast } from "sonner";

/**
 * Processor for auth tokens in the URL hash
 */
export async function processHashToken(
  urlInfo: AuthUrlInfo,
  options: AuthProcessOptions
): Promise<boolean> {
  const { hasAuthInHash, hasAuthInPath, hasAuthInSearch, fullUrl, search } = urlInfo;
  
  if (!hasAuthInHash) return false;
  
  console.log("HashTokenProcessor: Processing auth token from hash");
  
  try {
    const { error } = await processAuthToken({ 
      hasAuthInHash, 
      hasAuthInPath, 
      hasAuthInSearch, 
      fullUrl, 
      search 
    });
    
    if (error) {
      console.error("HashTokenProcessor: Error processing token:", error);
      toast.error("Erro ao processar token: " + error.message);
      throw error;
    }
    
    return true;
  } catch (error) {
    console.error("HashTokenProcessor: Error:", error);
    return false;
  }
}
