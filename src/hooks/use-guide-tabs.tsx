
import { useState, useEffect } from 'react';

export type GuideTab = 
  | "introduction" 
  | "structure" 
  | "rights" 
  | "communication" 
  | "checklist" 
  | "resources";

export const tabs: GuideTab[] = [
  "introduction", 
  "structure", 
  "rights", 
  "communication", 
  "checklist", 
  "resources"
];

export const tabNames: Record<GuideTab, string> = {
  introduction: "Introdução",
  structure: "Estrutura",
  rights: "Direitos",
  communication: "Comunicação",
  checklist: "Checklist",
  resources: "Recursos"
};

interface UseGuideTabsProps {
  onTabChange?: (tab: GuideTab) => void;
}

export function useGuideTabs({ onTabChange }: UseGuideTabsProps = {}) {
  const [activeTab, setActiveTab] = useState<GuideTab>("introduction");
  const [progress, setProgress] = useState(0);
  
  // Load saved progress on initial render
  useEffect(() => {
    const savedTab = localStorage.getItem('guide-current-tab') as GuideTab | null;
    if (savedTab && tabs.includes(savedTab)) {
      setActiveTab(savedTab);
      updateProgress(savedTab);
    }
  }, []);
  
  // Save current tab to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('guide-current-tab', activeTab);
    if (onTabChange) {
      onTabChange(activeTab);
    }
  }, [activeTab, onTabChange]);

  const handleTabChange = (value: GuideTab) => {
    setActiveTab(value);
    updateProgress(value);
    scrollToTop();
  };

  const handleNextSection = (next: GuideTab) => {
    setActiveTab(next);
    updateProgress(next);
    scrollToTop();
  };

  const updateProgress = (tab: GuideTab) => {
    const currentIndex = tabs.indexOf(tab);
    const progressPercentage = ((currentIndex + 1) / tabs.length) * 100;
    setProgress(progressPercentage);
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const currentIndex = tabs.indexOf(activeTab);
  const isFirstTab = currentIndex === 0;
  const isLastTab = currentIndex === tabs.length - 1;
  const previousTab = !isFirstTab ? tabs[currentIndex - 1] : null;
  const nextTab = !isLastTab ? tabs[currentIndex + 1] : null;

  return {
    activeTab,
    progress,
    handleTabChange,
    handleNextSection,
    currentIndex,
    isFirstTab,
    isLastTab,
    previousTab,
    nextTab
  };
}
