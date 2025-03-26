
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
      
      // Set a timeout to check if the component is still mounted after a delay
      const timer = setTimeout(() => {
        console.log("BirthPlanBuilder still mounted after delay, current stage:", currentStage);
        
        // Send a message to the parent window to confirm loading
        try {
          window.parent.postMessage({ 
            type: 'birthPlanStatus', 
            status: 'ready',
            stage: currentStage 
          }, '*');
        } catch (e) {
          console.error("Error sending message to parent:", e);
        }
      }, 2000);
      
      return () => clearTimeout(timer);
    }
  }, [currentStage, embedded]);

  // Log render
  console.log("BirthPlanBuilder rendering", { embedded, currentStage });

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
