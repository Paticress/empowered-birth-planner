
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
    // Get the current active section
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
    
    // Important: We're now replacing the entire field content, not appending to it
    // This ensures we don't mix content from different questions
    
    // Format options for the selected questions only
    const formattedOptions = Object.keys(allSelectedOptions).map(questionId => {
      const options = allSelectedOptions[questionId];
      if (!options || options.length === 0) return '';
      
      const questionInfo = findQuestionById(questionId);
      if (!questionInfo) return '';
      
      // For textarea, just use the text as is without any prefixes
      if (questionTypes[questionId] === 'textarea') {
        return options[0];
      }
      
      // For radio/select/checkbox, just return the selected options without prefixes
      return options.join(', ');
    }).filter(text => text.length > 0);
    
    if (formattedOptions.length > 0) {
      // Set the new value, completely replacing the old one
      updatedPlan[mappedSectionId][activeFieldKey] = formattedOptions.join('\n\n');
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
