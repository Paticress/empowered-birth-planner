
import { useEffect } from 'react';
import { BuilderMainContent } from './BuilderMainContent';
import { useBirthPlanState } from './hooks/useBirthPlanState';
import { PaymentGate } from './PaymentGate';
import { LoadingIndicator } from './LoadingIndicator';
import { useAccessVerification } from './hooks/useAccessVerification';

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

  const { hasAccess, checkingPayment, setHasAccess } = useAccessVerification(embedded);

  // Log when the component mounts to verify it's being rendered
  useEffect(() => {
    console.log("BirthPlanBuilder mounted, current stage:", currentStage);
  }, [currentStage]);

  // If checking payment, show loading indicator
  if (checkingPayment) {
    return <LoadingIndicator />;
  }

  // If user doesn't have access, show PaymentGate
  if (!hasAccess && !embedded) {
    return <PaymentGate onPaymentComplete={() => setHasAccess(true)} />;
  }

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
