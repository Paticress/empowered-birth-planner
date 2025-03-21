
import { generateEmptyBirthPlan, generateBirthPlanFromAnswers } from './birthPlanGenerationUtils';
import { birthPlanSections } from './birthPlanSections';

// Re-export the utility functions
export {
  generateEmptyBirthPlan,
  generateBirthPlanFromAnswers
};

// Helper function to get user-friendly section names
export const getSectionDisplayName = (sectionId: string): string => {
  const sectionNameMap: Record<string, string> = {
    personalInfo: 'Informações Pessoais',
    laborPreferences: 'Preferências para o Trabalho de Parto',
    atmosfera: 'Ambiente e Acompanhamento',
    trabalhoDeParto: 'Trabalho de Parto',
    painManagement: 'Alívio da Dor',
    nascimento: 'Parto',
    newborn: 'Cuidados com o Recém-Nascido',
    cesarea: 'Cesárea (Se Necessária)',
    posParto: 'Pós-Parto',
    situacoesEspeciais: 'Situações Especiais'
  };
  
  return sectionNameMap[sectionId] || sectionId;
};

// Add any additional utility functions here if needed
export const formatBirthPlanSection = (section: Record<string, string>): string => {
  return Object.entries(section)
    .filter(([_, value]) => value && value.trim() !== '')
    .map(([key, value]) => `${key}: ${value}`)
    .join('\n\n');
};

/**
 * Parse text content into an array of options
 */
export const parseOptionsFromText = (text: string): string[] => {
  if (!text) return [];
  
  // Split the text by commas and trim each option
  return text.split(',').map(option => option.trim()).filter(option => option.length > 0);
};

/**
 * Creates a shareable text version of the birth plan
 */
export const createShareableText = (birthPlan: Record<string, any>) => {
  const personalInfo = birthPlan.personalInfo || {};
  
  let text = `MEU PLANO DE PARTO\n\n`;
  text += `Nome: ${personalInfo.name || 'Não informado'}\n`;
  text += `Data prevista: ${personalInfo.dueDate || 'Não informada'}\n`;
  text += `Local planejado para o parto: ${personalInfo.birthLocation || 'Não informado'}\n`;
  text += `Hospital/Maternidade de referência: ${personalInfo.hospital || 'Não informado'}\n`;
  text += `Endereço: ${personalInfo.hospitalAddress || 'Não informado'}\n`;
  text += `Telefone: ${personalInfo.hospitalPhone || 'Não informado'}\n`;
  text += `Médico/Obstetra: ${personalInfo.healthProvider || 'Não informado'}\n`;
  text += `Telefone: ${personalInfo.healthProviderContact || 'Não informado'}\n`;
  text += `CRM: ${personalInfo.healthProviderRegistry || 'Não informado'}\n`;
  
  if (personalInfo.midwife) {
    text += `Enfermeira Obstetriz: ${personalInfo.midwife || 'Não informada'}\n`;
    text += `Telefone: ${personalInfo.midwifeContact || 'Não informado'}\n`;
    text += `COREN: ${personalInfo.midwifeRegistry || 'Não informado'}\n`;
  }
  
  if (personalInfo.doula) {
    text += `Doula: ${personalInfo.doula || 'Não informada'}\n`;
    text += `Telefone: ${personalInfo.doulaContact || 'Não informado'}\n`;
    text += `Certificação: ${personalInfo.doulaRegistry || 'Não informada'}\n`;
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
  text += `\n\nEste documento representa minhas preferências para o parto e nascimento do meu bebê.`;
  text += `\n\nAssinaturas:\n\n`;
  text += `___________________________        ___________________________\n`;
  text += `${personalInfo.name || 'Gestante'}                 ${personalInfo.healthProvider || 'Médico/Obstetra'}\n`;
  text += `                                   CRM: ${personalInfo.healthProviderRegistry || '_________'}\n\n`;
  
  // Add enfermeira obstetriz and doula signatures
  text += `___________________________        ___________________________\n`;
  if (personalInfo.midwife) {
    text += `${personalInfo.midwife || 'Enfermeira Obstetriz'}            ${personalInfo.doula || 'Doula'}\n`;
    text += `COREN: ${personalInfo.midwifeRegistry || '_________'}       Certificação: ${personalInfo.doulaRegistry || '_________'}`;
  } else {
    text += `Enfermeira Obstétrica              ${personalInfo.doula || 'Doula'}\n`;
    text += `COREN: _________                 Certificação: ${personalInfo.doulaRegistry || '_________'}`;
  }
  
  return text;
};
