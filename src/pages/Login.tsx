
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { Card, CardContent } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';

export function Login() {
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Processa autenticação assim que a página carrega
    const processAuth = async () => {
      console.log("Login page loaded, checking for auth tokens");
      console.log("Current URL:", window.location.href);
      
      // Check for auth token in URL
      const hasAuthInHash = window.location.hash && window.location.hash.includes('access_token=');
      const hasAuthInSearch = window.location.search && 
                             (window.location.search.includes('access_token=') || 
                              window.location.search.includes('code='));
      
      if (!hasAuthInHash && !hasAuthInSearch) {
        console.log("No auth tokens found in URL, redirecting to acesso-plano");
        navigate('/acesso-plano', { replace: true });
        return;
      }
      
      // Processar autenticação
      setIsProcessing(true);
      toast.loading("Processando autenticação...");
      
      try {
        console.log("Processing authentication from URL");
        
        // Exchange the code/token for a session
        const { data, error } = await supabase.auth.exchangeCodeForSession(window.location.href);
        
        if (error) {
          console.error("Error processing authentication:", error);
          setError(error.message);
          toast.error("Erro ao processar autenticação: " + error.message);
          setIsProcessing(false);
          return;
        }
        
        if (data?.session) {
          console.log("Authentication successful, user logged in:", data.session.user.email);
          
          // Store authentication data
          localStorage.setItem('birthPlanLoggedIn', 'true');
          localStorage.setItem('birthPlanEmail', data.session.user.email || '');
          
          // Ensure user is in database
          const { error: dbError } = await supabase
            .from('users_db_birthplanbuilder')
            .upsert({ 
              email: data.session.user.email 
            }, { 
              onConflict: 'email' 
            });
            
          if (dbError) {
            console.error("Error adding user to database:", dbError);
          }
          
          toast.success("Login realizado com sucesso!");
          
          // Redirect to criar-plano page
          setTimeout(() => {
            navigate('/criar-plano', { replace: true });
          }, 1000);
        } else {
          console.error("No session returned after processing auth");
          setError("Falha ao estabelecer sessão de usuário");
          toast.error("Falha ao estabelecer sessão de usuário");
          setIsProcessing(false);
        }
      } catch (err) {
        console.error("Unexpected error processing authentication:", err);
        setError(err instanceof Error ? err.message : "Erro inesperado");
        toast.error("Erro durante processamento da autenticação");
        setIsProcessing(false);
      }
    };
    
    processAuth();
  }, [navigate]);

  return (
    <div className="min-h-screen flex flex-col bg-maternal-50">
      <Header />
      <main className="flex-grow flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6 pb-6">
            {isProcessing ? (
              <div className="text-center py-8">
                <Loader2 className="h-12 w-12 mx-auto animate-spin text-maternal-600 mb-4" />
                <h2 className="text-xl font-semibold text-maternal-800 mb-2">
                  Processando autenticação...
                </h2>
                <p className="text-maternal-600">
                  Por favor, aguarde enquanto validamos seu acesso.
                </p>
              </div>
            ) : error ? (
              <div className="text-center py-8">
                <div className="bg-red-100 text-red-800 p-4 rounded-lg mb-4">
                  <h3 className="font-medium">Erro na autenticação</h3>
                  <p className="mt-1">{error}</p>
                </div>
                <p className="mb-4">
                  O link de acesso pode ter expirado ou ser inválido.
                </p>
                <button 
                  onClick={() => navigate('/acesso-plano')}
                  className="bg-maternal-600 hover:bg-maternal-700 text-white py-2 px-4 rounded"
                >
                  Voltar para página de acesso
                </button>
              </div>
            ) : (
              <div className="text-center py-8">
                <Loader2 className="h-12 w-12 mx-auto animate-spin text-maternal-600 mb-4" />
                <p>Redirecionando...</p>
              </div>
            )}
          </CardContent>
        </Card>
      </main>
      <Footer />
    </div>
  );
}
