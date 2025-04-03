
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { Footer } from '@/components/Footer';
import { useNavigation } from '@/hooks/useNavigation';
import { CreditCard, Landmark, QrCode, Bug } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface PaymentGateProps {
  onPaymentComplete: () => void;
}

export function PaymentGate({ onPaymentComplete }: PaymentGateProps) {
  const [paymentMethod, setPaymentMethod] = useState<string | null>(null);
  const [testEmail, setTestEmail] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { navigateTo } = useNavigation();
  const { toast } = useToast();
  
  // This is a placeholder for demonstration purposes
  // In a real implementation, this would connect to a payment gateway
  const handlePaymentProcessing = () => {
    // Simulate payment processing
    setTimeout(() => {
      onPaymentComplete();
    }, 1500);
  };
  
  // Debug function to test the webhook directly
  const testWebhook = async () => {
    if (!testEmail.trim() || !testEmail.includes('@')) {
      toast({
        title: "Email inválido",
        description: "Por favor, informe um email válido para o teste.",
        variant: "destructive"
      });
      return;
    }
    
    setIsLoading(true);
    
    try {
      // Test the webhook with a sample payload mimicking the Wix structure
      const response = await fetch('https://xzgbdaejjcdusbtwejom.functions.supabase.co/wix-purchase-webhook', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          data: {
            email: testEmail
          }
        })
      });
      
      const result = await response.json();
      
      if (response.ok) {
        toast({
          title: "Teste bem-sucedido!",
          description: `Webhook processado: ${result.message}`,
          variant: "default"
        });
      } else {
        toast({
          title: "Erro no teste",
          description: `Erro: ${result.error || 'Desconhecido'}`,
          variant: "destructive"
        });
      }
    } catch (error) {
      toast({
        title: "Falha na conexão",
        description: `Não foi possível conectar ao webhook: ${error instanceof Error ? error.message : String(error)}`,
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
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
      
      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-12">
        <div className="bg-white shadow-md rounded-lg overflow-hidden">
          <div className="bg-maternal-600 p-6 text-white text-center">
            <h2 className="text-2xl font-bold mb-2">Construa seu Plano de Parto Personalizado</h2>
            <p className="mb-0">Acesso único por apenas R$ 128,00</p>
          </div>
          
          <div className="p-6 md:p-8">
            <div className="mb-8">
              <h3 className="text-xl font-semibold mb-4">O que você vai receber:</h3>
              <ul className="space-y-2">
                <li className="flex items-start">
                  <div className="bg-maternal-100 rounded-full p-1 mr-3 mt-1">
                    <svg className="w-4 h-4 text-maternal-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <span>Questionário personalizado para entender suas necessidades específicas</span>
                </li>
                <li className="flex items-start">
                  <div className="bg-maternal-100 rounded-full p-1 mr-3 mt-1">
                    <svg className="w-4 h-4 text-maternal-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <span>Plano de parto gerado automaticamente com base em suas respostas</span>
                </li>
                <li className="flex items-start">
                  <div className="bg-maternal-100 rounded-full p-1 mr-3 mt-1">
                    <svg className="w-4 h-4 text-maternal-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <span>Editor para personalizar cada aspecto do seu plano</span>
                </li>
                <li className="flex items-start">
                  <div className="bg-maternal-100 rounded-full p-1 mr-3 mt-1">
                    <svg className="w-4 h-4 text-maternal-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <span>Opções para compartilhar com sua equipe médica e imprimir</span>
                </li>
                <li className="flex items-start">
                  <div className="bg-maternal-100 rounded-full p-1 mr-3 mt-1">
                    <svg className="w-4 h-4 text-maternal-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <span>Acesso ilimitado para fazer alterações ao seu plano</span>
                </li>
              </ul>
            </div>
            
            <h3 className="text-xl font-semibold mb-4">Escolha uma forma de pagamento:</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <button
                className={`p-4 border rounded-lg flex flex-col items-center text-center transition-all ${
                  paymentMethod === 'card' ? 'border-maternal-600 bg-maternal-50' : 'border-gray-200 hover:border-maternal-300'
                }`}
                onClick={() => setPaymentMethod('card')}
              >
                <CreditCard className="h-8 w-8 text-maternal-600 mb-2" />
                <span className="font-medium">Cartão de Crédito</span>
                <span className="text-sm text-gray-500 mt-1">Parcele em até 12x</span>
              </button>
              
              <button
                className={`p-4 border rounded-lg flex flex-col items-center text-center transition-all ${
                  paymentMethod === 'pix' ? 'border-maternal-600 bg-maternal-50' : 'border-gray-200 hover:border-maternal-300'
                }`}
                onClick={() => setPaymentMethod('pix')}
              >
                <QrCode className="h-8 w-8 text-maternal-600 mb-2" />
                <span className="font-medium">PIX</span>
                <span className="text-sm text-gray-500 mt-1">Pagamento instantâneo</span>
              </button>
              
              <button
                className={`p-4 border rounded-lg flex flex-col items-center text-center transition-all ${
                  paymentMethod === 'boleto' ? 'border-maternal-600 bg-maternal-50' : 'border-gray-200 hover:border-maternal-300'
                }`}
                onClick={() => setPaymentMethod('boleto')}
              >
                <Landmark className="h-8 w-8 text-maternal-600 mb-2" />
                <span className="font-medium">Boleto Bancário</span>
                <span className="text-sm text-gray-500 mt-1">Vence em 3 dias</span>
              </button>
            </div>
            
            <Button 
              className="w-full text-white py-6 text-lg"
              variant="resource-highlight"
              disabled={!paymentMethod}
              onClick={handlePaymentProcessing}
            >
              Realizar Pagamento
            </Button>
            
            <p className="text-sm text-center text-gray-500 mt-4">
              Pagamento único e seguro. Acesso imediato após confirmação.
            </p>
            
            {/* Webhook Test Section - For Development Only */}
            {process.env.NODE_ENV === 'development' && (
              <div className="mt-8 p-4 border border-dashed border-gray-300 rounded-lg">
                <h4 className="text-sm font-semibold flex items-center">
                  <Bug className="w-4 h-4 mr-1" /> Ferramenta de Teste (Apenas Desenvolvimento)
                </h4>
                <div className="mt-2">
                  <input
                    type="email"
                    placeholder="Email para teste"
                    className="border p-2 rounded w-full mb-2"
                    value={testEmail}
                    onChange={(e) => setTestEmail(e.target.value)}
                  />
                  <Button 
                    variant="outline"
                    size="sm"
                    className="w-full"
                    onClick={testWebhook}
                    disabled={isLoading}
                  >
                    {isLoading ? 'Testando...' : 'Testar Webhook Diretamente'}
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
