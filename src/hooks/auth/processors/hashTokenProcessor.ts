
import { AuthProcessOptions, AuthUrlInfo } from "@/types/auth";
import { processAuthToken } from "@/utils/auth/tokenUtils";
import { toast } from "sonner";

/**
 * Processor for auth tokens in URL hash
 */
export async function processHashToken(
  urlInfo: AuthUrlInfo,
  options: AuthProcessOptions
): Promise<boolean> {
  const { hasAuthInHash, fullUrl, hash } = urlInfo;
  const { setIsProcessingAuth } = options;
  
  if (!hasAuthInHash) return false;
  
  console.log("HashTokenProcessor: Processing auth token from hash");
  
  try {
    // Process the token in the hash
    const { error } = await processAuthToken({
      hasAuthInHash: true,
      hasAuthInPath: false,
      hasAuthInSearch: false,
      fullUrl,
      search: "",
      hash
    });
    
    if (error) {
      console.error("HashTokenProcessor: Error processing hash token:", error);
      toast.error("Erro ao processar token: " + error.message);
      setIsProcessingAuth(false);
      return false;
    }
    
    console.log("HashTokenProcessor: Successfully processed hash token");
    return true;
  } catch (err) {
    console.error("HashTokenProcessor: Exception processing hash token:", err);
    toast.error("Erro inesperado ao processar autenticação");
    setIsProcessingAuth(false);
    return false;
  }
}
