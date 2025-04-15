
import { Button } from '@/components/ui/button';
import { useNavigation } from '@/hooks/useNavigation';
import { FileText, ArrowRight } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';

export function BirthPlanCTA() {
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

  const handleBirthPlanClick = () => {
    if (hasBirthPlanAccess) {
      // For paid users, direct to birth plan builder
      navigateTo('/criar-plano');
    } else {
      // For free users or visitors, direct to landing page
      navigateTo('/plano-personalizado');
    }
  };

  return (
    <div className="birth-plan-cta bg-pink-50 rounded-lg p-6 mb-8 border border-pink-100">
      <div className="flex flex-col md:flex-row md:items-center justify-between">
        <div className="mb-4 md:mb-0 md:mr-6">
          <h3 className="text-xl font-bold text-maternal-900 mb-2">Crie seu Plano de Parto Personalizado</h3>
          <p className="text-maternal-700">
            {hasBirthPlanAccess
              ? "Acesse nosso construtor interativo para criar seu plano de parto personalizado em minutos."
              : "Tenha acesso ao construtor interativo para criar seu plano de parto em minutos por apenas R$97,00."}
          </p>
        </div>
        
        <Button 
          onClick={handleBirthPlanClick}
          className={`whitespace-nowrap ${hasBirthPlanAccess 
            ? 'bg-gradient-to-r from-pink-800 to-pink-900 text-white border border-pink-900 hover:from-pink-700 hover:to-pink-800 font-semibold shadow-md hover:shadow-lg rounded-full' 
            : 'bg-white border border-pink-700 text-pink-800 hover:bg-pink-50'}`}
        >
          <FileText className="mr-2 h-5 w-5" />
          {hasBirthPlanAccess 
            ? "Acessar Construtor" 
            : "Adquirir por R$97,00"}
          <ArrowRight className="ml-2 h-5 w-5" />
        </Button>
      </div>
    </div>
  );
}
