
import { Button } from '@/components/ui/button';
import { ArrowLeft, ArrowRight, ExternalLink } from 'lucide-react';
import { ProceduresSection } from './ProceduresSection';
import { ConsultationSection } from './ConsultationSection';
import { ProductsSection } from './ProductsSection';
import { NextStepsSection } from './NextStepsSection';

const WIX_PLANS_URL = "https://www.energiamaterna.com.br/planos";

interface GuideResourcesProps {
  onPrevious: () => void;
}

export function GuideResources({ onPrevious }: GuideResourcesProps) {
  return (
    <div className="animate-fade-in">
      <h1 className="text-3xl font-bold text-maternal-900 mb-6">Recursos Adicionais</h1>
      
      {/* Wix Plans CTA */}
      <div className="bg-maternal-100 border-l-4 border-maternal-500 p-6 rounded-md mb-8">
        <h2 className="text-2xl font-bold text-maternal-800 mb-3">Nossos Planos</h2>
        <p className="text-maternal-700 mb-4">
          Para aprofundar sua jornada de preparação para o parto, oferecemos três opções de planos 
          adaptados às suas necessidades:
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          {/* Free Plan */}
          <div className="bg-white p-4 rounded-md shadow-sm border border-maternal-200">
            <h3 className="font-bold text-maternal-900 mb-2">Plano Básico</h3>
            <p className="text-maternal-700 text-sm mb-2">Gratuito</p>
            <ul className="text-sm space-y-1 mb-4">
              <li>• Acesso ao Guia Online</li>
              <li>• Checklist do Plano de Parto</li>
              <li>• Dicas de comunicação</li>
            </ul>
            <div className="text-maternal-500 text-sm font-medium">Você está aqui!</div>
          </div>
          
          {/* Essential Plan */}
          <div className="bg-maternal-50 p-4 rounded-md shadow-md border-2 border-maternal-300">
            <h3 className="font-bold text-maternal-900 mb-2">Plano Essencial</h3>
            <p className="text-maternal-700 text-sm mb-2">R$ 97,00</p>
            <ul className="text-sm space-y-1 mb-4">
              <li>• Construtor de Plano de Parto</li>
              <li>• Consulta Acolhedora</li>
              <li>• Acesso ao Guia Online</li>
            </ul>
            <a 
              href={`${WIX_PLANS_URL}#essencial`} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="text-sm font-medium text-maternal-600 hover:text-maternal-800 flex items-center"
            >
              Saiba mais <ExternalLink className="h-3 w-3 ml-1" />
            </a>
          </div>
          
          {/* Special Plan */}
          <div className="bg-maternal-50 p-4 rounded-md shadow-md border-2 border-maternal-300">
            <h3 className="font-bold text-maternal-900 mb-2">Plano Especial</h3>
            <p className="text-maternal-700 text-sm mb-2">R$ 180,00</p>
            <ul className="text-sm space-y-1 mb-4">
              <li>• Construtor de Plano de Parto</li>
              <li>• Consulta Acolhedora</li>
              <li>• Produtos Virtuais Completos</li>
              <li>• Acesso ao Guia Online</li>
            </ul>
            <a 
              href={`${WIX_PLANS_URL}#especial`} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="text-sm font-medium text-maternal-600 hover:text-maternal-800 flex items-center"
            >
              Saiba mais <ExternalLink className="h-3 w-3 ml-1" />
            </a>
          </div>
        </div>
        
        <div className="text-center">
          <a 
            href={WIX_PLANS_URL} 
            target="_blank" 
            rel="noopener noreferrer" 
            className="inline-flex items-center bg-maternal-600 text-white px-6 py-3 rounded-md font-medium hover:bg-maternal-700 transition-colors"
          >
            Ver Detalhes dos Planos <ArrowRight className="ml-2 h-4 w-4" />
          </a>
        </div>
      </div>
      
      <div className="prose max-w-none">
        <ProceduresSection />
        
        <ConsultationSection wixPlansUrl={WIX_PLANS_URL} />
        
        <ProductsSection wixPlansUrl={WIX_PLANS_URL} />
        
        <NextStepsSection wixPlansUrl={WIX_PLANS_URL} />
      </div>
      
      <div className="mt-8">
        <Button 
          variant="navigation"
          onClick={onPrevious}
          className="flex items-center"
        >
          <ArrowLeft className="mr-2 h-4 w-4" /> Voltar ao Checklist
        </Button>
      </div>
    </div>
  );
}
