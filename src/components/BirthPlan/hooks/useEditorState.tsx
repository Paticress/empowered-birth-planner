
import { useState, useEffect, useCallback } from 'react';
import { toast } from 'sonner';
import { birthPlanSections } from '../utils/birthPlanSections';
import {
  initializeOptionsFromCurrentField,
  shouldShowAddButton,
  checkSectionCompletion
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

  const handleFieldChange = useCallback((sectionId: string, fieldKey: string, value: any) => {
    setLocalBirthPlan(prevPlan => {
      const updatedPlan = {
        ...prevPlan,
        [sectionId]: {
          ...prevPlan[sectionId],
          [fieldKey]: value,
        },
      };
      
      // Mark section as completed if all required fields are filled
      checkSectionCompletion(sectionId, updatedPlan, completedSections, setCompletedSections);
      
      return updatedPlan;
    });
    setIsDirty(true);
  }, [completedSections]);
  
  // Navigate to previous section
  const goToPreviousSection = useCallback(() => {
    if (activeSectionIndex > 0) {
      setActiveSectionIndex(activeSectionIndex - 1);
    }
  }, [activeSectionIndex]);
  
  // Navigate to next section
  const goToNextSection = useCallback(() => {
    if (activeSectionIndex < birthPlanSections.length - 1) {
      setActiveSectionIndex(activeSectionIndex + 1);
    }
  }, [activeSectionIndex]);
  
  // Initialize completed sections when component mounts
  useEffect(() => {
    birthPlanSections.forEach(section => {
      checkSectionCompletion(section.id, localBirthPlan, completedSections, setCompletedSections);
    });
  }, []);
  
  // Scroll to top when changing sections
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
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
    setActiveFieldKey(fieldKey);
    
    const activeSection = birthPlanSections[activeSectionIndex];
    const initialSelectedOptions = initializeOptionsFromCurrentField(
      fieldKey, 
      activeSection.id,
      localBirthPlan,
      questionnaireAnswers
    );
    
    setSelectedOptions(initialSelectedOptions);
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
    lastSaved
  };
}
