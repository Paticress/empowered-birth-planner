
import { BuilderStage } from './types/questionnaire';
import { BirthPlanHeader } from './BirthPlanHeader';
import { StageContent } from './StageContent';
import { Footer } from '@/components/Footer';

interface BuilderMainContentProps {
  currentStage: BuilderStage;
  birthPlanContent: Record<string, any>;
  questionnaireAnswers: Record<string, any>;
  embedded: boolean;
  onQuestionnaireSubmit: (data: Record<string, any>) => void;
  onUpdateBirthPlan: (data: Record<string, any>) => void;
  onNextStage: () => void;
  onGoToStage: (stage: BuilderStage) => void;
}

export function BuilderMainContent({
  currentStage,
  birthPlanContent,
  questionnaireAnswers,
  embedded,
  onQuestionnaireSubmit,
  onUpdateBirthPlan,
  onNextStage,
  onGoToStage
}: BuilderMainContentProps) {
  return (
    <div className={`bg-maternal-50 min-h-screen ${embedded ? 'embedded-mode' : ''}`} 
         role="main" 
         aria-label="Construa seu Plano de Parto">
      <div className="pt-4 md:pt-8">
        <BirthPlanHeader currentStage={currentStage} onStageChange={onGoToStage} />
        
        <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Versão compacta do banner de informações */}
          <div className="mb-6 p-3 bg-maternal-100 border-l-4 border-maternal-400 rounded-md">
            <h1 className="text-xl font-semibold text-maternal-800">
              {currentStage === 'welcome' ? 'Bem-vinda ao Construtor de Plano de Parto' : 
               currentStage === 'questionnaire' ? 'Questionário do Plano de Parto' :
               currentStage === 'editor' ? 'Editor do Plano de Parto' :
               currentStage === 'preview' ? 'Visualização do Plano de Parto' :
               'Compartilhar seu Plano de Parto'}
            </h1>
          </div>
          
          <div className="bg-white shadow-xl rounded-lg p-6 md:p-8 mb-8 border-t-4 border-maternal-400">
            <StageContent 
              currentStage={currentStage}
              birthPlanContent={birthPlanContent}
              questionnaireAnswers={questionnaireAnswers}
              onQuestionnaireSubmit={onQuestionnaireSubmit}
              onUpdateBirthPlan={onUpdateBirthPlan}
              onNextStage={onNextStage}
              onGoToStage={onGoToStage}
            />
          </div>
        </main>
        
        <Footer />
      </div>
    </div>
  );
}
