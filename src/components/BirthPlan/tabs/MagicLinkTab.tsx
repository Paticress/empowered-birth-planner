
import { MagicLinkForm } from '../forms/MagicLinkForm';
import { useLoginForm } from '../hooks/useLoginForm';
import { useEffect } from 'react';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';

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

  // Check for magic link authentication in URL without redirecting
  useEffect(() => {
    // Check both hash fragments and query parameters for auth tokens
    const hash = window.location.hash;
    const search = window.location.search;
    const hasAuthParams = 
      (hash && (hash.includes('access_token=') || hash.includes('type=recovery'))) || 
      (search && search.includes('access_token='));
    
    if (hasAuthParams) {
      console.log("Magic link authentication detected in MagicLinkTab", {
        hash: hash ? 'present' : 'absent',
        search: search ? 'present' : 'absent'
      });
      
      // Just update the UI state to show that we've received the magic link
      // The actual auth processing happens in AcessoPlano component
      setIsMagicLinkSent(true);
      toast.info("Processando sua autenticação...");
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
