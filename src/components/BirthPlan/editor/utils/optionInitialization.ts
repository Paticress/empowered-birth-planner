
/**
 * Utility functions for initializing options from questionnaire answers and birth plan
 */
import { getRelevantQuestionsForField } from './questionRelevance';
import { parseCurrentFieldOptions } from './optionParsing';
import { getAlwaysShowAddButtonFields } from './fieldConfig';

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
