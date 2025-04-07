
import { useAuthMethods } from './auth/useAuthMethods';
import { useAuthSession } from './auth/useAuthSession';

/**
 * Main authentication service hook that composes functionality from other auth hooks
 */
export function useAuthService() {
  const { 
    signIn, 
    signUp, 
    signOut,
    authDebugInfo: methodsDebugInfo 
  } = useAuthMethods();
  
  const { 
    session, 
    user, 
    isLoading, 
    initializeAuth,
    authDebugInfo: sessionDebugInfo 
  } = useAuthSession();

  // Combine debug info from both hooks
  const authDebugInfo = {
    ...methodsDebugInfo,
    ...sessionDebugInfo
  };

  return {
    session,
    user,
    isLoading,
    signIn,
    signUp,
    signOut,
    initializeAuth,
    authDebugInfo
  };
}
