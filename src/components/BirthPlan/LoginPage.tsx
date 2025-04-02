
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Footer } from '@/components/Footer';
import { useNavigation } from '@/hooks/useNavigation';
import { FileText, Lock } from 'lucide-react';
import { toast } from 'sonner';

export function LoginPage() {
  const [credentials, setCredentials] = useState({
    username: '',
    password: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const { navigateTo } = useNavigation();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCredentials(prev => ({ ...prev, [name]: value }));
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulate API check
    setTimeout(() => {
      // For demonstration - we'd actually check against your user database
      if (credentials.username && credentials.password) {
        // Store login status in localStorage
        localStorage.setItem('birthPlanLoggedIn', 'true');
        localStorage.setItem('birthPlanUsername', credentials.username);
        
        toast.success('Login bem-sucedido');
        navigateTo('/criar-plano');
      } else {
        toast.error('Credenciais inválidas. Por favor, tente novamente.');
      }
      setIsLoading(false);
    }, 1000);
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
              Entre com as credenciais recebidas após a compra
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="username">Nome de usuário</Label>
                <Input
                  id="username"
                  name="username"
                  placeholder="Insira seu nome de usuário"
                  value={credentials.username}
                  onChange={handleInputChange}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="password">Senha</Label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  placeholder="Insira sua senha"
                  value={credentials.password}
                  onChange={handleInputChange}
                  required
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
