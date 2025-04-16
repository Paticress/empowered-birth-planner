
import { toast } from 'sonner';
import { 
  mapQuestionnaireToSectionId, 
  findQuestionById, 
  checkSectionCompletion 
} from './utils';

export const handleAddSelectedOptions = (
  activeFieldKey: string,
  selectedOptions: Record<string, Record<string, boolean>>,
  localBirthPlan: Record<string, any>,
  setLocalBirthPlan: React.Dispatch<React.SetStateAction<Record<string, any>>>,
  completedSections: string[],
  setCompletedSections: React.Dispatch<React.SetStateAction<string[]>>,
  setSelectedOptions: React.Dispatch<React.SetStateAction<Record<string, Record<string, boolean>>>>,
  setDialogOpen: React.Dispatch<React.SetStateAction<boolean>>,
  textareaValues?: Record<string, string>
) => {
  console.log('Handling add selected options for field:', activeFieldKey);
  console.log('Current selected options:', selectedOptions);
  console.log('Textarea values:', textareaValues);
  
  // Special debug for problematic fields
  const specialFieldKeys = ['emergencyScenarios', 'highRiskComplications', 'lowRiskOccurrences'];
  if (specialFieldKeys.includes(activeFieldKey)) {
    console.log(`Processing special field: ${activeFieldKey}`);
    
    // Log which question IDs are associated with this field
    const questionIds = Object.keys(selectedOptions);
    console.log(`Question IDs in selected options:`, questionIds);
    
    // Special mapping for problematic fields
    const specialFieldMapping: Record<string, string> = {
      'emergencyScenarios': 'emergencyPreferences',
      'highRiskComplications': 'highRiskComplications',
      'lowRiskOccurrences': 'lowRiskOccurrences'
    };
    
    // Log the mapped question ID
    const mappedQuestionId = specialFieldMapping[activeFieldKey];
    console.log(`Mapped question ID for ${activeFieldKey}: ${mappedQuestionId}`);
    
    // Check if we have selections for the expected question ID
    if (mappedQuestionId && selectedOptions[mappedQuestionId]) {
      console.log(`Found selections for mapped question ID ${mappedQuestionId}:`, 
        selectedOptions[mappedQuestionId]);
    } else {
      console.log(`No selections found for mapped question ID ${mappedQuestionId}`);
    }
  }
  
  const updatedPlan = { ...localBirthPlan };
  
  // Group selected options by question type to maintain consistent formatting
  const allSelectedOptions: Record<string, string[]> = {}; // questionId -> options
  const questionTypes: Record<string, string> = {}; // Keep track of each question's type
  
  // Process checkbox and radio selections
  Object.entries(selectedOptions).forEach(([questionId, options]) => {
    if (Object.values(options).some(value => value)) {
      const selectedForQuestion = Object.entries(options)
        .filter(([_, isSelected]) => isSelected)
        .map(([option]) => option);
      
      if (selectedForQuestion.length > 0) {
        const questionInfo = findQuestionById(questionId);
        if (!questionInfo) {
          console.warn(`Question info not found for question ID: ${questionId}`);
          return;
        }
        
        const questionType = questionInfo?.question?.type || 'checkbox';
        
        // Special handling for special fields - always treat as checkbox regardless of original type
        const isSpecialField = ['emergencyPreferences', 'highRiskComplications', 'lowRiskOccurrences'].includes(questionId);
        const effectiveType = isSpecialField ? 'checkbox' : questionType;
        
        // Store the question type
        questionTypes[questionId] = effectiveType;
        
        if (!allSelectedOptions[questionId]) {
          allSelectedOptions[questionId] = [];
        }
        
        // For radio/select questions (unless special field), we only want the last selected option
        if ((questionType === 'radio' || questionType === 'select') && !isSpecialField) {
          // Only take the last selected option for radio buttons
          allSelectedOptions[questionId] = [selectedForQuestion[selectedForQuestion.length - 1]];
        } else {
          // For checkboxes or special fields, add all selected options
          allSelectedOptions[questionId] = [...selectedForQuestion];
        }
        
        // Special debug logging for problematic fields
        if (isSpecialField) {
          console.log(`Processed special question ${questionId}`, {
            originalType: questionType,
            effectiveType,
            selectedOptions: allSelectedOptions[questionId]
          });
        }
      }
    }
  });
  
  // Process textarea values
  if (textareaValues) {
    Object.entries(textareaValues).forEach(([questionId, text]) => {
      if (text.trim()) {
        const questionInfo = findQuestionById(questionId);
        if (questionInfo) {
          questionTypes[questionId] = 'textarea';
          allSelectedOptions[questionId] = [text.trim()];
        }
      }
    });
  }
  
  // If we have selected options, update the birth plan
  if (Object.values(allSelectedOptions).some(options => options.length > 0)) {
    // Get the current active section
    const firstQuestionId = Object.keys(allSelectedOptions)[0] || 
                          (textareaValues && Object.keys(textareaValues)[0]) ||
                          Object.keys(selectedOptions)[0];
    
    if (!firstQuestionId) {
      console.warn('No question IDs found in selections or textareas');
      toast("Nenhuma opção foi selecionada.");
      setSelectedOptions({});
      setDialogOpen(false);
      return;
    }
    
    // Special handling for problematic fields with direct field-to-question mapping
    const specialFieldMapping: Record<string, string> = {
      'emergencyScenarios': 'emergencyPreferences',
      'highRiskComplications': 'highRiskComplications',
      'lowRiskOccurrences': 'lowRiskOccurrences'
    };
    
    const mappedQuestionId = specialFieldMapping[activeFieldKey];
    
    // If this is a special field and we don't have the expected mapped question ID,
    // check if we have any selections under the field key itself
    if (specialFieldKeys.includes(activeFieldKey) && mappedQuestionId && !allSelectedOptions[mappedQuestionId]) {
      console.log(`Special field ${activeFieldKey} missing mapped question ${mappedQuestionId} in selections`);
      
      // Look for any selections that might be under a different question ID
      const otherQuestionId = Object.keys(allSelectedOptions)[0];
      if (otherQuestionId) {
        console.log(`Found selections under question ID ${otherQuestionId} instead`);
        // Remap these selections to the correct question ID
        allSelectedOptions[mappedQuestionId] = allSelectedOptions[otherQuestionId];
        delete allSelectedOptions[otherQuestionId];
        questionTypes[mappedQuestionId] = 'checkbox';
      }
    }
    
    const questionInfo = findQuestionById(firstQuestionId);
    if (!questionInfo) {
      // For special fields, we can still proceed with a default mapping
      if (specialFieldKeys.includes(activeFieldKey) && mappedQuestionId) {
        console.log(`Using default mapping for special field ${activeFieldKey}`);
      } else {
        console.warn(`Question info not found for first question ID: ${firstQuestionId}`);
        toast("Não foi possível encontrar informações da questão selecionada.");
        setSelectedOptions({});
        setDialogOpen(false);
        return;
      }
    }
    
    // For special fields, use a hardcoded section ID
    let mappedSectionId = 'situacoesEspeciais'; // Default for special fields
    
    if (questionInfo) {
      mappedSectionId = mapQuestionnaireToSectionId(
        questionInfo?.sectionId || 'specialSituations'
      );
    }
    
    // Initialize section if not exists
    if (!updatedPlan[mappedSectionId]) {
      updatedPlan[mappedSectionId] = {};
    }
    
    // Format options for the selected questions only
    const formattedOptions = Object.keys(allSelectedOptions).map(questionId => {
      const options = allSelectedOptions[questionId];
      if (!options || options.length === 0) return '';
      
      // Special debug logging for problematic fields
      const isSpecialField = ['emergencyPreferences', 'highRiskComplications', 'lowRiskOccurrences'].includes(questionId);
      if (isSpecialField) {
        console.log(`Formatting special field ${questionId}`, {
          type: questionTypes[questionId],
          options
        });
      }
      
      // For textarea, just use the text as is without any prefixes
      if (questionTypes[questionId] === 'textarea') {
        return options[0];
      }
      
      // For radio/select/checkbox, just return the selected options without prefixes
      return options.join('\n\n');
    }).filter(text => text.length > 0);
    
    if (formattedOptions.length > 0) {
      console.log(`REPLACING value for field ${activeFieldKey} with new content:`, formattedOptions.join('\n\n'));
      
      // CRITICAL: Completely replace existing field value with the new selections
      // This ensures no mixing of previous content
      updatedPlan[mappedSectionId][activeFieldKey] = formattedOptions.join('\n\n');
      
      setLocalBirthPlan(updatedPlan);
      
      // Check if the section was completed after adding options
      checkSectionCompletion(mappedSectionId, updatedPlan, completedSections, setCompletedSections);
      
      toast("As opções selecionadas foram adicionadas ao seu plano de parto.");
    } else {
      toast("Nenhuma opção foi selecionada.");
    }
  } else {
    toast("Nenhuma opção foi selecionada.");
  }
  
  // Always clear selections when closing dialog
  setSelectedOptions({});
  setDialogOpen(false);
};
