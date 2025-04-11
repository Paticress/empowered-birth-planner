
import { useEffect, useState } from 'react';
import { OnlineGuide } from '@/components/Guide/OnlineGuide';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigation } from '@/hooks/useNavigation';
import { Button } from '@/components/ui/button';
import { FileText, Mail } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

export function GuiaOnline() {
  const { isAuthenticated, isLoading, user } = useAuth();
  const { navigateTo } = useNavigation();
  const [showAuthPrompt, setShowAuthPrompt] = useState(false);
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [checkingAccess, setCheckingAccess] = useState(true);

  useEffect(() => {
    // Don't do anything while still loading auth state
    if (isLoading) {
      console.log("GuiaOnline: Still loading auth state, waiting...");
      return;
    }
    
    console.log("GuiaOnline: Auth check running with:", { 
      isAuthenticated, 
      email: user?.email || localStorage.getItem('birthPlanEmail')
    });
    
    const checkAccess = async () => {
      // If user is not authenticated, show auth prompt
      if (!isAuthenticated) {
        console.log("GuiaOnline: User not authenticated, showing auth prompt");
        setShowAuthPrompt(true);
        setCheckingAccess(false);
        return;
      }
      
      // Get the email from multiple sources for reliability
      const userEmail = user?.email || localStorage.getItem('birthPlanEmail');
      
      if (!userEmail) {
        console.log("GuiaOnline: No user email found, showing auth prompt");
        setShowAuthPrompt(true);
        setCheckingAccess(false);
        return;
      }
      
      try {
        // Check if the user is in the authorized users table
        const { data, error } = await supabase
          .from('users_db_birthplanbuilder')
          .select('email')
          .eq('email', userEmail)
          .maybeSingle();
          
        if (error) {
          console.error("GuiaOnline: Error checking user access:", error);
          setShowAuthPrompt(true);
          setCheckingAccess(false);
          return;
        }
        
        if (data) {
          console.log("GuiaOnline: User authorized for guide:", userEmail);
          setIsAuthorized(true);
          setShowAuthPrompt(false);
        } else {
          console.log("GuiaOnline: User not found in database, showing auth prompt");
          setShowAuthPrompt(true);
        }
        
        setCheckingAccess(false);
      } catch (error) {
        console.error("GuiaOnline: Unexpected error during access check:", error);
        setShowAuthPrompt(true);
        setCheckingAccess(false);
      }
    };
    
    checkAccess();
    
  }, [isAuthenticated, user, isLoading]);

  const handleLogin = () => {
    // Add parameter indicating redirection from guide
    navigateTo('/acesso-plano?from=guide');
    toast.info('Enviaremos um link de acesso ao guia completo');
  };

  // Show loading state while checking auth
  if (isLoading || checkingAccess) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-grow flex items-center justify-center">
          <div className="text-center">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-maternal-500 border-r-transparent"></div>
            <p className="mt-4 text-maternal-800">Carregando...</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow">
        {showAuthPrompt ? (
          <div className="container mx-auto px-4 py-16">
            <div className="max-w-xl mx-auto bg-white rounded-lg shadow-md p-8 text-center">
              <h1 className="text-3xl font-bold mb-6 text-maternal-900">Guia Online</h1>
              <p className="text-lg mb-8 text-maternal-700">
                Para acessar o guia completo, digite seu email e receba um link de acesso exclusivo.
              </p>
              <Button 
                onClick={handleLogin}
                variant="birth-plan-builder"
                className="font-semibold"
              >
                <Mail className="mr-2 h-5 w-5" />
                Receber Link de Acesso
              </Button>
            </div>
          </div>
        ) : (
          <OnlineGuide />
        )}
      </main>
      
      <Footer />
    </div>
  );
}
