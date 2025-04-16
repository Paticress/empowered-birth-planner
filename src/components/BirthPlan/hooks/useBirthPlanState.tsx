
import { useState, useEffect } from 'react';
import { BuilderStage, BirthPlanData } from '../types/questionnaire';
import { generateEmptyBirthPlan, generateBirthPlanFromAnswers } from '../utils/birthPlanGenerationUtils';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';

export function useBirthPlanState() {
  const navigate = useNavigate();
  
  // State for the current stage of the birth plan builder
  const [currentStage, setCurrentStage] = useState<BuilderStage>('welcome');
  // State to store questionnaire answers
  const [questionnaireAnswers, setQuestionnaireAnswers] = useState<Record<string, any>>({});
  // State to store the birth plan content
  const [birthPlanContent, setBirthPlanContent] = useState<BirthPlanData>(generateEmptyBirthPlan());
  // State to track if birth plan has been loaded from storage
  const [isInitialized, setIsInitialized] = useState(false);

  // Effect to load saved birth plan data on component mount
  useEffect(() => {
    if (isInitialized) return;
    
    try {
      // Try to load saved content
      const savedBirthPlanData = localStorage.getItem('birthPlanData');
      const savedAnswers = localStorage.getItem('birthPlanAnswers');
      const savedStage = localStorage.getItem('birthPlanStage') as BuilderStage | null;
      
      console.log("Loading saved birth plan data:", !!savedBirthPlanData);
      console.log("Loading saved questionnaire answers:", !!savedAnswers);
      console.log("Loading saved stage:", savedStage);
      
      if (savedBirthPlanData) {
        const parsedData = JSON.parse(savedBirthPlanData);
        setBirthPlanContent(parsedData);
      }
      
      if (savedAnswers) {
        const parsedAnswers = JSON.parse(savedAnswers);
        setQuestionnaireAnswers(parsedAnswers);
      }
      
      // If we have both saved content and answers, restore the stage
      if (savedBirthPlanData && savedAnswers && savedStage) {
        setCurrentStage(savedStage);
      } else if (savedAnswers) {
        // If we have answers but no content, go to editor stage
        setCurrentStage('editor');
      }
      
      setIsInitialized(true);
    } catch (error) {
      console.error("Error loading saved birth plan data:", error);
      setIsInitialized(true);
    }
  }, [isInitialized]);

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
    
    // Save current stage to localStorage
    localStorage.setItem('birthPlanStage', currentStage === 'share' ? 'editor' : 
      (currentStage === 'welcome' ? 'questionnaire' : 
        (currentStage === 'questionnaire' ? 'editor' : 
          (currentStage === 'editor' ? 'preview' : 'share'))));
  };

  // Function to move to a specific stage
  const goToStage = (stage: BuilderStage) => {
    // Log before changing stage
    console.log(`Changing from stage ${currentStage} to ${stage}`);
    console.log("Birth plan content during stage change:", birthPlanContent);
    
    setCurrentStage(stage);
    
    // Save current stage to localStorage
    localStorage.setItem('birthPlanStage', stage);
  };

  // Function to handle questionnaire submission
  const handleQuestionnaireSubmit = (answers: Record<string, any>) => {
    console.log("Questionnaire submitted with answers:", answers);
    setQuestionnaireAnswers(answers);
    
    // Save answers to localStorage
    localStorage.setItem('birthPlanAnswers', JSON.stringify(answers));
    
    // Generate initial birth plan based on answers
    const generatedPlan = generateBirthPlanFromAnswers(answers);
    console.log("Generated birth plan:", generatedPlan);
    setBirthPlanContent(generatedPlan);
    
    // Save birth plan to localStorage
    localStorage.setItem('birthPlanData', JSON.stringify(generatedPlan));
    
    toast.success("Questionário concluído! Seu plano de parto inicial foi gerado com sucesso!");
    
    goToNextStage();
  };

  // Wrap setBirthPlanContent to automatically save to localStorage
  const updateBirthPlanContent = (updatedPlan: BirthPlanData) => {
    setBirthPlanContent(updatedPlan);
    
    // Save to localStorage
    localStorage.setItem('birthPlanData', JSON.stringify(updatedPlan));
  };

  return {
    currentStage,
    birthPlanContent,
    questionnaireAnswers,
    goToNextStage,
    goToStage,
    handleQuestionnaireSubmit,
    setBirthPlanContent: updateBirthPlanContent,
    isInitialized
  };
}
