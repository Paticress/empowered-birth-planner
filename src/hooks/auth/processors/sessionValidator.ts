
import { supabase } from "@/integrations/supabase/client";
import { cleanUrlAfterAuth, ensureUserInDatabase } from "@/utils/auth/tokenUtils";
import { AuthProcessOptions } from "@/types/auth";
import { toast } from "sonner";

/**
 * Validates session after auth token processing and handles successful login
 */
export async function validateSession(options: AuthProcessOptions): Promise<void> {
  const { setIsProcessingAuth } = options;
  
  console.log("SessionValidator: Checking for valid session");
  
  // Check if we got a valid session
  const { data, error } = await supabase.auth.getSession();
  
  if (error) {
    console.error("SessionValidator: Error getting session:", error);
    toast.error("Erro ao obter sessão: " + error.message);
    setIsProcessingAuth(false);
    
    // Clean URL
    cleanUrlAfterAuth();
    throw error;
  }
  
  if (data.session) {
    console.log("SessionValidator: Authentication successful, session established");
    
    // Ensure user is in the database (for permissions)
    await ensureUserInDatabase(data.session.user);
    
    // Clean URL before showing success message
    cleanUrlAfterAuth();
    
    toast.success("Login realizado com sucesso!");
    
    // Short delay to allow toast to be seen
    setTimeout(() => {
      // Redirect to criar-plano page
      console.log("SessionValidator: Redirecting to criar-plano after successful auth");
      // Use direct location change to ensure clean navigation
      window.location.href = '/criar-plano';
    }, 1500);
  } else {
    console.log("SessionValidator: No session found after processing auth parameters");
    toast.error("Sessão não encontrada após autenticação");
    setIsProcessingAuth(false);
    
    // Clean URL
    cleanUrlAfterAuth();
  }
}
