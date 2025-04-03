
import { useNavigate } from "react-router-dom";

/**
 * Hook to handle navigation within the application
 * Uses react-router-dom's useNavigate hook
 */
export const useNavigation = () => {
  const navigate = useNavigate();
  
  const navigateTo = (path: string) => {
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
