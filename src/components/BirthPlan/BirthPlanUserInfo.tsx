
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { useNavigation } from '@/hooks/useNavigation';
import { LogOut, User, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';
import { Skeleton } from '@/components/ui/skeleton';

export function BirthPlanUserInfo() {
  const [userEmail, setUserEmail] = useState<string>('');
  const { navigateTo } = useNavigation();
  const { user, signOut, isAuthenticated, isLoading, session } = useAuth();

  useEffect(() => {
    if (isLoading) return;
    
    // Get email from multiple sources to ensure reliability
    const email = user?.email || session?.user?.email || localStorage.getItem('birthPlanEmail') || '';
    if (email && email !== userEmail) {
      setUserEmail(email);
      console.log("BirthPlanUserInfo: Using email:", email);
    } else if (!email) {
      console.log("BirthPlanUserInfo: No user email found");
    }
  }, [user, isAuthenticated, isLoading, session, userEmail]);

  const handleLogout = async () => {
    try {
      await signOut();
      // Clear any local storage auth data
      localStorage.removeItem('birthPlanLoggedIn');
      localStorage.removeItem('birthPlanEmail');
      
      toast.success('Logout realizado com sucesso');
      navigateTo('/');
    } catch (error) {
      console.error("Error during logout:", error);
      toast.error("Erro ao realizar logout");
    }
  };

  // Show loading skeleton if still loading
  if (isLoading) {
    return (
      <div className="flex items-center gap-2">
        <Skeleton className="h-8 w-32" />
        <Skeleton className="h-8 w-20" />
      </div>
    );
  }

  // Show user info if authenticated, even if we only have email from localStorage
  if (!isAuthenticated && !userEmail) {
    return null;
  }

  return (
    <div className="flex items-center gap-2 text-sm">
      <div className="flex items-center text-maternal-800 bg-maternal-50 px-3 py-1 rounded-full border border-maternal-200">
        <User className="h-3.5 w-3.5 mr-1 text-maternal-600" />
        {userEmail}
      </div>
      <Button 
        variant="ghost" 
        size="sm" 
        onClick={handleLogout}
        className="btn-logout"
      >
        <LogOut className="h-3.5 w-3.5 mr-1" />
        Sair
      </Button>
    </div>
  );
}
