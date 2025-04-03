
import { useNavigate } from "react-router-dom";

/**
 * Hook to handle navigation within the application
 * Uses react-router-dom's useNavigate hook
 */
export const useNavigation = () => {
  const navigate = useNavigate();
  
  const navigateTo = (path: string) => {
    console.log("Navigation requested to:", path);
    
    // Special handling for URLs with auth data (access_token)
    if (path.includes('access_token=')) {
      console.log("Detected auth data in navigation target - special handling");
      
      // Extract the clean part of the path (before any tokens or hashes)
      let basePath = '/acesso-plano';
      if (path.startsWith('/')) {
        const pathParts = path.split(/[?#]/)[0]; // Get path without query or hash
        if (pathParts && !pathParts.includes('access_token=')) {
          basePath = pathParts;
        }
      }
      
      // For URLs with auth tokens in the hash fragment
      if (path.includes('#access_token=') || (path.includes('#') && path.includes('access_token='))) {
        const hashIndex = path.indexOf('#');
        const hashFragment = path.substring(hashIndex);
        console.log(`Auth redirect to ${basePath} with hash fragment`);
        
        // Use window.location.href for more reliable auth handling with hash fragments
        window.location.href = basePath + hashFragment;
        return;
      }
      
      // For URLs with auth tokens in the query parameters
      if (path.includes('?access_token=')) {
        const queryIndex = path.indexOf('?');
        const queryParams = path.substring(queryIndex);
        console.log(`Auth redirect to ${basePath} with query params as hash`);
        
        // Convert query params to hash for Supabase auth
        window.location.href = basePath + '#' + queryParams.substring(1);
        return;
      }
      
      // For magic links specifically
      if (path.includes('type=magiclink')) {
        console.log(`Magic link authentication detected`);
        // Extract full token part to preserve all parameters
        const tokenIndex = path.indexOf('access_token=');
        const tokenPart = path.substring(tokenIndex);
        
        // Use window.location.href for reliable magic link handling
        window.location.href = `${basePath}#${tokenPart}`;
        return;
      }
      
      // Extract token part from path if in non-standard format
      const tokenIndex = path.indexOf('access_token=');
      const tokenPart = path.substring(tokenIndex);
      console.log(`Auth redirect fallback to ${basePath} with token appended as hash`);
      
      // Use window.location.href for more reliable auth handling
      window.location.href = `${basePath}#${tokenPart}`;
      return;
    }
    
    // Normal navigation path (non-auth related)
    console.log("Standard navigation to:", path);
    
    // Use replace instead of push for auth-related redirects to avoid history issues
    if (path === '/acesso-plano' || path === '/criar-plano') {
      navigate(path, { replace: true });
    } else {
      navigate(path);
    }
  };
  
  return { navigateTo };
};
