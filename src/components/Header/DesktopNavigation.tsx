
import { Button } from '@/components/ui/button';
import { LogOut, LayoutDashboard } from 'lucide-react';
import { useNavigation } from '@/hooks/useNavigation';
import { useAuth } from '@/contexts/AuthContext';
import { useState } from 'react';
import { toast } from 'sonner';

export function DesktopNavigation() {
  const { navigateTo } = useNavigation();
  const { isAuthenticated, signOut } = useAuth();
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  
  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await signOut();
      toast.success("Logout realizado com sucesso!");
      window.location.href = '/'; // Force full page reload
    } catch (error) {
      console.error("Error during logout:", error);
      toast.error("Erro ao realizar logout");
    } finally {
      setIsLoggingOut(false);
    }
  };
  
  return (
    <nav className="hidden md:flex md:items-center md:space-x-4">
      <Button 
        variant="ghost" 
        onClick={() => navigateTo('/')}
        className="text-maternal-600 hover:text-maternal-900"
      >
        Início
      </Button>
      
      <Button 
        variant="ghost" 
        onClick={() => navigateTo('/guia-online')}
        className="text-maternal-600 hover:text-maternal-900"
      >
        Guia Online
      </Button>
      
      {isAuthenticated && (
        <Button 
          variant="ghost" 
          onClick={() => navigateTo('/dashboard')}
          className="text-maternal-600 hover:text-maternal-900"
        >
          <LayoutDashboard className="h-4 w-4 mr-2" />
          Dashboard
        </Button>
      )}
      
      <Button 
        variant="ghost" 
        onClick={() => navigateTo('/faq')}
        className="text-maternal-600 hover:text-maternal-900"
      >
        FAQ
      </Button>
      
      {isAuthenticated ? (
        <Button 
          variant="outline"
          onClick={handleLogout}
          disabled={isLoggingOut}
          className="text-maternal-600 hover:text-maternal-900"
        >
          <LogOut className="h-4 w-4 mr-2" />
          {isLoggingOut ? "Saindo..." : "Sair"}
        </Button>
      ) : (
        <Button 
          variant="birth-plan-builder"
          onClick={() => navigateTo('/acesso-plano')}
          className="text-white"
        >
          Acessar
        </Button>
      )}
    </nav>
  );
}
