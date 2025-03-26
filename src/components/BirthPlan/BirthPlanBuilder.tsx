
import { useEffect } from 'react';
import { BuilderMainContent } from './BuilderMainContent';
import { toast } from '@/components/ui/use-toast';
import { useBirthPlanState } from './hooks/useBirthPlanState';

export function BirthPlanBuilder({ embedded = false }: { embedded?: boolean }) {
  const {
    currentStage,
    birthPlanContent,
    questionnaireAnswers,
    goToNextStage,
    goToStage,
    handleQuestionnaireSubmit,
    setBirthPlanContent
  } = useBirthPlanState();

  useEffect(() => {
    // Log when the component mounts to verify it's being rendered
    console.log("BirthPlanBuilder mounted, current stage:", currentStage);
    
    // When embedded, log additional information
    if (embedded) {
      console.log("BirthPlanBuilder running in embedded mode");
    }
    
    // Force a re-render after a short delay to ensure component display
    const timer = setTimeout(() => {
      console.log("Forcing re-render check after timeout");
    }, 1000);
    
    return () => clearTimeout(timer);
  }, [currentStage, embedded]);

  return (
    <BuilderMainContent
      currentStage={currentStage}
      birthPlanContent={birthPlanContent}
      questionnaireAnswers={questionnaireAnswers}
      embedded={embedded}
      onQuestionnaireSubmit={handleQuestionnaireSubmit}
      onUpdateBirthPlan={setBirthPlanContent}
      onNextStage={goToNextStage}
      onGoToStage={goToStage}
    />
  );
}
