
import { QuestionSection } from '../types/questionnaire';

export const specialSituationsSection: QuestionSection = {
  id: 'specialSituations',
  title: 'Situações Especiais',
  description: 'Preferências para situações inesperadas e emergências que podem ocorrer durante o parto',
  questions: [
    {
      id: 'complications',
      text: 'Em caso de complicações:',
      type: 'checkbox',
      options: [
        'Explicar claramente a situação antes de qualquer procedimento',
        'O pai/acompanhante deve ser informado se eu não puder',
        'Permitir que eu participe das decisões sempre que possível',
        'Priorizar a saúde e segurança conforme indicação médica',
        'Quero ser informada sobre riscos e benefícios de qualquer intervenção emergencial'
      ],
      isRequired: false,
      description: 'Escolhas para casos em que o parto não ocorre conforme o planejado'
    },
    {
      id: 'emergencyPreferences',
      text: 'Preferências em situações de emergência:',
      type: 'checkbox',
      options: [
        'Em caso de hemorragia, autorizo todas as intervenções necessárias',
        'Em situações de sofrimento fetal, priorize a segurança do bebê',
        'Se for necessária uma cesariana de emergência, desejo que meu acompanhante permaneça comigo',
        'Caso ocorra prolapso de cordão, confio na equipe para tomar as medidas adequadas',
        'Em caso de distocia de ombro, aceito as manobras necessárias para facilitar o nascimento'
      ],
      isRequired: false,
      description: 'Suas preferências específicas para emergências obstétricas'
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
        'Desejo participar dos cuidados do bebê',
        'Quero ser informada constantemente sobre o estado de saúde do bebê'
      ],
      isRequired: false,
      description: 'Preferências para situações em que o bebê necessita de cuidados intensivos'
    },
    {
      id: 'unexpectedScenarios',
      text: 'Em cenários não planejados, eu gostaria que:',
      type: 'textarea',
      isRequired: false,
      description: 'Descreva como gostaria que a equipe procedesse em situações não previstas no plano'
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
