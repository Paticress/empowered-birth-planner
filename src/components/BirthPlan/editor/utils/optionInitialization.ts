
/**
 * Utility functions for initializing options from questionnaire answers and birth plan
 */
import { getRelevantQuestionsForField } from './questionRelevance';
import { parseCurrentFieldOptions } from './optionParsing';
import { getAlwaysShowAddButtonFields } from './fieldConfig';

/**
 * Initializes the selection state based on the current field value and questionnaire answers
 */
export const initializeOptionsFromCurrentField = (
  fieldKey: string, 
  sectionId: string, 
  birthPlan: Record<string, any>,
  questionnaireAnswers: Record<string, any>
) => {
  // Debug logging
  console.log(`Initializing options for field: ${fieldKey} in section: ${sectionId}`);
  
  // Get relevant questions specific to this field
  const relevantQuestions = getRelevantQuestionsForField(fieldKey, questionnaireAnswers);
  console.log(`Found ${relevantQuestions.length} relevant questions`);
  
  // Get options already selected in the current field
  const currentFieldOptions = parseCurrentFieldOptions(fieldKey, sectionId, birthPlan);
  console.log(`Current field options: `, currentFieldOptions);
  
  const initialSelectedOptions: Record<string, Record<string, boolean>> = {};
  
  // Special fields that need special handling
  const specialFields = getAlwaysShowAddButtonFields();
  const isSpecialField = specialFields.includes(fieldKey);
  
  // Process each relevant question
  relevantQuestions.forEach(({ question }) => {
    if (!question) {
      console.error("Undefined question found during initialization");
      return;
    }
    
    const questionId = question.id;
    initialSelectedOptions[questionId] = {};
    
    // Skip textarea initialization
    if (question.type === 'textarea') {
      return;
    }
    
    if (!question.options) {
      console.error(`Question ${questionId} doesn't have defined options`);
      return;
    }
    
    // Initialize from current field value + questionnaire
    question.options.forEach((option: string) => {
      let isSelected = false;
      
      // First check if the option is already selected in the current field
      if (currentFieldOptions.includes(option)) {
        isSelected = true;
        console.log(`Option "${option}" found in current field value`);
      } 
      // If not in current field, check questionnaire answers
      else if (question.type === 'checkbox' && 
          typeof questionnaireAnswers[questionId] === 'object' && 
          !Array.isArray(questionnaireAnswers[questionId])) {
        isSelected = !!questionnaireAnswers[questionId]?.[option];
      } 
      // For radio/select questions
      else if ((question.type === 'radio' || question.type === 'select') && 
          questionnaireAnswers[questionId] !== undefined) {
        isSelected = questionnaireAnswers[questionId] === option;
      }
      
      initialSelectedOptions[questionId][option] = isSelected;
    });
  });
  
  console.log(`Initialized options for ${fieldKey}:`, initialSelectedOptions);
  return initialSelectedOptions;
};
