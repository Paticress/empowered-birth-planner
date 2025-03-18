
import { QuestionSection } from '../types/questionnaire';

export const laborPreferencesSection: QuestionSection = {
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
};
