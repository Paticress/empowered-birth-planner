
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { useNavigation } from '@/hooks/useNavigation';
import { Search } from 'lucide-react';
import { GuideSearch } from './Search/GuideSearch';
import { BirthPlanNavButton } from '../BirthPlan/NavButton';
import { useIsMobile } from '@/hooks/use-mobile';

type GuideHeaderProps = {
  onNavigate?: (value: string) => void;
  currentTab?: string;
};

export function GuideHeader({ onNavigate, currentTab }: GuideHeaderProps) {
  const [searchOpen, setSearchOpen] = useState(false);
  const { navigateTo } = useNavigation();
  const isMobile = useIsMobile();

  const handleNavigation = (path: string) => {
    if (onNavigate) {
      // Se estamos dentro do OnlineGuide e queremos ir para 'guia-online',
      // vamos apenas definir a tab como 'introduction'
      if (path === '/guia-online' && currentTab) {
        onNavigate('introduction');
        return;
      }
      onNavigate(path);
    } else {
      navigateTo(path);
    }
  };

  return (
    <header className="bg-white sticky top-0 z-40 border-b border-gray-200 shadow-sm print:hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Logo - No logo here to prevent overlap with main header */}
          <div className="flex-shrink-0 flex items-center">
            <span className="ml-2 font-semibold text-gray-900">
              Guia do Parto Respeitoso
            </span>
          </div>

          {/* Desktop actions - search button and birth plan button */}
          <div className="hidden md:flex items-center space-x-4">
            {/* BIRTH PLAN NAVIGATION BUTTON */}
            <BirthPlanNavButton />
            
            <Button
              variant="outline"
              onClick={() => setSearchOpen(true)}
              className="text-gray-600"
            >
              <Search className="h-4 w-4 mr-2" />
              Buscar
            </Button>
          </div>

          {/* Mobile - just search button */}
          <div className="md:hidden flex items-center">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setSearchOpen(true)}
              className="text-gray-600"
            >
              <Search className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>

      {/* Search overlay */}
      {searchOpen && (
        <GuideSearch 
          onClose={() => setSearchOpen(false)} 
          onNavigate={onNavigate}
        />
      )}
    </header>
  );
}
