
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";

/**
 * Hook to handle navigation within the application
 * Controls access rules and redirects based on user authentication status
 */
export const useNavigation = () => {
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();
  
  /**
   * Verifies if the user has permission to access the birth plan builder
   * Only clients with full access should be able to access the birth plan builder
   */
  const checkBirthPlanAccess = async (email: string | undefined) => {
    if (!email) return false;
    
    try {
      const { data, error } = await supabase
        .from('users_db_birthplanbuilder')
        .select('plan')
        .eq('email', email)
        .maybeSingle();
        
      // If the user has the plan set to 'paid', they have access to the birth plan builder
      return !error && !!data && data.plan === 'paid';
    } catch (error) {
      console.error("Error checking birth plan access:", error);
      return false;
    }
  };
  
  /**
   * Verifies if the user has permission to access the guide online
   * Both leads and clients have access to the guide online
   */
  const checkGuideAccess = async (email: string | undefined) => {
    if (!email) return false;
    
    try {
      const { data, error } = await supabase
        .from('users_db_birthplanbuilder')
        .select('email')
        .eq('email', email)
        .maybeSingle();
        
      // If the user exists in the database, they have access to the guide
      return !error && !!data;
    } catch (error) {
      console.error("Error checking guide access:", error);
      return false;
    }
  };
  
  /**
   * Navigates to a specific path, applying redirection rules
   * based on the type of user (Visitor, Lead or Client)
   */
  const navigateTo = async (path: string) => {
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
    
    // Public routes that all users can access
    const publicRoutes = ['/', '/faq', '/login', '/auth/callback', '/acesso-plano'];
    
    // If navigating to a public route, allow direct navigation
    if (publicRoutes.includes(path)) {
      console.log("Navigating to public route:", path);
      
      // Use replace instead of push for auth-related redirects to avoid history issues
      if (path === '/acesso-plano') {
        navigate(path, { replace: true });
      } else {
        // For all other routes, use normal navigation
        // This preserves the route in the browser history
        navigate(path);
      }
      return;
    }
    
    // === FLOW FOR VISITORS (not authenticated) ===
    if (!isAuthenticated) {
      console.log("User not authenticated, applying visitor navigation rules");
      
      // Rules for Visitors
      if (path === '/guia-online') {
        // Now redirect to the magic link login page
        console.log("Redirecting visitor to magic link login for Guide");
        navigate('/acesso-plano?from=guide', { replace: true });
        return;
      } 
      
      if (path === '/criar-plano' || path.includes('/criar-plano')) {
        // Redirect to the Wix conversion page
        console.log("Redirecting visitor to Wix conversion page for Birth Plan");
        window.location.href = "https://www.energiamaterna.com.br/criar-meu-plano-de-parto-em-minutos";
        return;
      }
      
      if (path === '/dashboard') {
        // Visitors cannot access the dashboard, redirect to login
        console.log("Redirecting visitor to login page (attempted dashboard access)");
        // Add parameter indicating redirection from dashboard
        navigate('/acesso-plano?from=dashboard');
        return;
      }
      
      // For other protected routes, redirect to login with indication of origin
      console.log("Redirecting visitor to login page");
      if (path === '/guia-online') {
        navigate('/acesso-plano?from=guide');
      } else {
        navigate('/acesso-plano');
      }
      return;
    }
    
    // === FLOW FOR AUTHENTICATED USERS (Lead or Client) ===
    // Check the user's access level to determine if they are Lead or Client
    const userEmail = user?.email || localStorage.getItem('birthPlanEmail');
    
    if (path === '/criar-plano' || path.includes('/criar-plano')) {
      // Check if the user has access to the birth plan builder
      const hasBirthPlanAccess = await checkBirthPlanAccess(userEmail);
      
      if (!hasBirthPlanAccess) {
        // User is a Lead (only has access to the guide)
        console.log("User is a Lead, redirecting to Wix conversion page for birth plan");
        window.location.href = "https://www.energiamaterna.com.br/criar-meu-plano-de-parto-em-minutos";
        return;
      }
    }
    
    // Redirect LEADs directly to the dashboard after login
    if (path === '/guia-online' && isAuthenticated && !localStorage.getItem('dashboard-visited')) {
      console.log("First login for user, redirecting to dashboard");
      localStorage.setItem('dashboard-visited', 'true');
      navigate('/dashboard', { replace: true });
      return;
    }
    
    // For Clients or normal navigation, use standard navigation
    console.log("Standard navigation to:", path);
    
    // Use replace instead of push for auth-related redirects to avoid history issues
    if (path === '/acesso-plano' || path === '/criar-plano') {
      navigate(path, { replace: true });
    } else {
      // For all other routes, use normal navigation
      // This preserves the route in the browser history
      navigate(path);
    }
  };
  
  return { navigateTo };
};
