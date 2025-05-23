
import { supabase } from '@/integrations/supabase/client';

/**
 * Helper function to extract parameters from query string
 */
export function extractParam(query: string, paramName: string): string {
  const startIndex = query.indexOf(`${paramName}=`);
  if (startIndex === -1) return '';
  
  let endIndex = query.indexOf('&', startIndex);
  if (endIndex === -1) endIndex = query.length;
  
  return query.substring(startIndex + paramName.length + 1, endIndex);
}

/**
 * Handles special authentication token formats in various parts of the URL
 * Returns true if a redirect is needed, false otherwise
 */
export const handleAuthTokens = async (): Promise<boolean> => {
  try {
    const fullUrl = window.location.href;
    const pathname = window.location.pathname;
    
    // Check if auth token is in direct path or unusual format
    if (pathname.includes('access_token=') || 
        (fullUrl.includes('access_token=') && 
         !window.location.hash.includes('access_token=') && 
         !window.location.search.includes('access_token='))) {
      
      console.log("Auth token detected in URL path - needs fixing");
      
      // Extract token part
      const tokenIndex = pathname.includes('access_token=') 
        ? pathname.indexOf('access_token=')
        : fullUrl.indexOf('access_token=');
        
      if (tokenIndex !== -1) {
        const tokenPart = pathname.includes('access_token=')
          ? pathname.substring(tokenIndex)
          : fullUrl.substring(tokenIndex);
          
        // Redirect to auth callback with token in hash format
        window.location.href = '/auth/callback#' + tokenPart;
        return true;
      }
    }
    
    // Check for hash-based tokens to ensure they're properly processed
    if (window.location.hash && window.location.hash.includes('access_token=')) {
      console.log("Hash-based auth token detected, ensuring processing");
      
      try {
        // Try to process the hash directly
        const hashParams = window.location.hash.substring(1);
        console.log("Processing hash auth parameters");
        
        // Extract tokens
        const access_token = extractParam(hashParams, 'access_token');
        const refresh_token = extractParam(hashParams, 'refresh_token');
        
        if (access_token && refresh_token) {
          // Set the session explicitly
          const { data, error } = await supabase.auth.setSession({
            access_token,
            refresh_token
          });
          
          if (error) {
            console.error("Error setting session from hash:", error);
          } else if (data.session) {
            console.log("Session set successfully from hash parameters:", data.session.user?.email);
            
            // Store login information in localStorage for backup
            localStorage.setItem('birthPlanLoggedIn', 'true');
            localStorage.setItem('birthPlanEmail', data.session.user.email || '');
          }
        }
      } catch (error) {
        console.error("Error processing hash auth parameters:", error);
      }
    }
    
    // Check query-string tokens
    if (window.location.search && window.location.search.includes('code=')) {
      console.log("Query-based auth code detected, ensuring processing");
      
      try {
        // Process with Supabase directly
        const { data, error } = await supabase.auth.exchangeCodeForSession(window.location.href);
        
        if (error) {
          console.error("Error exchanging code for session:", error);
        } else if (data.session) {
          console.log("Session set successfully from code exchange:", data.session.user?.email);
          
          // Store login information in localStorage for backup
          localStorage.setItem('birthPlanLoggedIn', 'true');
          localStorage.setItem('birthPlanEmail', data.session.user.email || '');
          
          // Clean up the URL
          window.history.replaceState({}, document.title, window.location.pathname);
        }
      } catch (error) {
        console.error("Error exchanging code for session:", error);
      }
    }
    
    // Additionally, always verify session on page load
    try {
      const { data } = await supabase.auth.getSession();
      if (data.session) {
        console.log("Verified session on page load:", data.session.user?.email);
        
        // Store login information in localStorage for backup
        localStorage.setItem('birthPlanLoggedIn', 'true');
        if (data.session.user?.email) {
          localStorage.setItem('birthPlanEmail', data.session.user.email);
        }
      }
    } catch (error) {
      console.error("Error verifying session on page load:", error);
    }
    
    return false;
  } catch (error) {
    console.error('Error handling auth tokens:', error);
    return false;
  }
};
