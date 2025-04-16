
import { useNavigation } from "@/hooks/useNavigation";

interface TimelineStep {
  id: string;
  name: string;
  isCompleted: boolean;
  onClick: () => void;
}

export function useTimelineSteps({
  guideSections,
  birthPlanStages,
  currentGuideTab,
  hasStartedBirthPlan,
  hasBirthPlanAccess,
  birthPlanProgress
}: {
  guideSections: Array<{ id: string; name: string }>;
  birthPlanStages: Array<{ id: string; name: string }>;
  currentGuideTab: string | null;
  hasStartedBirthPlan: boolean;
  hasBirthPlanAccess: boolean | null;
  birthPlanProgress: number;
}) {
  const { navigateTo } = useNavigation();
  
  const guideTimelineSteps: TimelineStep[] = guideSections.map(section => ({
    id: section.id,
    name: section.name,
    isCompleted: currentGuideTab ? 
      guideSections.findIndex(s => s.id === section.id) <= 
      guideSections.findIndex(s => s.id === currentGuideTab) : 
      false,
    onClick: () => navigateTo(`/guia-online?tab=${section.id}`),
  }));
  
  const birthPlanTimelineSteps: TimelineStep[] = birthPlanStages.map((stage, index) => ({
    id: stage.id,
    name: stage.name,
    isCompleted: hasStartedBirthPlan && hasBirthPlanAccess && 
      (birthPlanProgress > (index * (100 / birthPlanStages.length))),
    onClick: () => navigateTo(`/criar-plano?stage=${stage.id}`),
  }));
  
  return { guideTimelineSteps, birthPlanTimelineSteps };
}
