
import { ArrowLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

type GuideNavigationProps = {
  activeTab: string;
  onNavigate: (tab: string) => void;
  tabs: string[];
};

export function GuideNavigation({ activeTab, onNavigate, tabs }: GuideNavigationProps) {
  const currentIndex = tabs.indexOf(activeTab);
  const isFirstTab = currentIndex === 0;
  const isLastTab = currentIndex === tabs.length - 1;

  const handleNavigation = (tab: string) => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    onNavigate(tab);
  };

  return (
    <div className="flex justify-between items-center mt-8 mb-16 print:hidden">
      {!isFirstTab ? (
        <Button 
          variant="outline" 
          className="flex items-center border-brand-tan text-brand-gold hover:bg-brand-beige/20" 
          onClick={() => handleNavigation(tabs[currentIndex - 1])}
        >
          <ArrowLeft className="mr-2 h-4 w-4" /> Seção Anterior
        </Button>
      ) : (
        <div></div>
      )}
      
      {!isLastTab ? (
        <Button 
          className="bg-brand-gold hover:bg-brand-tan flex items-center ml-auto" 
          onClick={() => handleNavigation(tabs[currentIndex + 1])}
        >
          Próxima Seção <ChevronRight className="ml-2 h-4 w-4" />
        </Button>
      ) : (
        <div></div>
      )}
    </div>
  );
}
