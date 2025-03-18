
import { useState } from 'react';
import { BirthPlanHeader } from './BirthPlanHeader';
import { BirthPlanWelcome } from './BirthPlanWelcome';
import { BirthPlanQuestionnaire } from './BirthPlanQuestionnaire';
import { BirthPlanEditor } from './BirthPlanEditor';
import { BirthPlanPreview } from './BirthPlanPreview';
import { BirthPlanShare } from './BirthPlanShare';
import { Footer } from '@/components/Footer';
import { PaymentGate } from './PaymentGate';

// Define the stages of the birth plan creation process
type BuilderStage = 'welcome' | 'questionnaire' | 'editor' | 'preview' | 'share';

export function BirthPlanBuilder() {
  // State for the current stage of the birth plan builder
  const [currentStage, setCurrentStage] = useState<BuilderStage>('welcome');
  // State to track if the user has paid
  const [hasPaid, setHasPaid] = useState<boolean>(false);
  // State to store questionnaire answers
  const [questionnaireAnswers, setQuestionnaireAnswers] = useState<Record<string, any>>({});
  // State to store the birth plan content
  const [birthPlanContent, setBirthPlanContent] = useState<Record<string, any>>({});

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

  // Function to handle payment completion
  const handlePaymentComplete = () => {
    setHasPaid(true);
    setCurrentStage('welcome');
  };

  // Function to handle questionnaire submission
  const handleQuestionnaireSubmit = (answers: Record<string, any>) => {
    setQuestionnaireAnswers(answers);
    // Generate initial birth plan based on answers
    generateBirthPlan(answers);
    goToNextStage();
  };

  // Function to generate birth plan based on questionnaire answers
  const generateBirthPlan = (answers: Record<string, any>) => {
    // This is a placeholder - in a real implementation, this would contain logic
    // to generate different birth plan sections based on the answers
    const generatedPlan = {
      personalInfo: {
        name: answers.name || '',
        dueDate: answers.dueDate || '',
        healthProvider: answers.healthProvider || '',
      },
      preferences: {
        environment: answers.environmentPreferences || [],
        mobility: answers.mobilityPreferences || [],
        pain: answers.painManagement || [],
        interventions: answers.interventionsPreferences || [],
      },
      medicalConsiderations: {
        conditions: answers.medicalConditions || [],
        medications: answers.medications || [],
        allergies: answers.allergies || [],
      },
      postpartum: {
        newbornCare: answers.newbornCare || [],
        feeding: answers.feeding || [],
        recovery: answers.recovery || [],
      },
    };
    
    setBirthPlanContent(generatedPlan);
  };

  // If the user hasn't paid, show the payment gate
  if (!hasPaid) {
    return <PaymentGate onPaymentComplete={handlePaymentComplete} />;
  }

  return (
    <div className="bg-maternal-50 min-h-screen" role="main" aria-label="Construa seu Plano de Parto">
      <div className="pt-4 md:pt-8">
        <BirthPlanHeader currentStage={currentStage} onStageChange={goToStage} />
        
        <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="bg-white shadow-md rounded-lg p-6 md:p-8 mb-8">
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
