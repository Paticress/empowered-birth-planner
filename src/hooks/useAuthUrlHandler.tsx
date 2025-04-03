
import { useAuthProcessor } from "./auth/useAuthProcessor";

/**
 * Main hook that handles authentication URL processing
 * This is a wrapper around the more specific hooks to maintain backward compatibility
 */
export function useAuthUrlHandler() {
  const { isProcessingAuth } = useAuthProcessor();
  
  return { isProcessingAuth };
}
