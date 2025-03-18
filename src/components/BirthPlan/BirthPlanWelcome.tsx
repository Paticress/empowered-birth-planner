
import { Button } from '@/components/ui/button';
import { ChevronRight } from 'lucide-react';

interface BirthPlanWelcomeProps {
  onStart: () => void;
}

export function BirthPlanWelcome({ onStart }: BirthPlanWelcomeProps) {
  return (
    <div className="animate-fade-in">
      <h1 className="text-3xl font-bold text-maternal-900 mb-6">Bem-vinda ao Construtor de Plano de Parto!</h1>
      
      <div className="prose max-w-none">
        <p className="text-lg mb-4">
          Olá! Estamos muito felizes que você decidiu criar seu plano de parto personalizado.
        </p>
        
        <p className="mb-6">
          Este construtor vai te guiar através de um processo simples para criar um plano de parto
          detalhado que atenda às suas necessidades específicas e preferências para o nascimento do seu bebê.
        </p>
        
        <h2 className="text-2xl font-semibold text-maternal-800 mt-8 mb-4">Como funciona?</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-maternal-50 p-6 rounded-lg border border-maternal-100">
            <div className="flex items-center mb-4">
              <div className="bg-maternal-600 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold mr-2">1</div>
              <h3 className="font-semibold text-lg">Responda um questionário</h3>
            </div>
            <p>Compartilhe informações sobre sua gravidez, condições de saúde e preferências para o parto.</p>
          </div>
          
          <div className="bg-maternal-50 p-6 rounded-lg border border-maternal-100">
            <div className="flex items-center mb-4">
              <div className="bg-maternal-600 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold mr-2">2</div>
              <h3 className="font-semibold text-lg">Personalize seu plano</h3>
            </div>
            <p>Com base nas suas respostas, criaremos um plano inicial que você poderá editar e personalizar.</p>
          </div>
          
          <div className="bg-maternal-50 p-6 rounded-lg border border-maternal-100">
            <div className="flex items-center mb-4">
              <div className="bg-maternal-600 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold mr-2">3</div>
              <h3 className="font-semibold text-lg">Compartilhe e imprima</h3>
            </div>
            <p>Quando estiver pronto, você poderá compartilhar seu plano com sua equipe médica e imprimi-lo.</p>
          </div>
        </div>
        
        <div className="bg-maternal-100 p-6 rounded-lg border-l-4 border-maternal-600 mb-6">
          <p className="font-medium text-maternal-900">
            Importante: Este plano de parto é um documento de comunicação, não um contrato rígido.
            É recomendável discutir seu plano finalizado com seu médico ou obstetra para garantir
            que ele seja adequado para sua situação específica.
          </p>
        </div>
      </div>
      
      <div className="mt-8 text-center">
        <Button 
          onClick={onStart}
          className="bg-maternal-600 hover:bg-maternal-700 flex items-center mx-auto"
        >
          Começar a criar meu Plano de Parto <ChevronRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
