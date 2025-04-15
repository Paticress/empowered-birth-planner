
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

/**
 * Custom hook to check if a user has access to the birth plan builder
 * @returns {boolean | null} hasBirthPlanAccess - Whether the user has access to the birth plan builder
 */
export function useBirthPlanAccess() {
  const { isAuthenticated, user } = useAuth();
  const [hasBirthPlanAccess, setHasBirthPlanAccess] = useState<boolean | null>(null);
  
  useEffect(() => {
    const checkAccessLevel = async () => {
      // If user is not authenticated or has no email, they don't have access
      if (!isAuthenticated || !user?.email) {
        setHasBirthPlanAccess(false);
        return;
      }
      
      // First check localStorage for cached plan value for better performance
      const cachedPlan = localStorage.getItem('user_plan');
      if (cachedPlan === 'paid') {
        setHasBirthPlanAccess(true);
        return;
      } else if (cachedPlan === 'free') {
        setHasBirthPlanAccess(false);
        return;
      }
      
      try {
        // Check if user has a paid plan in the database
        const { data, error } = await supabase
          .from('users_db_birthplanbuilder')
          .select('plan')
          .eq('email', user.email)
          .maybeSingle();
          
        const isPaidUser = !error && !!data && data.plan === 'paid';
        setHasBirthPlanAccess(isPaidUser);
        
        // Cache the result in localStorage to avoid unnecessary database queries
        localStorage.setItem('user_plan', isPaidUser ? 'paid' : 'free');
      } catch (error) {
        console.error("Error checking user access level:", error);
        setHasBirthPlanAccess(false);
      }
    };
    
    checkAccessLevel();
  }, [isAuthenticated, user]);
  
  return hasBirthPlanAccess;
}
