
import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { useNavigation } from '@/hooks/useNavigation';

export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const { navigateTo } = useNavigation();
  
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

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  const handleLinkClick = (e: React.MouseEvent<HTMLAnchorElement>, path: string) => {
    e.preventDefault();
    navigateTo(path);
    setMobileMenuOpen(false);
  };

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      scrolled ? 'bg-white/95 backdrop-blur-sm shadow-sm' : 'bg-white'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">
          <div className="flex items-center">
            <Link 
              to="/" 
              className="flex items-center" 
              onClick={(e) => handleLinkClick(e, '/guia-online')}
            >
              <img 
                src="/lovable-uploads/6f452e84-0922-495e-bad9-57a66fa763f6.png" 
                alt="Energia Materna Logo" 
                className="h-10 md:h-14 w-auto"
              />
            </Link>
          </div>
          
          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-8">
            <Link 
              to="/guia-gratuito" 
              className={`transition-colors ${isActive('/guia-gratuito') 
                ? 'text-maternal-900 font-semibold border-b-2 border-maternal-100' 
                : 'text-maternal-800 hover:text-maternal-600'}`}
              onClick={(e) => handleLinkClick(e, '/guia-gratuito')}
            >
              Guia Gratuito
            </Link>
            <Link 
              to="/guia-online" 
              className={`transition-colors ${isActive('/guia-online') 
                ? 'text-maternal-900 font-semibold border-b-2 border-maternal-100' 
                : 'text-maternal-800 hover:text-maternal-600'}`}
              onClick={(e) => handleLinkClick(e, '/guia-online')}
            >
              Guia Online
            </Link>
            <Link 
              to="/plano-personalizado" 
              className={`transition-colors ${isActive('/plano-personalizado') 
                ? 'text-maternal-900 font-semibold border-b-2 border-maternal-100' 
                : 'text-maternal-800 hover:text-maternal-600'}`}
              onClick={(e) => handleLinkClick(e, '/plano-personalizado')}
            >
              Plano Personalizado
            </Link>
            <Link 
              to="/depoimentos" 
              className={`transition-colors ${isActive('/depoimentos') 
                ? 'text-maternal-900 font-semibold border-b-2 border-maternal-100' 
                : 'text-maternal-800 hover:text-maternal-600'}`}
              onClick={(e) => handleLinkClick(e, '/depoimentos')}
            >
              Depoimentos
            </Link>
          </nav>
          
          {/* Mobile Menu Button */}
          <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
            <SheetTrigger asChild className="md:hidden">
              <button 
                className="text-maternal-900 p-2 rounded-md"
                aria-label="Menu principal"
              >
                <Menu className="h-6 w-6" />
              </button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[250px] sm:w-[300px] bg-white">
              <div className="flex flex-col h-full py-6">
                <div className="flex items-center justify-between mb-8">
                  <div className="flex items-center">
                    <img 
                      src="/lovable-uploads/6f452e84-0922-495e-bad9-57a66fa763f6.png" 
                      alt="Energia Materna Logo" 
                      className="h-8 w-auto"
                    />
                  </div>
                  <button 
                    className="text-maternal-900 p-1 rounded-md"
                    onClick={() => setMobileMenuOpen(false)}
                    aria-label="Fechar menu"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>
                <nav className="flex flex-col space-y-4">
                  <button 
                    className={`py-2 px-3 rounded-md transition-colors text-left ${isActive('/guia-gratuito') 
                      ? 'bg-maternal-100 text-maternal-900 font-medium' 
                      : 'text-maternal-800 hover:bg-maternal-50'}`}
                    onClick={() => {
                      navigateTo('/guia-gratuito');
                      setMobileMenuOpen(false);
                    }}
                  >
                    Guia Gratuito
                  </button>
                  <button 
                    className={`py-2 px-3 rounded-md transition-colors text-left ${isActive('/guia-online') 
                      ? 'bg-maternal-100 text-maternal-900 font-medium' 
                      : 'text-maternal-800 hover:bg-maternal-50'}`}
                    onClick={() => {
                      navigateTo('/guia-online');
                      setMobileMenuOpen(false);
                    }}
                  >
                    Guia Online
                  </button>
                  <button 
                    className={`py-2 px-3 rounded-md transition-colors text-left ${isActive('/plano-personalizado') 
                      ? 'bg-maternal-100 text-maternal-900 font-medium' 
                      : 'text-maternal-800 hover:bg-maternal-50'}`}
                    onClick={() => {
                      navigateTo('/plano-personalizado');
                      setMobileMenuOpen(false);
                    }}
                  >
                    Plano Personalizado
                  </button>
                  <button 
                    className={`py-2 px-3 rounded-md transition-colors text-left ${isActive('/depoimentos') 
                      ? 'bg-maternal-100 text-maternal-900 font-medium' 
                      : 'text-maternal-800 hover:bg-maternal-50'}`}
                    onClick={() => {
                      navigateTo('/depoimentos');
                      setMobileMenuOpen(false);
                    }}
                  >
                    Depoimentos
                  </button>
                </nav>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
