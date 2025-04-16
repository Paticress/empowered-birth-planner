
import { useCallback } from 'react';
import { birthPlanSections } from '../utils/birthPlanSections';

type UseProcessSelectedOptionsParams = {
  activeSectionIndex: number;
  activeFieldKey: string;
  selectedOptions: Record<string, Record<string, boolean>>;
  localBirthPlan: Record<string, any>;
  setLocalBirthPlan: (plan: Record<string, any>) => void;
  completedSections: string[];
  setCompletedSections: (sections: string[]) => void;
  setSelectedOptions: React.Dispatch<React.SetStateAction<Record<string, Record<string, boolean>>>>;
  setDialogOpen: (open: boolean) => void;
  textareaValues: Record<string, string>;
  setTextareaValues: (values: Record<string, string>) => void;
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
    // Detailed logging for debugging
    console.log(`Processing options for field: ${activeFieldKey}`);
    console.log(`Current selected options:`, selectedOptions);
    
    // Get the current active section
    const currentSection = birthPlanSections[activeSectionIndex];
    if (!currentSection) {
      console.error("No active section found");
      return;
    }
    
    // Make sure the section exists in the plan
    if (!localBirthPlan[currentSection.id]) {
      console.log(`Creating section ${currentSection.id} in birth plan`);
      setLocalBirthPlan({
        ...localBirthPlan,
        [currentSection.id]: {}
      });
    }
    
    // Special handling for the problematic fields - always use their exact field mapping
    const specialFieldMappings = {
      'emergencyScenarios': 'emergencyPreferences',
      'highRiskComplications': 'highRiskComplications',
      'lowRiskOccurrences': 'lowRiskOccurrences'
    };
    
    const isSpecialField = Object.keys(specialFieldMappings).includes(activeFieldKey);
    
    if (isSpecialField) {
      console.log(`Processing special field: ${activeFieldKey}`);
      
      // Get the corresponding questionnaire field ID for this special field
      const questionnaireFieldId = specialFieldMappings[activeFieldKey as keyof typeof specialFieldMappings];
      console.log(`Mapped to questionnaire field: ${questionnaireFieldId}`);
    }
    
    // Collect all selected options from all questions
    const allSelectedTexts: string[] = [];
    
    // Process all questions and their options
    Object.entries(selectedOptions).forEach(([questionId, options]) => {
      // Find selected options for this question
      const selectedForQuestion = Object.entries(options)
        .filter(([_, isSelected]) => isSelected)
        .map(([option]) => option);
      
      if (selectedForQuestion.length > 0) {
        console.log(`Selected options for question ${questionId}:`, selectedForQuestion);
        
        // Add all selected options to our collection
        allSelectedTexts.push(...selectedForQuestion);
      }
    });
    
    // Add any textarea values
    Object.entries(textareaValues).forEach(([questionId, text]) => {
      if (text.trim()) {
        console.log(`Adding textarea value for question ${questionId}`);
        allSelectedTexts.push(text.trim());
      }
    });
    
    // If we have any selected options, update the field
    if (allSelectedTexts.length > 0) {
      console.log(`Updating field ${activeFieldKey} with selected options:`, allSelectedTexts);
      
      // Format the selected options as a text string
      // Join with commas and line breaks for better readability
      const formattedText = allSelectedTexts.join(', ');
      
      // Update the birth plan with all selected options
      const updatedSection = {
        ...localBirthPlan[currentSection.id],
        [activeFieldKey]: formattedText
      };
      
      const updatedPlan = {
        ...localBirthPlan,
        [currentSection.id]: updatedSection
      };
      
      console.log(`Setting new value for ${activeFieldKey}:`, formattedText);
      setLocalBirthPlan(updatedPlan);
      
      // Mark section as completed
      if (!completedSections.includes(currentSection.id)) {
        setCompletedSections([...completedSections, currentSection.id]);
      }
    } else {
      console.log(`No options selected for ${activeFieldKey}`);
    }
    
    // Always reset state and close dialog
    setSelectedOptions({});
    setTextareaValues({});
    setDialogOpen(false);
  }, [
    activeSectionIndex,
    activeFieldKey,
    selectedOptions,
    localBirthPlan,
    setLocalBirthPlan,
    completedSections,
    setCompletedSections,
    setSelectedOptions,
    setTextareaValues,
    setDialogOpen,
    textareaValues
  ]);

  return { processAddSelectedOptions };
}
