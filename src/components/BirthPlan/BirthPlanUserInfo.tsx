
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { useNavigation } from '@/hooks/useNavigation';
import { LogOut, User } from 'lucide-react';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';

export function BirthPlanUserInfo() {
  const [userEmail, setUserEmail] = useState<string>('');
  const { navigateTo } = useNavigation();
  const { user, signOut } = useAuth();

  useEffect(() => {
    // Prioritize Supabase auth, fallback to localStorage
    if (user?.email) {
      setUserEmail(user.email);
    } else {
      const email = localStorage.getItem('birthPlanEmail');
      if (email) {
        setUserEmail(email);
      }
    }
  }, [user]);

  const handleLogout = async () => {
    await signOut();
    toast.success('Logout realizado com sucesso');
    navigateTo('/guia-online');
  };

  if (!userEmail) return null;

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
