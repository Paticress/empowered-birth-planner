
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from '@/components/ui/use-toast';

export function useAccessVerification(embedded = false) {
  const navigate = useNavigate();
  const [hasAccess, setHasAccess] = useState<boolean>(false);
  const [checkingPayment, setCheckingPayment] = useState<boolean>(true);

  // Verify if the user has already paid
  useEffect(() => {
    // When embedded, skip payment verification
    if (embedded) {
      console.log("BirthPlanBuilder running in embedded mode");
      setHasAccess(true);
      setCheckingPayment(false);
      return;
    }
    
    // Check payment from localStorage
    const paidStatus = localStorage.getItem('birthPlanPaid');
    const paymentTimestamp = localStorage.getItem('birthPlanPaymentTimestamp');
    
    // Check if payment is valid (within 9 months)
    if (paidStatus === 'true' && paymentTimestamp) {
      const paymentDate = Number(paymentTimestamp);
      const expirationDate = paymentDate + (9 * 30 * 24 * 60 * 60 * 1000); // 9 months in milliseconds
      
      if (Date.now() < expirationDate) {
        console.log("User has valid access");
        setHasAccess(true);
      } else {
        console.log("Payment expired");
        toast({
          title: "Acesso expirado",
          description: "Seu acesso ao plano de parto expirou. Por favor, renove para continuar."
        });
        navigate('/plano-personalizado');
      }
    }
    
    setCheckingPayment(false);
  }, [embedded, navigate]);

  // Redirect to payment page if user doesn't have access
  useEffect(() => {
    if (!checkingPayment && !hasAccess && !embedded) {
      console.log("User doesn't have access, redirecting to payment page");
      navigate('/plano-personalizado');
    }
  }, [checkingPayment, hasAccess, embedded, navigate]);

  return {
    hasAccess,
    checkingPayment,
    setHasAccess
  };
}
