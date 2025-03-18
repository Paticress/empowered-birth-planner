
import { useState, useEffect } from 'react';
import { BirthPlanHeader } from './BirthPlanHeader';
import { BirthPlanWelcome } from './BirthPlanWelcome';
import { BirthPlanQuestionnaire } from './BirthPlanQuestionnaire';
import { BirthPlanEditor } from './BirthPlanEditor';
import { BirthPlanPreview } from './BirthPlanPreview';
import { BirthPlanShare } from './BirthPlanShare';
import { Footer } from '@/components/Footer';
import { generateBirthPlanFromAnswers, generateEmptyBirthPlan } from './utils/birthPlanUtils';
import { toast } from '@/components/ui/use-toast';

// Define the stages of the birth plan creation process
type BuilderStage = 'welcome' | 'questionnaire' | 'editor' | 'preview' | 'share';

export function BirthPlanBuilder() {
  console.log("RENDERING BIRTH PLAN BUILDER COMPONENT - THIS SHOULD BE VISIBLE");
  
  // State for the current stage of the birth plan builder
  const [currentStage, setCurrentStage] = useState<BuilderStage>('welcome');
  // State to store questionnaire answers
  const [questionnaireAnswers, setQuestionnaireAnswers] = useState<Record<string, any>>({});
  // State to store the birth plan content
  const [birthPlanContent, setBirthPlanContent] = useState<Record<string, any>>(generateEmptyBirthPlan());

  useEffect(() => {
    // Log when the component mounts to verify it's being rendered
    console.log("BirthPlanBuilder mounted, current stage:", currentStage);
    
    // Show a toast to confirm the user is on the birth plan page
    toast({
      title: "Plano de Parto",
      description: "Você está na página de criação do plano de parto"
    });
    
    // Additional debugging to verify the route
    console.log("Current pathname:", window.location.pathname);
    
    // Force a re-render after a short delay to ensure component display
    const timer = setTimeout(() => {
      console.log("Forcing re-render check after timeout");
      setCurrentStage(prev => prev);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, []);

  // Function to move to the next stage
  const goToNextStage = () => {
    switch (currentStage) {
      case 'welcome':
        setCurrentStage('questionnaire');
        break;
      case 'questionnaire':
        setCurrentStage('editor');
        break;
      case 'editor':
        setCurrentStage('preview');
        break;
      case 'preview':
        setCurrentStage('share');
        break;
      default:
        break;
    }
  };

  // Function to move to a specific stage
  const goToStage = (stage: BuilderStage) => {
    setCurrentStage(stage);
  };

  // Function to handle questionnaire submission
  const handleQuestionnaireSubmit = (answers: Record<string, any>) => {
    setQuestionnaireAnswers(answers);
    // Generate initial birth plan based on answers
    const generatedPlan = generateBirthPlanFromAnswers(answers);
    setBirthPlanContent(generatedPlan);
    goToNextStage();
  };

  return (
    <div className="bg-purple-50 min-h-screen" role="main" aria-label="Construa seu Plano de Parto">
      <div className="pt-4 md:pt-8">
        <BirthPlanHeader currentStage={currentStage} onStageChange={goToStage} />
        
        <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Ultra-clear visual indicator to show this is the Birth Plan page */}
          <div className="mb-6 p-6 bg-purple-300 border-l-8 border-purple-600 rounded-md shadow-lg">
            <h1 className="text-4xl font-bold text-purple-900 mb-2">
              Construtor de Plano de Parto
            </h1>
            <p className="text-purple-800 text-xl">
              Você está no construtor de plano de parto - crie e personalize seu plano aqui
            </p>
            <p className="mt-2 text-purple-700 font-medium">
              Current route: /criar-plano
            </p>
          </div>
          
          <div className="bg-white shadow-xl rounded-lg p-6 md:p-8 mb-8 border-t-4 border-purple-500">
            {currentStage === 'welcome' && (
              <BirthPlanWelcome onStart={goToNextStage} />
            )}
            
            {currentStage === 'questionnaire' && (
              <BirthPlanQuestionnaire 
                onSubmit={handleQuestionnaireSubmit} 
              />
            )}
            
            {currentStage === 'editor' && (
              <BirthPlanEditor 
                birthPlan={birthPlanContent} 
                onUpdate={setBirthPlanContent} 
                onNext={goToNextStage} 
              />
            )}
            
            {currentStage === 'preview' && (
              <BirthPlanPreview 
                birthPlan={birthPlanContent} 
                onEdit={() => goToStage('editor')} 
                onNext={goToNextStage} 
              />
            )}
            
            {currentStage === 'share' && (
              <BirthPlanShare 
                birthPlan={birthPlanContent} 
                onEdit={() => goToStage('editor')} 
              />
            )}
          </div>
        </main>
        
        <Footer />
      </div>
    </div>
  );
}
