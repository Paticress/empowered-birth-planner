
import { LoginPage } from "@/components/BirthPlan/LoginPage";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { useAuth } from "@/contexts/AuthContext";
import { useEffect, useState } from "react";
import { AuthLoadingState } from "@/components/BirthPlan/components/AuthLoadingState";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Skeleton } from "@/components/ui/skeleton";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

export function AcessoPlano() {
  const { user, isLoading, session, refreshSession, isAuthenticated } = useAuth();
  const [isProcessingAuth, setIsProcessingAuth] = useState(false);
  const navigate = useNavigate();
  
  // Debug logging
  useEffect(() => {
    console.log("AcessoPlano.tsx carregado.");
    console.log("🔍 URL atual:", window.location.href);
    console.log("Session status:", session ? "Active" : "None");
    console.log("User status:", user ? "Logged in" : "Not logged in");
    console.log("Authentication status:", isAuthenticated ? "Authenticated" : "Not authenticated");
  }, [session, user, isAuthenticated]);

  // Verifica se há um token de magic link na URL
  useEffect(() => {
    const checkForMagicLink = async () => {
      // Check for magic link token in URL (hash or query parameter)
      const hasAuthParams = 
        window.location.hash.includes('access_token=') || 
        window.location.search.includes('type=magiclink') ||
        window.location.search.includes('code=');
      
      if (hasAuthParams) {
        console.log("AcessoPlano: Detected magic link token in URL");
        setIsProcessingAuth(true);
        
        try {
          // Let Supabase process the token
          const { data, error } = await supabase.auth.getSession();
          
          if (error) {
            console.error("Error processing magic link:", error);
            toast.error("Erro ao processar link de acesso");
            setIsProcessingAuth(false);
            return;
          }
          
          if (data.session) {
            console.log("Magic link successfully processed:", data.session.user?.email);
            toast.success("Login realizado com sucesso!");
            
            // Store login information
            localStorage.setItem('birthPlanLoggedIn', 'true');
            localStorage.setItem('birthPlanEmail', data.session.user?.email || '');
            
            // Remove pending email from localStorage
            localStorage.removeItem('birthPlanEmailPending');
            
            // Check if user exists in database
            const email = data.session.user?.email;
            if (email) {
              const { data: userData, error: userError } = await supabase
                .from('users_db_birthplanbuilder')
                .select('email')
                .eq('email', email)
                .maybeSingle();
                
              if (userError) {
                console.error("Error checking user in database:", userError);
              } else if (!userData) {
                console.log("Adding user to database after magic link login");
                await supabase
                  .from('users_db_birthplanbuilder')
                  .insert({ email });
              }
            }
            
            // Clean URL
            window.history.replaceState({}, document.title, '/acesso-plano');
            
            // Redirect to dashboard or birth plan page
            setTimeout(() => {
              navigate('/criar-plano', { replace: true });
            }, 800);
          }
        } catch (error) {
          console.error("Exception processing magic link:", error);
          toast.error("Erro ao processar o link de acesso");
          setIsProcessingAuth(false);
        }
      }
    };
    
    checkForMagicLink();
  }, [navigate]);

  // Verifica a sessão ativamente quando a página carrega
  useEffect(() => {
    const checkAndRefreshSession = async () => {
      // Se estiver carregando, aguardar
      if (isLoading) {
        return;
      }
      
      // Se o usuário já está autenticado, redirecionar para criar-plano
      if (isAuthenticated) {
        console.log("AcessoPlano: Usuário já autenticado, redirecionando para criar-plano");
        
        // Pequeno atraso para garantir que o estado foi atualizado
        setTimeout(() => {
          navigate('/criar-plano', { replace: true });
        }, 100);
        
        return;
      }
      
      // Check explicitly for auth tokens in URL that might not have been processed yet
      const hasAuthParams = 
        window.location.hash.includes('access_token=') || 
        window.location.search.includes('code=') ||
        window.location.pathname.includes('access_token=');
      
      if (hasAuthParams) {
        console.log("AcessoPlano: Auth parameters detected in URL, waiting...");
        setIsProcessingAuth(true);
        // Add a slight delay to allow auth processing
        setTimeout(() => {
          setIsProcessingAuth(false);
        }, 2500);
        return;
      }
      
      // If we're not authenticated and there are no URL parameters, try a final recovery
      setIsProcessingAuth(true);
      
      try {
        // Verificar session diretamente com o Supabase
        const { data } = await supabase.auth.getSession();
        
        if (data.session) {
          console.log("Session found directly from Supabase:", data.session.user?.email);
          // Tentar atualizar o contexto com a sessão encontrada
          await refreshSession();
          
          // Give a moment for state to update
          setTimeout(() => {
            navigate('/criar-plano', { replace: true });
          }, 300);
        } else {
          console.log("No session found with direct check");
          
          // Check localStorage as last resort
          const isLoggedInLocally = localStorage.getItem('birthPlanLoggedIn') === 'true';
          const storedEmail = localStorage.getItem('birthPlanEmail');
          
          if (isLoggedInLocally && storedEmail) {
            console.log("Found login info in localStorage, attempting to restore session");
            const success = await refreshSession();
            
            if (success) {
              setTimeout(() => {
                navigate('/criar-plano', { replace: true });
              }, 300);
              return;
            }
          }
          
          setIsProcessingAuth(false);
        }
      } catch (error) {
        console.error("Error during session check:", error);
        setIsProcessingAuth(false);
      }
    };
    
    // Pequeno atraso para garantir que o AuthContext tenha sido inicializado
    const timer = setTimeout(() => {
      checkAndRefreshSession();
    }, 300);
    
    return () => clearTimeout(timer);
  }, [user, session, isLoading, refreshSession, navigate, isAuthenticated]);

  if (isLoading || isProcessingAuth) {
    return (
      <div className="min-h-screen flex flex-col bg-maternal-50">
        <Header />
        <main className="flex-grow flex items-center justify-center">
          <div className="text-center bg-white p-8 rounded-lg shadow-md">
            <Loader2 className="h-12 w-12 animate-spin text-maternal-500 mx-auto" />
            <p className="mt-4 text-lg font-medium text-maternal-800">
              {isProcessingAuth ? "Processando autenticação..." : "Verificando seu acesso..."}
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

  // Se chegou aqui, o usuário não está autenticado e não está processando auth
  return (
    <div className="min-h-screen flex flex-col bg-maternal-50">
      <Header />
      <main className="flex-grow">
        <div className="container mx-auto px-4 py-8">
          <LoginPage />
        </div>
      </main>
      <Footer />
    </div>
  );
}
