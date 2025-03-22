
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { Footer } from '@/components/Footer';
import { useNavigation } from '@/hooks/useNavigation';
import { CreditCard, Landmark, QrCode } from 'lucide-react';
import { toast } from 'sonner';

interface PaymentGateProps {
  onPaymentComplete: () => void;
}

export function PaymentGate({ onPaymentComplete }: PaymentGateProps) {
  const [paymentMethod, setPaymentMethod] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const { navigateTo } = useNavigation();
  
  // This is a placeholder for demonstration purposes
  // In a real implementation, this would connect to a payment gateway
  const handlePaymentProcessing = () => {
    if (!paymentMethod) {
      toast.error("Por favor, selecione um método de pagamento");
      return;
    }
    
    setIsProcessing(true);
    
    // Simulate payment processing
    setTimeout(() => {
      setIsProcessing(false);
      toast.success("Pagamento realizado com sucesso!");
      onPaymentComplete();
    }, 1500);
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
      
      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-8 md:py-12">
        <div className="bg-white shadow-md rounded-lg overflow-hidden">
          <div className="bg-maternal-600 p-4 md:p-6 text-white text-center">
            <h2 className="text-xl md:text-2xl font-bold mb-2">Construa seu Plano de Parto Personalizado</h2>
            <p className="mb-0">Acesso único por apenas R$ 97,00</p>
          </div>
          
          <div className="p-4 md:p-8">
            <div className="mb-6 md:mb-8">
              <h3 className="text-lg md:text-xl font-semibold mb-4">O que você vai receber:</h3>
              <ul className="space-y-2">
                <li className="flex items-start">
                  <div className="bg-maternal-100 rounded-full p-1 mr-3 mt-1">
                    <svg className="w-4 h-4 text-maternal-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <span className="text-sm md:text-base">Questionário personalizado para entender suas necessidades específicas</span>
                </li>
                <li className="flex items-start">
                  <div className="bg-maternal-100 rounded-full p-1 mr-3 mt-1">
                    <svg className="w-4 h-4 text-maternal-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <span className="text-sm md:text-base">Plano de parto gerado automaticamente com base em suas respostas</span>
                </li>
                <li className="flex items-start">
                  <div className="bg-maternal-100 rounded-full p-1 mr-3 mt-1">
                    <svg className="w-4 h-4 text-maternal-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <span className="text-sm md:text-base">Editor para personalizar cada aspecto do seu plano</span>
                </li>
                <li className="flex items-start">
                  <div className="bg-maternal-100 rounded-full p-1 mr-3 mt-1">
                    <svg className="w-4 h-4 text-maternal-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <span className="text-sm md:text-base">Opções para compartilhar com sua equipe médica e imprimir</span>
                </li>
                <li className="flex items-start">
                  <div className="bg-maternal-100 rounded-full p-1 mr-3 mt-1">
                    <svg className="w-4 h-4 text-maternal-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <span className="text-sm md:text-base">Acesso ilimitado para fazer alterações ao seu plano</span>
                </li>
              </ul>
            </div>
            
            <h3 className="text-lg md:text-xl font-semibold mb-4">Escolha uma forma de pagamento:</h3>
            
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
              className="w-full text-white py-4 md:py-6 text-base md:text-lg"
              variant="resource-highlight"
              disabled={!paymentMethod || isProcessing}
              onClick={handlePaymentProcessing}
            >
              {isProcessing ? 'Processando...' : 'Realizar Pagamento'}
            </Button>
            
            <p className="text-sm text-center text-gray-500 mt-4">
              Pagamento único e seguro. Acesso imediato após confirmação.
            </p>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
