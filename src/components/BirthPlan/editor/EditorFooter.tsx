
import { Button } from '@/components/ui/button';
import { ArrowLeft, ChevronRight, Save } from 'lucide-react';

interface EditorFooterProps {
  activeSectionIndex: number;
  birthPlanSectionLength: number;
  handleSave: () => void;
  onNext: () => void;
  setActiveSectionIndex: (index: number) => void;
  isDirty?: boolean;
}

export function EditorFooter({
  activeSectionIndex,
  birthPlanSectionLength,
  handleSave,
  onNext,
  setActiveSectionIndex,
  isDirty = false
}: EditorFooterProps) {
  return (
    <div className="flex justify-between mt-8">
      <Button 
        variant="outline"
        onClick={() => setActiveSectionIndex(Math.max(0, activeSectionIndex - 1))}
        disabled={activeSectionIndex === 0}
        className="flex items-center border-maternal-300 text-maternal-700 hover:bg-maternal-50"
      >
        <ArrowLeft className="mr-2 h-4 w-4" /> Seção Anterior
      </Button>
      
      <Button 
        variant="outline"
        onClick={handleSave}
        className={`flex items-center border-maternal-300 text-maternal-700 hover:bg-maternal-50 ${isDirty ? 'border-maternal-500' : ''}`}
      >
        <Save className="mr-2 h-4 w-4" /> Salvar Alterações {isDirty && '*'}
      </Button>
      
      {activeSectionIndex === birthPlanSectionLength - 1 ? (
        <Button 
          onClick={() => {
            handleSave();
            onNext();
          }}
          className="bg-maternal-600 hover:bg-maternal-700 flex items-center"
        >
          Visualizar Plano Completo <ChevronRight className="ml-2 h-4 w-4" />
        </Button>
      ) : (
        <Button 
          onClick={() => setActiveSectionIndex(Math.min(birthPlanSectionLength - 1, activeSectionIndex + 1))}
          className="bg-maternal-600 hover:bg-maternal-700 flex items-center"
        >
          Próxima Seção <ChevronRight className="ml-2 h-4 w-4" />
        </Button>
      )}
    </div>
  );
}
