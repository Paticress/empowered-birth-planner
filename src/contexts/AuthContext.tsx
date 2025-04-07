
import React, { createContext, useContext, useEffect, useState } from 'react';
import { Session, User } from '@supabase/supabase-js';
import { useAuthService } from '@/hooks/useAuthService';

type AuthContextType = {
  session: Session | null;
  user: User | null;
  isLoading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signUp: (email: string, password: string) => Promise<{ error: any }>;
  signOut: () => Promise<void>;
  isAuthenticated: boolean;
  refreshSession: () => Promise<boolean>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const {
    session,
    user,
    isLoading,
    signIn,
    signUp,
    signOut,
    refreshSession
  } = useAuthService();
  
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

  // Effect to handle authentication state changes
  useEffect(() => {
    // Skip if still loading
    if (isLoading) {
      console.log("Auth context still loading, skipping state update");
      return;
    }
    
    // Consider authenticated if we have a user or a valid session
    const isUserAuthenticated = !!user || !!session || localStorage.getItem('birthPlanLoggedIn') === 'true';
    
    console.log("Authentication state check:", { 
      wasAuthenticated: isAuthenticated, 
      isNowAuthenticated: isUserAuthenticated,
      hasUser: !!user,
      hasSession: !!session,
      hasLocalStorage: localStorage.getItem('birthPlanLoggedIn') === 'true',
      email: user?.email || session?.user?.email || localStorage.getItem('birthPlanEmail')
    });
    
    if (isAuthenticated !== isUserAuthenticated) {
      console.log("Authentication state changed:", { 
        wasAuthenticated: isAuthenticated, 
        isNowAuthenticated: isUserAuthenticated
      });
      
      setIsAuthenticated(isUserAuthenticated);
    }
  }, [user, session, isLoading, isAuthenticated]);

  // We don't want to render any loading state here, as we're now handling it in AppContent
  return (
    <AuthContext.Provider
      value={{
        session,
        user,
        isLoading,
        signIn,
        signUp,
        signOut,
        isAuthenticated,
        refreshSession
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
