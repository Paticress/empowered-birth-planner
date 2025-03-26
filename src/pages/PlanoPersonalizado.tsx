
import { useState, useEffect } from 'react';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

// Imported components
import { HeroSection } from '@/components/PlanoPersonalizado/HeroSection';
import { BenefitsSection } from '@/components/PlanoPersonalizado/BenefitsSection';
import { HowItWorksSection } from '@/components/PlanoPersonalizado/HowItWorksSection';
import { PricingSection } from '@/components/PlanoPersonalizado/PricingSection';
import { TestimonialsSection } from '@/components/PlanoPersonalizado/TestimonialsSection';

const PlanoPersonalizado = () => {
  const navigate = useNavigate();
  const [hasPaid, setHasPaid] = useState(false);
  const [isCheckingPayment, setIsCheckingPayment] = useState(true);
  
  // Verificar se o usuário já pagou
  useEffect(() => {
    const checkPaymentStatus = () => {
      const paidStatus = localStorage.getItem('birthPlanPaid');
      const paymentTimestamp = localStorage.getItem('birthPlanPaymentTimestamp');
      
      if (paidStatus === 'true' && paymentTimestamp) {
        const paymentDate = Number(paymentTimestamp);
        const expirationDate = paymentDate + (9 * 30 * 24 * 60 * 60 * 1000); // 9 meses em milissegundos
        
        if (Date.now() < expirationDate) {
          setHasPaid(true);
        }
      }
      
      setIsCheckingPayment(false);
    };
    
    console.log('Checking payment status');
    checkPaymentStatus();
  }, []);
  
  const handleAccessPlan = () => {
    console.log('Redirecting to birth plan builder');
    navigate('/criar-plano');
  };
  
  const handlePurchase = () => {
    console.log('Simulating purchase for demo');
    // Simulando um pagamento bem-sucedido para propósitos de demonstração
    localStorage.setItem('birthPlanPaid', 'true');
    localStorage.setItem('birthPlanPaymentTimestamp', Date.now().toString());
    
    toast.success('Pagamento processado com sucesso!', {
      description: 'Você agora tem acesso ao Plano de Parto Personalizado'
    });
    
    // Redirecionar para o construtor de plano de parto
    setTimeout(() => {
      navigate('/criar-plano');
    }, 1500);
  };

  return (
    <div className="min-h-screen page-transition">
      <Header />
      
      <HeroSection 
        isCheckingPayment={isCheckingPayment}
        hasPaid={hasPaid}
        handleAccessPlan={handleAccessPlan}
        handlePurchase={handlePurchase}
      />
      
      <BenefitsSection />
      
      <HowItWorksSection 
        isCheckingPayment={isCheckingPayment}
        hasPaid={hasPaid}
        handleAccessPlan={handleAccessPlan}
        handlePurchase={handlePurchase}
      />
      
      <PricingSection 
        hasPaid={hasPaid}
        handlePurchase={handlePurchase}
      />
      
      <TestimonialsSection />
      
      <Footer />
    </div>
  );
};

export default PlanoPersonalizado;
