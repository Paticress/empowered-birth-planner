
/**
 * Renders the signature section at the bottom of the birth plan
 * @param personalInfo The personal information from the birth plan
 * @param container The container element to render into
 */
export const renderSignatures = (
  personalInfo: Record<string, any>,
  container: HTMLElement
): void => {
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
};
