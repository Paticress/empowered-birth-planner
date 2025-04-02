
import { useState } from 'react';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { HeroSection } from '@/components/PlanoPersonalizado/HeroSection';
import { BenefitsSection } from '@/components/PlanoPersonalizado/BenefitsSection';
import { HowItWorksSection } from '@/components/PlanoPersonalizado/HowItWorksSection';
import { TestimonialsSection } from '@/components/PlanoPersonalizado/TestimonialsSection';
import { CheckoutSection } from '@/components/PlanoPersonalizado/CheckoutSection';

const PlanoPersonalizado = () => {
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  // Set a default price for the plan
  const planPrice = 97;
  
  const handlePurchase = () => {
    setIsCheckingOut(true);
  };
  
  const handleGoBack = () => {
    setIsCheckingOut(false);
  };

  return (
    <div className="min-h-screen page-transition">
      <Header />
      
      <HeroSection 
        onGetPlan={handlePurchase}
        isCheckingOut={isCheckingOut}
      />
      
      {!isCheckingOut && (
        <>
          <BenefitsSection />
          <HowItWorksSection 
            onGetPlan={handlePurchase}
            isCheckingOut={isCheckingOut}
          />
          <TestimonialsSection />
        </>
      )}
      
      {isCheckingOut && (
        <CheckoutSection 
          onGoBack={handleGoBack}
          price={planPrice}
        />
      )}
      
      <Footer />
    </div>
  );
};

export default PlanoPersonalizado;
