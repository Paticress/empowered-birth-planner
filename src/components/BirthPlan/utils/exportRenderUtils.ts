
import { getSectionDisplayName } from './birthPlanUtils';

/**
 * Renders birth plan content into the DOM for export
 * @param birthPlanData The birth plan data to render
 * @param containerId The ID of the container to render into
 */
export const renderBirthPlanForExport = (birthPlanData: Record<string, any>, containerId: string = 'birth-plan-content') => {
  const container = document.getElementById(containerId);
  if (!container) return;
  
  // Clear previous content
  container.innerHTML = '';
  
  // Add title and introduction
  const titleContainer = document.createElement('div');
  titleContainer.className = 'flex justify-between items-center mb-4';
  
  const title = document.createElement('h1');
  title.className = 'text-2xl font-bold';
  title.textContent = 'PLANO DE PARTO';
  titleContainer.appendChild(title);
  
  const logo = document.createElement('img');
  logo.src = '/lovable-uploads/6f452e84-0922-495e-bad9-57a66fa763f6.png';
  logo.alt = 'Energia Materna';
  logo.className = 'h-12';
  titleContainer.appendChild(logo);
  container.appendChild(titleContainer);
  
  // Add the disclaimer
  const disclaimer = document.createElement('p');
  disclaimer.className = 'text-sm text-gray-700 mt-2 mb-6';
  disclaimer.textContent = 'Este documento reflete minhas preferências para o parto e nascimento do meu bebê. Ele foi elaborado após ' +
    'cuidadosa pesquisa e reflexão, em colaboração com meu parceiro e equipe de saúde. Compreendo que ' +
    'situações imprevistas podem surgir durante o trabalho de parto, e que a saúde e bem-estar do ' +
    'bebê e meu são prioridade. Peço gentilmente que, na ausência de emergências médicas, minhas ' +
    'escolhas sejam respeitadas, e que quaisquer intervenções necessárias sejam discutidas comigo ' +
    'antes de serem realizadas.';
  container.appendChild(disclaimer);
  
  // Add personal info section
  const personalInfo = birthPlanData.personalInfo || {};
  const personalSection = document.createElement('div');
  personalSection.className = 'mb-6';
  
  const personalTitle = document.createElement('h2');
  personalTitle.className = 'text-xl font-bold mb-2';
  personalTitle.textContent = 'Informações Pessoais';
  personalSection.appendChild(personalTitle);
  
  const personalList = document.createElement('div');
  personalList.className = 'pl-4';
  
  // Add each personal info item
  const personalFields = [
    { key: 'name', label: 'Nome' },
    { key: 'dueDate', label: 'Data prevista' },
    { key: 'birthLocation', label: 'Local planejado para o parto' },
    { key: 'hospital', label: 'Hospital/Maternidade' },
    { key: 'hospitalAddress', label: 'Endereço' },
    { key: 'hospitalPhone', label: 'Telefone' },
    { key: 'healthProvider', label: 'Médico/Obstetra' },
    { key: 'healthProviderContact', label: 'Telefone' },
    { key: 'healthProviderRegistry', label: 'CRM' }
  ];
  
  personalFields.forEach(field => {
    if (personalInfo[field.key]) {
      const item = document.createElement('div');
      item.className = 'mb-2';
      
      const label = document.createElement('h3');
      label.className = 'font-semibold';
      label.textContent = field.label;
      item.appendChild(label);
      
      const value = document.createElement('p');
      value.textContent = personalInfo[field.key];
      item.appendChild(value);
      
      personalList.appendChild(item);
    }
  });
  
  personalSection.appendChild(personalList);
  container.appendChild(personalSection);
  
  // Loop through all other birth plan sections
  Object.entries(birthPlanData).forEach(([sectionKey, sectionData]) => {
    if (sectionKey === 'personalInfo' || !sectionData || typeof sectionData !== 'object') return;
    
    const section = document.createElement('div');
    section.className = 'mb-6';
    
    const sectionTitle = document.createElement('h2');
    sectionTitle.className = 'text-xl font-bold mb-2';
    sectionTitle.textContent = getSectionDisplayName(sectionKey);
    section.appendChild(sectionTitle);
    
    const sectionContent = document.createElement('div');
    sectionContent.className = 'pl-4';
    
    // Add each field in the section
    Object.entries(sectionData as Record<string, any>).forEach(([key, value]) => {
      if (!value) return;
      
      const item = document.createElement('div');
      item.className = 'mb-2';
      
      const label = document.createElement('h3');
      label.className = 'font-semibold';
      label.textContent = key;
      item.appendChild(label);
      
      const content = document.createElement('p');
      content.textContent = Array.isArray(value) ? value.join(", ") : value;
      item.appendChild(content);
      
      sectionContent.appendChild(item);
    });
    
    section.appendChild(sectionContent);
    container.appendChild(section);
  });
  
  // Add signature section
  const signatureSection = document.createElement('div');
  signatureSection.className = 'mt-12';
  
  const signatureTitle = document.createElement('h2');
  signatureTitle.className = 'text-xl font-bold mb-4 border-b pb-2';
  signatureTitle.textContent = 'Assinaturas';
  signatureSection.appendChild(signatureTitle);
  
  const signatureGrid = document.createElement('div');
  signatureGrid.className = 'grid grid-cols-2 gap-8';
  
  // Patient signature
  const patientSignature = document.createElement('div');
  const patientLine = document.createElement('div');
  patientLine.className = 'border-b border-black h-12 mb-2';
  patientSignature.appendChild(patientLine);
  
  const patientName = document.createElement('p');
  patientName.className = 'text-center';
  patientName.textContent = personalInfo.name || '';
  patientSignature.appendChild(patientName);
  
  const patientLabel = document.createElement('p');
  patientLabel.className = 'text-center text-sm text-gray-600';
  patientLabel.textContent = 'Gestante';
  patientSignature.appendChild(patientLabel);
  
  // Doctor signature
  const doctorSignature = document.createElement('div');
  const doctorLine = document.createElement('div');
  doctorLine.className = 'border-b border-black h-12 mb-2';
  doctorSignature.appendChild(doctorLine);
  
  const doctorName = document.createElement('p');
  doctorName.className = 'text-center';
  doctorName.textContent = personalInfo.healthProvider || '_________________';
  doctorSignature.appendChild(doctorName);
  
  const doctorLabel = document.createElement('p');
  doctorLabel.className = 'text-center text-sm text-gray-600';
  doctorLabel.textContent = 'Médico/Obstetra';
  doctorSignature.appendChild(doctorLabel);
  
  const doctorCRM = document.createElement('p');
  doctorCRM.className = 'text-center text-sm text-gray-600';
  doctorCRM.textContent = `CRM: ${personalInfo.healthProviderRegistry || '_________________'}`;
  doctorSignature.appendChild(doctorCRM);
  
  signatureGrid.appendChild(patientSignature);
  signatureGrid.appendChild(doctorSignature);
  
  // Additional signatures
  const additionalSignatures = document.createElement('div');
  additionalSignatures.className = 'grid grid-cols-2 gap-8 mt-8';
  
  // Pediatrician signature
  const pediatricianSignature = document.createElement('div');
  const pediatricianLine = document.createElement('div');
  pediatricianLine.className = 'border-b border-black h-12 mb-2';
  pediatricianSignature.appendChild(pediatricianLine);
  
  const pediatricianName = document.createElement('p');
  pediatricianName.className = 'text-center';
  pediatricianName.textContent = personalInfo.pediatrician || '_________________';
  pediatricianSignature.appendChild(pediatricianName);
  
  const pediatricianLabel = document.createElement('p');
  pediatricianLabel.className = 'text-center text-sm text-gray-600';
  pediatricianLabel.textContent = 'Pediatra Neonatal';
  pediatricianSignature.appendChild(pediatricianLabel);
  
  const pediatricianCRM = document.createElement('p');
  pediatricianCRM.className = 'text-center text-sm text-gray-600';
  pediatricianCRM.textContent = `CRM: ${personalInfo.pediatricianRegistry || '_________________'}`;
  pediatricianSignature.appendChild(pediatricianCRM);
  
  // Doula signature
  const doulaSignature = document.createElement('div');
  const doulaLine = document.createElement('div');
  doulaLine.className = 'border-b border-black h-12 mb-2';
  doulaSignature.appendChild(doulaLine);
  
  const doulaName = document.createElement('p');
  doulaName.className = 'text-center';
  doulaName.textContent = personalInfo.doula || '_________________';
  doulaSignature.appendChild(doulaName);
  
  const doulaLabel = document.createElement('p');
  doulaLabel.className = 'text-center text-sm text-gray-600';
  doulaLabel.textContent = 'Doula';
  doulaSignature.appendChild(doulaLabel);
  
  const doulaRegistry = document.createElement('p');
  doulaRegistry.className = 'text-center text-sm text-gray-600';
  doulaRegistry.textContent = `Registro: ${personalInfo.doulaRegistry || '_________________'}`;
  doulaSignature.appendChild(doulaRegistry);
  
  additionalSignatures.appendChild(pediatricianSignature);
  additionalSignatures.appendChild(doulaSignature);
  
  signatureSection.appendChild(signatureGrid);
  signatureSection.appendChild(additionalSignatures);
  container.appendChild(signatureSection);
  
  // Add footer with date
  const footer = document.createElement('div');
  footer.className = 'mt-8 text-center';
  footer.textContent = `Criado em ${new Date().toLocaleDateString()}`;
  container.appendChild(footer);
  
  // Make the container visible for export
  container.style.display = 'block';
};
