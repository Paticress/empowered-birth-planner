
import { useState, useEffect } from 'react';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigation } from '@/hooks/useNavigation';
import { FileText, Book, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

export function MyAccess() {
  const { user } = useAuth();
  const { navigateTo } = useNavigation();
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);

  // Check if user is logged in
  useEffect(() => {
    if (!user) {
      setShowLoginPrompt(true);
    }
  }, [user]);

  const handleNavigateToLogin = () => {
    navigateTo('/acesso-plano');
    toast.info('Faça login para acessar seus produtos');
  };

  return (
    <div className="min-h-screen flex flex-col bg-maternal-50">
      <Header />
      <main className="flex-grow pt-20">
        <div className="container mx-auto px-4 py-12">
          <h1 className="text-3xl md:text-4xl font-bold text-maternal-900 mb-8 text-center">
            Meus Acessos
          </h1>
          
          {showLoginPrompt ? (
            <div className="bg-white rounded-lg shadow-md p-8 max-w-xl mx-auto text-center">
              <h2 className="text-xl font-semibold text-maternal-800 mb-4">
                Faça login para acessar seus produtos
              </h2>
              <p className="text-maternal-700 mb-6">
                Para acessar seus produtos adquiridos, você precisa fazer login com o mesmo e-mail usado na compra.
              </p>
              <Button 
                onClick={handleNavigateToLogin} 
                className="bg-maternal-600 hover:bg-maternal-700 text-white"
              >
                Fazer Login
              </Button>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                <div className="bg-maternal-100 p-6">
                  <FileText className="h-12 w-12 text-maternal-700 mb-4" />
                  <h2 className="text-xl font-bold text-maternal-900">
                    Plano de Parto Personalizado
                  </h2>
                  <p className="text-maternal-700 mt-2">
                    Crie, edite e compartilhe seu plano de parto personalizado.
                  </p>
                </div>
                <div className="p-6">
                  <Button 
                    onClick={() => navigateTo('/criar-plano')}
                    className="w-full bg-maternal-600 hover:bg-maternal-700 text-white"
                  >
                    <FileText className="h-5 w-5 mr-2" />
                    Acessar Plano de Parto
                  </Button>
                </div>
              </div>
              
              <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                <div className="bg-purple-100 p-6">
                  <Book className="h-12 w-12 text-purple-700 mb-4" />
                  <h2 className="text-xl font-bold text-maternal-900">
                    Guia do Parto Respeitoso
                  </h2>
                  <p className="text-maternal-700 mt-2">
                    Conteúdo completo sobre gestação e parto respeitoso.
                  </p>
                </div>
                <div className="p-6">
                  <Button 
                    onClick={() => navigateTo('/guia-online')}
                    className="w-full bg-purple-600 hover:bg-purple-700 text-white"
                  >
                    <Book className="h-5 w-5 mr-2" />
                    Acessar Guia Online
                  </Button>
                </div>
              </div>
            </div>
          )}
          
          <div className="mt-12 bg-white rounded-lg shadow-sm border border-maternal-200 p-6 max-w-4xl mx-auto">
            <h3 className="text-lg font-semibold text-maternal-800 mb-4 flex items-center">
              <ExternalLink className="h-5 w-5 mr-2 text-maternal-600" />
              Links de Acesso Rápido
            </h3>
            <p className="text-maternal-700 mb-4">
              Salve estes links nos favoritos do seu navegador para acessar facilmente seus produtos:
            </p>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="p-3 bg-maternal-50 rounded border border-maternal-100 break-all">
                <span className="text-sm font-medium text-maternal-800">Plano de Parto:</span>
                <div className="text-maternal-600 text-sm mt-1">
                  https://planodeparto.energiamaterna.com.br/criar-plano
                </div>
              </div>
              <div className="p-3 bg-purple-50 rounded border border-purple-100 break-all">
                <span className="text-sm font-medium text-maternal-800">Guia Online:</span>
                <div className="text-maternal-600 text-sm mt-1">
                  https://planodeparto.energiamaterna.com.br/guia-online
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
