
import { TabsContent } from "@/components/ui/tabs";
import { GuideIntroduction } from './GuideIntroduction';
import { GuideStructure } from './GuideStructure';
import { GuideRights } from './GuideRights';
import { GuideCommunication } from './GuideCommunication';
import { GuideChecklist } from './GuideChecklist';
import { GuideResources } from './GuideResources';
import { GuideTab } from '@/hooks/use-guide-tabs';

interface GuideContentProps {
  activeTab: GuideTab;
  onNavigate: (tab: GuideTab) => void;
}

export function GuideContent({ activeTab, onNavigate }: GuideContentProps) {
  return (
    <div className="bg-white shadow-md rounded-lg p-6 md:p-8">
      <TabsContent value="introduction" className="mt-0" role="tabpanel" aria-labelledby="tab-introduction">
        <GuideIntroduction onNext={() => onNavigate("structure")} />
      </TabsContent>
      
      <TabsContent value="structure" className="mt-0" role="tabpanel" aria-labelledby="tab-structure">
        <GuideStructure 
          onPrevious={() => onNavigate("introduction")} 
          onNext={() => onNavigate("rights")} 
        />
      </TabsContent>
      
      <TabsContent value="rights" className="mt-0" role="tabpanel" aria-labelledby="tab-rights">
        <GuideRights 
          onPrevious={() => onNavigate("structure")} 
          onNext={() => onNavigate("communication")} 
        />
      </TabsContent>
      
      <TabsContent value="communication" className="mt-0" role="tabpanel" aria-labelledby="tab-communication">
        <GuideCommunication 
          onPrevious={() => onNavigate("rights")} 
          onNext={() => onNavigate("checklist")} 
        />
      </TabsContent>
      
      <TabsContent value="checklist" className="mt-0" role="tabpanel" aria-labelledby="tab-checklist">
        <GuideChecklist
          onPrevious={() => onNavigate("communication")}
          onNext={() => onNavigate("resources")}
        />
      </TabsContent>
      
      <TabsContent value="resources" className="mt-0" role="tabpanel" aria-labelledby="tab-resources">
        <GuideResources
          onPrevious={() => onNavigate("checklist")}
        />
      </TabsContent>
    </div>
  );
}
