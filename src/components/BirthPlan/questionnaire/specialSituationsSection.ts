
import { QuestionSection } from '../types/questionnaire';

export const specialSituationsSection: QuestionSection = {
  id: 'specialSituations',
  title: 'Situações Especiais',
  description: 'Preferências para situações inesperadas',
  questions: [
    {
      id: 'complications',
      text: 'Em caso de complicações:',
      type: 'checkbox',
      options: [
        'Explicar claramente a situação antes de qualquer procedimento',
        'O pai/acompanhante deve ser informado se eu não puder',
        'Permitir que eu participe das decisões sempre que possível',
        'Priorizar a saúde e segurança conforme indicação médica'
      ],
      isRequired: false,
    },
    {
      id: 'nicu',
      text: 'Se o bebê precisar ir para UTI neonatal:',
      type: 'checkbox',
      options: [
        'Desejo ver o bebê antes da transferência',
        'O pai/acompanhante deve acompanhar o bebê',
        'Quero extrair leite para alimentação do bebê',
        'Desejo praticar o método canguru assim que possível',
        'Desejo participar dos cuidados do bebê'
      ],
      isRequired: false,
    },
    {
      id: 'specialWishes',
      text: 'Outros desejos ou pedidos especiais:',
      type: 'textarea',
      isRequired: false,
    },
  ],
};
