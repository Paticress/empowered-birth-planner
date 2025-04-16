
import { SPECIAL_FIELD_IDS, SpecialFieldId } from './types';
import { findQuestionById } from './fieldMapping';

/**
 * Special handler for the problematic special fields
 * Ensures consistent behavior for fields that need to be treated as checkboxes
 */

/**
 * Converts questionnaire answers for special fields into a formatted string
 */
export function formatSpecialFieldFromQuestionnaire(
  questionId: SpecialFieldId, 
  questionnaireAnswers: Record<string, any>
): string {
  console.log(`Formatting special field ${questionId} from questionnaire`);
  
  if (!questionnaireAnswers[questionId]) {
    console.log(`No questionnaire answers for ${questionId}`);
    return '';
  }
  
  // Get the question to access its options
  const questionInfo = findQuestionById(questionId);
  if (!questionInfo || !questionInfo.question) {
    console.warn(`Question not found for ID: ${questionId}`);
    return '';
  }
  
  const { question } = questionInfo;
  
  // Handle the case where answers are stored as an object (checkbox-style)
  if (typeof questionnaireAnswers[questionId] === 'object') {
    const selectedOptions = Object.entries(questionnaireAnswers[questionId])
      .filter(([_, selected]) => !!selected)
      .map(([option]) => option);
    
    console.log(`Found ${selectedOptions.length} selected options for ${questionId}:`, selectedOptions);
    
    if (selectedOptions.length === 0) {
      return '';
    }
    
    // Return comma-separated options
    return selectedOptions.join(', ');
  }
  
  // Handle the case where answer is a single value (radio/select)
  if (typeof questionnaireAnswers[questionId] === 'string') {
    return questionnaireAnswers[questionId];
  }
  
  console.warn(`Unexpected answer format for ${questionId}:`, questionnaireAnswers[questionId]);
  return '';
}

/**
 * Initializes options for a special field from questionnaire answers
 */
export function initializeSpecialFieldOptions(
  questionId: SpecialFieldId,
  questionnaireAnswers: Record<string, any>
): Record<string, boolean> {
  console.log(`Initializing options for special field ${questionId}`);
  
  const questionInfo = findQuestionById(questionId);
  if (!questionInfo || !questionInfo.question) {
    console.warn(`Question not found for ID: ${questionId}`);
    return {};
  }
  
  const { question } = questionInfo;
  const options: Record<string, boolean> = {};
  
  // If this question has options, process them
  if (question.options && Array.isArray(question.options)) {
    question.options.forEach(option => {
      let isSelected = false;
      
      // Check if this option is selected in the questionnaire answers
      if (typeof questionnaireAnswers[questionId] === 'object') {
        isSelected = !!questionnaireAnswers[questionId]?.[option];
      } else if (questionnaireAnswers[questionId] === option) {
        isSelected = true;
      }
      
      options[option] = isSelected;
    });
  }
  
  console.log(`Initialized options for ${questionId}:`, options);
  return options;
}

/**
 * Parses the current field value to initialize options
 */
export function parseSpecialFieldCurrentValue(
  fieldValue: string
): Record<string, boolean> {
  console.log(`Parsing current field value: "${fieldValue}"`);
  
  if (!fieldValue) {
    return {};
  }
  
  const options: Record<string, boolean> = {};
  
  // Split by comma and trim each option
  const selectedOptions = fieldValue.split(',').map(opt => opt.trim());
  
  // Mark each option as selected
  selectedOptions.forEach(option => {
    if (option) {
      options[option] = true;
    }
  });
  
  console.log(`Parsed options from field value:`, options);
  return options;
}

/**
 * Merges options from questionnaire and current field value
 */
export function mergeSpecialFieldOptions(
  questionId: SpecialFieldId,
  questionnaireAnswers: Record<string, any>,
  currentFieldValue: string
): Record<string, boolean> {
  // Get options from questionnaire
  const questionnaireOptions = initializeSpecialFieldOptions(questionId, questionnaireAnswers);
  
  // Get options from current field value
  const currentOptions = parseSpecialFieldCurrentValue(currentFieldValue);
  
  // Merge options, prioritizing current field value
  const mergedOptions = { ...questionnaireOptions, ...currentOptions };
  
  return mergedOptions;
}

/**
 * Validates if a question ID is a special field
 */
export function isSpecialField(questionId: string): boolean {
  return SPECIAL_FIELD_IDS.includes(questionId as any);
}
