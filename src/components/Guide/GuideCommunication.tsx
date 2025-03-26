
import { Button } from '@/components/ui/button';
import { ChevronRight, ArrowLeft } from 'lucide-react';

interface GuideCommunicationProps {
  onNext: () => void;
  onPrevious: () => void;
}

export function GuideCommunication({ onPrevious, onNext }: GuideCommunicationProps) {
  return (
    <div className="animate-fade-in">
      <h1 className="text-3xl font-bold text-maternal-900 mb-6">Como se Comunicar com a Equipe Médica</h1>
      
      <div className="prose max-w-none">
        <p className="text-lg mb-4">
          Mesmo com um plano de parto bem estruturado, a comunicação eficaz com sua equipe 
          médica é essencial para garantir que suas preferências sejam compreendidas e respeitadas.
        </p>
        
        <h2 className="text-2xl font-semibold text-maternal-800 mt-8 mb-4">Dicas para uma Comunicação Eficaz</h2>
        
        <ul className="list-disc pl-5 space-y-2 mb-6">
          <li>
            <strong>Comece cedo:</strong> Converse sobre suas preferências de parto com sua 
            equipe durante o pré-natal, não apenas no momento do parto.
          </li>
          <li>
            <strong>Seja clara e direta:</strong> Explique suas preferências de forma simples e objetiva.
          </li>
          <li>
            <strong>Faça perguntas:</strong> Se algo não estiver claro, não hesite em pedir explicações.
          </li>
          <li>
            <strong>Use "CÉREBRO":</strong> Um acrônimo útil para tomar decisões informadas:
            <ul className="list-disc pl-5 mt-2">
              <li><strong>C</strong>ontraindicações: Há alguma contraindicação para mim ou meu bebê?</li>
              <li><strong>E</strong>vidências: Quais são as evidências científicas que apoiam esta intervenção?</li>
              <li><strong>R</strong>iscos: Quais são os riscos associados?</li>
              <li><strong>E</strong>feitos benéficos: Quais são os benefícios?</li>
              <li><strong>B</strong>om senso: O que meu instinto diz?</li>
              <li><strong>R</strong>esponda: Para si mesma, após refletir sobre os pontos anteriores.</li>
              <li><strong>O</strong>ption Zero: Há alguma outra opção? Podemos esperar?</li>
            </ul>
          </li>
          <li>
            <strong>Tenha um acompanhante informado:</strong> Seu acompanhante deve conhecer seu plano 
            de parto e estar preparado para defender suas preferências quando você estiver focada no trabalho de parto.
          </li>
        </ul>
        
        <h2 className="text-2xl font-semibold text-maternal-800 mt-8 mb-4">Como Lidar com Resistência</h2>
        
        <p className="mb-4">
          Infelizmente, nem todos os profissionais estão abertos a planos de parto. Aqui estão algumas estratégias 
          para lidar com resistência:
        </p>
        
        <div className="bg-maternal-50 p-4 rounded-lg mb-6">
          <ul className="list-disc pl-5 space-y-2">
            <li>
              <strong>Escolha sua equipe com cuidado:</strong> Se possível, escolha profissionais que sejam 
              conhecidos por respeitar as preferências das gestantes.
            </li>
            <li>
              <strong>Seja flexível, mas firme:</strong> Esteja aberta a adaptações, mas mantenha-se firme 
              em relação às suas prioridades mais importantes.
            </li>
            <li>
              <strong>Use a técnica "sim, e...":</strong> Em vez de confrontar diretamente, reconheça 
              a perspectiva do profissional e adicione a sua: "Sim, entendo sua preocupação, e gostaria 
              de discutir como podemos adaptar esse procedimento às minhas preferências."
            </li>
            <li>
              <strong>Peça tempo:</strong> Se não for uma emergência, peça alguns minutos para discutir 
              com seu acompanhante ou para refletir sobre a situação.
            </li>
            <li>
              <strong>Documente tudo:</strong> Anote o nome dos profissionais, horários e o que foi dito, 
              especialmente em casos de desrespeito ou violência obstétrica.
            </li>
          </ul>
        </div>
        
        <h2 className="text-2xl font-semibold text-maternal-800 mt-8 mb-4">Preparando seu Acompanhante</h2>
        
        <p className="mb-4">
          Seu acompanhante é seu aliado mais importante durante o parto. Certifique-se de que ele:
        </p>
        
        <ul className="list-disc pl-5 space-y-2 mb-6">
          <li>Conheça seu plano de parto tão bem quanto você</li>
          <li>Saiba quais são suas prioridades absolutas</li>
          <li>Esteja preparado para ser sua voz quando você não puder falar por si mesma</li>
          <li>Tenha uma lista de perguntas para fazer à equipe médica em diferentes cenários</li>
          <li>Saiba como dar suporte físico e emocional durante o trabalho de parto</li>
        </ul>
        
        <div className="bg-maternal-100 p-4 rounded-lg border-l-4 border-maternal-600 mb-6">
          <p className="font-medium text-maternal-900">
            Lembre-se: A comunicação eficaz começa muito antes do parto. Construa um relacionamento 
            de confiança com sua equipe médica durante o pré-natal e esteja preparada para defender 
            suas preferências de forma assertiva, mas respeitosa.
          </p>
        </div>
      </div>
      
      <div className="mt-8 flex justify-between">
        <Button 
          variant="navigation" 
          onClick={onPrevious}
          className="flex items-center"
        >
          <ArrowLeft className="mr-2 h-4 w-4" /> Voltar à Estrutura
        </Button>
        
        <Button 
          onClick={onNext}
          variant="navigation"
          className="flex items-center"
        >
          Próximo: Checklist Essencial <ChevronRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
