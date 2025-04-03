
import { AuthProcessOptions, AuthUrlInfo } from "@/types/auth";
import { handleAuthError, cleanUrlAfterAuth } from "@/utils/auth/tokenUtils";
import { toast } from "sonner";

/**
 * Processor for error parameters in auth URLs
 */
export async function processAuthError(
  urlInfo: AuthUrlInfo,
  options: AuthProcessOptions
): Promise<boolean> {
  const { hasError, hash, search } = urlInfo;
  const { setIsProcessingAuth } = options;
  
  if (!hasError) return false;
  
  const errorMessage = handleAuthError(hash, search) || "Erro desconhecido na autenticação";
  
  console.error("ErrorProcessor: Authentication error:", errorMessage);
  toast.error("Erro na autenticação: " + errorMessage);
  setIsProcessingAuth(false);
  
  // Clean URL
  cleanUrlAfterAuth();
  
  return true;
}
