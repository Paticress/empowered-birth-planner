
import React from 'react';
import { BookOpen, FileText } from "lucide-react";
import { LucideIcon } from "lucide-react";
import { RecommendedStepCard } from "./RecommendedStepCard";
import { ProgressCard } from "./ProgressCard";
import { TimelineProgress } from "./TimelineProgress";
import { ResourcesSection } from "./ResourcesSection";

interface TimelineStep {
  id: string;
  name: string;
  isCompleted: boolean;
  onClick: () => void;
}

interface MainDashboardContentProps {
  recommendedStep: {
    title: string;
    description: string;
    path: string;
    icon: LucideIcon;
  };
  isGuideCompleted: boolean;
  isBirthPlanCompleted: boolean;
  guideProgress: number;
  birthPlanProgress: number;
  hasBirthPlanAccess: boolean | null;
  guideTimelineSteps: TimelineStep[];
  birthPlanTimelineSteps: TimelineStep[];
}

export function MainDashboardContent({
  recommendedStep,
  isGuideCompleted,
  isBirthPlanCompleted,
  guideProgress,
  birthPlanProgress,
  hasBirthPlanAccess,
  guideTimelineSteps,
  birthPlanTimelineSteps
}: MainDashboardContentProps) {
  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
        <RecommendedStepCard 
          recommendedStep={recommendedStep}
          isGuideCompleted={isGuideCompleted}
          isBirthPlanCompleted={isBirthPlanCompleted}
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
    </>
  );
}
