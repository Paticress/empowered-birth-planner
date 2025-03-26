
import { formatCheckboxAnswers } from './baseUtils';

/**
 * Updates atmosphere section of the birth plan
 */
export const updateAtmosphere = (birthPlan: Record<string, any>, answers: Record<string, any>): void => {
  if (answers.lighting) {
    birthPlan.atmosfera.lighting = formatCheckboxAnswers(answers.lighting);
  }
  if (answers.sound) {
    birthPlan.atmosfera.sound = formatCheckboxAnswers(answers.sound);
  }
  if (answers.clothing) {
    birthPlan.atmosfera.clothing = answers.clothing;
  }
  if (answers.photos) {
    birthPlan.atmosfera.photos = formatCheckboxAnswers(answers.photos);
  }
};
