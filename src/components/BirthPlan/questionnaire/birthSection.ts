
import { QuestionSection } from '../types/questionnaire';

export const birthSection: QuestionSection = {
  id: 'birth',
  title: 'Nascimento',
  description: 'Suas preferências para o momento do nascimento',
  questions: [
    {
      id: 'birthPositions',
      text: 'Posições para o nascimento:',
      type: 'checkbox',
      options: [
        'Liberdade para escolher a posição',
        'Preferência por posição vertical/cócoras',
        'Lateralizada',
        'De quatro',
        'Semi-sentada',
        'Conforme orientação no momento'
      ],
      isRequired: false,
    },
    {
      id: 'episiotomy',
      text: 'Sobre episiotomia:',
      type: 'radio',
      options: [
        'Prefiro evitar, mesmo que resulte em laceração natural',
        'Aceito apenas se absolutamente necessário',
        'Conforme recomendação médica no momento'
      ],
      isRequired: false,
    },
    {
      id: 'cordCutting',
      text: 'Sobre o corte do cordão umbilical:',
      type: 'checkbox',
      options: [
        'Aguardar o cordão parar de pulsar antes do corte',
        'Pai/acompanhante realizar o corte',
        'Coleta de células-tronco',
        'Conforme protocolo hospitalar'
      ],
      isRequired: false,
    },
    {
      id: 'skinToSkin',
      text: 'Contato pele a pele imediato:',
      type: 'radio',
      options: [
        'Sim, mesmo antes dos procedimentos de rotina',
        'Sim, após procedimentos essenciais',
        'Não, prefiro que limpem o bebê primeiro',
        'Conforme recomendação médica'
      ],
      isRequired: false,
    },
    {
      id: 'placenta',
      text: 'Sobre a placenta:',
      type: 'radio',
      options: [
        'Quero ver a placenta',
        'Gostaria de levar a placenta',
        'Não tenho interesse na placenta',
        'Conforme protocolo hospitalar'
      ],
      isRequired: false,
    },
  ],
};
