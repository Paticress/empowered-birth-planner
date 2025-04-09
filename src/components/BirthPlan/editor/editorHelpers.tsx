
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
  const updatedPlan = { ...localBirthPlan };
  
  // Group selected options by question type to maintain consistent formatting
  const allSelectedOptions: Record<string, string[]> = {}; // questionType -> options
  const questionTypes: Record<string, string> = {}; // Keep track of each question's type
  
  // Process checkbox and radio selections
  Object.entries(selectedOptions).forEach(([questionId, options]) => {
    if (Object.values(options).some(value => value)) {
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
        
        // For radio/select questions, we only want the last selected option
        if (questionType === 'radio' || questionType === 'select') {
          // Only take the last selected option for radio buttons
          allSelectedOptions[questionId] = [selectedForQuestion[selectedForQuestion.length - 1]];
        } else {
          // For checkboxes, add all selected options
          allSelectedOptions[questionId] = [...selectedForQuestion];
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
  
  // Special fields that need special handling
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
  
  // If we have selected options, update the birth plan
  if (Object.values(allSelectedOptions).some(options => options.length > 0) || specialFields.includes(activeFieldKey)) {
    // Get the mapped section ID for this field from the first question
    const firstQuestionId = Object.keys(selectedOptions)[0] || 
                           (textareaValues && Object.keys(textareaValues)[0]);
    const questionInfo = findQuestionById(firstQuestionId);
    
    const mappedSectionId = mapQuestionnaireToSectionId(
      questionInfo?.sectionId || 'specialSituations'
    );
    
    // Initialize section if not exists
    if (!updatedPlan[mappedSectionId]) {
      updatedPlan[mappedSectionId] = {};
    }
    
    // Determine how to format options based on the question types included
    const questionIds = Object.keys(allSelectedOptions);
    const allSameType = questionIds.length === 1 || 
                        questionIds.every(id => questionTypes[id] === questionTypes[questionIds[0]]);
    
    if (allSameType && questionIds.length === 1) {
      // If there's just one question or all questions are the same type, 
      // use a simple format: option1, option2, etc.
      const options = Object.values(allSelectedOptions).flat();
      if (options.length > 0) {
        // For textarea type, don't join with commas
        if (questionIds.length === 1 && questionTypes[questionIds[0]] === 'textarea') {
          updatedPlan[mappedSectionId][activeFieldKey] = options[0];
        } else {
          updatedPlan[mappedSectionId][activeFieldKey] = options.join(', ');
        }
      }
    } else {
      // For mixed question types, format with question prefixes:
      const formattedOptions = Object.entries(allSelectedOptions)
        .map(([questionId, options]) => {
          const questionInfo = findQuestionById(questionId);
          if (options.length === 0) return '';
          
          if (questionInfo) {
            // For textarea, just use the text as is without a prefix
            if (questionTypes[questionId] === 'textarea') {
              return options[0];
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
