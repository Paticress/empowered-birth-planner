
import { BirthPlanBuilder } from "@/components/BirthPlan/BirthPlanBuilder";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { useAuth } from "@/contexts/AuthContext";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

export function CriarPlano() {
  const { user, isLoading, session, refreshSession, isAuthenticated } = useAuth();
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const [isCheckingAccess, setIsCheckingAccess] = useState(true);
  const [hasBirthPlanAccess, setHasBirthPlanAccess] = useState(false);
  const navigate = useNavigate();

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
        checkUserAccess();
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
              checkUserAccess();
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
    
    // Check if the authenticated user has access to the birth plan builder
    const checkUserAccess = async () => {
      const userEmail = user?.email || localStorage.getItem('birthPlanEmail');
      
      if (!userEmail) {
        console.log("Nenhum email de usuário encontrado, redirecionando para login");
        navigate("/acesso-plano", { replace: true });
        return;
      }
      
      try {
        console.log("Verificando acesso ao plano de parto para:", userEmail);
        
        const { data, error } = await supabase
          .from('users_db_birthplanbuilder')
          .select('has_birth_plan_access')
          .eq('email', userEmail)
          .maybeSingle();
          
        if (error) {
          console.error("Erro ao verificar acesso ao plano:", error);
          toast.error("Erro ao verificar seu acesso");
          navigate("/acesso-plano", { replace: true });
          return;
        }
        
        if (!data || data.has_birth_plan_access !== true) {
          console.log("Usuário não tem acesso ao plano de parto, redirecionando para site Wix");
          toast.error("Você não tem acesso ao construtor de plano de parto");
          
          // Redirect to Wix conversion page after a short delay
          setTimeout(() => {
            window.location.href = "https://www.energiamaterna.com.br/criar-meu-plano-de-parto-em-minutos";
          }, 1500);
          
          return;
        }
        
        console.log("Usuário tem acesso ao plano de parto");
        setHasBirthPlanAccess(true);
        setIsCheckingAccess(false);
        
      } catch (error) {
        console.error("Erro inesperado ao verificar acesso:", error);
        toast.error("Erro ao verificar seu acesso");
        navigate("/acesso-plano", { replace: true });
      }
    };
    
    // Add a small delay to ensure the AuthContext has time to initialize
    // This prevents incorrect redirects when there's a valid session
    const timer = setTimeout(() => {
      checkAuth();
    }, 300);
    
    return () => clearTimeout(timer);
  }, [user, isLoading, session, navigate, refreshSession, isAuthenticated]);

  if (isLoading || isCheckingAuth || isCheckingAccess) {
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
