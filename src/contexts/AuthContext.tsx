
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
    initializeAuth,
    refreshSession
  } = useAuthService();
  
  const [isInitialized, setIsInitialized] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Initialize authentication
  useEffect(() => {
    if (!isInitialized) {
      console.log("Setting up auth context");
      const cleanup = initializeAuth();
      setIsInitialized(true);
      
      return cleanup;
    }
  }, [isInitialized, initializeAuth]);

  // Synchronize authentication state - this runs whenever user or session changes
  useEffect(() => {
    // Consider authenticated if we have a user from Supabase OR if localStorage has login info
    const isUserAuthenticated = !!user || localStorage.getItem('birthPlanLoggedIn') === 'true';
    
    if (isAuthenticated !== isUserAuthenticated) {
      console.log("Authentication state changed:", { 
        wasAuthenticated: isAuthenticated, 
        isNowAuthenticated: isUserAuthenticated,
        hasUser: !!user,
        hasLocalStorage: localStorage.getItem('birthPlanLoggedIn') === 'true',
        email: user?.email || localStorage.getItem('birthPlanEmail')
      });
      
      setIsAuthenticated(isUserAuthenticated);
    }
  }, [user, isAuthenticated]);

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
