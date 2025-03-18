
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { useNavigation } from '@/hooks/useNavigation';
import { Search, Menu, X } from 'lucide-react';
import { GuideSearch } from './Search/GuideSearch';
import { BirthPlanNavButton } from '../BirthPlan/NavButton';

type GuideHeaderProps = {
  onNavigate?: (value: string) => void;
  currentTab?: string;
};

export function GuideHeader({ onNavigate, currentTab }: GuideHeaderProps) {
  const [searchOpen, setSearchOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { navigateTo } = useNavigation();

  // Close mobile menu on window resize
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setMobileMenuOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleNavigation = (path: string) => {
    if (onNavigate) {
      onNavigate(path);
    } else {
      navigateTo('/guia-online');
    }
  };

  return (
    <header className="bg-white sticky top-0 z-50 border-b border-gray-200 shadow-sm print:hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Logo */}
          <div className="flex-shrink-0 flex items-center">
            <img
              className="h-8 w-auto"
              src="/placeholder.svg"
              alt="Logo Guia do Parto Respeitoso"
              onClick={() => navigateTo('/guia-online')}
              style={{ cursor: 'pointer' }}
            />
            <span className="ml-2 font-semibold text-gray-900 hidden sm:block">
              Guia do Parto Respeitoso
            </span>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-4 items-center">
            <Button
              variant="ghost"
              onClick={() => handleNavigation('/guia-online')}
              className="text-gray-600 hover:text-gray-900"
            >
              Guia Online
            </Button>
            
            {/* ADDED BIRTH PLAN NAVIGATION BUTTON */}
            <BirthPlanNavButton />
            
            <Button
              variant="outline"
              onClick={() => setSearchOpen(true)}
              className="text-gray-600"
            >
              <Search className="h-4 w-4 mr-2" />
              Buscar
            </Button>
          </nav>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center space-x-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setSearchOpen(true)}
              className="text-gray-600"
            >
              <Search className="h-5 w-5" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="text-gray-600"
            >
              {mobileMenuOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-gray-50">
            <Button
              variant="ghost"
              onClick={() => {
                navigateTo('/guia-online');
                setMobileMenuOpen(false);
              }}
              className="w-full justify-start text-gray-600 hover:text-gray-900"
            >
              Guia Online
            </Button>
            
            {/* ADDED BIRTH PLAN NAVIGATION BUTTON FOR MOBILE */}
            <BirthPlanNavButton className="w-full justify-start" />
          </div>
        </div>
      )}

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
