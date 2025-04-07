
import { useState, useCallback, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { extractTokenDebugInfo } from '@/utils/auth/token/debug';
import { AuthUrlInfo } from '@/types/auth';

/**
 * Hook for processing authentication tokens in URLs
 */
export function useAuthProcessor() {
  const [isProcessingAuth, setIsProcessingAuth] = useState(false);
  const [debugInfo, setDebugInfo] = useState<any>({});

  // Process auth tokens from URL
  const processAuth = useCallback(async (urlInfo: AuthUrlInfo) => {
    // Already set state to avoid duplicate processing
    setIsProcessingAuth(true);
    
    const { fullUrl, hash, search, hasAuthInHash, hasAuthInSearch, hasAuthInPath } = urlInfo;
    
    // Debug logging
    console.log("Processing authentication with URL info:", {
      hasAuthInHash,
      hasAuthInSearch,
      hasAuthInPath,
      hash: hash ? hash.substring(0, 20) + '...' : 'none',
      search: search ? search.substring(0, 20) + '...' : 'none'
    });
    
    // Save debug info
    setDebugInfo({
      urlInfo,
      tokenInfo: extractTokenDebugInfo(),
      timestamp: new Date().toISOString()
    });
    
    // Try multiple methods to handle the authentication
    try {
      // Method 1: Exchange the code/token for a session
      console.log("Method 1: Using exchangeCodeForSession with fullUrl");
      try {
        const { data, error } = await supabase.auth.exchangeCodeForSession(fullUrl);
        
        if (error) {
          console.error("Error with Method 1:", error);
          setDebugInfo(prev => ({
            ...prev,
            method1Error: error.message,
            method1ErrorCode: error.status
          }));
        } else if (data?.session) {
          console.log("Method 1 successful, session established");
          handleSuccessfulAuth(data.session);
          return true;
        }
      } catch (err1) {
        console.error("Exception with Method 1:", err1);
        setDebugInfo(prev => ({
          ...prev,
          method1Exception: err1 instanceof Error ? err1.message : String(err1)
        }));
      }
      
      // Method 2: If hash contains tokens, try setSession directly
      if (hasAuthInHash) {
        console.log("Method 2: Using hash parameters directly");
        try {
          // Parse hash params
          const hashParams = new URLSearchParams(hash.substring(1));
          const accessToken = hashParams.get('access_token');
          const refreshToken = hashParams.get('refresh_token');
          
          if (accessToken && refreshToken) {
            console.log("Found tokens in hash, trying setSession");
            const { error: setSessionError } = await supabase.auth.setSession({
              access_token: accessToken,
              refresh_token: refreshToken
            });
            
            if (setSessionError) {
              console.error("Error with Method 2:", setSessionError);
              setDebugInfo(prev => ({
                ...prev,
                method2Error: setSessionError.message,
                method2ErrorCode: setSessionError.status
              }));
            } else {
              // Check if we got a valid session
              const { data: sessionData } = await supabase.auth.getSession();
              if (sessionData.session) {
                console.log("Method 2 successful, session established");
                handleSuccessfulAuth(sessionData.session);
                return true;
              }
            }
          }
        } catch (err2) {
          console.error("Exception with Method 2:", err2);
          setDebugInfo(prev => ({
            ...prev,
            method2Exception: err2 instanceof Error ? err2.message : String(err2)
          }));
        }
      }
      
      // Method 3: As a last resort, try getSession to see if auth was already processed
      console.log("Method 3: Checking if session already exists");
      try {
        const { data: sessionCheck } = await supabase.auth.getSession();
        if (sessionCheck.session) {
          console.log("Method 3 successful, session already exists");
          handleSuccessfulAuth(sessionCheck.session);
          return true;
        }
      } catch (err3) {
        console.error("Exception with Method 3:", err3);
        setDebugInfo(prev => ({
          ...prev,
          method3Exception: err3 instanceof Error ? err3.message : String(err3)
          
        }));
      }
      
      // If we reached here, all methods failed
      console.error("All authentication methods failed");
      setIsProcessingAuth(false);
      return false;
    } catch (err) {
      console.error("Unexpected error processing authentication:", err);
      setDebugInfo(prev => ({
        ...prev,
        finalError: err instanceof Error ? err.message : String(err)
      }));
      setIsProcessingAuth(false);
      return false;
    }
  }, []);

  // Helper function for successful authentication
  const handleSuccessfulAuth = (session: any) => {
    console.log("Authentication successful, user logged in:", session.user.email);
    
    // Store authentication data
    localStorage.setItem('birthPlanLoggedIn', 'true');
    localStorage.setItem('birthPlanEmail', session.user.email || '');
    
    // Ensure user is in database
    supabase
      .from('users_db_birthplanbuilder')
      .upsert({ 
        email: session.user.email 
      }, { 
        onConflict: 'email' 
      })
      .then(({ error: dbError }) => {
        if (dbError) {
          console.error("Error adding user to database:", dbError);
        }
        
        toast.success("Login realizado com sucesso!");
        
        // Redirect to criar-plano page
        setTimeout(() => {
          window.location.href = '/criar-plano';
        }, 1000);
      });
  };

  return {
    isProcessingAuth,
    debugInfo,
    processAuth,
    setIsProcessingAuth
  };
}
