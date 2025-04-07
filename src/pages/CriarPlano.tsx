
import { BirthPlanBuilder } from "@/components/BirthPlan/BirthPlanBuilder";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { useAuth } from "@/contexts/AuthContext";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthLoadingState } from "@/components/BirthPlan/components/AuthLoadingState";

export function CriarPlano() {
  const { user, isLoading, session, refreshSession } = useAuth();
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const navigate = useNavigate();

  // Verifica autenticação quando a página carrega
  useEffect(() => {
    const checkAuth = async () => {
      console.log("CriarPlano: Verificando autenticação");
      console.log("Status atual:", { 
        hasUser: !!user, 
        hasSession: !!session, 
        isLoading 
      });
      
      if (!isLoading && !user) {
        // Tentar atualizar a sessão antes de redirecionar
        console.log("Tentando atualizar sessão antes de redirecionar");
        const hasSession = await refreshSession();
        
        if (!hasSession) {
          console.log("Sem sessão após refresh, redirecionando para login");
          navigate("/acesso-plano", { replace: true });
          return;
        }
      }
      
      setIsCheckingAuth(false);
    };
    
    checkAuth();
  }, [user, isLoading, session, navigate, refreshSession]);

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
