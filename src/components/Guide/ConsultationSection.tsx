
import { ExternalLink } from 'lucide-react';

interface ConsultationSectionProps {
  wixPlansUrl?: string;
}

export function ConsultationSection({ wixPlansUrl = "https://www.energiamaterna.com.br/planos" }: ConsultationSectionProps) {
  return (
    <section className="my-8">
      <h2 className="text-2xl font-bold text-maternal-900 mb-4">Consulta Acolhedora</h2>
      
      <div className="bg-white p-6 rounded-lg shadow-sm border border-maternal-200 mb-6">
        <p className="mb-4">
          Nossa Consulta Acolhedora é um espaço seguro para tirar todas as suas dúvidas sobre o parto,
          plano de parto e preparativos para o nascimento do seu bebê.
        </p>
        
        <h3 className="text-lg font-semibold text-maternal-800 mb-2">O que você recebe:</h3>
        <ul className="space-y-2 mb-4">
          <li className="flex items-start">
            <span className="text-maternal-500 mr-2">•</span> 
            <span>Atendimento personalizado com especialista em parto humanizado</span>
          </li>
          <li className="flex items-start">
            <span className="text-maternal-500 mr-2">•</span> 
            <span>Revisão do seu plano de parto com orientações específicas</span>
          </li>
          <li className="flex items-start">
            <span className="text-maternal-500 mr-2">•</span> 
            <span>Orientação sobre o que esperar em diferentes cenários de parto</span>
          </li>
          <li className="flex items-start">
            <span className="text-maternal-500 mr-2">•</span> 
            <span>Dicas para comunicação assertiva com a equipe médica</span>
          </li>
        </ul>
        
        <div className="text-maternal-700 italic mb-4">
          <p>
            A Consulta Acolhedora está incluída nos planos Essencial e Especial.
          </p>
        </div>
        
        <div className="text-center">
          <a 
            href={`${wixPlansUrl}#essencial`} 
            target="_blank" 
            rel="noopener noreferrer" 
            className="inline-flex items-center text-maternal-600 font-medium hover:text-maternal-800"
          >
            Ver detalhes no Plano Essencial <ExternalLink className="ml-1 h-4 w-4" />
          </a>
        </div>
      </div>
    </section>
  );
}
