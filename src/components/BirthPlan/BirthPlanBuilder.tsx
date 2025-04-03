
import { useEffect } from 'react';
import { BirthPlanHeader } from './BirthPlanHeader';
import { Footer } from '@/components/Footer';
import { useBirthPlanState } from './hooks/useBirthPlanState';
import { useAuthCheck } from './hooks/useAuthCheck';
import { StageContent } from './components/StageContent';
import { LoadingState } from './components/LoadingState';
import { StageBanner } from './components/StageBanner';

export function BirthPlanBuilder() {
  console.log("RENDERING BIRTH PLAN BUILDER COMPONENT - THIS SHOULD BE VISIBLE");
  
  const {
    currentStage,
    birthPlanContent,
    questionnaireAnswers,
    goToNextStage,
    goToStage,
    handleQuestionnaireSubmit,
    setBirthPlanContent
  } = useBirthPlanState();
  
  const { isLoading, isAuthenticated, isAuthorized } = useAuthCheck();

  // Return loading indicator if still checking auth
  if (isLoading) {
    return <LoadingState />;
  }

  // Don't render the content if there's no authenticated user
  if (!isAuthenticated) return null;

  return (
    <div className="bg-maternal-50 min-h-screen" role="main" aria-label="Construa seu Plano de Parto">
      <div className="pt-4 md:pt-8">
        <BirthPlanHeader currentStage={currentStage} onStageChange={goToStage} />
        
        <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <StageBanner currentStage={currentStage} />
          
          <div className="bg-white shadow-xl rounded-lg p-6 md:p-8 mb-8 border-t-4 border-maternal-400">
            <StageContent 
              currentStage={currentStage}
              birthPlanContent={birthPlanContent}
              questionnaireAnswers={questionnaireAnswers}
              onQuestionnaireSubmit={handleQuestionnaireSubmit}
              onUpdateBirthPlan={setBirthPlanContent}
              onNextStage={goToNextStage}
              onGoToStage={goToStage}
            />
          </div>
        </main>
        
        <Footer />
      </div>
    </div>
  );
}
