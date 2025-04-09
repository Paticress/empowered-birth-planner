
import { parseOptionsFromText } from '../../utils/birthPlanUtils';
import { findQuestionById } from './fieldMapping';
import { getRelevantQuestionsForField } from './questionRelevance';
import { getAlwaysShowAddButtonFields } from './fieldConfig';

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
  
  // Get relevant questions specific to this field
  const relevantQuestions = getRelevantQuestionsForField(fieldKey, questionnaireAnswers);
  
  const initialSelectedOptions: Record<string, Record<string, boolean>> = {};
  
  // Special fields that need special handling
  const specialFields = getAlwaysShowAddButtonFields();
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
        let isSelected = false;
        
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
          // Check if this option matches the questionnaire answer
          isSelected = questionnaireAnswers[questionId] === option;
          console.log(`Radio/select option ${option} for ${questionId} selected:`, isSelected);
        }
        
        initialSelectedOptions[questionId][option] = isSelected;
      });
    }
  });
  
  console.log(`Initialized options for ${fieldKey}:`, initialSelectedOptions);
  return initialSelectedOptions;
};

/**
 * Formats the field value based on questionnaire answers for special fields
 */
export const formatFieldValueFromQuestionnaire = (
  fieldKey: string,
  questionnaireAnswers: Record<string, any>
) => {
  const relevantQuestions = getRelevantQuestionsForField(fieldKey, questionnaireAnswers);
  const specialFields = getAlwaysShowAddButtonFields();
  
  if (!specialFields.includes(fieldKey) || relevantQuestions.length === 0) {
    return null;
  }
  
  const formattedValues: string[] = [];
  
  relevantQuestions.forEach(({ question }) => {
    const questionId = question.id;
    const answer = questionnaireAnswers[questionId];
    
    if (answer === undefined || answer === null || answer === '') {
      return;
    }
    
    if (question.type === 'textarea') {
      if (typeof answer === 'string' && answer.trim() !== '') {
        // For textarea, use the full text as is without prefixes
        formattedValues.push(answer.trim());
      }
    } else if (question.type === 'checkbox') {
      if (typeof answer === 'object' && !Array.isArray(answer)) {
        // For checkboxes, get all selected options
        const selectedOptions = Object.entries(answer)
          .filter(([_, isSelected]) => isSelected)
          .map(([option]) => option);
          
        if (selectedOptions.length > 0) {
          // Don't include the question text as prefix, just add the options
          formattedValues.push(selectedOptions.join(', '));
        }
      }
    } else if (question.type === 'radio' || question.type === 'select') {
      if (typeof answer === 'string' && answer.trim() !== '') {
        // For radio/select, just add the selected option without prefixes
        formattedValues.push(answer);
      }
    }
  });
  
  return formattedValues.length > 0 ? formattedValues.join('\n\n') : null;
};
