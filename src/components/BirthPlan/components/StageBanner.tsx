
interface StageBannerProps {
  currentStage: string;
}

export function StageBanner({ currentStage }: StageBannerProps) {
  const getStageTitle = () => {
    switch (currentStage) {
      case 'welcome':
        return 'Bem-vinda ao Construtor de Plano de Parto';
      case 'questionnaire':
        return 'Questionário do Plano de Parto';
      case 'editor':
        return 'Editor do Plano de Parto';
      case 'preview':
        return 'Visualização do Plano de Parto';
      case 'share':
        return 'Compartilhar seu Plano de Parto';
      default:
        return 'Plano de Parto';
    }
  };

  return (
    <div className="mb-6 p-3 bg-maternal-100 border-l-4 border-maternal-400 rounded-md">
      <h1 className="text-xl font-semibold text-maternal-800">
        {getStageTitle()}
      </h1>
    </div>
  );
}
