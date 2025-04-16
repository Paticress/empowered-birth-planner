
import { FieldMapping, SPECIAL_FIELD_IDS } from './types';
import { questionnaireSections } from '../../questionnaire';

/**
 * Explicit mapping between editor field keys and question IDs
 */
export const fieldMappings: FieldMapping[] = [
  // Personal information section
  { fieldKey: 'name', questionIds: ['name'], sectionId: 'personalInfo' },
  { fieldKey: 'dueDate', questionIds: ['dueDate'], sectionId: 'personalInfo' },
  { fieldKey: 'healthProvider', questionIds: ['healthProvider'], sectionId: 'personalInfo' },
  { fieldKey: 'birthLocation', questionIds: ['birthLocation'], sectionId: 'personalInfo' },
  { fieldKey: 'hospital', questionIds: ['hospital'], sectionId: 'personalInfo' },
  { fieldKey: 'midwife', questionIds: ['midwife', 'midwifeName', 'midwifeRegistry'], sectionId: 'personalInfo' },
  { fieldKey: 'doula', questionIds: ['doula', 'doulaName'], sectionId: 'personalInfo' },
  { fieldKey: 'companions', questionIds: ['companions'], sectionId: 'personalInfo' },
  
  // Atmosphere section
  { fieldKey: 'lighting', questionIds: ['lighting'], sectionId: 'atmosfera' },
  { fieldKey: 'sound', questionIds: ['sound'], sectionId: 'atmosfera' },
  { fieldKey: 'clothing', questionIds: ['clothing'], sectionId: 'atmosfera' },
  { fieldKey: 'photos', questionIds: ['photos'], sectionId: 'atmosfera' },
  
  // Labor preferences section
  { fieldKey: 'mobility', questionIds: ['mobility'], sectionId: 'trabalhoDeParto' },
  { fieldKey: 'positions', questionIds: ['positions'], sectionId: 'trabalhoDeParto' },
  { fieldKey: 'hydration', questionIds: ['hydration'], sectionId: 'trabalhoDeParto' },
  { fieldKey: 'monitoring', questionIds: ['monitoring'], sectionId: 'trabalhoDeParto' },
  { fieldKey: 'painRelief', questionIds: ['painRelief'], sectionId: 'trabalhoDeParto' },
  { fieldKey: 'interventionsRoutine', questionIds: ['interventions'], sectionId: 'trabalhoDeParto' },
  { fieldKey: 'consentimentoInformado', questionIds: ['informedConsent'], sectionId: 'trabalhoDeParto' },
  
  // Birth section
  { fieldKey: 'birthPositions', questionIds: ['birthPositions'], sectionId: 'nascimento' },
  { fieldKey: 'episiotomy', questionIds: ['episiotomy'], sectionId: 'nascimento' },
  { fieldKey: 'cordCutting', questionIds: ['cordCutting'], sectionId: 'nascimento' },
  { fieldKey: 'skinToSkin', questionIds: ['skinToSkin'], sectionId: 'nascimento' },
  { fieldKey: 'placenta', questionIds: ['placenta'], sectionId: 'nascimento' },
  
  // Cesarean section
  { fieldKey: 'cesareanPreferences', questionIds: ['cesareanPreferences'], sectionId: 'cesarea' },
  { fieldKey: 'anesthesia', questionIds: ['anesthesia'], sectionId: 'cesarea' },
  { fieldKey: 'cesareanCompanion', questionIds: ['cesareanCompanion'], sectionId: 'cesarea' },
  { fieldKey: 'curtain', questionIds: ['curtain'], sectionId: 'cesarea' },
  { fieldKey: 'cesareanSkinToSkin', questionIds: ['cesareanSkinToSkin'], sectionId: 'cesarea' },
  
  // Postpartum section
  { fieldKey: 'firstHour', questionIds: ['firstHour'], sectionId: 'posParto' },
  { fieldKey: 'breastfeeding', questionIds: ['breastfeeding'], sectionId: 'posParto' },
  { fieldKey: 'newbornCare', questionIds: ['newbornCare'], sectionId: 'posParto' },
  { fieldKey: 'vaccination', questionIds: ['vaccination'], sectionId: 'posParto' },
  { fieldKey: 'motherCare', questionIds: ['motherCare'], sectionId: 'posParto' },
  
  // Special situations section
  { fieldKey: 'complications', questionIds: ['complications'], sectionId: 'situacoesEspeciais' },
  { fieldKey: 'cascadeInterventions', questionIds: ['cascadeInterventions'], sectionId: 'situacoesEspeciais' },
  { fieldKey: 'nicu', questionIds: ['nicu'], sectionId: 'situacoesEspeciais' },
  
  // Special fields with 1:1 mapping - critical for correct behavior
  { fieldKey: 'emergencyScenarios', questionIds: ['emergencyPreferences'], sectionId: 'situacoesEspeciais' },
  { fieldKey: 'highRiskComplications', questionIds: ['highRiskComplications'], sectionId: 'situacoesEspeciais' },
  { fieldKey: 'lowRiskOccurrences', questionIds: ['lowRiskOccurrences'], sectionId: 'situacoesEspeciais' },
  
  { fieldKey: 'specialWishes', questionIds: ['specialWishes'], sectionId: 'situacoesEspeciais' },
  { fieldKey: 'unexpectedScenarios', questionIds: ['unexpectedScenarios'], sectionId: 'situacoesEspeciais' }
];

/**
 * Get all question IDs mapped to a specific field key
 */
export function getQuestionIdsForField(fieldKey: string): string[] {
  const mapping = fieldMappings.find(m => m.fieldKey === fieldKey);
  return mapping?.questionIds || [];
}

/**
 * Get the editor field key for a specific question ID
 */
export function getFieldKeyForQuestionId(questionId: string): string | null {
  const mapping = fieldMappings.find(m => m.questionIds.includes(questionId));
  return mapping?.fieldKey || null;
}

/**
 * Get the editor section ID for a specific field key
 */
export function getSectionIdForFieldKey(fieldKey: string): string | null {
  const mapping = fieldMappings.find(m => m.fieldKey === fieldKey);
  return mapping?.sectionId || null;
}

/**
 * Check if a question ID is for a special field
 */
export function isSpecialQuestionId(questionId: string): boolean {
  return SPECIAL_FIELD_IDS.includes(questionId as any);
}

/**
 * Check if a field key is for a special field
 */
export function isSpecialFieldKey(fieldKey: string): boolean {
  return fieldKey === 'emergencyScenarios' || 
         fieldKey === 'highRiskComplications' || 
         fieldKey === 'lowRiskOccurrences';
}

/**
 * Finds a question by its ID across all questionnaire sections
 */
export function findQuestionById(questionId: string): { question: any, sectionId: string } | null {
  for (const section of questionnaireSections) {
    const question = section.questions.find(q => q.id === questionId);
    if (question) {
      return { question, sectionId: section.id };
    }
  }
  return null;
}
