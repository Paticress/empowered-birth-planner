
import { toast } from 'sonner';
import { mapQuestionnaireToSectionId, findQuestionById, checkSectionCompletion } from './editorUtils';

export const handleAddSelectedOptions = (
  activeFieldKey: string,
  selectedOptions: Record<string, Record<string, boolean>>,
  localBirthPlan: Record<string, any>,
  setLocalBirthPlan: React.Dispatch<React.SetStateAction<Record<string, any>>>,
  completedSections: string[],
  setCompletedSections: React.Dispatch<React.SetStateAction<string[]>>,
  setSelectedOptions: React.Dispatch<React.SetStateAction<Record<string, Record<string, boolean>>>>,
  setDialogOpen: React.Dispatch<React.SetStateAction<boolean>>
) => {
  const updatedPlan = { ...localBirthPlan };
  
  // Group selected options by question type to maintain consistent formatting
  const allSelectedOptions: Record<string, string[]> = {}; // questionType -> options
  
  Object.entries(selectedOptions).forEach(([questionId, options]) => {
    if (Object.values(options).some(value => value)) {
      const selectedForQuestion = Object.entries(options)
        .filter(([_, isSelected]) => isSelected)
        .map(([option]) => option);
      
      if (selectedForQuestion.length > 0) {
        const questionInfo = findQuestionById(questionId);
        const questionType = questionInfo?.question?.type || 'checkbox';
        
        if (!allSelectedOptions[questionType]) {
          allSelectedOptions[questionType] = [];
        }
        
        allSelectedOptions[questionType].push(...selectedForQuestion);
      }
    }
  });
  
  // If we have selected options, update the birth plan
  if (Object.values(allSelectedOptions).some(options => options.length > 0)) {
    // Combine all options respecting their selection types
    const formattedOptions = Object.values(allSelectedOptions)
      .flat()
      .join(', ');
    
    // Get the mapped section ID for this field
    const mappedSectionId = mapQuestionnaireToSectionId(
      Object.keys(selectedOptions).map(id => findQuestionById(id)?.sectionId || '')[0]
    );
    
    // Initialize section if not exists
    if (!updatedPlan[mappedSectionId]) {
      updatedPlan[mappedSectionId] = {};
    }
    
    updatedPlan[mappedSectionId][activeFieldKey] = formattedOptions;
    setLocalBirthPlan(updatedPlan);
    
    // Check if the section was completed after adding options
    checkSectionCompletion(mappedSectionId, updatedPlan, completedSections, setCompletedSections);
    
    toast("As opções selecionadas foram adicionadas ao seu plano de parto.");
  } else {
    toast("Nenhuma opção foi selecionada.");
  }
  
  setSelectedOptions({});
  setDialogOpen(false);
};
