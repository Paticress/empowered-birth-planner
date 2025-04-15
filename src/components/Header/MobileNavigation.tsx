
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Menu, X, LogOut, LayoutDashboard } from 'lucide-react';
import { useNavigation } from '@/hooks/useNavigation';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

export function MobileNavigation() {
  const [isOpen, setIsOpen] = useState(false);
  const { navigateTo } = useNavigation();
  const { isAuthenticated, signOut } = useAuth();
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  
  const handleNavigation = (path: string) => {
    navigateTo(path);
    setIsOpen(false);
  };
  
  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await signOut();
      toast.success("Logout realizado com sucesso!");
      window.location.href = '/'; // Force full page reload
      setIsOpen(false);
    } catch (error) {
      console.error("Error during logout:", error);
      toast.error("Erro ao realizar logout");
    } finally {
      setIsLoggingOut(false);
    }
  };
  
  return (
    <div className="md:hidden flex items-center">
      <Button 
        variant="ghost" 
        size="icon"
        onClick={() => setIsOpen(!isOpen)} 
        aria-label="Toggle menu"
        className="text-maternal-600"
      >
        {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
      </Button>
      
      {isOpen && (
        <div className="absolute top-16 inset-x-0 bg-white shadow-lg z-50 rounded-b-lg border-t border-maternal-100">
          <div className="p-4 flex flex-col space-y-2">
            <Button 
              variant="ghost" 
              onClick={() => handleNavigation('/')}
              className="w-full justify-start text-maternal-600"
            >
              Início
            </Button>
            
            <Button 
              variant="ghost" 
              onClick={() => handleNavigation('/guia-online')}
              className="w-full justify-start text-maternal-600"
            >
              Guia Online
            </Button>
            
            <Button 
              variant="ghost" 
              onClick={() => handleNavigation('/plano-personalizado')}
              className="w-full justify-start text-maternal-600"
            >
              Construtor Virtual
            </Button>
            
            {isAuthenticated && (
              <Button 
                variant="ghost" 
                onClick={() => handleNavigation('/dashboard')}
                className="w-full justify-start text-maternal-600"
              >
                <LayoutDashboard className="h-4 w-4 mr-2" />
                Dashboard
              </Button>
            )}
            
            <Button 
              variant="ghost" 
              onClick={() => handleNavigation('/faq')}
              className="w-full justify-start text-maternal-600"
            >
              FAQ
            </Button>
            
            {isAuthenticated ? (
              <Button 
                variant="outline"
                onClick={handleLogout}
                disabled={isLoggingOut}
                className="w-full justify-start text-maternal-600"
              >
                <LogOut className="h-4 w-4 mr-2" />
                {isLoggingOut ? "Saindo..." : "Sair"}
              </Button>
            ) : (
              <Button 
                variant="birth-plan-builder"
                onClick={() => handleNavigation('/acesso-plano')}
                className="w-full"
              >
                Acessar
              </Button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
