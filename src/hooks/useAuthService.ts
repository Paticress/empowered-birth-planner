
import { useState, useEffect } from 'react';
import { Session, User } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export function useAuthService() {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Helper function to get the current site URL
  const getCurrentSiteUrl = () => {
    const protocol = window.location.protocol;
    const host = window.location.host;
    return `${protocol}//${host}`;
  };

  const signIn = async (email: string, password: string) => {
    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      return { error };
    } catch (error) {
      console.error('Error signing in:', error);
      return { error };
    }
  };

  const signUp = async (email: string, password: string) => {
    try {
      const { error } = await supabase.auth.signUp({ email, password });
      return { error };
    } catch (error) {
      console.error('Error signing up:', error);
      return { error };
    }
  };

  const signInWithMagicLink = async (email: string, redirectPath = '/criar-plano') => {
    try {
      const siteUrl = getCurrentSiteUrl();
      // Use absolute URL for the redirect target
      const redirectTo = `${siteUrl}${redirectPath}`;
      console.log("Magic link will redirect to:", redirectTo);
      
      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          emailRedirectTo: redirectTo
        }
      });
      return { error };
    } catch (error) {
      console.error('Error sending magic link:', error);
      return { error };
    }
  };

  const signOut = async () => {
    try {
      await supabase.auth.signOut();
      console.log("User signed out");
      
      // Clear localStorage after sign out
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
    
    // Check for hash fragment that indicates magic link authentication
    const handleMagicLinkAuth = async () => {
      const hash = window.location.hash;
      if (hash && hash.includes('access_token')) {
        console.log("Magic link authentication detected");
        try {
          // The auth state change handlers will automatically update the session
          const { data, error } = await supabase.auth.getSession();
          if (error) {
            console.error("Error processing magic link:", error);
            toast.error("Erro ao processar link mágico");
          } else if (data.session) {
            console.log("Magic link authentication successful");
            toast.success("Login realizado com sucesso!");
            // Clear hash from URL without page reload
            window.history.replaceState(null, '', window.location.pathname + window.location.search);
          }
        } catch (err) {
          console.error("Error processing magic link:", err);
        }
      }
    };
    
    // Handle magic link authentication if present
    handleMagicLinkAuth();
    
    // First, set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, currentSession) => {
        console.log('Auth state changed:', event, currentSession?.user?.email);
        
        setSession(currentSession);
        setUser(currentSession?.user ?? null);
        
        if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
          console.log('User signed in or token refreshed:', currentSession?.user?.email);
          
          // Make sure to update localStorage for our existing mechanism
          if (currentSession?.user?.email) {
            localStorage.setItem('birthPlanLoggedIn', 'true');
            localStorage.setItem('birthPlanEmail', currentSession.user.email);
            
            if (event === 'SIGNED_IN') {
              toast.success('Login realizado com sucesso');
            }
          }
        } else if (event === 'SIGNED_OUT') {
          console.log('User signed out');
          // Clear localStorage items on sign out
          localStorage.removeItem('birthPlanLoggedIn');
          localStorage.removeItem('birthPlanEmail');
        }
        
        setIsLoading(false);
      }
    );

    // Then check for existing session
    supabase.auth.getSession().then(({ data: { session: initialSession } }) => {
      console.log("Initial session check:", initialSession ? "Session found" : "No session");
      
      if (initialSession?.user) {
        console.log("Found session for user:", initialSession.user.email);
        setSession(initialSession);
        setUser(initialSession.user);
        
        // Also update localStorage for compatibility with existing code
        localStorage.setItem('birthPlanLoggedIn', 'true');
        localStorage.setItem('birthPlanEmail', initialSession.user.email);
      } else {
        console.log("No session found, checking localStorage");
        
        // In case we have localStorage but no session
        const isLoggedIn = localStorage.getItem('birthPlanLoggedIn') === 'true';
        const storedEmail = localStorage.getItem('birthPlanEmail');
        
        if (isLoggedIn && storedEmail) {
          console.log("Found login info in localStorage, but no active session");
        }
      }
      
      setIsLoading(false);
    });

    // Return the cleanup function
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
    initializeAuth
  };
}
