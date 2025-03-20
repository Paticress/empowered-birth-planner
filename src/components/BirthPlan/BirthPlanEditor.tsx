
import { useState, useEffect } from 'react';
import { toast } from '@/components/ui/use-toast';
import { birthPlanSections } from './utils/birthPlanSections';
import { SectionNavigation } from './components/SectionNavigation';
import { SectionContent } from './components/SectionContent';
import { NavigationButtons } from './components/NavigationButtons';

interface BirthPlanEditorProps {
  birthPlan: Record<string, any>;
  onUpdate: (updatedPlan: Record<string, any>) => void;
  onNext: () => void;
  onBack?: () => void;
  questionnaireAnswers?: Record<string, any>;
}

export function BirthPlanEditor({ 
  birthPlan, 
  onUpdate, 
  onNext,
  onBack,
  questionnaireAnswers = {}
}: BirthPlanEditorProps) {
  const [activeSectionIndex, setActiveSectionIndex] = useState(0);
  const [localBirthPlan, setLocalBirthPlan] = useState({ ...birthPlan });
  
  const handleFieldChange = (sectionId: string, fieldKey: string, value: any) => {
    setLocalBirthPlan(prevPlan => ({
      ...prevPlan,
      [sectionId]: {
        ...prevPlan[sectionId],
        [fieldKey]: value,
      },
    }));
  };
  
  const handleSave = () => {
    onUpdate(localBirthPlan);
    toast({
      title: "Alterações salvas",
      description: "Seu plano de parto foi atualizado com sucesso."
    });
  };
  
  // Scroll to top when section changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [activeSectionIndex]);
  
  const activeSection = birthPlanSections[activeSectionIndex];
  
  return (
    <div className="animate-fade-in">
      <h1 className="text-3xl font-bold text-maternal-800 mb-6">Edite seu Plano de Parto</h1>
      
      <SectionNavigation 
        sections={birthPlanSections}
        activeSectionIndex={activeSectionIndex}
        onSectionChange={setActiveSectionIndex}
      />
      
      <SectionContent
        activeSection={activeSection}
        birthPlan={localBirthPlan}
        onFieldChange={handleFieldChange}
        questionnaireAnswers={questionnaireAnswers}
      />
      
      <div className="bg-maternal-50 p-4 rounded-lg mb-6 border border-maternal-200">
        <p className="text-sm text-maternal-700">
          <strong>Dica:</strong> Seja específico sobre suas preferências, mas também flexível. 
          Lembre-se de que situações imprevistas podem ocorrer durante o parto.
        </p>
      </div>
      
      <NavigationButtons
        activeSectionIndex={activeSectionIndex}
        totalSections={birthPlanSections.length}
        onPrevious={() => setActiveSectionIndex(Math.max(0, activeSectionIndex - 1))}
        onNext={() => setActiveSectionIndex(Math.min(birthPlanSections.length - 1, activeSectionIndex + 1))}
        onSave={handleSave}
        onFinish={() => {
          handleSave();
          onNext();
        }}
      />
    </div>
  );
}
