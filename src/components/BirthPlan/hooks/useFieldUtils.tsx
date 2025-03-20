
import { useMemo } from 'react';
import { questionnaireSections } from '../questionnaire';

export function useFieldUtils() {
  const excludedFields = ['name', 'dueDate', 'healthProvider', 'hospital', 'companions'];
  
  // Verifica se o botão de adicionar do questionário deve ser mostrado para um campo específico
  const shouldShowAddButton = (fieldKey: string, questionnaireAnswers: Record<string, any>) => {
    // Não mostrar para campos excluídos (texto livre inicial)
    if (excludedFields.includes(fieldKey)) {
      return false;
    }
    
    // Verificar se existem perguntas relevantes para este campo
    const relevantQuestions = getRelevantQuestionsForField(fieldKey, questionnaireAnswers);
    return relevantQuestions.length > 0;
  };
  
  // Encontrar questões relevantes para um campo específico
  const getRelevantQuestionsForField = (fieldKey: string, questionnaireAnswers: Record<string, any>) => {
    // Mapeamento de chaves de campo para IDs de perguntas relevantes
    const fieldToQuestionMap: Record<string, string[]> = {
      // personalInfo
      'name': ['name'],
      'dueDate': ['dueDate'],
      'healthProvider': ['healthProvider'],
      'hospital': ['hospital'],
      'doula': ['doula', 'doulaName'],
      'companions': ['companions'],
      
      // atmosfera
      'lighting': ['lighting'],
      'sound': ['sound'],
      'clothing': ['clothing'],
      'photos': ['photos'],
      
      // trabalhoDeParto
      'mobility': ['mobility'],
      'positions': ['positions'],
      'hydration': ['hydration'],
      'monitoring': ['monitoring'],
      'interventions': ['painRelief', 'interventions', 'informedConsent'],
      
      // nascimento
      'birthPositions': ['birthPositions'],
      'episiotomy': ['episiotomy'],
      'cordCutting': ['cordCutting'],
      'skinToSkin': ['skinToSkin'],
      'placenta': ['placenta'],
      
      // cesarea
      'cesareanPreferences': ['cesareanPreferences'],
      'anesthesia': ['anesthesia'],
      'cesareanCompanion': ['cesareanCompanion'],
      'curtain': ['curtain'],
      'cesareanSkinToSkin': ['cesareanSkinToSkin'],
      
      // posParto
      'firstHour': ['firstHour'],
      'breastfeeding': ['breastfeeding'],
      'newbornCare': ['newbornCare'],
      'vaccination': ['vaccination'],
      'motherCare': ['motherCare'],
      
      // situacoesEspeciais
      'complications': ['complications', 'cascadeInterventions'],
      'nicu': ['nicu'],
      'emergencyScenarios': ['unexpectedScenarios'],
      'specialWishes': ['specialWishes']
    };
    
    const relevantQuestionIds = fieldToQuestionMap[fieldKey] || [];
    const relevantQuestions: Array<{question: any, sectionId: string}> = [];
    
    for (const section of questionnaireSections) {
      for (const question of section.questions) {
        if (relevantQuestionIds.includes(question.id) && questionnaireAnswers[question.id] !== undefined) {
          relevantQuestions.push({
            question,
            sectionId: section.id
          });
        }
      }
    }
    
    return relevantQuestions;
  };
  
  return {
    shouldShowAddButton,
    getRelevantQuestionsForField
  };
}
