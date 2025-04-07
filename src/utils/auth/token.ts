
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

/**
 * Extracts session from URL parameters using the correct Supabase API
 * This replaces the now unavailable getSessionFromUrl() method
 */
export const getSessionFromUrl = async () => {
  try {
    // Check if we have hash params from a redirect
    const hasHashParams = window.location.hash && 
      (window.location.hash.includes('access_token=') || 
       window.location.hash.includes('refresh_token='));
       
    if (hasHashParams) {
      // Extract hash without the '#' symbol
      const hashParams = window.location.hash.substring(1);
      console.log("Processing hash params for auth");
      
      // Use setSession method which properly handles the tokens
      const { data, error } = await supabase.auth.setSession({
        access_token: extractParamFromQuery(hashParams, 'access_token'),
        refresh_token: extractParamFromQuery(hashParams, 'refresh_token')
      });
      
      return { data, error };
    } else if (window.location.search && window.location.search.includes('code=')) {
      // Handle authorization code flow
      console.log("Processing authorization code for auth");
      const { data, error } = await supabase.auth.exchangeCodeForSession(
        extractParamFromQuery(window.location.search, 'code')
      );
      
      return { data, error };
    }
    
    // No valid auth parameters found
    return { 
      data: null, 
      error: new Error('No valid authentication parameters found in URL') 
    };
  } catch (err) {
    console.error("Error extracting session from URL:", err);
    return { 
      data: null, 
      error: err instanceof Error ? err : new Error('Unknown error processing authentication')
    };
  }
};

/**
 * Extracts a specific parameter from a query string
 */
function extractParamFromQuery(query: string, paramName: string): string {
  const startIndex = query.indexOf(`${paramName}=`);
  if (startIndex === -1) return '';
  
  let endIndex = query.indexOf('&', startIndex);
  if (endIndex === -1) endIndex = query.length;
  
  return query.substring(startIndex + paramName.length + 1, endIndex);
}

/**
 * Cleans up URL after authentication by removing auth parameters
 */
export const cleanUrlAfterAuth = () => {
  if (window.history && window.history.replaceState) {
    window.history.replaceState({}, document.title, window.location.pathname);
  }
};
