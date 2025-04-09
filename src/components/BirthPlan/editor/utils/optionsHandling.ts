
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
  // Log for debugging
  console.log(`Initializing options for field: ${fieldKey} in section: ${sectionId}`);
  console.log("Questionnaire answers:", questionnaireAnswers);
  
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
  
  // Log relevant questions for debugging
  console.log(`Relevant questions for ${fieldKey}:`, relevantQuestions.map(q => q.question.id));
  
  relevantQuestions.forEach(({ question }) => {
    const questionId = question.id;
    initialSelectedOptions[questionId] = {};
    
    // Handle textarea type questions
    if (question.type === 'textarea') {
      // For textarea, if we have a value in the questionnaire answers, we should use it
      if (questionnaireAnswers[questionId]) {
        console.log(`Found textarea answer for ${questionId}:`, questionnaireAnswers[questionId]);
      }
      return; // Skip option selection for textarea
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
          console.log(`Checkbox option ${option} for ${questionId} selected:`, isSelected);
        }
        
        // For radio questions (where the answer is a single string)
        if ((question.type === 'radio' || question.type === 'select') && 
            questionnaireAnswers[questionId] !== undefined) {
          // For special fields or radio/select questions, check the questionnaire answer
          if (isSpecialField || (fieldKey === question.id)) {
            isSelected = questionnaireAnswers[questionId] === option;
            console.log(`Radio/select option ${option} for ${questionId} selected:`, isSelected);
          }
        }
        
        initialSelectedOptions[questionId][option] = isSelected;
      });
    }
  });
  
  console.log(`Initialized options for ${fieldKey}:`, initialSelectedOptions);
  return initialSelectedOptions;
};
