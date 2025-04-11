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
  
  // Verifica se o valor é uma string simples ou array
  if (typeof currentValue === 'string') {
    // Divide por virgulas se for separado por virgulas
    if (currentValue.includes(', ')) {
      return currentValue.split(', ').map(item => item.trim()).filter(Boolean);
    }
    // Ou por quebras de linha
    return parseOptionsFromText(currentValue);
  }
  
  return [];
};

/**
 * Inicializa o estado de seleção com base no valor atual do campo e nas respostas do questionário
 */
export const initializeOptionsFromCurrentField = (
  fieldKey: string, 
  sectionId: string, 
  birthPlan: Record<string, any>,
  questionnaireAnswers: Record<string, any>
) => {
  // Log para depuração
  console.log(`Inicializando opções para o campo: ${fieldKey} na seção: ${sectionId}`);
  
  // Obter questões relevantes específicas para este campo
  const relevantQuestions = getRelevantQuestionsForField(fieldKey, questionnaireAnswers);
  
  // BUGFIX: Obter opções já selecionadas no campo atual
  const currentFieldOptions = parseCurrentFieldOptions(fieldKey, sectionId, birthPlan);
  console.log(`Opções do campo atual: `, currentFieldOptions);
  
  const initialSelectedOptions: Record<string, Record<string, boolean>> = {};
  
  // Campos especiais que precisam de tratamento especial
  const specialFields = getAlwaysShowAddButtonFields();
  const isSpecialField = specialFields.includes(fieldKey);
  
  // Processar cada questão relevante
  relevantQuestions.forEach(({ question }) => {
    if (!question) {
      console.error("Questão indefinida encontrada durante inicialização");
      return;
    }
    
    const questionId = question.id;
    initialSelectedOptions[questionId] = {};
    
    // Pular inicialização de textarea
    if (question.type === 'textarea') {
      return;
    }
    
    if (!question.options) {
      console.error(`Questão ${questionId} não tem opções definidas`);
      return;
    }
    
    // BUGFIX: Inicializar a partir do valor atual do campo + questionário
    question.options.forEach((option: string) => {
      let isSelected = false;
      
      // Verificar primeiro se a opção já está selecionada no campo atual
      if (currentFieldOptions.includes(option)) {
        isSelected = true;
        console.log(`Opção "${option}" encontrada no valor atual do campo`);
      } 
      // Se não estiver no campo atual, verificar nas respostas do questionário
      else if (question.type === 'checkbox' && 
          typeof questionnaireAnswers[questionId] === 'object' && 
          !Array.isArray(questionnaireAnswers[questionId])) {
        isSelected = !!questionnaireAnswers[questionId]?.[option];
      } 
      // Para questões radio/select
      else if ((question.type === 'radio' || question.type === 'select') && 
          questionnaireAnswers[questionId] !== undefined) {
        isSelected = questionnaireAnswers[questionId] === option;
      }
      
      initialSelectedOptions[questionId][option] = isSelected;
    });
  });
  
  console.log(`Opções inicializadas para ${fieldKey}:`, initialSelectedOptions);
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
