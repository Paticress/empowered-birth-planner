
import { QuestionSection } from '../types/questionnaire';

export const cesareanSection: QuestionSection = {
  id: 'cesarean',
  title: 'Em Caso de Cesárea',
  description: 'Suas preferências caso seja necessária uma cesárea',
  questions: [
    {
      id: 'cesareanPreferences',
      text: 'Preferências para cesárea (se necessária):',
      type: 'checkbox',
      options: [
        'Cesárea humanizada/gentil',
        'Explicação dos procedimentos em tempo real',
        'Música ambiente de minha escolha',
        'Diminuição das luzes, se possível',
        'Sem preferências específicas'
      ],
      isRequired: false,
    },
    {
      id: 'anesthesia',
      text: 'Tipo de anestesia preferida:',
      type: 'radio',
      options: [
        'Raquidiana/peridural',
        'Anestesia geral apenas se necessário',
        'Conforme recomendação do anestesista'
      ],
      isRequired: false,
    },
    {
      id: 'cesareanCompanion',
      text: 'Sobre acompanhante na cesárea:',
      type: 'radio',
      options: [
        'Desejo acompanhante presente durante todo o procedimento',
        'Desejo acompanhante apenas após o nascimento',
        'Não quero acompanhante na sala'
      ],
      isRequired: false,
    },
    {
      id: 'curtain',
      text: 'Sobre a cortina cirúrgica:',
      type: 'radio',
      options: [
        'Gostaria que a cortina fosse abaixada no momento do nascimento',
        'Prefiro que a cortina seja mantida o tempo todo',
        'Sem preferências'
      ],
      isRequired: false,
    },
    {
      id: 'cesareanSkinToSkin',
      text: 'Contato pele a pele na cesárea:',
      type: 'radio',
      options: [
        'Desejo contato pele a pele imediato ainda na sala cirúrgica',
        'Desejo que o pai/acompanhante tenha contato pele a pele se eu não puder',
        'Prefiro que o bebê seja examinado antes',
        'Conforme possibilidade médica'
      ],
      isRequired: false,
    },
  ],
};
