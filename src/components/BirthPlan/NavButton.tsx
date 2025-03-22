
import { Button } from '@/components/ui/button';
import { useNavigation } from '@/hooks/useNavigation';
import { FileText, CreditCard } from 'lucide-react';

interface BirthPlanNavButtonProps {
  className?: string;
}

export function BirthPlanNavButton({ className = '' }: BirthPlanNavButtonProps) {
  const { navigateTo } = useNavigation();
  
  return (
    <Button
      variant="resource-highlight"
      className={`flex items-center gap-2 ${className}`}
      onClick={() => navigateTo('/criar-plano')}
    >
      <FileText className="h-4 w-4" />
      <span>Acessar por R$ 97,00</span>
      <CreditCard className="h-4 w-4 ml-1" />
    </Button>
  );
}
