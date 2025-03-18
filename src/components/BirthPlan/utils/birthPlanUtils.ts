
/**
 * Creates a shareable text version of the birth plan
 */
export const createShareableText = (birthPlan: Record<string, any>) => {
  const personalInfo = birthPlan.personalInfo || {};
  
  let text = `MEU PLANO DE PARTO\n\n`;
  text += `Nome: ${personalInfo.name || 'Não informado'}\n`;
  text += `Data prevista: ${personalInfo.dueDate || 'Não informada'}\n\n`;
  
  // Add other sections
  Object.entries(birthPlan).forEach(([sectionKey, sectionData]) => {
    if (sectionKey === 'personalInfo') return; // Already added above
    
    switch (sectionKey) {
      case 'preferences':
        text += `PREFERÊNCIAS PARA O PARTO:\n`;
        break;
      case 'medicalConsiderations':
        text += `CONSIDERAÇÕES MÉDICAS:\n`;
        break;
      case 'postpartum':
        text += `PÓS-PARTO:\n`;
        break;
      default:
        text += `${sectionKey.toUpperCase()}:\n`;
    }
    
    Object.entries(sectionData as Record<string, any>).forEach(([fieldKey, value]) => {
      if (!value) return;
      
      let fieldName = fieldKey;
      switch (fieldKey) {
        case 'environment': fieldName = 'Ambiente'; break;
        case 'mobility': fieldName = 'Movimentação'; break;
        case 'pain': fieldName = 'Controle de dor'; break;
        case 'interventions': fieldName = 'Intervenções'; break;
        case 'conditions': fieldName = 'Condições médicas'; break;
        case 'medications': fieldName = 'Medicamentos'; break;
        case 'allergies': fieldName = 'Alergias'; break;
        case 'newbornCare': fieldName = 'Cuidados com o bebê'; break;
        case 'feeding': fieldName = 'Alimentação'; break;
        case 'recovery': fieldName = 'Recuperação'; break;
      }
      
      text += `- ${fieldName}: ${Array.isArray(value) ? value.join(', ') : value}\n`;
    });
    
    text += '\n';
  });
  
  text += `Criado em ${new Date().toLocaleDateString()}`;
  
  return text;
};
