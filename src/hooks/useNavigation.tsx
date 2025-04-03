
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
      console.log("Detected auth data in navigation target:", {
        path: path.substring(0, path.indexOf('access_token=')) + 'access_token=***'
      });
      
      // Always navigate to the login page for auth-related URLs
      const loginPath = '/acesso-plano';
      
      // For URLs with auth tokens in the hash fragment
      if (path.includes('#access_token=')) {
        const hashFragment = path.substring(path.indexOf('#'));
        console.log(`Auth redirect: ${loginPath} with hash fragment`);
        
        // Use window.location.href for more reliable auth handling with hash fragments
        window.location.href = loginPath + hashFragment;
        return;
      }
      
      // For URLs with auth tokens in the query parameters
      if (path.includes('?access_token=')) {
        const queryParams = path.substring(path.indexOf('?'));
        console.log(`Auth redirect: ${loginPath} with query params`);
        
        // Use window.location.href for more reliable auth handling with query params
        window.location.href = loginPath + queryParams;
        return;
      }
      
      // Extract token part from path if in non-standard format
      const tokenIndex = path.indexOf('access_token=');
      const tokenPart = path.substring(tokenIndex);
      console.log(`Auth redirect fallback: ${loginPath} with token appended`);
      
      // Use window.location.href for more reliable auth handling
      window.location.href = `${loginPath}?${tokenPart}`;
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
