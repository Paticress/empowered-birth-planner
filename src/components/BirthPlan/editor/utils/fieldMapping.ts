
import { questionnaireSections } from '../../questionnaire';

/**
 * Maps field keys in the birth plan to question IDs in the questionnaire
 */
export const fieldToQuestionMap: Record<string, string[]> = {
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
  'painRelief': ['painRelief'],
  'interventionsRoutine': ['interventions'],
  'consentimentoInformado': ['informedConsent'],
  
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
  
  'complications': ['complications'],
  'cascadeInterventions': ['cascadeInterventions'],
  'emergencyScenarios': ['emergencyPreferences'],
  'highRiskComplications': ['highRiskComplications'],
  'lowRiskOccurrences': ['lowRiskOccurrences'],
  'specialWishes': ['specialWishes'],
  'unexpectedScenarios': ['unexpectedScenarios']
};

/**
 * Maps questionnaire section IDs to birth plan section IDs
 */
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

/**
 * Finds a question by its ID across all questionnaire sections
 */
export const findQuestionById = (questionId: string) => {
  for (const section of questionnaireSections) {
    const question = section.questions.find(q => q.id === questionId);
    if (question) {
      return { question, sectionId: section.id };
    }
  }
  return null;
};

/**
 * Direct mapping of field keys to questionnaire section IDs
 */
export const fieldToSectionMap: Record<string, string> = {
  'painRelief': 'laborPreferences',
  'interventionsRoutine': 'laborPreferences',
  'consentimentoInformado': 'laborPreferences',
  'cascadeInterventions': 'specialSituations',
  'emergencyScenarios': 'specialSituations',
  'highRiskComplications': 'specialSituations',
  'lowRiskOccurrences': 'specialSituations',
  'unexpectedScenarios': 'specialSituations',
  'specialWishes': 'specialSituations'
};

/**
 * Maps questionnaire field IDs to birth plan field keys
 * This helps with direct mapping from questionnaire answers to birth plan fields
 */
export const questionToFieldMap: Record<string, string> = {
  'cascadeInterventions': 'cascadeInterventions',
  'emergencyPreferences': 'emergencyScenarios',
  'highRiskComplications': 'highRiskComplications',
  'lowRiskOccurrences': 'lowRiskOccurrences',
  'unexpectedScenarios': 'unexpectedScenarios',
  'specialWishes': 'specialWishes',
  'painRelief': 'painRelief',
  'interventions': 'interventionsRoutine',
  'informedConsent': 'consentimentoInformado'
};
