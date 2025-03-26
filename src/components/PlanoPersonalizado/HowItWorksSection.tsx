
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';

interface HowItWorksSectionProps {
  isCheckingPayment: boolean;
  hasPaid: boolean;
  handleAccessPlan: () => void;
  handlePurchase: () => void;
}

export function HowItWorksSection({ 
  isCheckingPayment, 
  hasPaid, 
  handleAccessPlan, 
  handlePurchase 
}: HowItWorksSectionProps) {
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
            <h3 className="text-xl font-semibold text-maternal-900 mb-3">Faça seu pagamento</h3>
            <p className="text-maternal-700">
              Acesso único por R$ 97,00 válido por 9 meses, tempo suficiente para planejar e ajustar seu plano até o nascimento
            </p>
          </div>
          
          <div className="bg-white rounded-xl p-8 border border-maternal-100 shadow-sm text-center">
            <div className="bg-maternal-100 text-maternal-600 h-16 w-16 rounded-full flex items-center justify-center mx-auto mb-6">
              <span className="text-2xl font-bold">2</span>
            </div>
            <h3 className="text-xl font-semibold text-maternal-900 mb-3">Personalize</h3>
            <p className="text-maternal-700">
              Responda algumas perguntas simples e nosso construtor criará automaticamente um plano de parto para você editar
            </p>
          </div>
          
          <div className="bg-white rounded-xl p-8 border border-maternal-100 shadow-sm text-center">
            <div className="bg-maternal-100 text-maternal-600 h-16 w-16 rounded-full flex items-center justify-center mx-auto mb-6">
              <span className="text-2xl font-bold">3</span>
            </div>
            <h3 className="text-xl font-semibold text-maternal-900 mb-3">Compartilhe</h3>
            <p className="text-maternal-700">
              Imprima e compartilhe seu plano com sua equipe médica e acompanhantes
            </p>
          </div>
        </div>
        
        {isCheckingPayment ? (
          <div className="flex justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-maternal-600"></div>
          </div>
        ) : hasPaid ? (
          <div className="text-center">
            <Button 
              onClick={handleAccessPlan}
              className="btn-primary"
            >
              Acessar Meu Plano de Parto <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        ) : (
          <div className="text-center">
            <Button 
              onClick={handlePurchase}
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
