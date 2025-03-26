
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { FileText } from 'lucide-react';

interface BirthPlanNavButtonProps {
  className?: string;
}

export function BirthPlanNavButton({ className = '' }: BirthPlanNavButtonProps) {
  const navigate = useNavigate();
  
  const handleClick = () => {
    console.log('Navigating to birth plan builder');
    navigate('/criar-plano');
  };
  
  return (
    <Button
      variant="birth-plan-builder"
      className={`flex items-center gap-2 ${className}`}
      onClick={handleClick}
    >
      <FileText className="h-4 w-4" />
      <span>Criar Meu Plano de Parto</span>
    </Button>
  );
}
