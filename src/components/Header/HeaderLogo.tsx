
import { Link } from 'react-router-dom';
import { useNavigation } from '@/hooks/useNavigation';

export function HeaderLogo() {
  const { navigateTo } = useNavigation();
  
  const handleLinkClick = (e: React.MouseEvent<HTMLAnchorElement>, path: string) => {
    e.preventDefault();
    navigateTo(path);
  };

  return (
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
  );
}
