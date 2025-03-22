
import { useState } from 'react';
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

interface PaymentFormProps {
  onPaymentSuccess: () => void;
}

export function PaymentForm({ onPaymentSuccess }: PaymentFormProps) {
  const stripe = useStripe();
  const elements = useElements();
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!stripe || !elements) {
      // Stripe.js hasn't loaded yet
      return;
    }

    setIsProcessing(true);
    setErrorMessage(null);

    try {
      // For this simplified demo version, we'll simulate a payment
      // In a real application, you would create a PaymentIntent on your server
      // and use Stripe's confirmCardPayment here
      
      // Simulate payment processing
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // For demo purposes, we'll always consider the payment successful
      setIsProcessing(false);
      toast.success("Pagamento realizado com sucesso!");
      localStorage.setItem('birthPlanPaid', 'true');
      onPaymentSuccess();
    } catch (error) {
      setIsProcessing(false);
      setErrorMessage(
        error instanceof Error ? error.message : "Ocorreu um erro ao processar seu pagamento."
      );
      toast.error("Falha no processamento do pagamento.");
    }
  };

  const cardElementOptions = {
    style: {
      base: {
        fontSize: '16px',
        color: '#424770',
        fontFamily: 'Roboto, Open Sans, Segoe UI, sans-serif',
        '::placeholder': {
          color: '#aab7c4',
        },
      },
      invalid: {
        color: '#9e2146',
        iconColor: '#9e2146',
      },
    },
    hidePostalCode: true, // Not required for Brazilian cards
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <div>
          <label className="block text-maternal-800 mb-2 font-medium">
            Informações do Cartão
          </label>
          <div className="border border-maternal-200 p-4 rounded-lg bg-white">
            <CardElement options={cardElementOptions} />
          </div>
          <p className="text-xs text-maternal-600 mt-2">
            Pagamento seguro processado pela Stripe. Seus dados do cartão nunca são armazenados em nossos servidores.
          </p>
        </div>
      </div>

      {errorMessage && (
        <div className="bg-red-50 text-red-800 p-3 rounded-md mb-4 text-sm">
          {errorMessage}
        </div>
      )}

      <Button
        type="submit"
        disabled={!stripe || isProcessing}
        className="w-full py-4 text-white"
        variant="resource-highlight"
      >
        {isProcessing ? 'Processando...' : 'Pagar R$ 97,00'}
      </Button>
    </form>
  );
}
