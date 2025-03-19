
import { Button } from '@/components/ui/button';
import { useNavigation } from '@/hooks/useNavigation';
import { FileText } from 'lucide-react';

interface NavButtonProps {
  className?: string;
}

export function BirthPlanNavButton({ className = '' }: NavButtonProps) {
  const { navigateTo } = useNavigation();
  
  const goToBirthPlanBuilder = () => {
    console.log("Navigating to birth plan builder");
    navigateTo('/criar-plano');
  };
  
  return (
    <Button 
      onClick={goToBirthPlanBuilder}
      variant="resource-highlight"
      className={`flex items-center ${className}`}
    >
      <FileText className="mr-2 h-4 w-4" />
      Criar Plano de Parto
    </Button>
  );
}
