
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
  
  const hasBirthPlanAccess = useBirthPlanAccess();
  
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
  
  return (
    <div className="bg-maternal-50">
      <div className="container max-w-5xl mx-auto px-4 py-8">
        <WelcomeSection 
          getWelcomeMessage={getWelcomeMessage}
          firstName={firstName}
        />
        
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
