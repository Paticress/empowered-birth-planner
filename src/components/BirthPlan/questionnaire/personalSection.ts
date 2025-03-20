
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
      id: 'birthLocation',
      text: 'Onde você planeja dar à luz?',
      type: 'radio',
      options: ['Hospital/Maternidade', 'Casa de Parto', 'Domicílio (Parto em Casa)'],
      isRequired: true,
      description: 'É importante ter um hospital/maternidade de referência mesmo para partos domiciliares ou em casa de parto.'
    },
    {
      id: 'hospital',
      text: 'Qual hospital/maternidade de referência para o seu parto?',
      type: 'text',
      isRequired: true,
      description: 'Hospital que você irá caso precise, mesmo se planeja parto domiciliar ou em casa de parto.'
    },
    {
      id: 'midwife',
      text: 'Você terá acompanhamento de uma Enfermeira Obstetriz?',
      type: 'radio',
      options: ['Sim', 'Não'],
      isRequired: false,
    },
    {
      id: 'midwifeName',
      text: 'Se sim, qual o nome da sua Enfermeira Obstetriz?',
      type: 'text',
      conditionalDisplay: {
        dependsOn: 'midwife',
        showWhen: 'Sim',
      },
      isRequired: false,
    },
    {
      id: 'midwifeRegistry',
      text: 'Registro profissional (COREN) da Enfermeira Obstetriz:',
      type: 'text',
      conditionalDisplay: {
        dependsOn: 'midwife',
        showWhen: 'Sim',
      },
      isRequired: false,
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
