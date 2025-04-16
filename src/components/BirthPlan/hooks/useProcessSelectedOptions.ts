
import { useCallback } from 'react';
import { birthPlanSections } from '../utils/birthPlanSections';
import { isSpecialFieldKey } from '../editor/utils/fieldMapping';
import { SelectedOptionsMap, TextareaValuesMap } from '../editor/utils/types';

type UseProcessSelectedOptionsParams = {
  activeSectionIndex: number;
  activeFieldKey: string;
  selectedOptions: SelectedOptionsMap;
  localBirthPlan: Record<string, any>;
  setLocalBirthPlan: (plan: Record<string, any>) => void;
  completedSections: string[];
  setCompletedSections: (sections: string[]) => void;
  setSelectedOptions: React.Dispatch<React.SetStateAction<SelectedOptionsMap>>;
  setDialogOpen: (open: boolean) => void;
  textareaValues: TextareaValuesMap;
  setTextareaValues: (values: TextareaValuesMap) => void;
};

export function useProcessSelectedOptions({
  activeSectionIndex,
  activeFieldKey,
  selectedOptions,
  localBirthPlan,
  setLocalBirthPlan,
  completedSections,
  setCompletedSections,
  setSelectedOptions,
  setDialogOpen,
  textareaValues,
  setTextareaValues
}: UseProcessSelectedOptionsParams) {
  
  const processAddSelectedOptions = useCallback(() => {
    // Strategic logging for debugging option selection
    console.log("➕ Adding options to field:", activeFieldKey);
    console.log("📋 Currently selected options:", selectedOptions);
    console.log("🧠 Filled textareas:", textareaValues);
    console.log("📄 Current birthPlan content:", localBirthPlan);

    // Verify the structure of the active section
    const currentActiveSection = birthPlanSections[activeSectionIndex];
    if (currentActiveSection) {
      console.log("🔍 Active section:", currentActiveSection.id);
      console.log("🔍 Active field:", activeFieldKey);
      
      // Verify if the localBirthPlan has the correct structure
      if (!localBirthPlan[currentActiveSection.id]) {
        console.log("⚠️ Section doesn't exist in localBirthPlan, creating...");
        setLocalBirthPlan({
          ...localBirthPlan,
          [currentActiveSection.id]: {}
        });
      }
    }

    // Check selected options for the current field
    if (selectedOptions[activeFieldKey]) {
      const selectedForField = Object.entries(selectedOptions[activeFieldKey])
        .filter(([_, isSelected]) => isSelected)
        .map(([option]) => option);
      console.log("🔍 Options selected for this field:", selectedForField);
    } else {
      console.log("⚠️ No options selected for this field");
    }

    // Process options
    const currentSection = birthPlanSections[activeSectionIndex];
    if (!localBirthPlan[currentSection.id]) {
      // Ensure the section exists before adding options
      const updatedPlan = {
        ...localBirthPlan,
        [currentSection.id]: {}
      };
      setLocalBirthPlan(updatedPlan);
    }

    // Process the selected options and textareas
    const selectedItems = [];
    
    // Check if this is a special field for special handling
    const isSpecialField = isSpecialFieldKey(activeFieldKey);
    
    // Process selected options based on question IDs
    Object.entries(selectedOptions).forEach(([questionId, options]) => {
      // Get all selected options for this question
      const selectedForQuestion = Object.entries(options)
        .filter(([_, isSelected]) => isSelected)
        .map(([option]) => option.trim());
      
      if (selectedForQuestion.length > 0) {
        selectedItems.push(...selectedForQuestion);
      }
    });
    
    // Add textareas
    Object.values(textareaValues)
      .map(text => text.trim())
      .filter(Boolean)
      .forEach(text => {
        selectedItems.push(text);
      });
    
    // If we have selected items, update the field
    if (selectedItems.length > 0) {
      console.log("🔍 Final selected items:", selectedItems);
      
      // Format with comma and space for better readability
      const formattedText = selectedItems.join(', ');
      
      // Update the birth plan
      const updatedSection = {
        ...localBirthPlan[currentSection.id],
        [activeFieldKey]: formattedText
      };
      
      const updatedPlan = {
        ...localBirthPlan,
        [currentSection.id]: updatedSection
      };
      
      console.log("🔍 Updating plan with:", formattedText);
      setLocalBirthPlan(updatedPlan);
      
      // Mark section as completed if not already
      if (!completedSections.includes(activeFieldKey)) {
        setCompletedSections([...completedSections, activeFieldKey]);
      }
    }
    
    // Reset state and close dialog
    setSelectedOptions(prev => ({
      ...prev,
      [activeFieldKey]: {}
    }));
    
    setTextareaValues({});
    setDialogOpen(false);
  }, [
    activeSectionIndex,
    activeFieldKey,
    selectedOptions,
    localBirthPlan,
    textareaValues,
    completedSections,
    setLocalBirthPlan,
    setCompletedSections,
    setSelectedOptions,
    setTextareaValues,
    setDialogOpen
  ]);

  return { processAddSelectedOptions };
}
