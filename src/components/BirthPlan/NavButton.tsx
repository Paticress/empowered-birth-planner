
import { Button } from '@/components/ui/button';
import { useNavigation } from '@/hooks/useNavigation';
import { FileText } from 'lucide-react';

interface NavButtonProps {
  className?: string;
}

export function BirthPlanNavButton({ className = '' }: NavButtonProps) {
  const { navigateTo } = useNavigation();
  
  const goToBirthPlanAccess = () => {
    // Verificar se o usuário já está logado
    const isLoggedIn = localStorage.getItem('birthPlanLoggedIn') === 'true';
    
    if (isLoggedIn) {
      console.log("User already logged in, redirecting to birth plan builder");
      navigateTo('/criar-plano');
    } else {
      console.log("Navigating to birth plan login");
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
