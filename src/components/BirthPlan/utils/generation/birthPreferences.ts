
import { formatCheckboxAnswers } from './baseUtils';

/**
 * Updates birth section of the birth plan
 */
export const updateBirthPreferences = (birthPlan: Record<string, any>, answers: Record<string, any>): void => {
  if (answers.birthPositions) {
    birthPlan.nascimento.birthPositions = formatCheckboxAnswers(answers.birthPositions);
  }
  if (answers.episiotomy) {
    birthPlan.nascimento.episiotomy = answers.episiotomy;
  }
  if (answers.cordCutting) {
    birthPlan.nascimento.cordCutting = formatCheckboxAnswers(answers.cordCutting);
  }
  if (answers.skinToSkin) {
    birthPlan.nascimento.skinToSkin = answers.skinToSkin;
  }
  if (answers.placenta) {
    birthPlan.nascimento.placenta = answers.placenta;
  }
};
