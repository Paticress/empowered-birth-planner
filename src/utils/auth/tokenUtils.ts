
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

/**
 * Processes authentication token from hash or search parameters
 */
export async function processAuthToken({
  hasAuthInHash,
  hasAuthInPath,
  hasAuthInSearch,
  fullUrl,
  search,
}: {
  hasAuthInHash: boolean;
  hasAuthInPath: boolean;
  hasAuthInSearch: boolean;
  fullUrl: string;
  search: string;
}): Promise<{ error?: Error }> {
  console.log("TokenUtils: Processing auth token");
  
  try {
    // For hash-based tokens (most common with magic links)
    if (hasAuthInHash || hasAuthInPath) {
      console.log("TokenUtils: Processing auth token from hash or path");
      
      // For supabase magic links, we need to let Supabase handle it directly
      const { data, error } = await supabase.auth.getSession();
      
      if (error) {
        console.error("TokenUtils: Error getting session from hash:", error);
        return { error };
      }
      
      return {};
    } 
    // For query parameter tokens
    else if (hasAuthInSearch) {
      console.log("TokenUtils: Processing auth token from query parameters");
      
      // Extract token
      const params = new URLSearchParams(search);
      const token = params.get('access_token');
      
      if (token) {
        // Update the URL to use hash format for Supabase
        window.history.replaceState(
          null, 
          document.title,
          '/acesso-plano#access_token=' + token
        );
        
        // Let Supabase process the hash-based token
        await new Promise(resolve => setTimeout(resolve, 500));
        
        const { error } = await supabase.auth.getSession();
        if (error) {
          console.error("TokenUtils: Error processing token:", error);
          return { error };
        }
        
        return {};
      } else {
        console.error("TokenUtils: No token found in query parameters");
        return { error: new Error("Token de autenticação não encontrado") };
      }
    }
    
    return {};
  } catch (error) {
    console.error("TokenUtils: Error processing auth token:", error);
    return { error: error instanceof Error ? error : new Error("Unknown error") };
  }
}

/**
 * Fixes auth token format in URL if needed
 */
export function fixAuthTokenFormat(path: string, fullUrl: string): string | null {
  console.log("TokenUtils: Checking if auth token format needs fixing");
  
  // Case: token directly in path
  if (path.includes('access_token=')) {
    return path.substring(path.indexOf('access_token='));
  } 
  // Case: token in hash but not correctly detected
  else if (fullUrl.includes('/acesso-plano#access_token=')) {
    const hashIndex = fullUrl.indexOf('#access_token=');
    return fullUrl.substring(hashIndex + 1); // Skip the # character
  }
  
  return null;
}

/**
 * Extracts token from complex URL formats
 */
export function extractTokenFromUrl(fullUrl: string): string | null {
  console.log("TokenUtils: Extracting token from complex URL format");
  
  const tokenIndex = fullUrl.indexOf('access_token=');
  if (tokenIndex !== -1) {
    return fullUrl.substring(tokenIndex);
  }
  
  return null;
}

/**
 * Handles error cases in authentication
 */
export function handleAuthError(hash: string, search: string): string | null {
  try {
    if (hash.includes('error=')) {
      return decodeURIComponent(hash.split('error=')[1].split('&')[0]);
    } else if (search.includes('error=')) {
      return decodeURIComponent(search.split('error=')[1].split('&')[0]);
    }
  } catch (e) {
    console.error("TokenUtils: Error parsing error message:", e);
  }
  
  return null;
}

/**
 * Adds/updates user in the database after successful authentication
 */
export async function ensureUserInDatabase(user: { email?: string | null }): Promise<void> {
  try {
    if (user?.email) {
      const email = user.email;
      
      // Add/update user in database
      const { error: insertError } = await supabase
        .from('users_db_birthplanbuilder')
        .upsert({ email }, { onConflict: 'email' });
        
      if (insertError) {
        console.error("TokenUtils: Error adding user to database:", insertError);
        // Continue anyway - this shouldn't block login
      } else {
        console.log("TokenUtils: User added/updated in the database");
      }
    }
  } catch (dbError) {
    console.error("TokenUtils: Database error:", dbError);
    // Continue anyway - database error shouldn't block login
  }
}

/**
 * Cleans auth parameters from URL
 */
export function cleanUrlAfterAuth(): void {
  window.history.replaceState(null, document.title, window.location.pathname);
}
