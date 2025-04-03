
import { useEffect, useState } from 'react';
import { OnlineGuide } from '@/components/Guide/OnlineGuide';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigation } from '@/hooks/useNavigation';
import { Button } from '@/components/ui/button';
import { FileText } from 'lucide-react';
import { toast } from 'sonner';

export function GuiaOnline() {
  const { isAuthenticated, isLoading } = useAuth();
  const { navigateTo } = useNavigation();
  const [showAuthPrompt, setShowAuthPrompt] = useState(false);

  useEffect(() => {
    // Give auth a moment to initialize before showing auth prompt
    if (!isLoading) {
      console.log("Auth check for Guia Online:", { isAuthenticated });
      setShowAuthPrompt(!isAuthenticated);
    }
  }, [isAuthenticated, isLoading]);

  const handleLogin = () => {
    navigateTo('/acesso-plano');
    toast.info('Faça login para acessar o guia completo');
  };

  // Show loading state while checking auth
  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-grow flex items-center justify-center">
          <div className="text-center">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-maternal-500 border-r-transparent"></div>
            <p className="mt-4 text-maternal-800">Carregando...</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow">
        {showAuthPrompt ? (
          <div className="container mx-auto px-4 py-16">
            <div className="max-w-xl mx-auto bg-white rounded-lg shadow-md p-8 text-center">
              <h1 className="text-3xl font-bold mb-6 text-maternal-900">Guia Online</h1>
              <p className="text-lg mb-8 text-maternal-700">
                Para acessar o guia completo, por favor faça login com o email utilizado na compra do plano.
              </p>
              <Button 
                onClick={handleLogin}
                variant="birth-plan-builder"
                className="font-semibold"
              >
                <FileText className="mr-2 h-5 w-5" />
                Fazer Login para Acessar
              </Button>
            </div>
          </div>
        ) : (
          <OnlineGuide />
        )}
      </main>
      
      <Footer />
    </div>
  );
}
