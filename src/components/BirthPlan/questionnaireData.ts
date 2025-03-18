
import { QuestionSection } from './types/questionnaire';

export const questionnaireSections: QuestionSection[] = [
  {
    id: 'personal',
    title: 'Informações Pessoais',
    description: 'Vamos começar com algumas informações básicas sobre você e sua gravidez',
    questions: [
      {
        id: 'name',
        text: 'Qual é o seu nome completo?',
        type: 'text',
        isRequired: true,
      },
      {
        id: 'dueDate',
        text: 'Qual é a sua data prevista para o parto?',
        type: 'text',
        isRequired: true,
      },
      {
        id: 'healthProvider',
        text: 'Quem é seu médico/obstetra?',
        type: 'text',
        isRequired: true,
      },
    ],
  },
  {
    id: 'medical',
    title: 'Histórico Médico',
    description: 'Estas informações ajudarão a personalizar seu plano de acordo com suas necessidades médicas',
    questions: [
      {
        id: 'hasConditions',
        text: 'Você tem alguma condição médica relevante para o parto?',
        type: 'radio',
        options: ['Sim', 'Não'],
        isRequired: true,
      },
      {
        id: 'medicalConditions',
        text: 'Se sim, descreva suas condições médicas:',
        type: 'textarea',
      },
      {
        id: 'medications',
        text: 'Você está tomando algum medicamento atualmente?',
        type: 'textarea',
      },
      {
        id: 'allergies',
        text: 'Você tem alguma alergia?',
        type: 'textarea',
      },
    ],
  },
  {
    id: 'preferences',
    title: 'Preferências para o Parto',
    description: 'Compartilhe suas preferências para o ambiente e procedimentos durante o parto',
    questions: [
      {
        id: 'birthPlacePreference',
        text: 'Onde você prefere dar à luz?',
        type: 'radio',
        options: ['Hospital', 'Casa de Parto', 'Em casa', 'Outro'],
        isRequired: true,
      },
      {
        id: 'companionPreference',
        text: 'Quem você gostaria que estivesse presente durante o parto?',
        type: 'textarea',
        isRequired: true,
      },
      {
        id: 'painManagementPreference',
        text: 'Quais são suas preferências para alívio da dor?',
        type: 'textarea',
        isRequired: true,
      },
    ],
  },
];
