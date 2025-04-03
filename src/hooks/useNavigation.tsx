
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
      
      // For URLs with auth tokens, use direct location change
      // This ensures that Supabase can correctly process the tokens
      const basePath = '/acesso-plano';
      
      // Extract token part for hash fragment
      const tokenIndex = path.indexOf('access_token=');
      const tokenPart = path.substring(tokenIndex);
      
      // Use direct location change for more reliable auth handling
      window.location.href = basePath + '#' + tokenPart;
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
