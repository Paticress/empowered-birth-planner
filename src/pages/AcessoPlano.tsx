
import { LoginPage } from "@/components/BirthPlan/LoginPage";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { useAuth } from "@/contexts/AuthContext";
import { useEffect, useState } from "react";
import { AuthLoadingState } from "@/components/BirthPlan/components/AuthLoadingState";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

export function AcessoPlano() {
  const { user, isLoading, session, refreshSession } = useAuth();
  const [isProcessingAuth, setIsProcessingAuth] = useState(false);
  const navigate = useNavigate();
  
  // Debug logging
  useEffect(() => {
    console.log("AcessoPlano.tsx carregado.");
    console.log("🔍 URL atual:", window.location.href);
    console.log("Session status:", session ? "Active" : "None");
    console.log("User status:", user ? "Logged in" : "Not logged in");
  }, [session, user]);

  // Verifica a sessão ativamente quando a página carrega
  useEffect(() => {
    const checkAndRefreshSession = async () => {
      // Se estiver carregando, aguardar
      if (isLoading) {
        return;
      }
      
      // Se não tiver usuário nem sessão, verificar com o Supabase diretamente
      if (!user && !session) {
        console.log("No user detected, checking session with Supabase directly");
        setIsProcessingAuth(true);
        
        // Verificar session diretamente com o Supabase
        const { data } = await supabase.auth.getSession();
        
        if (data.session) {
          console.log("Session found directly from Supabase:", data.session.user?.email);
          // Tentar atualizar o contexto com a sessão encontrada
          await refreshSession();
          setIsProcessingAuth(false);
        } else {
          console.log("No session found with direct check");
          setIsProcessingAuth(false);
        }
      }
    };
    
    checkAndRefreshSession();
  }, [user, session, isLoading, refreshSession]);

  // Redirect if already authenticated
  useEffect(() => {
    // Não redirecionar se ainda estiver carregando ou processando
    if (isLoading || isProcessingAuth) {
      return;
    }
    
    // Redirecionar se tiver usuário ou sessão
    if (user || session) {
      console.log("AcessoPlano: User authenticated, redirecting to birth plan builder");
      
      // Pequeno delay para garantir que todos os estados sejam atualizados
      setTimeout(() => {
        navigate('/criar-plano', { replace: true });
      }, 300);
    }
  }, [user, isLoading, session, navigate, isProcessingAuth]);

  if (isLoading || isProcessingAuth) {
    return (
      <div className="min-h-screen flex flex-col bg-maternal-50">
        <Header />
        <AuthLoadingState isProcessingAuth={isProcessingAuth} />
        <Footer />
      </div>
    );
  }

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
