import { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { Menu, X, BookOpen, FileText, GraduationCap, User } from 'lucide-react';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { useNavigation } from '@/hooks/useNavigation';
import { useAuth } from '@/contexts/AuthContext';

export function MobileNavigation() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const { navigateTo } = useNavigation();
  const { user } = useAuth();
  
  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
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
          </nav>
        </div>
      </SheetContent>
    </Sheet>
  );
}
