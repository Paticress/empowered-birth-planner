
import { useAuth } from "@/contexts/AuthContext";
import { BookOpen, FileText } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { DashboardHeader } from "@/components/Dashboard/DashboardHeader";
import { WelcomeSection } from "@/components/Dashboard/WelcomeSection";
import { MainDashboardContent } from "@/components/Dashboard/MainDashboardContent";
import { useDashboardData } from "@/components/Dashboard/useDashboardData";
import { useWelcomeMessage } from "@/hooks/useWelcomeMessage";
import { useRecommendedStep } from "@/hooks/useRecommendedStep";
import { useTimelineSteps } from "@/hooks/useTimelineSteps";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

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
        <DashboardHeader 
          greeting={getWelcomeMessage()} 
          guideProgress={guideProgress}
          birthPlanProgress={hasBirthPlanAccess ? birthPlanProgress : 0}
          lastVisited={lastVisited}
          isGuideCompleted={isGuideCompleted}
          isBirthPlanCompleted={hasBirthPlanAccess ? isBirthPlanCompleted : false}
        />
        
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
