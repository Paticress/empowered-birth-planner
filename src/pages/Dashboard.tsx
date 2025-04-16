
import { useAuth } from "@/contexts/AuthContext";
import { BookOpen, FileText } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { MainDashboardContent } from "@/components/Dashboard/MainDashboardContent";
import { useDashboardData } from "@/components/Dashboard/useDashboardData";
import { useWelcomeMessage } from "@/hooks/useWelcomeMessage";
import { useRecommendedStep } from "@/hooks/useRecommendedStep";
import { useTimelineSteps } from "@/hooks/useTimelineSteps";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { WelcomeSection } from "@/components/Dashboard/WelcomeSection";
import { useBirthPlanAccess } from "@/hooks/useBirthPlanAccess";
import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";
import { toast } from "sonner";

export function Dashboard() {
  const { user } = useAuth();
  const isMobile = useIsMobile();
  const { getWelcomeMessage, firstName } = useWelcomeMessage();
  
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
  
  const { hasBirthPlanAccess, refreshPlanStatus, isRefreshing } = useBirthPlanAccess();
  
  const recommendedStep = useRecommendedStep({
    currentGuideTab,
    hasBirthPlanAccess,
    guideProgress,
    hasStartedBirthPlan,
    isGuideCompleted,
    guideSections
  });
  
  const { guideTimelineSteps, birthPlanTimelineSteps } = useTimelineSteps({
    guideSections,
    birthPlanStages,
    currentGuideTab,
    hasStartedBirthPlan,
    hasBirthPlanAccess,
    birthPlanProgress
  });

  const handleRefreshAccess = () => {
    refreshPlanStatus().then(() => {
      const currentPlan = localStorage.getItem('user_plan');
      if (currentPlan === 'paid') {
        toast.success("Acesso ao plano premium atualizado!");
      } else {
        toast.info("Você ainda não tem acesso ao plano premium");
      }
    });
  };
  
  return (
    <div className="bg-maternal-50">
      <div className="container max-w-5xl mx-auto px-4 py-8">
        <WelcomeSection 
          getWelcomeMessage={getWelcomeMessage}
          firstName={firstName}
        />
        
        {!hasBirthPlanAccess && user && (
          <div className="mb-4 p-3 bg-maternal-100 rounded-lg text-maternal-800 text-sm flex items-center justify-between">
            <span>
              Comprou o plano premium recentemente? Atualize seu status.
            </span>
            <Button 
              size="sm" 
              variant="outline" 
              onClick={handleRefreshAccess}
              disabled={isRefreshing}
              className="flex items-center gap-1"
            >
              {isRefreshing ? (
                <RefreshCw className="h-3 w-3 animate-spin" />
              ) : (
                <RefreshCw className="h-3 w-3" />
              )}
              {isRefreshing ? "Verificando..." : "Verificar acesso"}
            </Button>
          </div>
        )}
        
        <MainDashboardContent
          recommendedStep={recommendedStep}
          isGuideCompleted={isGuideCompleted}
          isBirthPlanCompleted={hasBirthPlanAccess ? isBirthPlanCompleted : false}
          guideProgress={guideProgress}
          birthPlanProgress={birthPlanProgress}
          hasBirthPlanAccess={hasBirthPlanAccess}
          guideTimelineSteps={guideTimelineSteps}
          birthPlanTimelineSteps={birthPlanTimelineSteps}
        />
      </div>
    </div>
  );
}
