
import { MagicLinkForm } from '../forms/MagicLinkForm';
import { useLoginForm } from '../hooks/useLoginForm';
import { useEffect } from 'react';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigation } from '@/hooks/useNavigation';

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
  const { navigateTo } = useNavigation();

  // Check for magic link authentication in URL
  useEffect(() => {
    // Check both hash fragments and query parameters for auth tokens
    const hash = window.location.hash;
    const search = window.location.search;
    const hasAuthParams = 
      (hash && (hash.includes('access_token=') || hash.includes('type=recovery'))) || 
      (search && search.includes('access_token='));
    
    if (hasAuthParams) {
      console.log("Magic link authentication detected in tab", {
        hash: hash ? 'present' : 'absent',
        search: search ? 'present' : 'absent'
      });
      setIsMagicLinkSent(true);
      toast.info("Processando sua autenticação...");
      
      // No need to redirect here - let the AcessoPlano component handle this
      // This prevents duplicate redirects that could cause loops
    }
  }, [setIsMagicLinkSent]);

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
