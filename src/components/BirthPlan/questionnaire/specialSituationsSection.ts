
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
      description: 'Escolhas para casos em que o parto não ocorre conforme o planejado'
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
      description: 'Preferências para situações em que o bebê necessita de cuidados intensivos'
    },
    {
      id: 'specialWishes',
      text: 'Outros desejos ou pedidos especiais:',
      type: 'textarea',
      isRequired: false,
      description: 'Qualquer outra solicitação ou informação importante que não tenha sido abordada'
    },
  ],
};
