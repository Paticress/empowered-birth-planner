
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
      id: 'cascadeInterventions',
      text: 'Prevenção do efeito cascata de intervenções:',
      type: 'checkbox',
      options: [
        'Desejo ser consultada antes de qualquer intervenção, mesmo as consideradas rotineiras',
        'Quero discutir alternativas antes de iniciar qualquer intervenção médica',
        'Prefiro aguardar o tempo fisiológico do meu corpo antes de considerar aceleradores',
        'Solicito que toda indução ou aceleração do parto seja justificada clinicamente',
        'Gostaria de evitar ocitocina sintética a menos que seja absolutamente necessária',
        'Se for necessária ocitocina, prefiro iniciar com doses baixas e aumentar gradualmente',
        'Desejo evitar amniotomia (romper a bolsa) a menos que haja indicação clínica clara',
        'Prefiro tentar métodos não-farmacológicos antes de recorrer a medicamentos',
        'Entendo que cada intervenção pode levar à necessidade de outras e quero ser informada deste risco',
        'Gostaria de ter tempo para considerar as opções antes de concordar com procedimentos eletivos'
      ],
      isRequired: false,
      description: 'Preferências para evitar intervenções desnecessárias que podem desencadear complicações'
    },
    {
      id: 'emergencyPreferences',
      text: 'Situações de emergência:',
      type: 'checkbox',
      options: [
        'Em caso de hemorragia, autorizo todas as intervenções necessárias',
        'Em situações de sofrimento fetal, priorize a segurança do bebê',
        'Se for necessária uma cesariana de emergência, desejo que meu acompanhante permaneça comigo',
        'Caso ocorra prolapso de cordão, confio na equipe para tomar as medidas adequadas',
        'Em caso de distocia de ombro, aceito as manobras necessárias para facilitar o nascimento',
        'Desejo ser informada sobre a situação mesmo em emergências, se possível',
        'Autorizo o uso de fórceps ou vácuo-extrator se houver indicação obstétrica de urgência',
        'Em emergências, gostaria que meu acompanhante fosse mantido informado em tempo real',
        'Caso precise ser anestesiada ou sedada, confio nas decisões médicas para nossa segurança',
        'Prefiro que procedimentos invasivos sejam explicados mesmo que rapidamente'
      ],
      isRequired: false,
      description: 'Suas preferências específicas para emergências obstétricas'
    },
    {
      id: 'highRiskComplications',
      text: 'Complicações de alto risco:',
      type: 'checkbox',
      options: [
        'Em caso de descolamento prematuro de placenta, aceito cesariana imediata',
        'Se houver sinais de rotura uterina, autorizo intervenção imediata',
        'Para hemorragia pós-parto, aceito todas as medidas necessárias para controle',
        'Em caso de prolapso de cordão, aceito posicionamento de quatro apoios e cesariana',
        'Caso haja sinais de infecção uterina, aceito medicação e intervenções necessárias',
        'Em casos de pré-eclâmpsia severa, confio no julgamento médico para seguir protocolos',
        'Para placenta prévia com sangramento, aceito repouso e/ou cesariana conforme necessário',
        'Se houver suspeita de embolia amniótica, autorizo todas as medidas de suporte',
        'Em caso de aspiração de mecônio pelo bebê, concordo com aspiração e tratamento imediatos',
        'Se houver parada cardíaca materna, priorize a ressuscitação e cesariana perimortem se necessário'
      ],
      isRequired: false,
      description: 'Suas preferências para situações que representam riscos graves'
    },
    {
      id: 'lowRiskOccurrences',
      text: 'Ocorrências de baixo risco:',
      type: 'checkbox',
      options: [
        'Caso seja detectada circular de cordão, prefiro que seja resolvida naturalmente quando possível',
        'Para distocia de ombro leve, prefiro primeiro tentar mudanças de posição',
        'Se o trabalho de parto estiver prolongado, gostaria de evitar acelerações se eu e o bebê estivermos bem',
        'Caso a bolsa rompa, prefiro aguardar o início natural do trabalho de parto (até 24h se não houver sinais de infecção)',
        'Se o bebê for considerado "grande", ainda assim gostaria de tentar parto normal com assistência adequada',
        'Em caso de mecônio leve na água, prefiro monitoramento fetal ao invés de intervenção imediata',
        'Para desacelerações ocasionais dos batimentos fetais, gostaria de tentar mudança de posição primeiro',
        'Se houver febre materna leve, prefiro usar métodos físicos de resfriamento antes de medicação',
        'Caso o colo uterino dilate lentamente, gostaria de ter paciência se os sinais vitais estiverem normais',
        'Para dor lombar intensa durante o trabalho de parto, gostaria de tentar contrapressão e massagem'
      ],
      isRequired: false,
      description: 'Preferências para situações comuns que geralmente não representam emergências'
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
