
import { Button } from '@/components/ui/button';
import { ChevronRight, ArrowLeft, Shield } from 'lucide-react';

interface GuideRightsProps {
  onPrevious: () => void;
  onNext: () => void;
}

export function GuideRights({ onPrevious, onNext }: GuideRightsProps) {
  return (
    <div className="animate-fade-in">
      <h1 className="text-3xl font-bold text-maternal-900 mb-6">Seus Direitos no Parto</h1>
      
      <div className="prose max-w-none">
        <p className="text-lg mb-4">
          Conhecer seus direitos é fundamental para garantir um parto respeitoso. 
          No Brasil, diversas leis e normas protegem as gestantes durante todo o processo.
        </p>
        
        <div className="bg-maternal-50 p-6 rounded-lg mb-8">
          <h2 className="text-2xl font-semibold text-maternal-800 mb-4 flex items-center">
            <Shield className="mr-2 h-6 w-6 text-maternal-600" /> 
            Principais Direitos Garantidos por Lei
          </h2>
          
          <div className="space-y-6">
            <div className="bg-white p-4 rounded-lg shadow-sm">
              <h3 className="text-xl font-medium text-maternal-800 mb-2">Acompanhante de Escolha</h3>
              <p className="mb-2">
                <strong>Lei Federal nº 11.108/2005:</strong> Garante à gestante o direito a um acompanhante 
                de sua livre escolha durante todo o período de trabalho de parto, parto e pós-parto imediato.
              </p>
              <p className="text-sm text-maternal-700">
                Este direito é válido tanto no SUS quanto em hospitais privados, e não pode ser negado sob nenhuma circunstância.
              </p>
            </div>
            
            <div className="bg-white p-4 rounded-lg shadow-sm">
              <h3 className="text-xl font-medium text-maternal-800 mb-2">Atendimento Humanizado</h3>
              <p className="mb-2">
                <strong>Lei nº 17.137/2019 (Estado de São Paulo):</strong> Estabelece o direito à assistência humanizada à mulher em trabalho de parto, parto e puerpério.
              </p>
              <p className="text-sm text-maternal-700">
                Diversos estados e municípios possuem leis semelhantes que garantem o direito ao parto humanizado.
              </p>
            </div>
            
            <div className="bg-white p-4 rounded-lg shadow-sm">
              <h3 className="text-xl font-medium text-maternal-800 mb-2">Presença de Doula</h3>
              <p className="mb-2">
                <strong>Leis estaduais e municipais:</strong> Muitos estados e municípios possuem legislação 
                específica que garante o direito à presença de doulas durante o trabalho de parto e parto, 
                além do acompanhante.
              </p>
              <p className="text-sm text-maternal-700">
                Verifique a legislação do seu estado ou município sobre a presença de doulas.
              </p>
            </div>
            
            <div className="bg-white p-4 rounded-lg shadow-sm">
              <h3 className="text-xl font-medium text-maternal-800 mb-2">Vinculação à Maternidade</h3>
              <p className="mb-2">
                <strong>Lei nº 11.634/2007:</strong> Garante à gestante o direito ao conhecimento e à vinculação 
                prévia à maternidade onde será realizado seu parto.
              </p>
              <p className="text-sm text-maternal-700">
                Você tem o direito de conhecer a maternidade onde ocorrerá seu parto e fazer visitas prévias.
              </p>
            </div>
          </div>
        </div>
        
        <h2 className="text-2xl font-semibold text-maternal-800 mt-8 mb-4">Direitos Recomendados pela OMS</h2>
        
        <p className="mb-4">
          Além dos direitos garantidos por lei, a Organização Mundial da Saúde (OMS) 
          recomenda diversas práticas que devem ser respeitadas durante o parto:
        </p>
        
        <ul className="list-disc pl-5 space-y-2 mb-6">
          <li>Liberdade de posição e movimento durante o trabalho de parto</li>
          <li>Métodos não farmacológicos de alívio da dor</li>
          <li>Contato pele a pele imediato entre mãe e bebê</li>
          <li>Clampeamento tardio do cordão umbilical</li>
          <li>Amamentação na primeira hora de vida</li>
          <li>Não separação da mãe e do bebê</li>
          <li>Respeito à privacidade e dignidade</li>
        </ul>
        
        <div className="bg-maternal-100 p-4 rounded-lg border-l-4 border-maternal-600 mb-6">
          <p className="font-medium text-maternal-900">
            Importante: Mesmo durante emergências ou procedimentos não planejados, você continua
            tendo o direito a informações claras, respeito e dignidade. Você nunca perde o direito
            de participar das decisões sobre seu corpo e seu bebê.
          </p>
        </div>
        
        <h2 className="text-2xl font-semibold text-maternal-800 mt-8 mb-4">Evitando Violência Obstétrica</h2>
        
        <p className="mb-4">
          Violência obstétrica é qualquer ato que cause danos físicos ou psicológicos à mulher durante a gestação, 
          parto ou pós-parto. Inclui procedimentos sem consentimento, tratamento desrespeitoso, negação de direitos,
          entre outros.
        </p>
        
        <p className="mb-4">
          Seu plano de parto é uma ferramenta importante para prevenir situações de violência obstétrica,
          pois documenta suas escolhas e preferências com antecedência.
        </p>
      </div>
      
      <div className="mt-8 flex justify-between">
        <Button 
          variant="outline" 
          onClick={onPrevious}
          className="flex items-center"
        >
          <ArrowLeft className="mr-2 h-4 w-4" /> Voltar à Estrutura
        </Button>
        
        <Button 
          onClick={onNext}
          className="bg-maternal-600 hover:bg-maternal-700 flex items-center"
        >
          Próximo: Comunicação Eficaz <ChevronRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
