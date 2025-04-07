
import { BirthPlanBuilder } from "@/components/BirthPlan/BirthPlanBuilder";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { useAuth } from "@/contexts/AuthContext";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthLoadingState } from "@/components/BirthPlan/components/AuthLoadingState";
import { supabase } from "@/integrations/supabase/client";

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
      if (isAuthenticated && (user || session)) {
        console.log("Usuário já autenticado, mostrando conteúdo");
        setIsCheckingAuth(false);
        return;
      }
      
      // Se não há usuário ou sessão, tentar recuperar a sessão
      if (!user || !session) {
        // Verificar explicitamente a sessão com o Supabase
        console.log("Tentando obter sessão diretamente do Supabase...");
        const { data } = await supabase.auth.getSession();
        
        if (data.session) {
          console.log("Sessão encontrada no Supabase:", data.session.user?.email);
          // Atualizar o contexto de autenticação com a sessão encontrada
          await refreshSession();
          setIsCheckingAuth(false);
          return;
        }
        
        console.log("Sem sessão após verificação direta, redirecionando para login");
        navigate("/acesso-plano", { replace: true });
        return;
      }
      
      // Se chegou aqui, o usuário está autenticado
      console.log("Usuário autenticado:", user.email);
      setIsCheckingAuth(false);
    };
    
    checkAuth();
  }, [user, isLoading, session, navigate, refreshSession, isAuthenticated]);

  if (isLoading || isCheckingAuth) {
    return (
      <div className="min-h-screen flex flex-col bg-maternal-50">
        <Header />
        <AuthLoadingState isProcessingAuth={true} />
        <Footer />
      </div>
    );
  }

  // Se chegou até aqui, o usuário está autenticado
  return (
    <div className="min-h-screen flex flex-col bg-maternal-100">
      <Header />
      <main className="flex-grow">
        <div className="container mx-auto px-4 py-8">
          <BirthPlanBuilder />
        </div>
      </main>
      <Footer />
    </div>
  );
}
