import { useState, useEffect, useCallback } from 'react';
import { toast } from 'sonner';
import { birthPlanSections } from '../utils/birthPlanSections';
import {
  initializeOptionsFromCurrentField,
  shouldShowAddButton,
  checkSectionCompletion,
  getRelevantQuestionsForField
} from '../editor/utils';

export function useEditorState(
  birthPlan: Record<string, any>,
  onUpdate: (updatedPlan: Record<string, any>) => void,
  questionnaireAnswers: Record<string, any> = {}
) {
  const [activeSectionIndex, setActiveSectionIndex] = useState(0);
  const [localBirthPlan, setLocalBirthPlan] = useState({ ...birthPlan });
  const [selectedOptions, setSelectedOptions] = useState<Record<string, Record<string, boolean>>>({});
  const [activeFieldKey, setActiveFieldKey] = useState<string>('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [completedSections, setCompletedSections] = useState<string[]>([]);
  const [isDirty, setIsDirty] = useState(false);
  const [lastSaved, setLastSaved] = useState(new Date());
  const [textareaValues, setTextareaValues] = useState<Record<string, string>>({});

  const handleFieldChange = useCallback((sectionId: string, fieldKey: string, value: any) => {
    setLocalBirthPlan(prevPlan => {
      if (fieldKey === '__sectionUpdate' && typeof value === 'object') {
        const updatedPlan = {
          ...prevPlan,
          [sectionId]: {
            ...value
          }
        };
        
        checkSectionCompletion(sectionId, updatedPlan, completedSections, setCompletedSections);
        
        return updatedPlan;
      }
      
      const updatedPlan = {
        ...prevPlan,
        [sectionId]: {
          ...prevPlan[sectionId],
          [fieldKey]: value,
        },
      };
      
      checkSectionCompletion(sectionId, updatedPlan, completedSections, setCompletedSections);
      
      return updatedPlan;
    });
    setIsDirty(true);
  }, [completedSections]);
  
  const goToPreviousSection = useCallback(() => {
    if (activeSectionIndex > 0) {
      setActiveSectionIndex(activeSectionIndex - 1);
    }
  }, [activeSectionIndex]);
  
  const goToNextSection = useCallback(() => {
    if (activeSectionIndex < birthPlanSections.length - 1) {
      setActiveSectionIndex(activeSectionIndex + 1);
    }
  }, [activeSectionIndex]);
  
  useEffect(() => {
    birthPlanSections.forEach(section => {
      checkSectionCompletion(section.id, localBirthPlan, completedSections, setCompletedSections);
    });
  }, []);
  
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    
    setSelectedOptions({});
    setActiveFieldKey('');
    setDialogOpen(false);
    setTextareaValues({});
  }, [activeSectionIndex]);

  const handleSave = useCallback((showToast = true) => {
    onUpdate(localBirthPlan);
    setIsDirty(false);
    setLastSaved(new Date());
    
    if (showToast) {
      toast("Seu plano de parto foi atualizado com sucesso.");
    }
  }, [localBirthPlan, onUpdate]);
  
  const resetOptionsForField = useCallback((fieldKey: string) => {
    console.log(`Reset options for field: ${fieldKey}`);
    
    setSelectedOptions({});
    setTextareaValues({});
    
    setActiveFieldKey(fieldKey);
    
    const activeSection = birthPlanSections[activeSectionIndex];
    
    const currentFieldValue = localBirthPlan[activeSection.id]?.[fieldKey] || '';
    console.log(`Valor atual do campo para inicialização: "${currentFieldValue}"`);
    
    const initialSelectedOptions = initializeOptionsFromCurrentField(
      fieldKey, 
      activeSection.id,
      localBirthPlan,
      questionnaireAnswers
    );
    
    setSelectedOptions(initialSelectedOptions);
    
    const relevantQuestions = getRelevantQuestionsForField(fieldKey, questionnaireAnswers);
    const initialTextareaValues: Record<string, string> = {};
    
    relevantQuestions.forEach(({ question }) => {
      if (question?.type === 'textarea' && questionnaireAnswers[question.id]) {
        initialTextareaValues[question.id] = questionnaireAnswers[question.id];
      }
    });
    
    setTextareaValues(initialTextareaValues);
    
    setDialogOpen(true);
  }, [activeSectionIndex, localBirthPlan, questionnaireAnswers]);

  return {
    activeSectionIndex,
    setActiveSectionIndex,
    localBirthPlan,
    setLocalBirthPlan,
    selectedOptions,
    setSelectedOptions,
    activeFieldKey,
    setActiveFieldKey,
    dialogOpen,
    setDialogOpen,
    completedSections,
    setCompletedSections,
    handleFieldChange,
    goToPreviousSection,
    goToNextSection,
    handleSave,
    resetOptionsForField,
    isDirty,
    lastSaved,
    textareaValues,
    setTextareaValues
  };
}
