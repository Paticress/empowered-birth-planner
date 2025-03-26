
import { useEffect, useState } from 'react';
import { BuilderMainContent } from './BuilderMainContent';
import { useBirthPlanState } from './hooks/useBirthPlanState';
import { PaymentGate } from './PaymentGate';
import { LoadingIndicator } from './LoadingIndicator';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

export function BirthPlanBuilder({ embedded = false }: { embedded?: boolean }) {
  const navigate = useNavigate();
  const [hasAccess, setHasAccess] = useState<boolean>(false);
  const [checkingPayment, setCheckingPayment] = useState<boolean>(true);

  const {
    currentStage,
    birthPlanContent,
    questionnaireAnswers,
    goToNextStage,
    goToStage,
    handleQuestionnaireSubmit,
    setBirthPlanContent
  } = useBirthPlanState();

  // Log when the component mounts to verify it's being rendered
  useEffect(() => {
    console.log("BirthPlanBuilder mounted, current stage:", currentStage);
  }, [currentStage]);

  // Verify if the user has already paid
  useEffect(() => {
    // When embedded, skip payment verification
    if (embedded) {
      console.log("BirthPlanBuilder running in embedded mode");
      setHasAccess(true);
      setCheckingPayment(false);
      return;
    }
    
    // Check payment from localStorage
    const checkPaymentStatus = () => {
      const paidStatus = localStorage.getItem('birthPlanPaid');
      const paymentTimestamp = localStorage.getItem('birthPlanPaymentTimestamp');
      
      // Check if payment is valid (within 9 months)
      if (paidStatus === 'true' && paymentTimestamp) {
        const paymentDate = Number(paymentTimestamp);
        const expirationDate = paymentDate + (9 * 30 * 24 * 60 * 60 * 1000); // 9 months in milliseconds
        
        if (Date.now() < expirationDate) {
          console.log("User has valid access");
          setHasAccess(true);
        } else {
          console.log("Payment expired");
          toast.error("Acesso expirado", {
            description: "Seu acesso ao plano de parto expirou. Por favor, renove para continuar."
          });
        }
      }
      
      setCheckingPayment(false);
    };
    
    checkPaymentStatus();
  }, [embedded]);

  // Função para simular pagamento (para demonstração)
  const handlePaymentComplete = () => {
    console.log("Simulating payment completion");
    localStorage.setItem('birthPlanPaid', 'true');
    localStorage.setItem('birthPlanPaymentTimestamp', Date.now().toString());
    
    toast.success("Pagamento processado com sucesso!", {
      description: "Você agora tem acesso ao Plano de Parto Personalizado"
    });
    
    setHasAccess(true);
  };

  // If checking payment, show loading indicator
  if (checkingPayment) {
    return <LoadingIndicator />;
  }

  // If user doesn't have access, show PaymentGate
  if (!hasAccess && !embedded) {
    return <PaymentGate onPaymentComplete={handlePaymentComplete} />;
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
