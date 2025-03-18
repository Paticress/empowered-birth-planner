
/**
 * Shared definition of birth plan sections for use across components
 */
export const birthPlanSections = [
  {
    id: 'personalInfo',
    title: 'Informações Pessoais',
    color: 'purple-200',
    fields: [
      { key: 'name', label: 'Nome Completo' },
      { key: 'dueDate', label: 'Data Prevista do Parto' },
      { key: 'healthProvider', label: 'Médico/Obstetra' },
    ],
  },
  {
    id: 'preferences',
    title: 'Preferências para o Parto',
    color: 'purple-300',
    fields: [
      { key: 'environment', label: 'Ambiente e Atmosfera' },
      { key: 'mobility', label: 'Movimentação durante o Trabalho de Parto' },
      { key: 'pain', label: 'Gerenciamento da Dor' },
      { key: 'interventions', label: 'Intervenções Médicas' },
    ],
  },
  {
    id: 'medicalConsiderations',
    title: 'Considerações Médicas',
    color: 'purple-400',
    fields: [
      { key: 'conditions', label: 'Condições Médicas' },
      { key: 'medications', label: 'Medicamentos' },
      { key: 'allergies', label: 'Alergias' },
    ],
  },
  {
    id: 'postpartum',
    title: 'Pós-Parto',
    color: 'purple-500',
    fields: [
      { key: 'newbornCare', label: 'Cuidados com o Recém-Nascido' },
      { key: 'feeding', label: 'Amamentação' },
      { key: 'recovery', label: 'Recuperação' },
    ],
  },
];

export interface BirthPlanSection {
  id: string;
  title: string;
  color?: string;
  fields: BirthPlanField[];
}

export interface BirthPlanField {
  key: string;
  label: string;
}
