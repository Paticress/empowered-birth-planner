
import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigation } from '@/hooks/useNavigation';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

export function useAuthCheck() {
  const { isAuthenticated, user, isLoading } = useAuth();
  const { navigateTo } = useNavigation();
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [authCheckComplete, setAuthCheckComplete] = useState(false);

  useEffect(() => {
    // Don't do anything while still loading auth state
    if (isLoading) {
      console.log("Still loading auth state, waiting...");
      return;
    }
    
    console.log("Auth check running with:", { 
      isAuthenticated, 
      email: user?.email || localStorage.getItem('birthPlanEmail'),
      isLoading
    });
    
    const checkAuth = async () => {
      // If user is not authenticated, redirect to login page
      if (!isAuthenticated) {
        console.log("User not authenticated, redirecting to login page");
        toast.error("Acesso Restrito", {
          description: "Por favor, faça login para acessar o construtor de plano de parto."
        });
        navigateTo('/acesso-plano');
        setAuthCheckComplete(true);
        return;
      }
      
      // Get the email from multiple sources for reliability
      const userEmail = user?.email || localStorage.getItem('birthPlanEmail');
      
      if (!userEmail) {
        console.log("No user email found, redirecting to login page");
        navigateTo('/acesso-plano');
        setAuthCheckComplete(true);
        return;
      }
      
      // Check if the user is in the authorized users table - using correct lowercase table name
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
          return;
        }
        
        if (!data) {
          console.log("User not authorized, adding to database");
          
          // Try to add the user to the database since they're authenticated
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
            return;
          } else {
            console.log("Added user to database:", userEmail);
            toast.success("Acesso concedido", {
              description: "Bem-vindo ao construtor de plano de parto."
            });
            setIsAuthorized(true);
            setAuthCheckComplete(true);
          }
        } else {
          console.log("User authorized:", userEmail);
          setIsAuthorized(true);
          setAuthCheckComplete(true);
        }
      } catch (error) {
        console.error("Unexpected error during access check:", error);
        toast.error("Erro inesperado", {
          description: "Ocorreu um erro ao verificar seu acesso. Por favor, tente novamente."
        });
        navigateTo('/acesso-plano');
        setAuthCheckComplete(true);
      }
    };
    
    checkAuth();
    
  }, [isAuthenticated, user, isLoading, navigateTo]);

  return { 
    isLoading: isLoading || !authCheckComplete, 
    isAuthenticated, 
    isAuthorized 
  };
}
