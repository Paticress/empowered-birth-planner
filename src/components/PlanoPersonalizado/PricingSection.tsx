
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Check } from 'lucide-react';

interface PricingSectionProps {
  hasPaid: boolean;
  handlePurchase: () => void;
}

export function PricingSection({ hasPaid, handlePurchase }: PricingSectionProps) {
  // Only render if user hasn't paid
  if (hasPaid) {
    return null;
  }
  
  return (
    <section className="py-16 md:py-24">
      <div className="landing-container">
        <div className="text-center mb-16 section-transition">
          <h2 className="heading-secondary text-maternal-900">Investimento</h2>
          <p className="subheading max-w-3xl mx-auto">
            Acesso completo ao construtor de plano de parto personalizado
          </p>
        </div>
        
        <div className="max-w-md mx-auto">
          <Card className="border-2 border-maternal-300 shadow-xl overflow-hidden">
            <div className="bg-maternal-600 p-6 text-white text-center">
              <h3 className="text-2xl font-bold">Construtor de Plano de Parto</h3>
              <p className="text-lg mt-2">Acesso por 9 meses</p>
            </div>
            
            <div className="p-6">
              <div className="text-center mb-6">
                <p className="text-4xl font-bold text-maternal-900">R$ 97,00</p>
                <p className="text-maternal-600">Pagamento único</p>
              </div>
              
              <ul className="space-y-3 mb-6">
                {[
                  "Questionário personalizado",
                  "Construtor automático de plano",
                  "Editor intuitivo de texto",
                  "Compartilhamento fácil",
                  "Gerador de PDF",
                  "Acesso por 9 meses",
                  "Atualizações ilimitadas durante o período"
                ].map((feature, index) => (
                  <li key={index} className="flex items-start">
                    <div className="bg-maternal-100 rounded-full p-1 mr-3 mt-0.5">
                      <Check className="h-4 w-4 text-maternal-600" />
                    </div>
                    <span className="text-maternal-700">{feature}</span>
                  </li>
                ))}
              </ul>
              
              <Button 
                onClick={handlePurchase}
                className="w-full py-6 text-lg"
                variant="birth-plan-builder"
              >
                Obter Acesso Agora
              </Button>
              
              <p className="text-xs text-center text-maternal-500 mt-4">
                Acesso imediato após a confirmação do pagamento
              </p>
            </div>
          </Card>
        </div>
      </div>
    </section>
  );
}
