
import { QuestionSection } from '../types/questionnaire';

export const atmosphereSection: QuestionSection = {
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
};
