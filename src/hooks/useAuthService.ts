
import { useState, useEffect } from 'react';
import { Session, User } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { logAuthDebugInfo } from '@/utils/auth/token/debug';

export function useAuthService() {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [authDebugInfo, setAuthDebugInfo] = useState<any>(null);

  const getCurrentSiteUrl = () => {
    const protocol = window.location.protocol;
    const host = window.location.host;
    return `${protocol}//${host}`;
  };

  const signIn = async (email: string, password: string) => {
    try {
      logAuthDebugInfo('Sign In Attempt');
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      return { error };
    } catch (error) {
      console.error('Error signing in:', error);
      return { error };
    }
  };

  const signUp = async (email: string, password: string) => {
    try {
      logAuthDebugInfo('Sign Up Attempt');
      const { error } = await supabase.auth.signUp({ email, password });
      return { error };
    } catch (error) {
      console.error('Error signing up:', error);
      return { error };
    }
  };

  const signInWithMagicLink = async (email: string) => {
    try {
      // Get the full site URL dynamically
      const siteUrl = getCurrentSiteUrl();
      
      // Important: Now redirect directly to /login instead of /auth/callback
      const redirectTo = `${siteUrl}/login`;
      
      console.log("Magic link will redirect to:", redirectTo);
      setAuthDebugInfo({
        type: 'magic_link_request',
        email: email,
        redirectTo: redirectTo,
        timestamp: new Date().toISOString()
      });
      
      // Pass the full redirectTo URL to the Supabase auth method
      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          emailRedirectTo: redirectTo,
          shouldCreateUser: true
        }
      });
      
      // If there was no error, log the redirect URL for debugging
      if (!error) {
        console.log("Magic link sent! It will redirect to:", redirectTo);
        setAuthDebugInfo(prev => ({
          ...prev,
          status: 'sent_successfully'
        }));
      } else {
        console.error("Error sending magic link:", error);
        setAuthDebugInfo(prev => ({
          ...prev,
          status: 'error',
          error: error.message
        }));
      }
      
      return { error };
    } catch (error) {
      console.error('Error sending magic link:', error);
      setAuthDebugInfo(prev => ({
        ...prev,
        status: 'exception',
        error: error instanceof Error ? error.message : String(error)
      }));
      return { error };
    }
  };

  const signOut = async () => {
    try {
      await supabase.auth.signOut();
      console.log("User signed out");
      
      localStorage.removeItem('birthPlanLoggedIn');
      localStorage.removeItem('birthPlanEmail');
      
      toast.success('Logout realizado com sucesso');
      
    } catch (error) {
      console.error('Error signing out:', error);
      toast.error('Erro ao fazer logout');
    }
  };

  const initializeAuth = () => {
    console.log("Initializing auth service...");
    setIsLoading(true);
    
    // Log debug info when initializing auth
    const debugInfo = logAuthDebugInfo("Auth Initialization");
    setAuthDebugInfo(debugInfo);
    
    const handleMagicLinkAuth = async () => {
      const hash = window.location.hash;
      if (hash && hash.includes('access_token')) {
        console.log("Magic link authentication detected in hash");
        setAuthDebugInfo(prev => ({ 
          ...prev, 
          magicLinkDetected: true,
          authLocation: 'hash'
        }));
        
        try {
          const { data, error } = await supabase.auth.getSession();
          if (error) {
            console.error("Error processing magic link:", error);
            toast.error("Erro ao processar link mágico");
            setAuthDebugInfo(prev => ({ 
              ...prev, 
              magicLinkError: error.message
            }));
          } else if (data.session) {
            console.log("Magic link authentication successful");
            toast.success("Login realizado com sucesso!");
            
            setAuthDebugInfo(prev => ({ 
              ...prev, 
              magicLinkSuccess: true,
              sessionEstablished: true,
              userEmail: data.session.user?.email
            }));
            
            if (data.session.user?.email) {
              localStorage.setItem('birthPlanLoggedIn', 'true');
              localStorage.setItem('birthPlanEmail', data.session.user.email);
            }
            
            window.history.replaceState(null, '', window.location.pathname + window.location.search);
          }
        } catch (err) {
          console.error("Error processing magic link:", err);
          setAuthDebugInfo(prev => ({ 
            ...prev, 
            magicLinkException: err instanceof Error ? err.message : String(err) 
          }));
        }
      }
    };
    
    handleMagicLinkAuth();
    
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
    signIn,
    signUp,
    signInWithMagicLink,
    signOut,
    initializeAuth,
    authDebugInfo
  };
}
