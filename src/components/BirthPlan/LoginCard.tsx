
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Lock } from 'lucide-react';
import { MagicLinkForm } from './forms/MagicLinkForm';
import { LoginForm } from './forms/LoginForm';
import { SignupForm } from './forms/SignupForm';
import { useLoginForm } from './hooks/useLoginForm';

export function LoginCard() {
  const {
    loginCredentials,
    signupCredentials,
    magicLinkEmail,
    isLoading,
    isMagicLinkSent,
    setMagicLinkEmail,
    setIsMagicLinkSent,
    handleLoginChange,
    handleSignupChange,
    handleLogin,
    handleSignup,
    handleMagicLinkSubmit
  } = useLoginForm();

  return (
    <Card className="border-maternal-200 shadow-lg">
      <CardHeader className="text-center bg-maternal-100 border-b border-maternal-200">
        <CardTitle className="text-maternal-900 text-2xl flex items-center justify-center">
          <Lock className="mr-2 h-6 w-6" /> 
          Acesso Exclusivo
        </CardTitle>
        <CardDescription>
          Entre com o email utilizado na compra do plano
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-6">
        <Tabs defaultValue="magic-link">
          <TabsList className="grid w-full grid-cols-3 mb-6">
            <TabsTrigger value="magic-link">Link Mágico</TabsTrigger>
            <TabsTrigger value="login" id="login-tab">Login</TabsTrigger>
            <TabsTrigger value="signup">Cadastro</TabsTrigger>
          </TabsList>
          
          <TabsContent value="magic-link">
            <MagicLinkForm 
              magicLinkEmail={magicLinkEmail}
              setMagicLinkEmail={setMagicLinkEmail}
              isLoading={isLoading}
              isMagicLinkSent={isMagicLinkSent}
              setIsMagicLinkSent={setIsMagicLinkSent}
              handleMagicLinkSubmit={handleMagicLinkSubmit}
            />
          </TabsContent>
          
          <TabsContent value="login">
            <LoginForm 
              loginCredentials={loginCredentials}
              isLoading={isLoading}
              handleLoginChange={handleLoginChange}
              handleLogin={handleLogin}
            />
          </TabsContent>
          
          <TabsContent value="signup">
            <SignupForm 
              signupCredentials={signupCredentials}
              isLoading={isLoading}
              handleSignupChange={handleSignupChange}
              handleSignup={handleSignup}
            />
          </TabsContent>
        </Tabs>
        
        <div className="mt-6 text-center text-sm text-maternal-700">
          <p>
            Ainda não tem acesso? Adquira seu plano em nosso site.
          </p>
          <Button
            variant="link"
            className="text-maternal-600 hover:text-maternal-800"
            onClick={() => window.open('https://www.energiamaterna.com.br', '_blank')}
          >
            Saiba mais
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
