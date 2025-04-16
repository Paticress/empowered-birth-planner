
interface GuideSection {
  id: string;
  name: string;
}

interface BirthPlanStage {
  id: string;
  name: string;
}

interface TimelineStep {
  id: string;
  name: string;
  isCompleted: boolean;
  onClick: () => void;
}

interface UseTimelineStepsProps {
  guideSections: GuideSection[];
  birthPlanStages: BirthPlanStage[];
  currentGuideTab: string | null;
  hasStartedBirthPlan: boolean;
  hasBirthPlanAccess: boolean | null;
  birthPlanProgress: number;
}

import { useNavigation } from "./useNavigation";

export function useTimelineSteps({
  guideSections,
  birthPlanStages,
  currentGuideTab,
  hasStartedBirthPlan,
  hasBirthPlanAccess,
  birthPlanProgress
}: UseTimelineStepsProps) {
  const { navigateTo } = useNavigation();
  
  // Create guide timeline steps
  const guideTimelineSteps: TimelineStep[] = guideSections.map(section => {
    const currentIndex = currentGuideTab 
      ? guideSections.findIndex(s => s.id === currentGuideTab) 
      : -1;
    
    const sectionIndex = guideSections.findIndex(s => s.id === section.id);
    const isCompleted = currentIndex >= sectionIndex;
    
    return {
      id: section.id,
      name: section.name,
      isCompleted,
      onClick: () => navigateTo(`/guia-online?tab=${section.id}`)
    };
  });
  
  // Load saved birth plan stage from localStorage
  const getSavedBirthPlanStage = (): string | null => {
    return localStorage.getItem('birthPlanStage');
  };
  
  // Create birth plan timeline steps
  const birthPlanTimelineSteps: TimelineStep[] = birthPlanStages.map(stage => {
    // If no birth plan access, mark all as not completed
    if (!hasBirthPlanAccess) {
      return {
        id: stage.id,
        name: stage.name,
        isCompleted: false,
        onClick: () => window.open("https://www.energiamaterna.com.br/criar-meu-plano-de-parto-em-minutos", "_blank")
      };
    }
    
    // Get the saved stage
    const savedStage = getSavedBirthPlanStage();
    
    // If not started birth plan yet, mark all as not completed
    if (!hasStartedBirthPlan) {
      return {
        id: stage.id,
        name: stage.name,
        isCompleted: false,
        onClick: () => navigateTo("/criar-plano")
      };
    }
    
    // Determine completion based on progress
    // This is a simplified approach - we're assuming stages are completed sequentially
    const stageIndex = birthPlanStages.findIndex(s => s.id === stage.id);
    const totalStages = birthPlanStages.length;
    const progressPerStage = 100 / totalStages;
    const isCompleted = birthPlanProgress >= (stageIndex + 1) * progressPerStage;
    
    // Handle click based on the stage
    const handleStageClick = () => {
      if (savedStage) {
        // If there's a saved stage, navigate to the birth plan with stage parameter
        localStorage.setItem('birthPlanStage', stage.id);
      }
      
      // Navigate to the birth plan page
      navigateTo("/criar-plano");
    };
    
    return {
      id: stage.id,
      name: stage.name,
      isCompleted,
      onClick: handleStageClick
    };
  });
  
  return { guideTimelineSteps, birthPlanTimelineSteps };
}
