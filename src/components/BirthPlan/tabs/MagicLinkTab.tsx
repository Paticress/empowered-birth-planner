
import { MagicLinkForm } from '../forms/MagicLinkForm';
import { useLoginForm } from '../hooks/useLoginForm';
import { useEffect } from 'react';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';

export function MagicLinkTab() {
  const {
    magicLinkEmail,
    isLoading,
    isMagicLinkSent,
    setMagicLinkEmail,
    setIsMagicLinkSent,
    handleMagicLinkSubmit
  } = useLoginForm();
  
  const { user, isAuthenticated } = useAuth();

  // Enhanced magic link detection with support for custom domains
  useEffect(() => {
    const checkAuth = async () => {
      // We only need to check if the user hasn't been authenticated yet 
      // and we're not already showing the "link sent" message
      if (isAuthenticated || isMagicLinkSent) {
        return;
      }
      
      // Check all possible locations for auth tokens
      const fullUrl = window.location.href;
      const hash = window.location.hash;
      const search = window.location.search;
      const path = window.location.pathname;
      const hostname = window.location.hostname;
      
      // Check if we're on a custom domain
      const isCustomDomain = hostname !== 'localhost' && 
                          !hostname.includes('.vercel.app') && 
                          !hostname.includes('.github.io');
      
      // Log for debugging
      console.log("MagicLinkTab: Checking for auth in URL", {
        path: path,
        hostname: hostname,
        isCustomDomain: isCustomDomain,
        hashPresent: hash ? (hash.includes('access_token') ? 'contains-token' : true) : false,
        searchPresent: search ? (search.includes('access_token') ? 'contains-token' : true) : false,
        urlContainsToken: fullUrl.includes('access_token=')
      });
      
      // More comprehensive token detection
      const hasAuthParams = 
        fullUrl.includes('access_token=') || 
        (hash && (hash.includes('access_token=') || hash.includes('type=recovery'))) || 
        (search && search.includes('access_token=')) ||
        (path && path.includes('access_token='));
      
      if (hasAuthParams) {
        console.log("MagicLinkTab: Magic link parameters detected in URL");
        
        // Update the UI state to show that we've received the magic link
        setIsMagicLinkSent(true);
        
        try {
          // On custom domains, we might need to help format the token
          if (isCustomDomain && path.includes('access_token=')) {
            console.log("MagicLinkTab: Custom domain with token in path detected");
            
            // Extract token part
            const tokenIndex = path.indexOf('access_token=');
            const tokenPart = path.substring(tokenIndex);
            
            // Update the URL to standard hash format that Supabase expects
            window.history.replaceState(
              null, 
              document.title,
              '/acesso-plano#' + tokenPart
            );
            
            // Set the hash manually to ensure it's detected
            window.location.hash = tokenPart;
            
            console.log("MagicLinkTab: URL reformatted for custom domain");
            
            // Give Supabase time to process the new hash format
            await new Promise(resolve => setTimeout(resolve, 800));
          }
          
          // Check if there's an active session already
          const { data, error } = await supabase.auth.getSession();
          
          if (error) {
            console.error("MagicLinkTab: Error checking session:", error);
            toast.error("Erro ao verificar sessão: " + error.message);
          } else if (data.session) {
            console.log("MagicLinkTab: Valid session found for", data.session.user.email);
            toast.success("Autenticação realizada com sucesso!");
            
            // After successful login, redirect to criar-plano
            setTimeout(() => {
              window.location.href = '/criar-plano';
            }, 1500);
          } else {
            console.log("MagicLinkTab: No session found, auth params present");
            toast.info("Processando sua autenticação...");
            
            // Check again after a delay - sometimes it takes time for Supabase to process
            setTimeout(async () => {
              const { data: delayedData } = await supabase.auth.getSession();
              if (delayedData.session) {
                toast.success("Autenticação realizada com sucesso!");
                setTimeout(() => {
                  window.location.href = '/criar-plano';
                }, 1000);
              }
            }, 2000);
          }
        } catch (err) {
          console.error("MagicLinkTab: Error processing authentication:", err);
          toast.error("Erro ao processar autenticação");
        }
      }
    };
    
    // Run the check with a slight delay to avoid interference with other effects
    setTimeout(checkAuth, 500);
  }, [isAuthenticated, isMagicLinkSent, setIsMagicLinkSent]);

  return (
    <MagicLinkForm 
      magicLinkEmail={magicLinkEmail}
      setMagicLinkEmail={setMagicLinkEmail}
      isLoading={isLoading}
      isMagicLinkSent={isMagicLinkSent}
      setIsMagicLinkSent={setIsMagicLinkSent}
      handleMagicLinkSubmit={handleMagicLinkSubmit}
    />
  );
}
