
import { StepCard } from './StepCard';
import { ArrowRight } from 'lucide-react';

interface NextStepsSectionProps {
  wixPlansUrl?: string;
}

export function NextStepsSection({ wixPlansUrl = "https://www.energiamaterna.com.br/planos" }: NextStepsSectionProps) {
  return (
    <section className="my-8">
      <h2 className="text-2xl font-bold text-maternal-900 mb-4">Próximos Passos</h2>
      
      <p className="mb-6">
        Agora que você concluiu este guia, aqui estão os próximos passos recomendados 
        para continuar sua jornada para um parto mais consciente e respeitoso:
      </p>
      
      <div className="space-y-6 mb-8">
        <StepCard 
          stepNumber={1}
          title="Escolha um plano adequado às suas necessidades"
          description="Avalie os planos disponíveis e escolha o que melhor atende às suas expectativas para o parto."
        />
        
        <StepCard 
          stepNumber={2}
          title="Crie seu plano de parto personalizado"
          description="Com o Plano Essencial ou Especial, utilize o construtor de plano de parto para criar um documento personalizado."
        />
        
        <StepCard 
          stepNumber={3}
          title="Agende sua Consulta Acolhedora"
          description="Disponível nos planos Essencial e Especial, converse com especialistas sobre suas dúvidas e revise seu plano de parto."
        />
        
        <StepCard 
          stepNumber={4}
          title="Utilize os materiais complementares"
          description="Aproveite os produtos virtuais inclusos no Plano Especial para uma preparação completa."
        />
      </div>
      
      <div className="bg-maternal-100 p-6 rounded-lg border-l-4 border-maternal-500">
        <h3 className="font-bold text-maternal-800 mb-2">Pronta para dar o próximo passo?</h3>
        <p className="mb-4">
          O Guia Online é apenas o início da sua jornada. Para um suporte mais completo, 
          considere um dos nossos planos pagos.
        </p>
        <div className="text-center">
          <a 
            href={wixPlansUrl}
            target="_blank" 
            rel="noopener noreferrer" 
            className="inline-flex items-center bg-maternal-600 text-white px-6 py-2 rounded-md font-medium hover:bg-maternal-700 transition-colors"
          >
            Conhecer os Planos <ArrowRight className="ml-2 h-4 w-4" />
          </a>
        </div>
      </div>
    </section>
  );
}
