
import { useState, useEffect } from 'react';
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
   * Initialize the authentication session
   */
  const initializeAuth = () => {
    console.log("Initializing auth service...");
    setIsLoading(true);
    
    // Log debug info when initializing auth
    const debugInfo = logAuthDebugInfo("Auth Initialization");
    setAuthDebugInfo(debugInfo);
    
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, currentSession) => {
        console.log('Auth state changed:', event, currentSession?.user?.email);
        
        setAuthDebugInfo(prev => ({ 
          ...prev, 
          authStateChange: {
            event,
            userEmail: currentSession?.user?.email,
            timestamp: new Date().toISOString()
          }
        }));
        
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
        }
        
        setIsLoading(false);
      }
    );

    supabase.auth.getSession().then(({ data: { session: initialSession } }) => {
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
        }
      }
      
      setIsLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  };

  return {
    session,
    user,
    isLoading,
    initializeAuth,
    authDebugInfo
  };
}
