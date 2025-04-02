
import { Button } from '@/components/ui/button';
import { useNavigation } from '@/hooks/useNavigation';
import { FileText } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

interface NavButtonProps {
  className?: string;
}

export function BirthPlanNavButton({ className = '' }: NavButtonProps) {
  const { navigateTo } = useNavigation();
  const { user } = useAuth();
  
  const goToBirthPlanAccess = () => {
    // Check if user is authenticated with Supabase
    if (user) {
      console.log("User already logged in, redirecting to birth plan builder");
      navigateTo('/criar-plano');
    } else {
      // Also check localStorage for backward compatibility
      const isLoggedIn = localStorage.getItem('birthPlanLoggedIn') === 'true';
      
      if (isLoggedIn) {
        console.log("User logged in via localStorage, redirecting to birth plan builder");
        navigateTo('/criar-plano');
      } else {
        console.log("Navigating to birth plan login");
        navigateTo('/acesso-plano');
      }
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
