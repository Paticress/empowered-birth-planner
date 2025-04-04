
import { processAuthToken } from "@/utils/auth/tokenUtils";
import { AuthProcessOptions, AuthUrlInfo } from "@/types/auth";
import { toast } from "sonner";

/**
 * Processor for auth tokens in URL search params
 */
export async function processSearchToken(
  urlInfo: AuthUrlInfo,
  options: AuthProcessOptions
): Promise<boolean> {
  const { hasAuthInHash, hasAuthInPath, hasAuthInSearch, fullUrl, search, hash } = urlInfo;
  
  if (!hasAuthInSearch) return false;
  
  console.log("SearchTokenProcessor: Processing auth token from search parameters");
  
  try {
    const { error } = await processAuthToken({ 
      hasAuthInHash, 
      hasAuthInPath, 
      hasAuthInSearch, 
      fullUrl, 
      search,
      hash 
    });
    
    if (error) {
      console.error("SearchTokenProcessor: Error processing token:", error);
      toast.error("Erro ao processar token: " + error.message);
      throw error;
    }
    
    return true;
  } catch (error) {
    console.error("SearchTokenProcessor: Error:", error);
    return false;
  }
}
