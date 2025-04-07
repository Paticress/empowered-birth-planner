
import { MagicLinkForm } from '../forms/MagicLinkForm';
import { useLoginForm } from '../hooks/useLoginForm';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useAuthUrlHandler } from '@/hooks/useAuthUrlHandler';

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
  const { isProcessingAuth } = useAuthUrlHandler();
  const [isLocalProcessing, setIsLocalProcessing] = useState(false);

  // Enhanced magic link detection with support for both hash and query parameters
  useEffect(() => {
    const checkAuth = async () => {
      // We only need to check if the user hasn't been authenticated yet 
      // and we're not already showing the "link sent" message and not already processing auth
      if (isAuthenticated || isMagicLinkSent || isProcessingAuth || isLocalProcessing) {
        return;
      }
      
      // Check for auth token in hash or query parameters
      const hash = window.location.hash;
      const search = window.location.search;
      const hasAuthInHash = hash && hash.includes('access_token=');
      const hasAuthInQuery = search && 
                           (search.includes('access_token=') || 
                            search.includes('access_entry=magiclink'));
      
      if (hasAuthInHash || hasAuthInQuery) {
        console.log("MagicLinkTab: Magic link parameters detected in URL");
        console.log("URL format:", { 
          hasAuthInHash, 
          hasAuthInQuery,
          hash: hasAuthInHash ? hash.substring(0, 20) + '...' : 'none',
          search: hasAuthInQuery ? search.substring(0, 20) + '...' : 'none'
        });
        
        // Update the UI state to show that we've received the magic link
        setIsMagicLinkSent(true);
        setIsLocalProcessing(true);
        
        // Local processing is now handled by the auth processor
        // Just show a UI indicator
        toast.loading("Processando sua autenticação...");
      }
    };
    
    // Run the check immediately
    checkAuth();
  }, [isAuthenticated, isMagicLinkSent, setIsMagicLinkSent, isProcessingAuth, isLocalProcessing]);

  return (
    <MagicLinkForm 
      magicLinkEmail={magicLinkEmail}
      setMagicLinkEmail={setMagicLinkEmail}
      isLoading={isLoading || isProcessingAuth || isLocalProcessing}
      isMagicLinkSent={isMagicLinkSent}
      setIsMagicLinkSent={setIsMagicLinkSent}
      handleMagicLinkSubmit={handleMagicLinkSubmit}
    />
  );
}
