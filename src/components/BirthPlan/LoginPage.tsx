
import { Footer } from '@/components/Footer';
import { LoginHeader } from './LoginHeader';
import { LoginCard } from './LoginCard';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { InfoIcon } from 'lucide-react';
import { useEffect, useState } from 'react';

export function LoginPage() {
  const [showGuideBanner, setShowGuideBanner] = useState(false);
  
  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    const fromGuide = searchParams.get('from') === 'guide';
    setShowGuideBanner(fromGuide);
  }, []);

  return (
    <div className="bg-maternal-50 min-h-screen">
      <LoginHeader />
      
      <main className="max-w-md mx-auto px-4 py-8">
        {showGuideBanner && (
          <Alert className="mb-6 bg-maternal-100 border-maternal-200 text-maternal-800">
            <InfoIcon className="h-4 w-4 text-maternal-600 mr-2" />
            <AlertDescription>
              Falta pouco para você acessar o Guia do Parto Respeitoso! Crie sua conta ou faça login para continuar.
            </AlertDescription>
          </Alert>
        )}
        
        <LoginCard />
      </main>
      
      <Footer />
    </div>
  );
}
