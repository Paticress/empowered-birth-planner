
import { useState, useEffect } from 'react';
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { GuideIntroduction } from './GuideIntroduction';
import { GuideStructure } from './GuideStructure';
import { GuideRights } from './GuideRights';
import { GuideCommunication } from './GuideCommunication';
import { GuideChecklist } from './GuideChecklist';
import { GuideResources } from './GuideResources';
import { GuideHeader } from './GuideHeader';
import { GuideTabs } from './GuideTabs';
import { GuideProgressBar } from './GuideProgressBar';
import { BackToTopButton } from './BackToTopButton';
import { MobileNavigation } from './MobileNavigation';
import { Button } from '@/components/ui/button';
import { ArrowLeft, ChevronRight } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';
import { useLocation } from 'react-router-dom';

export function OnlineGuide() {
  const [activeTab, setActiveTab] = useState("introduction");
  const [progress, setProgress] = useState(0);
  const isMobile = useIsMobile();
  const location = useLocation();
  
  const tabs = ["introduction", "structure", "rights", "communication", "checklist", "resources"];
  const tabNames: Record<string, string> = {
    introduction: "Introdução",
    structure: "Estrutura",
    rights: "Direitos",
    communication: "Comunicação",
    checklist: "Checklist",
    resources: "Recursos"
  };
  
  useEffect(() => {
    // Primeiro, verifique se há um parâmetro tab na URL
    const searchParams = new URLSearchParams(location.search);
    const tabParam = searchParams.get('tab');
    
    if (tabParam && tabs.includes(tabParam)) {
      setActiveTab(tabParam);
      updateProgress(tabParam);
      return;
    }
    
    // Se não houver parâmetro na URL, use o valor salvo no localStorage
    const savedTab = localStorage.getItem('guide-current-tab');
    if (savedTab && tabs.includes(savedTab)) {
      setActiveTab(savedTab);
      updateProgress(savedTab);
    }
  }, [location.search]);
  
  useEffect(() => {
    localStorage.setItem('guide-current-tab', activeTab);
  }, [activeTab]);

  const handleNextSection = (next: string) => {
    setActiveTab(next);
    updateProgress(next);
    scrollToTop();
  };

  const updateProgress = (tab: string) => {
    const currentIndex = tabs.indexOf(tab);
    const progressPercentage = ((currentIndex + 1) / tabs.length) * 100;
    setProgress(progressPercentage);
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  
  const handleTabChange = (value: string) => {
    setActiveTab(value);
    updateProgress(value);
    scrollToTop();
  };

  const currentIndex = tabs.indexOf(activeTab);
  const isFirstTab = currentIndex === 0;
  const isLastTab = currentIndex === tabs.length - 1;

  return (
    <div className="bg-maternal-50 min-h-screen" role="main" aria-label="Guia do Plano de Parto">
      <div className="pt-4 md:pt-8">
        <GuideHeader 
          onNavigate={handleTabChange} 
          currentTab={activeTab} 
        />

        <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex justify-between items-center mb-4 md:hidden print:hidden">
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
              
              <div className="flex justify-between items-center mb-4 print:hidden">
                {!isFirstTab ? (
                  <Button 
                    variant="navigation" 
                    className="flex items-center" 
                    onClick={() => handleNextSection(tabs[currentIndex - 1])}
                    aria-label={`Ir para seção anterior: ${tabNames[tabs[currentIndex - 1]]}`}
                  >
                    <ArrowLeft className="mr-2 h-4 w-4" /> Seção Anterior
                  </Button>
                ) : (
                  <div></div>
                )}
                
                {!isLastTab ? (
                  <Button 
                    className="flex items-center ml-auto" 
                    variant="navigation"
                    onClick={() => handleNextSection(tabs[currentIndex + 1])}
                    aria-label={`Ir para próxima seção: ${tabNames[tabs[currentIndex + 1]]}`}
                  >
                    Próxima Seção <ChevronRight className="ml-2 h-4 w-4" />
                  </Button>
                ) : (
                  <div></div>
                )}
              </div>
              
              <div className="bg-white shadow-md rounded-lg p-6 md:p-8">
                <TabsContent value="introduction" className="mt-0" role="tabpanel" aria-labelledby="tab-introduction">
                  <GuideIntroduction onNext={() => handleNextSection("structure")} />
                </TabsContent>
                
                <TabsContent value="structure" className="mt-0" role="tabpanel" aria-labelledby="tab-structure">
                  <GuideStructure 
                    onPrevious={() => handleNextSection("introduction")} 
                    onNext={() => handleNextSection("rights")} 
                  />
                </TabsContent>
                
                <TabsContent value="rights" className="mt-0" role="tabpanel" aria-labelledby="tab-rights">
                  <GuideRights 
                    onPrevious={() => handleNextSection("structure")} 
                    onNext={() => handleNextSection("communication")} 
                  />
                </TabsContent>
                
                <TabsContent value="communication" className="mt-0" role="tabpanel" aria-labelledby="tab-communication">
                  <GuideCommunication 
                    onPrevious={() => handleNextSection("rights")} 
                    onNext={() => handleNextSection("checklist")} 
                  />
                </TabsContent>
                
                <TabsContent value="checklist" className="mt-0" role="tabpanel" aria-labelledby="tab-checklist">
                  <GuideChecklist
                    onPrevious={() => handleNextSection("communication")}
                    onNext={() => handleNextSection("resources")}
                  />
                </TabsContent>
                
                <TabsContent value="resources" className="mt-0" role="tabpanel" aria-labelledby="tab-resources">
                  <GuideResources
                    onPrevious={() => handleNextSection("checklist")}
                  />
                </TabsContent>
              </div>
            </Tabs>
          </div>
        </main>
        
        <BackToTopButton />
        {/* Removemos o Footer daqui pois ele já está sendo incluído na página GuiaOnline */}
      </div>
    </div>
  );
}
