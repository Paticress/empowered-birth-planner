
import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigation } from '@/hooks/useNavigation';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

export function useAuthCheck() {
  const { isAuthenticated, user, isLoading, session, refreshSession } = useAuth();
  const { navigateTo } = useNavigation();
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [authCheckComplete, setAuthCheckComplete] = useState(false);
  const [isInitialCheck, setIsInitialCheck] = useState(true);

  useEffect(() => {
    // Don't do anything until the authentication is fully loaded
    if (isLoading) {
      console.log("Auth still loading, waiting before checking authorization...");
      return;
    }
    
    console.log("Auth check running with:", { 
      isAuthenticated, 
      email: user?.email || session?.user?.email || localStorage.getItem('birthPlanEmail'),
      hasSession: !!session,
      isLoading,
      isInitialCheck
    });
    
    const checkAuth = async () => {
      // Check if we already have a valid session
      if (isAuthenticated) {
        console.log("User is authenticated, checking authorization");
        await checkUserAuthorization();
        return;
      }
      
      // Check if there's a valid session in localStorage before redirecting
      const isLoggedInLocally = localStorage.getItem('birthPlanLoggedIn') === 'true';
      const storedEmail = localStorage.getItem('birthPlanEmail');
      
      if (isLoggedInLocally && storedEmail) {
        console.log("Found login info in localStorage, attempting to restore session");
        
        // Try to update the session
        const sessionRestored = await refreshSession();
        
        if (sessionRestored) {
          console.log("Session restored successfully");
          await checkUserAuthorization();
          return;
        }
      }
      
      // Final attempt to check with Supabase directly
      try {
        // Updated: Using supabase.auth.getSession() instead of supabase.auth.getSession()
        const { data } = await supabase.auth.getSession();
        if (data.session) {
          console.log("Session found directly from Supabase:", data.session.user?.email);
          // Try to update the context with the session found
          await refreshSession();
          await checkUserAuthorization();
          return;
        }
      } catch (error) {
        console.error("Error checking session directly:", error);
      }
      
      // If we couldn't restore the session, redirect to login
      if (isInitialCheck) {
        // On the first check, show a message and redirect
        toast.error("Acesso Restrito", {
          description: "Por favor, faça login para acessar o construtor de plano de parto."
        });
        navigateTo('/acesso-plano');
      }
      
      setAuthCheckComplete(true);
      setIsInitialCheck(false);
    };
    
    const checkUserAuthorization = async () => {
      // Get the email from multiple sources for reliability
      const userEmail = user?.email || session?.user?.email || localStorage.getItem('birthPlanEmail');
      
      if (!userEmail) {
        console.log("No user email found, redirecting to login page");
        navigateTo('/acesso-plano');
        setAuthCheckComplete(true);
        setIsInitialCheck(false);
        return;
      }
      
      // Check if the user is in the authorized users table
      try {
        const { data, error } = await supabase
          .from('users_db_birthplanbuilder')
          .select('email')
          .eq('email', userEmail)
          .maybeSingle();
          
        if (error) {
          console.error("Error checking user access:", error);
          toast.error("Erro ao verificar acesso", {
            description: "Ocorreu um erro ao verificar seu acesso. Por favor, tente novamente."
          });
          navigateTo('/acesso-plano');
          setAuthCheckComplete(true);
          setIsInitialCheck(false);
          return;
        }
        
        if (!data) {
          console.log("User not authorized, adding to database");
          
          // Try to add the user to the database since they are authenticated
          const { error: insertError } = await supabase
            .from('users_db_birthplanbuilder')
            .insert({ email: userEmail });
            
          if (insertError) {
            console.error("Error adding user to database:", insertError);
            toast.error("Acesso não autorizado", {
              description: "Você não tem acesso ao construtor de plano de parto."
            });
            navigateTo('/acesso-plano');
            setAuthCheckComplete(true);
            setIsInitialCheck(false);
            return;
          } else {
            console.log("Added user to database:", userEmail);
            toast.success("Acesso concedido", {
              description: "Bem-vindo ao construtor de plano de parto."
            });
            setIsAuthorized(true);
            setAuthCheckComplete(true);
            setIsInitialCheck(false);
          }
        } else {
          console.log("User authorized:", userEmail);
          setIsAuthorized(true);
          setAuthCheckComplete(true);
          setIsInitialCheck(false);
        }
      } catch (error) {
        console.error("Unexpected error during access check:", error);
        toast.error("Erro inesperado", {
          description: "Ocorreu um erro ao verificar seu acesso. Por favor, tente novamente."
        });
        navigateTo('/acesso-plano');
        setAuthCheckComplete(true);
        setIsInitialCheck(false);
      }
    };
    
    // If there are auth parameters in the URL, wait a bit longer for authentication to complete
    const hasAuthParams = window.location.hash.includes('access_token=');
    
    if (hasAuthParams) {
      console.log("Auth parameters detected in URL, waiting for auth to complete...");
      // Add a small delay to allow Supabase to process the token
      setTimeout(checkAuth, 1500);
    } else {
      checkAuth();
    }
    
  }, [isAuthenticated, user, isLoading, navigateTo, session, refreshSession, isInitialCheck]);

  return { 
    isLoading: isLoading || !authCheckComplete, 
    isAuthenticated, 
    isAuthorized 
  };
}
