
import { useState, useEffect, useCallback } from 'react';
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";

export function useBirthPlanAccess() {
  const { user } = useAuth();
  const [hasBirthPlanAccess, setHasBirthPlanAccess] = useState<boolean | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  
  // Function to check access level from database
  const checkAccessLevelFromDB = useCallback(async (email: string) => {
    try {
      const { data, error } = await supabase
        .from('users_db_birthplanbuilder')
        .select('plan')
        .eq('email', email)
        .maybeSingle();
        
      const isPaidUser = !error && !!data && data.plan === 'paid';
      
      // Update localStorage with latest plan status
      localStorage.setItem('user_plan', isPaidUser ? 'paid' : 'free');
      
      // Also store a timestamp for when we last checked the plan
      localStorage.setItem('user_plan_checked_at', Date.now().toString());
      
      return isPaidUser;
    } catch (error) {
      console.error("Error checking user access level:", error);
      return false;
    }
  }, []);
  
  // Function to manually refresh the plan status
  const refreshPlanStatus = useCallback(async () => {
    if (!user?.email || isRefreshing) return;
    
    setIsRefreshing(true);
    
    try {
      console.log("Manually refreshing plan status for:", user.email);
      const isPaidUser = await checkAccessLevelFromDB(user.email);
      setHasBirthPlanAccess(isPaidUser);
      console.log("Plan status refreshed:", isPaidUser ? 'paid' : 'free');
    } finally {
      setIsRefreshing(false);
    }
  }, [user, checkAccessLevelFromDB, isRefreshing]);
  
  useEffect(() => {
    const checkAccessLevel = async () => {
      if (!user?.email) {
        setHasBirthPlanAccess(false);
        return;
      }
      
      // Get cached plan and last check timestamp
      const cachedPlan = localStorage.getItem('user_plan');
      const lastCheckedAt = parseInt(localStorage.getItem('user_plan_checked_at') || '0');
      const now = Date.now();
      
      // Check if we need to re-validate from the database
      // Re-check if:
      // 1. We don't have a cached plan, or
      // 2. It's been more than 5 minutes since our last check
      const shouldRecheck = !cachedPlan || (now - lastCheckedAt > 5 * 60 * 1000);
      
      if (shouldRecheck) {
        console.log("Checking plan status from database for:", user.email);
        const isPaidUser = await checkAccessLevelFromDB(user.email);
        setHasBirthPlanAccess(isPaidUser);
      } else {
        // Use cached value but still update the state
        setHasBirthPlanAccess(cachedPlan === 'paid');
        console.log("Using cached plan status:", cachedPlan);
      }
    };
    
    checkAccessLevel();
    
    // Set up a timer to periodically check for plan changes (every 5 minutes)
    const intervalId = setInterval(() => {
      if (user?.email) {
        console.log("Periodic plan status check for:", user.email);
        checkAccessLevelFromDB(user.email).then(isPaidUser => {
          setHasBirthPlanAccess(isPaidUser);
        });
      }
    }, 5 * 60 * 1000); // Check every 5 minutes
    
    return () => clearInterval(intervalId);
  }, [user, checkAccessLevelFromDB]);
  
  return { hasBirthPlanAccess, isRefreshing, refreshPlanStatus };
}
