
import { formatCheckboxAnswers } from './baseUtils';

/**
 * Updates special situations section of the birth plan
 */
export const updateSpecialSituations = (birthPlan: Record<string, any>, answers: Record<string, any>): void => {
  if (answers.complications) {
    birthPlan.situacoesEspeciais.complications = formatCheckboxAnswers(answers.complications);
  }
  
  if (answers.nicu) {
    birthPlan.situacoesEspeciais.nicu = formatCheckboxAnswers(answers.nicu);
  }
  
  if (answers.emergencyPreferences) {
    birthPlan.situacoesEspeciais.emergencyScenarios = formatCheckboxAnswers(answers.emergencyPreferences);
  }
  
  if (answers.highRiskComplications) {
    birthPlan.situacoesEspeciais.highRiskComplications = formatCheckboxAnswers(answers.highRiskComplications);
  }
  
  if (answers.lowRiskOccurrences) {
    birthPlan.situacoesEspeciais.lowRiskOccurrences = formatCheckboxAnswers(answers.lowRiskOccurrences);
  }
  
  if (answers.cascadeInterventions) {
    birthPlan.situacoesEspeciais.cascadeInterventions = formatCheckboxAnswers(answers.cascadeInterventions);
  }
  
  if (answers.specialWishes) {
    birthPlan.situacoesEspeciais.specialWishes = answers.specialWishes;
  }
};
