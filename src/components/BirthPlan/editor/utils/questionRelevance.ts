
import { questionnaireSections } from '../../questionnaire';
import { fieldToQuestionMap } from './fieldMapping';
import { getAlwaysShowAddButtonFields } from './fieldConfig';

/**
 * Determines if the field should show the "Add from Questionnaire" button
 */
export const shouldShowAddButton = (fieldKey: string, questionnaireAnswers: Record<string, any> = {}) => {
  const excludedFields = ['name', 'dueDate', 'healthProvider', 'hospital', 'companions'];
  
  if (excludedFields.includes(fieldKey)) {
    return false;
  }
  
  // Always show the button for these specific fields
  if (getAlwaysShowAddButtonFields().includes(fieldKey)) {
    return true;
  }
  
  const relevantQuestions = getRelevantQuestionsForField(fieldKey, questionnaireAnswers);
  return relevantQuestions.length > 0;
};

/**
 * Gets all relevant questions for a specific field
 */
export const getRelevantQuestionsForField = (
  fieldKey: string, 
  questionnaireAnswers: Record<string, any> = {}
) => {
  const relevantQuestionIds = fieldToQuestionMap[fieldKey] || [];
  
  const relevantQuestions: Array<{question: any, sectionId: string}> = [];
  
  for (const section of questionnaireSections) {
    for (const question of section.questions) {
      if (relevantQuestionIds.includes(question.id)) {
        // Check if there are answers for this question
        const hasAnswer = questionnaireAnswers[question.id] !== undefined;
        
        // For checkbox type questions, check if any option was selected
        if (question.type === 'checkbox' && typeof questionnaireAnswers[question.id] === 'object') {
          const checkboxAnswers = questionnaireAnswers[question.id];
          const hasAnySelection = Object.values(checkboxAnswers).some(value => !!value);
          
          if (hasAnySelection || !hasAnswer) {
            relevantQuestions.push({
              question,
              sectionId: section.id
            });
          }
        } else if (hasAnswer || 
                   getAlwaysShowAddButtonFields().includes(fieldKey) || 
                   question.type === 'radio' || 
                   question.type === 'select') {
          // Always include specific fields or radio/select type questions even without previous answers
          relevantQuestions.push({
            question,
            sectionId: section.id
          });
        }
      }
    }
  }
  
  return relevantQuestions;
};
