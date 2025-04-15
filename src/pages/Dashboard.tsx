import { useAuth } from "@/contexts/AuthContext";
import { BookOpen, FileText, Award, ChevronRight } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { RecommendedStepCard } from "@/components/Dashboard/RecommendedStepCard";
import { ProgressCard } from "@/components/Dashboard/ProgressCard";
import { GuideProgressCard } from "@/components/Dashboard/GuideProgressCard";
import { BirthPlanProgressCard } from "@/components/Dashboard/BirthPlanProgressCard";
import { ResourcesSection } from "@/components/Dashboard/ResourcesSection";
import { useDashboardData } from "@/components/Dashboard/useDashboardData";
import { TimelineProgress } from "@/components/Dashboard/TimelineProgress";
import { useNavigation } from "@/hooks/useNavigation";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

export function Dashboard() {
  const { user, isLoading } = useAuth();
  const isMobile = useIsMobile();
  const { navigateTo } = useNavigation();
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
  
  const [hasBirthPlanAccess, setHasBirthPlanAccess] = useState<boolean | null>(null);
  
  useEffect(() => {
    const checkAccessLevel = async () => {
      if (!user?.email) {
        setHasBirthPlanAccess(false);
        return;
      }
      
      const cachedPlan = localStorage.getItem('user_plan');
      if (cachedPlan === 'paid') {
        setHasBirthPlanAccess(true);
        return;
      } else if (cachedPlan === 'free') {
        setHasBirthPlanAccess(false);
        return;
      }
      
      try {
        const { data, error } = await supabase
          .from('users_db_birthplanbuilder')
          .select('plan')
          .eq('email', user.email)
          .maybeSingle();
          
        const isPaidUser = !error && !!data && data.plan === 'paid';
        setHasBirthPlanAccess(isPaidUser);
        
        localStorage.setItem('user_plan', isPaidUser ? 'paid' : 'free');
      } catch (error) {
        console.error("Error checking user access level:", error);
        setHasBirthPlanAccess(false);
      }
    };
    
    checkAccessLevel();
  }, [user]);
  
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
  };
  
  const recommendedStep = getRecommendedNextStep();
  
  const guideTimelineSteps = guideSections.map(section => ({
    id: section.id,
    name: section.name,
    isCompleted: currentGuideTab ? 
      guideSections.findIndex(s => s.id === section.id) <= 
      guideSections.findIndex(s => s.id === currentGuideTab) : 
      false,
    onClick: () => navigateTo(`/guia-online?tab=${section.id}`),
  }));
  
  const birthPlanTimelineSteps = birthPlanStages.map((stage, index) => ({
    id: stage.id,
    name: stage.name,
    isCompleted: hasStartedBirthPlan && hasBirthPlanAccess && 
      (birthPlanProgress > (index * (100 / birthPlanStages.length))),
    onClick: () => navigateTo(`/criar-plano?stage=${stage.id}`),
  }));
  
  return (
    <div className="flex-grow bg-maternal-50">
      <div className="container max-w-5xl mx-auto px-4 py-8">
        <DashboardHeader 
          greeting={getWelcomeMessage()} 
          guideProgress={guideProgress}
          birthPlanProgress={hasBirthPlanAccess ? birthPlanProgress : 0}
          lastVisited={lastVisited}
          isGuideCompleted={isGuideCompleted}
          isBirthPlanCompleted={hasBirthPlanAccess ? isBirthPlanCompleted : false}
        />
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
          <RecommendedStepCard 
            recommendedStep={recommendedStep}
            isGuideCompleted={isGuideCompleted}
            isBirthPlanCompleted={hasBirthPlanAccess ? isBirthPlanCompleted : false}
          />
          
          <ProgressCard 
            guideProgress={guideProgress}
            birthPlanProgress={hasBirthPlanAccess ? birthPlanProgress : 0}
            isFullAccessUser={hasBirthPlanAccess}
          />
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-10">
          <TimelineProgress
            title="Guia do Parto Respeitoso"
            steps={guideTimelineSteps}
            icon={<BookOpen className="h-5 w-5 mr-2 text-maternal-600" />}
          />
          
          <TimelineProgress
            title="Plano de Parto"
            steps={birthPlanTimelineSteps}
            icon={<FileText className="h-5 w-5 mr-2 text-maternal-600" />}
            isDisabled={!hasBirthPlanAccess}
            disabledMessage={!hasBirthPlanAccess ? "Adquira o Construtor de Plano de Parto para desbloquear" : undefined}
          />
        </div>
        
        <ResourcesSection />
      </div>
    </div>
  );
}
