
import { MagicLinkForm } from '../forms/MagicLinkForm';
import { useLoginForm } from '../hooks/useLoginForm';
import { useEffect, useState } from 'react';
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
  const [isProcessingToken, setIsProcessingToken] = useState(false);

  // Enhanced magic link detection with support for custom domains
  useEffect(() => {
    const checkAuth = async () => {
      // We only need to check if the user hasn't been authenticated yet 
      // and we're not already showing the "link sent" message
      if (isAuthenticated || isMagicLinkSent || isProcessingToken) {
        return;
      }
      
      // Check for auth token in hash
      const hash = window.location.hash;
      const hasAuthParams = hash && hash.includes('access_token=');
      
      if (hasAuthParams) {
        console.log("MagicLinkTab: Magic link parameters detected in URL");
        
        // Update the UI state to show that we've received the magic link
        setIsMagicLinkSent(true);
        setIsProcessingToken(true);
        
        try {
          // Use Supabase's updated method to handle the URL
          const { data, error } = await supabase.auth.exchangeCodeForSession(window.location.hash);
          
          if (error) {
            console.error("MagicLinkTab: Error processing auth token:", error);
            toast.error("Erro ao processar autenticação: " + error.message);
            setIsProcessingToken(false);
            return;
          }
          
          if (data.session) {
            console.log("MagicLinkTab: Valid session created:", data.session.user.email);
            toast.success("Autenticação realizada com sucesso!");
            
            // After successful login, redirect to criar-plano
            setTimeout(() => {
              window.location.href = '/criar-plano';
            }, 1500);
          } else {
            console.log("MagicLinkTab: No session returned from exchangeCodeForSession");
            toast.error("Falha na autenticação. Por favor, tente novamente.");
            setIsProcessingToken(false);
          }
        } catch (err) {
          console.error("MagicLinkTab: Error processing authentication:", err);
          toast.error("Erro ao processar autenticação");
          setIsProcessingToken(false);
        }
      }
    };
    
    // Run the check with a slight delay to avoid interference with other effects
    setTimeout(checkAuth, 500);
  }, [isAuthenticated, isMagicLinkSent, setIsMagicLinkSent, isProcessingToken]);

  return (
    <MagicLinkForm 
      magicLinkEmail={magicLinkEmail}
      setMagicLinkEmail={setMagicLinkEmail}
      isLoading={isLoading || isProcessingToken}
      isMagicLinkSent={isMagicLinkSent}
      setIsMagicLinkSent={setIsMagicLinkSent}
      handleMagicLinkSubmit={handleMagicLinkSubmit}
    />
  );
}
