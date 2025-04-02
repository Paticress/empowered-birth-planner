
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { useNavigation } from '@/hooks/useNavigation';
import { supabase } from '@/integrations/supabase/client';

interface CheckoutSectionProps {
  onBackToInfo?: () => void;
  onGoBack?: () => void;
  price?: number;
}

export function CheckoutSection({ onBackToInfo, onGoBack, price = 97 }: CheckoutSectionProps) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const { navigateTo } = useNavigation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name || !email || !password) {
      toast.error('Por favor, preencha todos os campos');
      return;
    }
    
    if (password.length < 6) {
      toast.error('A senha deve ter pelo menos 6 caracteres');
      return;
    }
    
    setIsProcessing(true);
    
    try {
      // First, create the user account
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: name,
          }
        }
      });
      
      if (authError) {
        throw new Error(authError.message);
      }
      
      // Then add them to the birth plan users table
      const { error: dbError } = await supabase
        .from('Users_DB_BirthPlanBuilder')
        .insert({ email });
        
      if (dbError) {
        throw new Error(dbError.message);
      }
      
      // Success! Payment processed and user created
      toast.success('Compra realizada com sucesso!');
      toast.info('Redirecionando para o seu plano de parto...');
      
      // Wait a bit before redirecting
      setTimeout(() => {
        navigateTo('/criar-plano');
      }, 2000);
      
    } catch (error) {
      console.error('Error processing payment:', error);
      toast.error('Erro ao processar pagamento: ' + (error as Error).message);
    } finally {
      setIsProcessing(false);
    }
  };

  // Choose the appropriate back button handler
  const handleBack = onGoBack || onBackToInfo;

  return (
    <section id="checkout" className="bg-white py-16">
      <div className="max-w-6xl mx-auto px-4">
        <h2 className="heading-secondary text-center mb-8">Finalize sua Compra</h2>
        
        <div className="max-w-md mx-auto">
          <div className="bg-purple-50 p-4 rounded-md mb-6">
            <h3 className="font-bold text-lg mb-2">Resumo do Pedido</h3>
            <div className="flex justify-between border-b pb-2 mb-2">
              <span>Plano de Parto Personalizado</span>
              <span>R$ {price.toFixed(2)}</span>
            </div>
            <div className="flex justify-between font-bold">
              <span>Total</span>
              <span>R$ {price.toFixed(2)}</span>
            </div>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium mb-1">Nome Completo</label>
              <Input 
                id="name" 
                value={name} 
                onChange={(e) => setName(e.target.value)} 
                placeholder="Maria Silva" 
                required 
              />
            </div>
            
            <div>
              <label htmlFor="email" className="block text-sm font-medium mb-1">Email</label>
              <Input 
                id="email" 
                type="email" 
                value={email} 
                onChange={(e) => setEmail(e.target.value)} 
                placeholder="maria@exemplo.com" 
                required 
              />
            </div>
            
            <div>
              <label htmlFor="password" className="block text-sm font-medium mb-1">Criar Senha</label>
              <Input 
                id="password" 
                type="password" 
                value={password} 
                onChange={(e) => setPassword(e.target.value)} 
                placeholder="Mínimo de 6 caracteres" 
                required 
                minLength={6}
              />
              <p className="text-xs text-muted-foreground mt-1">
                Você usará este email e senha para acessar seu plano de parto.
              </p>
            </div>
            
            <div className="pt-4">
              <Button 
                type="submit" 
                className="w-full py-6 text-lg" 
                variant="birth-plan-builder"
                disabled={isProcessing}
              >
                {isProcessing ? 'Processando...' : `Pagar R$ ${price.toFixed(2)}`}
              </Button>
              
              {handleBack && (
                <Button 
                  type="button" 
                  variant="ghost" 
                  className="w-full mt-2" 
                  onClick={handleBack}
                  disabled={isProcessing}
                >
                  Voltar
                </Button>
              )}
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}
