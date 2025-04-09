import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, User, GraduationCap, BookOpen, FileText } from 'lucide-react';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { useNavigation } from '@/hooks/useNavigation';
import { useAuth } from '@/contexts/AuthContext';

export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const { navigateTo } = useNavigation();
  const { user } = useAuth();
  
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
              onClick={(e) => handleLinkClick(e, '/')}
            >
              <img 
                src="/lovable-uploads/6f452e84-0922-495e-bad9-57a66fa763f6.png" 
                alt="Energia Materna Logo" 
                className="h-10 md:h-14 w-auto"
              />
            </Link>
          </div>
          
          <nav className="hidden md:flex space-x-8">
            <Link 
              to="/guia-online" 
              className={`transition-colors flex items-center ${isActive('/guia-online') 
                ? 'text-maternal-900 font-semibold border-b-2 border-maternal-100' 
                : 'text-maternal-800 hover:text-maternal-600'}`}
              onClick={(e) => handleLinkClick(e, '/guia-online')}
            >
              <BookOpen className="h-4 w-4 mr-1" />
              Guia Online
            </Link>
            <Link 
              to="/plano-de-parto" 
              className={`transition-colors flex items-center ${isActive('/plano-de-parto') 
                ? 'text-maternal-900 font-semibold border-b-2 border-maternal-100' 
                : 'text-maternal-800 hover:text-maternal-600'}`}
              onClick={(e) => handleLinkClick(e, '/plano-de-parto')}
            >
              <FileText className="h-4 w-4 mr-1" />
              Construtor Virtual
            </Link>
            <Link 
              to="https://www.energiamaterna.com.br/programas" 
              className="text-maternal-800 hover:text-maternal-600 transition-colors flex items-center"
              target="_blank"
              rel="noopener noreferrer"
            >
              <GraduationCap className="h-4 w-4 mr-1" />
              Curso Gestando
            </Link>
            
            {user && (
              <Link 
                to="/meus-acessos" 
                className={`transition-colors flex items-center ${isActive('/meus-acessos') 
                  ? 'text-maternal-900 font-semibold border-b-2 border-maternal-100' 
                  : 'text-maternal-800 hover:text-maternal-600'}`}
                onClick={(e) => handleLinkClick(e, '/meus-acessos')}
              >
                <User className="h-4 w-4 mr-1" />
                Meus Acessos
              </Link>
            )}
          </nav>
          
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
                    className={`py-2 px-3 rounded-md transition-colors text-left flex items-center ${isActive('/guia-online') 
                      ? 'bg-maternal-100 text-maternal-900 font-medium' 
                      : 'text-maternal-800 hover:bg-maternal-50'}`}
                    onClick={() => {
                      navigateTo('/guia-online');
                      setMobileMenuOpen(false);
                    }}
                  >
                    <BookOpen className="h-4 w-4 mr-2" />
                    Guia Online
                  </button>
                  <button 
                    className={`py-2 px-3 rounded-md transition-colors text-left flex items-center ${isActive('/plano-de-parto') 
                      ? 'bg-maternal-100 text-maternal-900 font-medium' 
                      : 'text-maternal-800 hover:bg-maternal-50'}`}
                    onClick={() => {
                      navigateTo('/plano-de-parto');
                      setMobileMenuOpen(false);
                    }}
                  >
                    <FileText className="h-4 w-4 mr-2" />
                    Construtor Virtual
                  </button>
                  <a 
                    href="https://www.energiamaterna.com.br/programas"
                    className="py-2 px-3 rounded-md transition-colors text-left flex items-center text-maternal-800 hover:bg-maternal-50"
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <GraduationCap className="h-4 w-4 mr-2" />
                    Curso Gestando
                  </a>
                  
                  {user && (
                    <button 
                      className={`py-2 px-3 rounded-md transition-colors text-left flex items-center ${isActive('/meus-acessos') 
                        ? 'bg-maternal-100 text-maternal-900 font-medium' 
                        : 'text-maternal-800 hover:bg-maternal-50'}`}
                      onClick={() => {
                        navigateTo('/meus-acessos');
                        setMobileMenuOpen(false);
                      }}
                    >
                      <User className="h-4 w-4 mr-2" />
                      Meus Acessos
                    </button>
                  )}
                </nav>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
