import { useEffect, useState } from 'react';
import { BirthPlanHeader } from './BirthPlanHeader';
import { BirthPlanWelcome } from './BirthPlanWelcome';
import { BirthPlanQuestionnaire } from './BirthPlanQuestionnaire';
import { BirthPlanEditor } from './BirthPlanEditor';
import { BirthPlanPreview } from './BirthPlanPreview';
import { BirthPlanShare } from './BirthPlanShare';
import { PaymentGate } from './PaymentGate';
import { Footer } from '@/components/Footer';
import { toast } from '@/components/ui/use-toast';
import { useBirthPlanState } from './hooks/useBirthPlanState';

export function BirthPlanBuilder() {
  const [hasPaid, setHasPaid] = useState(false);
  const [isVerifyingPayment, setIsVerifyingPayment] = useState(true);
  
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
    
    // Get current URL parameters and user ID
    const urlParams = new URLSearchParams(window.location.search);
    const paymentStatus = urlParams.get('payment_status');
    const paymentId = urlParams.get('payment_id');
    const userId = localStorage.getItem('birthPlanUserId');
    
    // Enhanced verification
    const verifyPayment = async () => {
      try {
        // Check if payment was just completed (from URL parameters)
        if (paymentStatus === 'success' && paymentId) {
          // Store payment details with the unique payment ID
          localStorage.setItem('birthPlanPaid', 'true');
          localStorage.setItem('birthPlanPaymentId', paymentId);
          // Add timestamp to verify freshness of payment
          localStorage.setItem('birthPlanPaymentTimestamp', Date.now().toString());
          setHasPaid(true);
          
          toast({
            title: "Pagamento Confirmado",
            description: "Seu acesso ao plano de parto foi liberado com sucesso!"
          });
          
          // Optional: You can add a call to your Wix backend here to double-verify the payment
          // using the paymentId and userId
        } else {
          // Check previously stored payment information
          const paidStatus = localStorage.getItem('birthPlanPaid');
          const storedPaymentId = localStorage.getItem('birthPlanPaymentId');
          const paymentTimestamp = localStorage.getItem('birthPlanPaymentTimestamp');
          
          // Verify the payment is valid and not too old (if timestamp exists)
          const isPaymentValid = paidStatus === 'true' && storedPaymentId;
          const isPaymentFresh = !paymentTimestamp || 
                                (Date.now() - Number(paymentTimestamp)) < (90 * 24 * 60 * 60 * 1000); // 90 days
          
          if (isPaymentValid && isPaymentFresh) {
            setHasPaid(true);
          }
        }
        
        setIsVerifyingPayment(false);
      } catch (error) {
        console.error("Payment verification error:", error);
        setIsVerifyingPayment(false);
      }
    };
    
    verifyPayment();
    
    // Clean up URL parameters after processing (to prevent re-usage of the same payment link)
    if (paymentStatus || paymentId) {
      const cleanUrl = window.location.pathname;
      window.history.replaceState({}, document.title, cleanUrl);
    }
    
    // Force a re-render after a short delay to ensure component display
    const timer = setTimeout(() => {
      console.log("Forcing re-render check after timeout");
    }, 1000);
    
    return () => clearTimeout(timer);
  }, [currentStage]);

  // Show loading state while verifying payment
  if (isVerifyingPayment) {
    return (
      <div className="bg-maternal-50 min-h-screen flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-md text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-maternal-600 mx-auto mb-4"></div>
          <p className="text-maternal-700">Verificando seu acesso...</p>
        </div>
      </div>
    );
  }

  // Handle successful payment
  const handlePaymentComplete = () => {
    setHasPaid(true);
  };

  // If user hasn't paid, show payment gate
  if (!hasPaid) {
    return <PaymentGate onPaymentComplete={handlePaymentComplete} />;
  }

  return (
    <div className="bg-maternal-50 min-h-screen" role="main" aria-label="Construa seu Plano de Parto">
      <div className="pt-4 md:pt-8">
        <BirthPlanHeader currentStage={currentStage} onStageChange={goToStage} />
        
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

// Separate component to render the correct content based on the current stage
interface StageContentProps {
  currentStage: string;
  birthPlanContent: Record<string, any>;
  questionnaireAnswers: Record<string, any>;
  onQuestionnaireSubmit: (data: Record<string, any>) => void;
  onUpdateBirthPlan: (data: Record<string, any>) => void;
  onNextStage: () => void;
  onGoToStage: (stage: 'welcome' | 'questionnaire' | 'editor' | 'preview' | 'share') => void;
}

function StageContent({
  currentStage,
  birthPlanContent,
  questionnaireAnswers,
  onQuestionnaireSubmit,
  onUpdateBirthPlan,
  onNextStage,
  onGoToStage
}: StageContentProps) {
  switch (currentStage) {
    case 'welcome':
      return <BirthPlanWelcome onStart={onNextStage} />;
      
    case 'questionnaire':
      return <BirthPlanQuestionnaire onSubmit={onQuestionnaireSubmit} />;
      
    case 'editor':
      return (
        <BirthPlanEditor 
          birthPlan={birthPlanContent} 
          onUpdate={onUpdateBirthPlan} 
          onNext={onNextStage}
          onBack={() => onGoToStage('questionnaire')}
          questionnaireAnswers={questionnaireAnswers}
        />
      );
      
    case 'preview':
      return (
        <BirthPlanPreview 
          birthPlan={birthPlanContent} 
          onEdit={() => onGoToStage('editor')} 
          onNext={onNextStage} 
        />
      );
      
    case 'share':
      return (
        <BirthPlanShare 
          birthPlan={birthPlanContent} 
          onEdit={() => onGoToStage('editor')} 
        />
      );
      
    default:
      return <div>Stage not found</div>;
  }
}
