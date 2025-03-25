
import { Button } from '@/components/ui/button';
import { useEffect, useState } from 'react';
import { Footer } from '@/components/Footer';
import { useNavigation } from '@/hooks/useNavigation';
import { toast } from 'sonner';
import { Check, Lock } from 'lucide-react';

interface PaymentGateProps {
  onPaymentComplete: () => void;
}

// URL to your Wix payment page - replace with your actual payment link
const WIX_PAYMENT_URL = "https://your-wix-site.com/payment-page";

export function PaymentGate({ onPaymentComplete }: PaymentGateProps) {
  const { navigateTo } = useNavigation();
  const [checkingPayment, setCheckingPayment] = useState(true);
  const [uniqueUserIdentifier, setUniqueUserIdentifier] = useState<string | null>(null);
  
  // Generate or retrieve a unique identifier for the user
  useEffect(() => {
    // Check if user already has an ID
    let userId = localStorage.getItem('birthPlanUserId');
    
    if (!userId) {
      // Generate a unique ID for this user with more entropy
      userId = `user_${Date.now()}_${Math.random().toString(36).substring(2, 9)}_${Math.random().toString(36).substring(2, 9)}`;
      localStorage.setItem('birthPlanUserId', userId);
    }
    
    setUniqueUserIdentifier(userId);
  }, []);
  
  // Check if the user has already paid
  useEffect(() => {
    // Check for payment from URL parameter (when returning from Wix)
    const urlParams = new URLSearchParams(window.location.search);
    const paymentStatus = urlParams.get('payment_status');
    const paymentId = urlParams.get('payment_id');
    
    // Check localStorage for existing payment record
    const paidStatus = localStorage.getItem('birthPlanPaid');
    const storedPaymentId = localStorage.getItem('birthPlanPaymentId');
    const paymentTimestamp = localStorage.getItem('birthPlanPaymentTimestamp');
    
    // Add timestamp verification to validate payments aren't too old
    const isPaymentValid = paidStatus === 'true' && storedPaymentId;
    const isPaymentFresh = !paymentTimestamp || 
                          (Date.now() - Number(paymentTimestamp)) < (90 * 24 * 60 * 60 * 1000); // 90 days
    
    if (paymentStatus === 'success' && paymentId) {
      // Payment was just completed via Wix
      // Store both the payment status, ID and timestamp
      localStorage.setItem('birthPlanPaid', 'true');
      localStorage.setItem('birthPlanPaymentId', paymentId);
      localStorage.setItem('birthPlanPaymentTimestamp', Date.now().toString());
      
      toast.success("Pagamento realizado com sucesso!");
      onPaymentComplete();
    } else if (isPaymentValid && isPaymentFresh) {
      // User has already paid in a previous session and payment is still valid
      onPaymentComplete();
    }
    
    setCheckingPayment(false);
  }, [onPaymentComplete]);

  // Redirect to Wix payment page with the unique user identifier
  const handlePaymentRedirect = () => {
    if (!uniqueUserIdentifier) {
      toast.error("Erro ao processar pagamento. Por favor, tente novamente.");
      return;
    }
    
    // Append the user identifier to the payment URL
    const paymentUrl = `${WIX_PAYMENT_URL}?user_id=${uniqueUserIdentifier}&timestamp=${Date.now()}`;
    window.location.href = paymentUrl;
  };
  
  if (checkingPayment) {
    return (
      <div className="bg-maternal-50 min-h-screen flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-md text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-maternal-600 mx-auto mb-4"></div>
          <p className="text-maternal-700">Verificando status do pagamento...</p>
        </div>
      </div>
    );
  }
  
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
            
            <div className="bg-maternal-50 p-4 mb-6 rounded-lg border border-maternal-100">
              <div className="flex items-start">
                <Lock className="w-5 h-5 text-maternal-600 mr-3 mt-1" />
                <div>
                  <h4 className="text-maternal-800 font-semibold mb-1">Acesso Individual e Seguro</h4>
                  <p className="text-sm text-maternal-700">
                    Seu pagamento dá acesso a uma única conta. Nosso sistema identifica cada usuário individualmente
                    para garantir a proteção do seu acesso exclusivo.
                  </p>
                </div>
              </div>
            </div>
            
            <Button 
              onClick={handlePaymentRedirect}
              className="w-full text-white py-4 md:py-6 text-base md:text-lg"
              variant="birth-plan-builder"
            >
              Ir para Página de Pagamento
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
