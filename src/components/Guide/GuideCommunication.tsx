
import { Button } from '@/components/ui/button';
import { ChevronRight, ArrowLeft, MessageCircle } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';

interface GuideCommunicationProps {
  onPrevious: () => void;
  onNext: () => void;
}

export function GuideCommunication({ onPrevious, onNext }: GuideCommunicationProps) {
  const isMobile = useIsMobile();
  
  return (
    <div className="animate-fade-in">
      <h1 className="text-3xl font-bold text-maternal-900 mb-6">Comunicação Eficaz com a Equipe Médica</h1>
      
      <div className="prose max-w-none">
        <p className="text-lg mb-4">
          Uma comunicação clara e eficaz com sua equipe médica é essencial para garantir que suas 
          preferências sejam respeitadas durante o parto.
        </p>
        
        <h2 className="text-2xl font-semibold text-maternal-800 mt-8 mb-4">Apresentando seu Plano de Parto</h2>
        
        <div className="space-y-6 mb-8">
          <div className="bg-white p-5 rounded-lg border border-maternal-200 shadow-sm">
            <h3 className="text-xl font-medium text-maternal-800 mb-3">Quando apresentar</h3>
            <p>
              Idealmente, discuta seu plano de parto com seu médico/obstetra durante 
              o pré-natal, por volta da 32ª-34ª semana. Isso permite tempo para esclarecer 
              dúvidas e fazer ajustes se necessário.
            </p>
            <p className="mt-2">
              Leve cópias do seu plano de parto no dia do parto para entregar à equipe 
              de plantão no hospital/maternidade.
            </p>
          </div>
          
          <div className="bg-white p-5 rounded-lg border border-maternal-200 shadow-sm">
            <h3 className="text-xl font-medium text-maternal-800 mb-3">Como apresentar</h3>
            <ul className="list-disc pl-5 space-y-2">
              <li>
                <strong>Seja educada e assertiva:</strong> Apresente seu plano de parto como 
                um documento que expressa suas preferências, não como exigências rígidas.
              </li>
              <li>
                <strong>Mostre flexibilidade:</strong> Reconheça que circunstâncias inesperadas 
                podem requerer adaptações no plano.
              </li>
              <li>
                <strong>Esteja aberta ao diálogo:</strong> Escute as orientações médicas e 
                esteja disposta a discutir alternativas.
              </li>
              <li>
                <strong>Envolva seu acompanhante:</strong> Certifique-se de que seu acompanhante 
                conheça bem seu plano e possa ajudar a comunicá-lo à equipe.
              </li>
            </ul>
          </div>
        </div>
        
        <h2 className="text-2xl font-semibold text-maternal-800 mt-8 mb-4">Perguntas Essenciais: O método B.R.A.I.N</h2>
        
        <p className="mb-4">
          Durante o trabalho de parto e parto, podem surgir situações onde você precisará 
          tomar decisões sobre procedimentos ou intervenções. O método B.R.A.I.N pode te 
          ajudar a obter as informações necessárias para tomar decisões informadas:
        </p>
        
        <div className={`grid ${isMobile ? 'grid-cols-1' : 'grid-cols-5'} gap-4 mb-8`}>
          <div className="bg-maternal-50 p-4 rounded-lg">
            <p className="font-bold text-maternal-900 mb-1">B = Benefícios</p>
            <p className="text-maternal-700">
              "Quais são os benefícios desse procedimento/intervenção?"
            </p>
          </div>
          
          <div className="bg-maternal-50 p-4 rounded-lg">
            <p className="font-bold text-maternal-900 mb-1">R = Riscos</p>
            <p className="text-maternal-700">
              "Quais são os riscos ou efeitos colaterais possíveis?"
            </p>
          </div>
          
          <div className="bg-maternal-50 p-4 rounded-lg">
            <p className="font-bold text-maternal-900 mb-1">A = Alternativas</p>
            <p className="text-maternal-700">
              "Existem alternativas a esse procedimento/intervenção?"
            </p>
          </div>
          
          <div className="bg-maternal-50 p-4 rounded-lg">
            <p className="font-bold text-maternal-900 mb-1">I = Intuição</p>
            <p className="text-maternal-700">
              "O que a minha intuição me diz sobre isso?"
            </p>
          </div>
          
          <div className="bg-maternal-50 p-4 rounded-lg">
            <p className="font-bold text-maternal-900 mb-1">N = Nada</p>
            <p className="text-maternal-700">
              "O que acontece se não fizermos nada? Podemos esperar um pouco?"
            </p>
          </div>
        </div>
        
        <h2 className="text-2xl font-semibold text-maternal-800 mt-8 mb-4">Lidando com Resistência</h2>
        
        <p className="mb-4">
          Infelizmente, você pode encontrar resistência a algumas de suas preferências. 
          Aqui estão algumas estratégias para lidar com essa situação:
        </p>
        
        <ul className="list-disc pl-5 space-y-3 mb-6">
          <li>
            <strong>Pergunte os motivos:</strong> Se sua preferência for recusada, peça esclarecimentos 
            sobre o porquê. Às vezes, há razões médicas válidas.
          </li>
          <li>
            <strong>Sugira compromissos:</strong> Se o problema for o "como" e não o "o quê", 
            busque alternativas que atendam tanto suas necessidades quanto as preocupações médicas.
          </li>
          <li>
            <strong>Peça um momento:</strong> Solicite um tempo para conversar com seu acompanhante 
            e considerar suas opções, a menos que seja uma emergência genuína.
          </li>
          <li>
            <strong>Conheça o suporte disponível:</strong> Algumas maternidades têm ouvidoria 
            ou profissionais dedicados à humanização que podem ajudar a mediar dificuldades.
          </li>
        </ul>
        
        <div className="bg-maternal-100 p-4 rounded-lg border-l-4 border-maternal-600 mb-6">
          <p className="font-medium text-maternal-900">
            Lembre-se: A comunicação respeitosa e baseada em evidências beneficia a todos. 
            A maioria dos profissionais de saúde quer o melhor para você e seu bebê, mesmo 
            que às vezes haja discordâncias sobre qual é o melhor caminho.
          </p>
        </div>
        
        <h2 className="text-2xl font-semibold text-maternal-800 mt-8 mb-4">O Papel do Acompanhante/Doula</h2>
        
        <p className="mb-4">
          Seu acompanhante e/ou doula podem ser fundamentais no processo de comunicação:
        </p>
        
        <ul className="list-disc pl-5 space-y-2 mb-6">
          <li>Eles podem ajudar a comunicar suas preferências quando você estiver concentrada no trabalho de parto</li>
          <li>Podem fazer perguntas à equipe médica em seu nome</li>
          <li>Podem te lembrar das informações e opções disponíveis</li>
          <li>Podem oferecer apoio emocional durante momentos difíceis de tomada de decisão</li>
        </ul>
        
        <p>
          Certifique-se de que seu acompanhante e/ou doula conheçam bem seu plano de parto 
          e estejam preparados para apoiá-la durante todo o processo.
        </p>
      </div>
      
      <div className="mt-8 flex justify-between">
        <Button 
          variant="outline" 
          onClick={onPrevious}
          className="flex items-center"
        >
          <ArrowLeft className="mr-2 h-4 w-4" /> Voltar aos Direitos
        </Button>
        
        <Button 
          onClick={onNext}
          className="bg-maternal-600 hover:bg-maternal-700 flex items-center"
        >
          Próximo: Checklist Essencial <ChevronRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
