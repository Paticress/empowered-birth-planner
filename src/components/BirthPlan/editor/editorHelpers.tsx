
import { toast } from 'sonner';
import { 
  mapQuestionnaireToSectionId, 
  findQuestionById, 
  checkSectionCompletion,
  fieldToSectionMap,
  questionToFieldMap
} from './utils';

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
  console.log(`Adding selected options for field: ${activeFieldKey}`);
  console.log(`Selected options:`, selectedOptions);
  
  const updatedPlan = { ...localBirthPlan };
  
  // Group selected options by question type to maintain consistent formatting
  const allSelectedOptions: Record<string, string[]> = {}; // questionType -> options
  const questionTypes: Record<string, string> = {}; // Keep track of each question's type
  
  // Check if we have any selected options
  let hasAnySelection = false;
  
  Object.entries(selectedOptions).forEach(([questionId, options]) => {
    if (Object.values(options).some(value => value)) {
      hasAnySelection = true;
      
      const selectedForQuestion = Object.entries(options)
        .filter(([_, isSelected]) => isSelected)
        .map(([option]) => option);
      
      if (selectedForQuestion.length > 0) {
        const questionInfo = findQuestionById(questionId);
        const questionType = questionInfo?.question?.type || 'checkbox';
        
        // Store the question type
        questionTypes[questionId] = questionType;
        
        if (!allSelectedOptions[questionId]) {
          allSelectedOptions[questionId] = [];
        }
        
        // Check if this field is directly mapped from this question
        const isDirectMapping = questionToFieldMap[questionId] === activeFieldKey;
        
        // For radio/select questions, we only want the last selected option
        // unless it's a special field or direct mapping
        if ((questionType === 'radio' || questionType === 'select') && 
            !getSpecialFields().includes(activeFieldKey) &&
            !isDirectMapping) {
          // Only take the last selected option for radio buttons
          allSelectedOptions[questionId] = [selectedForQuestion[selectedForQuestion.length - 1]];
        } else {
          // For checkboxes or special fields, add all selected options
          allSelectedOptions[questionId] = [...selectedForQuestion];
        }
      }
    }
  });
  
  // Special fields that need special handling (allow multiple radio selections)
  const specialFields = [
    'emergencyScenarios', 
    'highRiskComplications', 
    'lowRiskOccurrences', 
    'cascadeInterventions',
    'painRelief',
    'interventionsRoutine',
    'consentimentoInformado',
    'specialWishes',
    'unexpectedScenarios'
  ];
  
  // Log for debugging
  console.log("All selected options:", allSelectedOptions);
  
  // If we have selected options, update the birth plan
  if (hasAnySelection) {
    // Get the mapped section ID for this field
    let mappedSectionId;
    
    // First check if we have a direct mapping for this field
    if (fieldToSectionMap[activeFieldKey]) {
      mappedSectionId = mapQuestionnaireToSectionId(fieldToSectionMap[activeFieldKey]);
    } else {
      // Otherwise try to get it from the first question
      const firstQuestionId = Object.keys(selectedOptions)[0];
      const questionInfo = findQuestionById(firstQuestionId);
      
      mappedSectionId = mapQuestionnaireToSectionId(
        questionInfo?.sectionId || 'specialSituations'
      );
    }
    
    console.log(`Mapped section ID: ${mappedSectionId} for field: ${activeFieldKey}`);
    
    // Initialize section if not exists
    if (!updatedPlan[mappedSectionId]) {
      updatedPlan[mappedSectionId] = {};
    }
    
    // Check for direct mapping from questionnaire to field
    const hasDirectMapping = Object.entries(questionToFieldMap)
      .some(([questionId, fieldKey]) => fieldKey === activeFieldKey && selectedOptions[questionId]);
    
    // Determine how to format options based on the question types included
    const questionIds = Object.keys(allSelectedOptions);
    const allSameType = questionIds.length === 1 || 
                      questionIds.every(id => questionTypes[id] === questionTypes[questionIds[0]]);
    
    // Special case for direct mapped fields - use a simple comma-separated list
    if (hasDirectMapping || specialFields.includes(activeFieldKey)) {
      const allOptions = Object.values(allSelectedOptions).flat();
      if (allOptions.length > 0) {
        updatedPlan[mappedSectionId][activeFieldKey] = allOptions.join(', ');
      }
    } 
    else if (allSameType && questionIds.length === 1 && !specialFields.includes(activeFieldKey)) {
      // If there's just one question or all questions are the same type, 
      // use a simple format: option1, option2, etc.
      const options = Object.values(allSelectedOptions).flat();
      if (options.length > 0) {
        updatedPlan[mappedSectionId][activeFieldKey] = options.join(', ');
      }
    } else {
      // For mixed question types or special fields, format with question prefixes:
      const formattedOptions = Object.entries(allSelectedOptions)
        .map(([questionId, options]) => {
          const questionInfo = findQuestionById(questionId);
          if (options.length === 0) return '';
          
          if (questionInfo) {
            // For special fields, just list the options without question text prefix
            if (specialFields.includes(activeFieldKey)) {
              return options.join(', ');
            }
            
            // Create a prefix from the question text, shortened if needed
            const questionText = questionInfo.question.text;
            const prefix = questionText.length > 30 
              ? questionText.substring(0, 30) + '...'
              : questionText;
              
            return `${prefix}: ${options.join(', ')}`;
          }
          return options.join(', ');
        })
        .filter(text => text.length > 0)
        .join('\n\n');
      
      if (formattedOptions.length > 0) {
        updatedPlan[mappedSectionId][activeFieldKey] = formattedOptions;
      }
    }
    
    console.log(`Updated plan for ${activeFieldKey}:`, updatedPlan[mappedSectionId][activeFieldKey]);
    
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

/**
 * Updates textarea content directly from questionnaire answers
 */
export const handleTextAreaContent = (
  fieldKey: string,
  questionId: string,
  value: string,
  localBirthPlan: Record<string, any>,
  setLocalBirthPlan: React.Dispatch<React.SetStateAction<Record<string, any>>>,
  completedSections: string[],
  setCompletedSections: React.Dispatch<React.SetStateAction<string[]>>,
  mappedSectionId: string
) => {
  if (!value.trim()) {
    return;
  }
  
  const updatedPlan = { ...localBirthPlan };
  
  // Initialize section if not exists
  if (!updatedPlan[mappedSectionId]) {
    updatedPlan[mappedSectionId] = {};
  }
  
  // Set the field value directly
  updatedPlan[mappedSectionId][fieldKey] = value;
  
  setLocalBirthPlan(updatedPlan);
  
  // Check if the section was completed after adding content
  checkSectionCompletion(mappedSectionId, updatedPlan, completedSections, setCompletedSections);
};

/**
 * Returns the list of special fields that need special handling
 */
export const getSpecialFields = (): string[] => {
  return [
    'emergencyScenarios', 
    'highRiskComplications', 
    'lowRiskOccurrences', 
    'cascadeInterventions',
    'painRelief',
    'interventionsRoutine',
    'consentimentoInformado',
    'specialWishes',
    'unexpectedScenarios'
  ];
};
