
import { useState } from 'react';
import { Session, User } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export function useAuthService() {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

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
      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          emailRedirectTo: window.location.origin + '/criar-plano'
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
    } catch (error) {
      console.error('Error signing out:', error);
      toast.error('Erro ao fazer logout');
    }
  };

  const initializeAuth = () => {
    // Set up auth state listener FIRST
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
          }
        } else if (event === 'SIGNED_OUT') {
          console.log('User signed out');
          // Clear localStorage items on sign out
          localStorage.removeItem('birthPlanLoggedIn');
          localStorage.removeItem('birthPlanEmail');
        }
      }
    );

    // THEN check for existing session
    supabase.auth.getSession().then(({ data: { session: initialSession } }) => {
      setSession(initialSession);
      setUser(initialSession?.user ?? null);
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
    initializeAuth
  };
}
