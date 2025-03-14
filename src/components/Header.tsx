
import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { GuideSearch } from './Guide/Search/GuideSearch';
import { Button } from '@/components/ui/button';
import { Share2 } from 'lucide-react';

export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const isGuideRoute = location.pathname === '/guia-online';
  
  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 10;
      if (isScrolled !== scrolled) {
        setScrolled(isScrolled);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [scrolled]);

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      scrolled ? 'bg-white/90 backdrop-blur-md shadow-sm' : 'bg-transparent'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">
          <div className="flex items-center">
            <Link to="/" className="flex items-center">
              <span className="text-maternal-800 font-bold text-xl md:text-2xl">Energia Materna</span>
            </Link>
          </div>
          
          {isGuideRoute && (
            <div className="flex items-center space-x-2">
              <GuideSearch onNavigate={(tab) => {
                // This will be used by the GuideSearch component
                const event = new CustomEvent('guide-navigate', { detail: { tab } });
                window.dispatchEvent(event);
              }} />
              
              <Button 
                variant="outline" 
                size="sm" 
                className="p-2 md:p-auto md:flex md:items-center md:gap-2"
                onClick={() => {
                  // Trigger share dialog event
                  const event = new CustomEvent('guide-share');
                  window.dispatchEvent(event);
                }}
                aria-label="Compartilhar"
              >
                <Share2 className="h-4 w-4 md:mr-2" />
                <span className="hidden md:inline">Compartilhar</span>
              </Button>
            </div>
          )}
          
          {!isGuideRoute && (
            <nav className="hidden md:flex space-x-8">
              <Link to="/guia-gratuito" className="text-maternal-800 hover:text-maternal-600 transition-colors">
                Guia Gratuito
              </Link>
              <Link to="/plano-personalizado" className="text-maternal-800 hover:text-maternal-600 transition-colors">
                Plano Personalizado
              </Link>
              <Link to="/depoimentos" className="text-maternal-800 hover:text-maternal-600 transition-colors">
                Depoimentos
              </Link>
            </nav>
          )}
        </div>
      </div>
    </header>
  );
}
