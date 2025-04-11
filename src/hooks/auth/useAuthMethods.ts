import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { logAuthDebugInfo } from '@/utils/auth/token/debug';

/**
 * Hook providing authentication methods for login, signup, and logout
 */
export function useAuthMethods() {
  const [authDebugInfo, setAuthDebugInfo] = useState<any>(null);

  const signIn = async (email: string, password: string) => {
    try {
      console.log("SignIn attempt with email:", email);
      logAuthDebugInfo('Sign In Attempt');
      
      const { data, error } = await supabase.auth.signInWithPassword({ 
        email, 
        password 
      });
      
      if (error) {
        console.error("SignIn error:", error.message);
      } else {
        console.log("SignIn successful, user:", data.user?.email);
        setAuthDebugInfo({
          type: 'sign_in_success',
          email: email,
          userId: data.user?.id,
          timestamp: new Date().toISOString()
        });
      }
      
      return { data, error };
    } catch (error) {
      console.error('Error signing in:', error);
      return { error };
    }
  };

  const signUp = async (email: string, password: string) => {
    try {
      console.log("SignUp attempt with email:", email);
      logAuthDebugInfo('Sign Up Attempt');
      
      const { data, error } = await supabase.auth.signUp({ 
        email, 
        password,
        options: {
          emailRedirectTo: window.location.origin + '/acesso-plano'
        }
      });
      
      if (error) {
        console.error("SignUp error:", error.message);
      } else {
        console.log("SignUp successful, user:", data.user?.email);
        setAuthDebugInfo({
          type: 'sign_up_success',
          email: email,
          userId: data.user?.id,
          timestamp: new Date().toISOString()
        });
      }
      
      return { error };
    } catch (error) {
      console.error('Error signing up:', error);
      return { error };
    }
  };

  const sendMagicLink = async (email: string) => {
    try {
      console.log("Magic link request for email:", email);
      logAuthDebugInfo('Magic Link Request');
      
      const origin = window.location.origin;
      const redirectTo = `${origin}/acesso-plano`;
      
      const { data, error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          emailRedirectTo: redirectTo,
        }
      });
      
      if (error) {
        console.error("Magic link error:", error.message);
        setAuthDebugInfo({
          type: 'magic_link_error',
          email: email,
          error: error.message,
          timestamp: new Date().toISOString()
        });
      } else {
        console.log("Magic link sent successfully");
        setAuthDebugInfo({
          type: 'magic_link_sent',
          email: email,
          timestamp: new Date().toISOString()
        });
        
        localStorage.setItem('birthPlanEmailPending', email);
      }
      
      return { data, error };
    } catch (error) {
      console.error('Error sending magic link:', error);
      return { error };
    }
  };

  const signOut = async () => {
    try {
      console.log("Signing out user");
      await supabase.auth.signOut();
      console.log("User signed out");
      
      localStorage.removeItem('birthPlanLoggedIn');
      localStorage.removeItem('birthPlanEmail');
      localStorage.removeItem('birthPlanEmailPending');
      
      toast.success('Logout realizado com sucesso');
      
    } catch (error) {
      console.error('Error signing out:', error);
      toast.error('Erro ao fazer logout');
    }
  };

  return {
    signIn,
    signUp,
    signOut,
    sendMagicLink,
    authDebugInfo
  };
}
