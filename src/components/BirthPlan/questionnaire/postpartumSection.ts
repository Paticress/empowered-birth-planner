
import { QuestionSection } from '../types/questionnaire';

export const postpartumSection: QuestionSection = {
  id: 'postpartum',
  title: 'Pós-Parto',
  description: 'Suas preferências para o período pós-parto',
  questions: [
    {
      id: 'firstHour',
      text: 'Primeira hora após o nascimento:',
      type: 'checkbox',
      options: [
        'Hora dourada ininterrupta (contato pele a pele)',
        'Amamentação na primeira hora',
        'Procedimentos de rotina adiados quando possível',
        'Preferência que pai/acompanhante permaneça junto todo o tempo',
        'Sem preferências específicas'
      ],
      isRequired: false,
    },
    {
      id: 'breastfeeding',
      text: 'Sobre amamentação:',
      type: 'checkbox',
      options: [
        'Desejo amamentar exclusivamente',
        'Aceito complemento apenas se necessário e com meu consentimento',
        'Não desejo que ofereçam chupetas/bicos artificiais',
        'Gostaria de suporte de consultora de amamentação',
        'Não planejo amamentar'
      ],
      isRequired: false,
    },
    {
      id: 'newbornCare',
      text: 'Cuidados com o recém-nascido:',
      type: 'checkbox',
      options: [
        'Desejo realizar o banho do bebê',
        'Prefiro adiar o primeiro banho',
        'Quero que exames sejam feitos com o bebê em contato comigo',
        'Desejo alojamento conjunto o tempo todo',
        'Desejo administrar as vacinas'
      ],
      isRequired: false,
    },
    {
      id: 'vaccination',
      text: 'Sobre vacinação do recém-nascido:',
      type: 'radio',
      options: [
        'Todas as vacinas conforme protocolo',
        'Desejo adiar algumas vacinas (especificar)',
        'Desejo que sejam aplicadas com o bebê no meu colo',
        'Sem preferências específicas'
      ],
      isRequired: false,
    },
    {
      id: 'motherCare',
      text: 'Cuidados com a mãe no pós-parto:',
      type: 'checkbox',
      options: [
        'Respeito ao meu descanso e privacidade',
        'Visitas limitadas conforme minha escolha',
        'Preferência por analgesia não-opioide',
        'Desejo suporte para amamentação',
        'Informar-me sobre decisões relacionadas ao meu cuidado'
      ],
      isRequired: false,
    },
  ],
};
