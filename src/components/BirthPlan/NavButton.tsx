
import { Button } from '@/components/ui/button';
import { useNavigation } from '@/hooks/useNavigation';
import { FileText } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useState, useEffect } from 'react';

interface NavButtonProps {
  className?: string;
  source?: 'guide' | 'purchase';
}

export function BirthPlanNavButton({ className = '', source }: NavButtonProps) {
  const { navigateTo } = useNavigation();
  const { isAuthenticated, user } = useAuth();
  const [hasBirthPlanAccess, setHasBirthPlanAccess] = useState<boolean | null>(null);
  
  // Check if the authenticated user has birth plan access
  useEffect(() => {
    const checkAccessLevel = async () => {
      if (!isAuthenticated || !user?.email) {
        setHasBirthPlanAccess(false);
        return;
      }
      
      // First check localStorage for cached plan value
      const cachedPlan = localStorage.getItem('user_plan');
      if (cachedPlan === 'paid') {
        setHasBirthPlanAccess(true);
        return;
      } else if (cachedPlan === 'free') {
        setHasBirthPlanAccess(false);
        return;
      }
      
      try {
        const { data, error } = await supabase
          .from('users_db_birthplanbuilder')
          .select('plan')
          .eq('email', user.email)
          .maybeSingle();
          
        const isPaidUser = !error && !!data && data.plan === 'paid';
        setHasBirthPlanAccess(isPaidUser);
        
        // Cache the result in localStorage
        localStorage.setItem('user_plan', isPaidUser ? 'paid' : 'free');
      } catch (error) {
        console.error("Error checking user access level:", error);
        setHasBirthPlanAccess(false);
      }
    };
    
    checkAccessLevel();
  }, [isAuthenticated, user]);
  
  const goToBirthPlanAccess = () => {
    console.log("Birth Plan Nav button clicked, authentication state:", isAuthenticated, "Birth plan access:", hasBirthPlanAccess);
    
    if (!isAuthenticated) {
      // If not authenticated, direct to login with the source parameter
      if (source) {
        navigateTo(`/acesso-plano?from=${source}`);
      } else {
        navigateTo('/acesso-plano');
      }
    } else if (!hasBirthPlanAccess) {
      // If authenticated but doesn't have birth plan access, direct to landing page
      navigateTo('/plano-personalizado');
    } else {
      // If authenticated and has birth plan access, go directly to birth plan builder
      navigateTo('/criar-plano');
    }
  };
  
  return (
    <Button 
      onClick={goToBirthPlanAccess}
      variant="birth-plan-builder"
      className={`flex items-center font-semibold ${className}`}
    >
      <FileText className="mr-2 h-5 w-5" />
      Criar Meu Plano de Parto
    </Button>
  );
}
