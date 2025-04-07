
import { useState, useEffect, useCallback } from 'react';
import { Session, User } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { logAuthDebugInfo } from '@/utils/auth/token/debug';

/**
 * Hook to manage authentication session state and initialization
 */
export function useAuthSession() {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [authDebugInfo, setAuthDebugInfo] = useState<any>(null);

  /**
   * Força uma atualização da sessão atual
   */
  const refreshSession = useCallback(async () => {
    console.log("Refreshing session...");
    try {
      const { data, error } = await supabase.auth.getSession();
      
      if (error) {
        console.error("Error refreshing session:", error);
        return false;
      }
      
      if (data.session) {
        console.log("Session refreshed successfully:", data.session.user?.email);
        setSession(data.session);
        setUser(data.session.user);
        
        // Atualizar o localStorage como backup
        if (data.session.user?.email) {
          localStorage.setItem('birthPlanLoggedIn', 'true');
          localStorage.setItem('birthPlanEmail', data.session.user.email);
        }
        
        return true;
      } else {
        console.log("No session found during refresh");
        return false;
      }
    } catch (error) {
      console.error("Exception refreshing session:", error);
      return false;
    }
  }, []);

  /**
   * Initialize the authentication session
   */
  const initializeAuth = useCallback(() => {
    console.log("Initializing auth service...");
    setIsLoading(true);
    
    // Log debug info when initializing auth
    const debugInfo = logAuthDebugInfo("Auth Initialization");
    setAuthDebugInfo(debugInfo);
    
    // Primeiro, configurar o listener de mudanças de estado de autenticação
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, currentSession) => {
        console.log('Auth state changed:', event, currentSession?.user?.email);
        
        setAuthDebugInfo(prev => ({ 
          ...prev, 
          authStateChange: {
            event,
            userEmail: currentSession?.user?.email,
            timestamp: new Date().toISOString()
          }
        }));
        
        // Importante: sempre atualizar tanto a sessão quanto o usuário
        setSession(currentSession);
        setUser(currentSession?.user ?? null);
        
        if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
          console.log('User signed in or token refreshed:', currentSession?.user?.email);
          
          if (currentSession?.user?.email) {
            localStorage.setItem('birthPlanLoggedIn', 'true');
            localStorage.setItem('birthPlanEmail', currentSession.user.email);
            
            if (event === 'SIGNED_IN') {
              toast.success('Login realizado com sucesso');
            }
          }
        } else if (event === 'SIGNED_OUT') {
          console.log('User signed out');
          localStorage.removeItem('birthPlanLoggedIn');
          localStorage.removeItem('birthPlanEmail');
        } else if (event === 'USER_UPDATED') {
          console.log('User updated:', currentSession?.user?.email);
          // Se o usuário foi atualizado, garantir que temos os dados mais recentes
          const { data } = await supabase.auth.getUser();
          if (data?.user) {
            setUser(data.user);
          }
        }
        
        // Finalizar carregamento após processamento de mudança de estado
        setIsLoading(false);
      }
    );

    // APÓS configurar o listener, verificar sessão inicial
    const checkInitialSession = async () => {
      try {
        // Verificar se há uma sessão ativa ao inicializar
        const { data: { session: initialSession }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error("Error getting initial session:", error);
          setIsLoading(false);
          return;
        }
        
        console.log("Initial session check:", initialSession ? "Session found" : "No session");
        
        setAuthDebugInfo(prev => ({ 
          ...prev, 
          initialSessionCheck: {
            hasSession: !!initialSession,
            userEmail: initialSession?.user?.email,
            timestamp: new Date().toISOString()
          }
        }));
        
        if (initialSession?.user) {
          console.log("Found session for user:", initialSession.user.email);
          
          // Importante: atualizar tanto a sessão quanto o usuário no estado
          setSession(initialSession);
          setUser(initialSession.user);
          
          localStorage.setItem('birthPlanLoggedIn', 'true');
          localStorage.setItem('birthPlanEmail', initialSession.user.email);
        } else {
          console.log("No session found, checking localStorage");
          
          const isLoggedIn = localStorage.getItem('birthPlanLoggedIn') === 'true';
          const storedEmail = localStorage.getItem('birthPlanEmail');
          
          setAuthDebugInfo(prev => ({ 
            ...prev, 
            localStorageCheck: {
              isLoggedIn,
              storedEmail,
              timestamp: new Date().toISOString()
            }
          }));
          
          if (isLoggedIn && storedEmail) {
            console.log("Found login info in localStorage, but no active session");
            
            // Tentar reautenticar baseado no token armazenado pelo Supabase
            const { data } = await supabase.auth.getSession();
            if (data.session) {
              console.log("Session retrieved from storage:", data.session.user?.email);
              setSession(data.session);
              setUser(data.session.user);
            } else {
              console.log("No session could be retrieved from storage");
              // Limpar localStorage se não encontrou sessão válida
              localStorage.removeItem('birthPlanLoggedIn');
              localStorage.removeItem('birthPlanEmail');
            }
          }
        }
      } catch (error) {
        console.error("Error checking initial session:", error);
      } finally {
        // Garantir que o estado de carregamento seja sempre atualizado
        setIsLoading(false);
      }
    };
    
    // Executar a verificação inicial de sessão
    checkInitialSession();

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  return {
    session,
    user,
    isLoading,
    initializeAuth,
    refreshSession,
    authDebugInfo
  };
}
