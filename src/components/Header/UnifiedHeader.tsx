import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { useLocation } from 'react-router-dom';
import { Menu, X, BookOpen, FileText, LayoutDashboard } from 'lucide-react';
import { useNavigation } from '@/hooks/useNavigation';
import { useAuth } from '@/contexts/AuthContext';
import { useBirthPlanAccess } from '@/hooks/useBirthPlanAccess';
import { UserMenu } from './UserMenu';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { LogoutButton } from '@/components/ui/LogoutButton';

export function UnifiedHeader() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const { navigateTo } = useNavigation();
  const { isAuthenticated, user } = useAuth();
  const hasBirthPlanAccess = useBirthPlanAccess();
  
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
    if (path === '/guia-online') {
      return location.pathname === '/guia-online';
    }
    if (path === '/criar-plano') {
      return location.pathname === '/criar-plano' || location.pathname.startsWith('/criar-plano/');
    }
    return location.pathname === path;
  };

  const handleBirthPlanClick = () => {
    if (hasBirthPlanAccess) {
      navigateTo('/criar-plano');
    } else {
      // Redirect LEADs to the Wix landing page
      window.location.href = "https://www.energiamaterna.com.br/criar-meu-plano-de-parto-em-minutos";
    }
  };

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      scrolled ? 'bg-white/95 backdrop-blur-sm shadow-sm' : 'bg-white'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* LEFT SIDE - Dashboard button */}
          <div>
            <Button
              variant="ghost"
              onClick={() => navigateTo('/dashboard')}
              className="text-maternal-700 hover:text-maternal-900 flex items-center"
            >
              <LayoutDashboard className="h-5 w-5 mr-2" />
              <span className="hidden sm:inline">Dashboard</span>
            </Button>
          </div>
          
          {/* CENTER/RIGHT - Navigation buttons */}
          <nav className="hidden md:flex items-center space-x-4">
            <Button 
              variant={isActive('/guia-online') ? 'secondary' : 'ghost'}
              onClick={() => navigateTo('/guia-online')}
              className={isActive('/guia-online') ? 'text-white' : 'text-maternal-700 hover:text-maternal-900'}
            >
              <BookOpen className="h-4 w-4 mr-2" />
              Guia Online
            </Button>
            
            <Button 
              variant={isActive('/criar-plano') ? 'secondary' : 'ghost'}
              onClick={handleBirthPlanClick}
              className={isActive('/criar-plano') ? 'text-white' : 'text-maternal-700 hover:text-maternal-900'}
            >
              <FileText className="h-4 w-4 mr-2" />
              Construtor Virtual
            </Button>
            
            {isAuthenticated && <UserMenu />}
          </nav>
          
          {/* Mobile menu */}
          <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
            <SheetTrigger asChild className="md:hidden">
              <Button 
                variant="ghost" 
                size="icon"
                className="text-maternal-700"
              >
                <Menu className="h-6 w-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[250px] sm:w-[300px] bg-white">
              <div className="flex flex-col h-full py-6">
                <div className="flex items-center justify-between mb-8">
                  <Button 
                    variant="ghost"
                    onClick={() => {
                      navigateTo('/dashboard');
                      setMobileMenuOpen(false);
                    }}
                    className="text-maternal-700 hover:text-maternal-900 flex items-center"
                  >
                    <LayoutDashboard className="h-5 w-5 mr-2" />
                    Dashboard
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="icon"
                    onClick={() => setMobileMenuOpen(false)}
                    className="text-maternal-700"
                  >
                    <X className="h-5 w-5" />
                  </Button>
                </div>
                
                <nav className="flex flex-col space-y-4">
                  <Button 
                    variant={isActive('/guia-online') ? 'secondary' : 'ghost'}
                    onClick={() => {
                      navigateTo('/guia-online');
                      setMobileMenuOpen(false);
                    }}
                    className={`w-full justify-start ${isActive('/guia-online') ? 'text-white' : 'text-maternal-700'}`}
                  >
                    <BookOpen className="h-4 w-4 mr-2" />
                    Guia Online
                  </Button>
                  
                  <Button 
                    variant={isActive('/criar-plano') ? 'secondary' : 'ghost'}
                    onClick={() => {
                      handleBirthPlanClick();
                      setMobileMenuOpen(false);
                    }}
                    className={`w-full justify-start ${isActive('/criar-plano') ? 'text-white' : 'text-maternal-700'}`}
                  >
                    <FileText className="h-4 w-4 mr-2" />
                    Construtor Virtual
                  </Button>
                  
                  {isAuthenticated && (
                    <>
                      <div className="border-t border-gray-200 my-2 pt-2"></div>
                      
                      <Button 
                        variant="ghost"
                        onClick={() => {
                          navigateTo('/guia-online');
                          setMobileMenuOpen(false);
                        }}
                        className="w-full justify-start text-maternal-700"
                      >
                        <BookOpen className="h-4 w-4 mr-2" />
                        Retomar Guia Online
                      </Button>
                      
                      <Button 
                        variant="ghost"
                        onClick={() => {
                          handleBirthPlanClick();
                          setMobileMenuOpen(false);
                        }}
                        className="w-full justify-start text-maternal-700"
                      >
                        <FileText className="h-4 w-4 mr-2" />
                        {hasBirthPlanAccess ? 'Retomar Construtor Virtual' : 'Adquirir Construtor Virtual'}
                      </Button>
                      
                      <LogoutButton 
                        variant="ghost"
                        className="w-full justify-start text-maternal-700"
                        onLogoutSuccess={() => setMobileMenuOpen(false)}
                      />
                    </>
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
