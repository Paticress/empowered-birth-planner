
import { AuthUrlInfo } from "@/types/auth";
import { AuthProcessOptions } from "@/types/auth";
import { supabase } from "@/integrations/supabase/client";
import { cleanUrlAfterAuth } from "@/utils/auth/token";
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
    // Check if the hash includes magiclink type
    const isMagicLink = urlInfo.hash.includes('type=magiclink');
    console.log("Is magic link token:", isMagicLink);
    
    // Show loading toast
    toast.loading("Autenticando...");
    
    // Use getSession first to check if the token has already been processed
    const { data: sessionData } = await supabase.auth.getSession();
    
    if (sessionData.session) {
      console.log("HashTokenProcessor: Session already exists, using existing session");
      
      // Store authentication information in localStorage for backup
      localStorage.setItem('birthPlanLoggedIn', 'true');
      localStorage.setItem('birthPlanEmail', sessionData.session.user.email || '');
      
      toast.success("Login realizado com sucesso!");
      
      // Clean up URL after successful authentication
      cleanUrlAfterAuth();
      
      // Short delay before redirecting to allow toast to be seen
      setTimeout(() => {
        console.log("HashTokenProcessor: Redirecting to criar-plano after successful auth");
        window.location.href = '/criar-plano';
      }, 1500);
      
      return true;
    }
    
    // If no session found, exchange the code in the URL for a session
    console.log("HashTokenProcessor: No existing session, exchanging code for session");
    const fullUrl = window.location.href;
    const { data, error } = await supabase.auth.exchangeCodeForSession(fullUrl);
    
    if (error) {
      console.error("HashTokenProcessor: Error processing hash token:", error);
      console.error("Error details:", error.message, error.status);
      toast.error("Erro ao processar token: " + error.message);
      setIsProcessingAuth(false);
      
      // Clean URL
      cleanUrlAfterAuth();
      return true; // We handled it, even though there was an error
    }
    
    if (data.session) {
      console.log("HashTokenProcessor: Successfully processed hash token and created session");
      console.log("User email:", data.session.user.email);
      
      // Store authentication information in localStorage for backup
      localStorage.setItem('birthPlanLoggedIn', 'true');
      localStorage.setItem('birthPlanEmail', data.session.user.email || '');
      
      toast.success("Login realizado com sucesso!");
      
      // Clean up URL after successful authentication
      cleanUrlAfterAuth();
      
      // Short delay before redirecting to allow toast to be seen
      setTimeout(() => {
        console.log("HashTokenProcessor: Redirecting to criar-plano after successful auth");
        window.location.href = '/criar-plano';
      }, 1500);
    } else {
      console.log("HashTokenProcessor: No session returned after processing token");
      toast.error("Falha ao processar autenticação. Tente novamente.");
      setIsProcessingAuth(false);
      
      // Clean URL
      cleanUrlAfterAuth();
    }
    
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
