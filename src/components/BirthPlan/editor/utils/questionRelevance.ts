
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
 * This is a critical function that ensures each field only gets its own related questions
 */
export const getRelevantQuestionsForField = (
  fieldKey: string, 
  questionnaireAnswers: Record<string, any> = {}
) => {
  // Get the list of question IDs that are relevant for this specific field
  const relevantQuestionIds = fieldToQuestionMap[fieldKey] || [];
  
  // If no relevant questions are mapped to this field, return empty array
  if (relevantQuestionIds.length === 0) {
    return [];
  }
  
  const relevantQuestions: Array<{question: any, sectionId: string}> = [];
  
  // Special fields that should always show their related questions
  const alwaysShowFields = getAlwaysShowAddButtonFields();
  const isSpecialField = alwaysShowFields.includes(fieldKey);
  
  // Debug log for special fields
  if (isSpecialField) {
    console.log(`Getting relevant questions for special field: ${fieldKey}`);
    console.log(`Mapped questions IDs:`, relevantQuestionIds);
  }
  
  // Find the relevant questions from all questionnaire sections
  for (const section of questionnaireSections) {
    for (const question of section.questions) {
      // Only include questions that are specifically mapped to this field
      if (relevantQuestionIds.includes(question.id)) {
        // For special fields, always include the question regardless of previous answer
        if (isSpecialField) {
          // Check if there's an answer for this question
          const hasAnswer = 
            questionnaireAnswers[question.id] !== undefined && 
            questionnaireAnswers[question.id] !== null && 
            questionnaireAnswers[question.id] !== "";
          
          if (isSpecialField && hasAnswer) {
            console.log(`Found answer for special field ${fieldKey}, question ${question.id}:`, questionnaireAnswers[question.id]);
          }
          
          relevantQuestions.push({
            question,
            sectionId: section.id
          });
          continue;
        }
        
        // For all other fields, always show the questions
        relevantQuestions.push({
          question,
          sectionId: section.id
        });
      }
    }
  }
  
  if (isSpecialField) {
    console.log(`Found ${relevantQuestions.length} relevant questions for ${fieldKey}`);
  }
  
  return relevantQuestions;
};
