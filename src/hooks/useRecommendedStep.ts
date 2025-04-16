
import { LucideIcon } from "lucide-react";
import { BookOpen, FileText } from "lucide-react";
import { useNavigation } from "./useNavigation";

interface GuideSection {
  id: string;
  name: string;
}

interface UseRecommendedStepProps {
  currentGuideTab: string | null;
  hasBirthPlanAccess: boolean | null;
  guideProgress: number;
  hasStartedBirthPlan: boolean;
  isGuideCompleted: boolean;
  guideSections: GuideSection[];
}

export function useRecommendedStep({
  currentGuideTab,
  hasBirthPlanAccess,
  guideProgress,
  hasStartedBirthPlan,
  isGuideCompleted,
  guideSections
}: UseRecommendedStepProps) {
  const { navigateTo } = useNavigation();
  
  // If guide not started yet, recommend starting the guide
  if (!currentGuideTab && guideProgress === 0) {
    return {
      title: "Comece Lendo o Guia",
      description: "Aprenda sobre o parto respeitoso e como criar um plano de parto eficaz.",
      path: "/guia-online",
      onClick: () => navigateTo("/guia-online"),
      icon: BookOpen
    };
  }
  
  // If guide started but not completed, recommend continuing
  if (currentGuideTab && !isGuideCompleted) {
    const currentSectionIndex = guideSections.findIndex(s => s.id === currentGuideTab);
    const sectionName = guideSections[currentSectionIndex]?.name || "atual";
    
    return {
      title: "Continue o Guia",
      description: `Continue sua leitura na seção '${sectionName}'.`,
      path: `/guia-online?tab=${currentGuideTab}`,
      onClick: () => navigateTo(`/guia-online?tab=${currentGuideTab}`),
      icon: BookOpen
    };
  }
  
  // If guide completed and has birth plan access but not started, recommend starting birth plan
  if (isGuideCompleted && hasBirthPlanAccess && !hasStartedBirthPlan) {
    return {
      title: "Crie seu Plano de Parto",
      description: "Agora que você concluiu a leitura do guia, crie seu plano de parto personalizado.",
      path: "/criar-plano",
      onClick: () => navigateTo("/criar-plano"),
      icon: FileText
    };
  }
  
  // If birth plan started but not completed, recommend continuing
  if (hasBirthPlanAccess && hasStartedBirthPlan) {
    return {
      title: "Continue seu Plano de Parto",
      description: "Continue a criação do seu plano de parto personalizado.",
      path: "/criar-plano",
      onClick: () => navigateTo("/criar-plano"),
      icon: FileText
    };
  }
  
  // Default (fallback): guide completed but no birth plan access
  return {
    title: "Adquira Acesso ao Construtor",
    description: "Complete sua jornada adquirindo acesso ao construtor de plano de parto.",
    path: "https://www.energiamaterna.com.br/criar-meu-plano-de-parto-em-minutos",
    onClick: () => window.open("https://www.energiamaterna.com.br/criar-meu-plano-de-parto-em-minutos", "_blank"),
    icon: FileText
  };
}
