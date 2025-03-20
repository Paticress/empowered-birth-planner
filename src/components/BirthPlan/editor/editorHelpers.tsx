
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
    
    // Check if the section was completed after adding options
    checkSectionCompletion(mappedSectionId, updatedPlan, completedSections, setCompletedSections);
    
    toast("As opções selecionadas foram adicionadas ao seu plano de parto.");
  } else {
    toast("Nenhuma opção foi selecionada.");
  }
  
  setSelectedOptions({});
  setDialogOpen(false);
};
