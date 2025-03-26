
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';

interface HeroSectionProps {
  isCheckingPayment: boolean;
  hasPaid: boolean;
  handleAccessPlan: () => void;
  handlePurchase: () => void;
}

export function HeroSection({ 
  isCheckingPayment, 
  hasPaid, 
  handleAccessPlan, 
  handlePurchase 
}: HeroSectionProps) {
  return (
    <section className="pt-28 md:pt-36 bg-gradient-to-br from-maternal-50 via-purple-50 to-pink-50">
      <div className="landing-container">
        <div className="max-w-3xl mx-auto text-center section-transition">
          <span className="badge mb-4">Plano de Parto Personalizado</span>
          <h1 className="heading-primary text-maternal-900">
            Seu Plano de Parto pronto em minutos!
          </h1>
          <p className="subheading mb-8">
            Personalize seu plano de parto e garanta que suas vontades sejam respeitadas no momento mais especial da sua vida.
          </p>
          
          {isCheckingPayment ? (
            <div className="flex justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-maternal-600"></div>
            </div>
          ) : hasPaid ? (
            <div className="space-y-4">
              <div className="bg-green-50 border border-green-200 rounded-lg p-4 inline-block">
                <p className="text-green-800 flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Seu acesso está ativo até {new Date(Number(localStorage.getItem('birthPlanPaymentTimestamp')) + (9 * 30 * 24 * 60 * 60 * 1000)).toLocaleDateString()}
                </p>
              </div>
              <Button 
                onClick={handleAccessPlan}
                className="btn-primary"
              >
                Acessar Meu Plano de Parto <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          ) : (
            <Button 
              onClick={handlePurchase}
              className="btn-primary"
            >
              Quero Meu Plano Agora
            </Button>
          )}
        </div>
      </div>
      
      <div className="h-24 md:h-32 bg-wave-pattern bg-repeat-x bg-bottom"></div>
    </section>
  );
}
