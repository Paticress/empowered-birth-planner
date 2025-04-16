
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
  console.log(`Getting relevant questions for field: ${fieldKey}`);
  
  // Special field handling - hardcoded mappings for problematic fields
  // Ensure these special fields ALWAYS have exact 1:1 mappings
  const specialFieldMappings: Record<string, string[]> = {
    'emergencyScenarios': ['emergencyPreferences'],
    'highRiskComplications': ['highRiskComplications'],
    'lowRiskOccurrences': ['lowRiskOccurrences']
  };
  
  // If this is a special field, use the hardcoded mapping
  if (specialFieldMappings[fieldKey]) {
    console.log(`Using special mapping for ${fieldKey}:`, specialFieldMappings[fieldKey]);
    
    const relevantQuestions: Array<{question: any, sectionId: string}> = [];
    const specialQuestionIds = specialFieldMappings[fieldKey];
    
    // Find the questions from the questionnaire sections
    for (const section of questionnaireSections) {
      for (const question of section.questions) {
        if (specialQuestionIds.includes(question.id)) {
          console.log(`Found special question ${question.id} for field ${fieldKey} in section ${section.id}`);
          
          // CRITICAL FIX: Ensure the question is treated as a checkbox type
          // This ensures consistent handling across the application
          const enhancedQuestion = {
            ...question,
            type: 'checkbox'  // Force checkbox type for special fields
          };
          
          relevantQuestions.push({
            question: enhancedQuestion,
            sectionId: section.id
          });
        }
      }
    }
    
    if (relevantQuestions.length > 0) {
      console.log(`Returning ${relevantQuestions.length} special questions for ${fieldKey}`);
      return relevantQuestions;
    }
  }
  
  // Get the list of question IDs that are relevant for this specific field
  const relevantQuestionIds = fieldToQuestionMap[fieldKey] || [];
  
  // If no relevant questions are mapped to this field, return empty array
  if (relevantQuestionIds.length === 0) {
    console.log(`No question IDs mapped to field ${fieldKey}`);
    return [];
  }
  
  console.log(`Found ${relevantQuestionIds.length} mapped question IDs for ${fieldKey}:`, relevantQuestionIds);
  
  const relevantQuestions: Array<{question: any, sectionId: string}> = [];
  
  // Special fields that should always show their related questions
  const alwaysShowFields = getAlwaysShowAddButtonFields();
  const isSpecialField = alwaysShowFields.includes(fieldKey);
  
  // Find the relevant questions from all questionnaire sections
  for (const section of questionnaireSections) {
    for (const question of section.questions) {
      // Only include questions that are specifically mapped to this field
      if (relevantQuestionIds.includes(question.id)) {
        // Log for debugging
        console.log(`Found question ${question.id} (${question.text}) for field ${fieldKey} in section ${section.id}`);
        
        // For special question IDs, always ensure they're treated as checkboxes
        let processedQuestion = question;
        if (['emergencyPreferences', 'highRiskComplications', 'lowRiskOccurrences'].includes(question.id)) {
          processedQuestion = {
            ...question,
            type: 'checkbox'  // Force checkbox type
          };
          console.log(`Forcing checkbox type for special question ${question.id}`);
        }
        
        // Add the question to relevant questions
        relevantQuestions.push({
          question: processedQuestion,
          sectionId: section.id
        });
      }
    }
  }
  
  console.log(`Found total ${relevantQuestions.length} relevant questions for ${fieldKey}`);
  return relevantQuestions;
};
