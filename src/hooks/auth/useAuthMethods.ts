
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export function useAuthMethods() {
  const signIn = async (email: string, password: string) => {
    try {
      console.log("Signing in user with email:", email);
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password
      });
      
      if (error) throw error;
      
      console.log("User signed in successfully");
      return { error: null };
    } catch (error) {
      console.error('Error signing in:', error);
      return { error };
    }
  };

  const signUp = async (email: string, password: string) => {
    try {
      console.log("Signing up user with email:", email);
      const { error } = await supabase.auth.signUp({
        email,
        password
      });
      
      if (error) throw error;
      
      console.log("User signed up successfully");
      return { error: null };
    } catch (error) {
      console.error('Error signing up:', error);
      return { error };
    }
  };

  const signOut = async () => {
    try {
      console.log("Signing out user");
      await supabase.auth.signOut();
      console.log("User signed out");
      
      // Clear all authentication-related local storage
      localStorage.removeItem('birthPlanLoggedIn');
      localStorage.removeItem('birthPlanEmail');
      localStorage.removeItem('birthPlanEmailPending');
      localStorage.removeItem('user_plan');
      localStorage.removeItem('dashboard-visited');
      
      // Use toast for user feedback
      toast.success('Logout realizado com sucesso');
      
      // Force full page reload to reset application state
      window.location.href = '/';
    } catch (error) {
      console.error('Error signing out:', error);
      toast.error('Erro ao fazer logout');
    }
  };

  // Debug info for auth methods
  const authDebugInfo = {
    availableMethods: ['signIn', 'signUp', 'signOut']
  };

  return {
    signIn,
    signUp,
    signOut,
    authDebugInfo
  };
}
