
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
  
  // Special fields that should always show their related questions
  const alwaysShowFields = [
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
  
  const isSpecialField = alwaysShowFields.includes(fieldKey);
  
  for (const section of questionnaireSections) {
    for (const question of section.questions) {
      if (relevantQuestionIds.includes(question.id)) {
        // For special fields, always include the question
        if (isSpecialField) {
          relevantQuestions.push({
            question,
            sectionId: section.id
          });
          continue;
        }
        
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
                   question.type === 'select' ||
                   question.type === 'textarea') {
          // Always include radio/select/textarea type questions even without previous answers
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
