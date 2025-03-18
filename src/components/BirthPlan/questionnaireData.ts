
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
  },
  {
    id: 'atmosphere',
    title: 'Atmosfera e Ambiente',
    description: 'Suas preferências para o ambiente durante o trabalho de parto e nascimento',
    questions: [
      {
        id: 'lighting',
        text: 'Preferências para iluminação:',
        type: 'checkbox',
        options: [
          'Luzes baixas/atenuadas',
          'Luz natural quando possível',
          'Evitar luzes fortes',
          'Trazer minha própria iluminação (velas LED, etc)',
        ],
        isRequired: false,
      },
      {
        id: 'sound',
        text: 'Preferências para som e música:',
        type: 'checkbox',
        options: [
          'Ambiente tranquilo e silencioso',
          'Trarei minha própria playlist',
          'Conversas e comandos em tom de voz baixo',
          'Sem preferências específicas',
        ],
        isRequired: false,
      },
      {
        id: 'clothing',
        text: 'Preferências sobre vestimenta durante o trabalho de parto:',
        type: 'radio',
        options: [
          'Usar minhas próprias roupas',
          'Usar camisola do hospital',
          'Ficar sem roupa se desejar',
          'Decidir no momento'
        ],
        isRequired: false,
      },
      {
        id: 'photos',
        text: 'Sobre fotos e filmagens:',
        type: 'checkbox',
        options: [
          'Permitido fotografar todo o processo',
          'Fotografias apenas em momentos específicos',
          'Sem fotografias',
          'Trarei fotógrafo profissional',
        ],
        isRequired: false,
      },
    ],
  },
  {
    id: 'laborPreferences',
    title: 'Trabalho de Parto',
    description: 'Suas preferências durante o trabalho de parto',
    questions: [
      {
        id: 'mobility',
        text: 'Sobre sua movimentação durante o trabalho de parto:',
        type: 'checkbox',
        options: [
          'Liberdade para me movimentar conforme desejar',
          'Acesso a banheira/chuveiro',
          'Uso de bola de pilates',
          'Caminhar livremente',
          'Preferência por permanecer na cama'
        ],
        isRequired: false,
      },
      {
        id: 'positions',
        text: 'Posições que você gostaria de experimentar:',
        type: 'checkbox',
        options: [
          'De cócoras',
          'De quatro',
          'Lateralizada',
          'Em pé',
          'Na banheira',
          'Decidir no momento'
        ],
        isRequired: false,
      },
      {
        id: 'hydration',
        text: 'Sobre hidratação e alimentação:',
        type: 'checkbox',
        options: [
          'Liberdade para beber água/líquidos',
          'Liberdade para alimentação leve',
          'Gostaria de ter acesso a picolés/gelo',
          'Aceito apenas soro se necessário'
        ],
        isRequired: false,
      },
      {
        id: 'monitoring',
        text: 'Sobre monitoramento fetal:',
        type: 'radio',
        options: [
          'Monitoramento intermitente, se possível',
          'Aceito monitoramento contínuo apenas se necessário',
          'Prefiro monitoramento contínuo',
          'Conforme recomendação médica'
        ],
        isRequired: false,
      },
      {
        id: 'painRelief',
        text: 'Sobre alívio da dor:',
        type: 'checkbox',
        options: [
          'Prefiro evitar analgesia farmacológica',
          'Gostaria de ter acesso à analgesia se solicitar',
          'Gostaria de usar métodos não-farmacológicos (chuveiro, massagem, etc)',
          'Prefiro decidir durante o trabalho de parto'
        ],
        isRequired: false,
      },
      {
        id: 'interventions',
        text: 'Sobre procedimentos e intervenções:',
        type: 'checkbox',
        options: [
          'Prefiro evitar ocitocina sintética',
          'Prefiro evitar ruptura artificial de membranas',
          'Aceito intervenções apenas se explicadas e necessárias',
          'Quero ser informada antes de qualquer procedimento',
          'Prefiro seguir as recomendações médicas'
        ],
        isRequired: false,
      },
    ],
  },
  {
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
  },
  {
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
  },
  {
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
  },
  {
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
  },
];
