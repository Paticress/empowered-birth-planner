
import { AuthUrlInfo } from "@/types/auth";
import { AuthProcessOptions } from "@/types/auth";
import { supabase } from "@/integrations/supabase/client";
import { cleanUrlAfterAuth } from "@/utils/auth/token";
import { toast } from "sonner";
import { extractTokenFromUrl } from "@/utils/auth/token";

/**
 * Processes authentication tokens found in complex URL formats
 * This is a fallback processor for unusual token placements
 */
export async function processComplexUrlToken(
  urlInfo: AuthUrlInfo,
  options: AuthProcessOptions
): Promise<boolean> {
  const { hasAuthInUrl, fullUrl } = urlInfo;
  const { setIsProcessingAuth } = options;
  
  if (!hasAuthInUrl) {
    return false;
  }
  
  console.log("ComplexUrlProcessor: Processing token in complex URL format");
  
  try {
    // Extract token from URL using utility function
    const tokenPart = extractTokenFromUrl(fullUrl);
    
    if (!tokenPart) {
      console.log("ComplexUrlProcessor: No token found in URL");
      return false;
    }
    
    console.log("ComplexUrlProcessor: Found token in complex URL format");
    console.log("Token part (first 20 chars):", tokenPart.substring(0, 20) + "...");
    
    // Convert to a standard URL format that Supabase expects
    const standardizedUrl = window.location.origin + '/auth/callback#' + tokenPart;
    console.log("ComplexUrlProcessor: Standardized URL format:", standardizedUrl.substring(0, 50) + "...");
    
    // Process the standardized URL with Supabase
    const { data, error } = await supabase.auth.exchangeCodeForSession(standardizedUrl);
    
    if (error) {
      console.error("ComplexUrlProcessor: Error processing complex URL token:", error);
      toast.error("Erro ao processar token: " + error.message);
      setIsProcessingAuth(false);
      
      // Clean URL
      cleanUrlAfterAuth();
      return true; // We handled it, even though there was an error
    }
    
    if (data.session) {
      console.log("ComplexUrlProcessor: Successfully processed complex URL token");
      
      // Store authentication information in localStorage for backup
      localStorage.setItem('birthPlanLoggedIn', 'true');
      localStorage.setItem('birthPlanEmail', data.session.user.email || '');
      
      toast.success("Login realizado com sucesso!");
      
      // Clean up URL after successful authentication
      cleanUrlAfterAuth();
      
      // Redirect to criar-plano
      setTimeout(() => {
        console.log("ComplexUrlProcessor: Redirecting to criar-plano after successful auth");
        window.location.href = '/criar-plano';
      }, 1500);
    } else {
      console.log("ComplexUrlProcessor: No session returned after processing token");
      toast.error("Falha ao processar autenticação. Tente novamente.");
      setIsProcessingAuth(false);
      
      // Clean URL
      cleanUrlAfterAuth();
    }
    
    return true; // Successfully handled
    
  } catch (err) {
    console.error("ComplexUrlProcessor: Exception processing complex URL token:", err);
    toast.error("Erro ao processar autenticação");
    setIsProcessingAuth(false);
    
    // Clean URL
    cleanUrlAfterAuth();
    return true; // We handled it, even though there was an error
  }
}
