
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
  
  relevantQuestions.forEach(({ question }) => {
    const questionId = question.id;
    initialSelectedOptions[questionId] = {};
    
    if (question.options) {
      question.options.forEach((option: string) => {
        let isSelected = currentFieldOptions.includes(option);
        
        // For checkbox questions (where answers are stored as objects)
        if (typeof questionnaireAnswers[questionId] === 'object' && 
            !Array.isArray(questionnaireAnswers[questionId]) && 
            questionnaireAnswers[questionId]?.[option]) {
          isSelected = true;
        }
        
        // For radio questions (where the answer is a single string)
        if (typeof questionnaireAnswers[questionId] === 'string' &&
            questionnaireAnswers[questionId] === option) {
          isSelected = true;
        }
        
        initialSelectedOptions[questionId][option] = isSelected;
      });
    }
  });
  
  return initialSelectedOptions;
};
