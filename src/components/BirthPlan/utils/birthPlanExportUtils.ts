
/**
 * Utils for exporting and sharing birth plans
 */

/**
 * Creates a shareable text version of the birth plan
 */
export const createShareableText = (birthPlan: Record<string, any>) => {
  const personalInfo = birthPlan.personalInfo || {};
  
  let text = `MEU PLANO DE PARTO\n\n`;
  text += `Nome: ${personalInfo.name || 'Não informado'}\n`;
  text += `Data prevista: ${personalInfo.dueDate || 'Não informada'}\n`;
  text += `Hospital/Maternidade: ${personalInfo.hospital || 'Não informado'}\n`;
  text += `Endereço: ${personalInfo.hospitalAddress || 'Não informado'}\n`;
  text += `Telefone: ${personalInfo.hospitalPhone || 'Não informado'}\n`;
  text += `Médico/Obstetra: ${personalInfo.healthProvider || 'Não informado'}\n`;
  text += `Telefone: ${personalInfo.healthProviderContact || 'Não informado'}\n`;
  text += `CRM: ${personalInfo.healthProviderRegistry || 'Não informado'}\n`;
  
  if (personalInfo.doula) {
    text += `Doula: ${personalInfo.doula || 'Não informada'}\n`;
    text += `Telefone: ${personalInfo.doulaContact || 'Não informado'}\n`;
    text += `Registro: ${personalInfo.doulaRegistry || 'Não informado'}\n`;
  }
  
  text += `Acompanhantes: ${personalInfo.companions || 'Não informados'}\n\n`;
  
  // Add other sections
  import { birthPlanSections } from './birthPlanSections';
  
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
  text += `___________________________        ___________________________\n`;
  text += `Enfermeira Obstétrica              ${personalInfo.doula || 'Doula'}\n`;
  text += `COREN: _________                 Registro: ${personalInfo.doulaRegistry || '_________'}`;
  
  return text;
};
