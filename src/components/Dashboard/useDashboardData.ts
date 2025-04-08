
import { useState, useEffect } from "react";

type GuideSection = {
  id: string;
  name: string;
};

type BirthPlanStage = {
  id: string;
  name: string;
};

type RecommendedStep = {
  title: string;
  description: string;
  path: string;
  icon: any;
};

export function useDashboardData() {
  const [lastVisited, setLastVisited] = useState<string | null>(null);
  const [hasStartedBirthPlan, setHasStartedBirthPlan] = useState(false);
  const [birthPlanProgress, setBirthPlanProgress] = useState(0);
  const [guideProgress, setGuideProgress] = useState(0);
  const [currentGuideTab, setCurrentGuideTab] = useState<string | null>(null);
  
  // Guide sections in order
  const guideSections: GuideSection[] = [
    { id: "introduction", name: "Introdução" },
    { id: "structure", name: "Estrutura" },
    { id: "rights", name: "Direitos" },
    { id: "communication", name: "Comunicação" },
    { id: "checklist", name: "Checklist" },
    { id: "resources", name: "Recursos" }
  ];
  
  // Birth plan stages in order
  const birthPlanStages: BirthPlanStage[] = [
    { id: "welcome", name: "Início" },
    { id: "questionnaire", name: "Questionário" },
    { id: "editor", name: "Editor" },
    { id: "preview", name: "Visualização" },
    { id: "share", name: "Compartilhamento" }
  ];
  
  // Calculate completion states
  const isGuideCompleted = guideProgress >= 100;
  const isBirthPlanCompleted = birthPlanProgress >= 100;
  
  useEffect(() => {
    // Check local storage for last visited page
    const lastPage = localStorage.getItem('last-visited-page');
    setLastVisited(lastPage);
    
    // Check if user has started birth plan and its progress
    const birthPlanData = localStorage.getItem('birthPlanData');
    setHasStartedBirthPlan(!!birthPlanData);
    
    if (birthPlanData) {
      try {
        const data = JSON.parse(birthPlanData);
        // Count filled sections to determine progress
        let filledSections = 0;
        let totalSections = 0;
        
        Object.keys(data).forEach(section => {
          if (typeof data[section] === 'object' && data[section] !== null) {
            const sectionFields = Object.keys(data[section]).length;
            if (sectionFields > 0) filledSections++;
            totalSections++;
          }
        });
        
        const progress = totalSections > 0 ? (filledSections / totalSections) * 100 : 0;
        setBirthPlanProgress(progress);
      } catch (e) {
        console.error("Error parsing birth plan data:", e);
        setBirthPlanProgress(0);
      }
    }
    
    // Check guide progress
    const guideTab = localStorage.getItem('guide-current-tab');
    setCurrentGuideTab(guideTab);
    
    if (guideTab) {
      const tabIndex = guideSections.findIndex(section => section.id === guideTab);
      if (tabIndex !== -1) {
        const progress = ((tabIndex + 1) / guideSections.length) * 100;
        setGuideProgress(progress);
      }
    }
    
    // Store current page as last visited
    localStorage.setItem('last-visited-page', '/dashboard');
  }, []);

  return {
    lastVisited,
    hasStartedBirthPlan,
    birthPlanProgress,
    guideProgress,
    currentGuideTab,
    guideSections,
    birthPlanStages,
    isGuideCompleted,
    isBirthPlanCompleted
  };
}
