
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { User, BookOpen, FileText, LogOut } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigation } from '@/hooks/useNavigation';
import { useBirthPlanAccess } from '@/hooks/useBirthPlanAccess';
import { toast } from 'sonner';

export function UserMenu() {
  const { user, signOut } = useAuth();
  const { navigateTo } = useNavigation();
  const hasBirthPlanAccess = useBirthPlanAccess();
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  
  // Get the current guide section from localStorage if available
  const getCurrentGuideSection = () => {
    try {
      const lastTab = localStorage.getItem('currentGuideTab');
      return lastTab ? `/guia-online?tab=${lastTab}` : '/guia-online';
    } catch (error) {
      return '/guia-online';
    }
  };
  
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
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative rounded-full">
          <User className="h-5 w-5" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel>Minha Conta</DropdownMenuLabel>
        {user?.email && (
          <DropdownMenuLabel className="text-xs font-normal text-muted-foreground truncate">
            {user.email}
          </DropdownMenuLabel>
        )}
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => navigateTo(getCurrentGuideSection())}>
          <BookOpen className="mr-2 h-4 w-4" />
          <span>Retomar Guia Online</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleBirthPlanClick}>
          <FileText className="mr-2 h-4 w-4" />
          <span>{hasBirthPlanAccess ? 'Retomar Construtor Virtual' : 'Adquirir Construtor Virtual'}</span>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem 
          onClick={handleLogout}
          disabled={isLoggingOut}
        >
          <LogOut className="mr-2 h-4 w-4" />
          <span>{isLoggingOut ? "Saindo..." : "Sair"}</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
