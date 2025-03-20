
import { Button } from '@/components/ui/button';
import { ArrowLeft, ChevronRight, Save } from 'lucide-react';

interface NavigationButtonsProps {
  activeSectionIndex: number;
  totalSections: number;
  onPrevious: () => void;
  onNext: () => void;
  onSave: () => void;
  onFinish: () => void;
}

export function NavigationButtons({
  activeSectionIndex,
  totalSections,
  onPrevious,
  onNext,
  onSave,
  onFinish
}: NavigationButtonsProps) {
  const isLastSection = activeSectionIndex === totalSections - 1;
  
  return (
    <div className="flex justify-between mt-8">
      <Button 
        variant="outline"
        onClick={onPrevious}
        disabled={activeSectionIndex === 0}
        className="flex items-center border-maternal-300 text-maternal-700 hover:bg-maternal-50"
      >
        <ArrowLeft className="mr-2 h-4 w-4" /> Seção Anterior
      </Button>
      
      <Button 
        variant="outline"
        onClick={onSave}
        className="flex items-center border-maternal-300 text-maternal-700 hover:bg-maternal-50"
      >
        <Save className="mr-2 h-4 w-4" /> Salvar Alterações
      </Button>
      
      {isLastSection ? (
        <Button 
          onClick={onFinish}
          className="bg-maternal-400 hover:bg-maternal-500 flex items-center"
        >
          Visualizar Plano Completo <ChevronRight className="ml-2 h-4 w-4" />
        </Button>
      ) : (
        <Button 
          onClick={onNext}
          className="bg-maternal-400 hover:bg-maternal-500 flex items-center"
        >
          Próxima Seção <ChevronRight className="ml-2 h-4 w-4" />
        </Button>
      )}
    </div>
  );
}
