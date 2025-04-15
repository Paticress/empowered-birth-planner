
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export function useAuthMethods() {
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

  return {
    signOut
  };
}
