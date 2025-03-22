
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
      // In a real implementation, you would make an API call to your server to create a payment intent
      // For now, we'll simulate a successful payment

      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // For demo purposes, we're just simulating success
      // In production, you would process the actual payment with Stripe here
      
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

  return (
    <form onSubmit={handleSubmit}>
      <div className="mb-6">
        <label className="block text-maternal-800 mb-2 font-medium">
          Informações do Cartão
        </label>
        <div className="border border-maternal-200 p-4 rounded-lg bg-white">
          <CardElement
            options={{
              style: {
                base: {
                  fontSize: '16px',
                  color: '#424770',
                  '::placeholder': {
                    color: '#aab7c4',
                  },
                },
                invalid: {
                  color: '#9e2146',
                },
              },
            }}
          />
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
