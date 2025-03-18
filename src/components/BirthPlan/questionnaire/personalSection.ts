
import { QuestionSection } from '../types/questionnaire';

export const personalSection: QuestionSection = {
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
    {
      id: 'hospital',
      text: 'Em qual hospital/maternidade você planeja dar à luz?',
      type: 'text',
      isRequired: true,
    },
    {
      id: 'doula',
      text: 'Você terá acompanhamento de uma doula?',
      type: 'radio',
      options: ['Sim', 'Não'],
      isRequired: false,
    },
    {
      id: 'doulaName',
      text: 'Se sim, qual o nome da sua doula?',
      type: 'text',
      conditionalDisplay: {
        dependsOn: 'doula',
        showWhen: 'Sim',
      },
      isRequired: false,
    },
    {
      id: 'companions',
      text: 'Quem você gostaria que estivesse presente durante o parto?',
      type: 'textarea',
      isRequired: true,
    },
  ],
};
