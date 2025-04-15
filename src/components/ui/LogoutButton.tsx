import React, { useState } from 'react';
import { Button } from './button';
import { LogOut } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

interface LogoutButtonProps {
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link';
  className?: string;
  onLogoutSuccess?: () => void;
}

export function LogoutButton({ 
  variant = 'outline', 
  className = '',
  onLogoutSuccess
}: LogoutButtonProps) {
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const { signOut } = useAuth();

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await signOut();
      toast.success('Logout realizado com sucesso');
      
      // If a success callback is provided, call it
      if (onLogoutSuccess) {
        onLogoutSuccess();
      } else {
        // Otherwise, redirect to home page
        window.location.href = '/';
      }
    } catch (error) {
      console.error("Error during logout:", error);
      toast.error("Erro ao realizar logout");
      setIsLoggingOut(false);
    }
  };

  return (
    <Button 
      variant={variant}
      onClick={handleLogout}
      disabled={isLoggingOut}
      className={`flex items-center ${className}`}
    >
      <LogOut className="h-4 w-4 mr-2" />
      {isLoggingOut ? "Saindo..." : "Sair"}
    </Button>
  );
}
