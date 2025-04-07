
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
  const [isInitialized, setIsInitialized] = useState(false);
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
  const initializeAuth = useCallback(async () => {
    console.log("Initializing auth service...");
    setIsLoading(true);
    
    // Log debug info when initializing auth
    const debugInfo = logAuthDebugInfo("Auth Initialization");
    setAuthDebugInfo(debugInfo);
    
    // Create a promise to track auth state initialization
    let authInitialized = false;
    let authStateChangePromise = new Promise<void>((resolve) => {
      // Set up auth state change listener
      const { data: { subscription } } = supabase.auth.onAuthStateChange(
        async (event, currentSession) => {
          console.log('Auth state changed:', event, 'User:', currentSession?.user?.email);
          
          setAuthDebugInfo(prev => ({ 
            ...prev, 
            authStateChange: {
              event,
              userEmail: currentSession?.user?.email,
              timestamp: new Date().toISOString()
            }
          }));
          
          // Always update both session and user state
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
            // If user was updated, ensure we have the latest data
            const { data } = await supabase.auth.getUser();
            if (data?.user) {
              setUser(data.user);
            }
          }
          
          // Resolve the promise once we've received at least one auth state change
          if (!authInitialized) {
            authInitialized = true;
            resolve();
          }
        }
      );
      
      // If no auth state change within 2 seconds, resolve anyway to prevent hanging
      setTimeout(() => {
        if (!authInitialized) {
          console.log("No auth state change detected within timeout, continuing initialization");
          authInitialized = true;
          resolve();
        }
      }, 2000);
      
      return subscription;
    });

    // Check for initial session
    try {
      console.log("Checking for initial session...");
      
      // First, wait for at least one auth state change or timeout
      await authStateChangePromise;
      
      // Then, explicitly check for a session
      const { data, error } = await supabase.auth.getSession();
      
      if (error) {
        console.error("Error getting initial session:", error);
      } else if (data.session) {
        console.log("Found initial session for user:", data.session.user?.email);
        setSession(data.session);
        setUser(data.session.user);
        
        // Backup to localStorage
        localStorage.setItem('birthPlanLoggedIn', 'true');
        localStorage.setItem('birthPlanEmail', data.session.user.email);
      } else {
        console.log("No session found during initialization");
        
        // Check localStorage as fallback
        const isLoggedIn = localStorage.getItem('birthPlanLoggedIn') === 'true';
        const storedEmail = localStorage.getItem('birthPlanEmail');
        
        if (isLoggedIn && storedEmail) {
          console.log("Found login info in localStorage, attempting session recovery");
          // Try to trigger a session recovery
          await refreshSession();
        }
      }
    } catch (error) {
      console.error("Error during session initialization:", error);
    } finally {
      setIsLoading(false);
      setIsInitialized(true);
    }
    
    return () => {
      // Cleanup function will be returned as a Promise<() => void> due to async
      // This is fine as useEffect handles this correctly
    };
  }, [refreshSession]);

  // Run the initializeAuth function once when the component mounts
  useEffect(() => {
    const initialize = async () => {
      const cleanup = await initializeAuth();
      return () => {
        if (typeof cleanup === 'function') {
          cleanup();
        }
      };
    };
    
    initialize();
  }, [initializeAuth]);

  return {
    session,
    user,
    isLoading,
    isInitialized,
    initializeAuth,
    refreshSession,
    authDebugInfo
  };
}
