
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { logAuthDebugInfo } from '@/utils/auth/token/debug';

/**
 * Hook providing authentication methods for login, signup, and logout
 */
export function useAuthMethods() {
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

  return {
    signIn,
    signUp,
    signInWithMagicLink,
    signOut,
    authDebugInfo
  };
}
