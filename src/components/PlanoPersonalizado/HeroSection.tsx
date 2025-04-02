
import { Button } from '@/components/ui/button';

interface HeroSectionProps {
  onGetPlan: () => void;
  isCheckingOut: boolean;
}

export function HeroSection({ onGetPlan, isCheckingOut }: HeroSectionProps) {
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
          {!isCheckingOut && (
            <Button 
              onClick={onGetPlan}
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
