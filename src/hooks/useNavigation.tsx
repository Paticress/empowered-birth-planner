
import { useNavigate } from "react-router-dom";

/**
 * Hook to handle navigation within the application
 * Uses react-router-dom's useNavigate hook
 */
export const useNavigation = () => {
  const navigate = useNavigate();
  
  const navigateTo = (path: string) => {
    // Special handling for URLs with auth data (access_token)
    if (path.includes('access_token=')) {
      console.log("Detected auth data in navigation target");
      
      // Always direct auth links to the login page
      const basePath = '/acesso-plano';
      
      // For URLs with auth tokens in the hash fragment
      if (path.includes('#access_token=')) {
        const hashFragment = path.substring(path.indexOf('#'));
        console.log(`Auth redirect: ${basePath} with hash fragment`);
        // Use direct location change for more reliable auth handling
        window.location.href = basePath + hashFragment;
        return;
      }
      
      // For URLs with auth tokens in the query parameters
      if (path.includes('?access_token=')) {
        const queryParams = path.substring(path.indexOf('?'));
        console.log(`Auth redirect: ${basePath} with query params`);
        // Use direct location change for more reliable auth handling
        window.location.href = basePath + queryParams;
        return;
      }
      
      // Fallback case - just append entire token part to the login page
      const tokenIndex = path.indexOf('access_token=');
      const tokenPart = path.substring(tokenIndex);
      console.log(`Auth redirect fallback: ${basePath} with token appended`);
      window.location.href = `${basePath}?${tokenPart}`;
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
