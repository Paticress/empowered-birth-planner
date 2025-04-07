
import { Link } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
import { BookOpen, FileText, GraduationCap, User, Home } from 'lucide-react';
import { useNavigation } from '@/hooks/useNavigation';
import { useAuth } from '@/contexts/AuthContext';

export function DesktopNavigation() {
  const location = useLocation();
  const { navigateTo } = useNavigation();
  const { user } = useAuth();
  
  const isActive = (path: string) => {
    return location.pathname === path;
  };

  const handleLinkClick = (e: React.MouseEvent<HTMLAnchorElement>, path: string) => {
    e.preventDefault();
    navigateTo(path);
  };

  return (
    <nav className="hidden md:flex space-x-8">
      {user && (
        <Link 
          to="/dashboard" 
          className={`transition-colors flex items-center ${isActive('/dashboard') 
            ? 'text-maternal-900 font-semibold border-b-2 border-maternal-100' 
            : 'text-maternal-800 hover:text-maternal-600'}`}
          onClick={(e) => handleLinkClick(e, '/dashboard')}
        >
          <Home className="h-4 w-4 mr-1" />
          Dashboard
        </Link>
      )}
      
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
      
      <a 
        href="https://www.energiamaterna.com.br/programas" 
        className="text-maternal-800 hover:text-maternal-600 transition-colors flex items-center"
        target="_blank"
        rel="noopener noreferrer"
      >
        <GraduationCap className="h-4 w-4 mr-1" />
        Curso Gestando
      </a>
      
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
  );
}
