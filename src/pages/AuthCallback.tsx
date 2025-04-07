
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { AuthLoadingState } from "@/components/BirthPlan/components/AuthLoadingState";
import { toast } from "sonner";

export function AuthCallback() {
  const [isProcessing, setIsProcessing] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    console.log("AuthCallback: Processando autenticação");
    console.log("URL atual:", window.location.href);

    const processAuth = async () => {
      try {
        // O Supabase irá automaticamente trocar o código na URL por uma sessão
        const { data, error } = await supabase.auth.exchangeCodeForSession(window.location.href);
        
        if (error) {
          console.error("Erro ao processar autenticação:", error);
          setError(error.message);
          toast.error("Erro ao processar autenticação");
          setIsProcessing(false);
          return;
        }
        
        if (data.session) {
          console.log("Autenticação bem-sucedida:", data.session.user.email);
          
          // Armazenar informações de login no localStorage como backup
          localStorage.setItem('birthPlanLoggedIn', 'true');
          localStorage.setItem('birthPlanEmail', data.session.user.email || '');
          
          toast.success("Login realizado com sucesso!");
          
          // Redirecionar para a página do plano de parto
          setTimeout(() => {
            navigate('/criar-plano', { replace: true });
          }, 1500);
        } else {
          console.log("Nenhuma sessão encontrada após o processamento");
          setError("Falha na autenticação. Por favor, tente novamente.");
          setIsProcessing(false);
        }
      } catch (err) {
        console.error("Erro inesperado durante autenticação:", err);
        setError(err instanceof Error ? err.message : "Erro inesperado");
        setIsProcessing(false);
      }
    };

    processAuth();
  }, [navigate]);

  return (
    <div className="min-h-screen flex flex-col bg-maternal-50">
      <Header />
      <main className="flex-grow">
        {isProcessing ? (
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
