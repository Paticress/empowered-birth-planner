
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { AuthLoadingState } from "@/components/BirthPlan/components/AuthLoadingState";
import { toast } from "sonner";
import { useAuthUrlDetection } from "@/hooks/auth/useAuthUrlDetection";
import { useAuthProcessor } from "@/hooks/auth/useAuthProcessor";

export function AuthCallback() {
  const [error, setError] = useState<string | null>(null);
  const [attemptCount, setAttemptCount] = useState(0);
  const navigate = useNavigate();
  const { getAuthUrlInfo } = useAuthUrlDetection();
  const { isProcessingAuth, processAuth, setIsProcessingAuth } = useAuthProcessor();

  useEffect(() => {
    console.log("AuthCallback: Processando autenticação");
    console.log("URL atual:", window.location.href);
    
    const handleAuth = async () => {
      // Get URL information
      const urlInfo = getAuthUrlInfo();
      
      console.log("Token location check:", {
        inHash: urlInfo.hasAuthInHash,
        inPath: urlInfo.hasAuthInPath,
        inUrl: urlInfo.hasAuthInUrl
      });

      // Process authentication
      setIsProcessingAuth(true);
      
      const success = await processAuth(urlInfo);
      
      if (!success) {
        console.error("Auth processing failed after trying multiple methods");
        setError("Falha na autenticação. O link pode ter expirado ou ser inválido.");
        setIsProcessingAuth(false);
      }
    };

    handleAuth();
  }, [navigate, getAuthUrlInfo, processAuth, setIsProcessingAuth, attemptCount]);

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
