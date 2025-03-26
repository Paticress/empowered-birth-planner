
import { formatCheckboxAnswers } from './baseUtils';

/**
 * Updates postpartum section of the birth plan
 */
export const updatePostpartumPreferences = (birthPlan: Record<string, any>, answers: Record<string, any>): void => {
  if (answers.firstHour) {
    birthPlan.posParto.firstHour = formatCheckboxAnswers(answers.firstHour);
  }
  if (answers.breastfeeding) {
    birthPlan.posParto.breastfeeding = formatCheckboxAnswers(answers.breastfeeding);
  }
  if (answers.newbornCare) {
    birthPlan.posParto.newbornCare = formatCheckboxAnswers(answers.newbornCare);
  }
  if (answers.vaccination) {
    birthPlan.posParto.vaccination = answers.vaccination;
  }
  if (answers.motherCare) {
    birthPlan.posParto.motherCare = formatCheckboxAnswers(answers.motherCare);
  }
};
