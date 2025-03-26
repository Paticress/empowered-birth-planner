
import { formatCheckboxAnswers } from './baseUtils';

/**
 * Updates cesarean section of the birth plan
 */
export const updateCesareanPreferences = (birthPlan: Record<string, any>, answers: Record<string, any>): void => {
  if (answers.cesareanPreferences) {
    birthPlan.cesarea.cesareanPreferences = formatCheckboxAnswers(answers.cesareanPreferences);
  }
  if (answers.anesthesia) {
    birthPlan.cesarea.anesthesia = answers.anesthesia;
  }
  if (answers.cesareanCompanion) {
    birthPlan.cesarea.cesareanCompanion = answers.cesareanCompanion;
  }
  if (answers.curtain) {
    birthPlan.cesarea.curtain = answers.curtain;
  }
  if (answers.cesareanSkinToSkin) {
    birthPlan.cesarea.cesareanSkinToSkin = answers.cesareanSkinToSkin;
  }
};
