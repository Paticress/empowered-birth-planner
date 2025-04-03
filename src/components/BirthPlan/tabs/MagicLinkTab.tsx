
import { MagicLinkForm } from '../forms/MagicLinkForm';
import { useLoginForm } from '../hooks/useLoginForm';
import { useEffect } from 'react';
import { toast } from 'sonner';

export function MagicLinkTab() {
  const {
    magicLinkEmail,
    isLoading,
    isMagicLinkSent,
    setMagicLinkEmail,
    setIsMagicLinkSent,
    handleMagicLinkSubmit
  } = useLoginForm();

  // Check for magic link authentication in URL
  useEffect(() => {
    const hash = window.location.hash;
    const hasAuthParams = hash && hash.includes('access_token');
    
    if (hasAuthParams) {
      console.log("Magic link authentication detected in tab");
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
