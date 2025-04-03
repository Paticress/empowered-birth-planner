
import { useNavigate } from "react-router-dom";

/**
 * Hook to handle navigation within the application
 * Uses react-router-dom's useNavigate hook
 */
export const useNavigation = () => {
  const navigate = useNavigate();
  
  const navigateTo = (path: string) => {
    // Special handling for URLs with hash fragments containing auth data
    if (path.includes('#access_token=') || path.includes('access_token=')) {
      console.log("Detected auth data in navigation target, processing carefully");
      
      // For URLs with auth tokens in the hash fragment
      if (path.includes('#access_token=')) {
        const basePath = '/acesso-plano';
        const hashFragment = path.includes('#') ? path.substring(path.indexOf('#')) : '';
        
        console.log(`Redirecting to ${basePath} with auth hash preserved`);
        window.location.href = basePath + hashFragment;
        return;
      }
      
      // For URLs with auth tokens in the query parameters
      if (path.includes('access_token=')) {
        const basePath = '/acesso-plano';
        const queryParams = path.includes('?') ? path.substring(path.indexOf('?')) : '';
        
        console.log(`Redirecting to ${basePath} with auth query params preserved`);
        window.location.href = basePath + queryParams;
        return;
      }
    }
    
    // Normal navigation path (non-auth related)
    // Remove hash fragment if present (to avoid issues with hash routing)
    const cleanPath = path.split('#')[0];
    
    // Log navigation for debugging
    console.log("Navigating to:", cleanPath);
    
    // Use replace instead of push for auth-related redirects to avoid history issues
    if (cleanPath === '/acesso-plano' || cleanPath === '/criar-plano') {
      navigate(cleanPath, { replace: true });
    } else {
      navigate(cleanPath);
    }
  };
  
  return { navigateTo };
};
