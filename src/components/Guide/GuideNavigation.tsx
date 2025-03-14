
import { Button } from '@/components/ui/button';
import { ArrowLeft, ChevronRight } from 'lucide-react';
import { GuideTab } from '@/hooks/use-guide-tabs';

interface GuideNavigationProps {
  isFirstTab: boolean;
  isLastTab: boolean;
  previousTab: GuideTab | null;
  nextTab: GuideTab | null;
  tabNames: Record<GuideTab, string>;
  onNavigation: (tab: GuideTab) => void;
}

export function GuideNavigation({ 
  isFirstTab, 
  isLastTab, 
  previousTab, 
  nextTab, 
  tabNames,
  onNavigation 
}: GuideNavigationProps) {
  return (
    <div className="flex justify-between items-center mb-4 print:hidden">
      {!isFirstTab && previousTab ? (
        <Button 
          variant="outline" 
          className="flex items-center border-brand-tan text-brand-gold hover:bg-brand-beige/20" 
          onClick={() => onNavigation(previousTab)}
          aria-label={`Ir para seção anterior: ${tabNames[previousTab]}`}
        >
          <ArrowLeft className="mr-2 h-4 w-4" /> Seção Anterior
        </Button>
      ) : (
        <div></div>
      )}
      
      {!isLastTab && nextTab ? (
        <Button 
          className="bg-brand-gold hover:bg-brand-tan flex items-center ml-auto" 
          onClick={() => onNavigation(nextTab)}
          aria-label={`Ir para próxima seção: ${tabNames[nextTab]}`}
        >
          Próxima Seção <ChevronRight className="ml-2 h-4 w-4" />
        </Button>
      ) : (
        <div></div>
      )}
    </div>
  );
}
