
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
        className="flex items-center border-brand-black text-brand-black hover:bg-brand-pink/20"
      >
        <ArrowLeft className="mr-2 h-4 w-4" /> Voltar à Comunicação
      </Button>
      
      <Button 
        onClick={onNext}
        className="bg-brand-pink text-brand-black hover:bg-brand-beige flex items-center border border-brand-black"
      >
        Próximo: Recursos Adicionais <ChevronRight className="ml-2 h-4 w-4" />
      </Button>
    </div>
  );
}
