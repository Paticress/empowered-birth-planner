
import { BookOpen, FileText, ChevronRight } from "lucide-react";
import { LucideIcon } from "lucide-react";

interface RecommendedStep {
  title: string;
  description: string;
  path: string;
  icon: LucideIcon;
}

interface UseRecommendedStepParams {
  currentGuideTab: string | null;
  hasBirthPlanAccess: boolean | null;
  guideProgress: number;
  hasStartedBirthPlan: boolean;
  isGuideCompleted: boolean;
  guideSections: { id: string; name: string }[];
}

export function useRecommendedStep({
  currentGuideTab,
  hasBirthPlanAccess,
  guideProgress,
  hasStartedBirthPlan,
  isGuideCompleted,
  guideSections
}: UseRecommendedStepParams): RecommendedStep {
  if (!currentGuideTab && !hasBirthPlanAccess) {
    return {
      title: "Conheça o Guia do Parto Respeitoso",
      description: "Leia nosso guia completo com informações importantes sobre o parto.",
      path: "/guia-online",
      icon: BookOpen
    };
  } else if (guideProgress < 100 && !hasBirthPlanAccess) {
    const currentIndex = guideSections.findIndex(section => section.id === currentGuideTab);
    const nextSectionName = currentIndex < guideSections.length - 1 
      ? guideSections[currentIndex + 1].name 
      : "restantes";
    
    return {
      title: `Continue a leitura do Guia`,
      description: `Continue de onde parou na seção "${nextSectionName}".`,
      path: "/guia-online",
      icon: BookOpen
    };
  } else if (isGuideCompleted && !hasBirthPlanAccess) {
    return {
      title: "Crie seu Plano de Parto",
      description: "Agora que você conhece o guia, crie seu plano de parto personalizado.",
      path: "/criar-plano",
      icon: FileText
    };
  } else if (!hasStartedBirthPlan && hasBirthPlanAccess) {
    return {
      title: "Crie seu Plano de Parto",
      description: "Comece a criar seu plano de parto personalizado com nosso construtor.",
      path: "/criar-plano",
      icon: FileText
    };
  } else if (hasBirthPlanAccess) {
    return {
      title: "Continue seu Plano de Parto",
      description: "Retome de onde parou na criação do seu plano de parto.",
      path: "/criar-plano",
      icon: ChevronRight
    };
  } else {
    return {
      title: "Explore o Guia Online",
      description: "Conheça nosso guia completo com informações importantes sobre o parto.",
      path: "/guia-online",
      icon: BookOpen
    };
  }
}
