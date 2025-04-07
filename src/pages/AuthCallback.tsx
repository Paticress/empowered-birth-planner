
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { AuthLoadingState } from "@/components/BirthPlan/components/AuthLoadingState";
import { toast } from "sonner";
import { getSessionFromUrl } from "@/utils/auth/token";

export function AuthCallback() {
  const [error, setError] = useState<string | null>(null);
  const [isProcessingAuth, setIsProcessingAuth] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    console.log("AuthCallback: Processando autenticação");
    console.log("URL atual:", window.location.href);
    
    const processSessionFromUrl = async () => {
      setIsProcessingAuth(true);
      toast.loading("Processando autenticação...");
      
      try {
        // Use our updated utility function instead of getSessionFromUrl
        const { data, error } = await getSessionFromUrl();
        
        if (error) {
          console.error("Erro ao obter sessão da URL:", error);
          setError(`Falha na autenticação: ${error.message}`);
          toast.error("Erro ao processar link de acesso");
          setIsProcessingAuth(false);
          return;
        }
        
        if (data?.session) {
          console.log("Sessão obtida com sucesso em AuthCallback:", data.session.user?.email);
          toast.success("Login realizado com sucesso!");
          
          // Guardar email no localStorage como backup
          if (data.session.user?.email) {
            localStorage.setItem('birthPlanLoggedIn', 'true');
            localStorage.setItem('birthPlanEmail', data.session.user.email);
          }
          
          // Limpar a URL
          window.history.replaceState({}, document.title, '/');
          
          // Redirecionar para a página principal
          setTimeout(() => {
            navigate('/criar-plano', { replace: true });
          }, 1000);
          
          return;
        }
        
        // Se chegou aqui, não conseguiu processar a sessão
        console.log("Nenhuma sessão encontrada na URL");
        setError("Falha na autenticação. O link pode ter expirado ou ser inválido.");
        setIsProcessingAuth(false);
      } catch (err) {
        console.error("Exceção ao processar sessão da URL:", err);
        setError("Erro inesperado ao processar autenticação");
        toast.error("Erro ao processar link de acesso");
        setIsProcessingAuth(false);
      }
    };

    processSessionFromUrl();
  }, [navigate]);

  return (
    <div className="min-h-screen flex flex-col bg-maternal-50">
      <Header />
      <main className="flex-grow">
        {isProcessingAuth ? (
          <AuthLoadingState isProcessingAuth={true} />
        ) : error ? (
          <div className="container mx-auto px-4 py-8">
            <div className="mb-6 p-4 rounded-lg bg-red-50 border border-red-200 text-red-800">
              <h3 className="text-lg font-medium mb-2">Erro na autenticação</h3>
              <p className="mb-3">{error}</p>
              <p>O link de acesso pode ter expirado. Por favor, solicite um novo link de acesso.</p>
              <button 
                onClick={() => navigate('/acesso-plano')}
                className="mt-4 px-4 py-2 bg-maternal-600 text-white rounded hover:bg-maternal-700 transition-colors"
              >
                Voltar para página de acesso
              </button>
            </div>
          </div>
        ) : null}
      </main>
      <Footer />
    </div>
  );
}
