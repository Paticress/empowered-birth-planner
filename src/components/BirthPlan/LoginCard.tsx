
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Lock } from 'lucide-react';
import { LoginTab } from './tabs/LoginTab';
import { SignupTab } from './tabs/SignupTab';
import { LoginCardFooter } from './components/LoginCardFooter';
import { useState, useEffect } from 'react';

export function LoginCard() {
  const [activeTab, setActiveTab] = useState<string>("login");
  
  // Check if a URL parameter indicates the user was redirected from a purchase flow
  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    const fromPurchase = searchParams.get('from') === 'purchase';
    const fromGuide = searchParams.get('from') === 'guide';
    
    // If redirected from purchase or guide flow, automatically show signup tab
    if (fromPurchase || fromGuide) {
      setActiveTab("signup");
    }
  }, []);

  return (
    <Card className="border-maternal-200 shadow-lg">
      <CardHeader className="text-center bg-maternal-100 border-b border-maternal-200">
        <CardTitle className="text-maternal-900 text-2xl flex items-center justify-center">
          <Lock className="mr-2 h-6 w-6" /> 
          Acesso Exclusivo
        </CardTitle>
        <CardDescription>
          {activeTab === "login" 
            ? "Entre com o email utilizado na compra do plano" 
            : "Falta pouco! Crie sua conta para acessar o Guia"}
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-6">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger value="login" id="login-tab">Login</TabsTrigger>
            <TabsTrigger value="signup" id="signup-tab">Cadastro</TabsTrigger>
          </TabsList>
          
          <TabsContent value="login">
            <LoginTab />
          </TabsContent>
          
          <TabsContent value="signup">
            <SignupTab />
          </TabsContent>
        </Tabs>
        
        <LoginCardFooter />
      </CardContent>
    </Card>
  );
}
