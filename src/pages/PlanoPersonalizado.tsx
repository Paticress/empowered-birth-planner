
import { useState, useEffect } from 'react';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { useNavigation } from '@/hooks/useNavigation';
import { toast } from 'sonner';

// Imported components
import { HeroSection } from '@/components/PlanoPersonalizado/HeroSection';
import { BenefitsSection } from '@/components/PlanoPersonalizado/BenefitsSection';
import { HowItWorksSection } from '@/components/PlanoPersonalizado/HowItWorksSection';
import { PricingSection } from '@/components/PlanoPersonalizado/PricingSection';
import { TestimonialsSection } from '@/components/PlanoPersonalizado/TestimonialsSection';

const PlanoPersonalizado = () => {
  const { navigateTo } = useNavigation();
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
    
    checkPaymentStatus();
  }, []);
  
  const handleAccessPlan = () => {
    navigateTo('/criar-plano');
  };
  
  const handlePurchase = () => {
    // Redirecionar para o construtor de plano de parto, que vai verificar o pagamento
    navigateTo('/criar-plano');
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
