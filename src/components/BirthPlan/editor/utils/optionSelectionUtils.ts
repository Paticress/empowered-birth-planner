
/**
 * Utility functions for handling option selection in the birth plan editor
 */

/**
 * Initializes options for a question based on questionnaire answers
 */
export function initializeQuestionOptions(
  question: any,
  questionId: string,
  questionnaireAnswers: Record<string, any> = {}
): Record<string, boolean> {
  const newOptions: Record<string, boolean> = {};
  
  // Skip if no options to work with
  if (!question.options || question.options.length === 0) {
    return newOptions;
  }
  
  // Debug para questões específicas
  if (['emergencyPreferences', 'highRiskComplications', 'lowRiskOccurrences'].includes(questionId)) {
    console.log(`initializeQuestionOptions para: ${questionId}`);
    console.log(`Questionário tem resposta:`, !!questionnaireAnswers[questionId]);
    
    if (questionnaireAnswers[questionId]) {
      console.log(`Tipo da resposta:`, typeof questionnaireAnswers[questionId]);
      console.log(`Valor da resposta:`, questionnaireAnswers[questionId]);
    }
  }
  
  // Initialize options from questionnaire answers
  question.options.forEach((option: string) => {
    let isSelected = false;
    
    // For checkbox questions
    if (question.type === 'checkbox' && 
        typeof questionnaireAnswers[questionId] === 'object' && 
        !Array.isArray(questionnaireAnswers[questionId])) {
      // Tratar explicitamente undefined como false
      isSelected = questionnaireAnswers[questionId]?.[option] === true;
      
      // Debug para campos específicos
      if (['emergencyPreferences', 'highRiskComplications', 'lowRiskOccurrences'].includes(questionId)) {
        console.log(`Opção ${option}: ${isSelected} (valor original: ${questionnaireAnswers[questionId]?.[option]})`);
      }
    } 
    // For radio/select questions
    else if ((question.type === 'radio' || question.type === 'select') && 
        questionnaireAnswers[questionId] !== undefined) {
      isSelected = questionnaireAnswers[questionId] === option;
    }
    
    newOptions[option] = isSelected;
  });
  
  return newOptions;
}

/**
 * Updates selection state for a question with either single or multiple selection
 */
export function updateSelectionState(
  questionId: string,
  option: string,
  checked: boolean,
  currentSelections: Record<string, Record<string, boolean>>,
  isSingleSelection: boolean,
  isSpecialField: boolean = false
): Record<string, Record<string, boolean>> {
  // Create a copy of the current state
  const newSelectedOptions = { ...currentSelections };
  
  // Initialize the question entry if it doesn't exist
  if (!newSelectedOptions[questionId]) {
    newSelectedOptions[questionId] = {};
  }
  
  // For radio buttons (single selection), uncheck all other options first
  if (isSingleSelection && !isSpecialField) {
    Object.keys(newSelectedOptions[questionId] || {}).forEach(opt => {
      newSelectedOptions[questionId][opt] = false;
    });
  }
  
  // Set the selected option
  newSelectedOptions[questionId][option] = checked;
  
  // Debug para campos especiais
  if (['emergencyPreferences', 'highRiskComplications', 'lowRiskOccurrences'].includes(questionId)) {
    console.log(`Atualização final para ${questionId}/${option}:`, checked);
    console.log(`Estado atualizado:`, newSelectedOptions[questionId]);
  }
  
  return newSelectedOptions;
}
