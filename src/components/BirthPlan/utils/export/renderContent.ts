
/**
 * Renders the main content sections of the birth plan into the container
 * @param birthPlanData The birth plan data to render
 * @param container The container element to render into
 */
export const renderBirthPlanContent = (
  birthPlanData: Record<string, any>,
  container: HTMLElement
): void => {
  // Add personal info section
  renderPersonalInfoSection(birthPlanData.personalInfo || {}, container);
  
  // Loop through all other birth plan sections
  Object.entries(birthPlanData).forEach(([sectionKey, sectionData]) => {
    if (sectionKey === 'personalInfo' || !sectionData || typeof sectionData !== 'object') return;
    
    renderSection(sectionKey, sectionData as Record<string, any>, container);
  });
};

/**
 * Renders the personal information section
 */
const renderPersonalInfoSection = (
  personalInfo: Record<string, any>,
  container: HTMLElement
): void => {
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
};

/**
 * Renders a single birth plan section
 */
const renderSection = (
  sectionKey: string,
  sectionData: Record<string, any>,
  container: HTMLElement
): void => {
  const section = document.createElement('div');
  section.className = 'mb-6';
  
  const sectionTitle = document.createElement('h2');
  sectionTitle.className = 'text-xl font-bold mb-2';
  sectionTitle.textContent = getSectionDisplayName(sectionKey);
  section.appendChild(sectionTitle);
  
  const sectionContent = document.createElement('div');
  sectionContent.className = 'pl-4';
  
  // Add each field in the section
  Object.entries(sectionData).forEach(([key, value]) => {
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
};

/**
 * Helper function to get user-friendly section names
 */
const getSectionDisplayName = (sectionId: string): string => {
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
