
import { useEffect, useState } from 'react';
import { BuilderMainContent } from './BuilderMainContent';
import { toast } from '@/components/ui/use-toast';
import { useBirthPlanState } from './hooks/useBirthPlanState';
import { PaymentGate } from './PaymentGate';
import { useNavigate } from 'react-router-dom';

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

  // Verificar se o usuário já pagou
  useEffect(() => {
    // Log when the component mounts to verify it's being rendered
    console.log("BirthPlanBuilder mounted, current stage:", currentStage);
    
    // When embedded, log additional information
    if (embedded) {
      console.log("BirthPlanBuilder running in embedded mode");
      setHasAccess(true);
      setCheckingPayment(false);
      return;
    }
    
    // Verificar pagamento do localStorage
    const paidStatus = localStorage.getItem('birthPlanPaid');
    const paymentTimestamp = localStorage.getItem('birthPlanPaymentTimestamp');
    
    // Verificar se o pagamento foi feito e ainda é válido (dentro de 9 meses)
    if (paidStatus === 'true' && paymentTimestamp) {
      const paymentDate = Number(paymentTimestamp);
      const expirationDate = paymentDate + (9 * 30 * 24 * 60 * 60 * 1000); // 9 meses em milissegundos
      
      if (Date.now() < expirationDate) {
        console.log("Usuário com acesso válido");
        setHasAccess(true);
      } else {
        console.log("Pagamento expirado");
        toast({
          title: "Acesso expirado",
          description: "Seu acesso ao plano de parto expirou. Por favor, renove para continuar."
        });
        navigate('/plano-personalizado');
      }
    }
    
    setCheckingPayment(false);
  }, [currentStage, embedded, navigate]);

  // Redirecionar para a página de pagamento se não tiver acesso
  useEffect(() => {
    if (!checkingPayment && !hasAccess && !embedded) {
      console.log("Usuário sem acesso, redirecionando para página de pagamento");
      navigate('/plano-personalizado');
    }
  }, [checkingPayment, hasAccess, embedded, navigate]);

  // Se estiver verificando o pagamento, mostrar indicador de carregamento
  if (checkingPayment) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-maternal-600"></div>
      </div>
    );
  }

  // Se o usuário não tem acesso, mostrar o PaymentGate
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
