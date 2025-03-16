
import { Button } from '@/components/ui/button';
import { ChevronRight, ArrowLeft } from 'lucide-react';

interface ChecklistNavigationProps {
  onPrevious: () => void;
  onNext: () => void;
}

export function ChecklistNavigation({ onPrevious, onNext }: ChecklistNavigationProps) {
  return (
    <div className="mt-8 flex justify-between">
      <Button 
        variant="outline" 
        onClick={onPrevious}
        className="flex items-center border-brand-beige text-brand-charcoal hover:bg-brand-pink/20"
      >
        <ArrowLeft className="mr-2 h-4 w-4" /> Voltar à Comunicação
      </Button>
      
      <Button 
        onClick={onNext}
        className="bg-brand-charcoal hover:bg-brand-beige hover:text-brand-black flex items-center"
      >
        Próximo: Recursos Adicionais <ChevronRight className="ml-2 h-4 w-4" />
      </Button>
    </div>
  );
}
