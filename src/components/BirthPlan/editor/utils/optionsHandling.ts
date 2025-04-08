
import { parseOptionsFromText } from '../../utils/birthPlanUtils';
import { findQuestionById } from './fieldMapping';
import { getRelevantQuestionsForField } from './questionRelevance';

/**
 * Parses options from the current field value in the birth plan
 */
export const parseCurrentFieldOptions = (fieldKey: string, sectionId: string, birthPlan: Record<string, any>): string[] => {
  if (!birthPlan[sectionId] || !birthPlan[sectionId][fieldKey]) {
    return [];
  }
  const currentValue = birthPlan[sectionId][fieldKey] || '';
  return parseOptionsFromText(currentValue);
};

/**
 * Initializes the options selection state from the current field value and questionnaire answers
 */
export const initializeOptionsFromCurrentField = (
  fieldKey: string, 
  sectionId: string, 
  birthPlan: Record<string, any>,
  questionnaireAnswers: Record<string, any>
) => {
  const currentFieldOptions = parseCurrentFieldOptions(fieldKey, sectionId, birthPlan);
  const relevantQuestions = getRelevantQuestionsForField(fieldKey, questionnaireAnswers);
  
  const initialSelectedOptions: Record<string, Record<string, boolean>> = {};
  
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
  
  const isSpecialField = specialFields.includes(fieldKey);
  
  relevantQuestions.forEach(({ question }) => {
    const questionId = question.id;
    initialSelectedOptions[questionId] = {};
    
    // Handle textarea type questions
    if (question.type === 'textarea') {
      // For textarea, we don't have options to select
      // We'll just check if there's a value in the questionnaire answers
      if (questionnaireAnswers[questionId]) {
        return; // Skip option selection for textarea
      }
      return;
    }
    
    if (question.options) {
      question.options.forEach((option: string) => {
        let isSelected = currentFieldOptions.includes(option);
        
        // For checkbox questions (where answers are stored as objects)
        if (question.type === 'checkbox' && 
            typeof questionnaireAnswers[questionId] === 'object' && 
            !Array.isArray(questionnaireAnswers[questionId])) {
          // Check if this specific option is selected in the questionnaire
          isSelected = !!questionnaireAnswers[questionId]?.[option];
        }
        
        // For radio questions (where the answer is a single string)
        if (question.type === 'radio' || question.type === 'select') {
          // For special fields or radio/select questions, check the questionnaire answer
          if (isSpecialField || (fieldKey === question.id)) {
            isSelected = questionnaireAnswers[questionId] === option;
          }
        }
        
        initialSelectedOptions[questionId][option] = isSelected;
      });
    }
  });
  
  return initialSelectedOptions;
};
