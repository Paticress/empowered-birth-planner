
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
    
    // Check URL parameters for payment confirmation from Wix
    const urlParams = new URLSearchParams(window.location.search);
    const paymentStatus = urlParams.get('payment_status');
    
    if (paymentStatus === 'success') {
      // Payment was just completed via Wix
      localStorage.setItem('birthPlanPaid', 'true');
      setHasPaid(true);
      toast({
        title: "Pagamento Confirmado",
        description: "Seu acesso ao plano de parto foi liberado com sucesso!"
      });
    } else {
      // Check if user has previously completed payment
      const paidStatus = localStorage.getItem('birthPlanPaid');
      if (paidStatus === 'true') {
        setHasPaid(true);
      }
    }
    
    // Additional debugging to verify the route
    console.log("Current pathname:", window.location.pathname);
    console.log("Current search params:", window.location.search);
    
    // Force a re-render after a short delay to ensure component display
    const timer = setTimeout(() => {
      console.log("Forcing re-render check after timeout");
    }, 1000);
    
    return () => clearTimeout(timer);
  }, [currentStage]);

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
