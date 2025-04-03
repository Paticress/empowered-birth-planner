
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

export function PaymentSuccess() {
  const navigate = useNavigate();

  useEffect(() => {
    // Show success message
    toast.success("Pagamento realizado com sucesso!");
    
    // Redirect to the birth plan creation page after a short delay
    const timer = setTimeout(() => {
      navigate("/criar-plano");
    }, 3000);

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-green-50">
      <div className="max-w-md p-8 bg-white rounded-lg shadow-lg text-center">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h1 className="text-2xl font-bold text-gray-800 mb-2">Pagamento Confirmado!</h1>
        <p className="text-gray-600 mb-6">
          Seu pagamento foi processado com sucesso. Você será redirecionado para criar seu plano de parto em alguns segundos.
        </p>
        <div className="animate-pulse">
          <div className="h-2 w-full bg-gray-200 rounded"></div>
        </div>
      </div>
    </div>
  );
}
