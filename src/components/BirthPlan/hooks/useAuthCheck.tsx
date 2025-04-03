
import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigation } from '@/hooks/useNavigation';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

export function useAuthCheck() {
  const { isAuthenticated, user, isLoading } = useAuth();
  const { navigateTo } = useNavigation();
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    if (isLoading) {
      console.log("Still loading auth state, waiting...");
      return; // Don't do anything while still loading auth state
    }
    
    console.log("Auth check for BirthPlanBuilder:", { isAuthenticated, email: user?.email });
    
    if (!isAuthenticated) {
      console.log("User not authenticated, redirecting to login page");
      toast.error("Acesso Restrito", {
        description: "Por favor, faça login para acessar o construtor de plano de parto."
      });
      navigateTo('/acesso-plano');
      return;
    }
    
    const checkUserAccess = async () => {
      const userEmail = user?.email || localStorage.getItem('birthPlanEmail');
      
      if (!userEmail) {
        console.log("No user email found, redirecting to login page");
        navigateTo('/acesso-plano');
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
            return;
          } else {
            console.log("Added user to database:", userEmail);
            toast.success("Acesso concedido", {
              description: "Bem-vindo ao construtor de plano de parto."
            });
            setIsAuthorized(true);
          }
        } else {
          console.log("User authorized:", userEmail);
          toast.success("Bem-vindo ao Plano de Parto", {
            description: "Você está pronto para criar seu plano de parto personalizado."
          });
          setIsAuthorized(true);
        }
      } catch (error) {
        console.error("Unexpected error during access check:", error);
        toast.error("Erro inesperado", {
          description: "Ocorreu um erro ao verificar seu acesso. Por favor, tente novamente."
        });
        navigateTo('/acesso-plano');
      }
    };
    
    if (isAuthenticated) {
      checkUserAccess();
    }
    
    // Additional debugging to verify the route
    console.log("Current pathname:", window.location.pathname);
    
  }, [isAuthenticated, user, isLoading, navigateTo]);

  return { isLoading, isAuthenticated, isAuthorized };
}
