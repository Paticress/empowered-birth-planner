
import { parseOptionsFromText } from '../utils/birthPlanUtils';
import { questionnaireSections } from '../questionnaire';

export const mapQuestionnaireToSectionId = (questionnaireId: string): string => {
  const mapping: Record<string, string> = {
    'personal': 'personalInfo',
    'atmosphere': 'atmosfera',
    'laborPreferences': 'trabalhoDeParto',
    'birth': 'nascimento',
    'cesarean': 'cesarea',
    'postpartum': 'posParto',
    'specialSituations': 'situacoesEspeciais'
  };
  return mapping[questionnaireId] || questionnaireId;
};

export const getRelevantQuestionsForField = (
  fieldKey: string, 
  questionnaireAnswers: Record<string, any> = {}
) => {
  const fieldToQuestionMap: Record<string, string[]> = {
    'name': ['name'],
    'dueDate': ['dueDate'],
    'healthProvider': ['healthProvider'],
    'birthLocation': ['birthLocation'],
    'hospital': ['hospital'],
    'midwife': ['midwife', 'midwifeName', 'midwifeRegistry'],
    'doula': ['doula', 'doulaName'],
    'companions': ['companions'],
    
    'lighting': ['lighting'],
    'sound': ['sound'],
    'clothing': ['clothing'],
    'photos': ['photos'],
    
    'mobility': ['mobility'],
    'positions': ['positions'],
    'hydration': ['hydration'],
    'monitoring': ['monitoring'],
    'interventions': ['painRelief', 'interventions', 'informedConsent'],
    
    'birthPositions': ['birthPositions'],
    'episiotomy': ['episiotomy'],
    'cordCutting': ['cordCutting'],
    'skinToSkin': ['skinToSkin'],
    'placenta': ['placenta'],
    
    'cesareanPreferences': ['cesareanPreferences'],
    'anesthesia': ['anesthesia'],
    'cesareanCompanion': ['cesareanCompanion'],
    'curtain': ['curtain'],
    'cesareanSkinToSkin': ['cesareanSkinToSkin'],
    
    'firstHour': ['firstHour'],
    'breastfeeding': ['breastfeeding'],
    'newbornCare': ['newbornCare'],
    'vaccination': ['vaccination'],
    'motherCare': ['motherCare'],
    
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

export const findQuestionById = (questionId: string) => {
  for (const section of questionnaireSections) {
    const question = section.questions.find(q => q.id === questionId);
    if (question) {
      return { question, sectionId: section.id };
    }
  }
  return null;
};

export const parseCurrentFieldOptions = (fieldKey: string, sectionId: string, birthPlan: Record<string, any>): string[] => {
  const currentValue = birthPlan[sectionId][fieldKey] || '';
  return parseOptionsFromText(currentValue);
};

export const initializeOptionsFromCurrentField = (
  fieldKey: string, 
  sectionId: string, 
  birthPlan: Record<string, any>,
  questionnaireAnswers: Record<string, any>
) => {
  const currentFieldOptions = parseCurrentFieldOptions(fieldKey, sectionId, birthPlan);
  const relevantQuestions = getRelevantQuestionsForField(fieldKey, questionnaireAnswers);
  
  const initialSelectedOptions: Record<string, Record<string, boolean>> = {};
  
  relevantQuestions.forEach(({ question }) => {
    const questionId = question.id;
    initialSelectedOptions[questionId] = {};
    
    if (question.options) {
      question.options.forEach((option: string) => {
        let isSelected = currentFieldOptions.includes(option);
        
        const answer = questionnaireAnswers[questionId];
        if (typeof answer === 'object' && !Array.isArray(answer) && answer[option]) {
          isSelected = true;
        }
        
        initialSelectedOptions[questionId][option] = isSelected;
      });
    }
  });
  
  return initialSelectedOptions;
};

export const getExcludedFields = () => {
  return ['name', 'dueDate', 'healthProvider', 'hospital', 'companions'];
};

export const shouldShowAddButton = (fieldKey: string, questionnaireAnswers: Record<string, any> = {}) => {
  const excludedFields = getExcludedFields();
  
  if (excludedFields.includes(fieldKey)) {
    return false;
  }
  
  const relevantQuestions = getRelevantQuestionsForField(fieldKey, questionnaireAnswers);
  return relevantQuestions.length > 0;
};

export const getSingleLineFields = () => {
  return [
    'name', 'dueDate', 'healthProvider', 'healthProviderContact', 'healthProviderRegistry', 
    'birthLocation', 'hospital', 'hospitalAddress', 'hospitalPhone', 
    'midwife', 'midwifeContact', 'midwifeRegistry',
    'doula', 'doulaContact', 'doulaRegistry'
  ];
};
