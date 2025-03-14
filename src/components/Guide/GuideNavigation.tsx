
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

  return (
    <div className="flex justify-between items-center mt-8 mb-16 print:hidden">
      {!isFirstTab ? (
        <Button 
          variant="outline" 
          className="flex items-center" 
          onClick={() => onNavigate(tabs[currentIndex - 1])}
        >
          <ArrowLeft className="mr-2 h-4 w-4" /> Seção Anterior
        </Button>
      ) : (
        <div></div>
      )}
      
      {!isLastTab ? (
        <Button 
          className="bg-maternal-600 hover:bg-maternal-700 flex items-center ml-auto" 
          onClick={() => onNavigate(tabs[currentIndex + 1])}
        >
          Próxima Seção <ChevronRight className="ml-2 h-4 w-4" />
        </Button>
      ) : (
        <div></div>
      )}
    </div>
  );
}
