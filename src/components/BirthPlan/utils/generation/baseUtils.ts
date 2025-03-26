
import { birthPlanSections } from '../birthPlanSections';

/**
 * Generates a default empty birth plan structure based on sections
 */
export const generateEmptyBirthPlan = (): Record<string, any> => {
  const emptyPlan: Record<string, any> = {};
  
  birthPlanSections.forEach((section) => {
    emptyPlan[section.id] = {};
    section.fields.forEach((field) => {
      emptyPlan[section.id][field.key] = '';
    });
  });
  
  return emptyPlan;
};

/**
 * Processes checkbox answers into a formatted string
 */
export const formatCheckboxAnswers = (checkboxData: Record<string, boolean>) => {
  if (!checkboxData) return '';
  
  const selectedOptions = Object.entries(checkboxData)
    .filter(([_, value]) => value)
    .map(([key]) => key);
  
  return selectedOptions.join(', ');
};

/**
 * Generates an initial birth plan from questionnaire answers
 */
export const generateBirthPlanFromAnswers = (answers: Record<string, any>): Record<string, any> => {
  console.log("Gerando plano de parto a partir das respostas:", answers);
  const birthPlan = generateEmptyBirthPlan();
  
  // Update each section with relevant answers
  updatePersonalInfo(birthPlan, answers);
  updateAtmosphere(birthPlan, answers);
  updateLaborPreferences(birthPlan, answers);
  updateBirthPreferences(birthPlan, answers);
  updateCesareanPreferences(birthPlan, answers);
  updatePostpartumPreferences(birthPlan, answers);
  updateSpecialSituations(birthPlan, answers);
  
  console.log("Plano de parto gerado:", birthPlan);
  return birthPlan;
};
