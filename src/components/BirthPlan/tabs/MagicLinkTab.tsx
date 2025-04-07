
import { MagicLinkForm } from '../forms/MagicLinkForm';
import { useLoginForm } from '../hooks/useLoginForm';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { cleanUrlAfterAuth, getSessionFromUrl } from '@/utils/auth/token';

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
  const [isLocalProcessing, setIsLocalProcessing] = useState(false);

  // Enhanced magic link detection
  useEffect(() => {
    const checkAuth = async () => {
      // We only need to check if the user hasn't been authenticated yet 
      // and we're not already showing the "link sent" message and not already processing auth
      if (isAuthenticated || isMagicLinkSent || isLocalProcessing) {
        return;
      }
      
      // Verifica se há hash ou token na URL para magic link
      const hasAuthInUrl = window.location.hash || 
                           window.location.href.includes('access_token=') || 
                           window.location.search.includes('code=') ||
                           window.location.search.includes('access_entry=magiclink');
      
      if (hasAuthInUrl) {
        console.log("MagicLinkTab: Magic link parameters detected in URL");
        
        // Update the UI state to show that we've received the magic link
        setIsMagicLinkSent(true);
        setIsLocalProcessing(true);
        
        // Show processing indicator
        toast.loading("Processando sua autenticação...");
        
        try {
          // Use our updated utility function instead of getSessionFromUrl
          const { data, error } = await getSessionFromUrl();
          
          if (error) {
            console.error("MagicLinkTab: Error processing auth code:", error);
            toast.error("Erro ao processar link de acesso: " + error.message);
            setIsLocalProcessing(false);
            // Clean up URL
            cleanUrlAfterAuth();
            return;
          }
          
          if (data?.session) {
            console.log("MagicLinkTab: Successfully authenticated via magic link");
            toast.success("Login realizado com sucesso!");
            
            // Store email in localStorage for backup
            localStorage.setItem('birthPlanLoggedIn', 'true');
            localStorage.setItem('birthPlanEmail', data.session.user.email || '');
            
            // Clean up URL
            cleanUrlAfterAuth();
            
            // Redirect to criar-plano
            setTimeout(() => {
              window.location.href = '/criar-plano';
            }, 1500);
          } else {
            console.log("MagicLinkTab: No session returned from auth process");
            toast.error("Falha ao processar autenticação. Tente novamente.");
            setIsLocalProcessing(false);
            // Clean up URL
            cleanUrlAfterAuth();
          }
        } catch (err) {
          console.error("MagicLinkTab: Exception during auth processing:", err);
          toast.error("Erro ao processar autenticação");
          setIsLocalProcessing(false);
          // Clean up URL
          cleanUrlAfterAuth();
        }
      }
    };
    
    // Run the check immediately
    checkAuth();
  }, [isAuthenticated, isMagicLinkSent, setIsMagicLinkSent, isLocalProcessing]);

  // Determine if we need to show the loading state
  const showLoading = isLoading || isLocalProcessing;
  
  // Text to display based on the current state
  const loadingText = isLocalProcessing 
    ? "Processando autenticação..." 
    : "Enviando link de acesso...";

  return (
    <MagicLinkForm 
      magicLinkEmail={magicLinkEmail}
      setMagicLinkEmail={setMagicLinkEmail}
      isLoading={showLoading}
      isMagicLinkSent={isMagicLinkSent}
      setIsMagicLinkSent={setIsMagicLinkSent}
      handleMagicLinkSubmit={handleMagicLinkSubmit}
      loadingText={loadingText}
    />
  );
}
