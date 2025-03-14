
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
import { GuideNavigation } from './GuideNavigation';
import { GuideProgressBar } from './GuideProgressBar';
import { Footer } from '@/components/Footer';

export function OnlineGuide() {
  const [activeTab, setActiveTab] = useState("introduction");
  const [progress, setProgress] = useState(0);
  
  const tabs = ["introduction", "structure", "rights", "communication", "checklist", "resources"];
  
  const handleNextSection = (next: string) => {
    setActiveTab(next);
    updateProgress(next);
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

  return (
    <div className="bg-maternal-50 min-h-screen">
      <GuideHeader />

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <GuideProgressBar progress={progress} />
        
        <div className="mb-8 animate-fade-in print:block">
          <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
            <GuideTabs activeTab={activeTab} onChange={handleTabChange} />
            
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
        
        <GuideNavigation 
          activeTab={activeTab} 
          onNavigate={(tab) => {
            setActiveTab(tab);
            updateProgress(tab);
            scrollToTop();
          }}
          tabs={tabs}
        />
      </main>
      
      <Footer />
    </div>
  );
}
