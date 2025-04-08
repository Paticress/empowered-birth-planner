
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
  
  // Sempre mostrar o botão para estes campos específicos
  if (getAlwaysShowAddButtonFields().includes(fieldKey)) {
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
  
  for (const section of questionnaireSections) {
    for (const question of section.questions) {
      if (relevantQuestionIds.includes(question.id)) {
        // Verificar se há respostas para esta questão
        const hasAnswer = questionnaireAnswers[question.id] !== undefined;
        
        // Para questões com tipo checkbox, verificar se alguma opção foi selecionada
        if (question.type === 'checkbox' && typeof questionnaireAnswers[question.id] === 'object') {
          const checkboxAnswers = questionnaireAnswers[question.id];
          const hasAnySelection = Object.values(checkboxAnswers).some(value => !!value);
          
          if (hasAnySelection || !hasAnswer) {
            relevantQuestions.push({
              question,
              sectionId: section.id
            });
          }
        } else if (hasAnswer || 
                   getAlwaysShowAddButtonFields().includes(fieldKey) ||
                   question.type === 'radio' || 
                   question.type === 'select') {
          // Sempre adicionar questões específicas ou de tipo radio/select mesmo sem respostas prévias
          relevantQuestions.push({
            question,
            sectionId: section.id
          });
        }
      }
    }
  }
  
  return relevantQuestions;
};
