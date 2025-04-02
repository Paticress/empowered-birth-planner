
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Footer } from '@/components/Footer';
import { useNavigation } from '@/hooks/useNavigation';
import { FileText, Lock, Mail, UserPlus } from 'lucide-react';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export function LoginPage() {
  const [loginCredentials, setLoginCredentials] = useState({
    email: '',
    password: '',
  });
  const [signupCredentials, setSignupCredentials] = useState({
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const { navigateTo } = useNavigation();
  const { signIn, signUp } = useAuth();

  const handleLoginChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setLoginCredentials(prev => ({ ...prev, [name]: value }));
  };

  const handleSignupChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setSignupCredentials(prev => ({ ...prev, [name]: value }));
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const email = loginCredentials.email.toLowerCase().trim();
    const { error } = await signIn(email, loginCredentials.password);
    
    if (error) {
      console.error('Login error:', error);
      toast.error('Falha no login: ' + error.message);
    } else {
      toast.success('Login realizado com sucesso!');
      
      // Check if user is in the allowed users table
      const { data: userData, error: userError } = await supabase
        .from('Users_DB_BirthPlanBuilder')
        .select('email')
        .eq('email', email)
        .maybeSingle();
      
      if (userError) {
        console.error('Error checking user access:', userError);
      }
      
      // If user exists in the database, they have access
      if (userData) {
        navigateTo('/criar-plano');
      } else {
        // Add the user to the database (they've paid)
        const { error: insertError } = await supabase
          .from('Users_DB_BirthPlanBuilder')
          .insert({ email });
          
        if (insertError) {
          console.error('Error adding user to database:', insertError);
          toast.error('Erro ao registrar acesso, por favor contate o suporte.');
        } else {
          navigateTo('/criar-plano');
        }
      }
    }
    
    setIsLoading(false);
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    if (signupCredentials.password !== signupCredentials.confirmPassword) {
      toast.error('As senhas não coincidem');
      setIsLoading(false);
      return;
    }
    
    if (signupCredentials.password.length < 6) {
      toast.error('A senha deve ter pelo menos 6 caracteres');
      setIsLoading(false);
      return;
    }

    const email = signupCredentials.email.toLowerCase().trim();
    const { error } = await signUp(email, signupCredentials.password);
    
    if (error) {
      console.error('Signup error:', error);
      toast.error('Falha no cadastro: ' + error.message);
    } else {
      toast.success('Cadastro realizado com sucesso!');
      toast.info('Por favor, verifique seu email para confirmar o cadastro');
      
      // After signup, wait a moment and switch to the login tab
      setTimeout(() => {
        const loginTab = document.getElementById('login-tab') as HTMLButtonElement;
        if (loginTab) loginTab.click();
        
        // Pre-fill the login email field
        setLoginCredentials(prev => ({
          ...prev,
          email: email
        }));
      }, 1500);
    }
    
    setIsLoading(false);
  };

  return (
    <div className="bg-maternal-50 min-h-screen">
      <header className="bg-white text-brand-black py-4 px-4 sm:px-6 lg:px-8 shadow-md">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <h1 className="text-xl font-bold text-brand-black">Plano de Parto Personalizado</h1>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => navigateTo("/guia-online")}
            className="text-maternal-900"
          >
            Voltar ao Guia
          </Button>
        </div>
      </header>
      
      <main className="max-w-md mx-auto px-4 py-12">
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
            <Tabs defaultValue="login">
              <TabsList className="grid w-full grid-cols-2 mb-6">
                <TabsTrigger value="login" id="login-tab">Login</TabsTrigger>
                <TabsTrigger value="signup">Cadastro</TabsTrigger>
              </TabsList>
              
              <TabsContent value="login">
                <form onSubmit={handleLogin} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      placeholder="Insira o email usado na compra"
                      value={loginCredentials.email}
                      onChange={handleLoginChange}
                      required
                      className="focus:border-maternal-500 focus:ring-maternal-400"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="password">Senha</Label>
                    <Input
                      id="password"
                      name="password"
                      type="password"
                      placeholder="Insira sua senha"
                      value={loginCredentials.password}
                      onChange={handleLoginChange}
                      required
                      className="focus:border-maternal-500 focus:ring-maternal-400"
                    />
                  </div>
                  
                  <Button 
                    type="submit" 
                    className="w-full font-semibold"
                    disabled={isLoading}
                    variant="birth-plan-builder"
                  >
                    <FileText className="mr-2 h-5 w-5" />
                    {isLoading ? 'Verificando...' : 'Acessar Meu Plano de Parto'}
                  </Button>
                </form>
              </TabsContent>
              
              <TabsContent value="signup">
                <form onSubmit={handleSignup} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="signup-email">Email</Label>
                    <Input
                      id="signup-email"
                      name="email"
                      type="email"
                      placeholder="Insira seu email"
                      value={signupCredentials.email}
                      onChange={handleSignupChange}
                      required
                      className="focus:border-maternal-500 focus:ring-maternal-400"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="signup-password">Senha</Label>
                    <Input
                      id="signup-password"
                      name="password"
                      type="password"
                      placeholder="Crie uma senha"
                      value={signupCredentials.password}
                      onChange={handleSignupChange}
                      required
                      className="focus:border-maternal-500 focus:ring-maternal-400"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="confirm-password">Confirmar Senha</Label>
                    <Input
                      id="confirm-password"
                      name="confirmPassword"
                      type="password"
                      placeholder="Confirme sua senha"
                      value={signupCredentials.confirmPassword}
                      onChange={handleSignupChange}
                      required
                      className="focus:border-maternal-500 focus:ring-maternal-400"
                    />
                    <p className="text-xs text-muted-foreground">
                      A senha deve ter no mínimo 6 caracteres
                    </p>
                  </div>
                  
                  <Button 
                    type="submit" 
                    className="w-full font-semibold"
                    disabled={isLoading}
                    variant="birth-plan-builder"
                  >
                    <UserPlus className="mr-2 h-5 w-5" />
                    {isLoading ? 'Cadastrando...' : 'Criar Conta'}
                  </Button>
                </form>
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
      </main>
      
      <Footer />
    </div>
  );
}
