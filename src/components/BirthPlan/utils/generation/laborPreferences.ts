
import { formatCheckboxAnswers } from './baseUtils';

/**
 * Updates labor section of the birth plan
 */
export const updateLaborPreferences = (birthPlan: Record<string, any>, answers: Record<string, any>): void => {
  if (answers.mobility) {
    birthPlan.trabalhoDeParto.mobility = formatCheckboxAnswers(answers.mobility);
  }
  if (answers.positions) {
    birthPlan.trabalhoDeParto.positions = formatCheckboxAnswers(answers.positions);
  }
  if (answers.hydration) {
    birthPlan.trabalhoDeParto.hydration = formatCheckboxAnswers(answers.hydration);
  }
  if (answers.monitoring) {
    birthPlan.trabalhoDeParto.monitoring = answers.monitoring;
  }
  if (answers.painRelief) {
    birthPlan.trabalhoDeParto.interventions = formatCheckboxAnswers(answers.painRelief);
  }
  if (answers.interventions) {
    const currentValue = birthPlan.trabalhoDeParto.interventions;
    const interventions = formatCheckboxAnswers(answers.interventions);
    birthPlan.trabalhoDeParto.interventions = currentValue ? 
      `${currentValue}\n${interventions}` : interventions;
  }
};
