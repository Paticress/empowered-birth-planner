
import { birthPlanSections, BirthPlanSection } from './birthPlanSections';

/**
 * Creates a shareable text version of the birth plan
 */
export const createShareableText = (birthPlan: Record<string, any>) => {
  const personalInfo = birthPlan.personalInfo || {};
  
  let text = `MEU PLANO DE PARTO\n\n`;
  text += `Nome: ${personalInfo.name || 'Não informado'}\n`;
  text += `Data prevista: ${personalInfo.dueDate || 'Não informada'}\n\n`;
  
  // Add other sections
  birthPlanSections.forEach((section) => {
    if (section.id === 'personalInfo') return; // Already added above
    
    text += `${section.title.toUpperCase()}:\n`;
    
    const sectionData = birthPlan[section.id] || {};
    
    section.fields.forEach((field) => {
      const value = sectionData[field.key];
      if (!value) return;
      
      text += `- ${field.label}: ${Array.isArray(value) ? value.join(', ') : value}\n`;
    });
    
    text += '\n';
  });
  
  text += `Criado em ${new Date().toLocaleDateString()}`;
  
  return text;
};

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
 * Generates an initial birth plan from questionnaire answers
 */
export const generateBirthPlanFromAnswers = (answers: Record<string, any>): Record<string, any> => {
  const birthPlan = generateEmptyBirthPlan();
  
  // Map specific questionnaire answers to the birth plan
  if (answers.name) birthPlan.personalInfo.name = answers.name;
  if (answers.dueDate) birthPlan.personalInfo.dueDate = answers.dueDate;
  if (answers.healthProvider) birthPlan.personalInfo.healthProvider = answers.healthProvider;
  
  // Medical considerations
  if (answers.hasConditions === 'Sim' && answers.medicalConditions) {
    birthPlan.medicalConsiderations.conditions = answers.medicalConditions;
  }
  
  if (answers.medications) birthPlan.medicalConsiderations.medications = answers.medications;
  if (answers.allergies) birthPlan.medicalConsiderations.allergies = answers.allergies;
  
  // Birth preferences
  if (answers.birthPlacePreference) {
    birthPlan.preferences.environment = `Local de parto preferido: ${answers.birthPlacePreference}`;
  }
  
  if (answers.companionPreference) {
    birthPlan.preferences.environment = (birthPlan.preferences.environment || '') + 
      `\nAcompanhantes: ${answers.companionPreference}`;
  }
  
  if (answers.painManagementPreference) {
    birthPlan.preferences.pain = answers.painManagementPreference;
  }
  
  return birthPlan;
};
