
import { Button } from '@/components/ui/button';
import { useNavigation } from '@/hooks/useNavigation';
import { FileText } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

interface NavButtonProps {
  className?: string;
}

export function BirthPlanNavButton({ className = '' }: NavButtonProps) {
  const { navigateTo } = useNavigation();
  const { isAuthenticated } = useAuth();
  
  const goToBirthPlanAccess = () => {
    console.log("Nav button clicked, authentication state:", isAuthenticated);
    
    // Check if user is authenticated
    if (isAuthenticated) {
      console.log("User is authenticated, navigating to birth plan builder");
      navigateTo('/criar-plano');
    } else {
      console.log("User is not authenticated, navigating to login page");
      navigateTo('/acesso-plano');
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
