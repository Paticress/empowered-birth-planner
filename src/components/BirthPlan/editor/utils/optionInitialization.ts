
/**
 * Utility functions for initializing options from questionnaire answers and birth plan
 */
import { getRelevantQuestionsForField } from './questionRelevance';
import { parseCurrentFieldOptions } from './optionParsing';
import { getAlwaysShowAddButtonFields } from './fieldConfig';

/**
 * Initializes the selection state based on the current field value and questionnaire answers
 */
export const initializeOptionsFromCurrentField = (
  fieldKey: string, 
  sectionId: string, 
  birthPlan: Record<string, any>,
  questionnaireAnswers: Record<string, any>
) => {
  // Debug logging
  console.log(`Initializing options for field: ${fieldKey} in section: ${sectionId}`);
  
  // Get relevant questions specific to this field
  const relevantQuestions = getRelevantQuestionsForField(fieldKey, questionnaireAnswers);
  console.log(`Found ${relevantQuestions.length} relevant questions`);
  
  // Get options already selected in the current field
  const currentFieldOptions = parseCurrentFieldOptions(fieldKey, sectionId, birthPlan);
  console.log(`Current field options: `, currentFieldOptions);
  
  const initialSelectedOptions: Record<string, Record<string, boolean>> = {};
  
  // Special fields that need special handling
  const specialFields = getAlwaysShowAddButtonFields();
  const isSpecialField = specialFields.includes(fieldKey);
  
  // Debug logging para campos específicos
  if (['emergencyScenarios', 'highRiskComplications', 'lowRiskOccurrences'].includes(fieldKey)) {
    console.log(`Special field initialization for: ${fieldKey}`);
    
    // Verificar respostas do questionário para este campo
    const specialQuestionMap = {
      'emergencyScenarios': 'emergencyPreferences',
      'highRiskComplications': 'highRiskComplications', 
      'lowRiskOccurrences': 'lowRiskOccurrences'
    };
    
    const questionId = specialQuestionMap[fieldKey as keyof typeof specialQuestionMap];
    if (questionnaireAnswers[questionId]) {
      console.log(`Answer for ${questionId}:`, questionnaireAnswers[questionId]);
    } else {
      console.log(`No answers for ${questionId}`);
    }
  }
  
  // Process each relevant question
  relevantQuestions.forEach(({ question }) => {
    if (!question) {
      console.error("Undefined question found during initialization");
      return;
    }
    
    const questionId = question.id;
    initialSelectedOptions[questionId] = {};
    
    // Skip textarea initialization
    if (question.type === 'textarea') {
      return;
    }
    
    if (!question.options) {
      console.error(`Question ${questionId} doesn't have defined options`);
      return;
    }
    
    // Inicializar com base no valor do campo atual
    question.options.forEach((option: string) => {
      // Verifica se a opção está presente no valor atual do campo
      const isSelectedInField = currentFieldOptions.includes(option);
      
      // Se o campo estiver vazio, podemos usar as respostas do questionário
      const shouldUseQuestionnaireAnswer = currentFieldOptions.length === 0;
      
      let isSelected = isSelectedInField;
      
      // Apenas use respostas do questionário se o campo estiver vazio
      if (!isSelected && shouldUseQuestionnaireAnswer) {
        if (question.type === 'checkbox' && 
            typeof questionnaireAnswers[questionId] === 'object' && 
            !Array.isArray(questionnaireAnswers[questionId])) {
          // Tratar explicitamente valores undefined como false
          isSelected = questionnaireAnswers[questionId]?.[option] === true;
        } 
        else if ((question.type === 'radio' || question.type === 'select') && 
            questionnaireAnswers[questionId] !== undefined) {
          isSelected = questionnaireAnswers[questionId] === option;
        }
      }
      
      initialSelectedOptions[questionId][option] = isSelected;
    });
  });
  
  console.log(`Initialized options for ${fieldKey}:`, initialSelectedOptions);
  return initialSelectedOptions;
};
