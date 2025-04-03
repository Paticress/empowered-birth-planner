
import React, { createContext, useContext, useEffect, useState } from 'react';
import { Session, User } from '@supabase/supabase-js';
import { useAuthService } from '@/hooks/useAuthService';
import { toast } from 'sonner';

type AuthContextType = {
  session: Session | null;
  user: User | null;
  isLoading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signUp: (email: string, password: string) => Promise<{ error: any }>;
  signInWithMagicLink: (email: string) => Promise<{ error: any }>;
  signOut: () => Promise<void>;
  isAuthenticated: boolean;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const {
    session,
    user,
    isLoading,
    signIn,
    signUp,
    signInWithMagicLink,
    signOut,
    initializeAuth
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
  }, [isInitialized]);

  // Synchronize authentication state
  useEffect(() => {
    const isUserAuthenticated = !!user || localStorage.getItem('birthPlanLoggedIn') === 'true';
    setIsAuthenticated(isUserAuthenticated);
    
    console.log("Auth state synchronized:", { 
      isAuthenticated: isUserAuthenticated,
      hasUser: !!user,
      hasLocalStorage: localStorage.getItem('birthPlanLoggedIn') === 'true'
    });
  }, [user]);

  // Debug auth state
  useEffect(() => {
    console.log("Auth context state:", { 
      isAuthenticated: isAuthenticated, 
      userEmail: user?.email || localStorage.getItem('birthPlanEmail'),
      isLoading 
    });
  }, [isAuthenticated, user, isLoading]);

  return (
    <AuthContext.Provider
      value={{
        session,
        user,
        isLoading,
        signIn,
        signUp,
        signInWithMagicLink,
        signOut,
        isAuthenticated
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
