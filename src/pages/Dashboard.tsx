
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { useAuth } from "@/contexts/AuthContext";
import { BookOpen, FileText, Award, ChevronRight } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { DashboardHeader } from "@/components/Dashboard/DashboardHeader";
import { RecommendedStepCard } from "@/components/Dashboard/RecommendedStepCard";
import { ProgressCard } from "@/components/Dashboard/ProgressCard";
import { GuideProgressCard } from "@/components/Dashboard/GuideProgressCard";
import { BirthPlanProgressCard } from "@/components/Dashboard/BirthPlanProgressCard";
import { ResourcesSection } from "@/components/Dashboard/ResourcesSection";
import { useDashboardData } from "@/components/Dashboard/useDashboardData";

export function Dashboard() {
  const { user, isLoading } = useAuth();
  const isMobile = useIsMobile();
  const {
    lastVisited,
    hasStartedBirthPlan,
    birthPlanProgress,
    guideProgress,
    currentGuideTab,
    guideSections,
    birthPlanStages,
    isGuideCompleted,
    isBirthPlanCompleted
  } = useDashboardData();
  
  const getWelcomeMessage = () => {
    const currentHour = new Date().getHours();
    
    if (currentHour < 12) {
      return "Bom dia";
    } else if (currentHour < 18) {
      return "Boa tarde";
    } else {
      return "Boa noite";
    }
  };
  
  const getRecommendedNextStep = () => {
    if (!currentGuideTab) {
      return {
        title: "Conheça o Guia do Parto Respeitoso",
        description: "Leia nosso guia completo com informações importantes sobre o parto.",
        path: "/guia-online",
        icon: BookOpen
      };
    } else if (guideProgress < 100) {
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
    } else if (!hasStartedBirthPlan) {
      return {
        title: "Crie seu Plano de Parto",
        description: "Comece a criar seu plano de parto personalizado com nosso construtor.",
        path: "/criar-plano",
        icon: FileText
      };
    } else {
      return {
        title: "Continue seu Plano de Parto",
        description: "Retome de onde parou na criação do seu plano de parto.",
        path: "/criar-plano",
        icon: ChevronRight
      };
    }
  };
  
  const recommendedStep = getRecommendedNextStep();
  
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow pt-20 bg-maternal-50">
        <div className="container max-w-5xl mx-auto px-4 py-8">
          <DashboardHeader greeting={getWelcomeMessage()} />
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
            <RecommendedStepCard 
              recommendedStep={recommendedStep}
              isGuideCompleted={isGuideCompleted}
              isBirthPlanCompleted={isBirthPlanCompleted}
            />
            
            <ProgressCard 
              guideProgress={guideProgress}
              birthPlanProgress={birthPlanProgress}
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
            <GuideProgressCard 
              sections={guideSections}
              currentTab={currentGuideTab}
              isCompleted={isGuideCompleted}
            />
            
            <BirthPlanProgressCard 
              stages={birthPlanStages}
              hasStartedBirthPlan={hasStartedBirthPlan}
              birthPlanProgress={birthPlanProgress}
              isCompleted={isBirthPlanCompleted}
            />
          </div>
          
          <ResourcesSection />
        </div>
      </main>
      <Footer />
    </div>
  );
}
