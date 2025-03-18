
import { birthPlanSections, BirthPlanSection } from './birthPlanSections';

/**
 * Creates a shareable text version of the birth plan
 */
export const createShareableText = (birthPlan: Record<string, any>) => {
  const personalInfo = birthPlan.personalInfo || {};
  
  let text = `MEU PLANO DE PARTO\n\n`;
  text += `Nome: ${personalInfo.name || 'Não informado'}\n`;
  text += `Data prevista: ${personalInfo.dueDate || 'Não informada'}\n`;
  text += `Hospital/Maternidade: ${personalInfo.hospital || 'Não informado'}\n`;
  text += `Médico/Obstetra: ${personalInfo.healthProvider || 'Não informado'}\n`;
  if (personalInfo.doula) {
    text += `Doula: ${personalInfo.doula || 'Não informada'}\n`;
  }
  text += `Acompanhantes: ${personalInfo.companions || 'Não informados'}\n\n`;
  
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
 * Processes checkbox answers into a formatted string
 */
const formatCheckboxAnswers = (checkboxData: Record<string, boolean>) => {
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
  const birthPlan = generateEmptyBirthPlan();
  
  // Personal Information
  if (answers.name) birthPlan.personalInfo.name = answers.name;
  if (answers.dueDate) birthPlan.personalInfo.dueDate = answers.dueDate;
  if (answers.healthProvider) birthPlan.personalInfo.healthProvider = answers.healthProvider;
  if (answers.hospital) birthPlan.personalInfo.hospital = answers.hospital;
  if (answers.doula === 'Sim' && answers.doulaName) {
    birthPlan.personalInfo.doula = answers.doulaName;
  }
  if (answers.companions) birthPlan.personalInfo.companions = answers.companions;
  
  // Atmosfera e Ambiente
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
  
  // Trabalho de Parto
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
  
  // Nascimento
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
  
  // Em Caso de Cesárea
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
  
  // Pós-Parto
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
  
  // Situações Especiais
  if (answers.complications) {
    birthPlan.situacoesEspeciais.complications = formatCheckboxAnswers(answers.complications);
  }
  if (answers.nicu) {
    birthPlan.situacoesEspeciais.nicu = formatCheckboxAnswers(answers.nicu);
  }
  if (answers.specialWishes) {
    birthPlan.situacoesEspeciais.specialWishes = answers.specialWishes;
  }
  
  return birthPlan;
};
