
import React, { useState } from 'react';
import { Button } from './button';
import { LogOut } from 'lucide-react';
import { useNavigation } from '@/hooks/useNavigation';
import { useAuth } from '@/contexts/AuthContext';

interface LogoutButtonProps {
  variant?: 'default' | 'ghost' | 'outline';
  className?: string;
}

export function LogoutButton({ 
  variant = 'outline', 
  className = '' 
}: LogoutButtonProps) {
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const { signOut } = useAuth();

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await signOut();
      // Navigation is handled within signOut method
    } catch (error) {
      console.error("Error during logout:", error);
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
