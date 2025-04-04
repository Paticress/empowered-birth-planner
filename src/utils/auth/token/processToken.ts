
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { TokenProcessingParams } from "@/types/auth";
import { extractTokenFromUrl } from "./extractToken";
import { cleanUrlAfterAuth } from "./cleanupToken";

/**
 * Processes authentication token from hash or search parameters
 */
export async function processAuthToken({
  hasAuthInHash,
  hasAuthInPath,
  hasAuthInSearch,
  fullUrl,
  search,
  hash,
}: TokenProcessingParams): Promise<{ error?: Error }> {
  console.log("TokenUtils: Processing auth token");
  
  try {
    // For hash-based tokens (most common with magic links)
    if (hasAuthInHash) {
      console.log("TokenUtils: Processing auth token from hash:", hash.substring(0, 20) + "...");
      
      // Ensure hash is usable - sometimes Supabase needs a delay to process the hash
      await new Promise(resolve => setTimeout(resolve, 300));
      
      // For supabase magic links, we need to let Supabase handle it directly
      const { data, error } = await supabase.auth.getSession();
      
      if (error) {
        console.error("TokenUtils: Error getting session from hash:", error);
        return { error };
      }
      
      if (data.session) {
        console.log("TokenUtils: Successfully obtained session from hash");
      } else {
        console.log("TokenUtils: No session found from hash, might need further processing");
      }
      
      return {};
    } 
    // For path-embedded tokens
    else if (hasAuthInPath) {
      console.log("TokenUtils: Processing auth token from path");
      
      // Extract token and fix format for Supabase
      const fixedToken = fixAuthTokenFormat(window.location.pathname, fullUrl);
      
      if (fixedToken) {
        // Update URL to standard hash format that Supabase expects
        window.history.replaceState(
          null, 
          document.title,
          '/acesso-plano#' + fixedToken
        );
        
        // Set the hash manually to ensure it's detected
        window.location.hash = fixedToken;
        
        // Let Supabase process the hash-based token after a delay
        await new Promise(resolve => setTimeout(resolve, 500));
        
        const { data, error } = await supabase.auth.getSession();
        if (error) {
          console.error("TokenUtils: Error processing path token after fixing format:", error);
          return { error };
        }
        
        if (data.session) {
          console.log("TokenUtils: Successfully obtained session from path-based token");
        }
        
        return {};
      } else {
        console.error("TokenUtils: Could not fix auth token format from path");
        return { error: new Error("Formato de token inválido") };
      }
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
        
        // Set the hash manually
        window.location.hash = 'access_token=' + token;
        
        // Let Supabase process the hash-based token
        await new Promise(resolve => setTimeout(resolve, 500));
        
        const { error } = await supabase.auth.getSession();
        if (error) {
          console.error("TokenUtils: Error processing token from search params:", error);
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
 * Returns the fixed token part or null if can't be fixed
 */
export function fixAuthTokenFormat(path: string, fullUrl: string): string | null {
  console.log("TokenUtils: Checking if auth token format needs fixing");
  
  // Case: token directly in path
  if (path.includes('access_token=')) {
    const tokenIndex = path.indexOf('access_token=');
    return path.substring(tokenIndex);
  } 
  // Case: token in hash but not correctly detected
  else if (fullUrl.includes('#access_token=')) {
    const hashIndex = fullUrl.indexOf('#access_token=');
    return fullUrl.substring(hashIndex + 1); // Skip the # character
  }
  // Case: token directly in URL (not in path or hash)
  else if (fullUrl.includes('access_token=')) {
    const tokenIndex = fullUrl.indexOf('access_token=');
    return fullUrl.substring(tokenIndex);
  }
  
  return null;
}
