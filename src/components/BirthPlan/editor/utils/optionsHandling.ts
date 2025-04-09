
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
  console.log(`Questionnaire answers keys:`, Object.keys(questionnaireAnswers));
  
  // Get relevant questions specific to this field only
  const relevantQuestions = getRelevantQuestionsForField(fieldKey, questionnaireAnswers);
  
  const initialSelectedOptions: Record<string, Record<string, boolean>> = {};
  
  // Special fields that need special handling
  const specialFields = getAlwaysShowAddButtonFields();
  const isSpecialField = specialFields.includes(fieldKey);
  
  // Special debug for problematic fields
  if (['emergencyScenarios', 'highRiskComplications', 'lowRiskOccurrences'].includes(fieldKey)) {
    console.log(`Initializing special field: ${fieldKey}`);
    console.log(`Found ${relevantQuestions.length} relevant questions:`);
    
    relevantQuestions.forEach(q => {
      console.log(`- Question ${q.question?.id}: ${q.question?.text}`);
      if (q.question?.id) {
        console.log(`- Has answer:`, !!questionnaireAnswers[q.question.id]);
        console.log(`- Answer type:`, typeof questionnaireAnswers[q.question.id]);
        console.log(`- Answer:`, questionnaireAnswers[q.question.id]);
      }
    });
  }
  
  // Process each relevant question
  relevantQuestions.forEach(({ question }) => {
    if (!question) {
      console.error("Found undefined question during initialization");
      return;
    }
    
    const questionId = question.id;
    initialSelectedOptions[questionId] = {};
    
    // Debug for special fields
    if (['emergencyPreferences', 'highRiskComplications', 'lowRiskOccurrences'].includes(questionId)) {
      console.log(`Processing special question: ${questionId}`);
      console.log(`Question has answer:`, !!questionnaireAnswers[questionId]);
      console.log(`Answer type:`, typeof questionnaireAnswers[questionId]);
      
      // If this is a special field with a checkbox-style object answer
      if (questionnaireAnswers[questionId] && typeof questionnaireAnswers[questionId] === 'object') {
        console.log(`Object answer:`, questionnaireAnswers[questionId]);
        Object.entries(questionnaireAnswers[questionId]).forEach(([key, value]) => {
          console.log(`Option "${key}": ${value ? 'selected' : 'not selected'}`);
        });
      }
    }
    
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
          
          // Debug for special fields
          if (['emergencyPreferences', 'highRiskComplications', 'lowRiskOccurrences'].includes(questionId)) {
            console.log(`Checkbox option "${option}" selected:`, isSelected);
          }
        }
        
        // For radio questions (where the answer is a single string)
        if ((question.type === 'radio' || question.type === 'select') && 
            questionnaireAnswers[questionId] !== undefined) {
          // Check if this option matches the questionnaire answer
          isSelected = questionnaireAnswers[questionId] === option;
          
          // Debug for special fields
          if (['emergencyPreferences', 'highRiskComplications', 'lowRiskOccurrences'].includes(questionId)) {
            console.log(`Radio option "${option}" selected:`, isSelected, `(answer: "${questionnaireAnswers[questionId]}")`);
          }
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
  
  if (formattedValues.length > 0) {
    console.log(`Formatted values for ${fieldKey}:`, formattedValues);
    return formattedValues.join('\n\n');
  }
  
  return null;
};
