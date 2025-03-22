
import { Button } from '@/components/ui/button';
import { useNavigation } from '@/hooks/useNavigation';
import { FileText } from 'lucide-react';

interface BirthPlanNavButtonProps {
  className?: string;
}

export function BirthPlanNavButton({ className = '' }: BirthPlanNavButtonProps) {
  const { navigateTo } = useNavigation();
  
  return (
    <Button
      variant="birth-plan-builder"
      className={`flex items-center gap-2 ${className}`}
      onClick={() => navigateTo('/criar-plano')}
    >
      <FileText className="h-4 w-4" />
      <span>Criar Meu Plano de Parto</span>
    </Button>
  );
}
