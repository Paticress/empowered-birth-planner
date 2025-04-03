
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

  const signInWithMagicLink = async (email: string) => {
    try {
      const siteUrl = getCurrentSiteUrl();
      // Redirect to the home page first, then we'll handle routing based on auth state
      const redirectTo = `${siteUrl}`;
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
    
    // Set up auth state listener FIRST (this is critical for the correct order)
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, currentSession) => {
        console.log('Auth state changed:', event);
        setSession(currentSession);
        setUser(currentSession?.user ?? null);
        
        if (event === 'SIGNED_IN') {
          console.log('User signed in:', currentSession?.user?.email);
          // Store the login status in localStorage too for our existing mechanism
          if (currentSession?.user?.email) {
            localStorage.setItem('birthPlanLoggedIn', 'true');
            localStorage.setItem('birthPlanEmail', currentSession.user.email);
            toast.success('Login realizado com sucesso');
          }
        } else if (event === 'SIGNED_OUT') {
          console.log('User signed out');
          // Clear localStorage items on sign out
          localStorage.removeItem('birthPlanLoggedIn');
          localStorage.removeItem('birthPlanEmail');
        } else if (event === 'TOKEN_REFRESHED') {
          console.log('Token refreshed');
          // Update localStorage with refreshed session
          if (currentSession?.user?.email) {
            localStorage.setItem('birthPlanLoggedIn', 'true');
            localStorage.setItem('birthPlanEmail', currentSession.user.email);
          }
        }
        
        setIsLoading(false);
      }
    );

    // THEN check for existing session
    supabase.auth.getSession().then(({ data: { session: initialSession } }) => {
      console.log("Initial session check:", initialSession ? "Session found" : "No session");
      setSession(initialSession);
      setUser(initialSession?.user ?? null);
      
      // Also update localStorage for compatibility with existing code
      if (initialSession?.user?.email) {
        localStorage.setItem('birthPlanLoggedIn', 'true');
        localStorage.setItem('birthPlanEmail', initialSession.user.email);
      }
      
      setIsLoading(false);
    });

    // Also check localStorage as a fallback for existing code patterns
    const isLoggedIn = localStorage.getItem('birthPlanLoggedIn') === 'true';
    const storedEmail = localStorage.getItem('birthPlanEmail');
    
    console.log("Local storage check:", { isLoggedIn, email: storedEmail });
    
    if (isLoggedIn && storedEmail && !user) {
      console.log("User found in localStorage but not in Supabase session");
    }

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
