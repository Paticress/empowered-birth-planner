
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

  // Enhanced magic link detection
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
      
      // Log for debugging
      console.log("MagicLinkTab: Checking for auth in URL", {
        hashPresent: hash ? (hash.includes('access_token') ? 'contains-token' : true) : false,
        searchPresent: search ? (search.includes('access_token') ? 'contains-token' : true) : false,
        urlContainsToken: fullUrl.includes('access_token=')
      });
      
      const hasAuthParams = 
        fullUrl.includes('access_token=') || 
        (hash && (hash.includes('access_token=') || hash.includes('type=recovery'))) || 
        (search && search.includes('access_token='));
      
      if (hasAuthParams) {
        console.log("MagicLinkTab: Magic link parameters detected in URL");
        
        // Update the UI state to show that we've received the magic link
        setIsMagicLinkSent(true);
        
        try {
          // Check if there's an active session already - we might need to wait for Supabase to process the token
          await new Promise(resolve => setTimeout(resolve, 800));
          const { data, error } = await supabase.auth.getSession();
          
          if (error) {
            console.error("MagicLinkTab: Error checking session:", error);
          } else if (data.session) {
            console.log("MagicLinkTab: Valid session found for", data.session.user.email);
            toast.success("Autenticação realizada com sucesso!");
          } else {
            console.log("MagicLinkTab: No session found, auth params present");
            toast.info("Processando sua autenticação...");
          }
        } catch (err) {
          console.error("MagicLinkTab: Error processing authentication:", err);
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
