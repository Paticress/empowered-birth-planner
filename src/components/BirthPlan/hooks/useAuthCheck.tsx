
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
    // Inicialização: não fazer nada até que a autenticação esteja totalmente carregada
    if (isLoading) {
      console.log("Still loading auth state, waiting...");
      return;
    }
    
    console.log("Auth check running with:", { 
      isAuthenticated, 
      email: user?.email || localStorage.getItem('birthPlanEmail'),
      hasSession: !!session,
      isLoading,
      isInitialCheck
    });
    
    const checkAuth = async () => {
      // Verificar se já temos uma sessão válida
      if (isAuthenticated) {
        console.log("User is authenticated, checking authorization");
        await checkUserAuthorization();
        return;
      }
      
      // Verificar se há uma sessão válida no localStorage antes de redirecionar
      const isLoggedInLocally = localStorage.getItem('birthPlanLoggedIn') === 'true';
      const storedEmail = localStorage.getItem('birthPlanEmail');
      
      if (isLoggedInLocally && storedEmail) {
        console.log("Found login info in localStorage, attempting to restore session");
        
        // Tentar atualizar a sessão
        const sessionRestored = await refreshSession();
        
        if (sessionRestored) {
          console.log("Session restored successfully");
          await checkUserAuthorization();
          return;
        }
      }
      
      // Se não conseguiu restaurar a sessão, redirecionar para login
      if (isInitialCheck) {
        // Na primeira verificação, mostrar mensagem e redirecionar
        toast.error("Acesso Restrito", {
          description: "Por favor, faça login para acessar o construtor de plano de parto."
        });
        navigateTo('/acesso-plano');
      }
      
      setAuthCheckComplete(true);
      setIsInitialCheck(false);
    };
    
    const checkUserAuthorization = async () => {
      // Obter o email de múltiplas fontes para confiabilidade
      const userEmail = user?.email || session?.user?.email || localStorage.getItem('birthPlanEmail');
      
      if (!userEmail) {
        console.log("No user email found, redirecting to login page");
        navigateTo('/acesso-plano');
        setAuthCheckComplete(true);
        setIsInitialCheck(false);
        return;
      }
      
      // Verificar se o usuário está na tabela de usuários autorizados
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
          
          // Tentar adicionar o usuário ao banco de dados já que ele está autenticado
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
    
    // Se há parâmetros de auth na URL, esperar um pouco mais para a autenticação completar
    const hasAuthParams = window.location.hash.includes('access_token');
    
    if (hasAuthParams) {
      console.log("Auth parameters detected in URL, waiting for auth to complete...");
      // Adicionar um pequeno atraso para permitir que o Supabase processe o token
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
