
import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { birthPlanSections } from './utils/birthPlanSections';
import {
  getRelevantQuestionsForField,
  findQuestionById,
  mapQuestionnaireToSectionId,
  initializeOptionsFromCurrentField,
  shouldShowAddButton,
  getSingleLineFields
} from './editor/editorUtils';
import { SectionNavigation } from './editor/SectionNavigation';
import { EditorField } from './editor/EditorField';
import { EditorFooter } from './editor/EditorFooter';

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
  const [selectedOptions, setSelectedOptions] = useState<Record<string, Record<string, boolean>>>({});
  const [activeFieldKey, setActiveFieldKey] = useState<string>('');
  const [dialogOpen, setDialogOpen] = useState(false);
  
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
    toast("Seu plano de parto foi atualizado com sucesso.");
  };
  
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [activeSectionIndex]);
  
  const activeSection = birthPlanSections[activeSectionIndex];
  
  const resetOptionsForField = (fieldKey: string) => {
    setActiveFieldKey(fieldKey);
    
    const initialSelectedOptions = initializeOptionsFromCurrentField(
      fieldKey, 
      activeSection.id,
      localBirthPlan,
      questionnaireAnswers
    );
    
    setSelectedOptions(initialSelectedOptions);
    setDialogOpen(true);
  };
  
  const handleAddSelectedOptions = () => {
    const updatedPlan = { ...localBirthPlan };
    
    const allSelectedOptions: string[] = [];
    
    Object.entries(selectedOptions).forEach(([questionId, options]) => {
      if (Object.values(options).some(value => value)) {
        const selectedForQuestion = Object.entries(options)
          .filter(([_, isSelected]) => isSelected)
          .map(([option]) => option);
        
        allSelectedOptions.push(...selectedForQuestion);
      }
    });
    
    if (allSelectedOptions.length > 0) {
      const formattedOptions = allSelectedOptions.join(', ');
      
      const mappedSectionId = mapQuestionnaireToSectionId(
        Object.keys(selectedOptions).map(id => findQuestionById(id)?.sectionId || '')[0]
      );
      
      updatedPlan[mappedSectionId][activeFieldKey] = formattedOptions;
      setLocalBirthPlan(updatedPlan);
      
      toast("As opções selecionadas foram adicionadas ao seu plano de parto.");
    } else {
      toast("Nenhuma opção foi selecionada.");
    }
    
    setSelectedOptions({});
    setDialogOpen(false);
  };
  
  const singleLineFields = getSingleLineFields();
  
  return (
    <div className="animate-fade-in">
      <h1 className="text-3xl font-bold text-maternal-800 mb-6">Edite seu Plano de Parto</h1>
      
      <SectionNavigation 
        birthPlanSections={birthPlanSections}
        activeSectionIndex={activeSectionIndex}
        setActiveSectionIndex={setActiveSectionIndex}
      />
      
      <div className={`bg-white border-l-4 border-maternal-${activeSection.color || '400'} rounded-lg p-6 mb-6 shadow-md`}>
        <h2 className="text-2xl font-semibold text-maternal-700 mb-4">{activeSection.title}</h2>
        
        {activeSection.fields.map((field) => {
          const sectionData = localBirthPlan[activeSection.id] || {};
          const useSingleLineInput = singleLineFields.includes(field.key);
          
          return (
            <EditorField 
              key={field.key}
              field={field}
              activeSection={activeSection}
              sectionData={sectionData}
              handleFieldChange={handleFieldChange}
              shouldShowAddButton={(fieldKey) => shouldShowAddButton(fieldKey, questionnaireAnswers)}
              useSingleLineInput={useSingleLineInput}
              resetOptionsForField={resetOptionsForField}
              activeFieldKey={activeFieldKey}
              dialogOpen={dialogOpen}
              setDialogOpen={setDialogOpen}
              selectedOptions={selectedOptions}
              setSelectedOptions={setSelectedOptions}
              getRelevantQuestionsForField={(fieldKey) => getRelevantQuestionsForField(fieldKey, questionnaireAnswers)}
              handleAddSelectedOptions={handleAddSelectedOptions}
            />
          );
        })}
      </div>
      
      <div className="bg-maternal-50 p-4 rounded-lg mb-6 border border-maternal-200">
        <p className="text-sm text-maternal-700">
          <strong>Dica:</strong> Seja específico sobre suas preferências, mas também flexível. 
          Lembre-se de que situações imprevistas podem ocorrer durante o parto.
        </p>
      </div>
      
      <EditorFooter 
        activeSectionIndex={activeSectionIndex}
        birthPlanSectionLength={birthPlanSections.length}
        handleSave={handleSave}
        onNext={onNext}
        setActiveSectionIndex={setActiveSectionIndex}
      />
    </div>
  );
}
