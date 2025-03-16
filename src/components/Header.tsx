
import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';

export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  
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

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      scrolled ? 'bg-white shadow-sm' : 'bg-white'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">
          <div className="flex items-center">
            <Link to="/" className="flex items-center">
              <span className="text-brand-black font-bold text-xl md:text-2xl">Energia Materna</span>
            </Link>
          </div>
          <nav className="hidden md:flex space-x-8">
            <Link 
              to="/guia-gratuito" 
              className={`transition-colors ${isActive('/guia-gratuito') 
                ? 'text-brand-black font-semibold border-b-2 border-brand-pink' 
                : 'text-brand-black hover:text-brand-pink'}`}
            >
              Guia Gratuito
            </Link>
            <Link 
              to="/guia-online" 
              className={`transition-colors ${isActive('/guia-online') 
                ? 'text-brand-black font-semibold border-b-2 border-brand-pink' 
                : 'text-brand-black hover:text-brand-pink'}`}
            >
              Guia Online
            </Link>
            <Link 
              to="/plano-personalizado" 
              className={`transition-colors ${isActive('/plano-personalizado') 
                ? 'text-brand-black font-semibold border-b-2 border-brand-pink' 
                : 'text-brand-black hover:text-brand-pink'}`}
            >
              Plano Personalizado
            </Link>
            <Link 
              to="/depoimentos" 
              className={`transition-colors ${isActive('/depoimentos') 
                ? 'text-brand-black font-semibold border-b-2 border-brand-pink' 
                : 'text-brand-black hover:text-brand-pink'}`}
            >
              Depoimentos
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
}
