
import { useEffect } from 'react';
import { BirthPlanHeader } from './BirthPlanHeader';
import { BirthPlanWelcome } from './BirthPlanWelcome';
import { BirthPlanQuestionnaire } from './BirthPlanQuestionnaire';
import { BirthPlanEditor } from './BirthPlanEditor';
import { BirthPlanPreview } from './BirthPlanPreview';
import { BirthPlanShare } from './BirthPlanShare';
import { Footer } from '@/components/Footer';
import { toast } from 'sonner';
import { useBirthPlanState } from './hooks/useBirthPlanState';
import { useNavigation } from '@/hooks/useNavigation';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';

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
  
  const { navigateTo } = useNavigation();
  const { isAuthenticated, user, isLoading } = useAuth();

  useEffect(() => {
    if (isLoading) {
      console.log("Still loading auth state, waiting...");
      return; // Don't do anything while still loading auth state
    }
    
    console.log("Auth check for BirthPlanBuilder:", { isAuthenticated, email: user?.email });
    
    if (!isAuthenticated) {
      console.log("User not authenticated, redirecting to login page");
      toast.error("Acesso Restrito", {
        description: "Por favor, faça login para acessar o construtor de plano de parto."
      });
      navigateTo('/acesso-plano');
      return;
    }
    
    const checkUserAccess = async () => {
      const userEmail = user?.email || localStorage.getItem('birthPlanEmail');
      
      if (!userEmail) {
        console.log("No user email found, redirecting to login page");
        navigateTo('/acesso-plano');
        return;
      }
      
      // Check if the user is in the authorized users table - using correct lowercase table name
      try {
        const { data, error } = await supabase
          .from('users_db_birthplanbuilder')
          .select('email')
          .eq('email', userEmail)
          .maybeSingle();
          
        if (error) {
          console.error("Error checking user access:", error);
          toast.error("Erro ao verificar acesso", {
            description: "Ocorreu um erro ao verificar seu acesso. Por favor, tente novamente."
          });
          navigateTo('/acesso-plano');
          return;
        }
        
        if (!data) {
          console.log("User not authorized, adding to database");
          
          // Try to add the user to the database since they're authenticated
          const { error: insertError } = await supabase
            .from('users_db_birthplanbuilder')
            .insert({ email: userEmail });
            
          if (insertError) {
            console.error("Error adding user to database:", insertError);
            toast.error("Acesso não autorizado", {
              description: "Você não tem acesso ao construtor de plano de parto."
            });
            navigateTo('/acesso-plano');
            return;
          } else {
            console.log("Added user to database:", userEmail);
            toast.success("Acesso concedido", {
              description: "Bem-vindo ao construtor de plano de parto."
            });
          }
        } else {
          console.log("User authorized:", userEmail);
          toast.success("Bem-vindo ao Plano de Parto", {
            description: "Você está pronto para criar seu plano de parto personalizado."
          });
        }
      } catch (error) {
        console.error("Unexpected error during access check:", error);
        toast.error("Erro inesperado", {
          description: "Ocorreu um erro ao verificar seu acesso. Por favor, tente novamente."
        });
        navigateTo('/acesso-plano');
      }
    };
    
    if (isAuthenticated) {
      checkUserAccess();
    }
    
    // Additional debugging to verify the route
    console.log("Current pathname:", window.location.pathname);
    
  }, [isAuthenticated, user, isLoading, navigateTo]);

  // Return loading indicator if still checking auth
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-maternal-50">
        <div className="text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-maternal-500 border-r-transparent"></div>
          <p className="mt-4 text-maternal-800">Carregando...</p>
        </div>
      </div>
    );
  }

  // Don't render the content if there's no authenticated user
  if (!isAuthenticated) return null;

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
