
import { useState } from 'react';
import { BuilderStage, BirthPlanData } from '../types/questionnaire';
import { generateEmptyBirthPlan, generateBirthPlanFromAnswers } from '../utils/birthPlanUtils';
import { toast } from '@/components/ui/use-toast';

export function useBirthPlanState() {
  // State for the current stage of the birth plan builder
  const [currentStage, setCurrentStage] = useState<BuilderStage>('welcome');
  // State to store questionnaire answers
  const [questionnaireAnswers, setQuestionnaireAnswers] = useState<Record<string, any>>({});
  // State to store the birth plan content
  const [birthPlanContent, setBirthPlanContent] = useState<BirthPlanData>(generateEmptyBirthPlan());

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
