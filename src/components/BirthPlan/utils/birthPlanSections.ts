
/**
 * Shared definition of birth plan sections for use across components
 */
export const birthPlanSections = [
  {
    id: 'personalInfo',
    title: 'Informações Pessoais',
    color: '200',
    fields: [
      { key: 'name', label: 'Nome Completo' },
      { key: 'dueDate', label: 'Data Prevista do Parto' },
      { key: 'healthProvider', label: 'Médico/Obstetra' },
      { key: 'healthProviderContact', label: 'Telefone do Médico/Obstetra' },
      { key: 'healthProviderRegistry', label: 'Registro Profissional (CRM)' },
      { key: 'birthLocation', label: 'Local Planejado para o Parto' },
      { key: 'hospital', label: 'Hospital/Maternidade de Referência' },
      { key: 'hospitalAddress', label: 'Endereço da Maternidade' },
      { key: 'hospitalPhone', label: 'Telefone da Maternidade' },
      { key: 'pediatrician', label: 'Pediatra Neonatal' },
      { key: 'pediatricianContact', label: 'Telefone do Pediatra' },
      { key: 'pediatricianRegistry', label: 'Registro Profissional (CRM)' },
      { key: 'midwife', label: 'Enfermeira Obstetriz' },
      { key: 'midwifeContact', label: 'Telefone da Enfermeira Obstetriz' },
      { key: 'midwifeRegistry', label: 'Registro Profissional (COREN)' },
      { key: 'doula', label: 'Doula' },
      { key: 'doulaContact', label: 'Telefone da Doula' },
      { key: 'doulaRegistry', label: 'Certificação da Doula' },
      { key: 'companions', label: 'Acompanhantes' },
    ],
  },
  {
    id: 'atmosfera',
    title: 'Atmosfera e Ambiente',
    color: '300',
    fields: [
      { key: 'lighting', label: 'Iluminação' },
      { key: 'sound', label: 'Som' },
      { key: 'clothing', label: 'Vestimenta' },
      { key: 'photos', label: 'Fotos e Filmagem' },
    ],
  },
  {
    id: 'trabalhoDeParto',
    title: 'Trabalho de Parto',
    color: '400',
    fields: [
      { key: 'mobility', label: 'Movimentação' },
      { key: 'positions', label: 'Posições' },
      { key: 'hydration', label: 'Hidratação e Alimentação' },
      { key: 'monitoring', label: 'Monitoramento Fetal' },
      { key: 'painRelief', label: 'Alívio da Dor' },
      { key: 'interventionsRoutine', label: 'Procedimentos e Intervenções' },
      { key: 'consentimentoInformado', label: 'Consentimento Informado' },
    ],
  },
  {
    id: 'nascimento',
    title: 'Nascimento',
    color: '500',
    fields: [
      { key: 'birthPositions', label: 'Posições para o Parto' },
      { key: 'episiotomy', label: 'Episiotomia' },
      { key: 'cordCutting', label: 'Corte do Cordão' },
      { key: 'skinToSkin', label: 'Contato Pele a Pele' },
      { key: 'placenta', label: 'Placenta' },
    ],
  },
  {
    id: 'cesarea',
    title: 'Em Caso de Cesárea',
    color: '600',
    fields: [
      { key: 'cesareanPreferences', label: 'Preferências para Cesárea' },
      { key: 'anesthesia', label: 'Anestesia' },
      { key: 'cesareanCompanion', label: 'Acompanhante na Cesárea' },
      { key: 'curtain', label: 'Cortina Cirúrgica' },
      { key: 'cesareanSkinToSkin', label: 'Contato Pele a Pele na Cesárea' },
    ],
  },
  {
    id: 'posParto',
    title: 'Pós-Parto',
    color: '700',
    fields: [
      { key: 'firstHour', label: 'Primeira Hora' },
      { key: 'breastfeeding', label: 'Amamentação' },
      { key: 'newbornCare', label: 'Cuidados com o Recém-Nascido' },
      { key: 'vaccination', label: 'Vacinação' },
      { key: 'motherCare', label: 'Cuidados com a Mãe' },
    ],
  },
  {
    id: 'situacoesEspeciais',
    title: 'Situações Especiais',
    color: '800',
    fields: [
      { key: 'complications', label: 'Em Caso de Complicações' },
      { key: 'cascadeInterventions', label: 'Prevenção de Efeito Cascata' },
      { key: 'emergencyScenarios', label: 'Situações de Emergência' },
      { key: 'highRiskComplications', label: 'Complicações de Alto Risco' },
      { key: 'lowRiskOccurrences', label: 'Ocorrências de Baixo Risco' },
      { key: 'nicu', label: 'Se o Bebê Precisar ir para UTI' },
      { key: 'unexpectedScenarios', label: 'Em Cenários Não Planejados' },
      { key: 'specialWishes', label: 'Desejos Especiais' },
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
