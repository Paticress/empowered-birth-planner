
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Lock } from 'lucide-react';
import { LoginCardFooter } from './components/LoginCardFooter';
import { MagicLinkTab } from './tabs/MagicLinkTab';
import { useEffect, useState } from 'react';

export function LoginCard() {
  const [fromGuide, setFromGuide] = useState<boolean>(false);
  
  // Check if a URL parameter indicates the user was redirected from a purchase flow
  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    const isFromGuide = searchParams.get('from') === 'guide';
    const isFromPurchase = searchParams.get('from') === 'purchase';
    
    setFromGuide(isFromGuide || isFromPurchase);
  }, []);

  return (
    <Card className="border-maternal-200 shadow-lg">
      <CardHeader className="text-center bg-maternal-100 border-b border-maternal-200">
        <CardTitle className="text-maternal-900 text-2xl flex items-center justify-center">
          <Lock className="mr-2 h-6 w-6" /> 
          Acesso Exclusivo
        </CardTitle>
        <CardDescription>
          {fromGuide 
            ? "Falta pouco! Digite seu email para acessar o Guia"
            : "Digite o email utilizado na compra do plano"}
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-6">
        <MagicLinkTab />
        
        <LoginCardFooter />
      </CardContent>
    </Card>
  );
}
