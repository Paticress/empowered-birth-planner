
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
  
  // Get the list of special fields that need special handling
  const specialFields = getSpecialFields();
  
  const isSpecialField = specialFields.includes(fieldKey);
  
  console.log(`Initializing options for field: ${fieldKey}`);
  console.log(`Is special field: ${isSpecialField}`);
  console.log(`Questionnaire answers:`, questionnaireAnswers);
  
  relevantQuestions.forEach(({ question }) => {
    const questionId = question.id;
    initialSelectedOptions[questionId] = {};
    
    console.log(`Processing question: ${questionId}, type: ${question.type}`);
    
    // Handle textarea type questions
    if (question.type === 'textarea') {
      if (questionnaireAnswers[questionId]) {
        console.log(`Found textarea answer for ${questionId}:`, questionnaireAnswers[questionId]);
      }
      return;
    }
    
    if (question.options) {
      question.options.forEach((option: string) => {
        let isSelected = currentFieldOptions.includes(option);
        
        // For checkbox questions (where answers are stored as objects)
        if (question.type === 'checkbox' && 
            typeof questionnaireAnswers[questionId] === 'object' && 
            !Array.isArray(questionnaireAnswers[questionId])) {
          // Check if this specific option is selected in the questionnaire
          isSelected = !!questionnaireAnswers[questionId]?.[option];
          console.log(`Checkbox option ${option} for ${questionId}: ${isSelected}`);
        }
        
        // For radio questions (where the answer is a single string)
        if (question.type === 'radio' || question.type === 'select') {
          // For special fields or direct field-to-question mapping, check questionnaire answers
          if (isSpecialField || fieldKey === questionId) {
            if (questionnaireAnswers[questionId] === option) {
              isSelected = true;
              console.log(`Radio option ${option} selected from questionnaire for ${questionId}`);
            }
            
            // Also check if the option is in the current birth plan value
            if (currentFieldOptions.includes(option)) {
              isSelected = true;
              console.log(`Radio option ${option} found in existing birth plan for ${questionId}`);
            }
          }
        }
        
        initialSelectedOptions[questionId][option] = isSelected;
      });
    }
  });
  
  console.log("Initial selected options:", initialSelectedOptions);
  
  return initialSelectedOptions;
};

/**
 * Returns the list of fields that need special handling for options
 */
export const getSpecialFields = (): string[] => {
  return [
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
};

/**
 * Pre-fills field content from questionnaire answers
 */
export const prefillFieldFromQuestionnaire = (
  fieldKey: string,
  questionnaireAnswers: Record<string, any>,
  localBirthPlan: Record<string, any>,
  setLocalBirthPlan: React.Dispatch<React.SetStateAction<Record<string, any>>>,
  sectionId: string
) => {
  // Get the list of special fields that need special handling
  const specialFields = getSpecialFields();
  const isSpecialField = specialFields.includes(fieldKey);
  
  // Skip if this field already has content
  if (localBirthPlan[sectionId]?.[fieldKey]) {
    console.log(`Field ${fieldKey} already has content, skipping prefill`);
    return;
  }
  
  const relevantQuestions = getRelevantQuestionsForField(fieldKey, questionnaireAnswers);
  if (relevantQuestions.length === 0) {
    console.log(`No relevant questions found for ${fieldKey}`);
    return;
  }
  
  console.log(`Prefilling field ${fieldKey} from questionnaire`);
  
  // Special handling for textarea questions
  if (fieldKey === 'unexpectedScenarios' && questionnaireAnswers['unexpectedScenarios']) {
    // Direct mapping for text fields
    const updatedPlan = { ...localBirthPlan };
    if (!updatedPlan[sectionId]) {
      updatedPlan[sectionId] = {};
    }
    updatedPlan[sectionId][fieldKey] = questionnaireAnswers['unexpectedScenarios'] || '';
    setLocalBirthPlan(updatedPlan);
    return;
  }
  
  // Initialize selected options for this field
  const selectedOptions = initializeOptionsFromCurrentField(fieldKey, sectionId, localBirthPlan, questionnaireAnswers);
  
  // Check if we have any selected options
  let hasSelectedOptions = false;
  Object.values(selectedOptions).forEach(questionOptions => {
    if (Object.values(questionOptions).some(isSelected => isSelected)) {
      hasSelectedOptions = true;
    }
  });
  
  if (!hasSelectedOptions) {
    console.log(`No selected options found for ${fieldKey}`);
    return;
  }
  
  // Format the selected options for the field
  const formattedOptions: Record<string, string[]> = {};
  
  Object.entries(selectedOptions).forEach(([questionId, options]) => {
    formattedOptions[questionId] = [];
    Object.entries(options).forEach(([option, isSelected]) => {
      if (isSelected) {
        formattedOptions[questionId].push(option);
      }
    });
  });
  
  // Build the field value based on the selected options
  let fieldValue = '';
  
  if (isSpecialField) {
    // For special fields, just list all selected options
    const allOptions: string[] = [];
    Object.values(formattedOptions).forEach(options => {
      allOptions.push(...options);
    });
    
    if (allOptions.length > 0) {
      fieldValue = allOptions.join(', ');
    }
  } else {
    // For regular fields, format with question prefixes
    const formattedLines: string[] = [];
    
    Object.entries(formattedOptions).forEach(([questionId, options]) => {
      if (options.length > 0) {
        const questionInfo = findQuestionById(questionId);
        if (questionInfo) {
          // Create a prefix from the question text, shortened if needed
          const questionText = questionInfo.question.text;
          const prefix = questionText.length > 30 
            ? questionText.substring(0, 30) + '...'
            : questionText;
            
          formattedLines.push(`${prefix}: ${options.join(', ')}`);
        } else {
          formattedLines.push(options.join(', '));
        }
      }
    });
    
    if (formattedLines.length > 0) {
      fieldValue = formattedLines.join('\n\n');
    }
  }
  
  // Update the birth plan with the formatted value
  if (fieldValue) {
    console.log(`Setting field ${fieldKey} to:`, fieldValue);
    
    const updatedPlan = { ...localBirthPlan };
    if (!updatedPlan[sectionId]) {
      updatedPlan[sectionId] = {};
    }
    updatedPlan[sectionId][fieldKey] = fieldValue;
    setLocalBirthPlan(updatedPlan);
  }
};

