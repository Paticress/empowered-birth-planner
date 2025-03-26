
import { useEffect, useRef } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { GuideIntroduction } from './GuideIntroduction';
import { GuideRights } from './GuideRights';
import { GuideStructure } from './GuideStructure';
import { GuideCommunication } from './GuideCommunication';
import { GuideChecklist } from './GuideChecklist';
import { GuideResources } from './GuideResources';
import { BackToTopButton } from './BackToTopButton';
import { MobileNavigation } from './MobileNavigation';
import { GuideProgressBar } from './GuideProgressBar';
import { useIsMobile } from '@/hooks/use-mobile';

interface GuideTabsProps {
  activeTab: string;
  onTabChange: (value: string) => void;
  embedded?: boolean;
}

// Define tab names for navigation
const TAB_NAMES = {
  'introduction': 'Introdução',
  'rights': 'Seus Direitos',
  'structure': 'Estrutura do Plano',
  'communication': 'Comunicação com a Equipe',
  'checklist': 'Checklist Essencial',
  'resources': 'Recursos Adicionais'
};

export function GuideTabs({ activeTab, onTabChange, embedded = false }: GuideTabsProps) {
  const tabsRef = useRef<HTMLDivElement>(null);
  const isMobile = useIsMobile();
  
  useEffect(() => {
    // Scroll to top when tab changes
    if (tabsRef.current) {
      tabsRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, [activeTab]);
  
  const handleValueChange = (value: string) => {
    onTabChange(value);
  };

  return (
    <div ref={tabsRef} className="mb-16">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-maternal-900">
          Guia do Parto Respeitoso
        </h1>
        <p className="text-lg text-maternal-700 mt-2">
          Seu guia completo para um plano de parto eficaz
        </p>
      </div>
      
      <GuideProgressBar activeTab={activeTab} />
      
      {isMobile && (
        <div className="mb-6">
          <MobileNavigation 
            activeTab={activeTab} 
            onTabChange={onTabChange}
            tabNames={TAB_NAMES}
          />
        </div>
      )}
      
      <Tabs 
        value={activeTab} 
        onValueChange={handleValueChange}
        className="w-full"
      >
        {!isMobile && (
          <TabsList className="w-full mb-8 overflow-x-auto flex-nowrap whitespace-nowrap">
            <TabsTrigger value="introduction">Introdução</TabsTrigger>
            <TabsTrigger value="rights">Seus Direitos</TabsTrigger>
            <TabsTrigger value="structure">Estrutura do Plano</TabsTrigger>
            <TabsTrigger value="communication">Comunicação com a Equipe</TabsTrigger>
            <TabsTrigger value="checklist">Checklist Essencial</TabsTrigger>
            <TabsTrigger value="resources">Recursos Adicionais</TabsTrigger>
          </TabsList>
        )}
        
        <TabsContent value="introduction">
          <GuideIntroduction onNext={() => onTabChange('rights')} />
        </TabsContent>
        
        <TabsContent value="rights">
          <GuideRights onNext={() => onTabChange('structure')} onPrevious={() => onTabChange('introduction')} />
        </TabsContent>
        
        <TabsContent value="structure">
          <GuideStructure onNext={() => onTabChange('communication')} onPrevious={() => onTabChange('rights')} />
        </TabsContent>
        
        <TabsContent value="communication">
          <GuideCommunication onNext={() => onTabChange('checklist')} onPrevious={() => onTabChange('structure')} />
        </TabsContent>
        
        <TabsContent value="checklist">
          <GuideChecklist onNext={() => onTabChange('resources')} onPrevious={() => onTabChange('communication')} />
        </TabsContent>
        
        <TabsContent value="resources">
          <GuideResources onPrevious={() => onTabChange('checklist')} />
        </TabsContent>
      </Tabs>
      
      <BackToTopButton />
    </div>
  );
}
