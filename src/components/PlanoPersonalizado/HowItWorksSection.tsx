
import { Button } from '@/components/ui/button';

interface HowItWorksSectionProps {
  onGetPlan: () => void;
  isCheckingOut: boolean;
}

export function HowItWorksSection({ onGetPlan, isCheckingOut }: HowItWorksSectionProps) {
  return (
    <section className="py-16 md:py-24 bg-maternal-50">
      <div className="landing-container">
        <div className="text-center mb-16 section-transition">
          <h2 className="heading-secondary text-maternal-900">Como Funciona?</h2>
          <p className="subheading max-w-3xl mx-auto">
            Nosso processo é simples e eficiente, permitindo que você tenha seu plano de parto pronto em poucos minutos
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          <div className="bg-white rounded-xl p-8 border border-maternal-100 shadow-sm text-center">
            <div className="bg-maternal-100 text-maternal-600 h-16 w-16 rounded-full flex items-center justify-center mx-auto mb-6">
              <span className="text-2xl font-bold">1</span>
            </div>
            <h3 className="text-xl font-semibold text-maternal-900 mb-3">Baixe o modelo</h3>
            <p className="text-maternal-700">
              Após a compra, você recebe acesso imediato ao modelo personalizável em formato editável
            </p>
          </div>
          
          <div className="bg-white rounded-xl p-8 border border-maternal-100 shadow-sm text-center">
            <div className="bg-maternal-100 text-maternal-600 h-16 w-16 rounded-full flex items-center justify-center mx-auto mb-6">
              <span className="text-2xl font-bold">2</span>
            </div>
            <h3 className="text-xl font-semibold text-maternal-900 mb-3">Personalize</h3>
            <p className="text-maternal-700">
              Preencha o modelo com suas escolhas e preferências para cada etapa do trabalho de parto
            </p>
          </div>
          
          <div className="bg-white rounded-xl p-8 border border-maternal-100 shadow-sm text-center">
            <div className="bg-maternal-100 text-maternal-600 h-16 w-16 rounded-full flex items-center justify-center mx-auto mb-6">
              <span className="text-2xl font-bold">3</span>
            </div>
            <h3 className="text-xl font-semibold text-maternal-900 mb-3">Utilize</h3>
            <p className="text-maternal-700">
              Imprima e compartilhe seu plano com sua equipe médica e acompanhantes
            </p>
          </div>
        </div>
        
        {!isCheckingOut && (
          <div className="text-center">
            <Button 
              onClick={onGetPlan}
              className="btn-primary"
            >
              Quero Meu Plano Agora
            </Button>
          </div>
        )}
      </div>
    </section>
  );
}
