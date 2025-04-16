
import { useEffect, useState } from 'react';
import { OnlineGuide } from '@/components/Guide/OnlineGuide';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigation } from '@/hooks/useNavigation';
import { Button } from '@/components/ui/button';
import { Mail, RefreshCw } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { useLocation } from 'react-router-dom';

export function GuiaOnline() {
  const { isAuthenticated, isLoading, user } = useAuth();
  const { navigateTo } = useNavigation();
  const [showAuthPrompt, setShowAuthPrompt] = useState(false);
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [checkingAccess, setCheckingAccess] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const location = useLocation();

  useEffect(() => {
    // Don't do anything while still loading auth state
    if (isLoading) {
      console.log("GuiaOnline: Still loading auth state, waiting...");
      return;
    }
    
    console.log("GuiaOnline: Auth check running with:", { 
      isAuthenticated, 
      email: user?.email || localStorage.getItem('birthPlanEmail'),
      queryParams: location.search
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
          .select('email, plan')
          .eq('email', userEmail)
          .maybeSingle();
          
        if (error) {
          console.error("GuiaOnline: Error checking user access:", error);
          setShowAuthPrompt(true);
          setCheckingAccess(false);
          return;
        }
        
        if (data) {
          console.log("GuiaOnline: User authorized for guide:", userEmail, "with plan:", data.plan);
          setIsAuthorized(true);
          setShowAuthPrompt(false);
          
          // Store the user plan in localStorage for easy access
          localStorage.setItem('user_plan', data.plan);
          localStorage.setItem('user_plan_checked_at', Date.now().toString());
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
    
  }, [isAuthenticated, user, isLoading, location.search]);

  const handleRefreshAccess = async () => {
    if (isRefreshing) return;
    
    setIsRefreshing(true);
    
    try {
      // Get the email from multiple sources for reliability
      const userEmail = user?.email || localStorage.getItem('birthPlanEmail');
      
      if (!userEmail) {
        toast.error("Não foi possível identificar seu email");
        return;
      }
      
      // Force-check the database for the latest plan status
      const { data, error } = await supabase
        .from('users_db_birthplanbuilder')
        .select('email, plan')
        .eq('email', userEmail)
        .maybeSingle();
        
      if (error) {
        console.error("Error refreshing access:", error);
        toast.error("Erro ao verificar acesso");
        return;
      }
      
      if (data) {
        // Update localStorage with the latest data
        localStorage.setItem('user_plan', data.plan);
        localStorage.setItem('user_plan_checked_at', Date.now().toString());
        
        setIsAuthorized(true);
        setShowAuthPrompt(false);
        toast.success("Acesso verificado com sucesso!");
      } else {
        // Try to add the user to the database as they are authenticated
        const { error: insertError } = await supabase
          .from('users_db_birthplanbuilder')
          .insert({ email: userEmail });
          
        if (insertError) {
          console.error("Error adding user to database:", insertError);
          toast.error("Erro ao adicionar usuário");
        } else {
          console.log("Added user to database:", userEmail);
          localStorage.setItem('user_plan', 'free');
          localStorage.setItem('user_plan_checked_at', Date.now().toString());
          setIsAuthorized(true);
          setShowAuthPrompt(false);
          toast.success("Acesso concedido");
        }
      }
    } catch (error) {
      console.error("Unexpected error during refresh:", error);
      toast.error("Erro inesperado ao verificar acesso");
    } finally {
      setIsRefreshing(false);
    }
  };

  const handleLogin = () => {
    // Add parameter indicating redirection from guide
    navigateTo('/acesso-plano?from=guide');
    toast.info('Enviaremos um link de acesso ao guia completo');
  };

  // Show loading state while checking auth
  if (isLoading || checkingAccess) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-maternal-500 border-r-transparent"></div>
          <p className="mt-4 text-maternal-800">Carregando...</p>
        </div>
      </div>
    );
  }

  return (
    <>
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
                className="font-semibold mb-4"
              >
                <Mail className="mr-2 h-5 w-5" />
                Receber Link de Acesso
              </Button>
              
              {isAuthenticated && (
                <div className="mt-4">
                  <p className="text-sm text-maternal-600 mb-2">
                    Já tem acesso mas está vendo esta mensagem?
                  </p>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleRefreshAccess}
                    disabled={isRefreshing}
                    className="text-sm"
                  >
                    {isRefreshing ? (
                      <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                      <RefreshCw className="mr-2 h-4 w-4" />
                    )}
                    {isRefreshing ? "Verificando..." : "Verificar Meu Acesso"}
                  </Button>
                </div>
              )}
            </div>
          </div>
        ) : (
          <OnlineGuide />
        )}
      </main>
    </>
  );
}
