
import { useState } from 'react';
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
import { Footer } from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { ArrowLeft, ChevronRight } from 'lucide-react';

export function OnlineGuide() {
  const [activeTab, setActiveTab] = useState("introduction");
  const [progress, setProgress] = useState(0);
  
  const tabs = ["introduction", "structure", "rights", "communication", "checklist", "resources"];
  
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
    <div className="bg-maternal-50 min-h-screen">
      <GuideHeader />

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <GuideProgressBar progress={progress} />
        
        <div className="mb-8 animate-fade-in print:block">
          <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
            <GuideTabs activeTab={activeTab} onChange={handleTabChange} />
            
            <div className="flex justify-between items-center mb-4 print:hidden">
              {!isFirstTab ? (
                <Button 
                  variant="outline" 
                  className="flex items-center border-brand-tan text-brand-gold hover:bg-brand-beige/20" 
                  onClick={() => handleNextSection(tabs[currentIndex - 1])}
                >
                  <ArrowLeft className="mr-2 h-4 w-4" /> Seção Anterior
                </Button>
              ) : (
                <div></div>
              )}
              
              {!isLastTab ? (
                <Button 
                  className="bg-brand-gold hover:bg-brand-tan flex items-center ml-auto" 
                  onClick={() => handleNextSection(tabs[currentIndex + 1])}
                >
                  Próxima Seção <ChevronRight className="ml-2 h-4 w-4" />
                </Button>
              ) : (
                <div></div>
              )}
            </div>
            
            <div className="bg-white shadow-md rounded-lg p-6 md:p-8">
              <TabsContent value="introduction" className="mt-0">
                <GuideIntroduction onNext={() => handleNextSection("structure")} />
              </TabsContent>
              
              <TabsContent value="structure" className="mt-0">
                <GuideStructure 
                  onPrevious={() => handleNextSection("introduction")} 
                  onNext={() => handleNextSection("rights")} 
                />
              </TabsContent>
              
              <TabsContent value="rights" className="mt-0">
                <GuideRights 
                  onPrevious={() => handleNextSection("structure")} 
                  onNext={() => handleNextSection("communication")} 
                />
              </TabsContent>
              
              <TabsContent value="communication" className="mt-0">
                <GuideCommunication 
                  onPrevious={() => handleNextSection("rights")} 
                  onNext={() => handleNextSection("checklist")} 
                />
              </TabsContent>
              
              <TabsContent value="checklist" className="mt-0">
                <GuideChecklist
                  onPrevious={() => handleNextSection("communication")}
                  onNext={() => handleNextSection("resources")}
                />
              </TabsContent>
              
              <TabsContent value="resources" className="mt-0">
                <GuideResources
                  onPrevious={() => handleNextSection("checklist")}
                />
              </TabsContent>
            </div>
          </Tabs>
        </div>
      </main>
      
      <BackToTopButton />
      <Footer />
    </div>
  );
}
