
import { questionnaireSections } from '../../questionnaire';
import { fieldToQuestionMap, questionToFieldMap } from './fieldMapping';
import { getAlwaysShowAddButtonFields } from './fieldConfig';
import { getSpecialFields } from './optionsHandling';

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
  
  // Always show for special fields
  const specialFields = getSpecialFields();
  if (specialFields.includes(fieldKey)) {
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
  const specialFields = getSpecialFields();
  
  const isSpecialField = specialFields.includes(fieldKey);
  
  // For debugging
  console.log(`Getting relevant questions for field: ${fieldKey}`);
  console.log(`Is special field: ${isSpecialField}`);
  console.log(`Relevant question IDs: ${relevantQuestionIds.join(', ')}`);
  
  // Check if this field directly maps to a question ID in the questionnaire
  const directFieldMappingExists = Object.values(questionToFieldMap).includes(fieldKey);
  
  for (const section of questionnaireSections) {
    for (const question of section.questions) {
      // Check if this question directly maps to the field
      const questionMapsToField = fieldKey === questionToFieldMap[question.id];
      
      if (relevantQuestionIds.includes(question.id) || questionMapsToField) {
        // For special fields, always include the question regardless of answers
        if (isSpecialField || questionMapsToField) {
          console.log(`Including question ${question.id} for special field ${fieldKey}`);
          relevantQuestions.push({
            question,
            sectionId: section.id
          });
          continue;
        }
        
        // Check if there are answers for this question
        const hasAnswer = questionnaireAnswers[question.id] !== undefined;
        console.log(`Question ${question.id} has answer: ${hasAnswer}`);
        
        // For checkbox type questions, check if any option was selected
        if (question.type === 'checkbox' && typeof questionnaireAnswers[question.id] === 'object') {
          const checkboxAnswers = questionnaireAnswers[question.id];
          const hasAnySelection = Object.values(checkboxAnswers).some(value => !!value);
          
          console.log(`Checkbox ${question.id} has selections: ${hasAnySelection}`);
          
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
  
  // Special case for cascadeInterventions, emergencyScenarios, highRiskComplications, lowRiskOccurrences
  // Ensure these fields always have their questions available
  if (fieldKey === 'cascadeInterventions' || 
      fieldKey === 'emergencyScenarios' || 
      fieldKey === 'highRiskComplications' || 
      fieldKey === 'lowRiskOccurrences' ||
      fieldKey === 'painRelief' ||
      fieldKey === 'interventionsRoutine' ||
      fieldKey === 'consentimentoInformado' ||
      fieldKey === 'unexpectedScenarios') {
    
    // If no questions were found, try to find them by ID
    if (relevantQuestions.length === 0) {
      for (const section of questionnaireSections) {
        for (const question of section.questions) {
          if (question.id === fieldKey || questionToFieldMap[question.id] === fieldKey) {
            console.log(`Found direct matching question ${question.id} for field ${fieldKey}`);
            relevantQuestions.push({
              question,
              sectionId: section.id
            });
            break;
          }
        }
      }
    }
  }
  
  // Log the result for debugging
  console.log(`Found ${relevantQuestions.length} relevant questions for field ${fieldKey}`);
  
  return relevantQuestions;
};
