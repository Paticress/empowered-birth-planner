
import { ChecklistSections } from './Checklist/ChecklistSections';
import { ChecklistTip } from './Checklist/ChecklistTip';
import { ChecklistNavigation } from './Checklist/ChecklistNavigation';

interface GuideChecklistProps {
  onPrevious: () => void;
  onNext: () => void;
}

export function GuideChecklist({ onPrevious, onNext }: GuideChecklistProps) {
  return (
    <div className="animate-fade-in">
      <h1 className="text-3xl font-bold text-maternal-900 mb-6">Checklist do Plano de Parto</h1>
      
      <div className="prose max-w-none">
        <p className="text-lg mb-4">
          Utilize este checklist para garantir que você considerou todos os aspectos importantes 
          ao elaborar seu plano de parto.
        </p>
        
        <ChecklistSections />
        
        <ChecklistTip>
          Dica: Este checklist é um guia, e você pode adicionar ou remover itens de acordo com suas necessidades específicas. 
          O mais importante é que seu plano de parto reflita suas preferências e prioridades.
        </ChecklistTip>
      </div>
      
      <ChecklistNavigation onPrevious={onPrevious} onNext={onNext} />
    </div>
  );
}
