
import { Button } from '@/components/ui/button';
import { LogOut, FileText } from 'lucide-react';
import { useNavigation } from '@/hooks/useNavigation';
import { useAuth } from '@/contexts/AuthContext';
import { useState } from 'react';
import { toast } from 'sonner';
import { useBirthPlanAccess } from '@/hooks/useBirthPlanAccess';

export function DesktopNavigation() {
  const { navigateTo } = useNavigation();
  const { isAuthenticated, user, signOut } = useAuth();
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const hasBirthPlanAccess = useBirthPlanAccess();
  
  const handleBirthPlanClick = () => {
    if (hasBirthPlanAccess) {
      navigateTo('/criar-plano');
    } else {
      // Redirect LEADs to the Wix landing page
      window.location.href = "https://www.energiamaterna.com.br/criar-meu-plano-de-parto-em-minutos";
    }
  };
  
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
          onClick={handleBirthPlanClick}
          className="text-maternal-600 hover:text-maternal-900"
        >
          <FileText className="h-4 w-4 mr-2" />
          Construtor Virtual
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
