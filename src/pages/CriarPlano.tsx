
import { BirthPlanBuilder } from "@/components/BirthPlan/BirthPlanBuilder";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { useAuth } from "@/contexts/AuthContext";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Loader2 } from "lucide-react";

export function CriarPlano() {
  const { user, isLoading, session, refreshSession, isAuthenticated } = useAuth();
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const navigate = useNavigate();

  // Verifica autenticação quando a página carrega
  useEffect(() => {
    const checkAuth = async () => {
      console.log("CriarPlano: Verificando autenticação");
      console.log("Status atual:", { 
        hasUser: !!user, 
        hasSession: !!session, 
        isLoading,
        isAuthenticated 
      });
      
      // Se ainda estiver carregando, aguardar
      if (isLoading) {
        console.log("Aguardando carregamento da autenticação...");
        return;
      }
      
      // Se o usuário já está autenticado, podemos mostrar o conteúdo
      if (isAuthenticated) {
        console.log("Usuário já autenticado, mostrando conteúdo");
        setIsCheckingAuth(false);
        return;
      }
      
      // Tentativa final de recuperar a sessão se ainda não estiver autenticado
      if (!isAuthenticated) {
        console.log("Tentando recuperar sessão diretamente...");
        
        try {
          // Verificar explicitamente a sessão com o Supabase
          const { data } = await supabase.auth.getSession();
          
          if (data.session) {
            console.log("Sessão encontrada no Supabase:", data.session.user?.email);
            // Atualizar o contexto de autenticação com a sessão encontrada
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
    
    // Adicionar um pequeno atraso para garantir que o AuthContext tenha tempo de inicializar
    // Isso evita redirecionamentos incorretos quando há uma sessão válida
    const timer = setTimeout(() => {
      checkAuth();
    }, 300);
    
    return () => clearTimeout(timer);
  }, [user, isLoading, session, navigate, refreshSession, isAuthenticated]);

  if (isLoading || isCheckingAuth) {
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

  // Se chegou até aqui, o usuário está autenticado
  return (
    <div className="min-h-screen flex flex-col bg-maternal-100">
      <Header />
      <main className="flex-grow pt-40"> {/* Increased top padding to accommodate fixed headers */}
        <div className="container mx-auto px-4 py-8">
          <BirthPlanBuilder />
        </div>
      </main>
      <Footer />
    </div>
  );
}
