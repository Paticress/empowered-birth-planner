
import { questionnaireSections } from '../questionnaire';

// Maps questionnaire section IDs to birth plan section IDs
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

// Formats selected options from various data types to a string
export const formatSelectedOptions = (questionId: string, data: any): string => {
  if (typeof data === 'string') {
    return data;
  }
  
  if (Array.isArray(data)) {
    return data.join(', ');
  }
  
  if (typeof data === 'object') {
    return Object.entries(data)
      .filter(([_, value]) => value)
      .map(([key]) => key)
      .join(', ');
  }
  
  return String(data);
};

// Finds a question by its ID across all sections
export const findQuestionById = (questionId: string) => {
  for (const section of questionnaireSections) {
    const question = section.questions.find(q => q.id === questionId);
    if (question) {
      return { question, sectionId: section.id };
    }
  }
  return null;
};

// Maps field keys to relevant question IDs
export const fieldToQuestionMap: Record<string, string[]> = {
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

// Gets relevant questions for a specific field
export const getRelevantQuestionsForField = (fieldKey: string, questionnaireAnswers: Record<string, any>) => {
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

// Formats the display value for a question
export const getFormattedDisplayValue = (question: any, questionnaireAnswers: Record<string, any>) => {
  const answer = questionnaireAnswers[question.id];
  let displayValue = '';
  
  if (typeof answer === 'object' && !Array.isArray(answer)) {
    // Checkbox response
    const selectedOptions = Object.entries(answer)
      .filter(([_, selected]) => selected)
      .map(([option]) => option);
      
    displayValue = selectedOptions.join(', ');
  } else if (Array.isArray(answer)) {
    displayValue = answer.join(', ');
  } else {
    displayValue = String(answer || '');
  }
  
  return displayValue;
};
