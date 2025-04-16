
import { BirthPlanBuilder } from "@/components/BirthPlan/BirthPlanBuilder";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { useAuth } from "@/contexts/AuthContext";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, RefreshCw } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { useBirthPlanAccess } from "@/hooks/useBirthPlanAccess";

export function CriarPlano() {
  const { user, isLoading, session, refreshSession, isAuthenticated } = useAuth();
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const navigate = useNavigate();
  const { hasBirthPlanAccess, refreshPlanStatus, isRefreshing } = useBirthPlanAccess();

  // Check authentication when the page loads
  useEffect(() => {
    const checkAuth = async () => {
      console.log("CriarPlano: Verificando autenticação");
      console.log("Status atual:", { 
        hasUser: !!user, 
        hasSession: !!session, 
        isLoading,
        isAuthenticated 
      });
      
      // If still loading, wait
      if (isLoading) {
        console.log("Aguardando carregamento da autenticação...");
        return;
      }
      
      // If the user is already authenticated, we can proceed to check access
      if (isAuthenticated) {
        console.log("Usuário já autenticado, verificando acesso");
        setIsCheckingAuth(false);
        return;
      }
      
      // Final attempt to recover the session if not yet authenticated
      if (!isAuthenticated) {
        console.log("Tentando recuperar sessão diretamente...");
        
        try {
          // Explicitly check the session with Supabase
          const { data } = await supabase.auth.getSession();
          
          if (data.session) {
            console.log("Sessão encontrada no Supabase:", data.session.user?.email);
            // Update the authentication context with the found session
            const success = await refreshSession();
            
            if (success) {
              console.log("Sessão recuperada com sucesso");
              setIsCheckingAuth(false);
              return;
            }
          }
          
          console.log("Sem sessão após verificação direta, redirecionando para login");
          navigate("/acesso-plano", { replace: true });
        } catch (error) {
          console.error("Erro ao verificar sessão:", error);
          navigate("/acesso-plano", { replace: true });
        }
      }
      
      setIsCheckingAuth(false);
    };
    
    // Add a small delay to ensure the AuthContext has time to initialize
    // This prevents incorrect redirects when there's a valid session
    const timer = setTimeout(() => {
      checkAuth();
    }, 300);
    
    return () => clearTimeout(timer);
  }, [user, isLoading, session, navigate, refreshSession, isAuthenticated]);

  // Effect to redirect if user doesn't have birth plan access
  useEffect(() => {
    // Only run this check after auth check is complete and we're not still loading access status
    if (!isCheckingAuth && hasBirthPlanAccess === false) {
      console.log("Usuário não tem acesso ao plano de parto, redirecionando para site Wix");
      toast.error("Você não tem acesso ao construtor de plano de parto");
      
      // Redirect to Wix conversion page after a short delay
      const timer = setTimeout(() => {
        window.location.href = "https://www.energiamaterna.com.br/criar-meu-plano-de-parto-em-minutos";
      }, 1500);
      
      return () => clearTimeout(timer);
    }
  }, [hasBirthPlanAccess, isCheckingAuth, navigate]);

  const handleRefreshAccess = () => {
    refreshPlanStatus().then(() => {
      const currentPlan = localStorage.getItem('user_plan');
      if (currentPlan === 'paid') {
        toast.success("Acesso verificado com sucesso! Recarregando página...");
        setTimeout(() => window.location.reload(), 1500);
      } else {
        toast.error("Você ainda não tem acesso ao construtor de plano de parto");
        // Redirect to Wix conversion page after a short delay
        setTimeout(() => {
          window.location.href = "https://www.energiamaterna.com.br/criar-meu-plano-de-parto-em-minutos";
        }, 1500);
      }
    });
  };

  if (isLoading || isCheckingAuth || hasBirthPlanAccess === null) {
    return (
      <div className="min-h-screen flex flex-col bg-maternal-50">
        <Header />
        <main className="flex-grow flex items-center justify-center pt-20">
          <div className="text-center bg-white p-8 rounded-lg shadow-md">
            <Loader2 className="h-12 w-12 animate-spin text-maternal-500 mx-auto" />
            <p className="mt-4 text-lg font-medium text-maternal-800">
              {isCheckingAuth ? "Verificando seu acesso..." : "Carregando construtor de plano..."}
            </p>
            <p className="mt-2 text-sm text-maternal-600">
              Aguarde um momento, estamos preparando tudo para você.
            </p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  // If access is denied (hasBirthPlanAccess is false), show access denied screen with refresh option
  if (hasBirthPlanAccess === false) {
    return (
      <div className="min-h-screen flex flex-col bg-maternal-50">
        <Header />
        <main className="flex-grow flex items-center justify-center pt-20">
          <div className="text-center bg-white p-8 rounded-lg shadow-md max-w-md">
            <div className="h-16 w-16 mx-auto bg-red-100 rounded-full flex items-center justify-center mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-maternal-900 mb-2">Acesso Restrito</h2>
            <p className="text-maternal-700 mb-6">
              Você não tem acesso ao construtor de plano de parto. Para acessar, adquira o plano premium.
            </p>
            <p className="text-maternal-600 text-sm mb-4">
              Já comprou o acesso e está vendo esta mensagem? Clique no botão abaixo para verificar seu status.
            </p>
            <div className="flex flex-col space-y-3">
              <Button
                onClick={handleRefreshAccess}
                disabled={isRefreshing}
                className="w-full"
              >
                {isRefreshing ? (
                  <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  <RefreshCw className="h-4 w-4 mr-2" />
                )}
                {isRefreshing ? "Verificando..." : "Verificar Meu Acesso"}
              </Button>
              <Button
                variant="outline"
                onClick={() => window.location.href = "https://www.energiamaterna.com.br/criar-meu-plano-de-parto-em-minutos"}
                className="w-full"
              >
                Adquirir Acesso Premium
              </Button>
              <Button
                variant="link"
                onClick={() => navigate("/dashboard")}
                className="w-full"
              >
                Voltar para o Dashboard
              </Button>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  // If we got here, the user is authenticated and has access
  return (
    <div className="min-h-screen flex flex-col bg-maternal-100">
      <Header />
      <main className="flex-grow pt-20">
        <div className="container mx-auto px-4 py-8">
          <BirthPlanBuilder />
        </div>
      </main>
      <Footer />
    </div>
  );
}
