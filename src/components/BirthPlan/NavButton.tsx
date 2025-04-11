
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
  const [isFullAccessUser, setIsFullAccessUser] = useState<boolean | null>(null);
  
  // Check if the authenticated user has full access (is a Client, not just a Lead)
  useEffect(() => {
    const checkAccessLevel = async () => {
      if (!isAuthenticated || !user?.email) {
        setIsFullAccessUser(false);
        return;
      }
      
      try {
        const { data, error } = await supabase
          .from('users_db_birthplanbuilder')
          .select('email')
          .eq('email', user.email)
          .maybeSingle();
          
        setIsFullAccessUser(!error && !!data);
      } catch (error) {
        console.error("Error checking user access level:", error);
        setIsFullAccessUser(false);
      }
    };
    
    checkAccessLevel();
  }, [isAuthenticated, user]);
  
  const goToBirthPlanAccess = () => {
    console.log("Birth Plan Nav button clicked, authentication state:", isAuthenticated, "Full access:", isFullAccessUser);
    
    if (!isAuthenticated) {
      // Se não estiver autenticado, direciona para login com o parâmetro source
      if (source) {
        navigateTo(`/acesso-plano?from=${source}`);
      } else {
        navigateTo('/acesso-plano');
      }
    } else {
      // Se estiver autenticado, segue o fluxo normal
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
