
import { useState } from 'react';
import { BuilderStage, BirthPlanData } from '../types/questionnaire';
import { generateEmptyBirthPlan, generateBirthPlanFromAnswers } from '../utils/birthPlanGenerationUtils';
import { toast } from '@/components/ui/use-toast';
import { useNavigate } from 'react-router-dom';

export function useBirthPlanState() {
  const navigate = useNavigate();
  
  // State for the current stage of the birth plan builder
  const [currentStage, setCurrentStage] = useState<BuilderStage>('welcome');
  // State to store questionnaire answers
  const [questionnaireAnswers, setQuestionnaireAnswers] = useState<Record<string, any>>({});
  // State to store the birth plan content
  const [birthPlanContent, setBirthPlanContent] = useState<BirthPlanData>(generateEmptyBirthPlan());

  // Function to move to the next stage
  const goToNextStage = () => {
    // Log current state before transitioning
    console.log("Current stage before transition:", currentStage);
    console.log("Birth plan content before transition:", birthPlanContent);
    
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
      case 'share':
        // Navigate to success page when completed
        navigate('/plano-concluido');
        break;
      default:
        break;
    }
  };

  // Function to move to a specific stage
  const goToStage = (stage: BuilderStage) => {
    // Log before changing stage
    console.log(`Changing from stage ${currentStage} to ${stage}`);
    console.log("Birth plan content during stage change:", birthPlanContent);
    
    setCurrentStage(stage);
  };

  // Function to handle questionnaire submission
  const handleQuestionnaireSubmit = (answers: Record<string, any>) => {
    console.log("Questionnaire submitted with answers:", answers);
    setQuestionnaireAnswers(answers);
    
    // Generate initial birth plan based on answers
    const generatedPlan = generateBirthPlanFromAnswers(answers);
    console.log("Generated birth plan:", generatedPlan);
    setBirthPlanContent(generatedPlan);
    
    toast({
      title: "Questionário concluído",
      description: "Seu plano de parto inicial foi gerado com sucesso!"
    });
    
    goToNextStage();
  };

  return {
    currentStage,
    birthPlanContent,
    questionnaireAnswers,
    goToNextStage,
    goToStage,
    handleQuestionnaireSubmit,
    setBirthPlanContent
  };
}
