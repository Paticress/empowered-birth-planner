
import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { birthPlanSections } from '../utils/birthPlanSections';
import {
  initializeOptionsFromCurrentField,
  shouldShowAddButton,
  checkSectionCompletion
} from '../editor/editorUtils';

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

  const handleFieldChange = (sectionId: string, fieldKey: string, value: any) => {
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
  };
  
  // Navigate to previous section
  const goToPreviousSection = () => {
    if (activeSectionIndex > 0) {
      setActiveSectionIndex(activeSectionIndex - 1);
    }
  };
  
  // Navigate to next section
  const goToNextSection = () => {
    if (activeSectionIndex < birthPlanSections.length - 1) {
      setActiveSectionIndex(activeSectionIndex + 1);
    }
  };
  
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

  const handleSave = () => {
    onUpdate(localBirthPlan);
    toast("Seu plano de parto foi atualizado com sucesso.");
  };
  
  const resetOptionsForField = (fieldKey: string) => {
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
  };

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
    handleFieldChange,
    goToPreviousSection,
    goToNextSection,
    handleSave,
    resetOptionsForField
  };
}
