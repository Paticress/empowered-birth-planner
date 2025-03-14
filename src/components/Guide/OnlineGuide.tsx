
import { useState, useEffect } from 'react';
import { Tabs } from "@/components/ui/tabs";
import { GuideHeader } from './GuideHeader';
import { GuideTabs } from './GuideTabs';
import { GuideProgressBar } from './GuideProgressBar';
import { BackToTopButton } from './BackToTopButton';
import { GuideShare } from './Share/GuideShare';
import { MobileNavigation } from './MobileNavigation';
import { Footer } from '@/components/Footer';
import { Header } from '@/components/Header';
import { GuideContent } from './GuideContent';
import { GuideNavigation } from './GuideNavigation';
import { useGuideTabs, tabNames } from '@/hooks/use-guide-tabs';
import { useIsMobile } from '@/hooks/use-mobile';

export function OnlineGuide() {
  const [shareOpen, setShareOpen] = useState(false);
  const isMobile = useIsMobile();
  
  const { 
    activeTab, 
    progress, 
    handleTabChange, 
    handleNextSection,
    isFirstTab,
    isLastTab,
    previousTab,
    nextTab
  } = useGuideTabs();
  
  // Listen for navigation events from the Header component
  useEffect(() => {
    const handleNavigation = (event: CustomEvent<{ tab: string }>) => {
      handleTabChange(event.detail.tab as any);
    };

    const handleShare = () => {
      setShareOpen(true);
    };

    window.addEventListener('guide-navigate', handleNavigation as EventListener);
    window.addEventListener('guide-share', handleShare);

    return () => {
      window.removeEventListener('guide-navigate', handleNavigation as EventListener);
      window.removeEventListener('guide-share', handleShare);
    };
  }, []);

  return (
    <div className="bg-maternal-50 min-h-screen" role="main" aria-label="Guia do Plano de Parto">
      <Header />
      <GuideHeader />

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Mobile header with navigation actions */}
        <div className="flex justify-start items-center mb-4 md:hidden print:hidden">
          <MobileNavigation 
            activeTab={activeTab} 
            onTabChange={handleTabChange} 
            tabNames={tabNames} 
          />
        </div>
        
        <GuideProgressBar progress={progress} />
        
        <div className="mb-8 animate-fade-in print:block">
          <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
            <div className="hidden md:flex justify-between items-center mb-4 print:hidden">
              <GuideTabs activeTab={activeTab} onChange={handleTabChange} />
            </div>
            
            <GuideNavigation 
              isFirstTab={isFirstTab}
              isLastTab={isLastTab}
              previousTab={previousTab}
              nextTab={nextTab}
              tabNames={tabNames}
              onNavigation={handleNextSection}
            />
            
            <GuideContent 
              activeTab={activeTab}
              onNavigate={handleNextSection}
            />
          </Tabs>
        </div>
      </main>
      
      <GuideShare open={shareOpen} onOpenChange={setShareOpen} currentTab={activeTab} />
      <BackToTopButton />
      <Footer />
    </div>
  );
}
