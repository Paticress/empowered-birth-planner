
/**
 * Utility functions for formatting field values based on questionnaire answers
 */
import { getRelevantQuestionsForField } from './questionRelevance';
import { getAlwaysShowAddButtonFields } from './fieldConfig';

/**
 * Formats the field value based on questionnaire answers for special fields
 */
export const formatFieldValueFromQuestionnaire = (
  fieldKey: string,
  questionnaireAnswers: Record<string, any>
) => {
  // Special field DEBUG
  if (['emergencyScenarios', 'highRiskComplications', 'lowRiskOccurrences'].includes(fieldKey)) {
    console.log(`Formatting special field: ${fieldKey}`);
    console.log(`Questionnaire answers keys:`, Object.keys(questionnaireAnswers));
    
    // Check if we have the corresponding answer
    const questionIds = {
      'emergencyScenarios': 'emergencyPreferences',
      'highRiskComplications': 'highRiskComplications',
      'lowRiskOccurrences': 'lowRiskOccurrences'
    };
    
    const correspondingQuestionId = questionIds[fieldKey as keyof typeof questionIds];
    console.log(`Corresponding question ID: ${correspondingQuestionId}`);
    console.log(`Has answer:`, !!questionnaireAnswers[correspondingQuestionId]);
    if (questionnaireAnswers[correspondingQuestionId]) {
      console.log(`Answer type:`, typeof questionnaireAnswers[correspondingQuestionId]);
      console.log(`Answer value:`, questionnaireAnswers[correspondingQuestionId]);
    }
  }
  
  // Only get questions that are relevant to this specific field
  const relevantQuestions = getRelevantQuestionsForField(fieldKey, questionnaireAnswers);
  const specialFields = getAlwaysShowAddButtonFields();
  
  if (!specialFields.includes(fieldKey) || relevantQuestions.length === 0) {
    return null;
  }
  
  console.log(`Formatting values for field: ${fieldKey}`);
  console.log(`Found ${relevantQuestions.length} relevant questions`);
  
  const formattedValues: string[] = [];
  
  // Debug each relevant question
  relevantQuestions.forEach(({ question }) => {
    if (!question) {
      console.error("Found undefined question during formatting");
      return;
    }
    
    const questionId = question.id;
    const answer = questionnaireAnswers[questionId];
    
    console.log(`Checking question ${questionId}, answer type:`, typeof answer);
    
    if (answer === undefined || answer === null || answer === '') {
      console.log(`No answer for question ${questionId}`);
      return;
    }
    
    if (question.type === 'textarea') {
      if (typeof answer === 'string' && answer.trim() !== '') {
        // For textarea, use the full text as is without prefixes
        formattedValues.push(answer.trim());
      }
    } else if (question.type === 'checkbox') {
      if (typeof answer === 'object' && !Array.isArray(answer)) {
        // Para checkboxes, obter opções selecionadas, tratando valores undefined como falsos
        const selectedOptions = Object.entries(answer)
          .filter(([_, isSelected]) => isSelected === true) // Verificar explicitamente se é true
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
  
  if (formattedValues.length > 0) {
    console.log(`Formatted values for ${fieldKey}:`, formattedValues);
    return formattedValues.join('\n\n');
  }
  
  return null;
};
