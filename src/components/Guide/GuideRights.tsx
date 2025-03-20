
import { Button } from '@/components/ui/button';
import { ChevronRight, ArrowLeft, Shield, AlertTriangle, HelpCircle, CheckCircle } from 'lucide-react';

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
        
        {/* Nova seção sobre Riscos e Intervenções */}
        <div className="bg-amber-50 p-6 rounded-lg mt-10 mb-8 border border-amber-200">
          <h2 className="text-2xl font-semibold text-maternal-800 mb-4 flex items-center">
            <AlertTriangle className="mr-2 h-6 w-6 text-amber-600" /> 
            Riscos e Intervenções no Parto
          </h2>
          
          <p className="mb-4">
            Entender os riscos e as intervenções comuns no parto é essencial para tomar decisões informadas 
            e garantir seus direitos. Isso permite que você discuta com sua equipe médica antes do momento do parto.
          </p>
          
          <div className="space-y-6 mt-6">
            <div className="bg-white p-4 rounded-lg shadow-sm">
              <h3 className="text-xl font-medium text-maternal-800 mb-2 flex items-center">
                <AlertTriangle className="mr-2 h-5 w-5 text-amber-600" />
                O "Efeito Cascata" de Intervenções
              </h3>
              <p className="mb-2">
                Um termo importante que toda gestante deve conhecer é o "efeito cascata". Este fenômeno ocorre quando uma intervenção 
                inicial leva à necessidade de outras intervenções, criando uma série de procedimentos que podem aumentar os riscos.
              </p>
              <p className="mb-2">
                Por exemplo: a indução artificial do trabalho de parto pode levar a contrações mais intensas e dolorosas, 
                que por sua vez podem levar à necessidade de analgesia, que pode diminuir a eficácia das contrações, levando 
                ao uso de ocitocina sintética, que pode causar sofrimento fetal, potencialmente resultando em uma cesárea de emergência.
              </p>
            </div>
            
            <div className="bg-white p-4 rounded-lg shadow-sm">
              <h3 className="text-xl font-medium text-maternal-800 mb-2 flex items-center">
                <HelpCircle className="mr-2 h-5 w-5 text-maternal-600" />
                Perguntas Essenciais Para Fazer
              </h3>
              <p className="mb-2">
                Quando uma intervenção for sugerida, faça estas perguntas para tomar uma decisão informada:
              </p>
              <ul className="list-disc pl-5 space-y-1 mb-4">
                <li>Por que essa intervenção é necessária? Existe uma emergência real?</li>
                <li>Quais são os riscos e benefícios deste procedimento?</li>
                <li>Existem alternativas? Quais são elas?</li>
                <li>O que acontece se esperarmos mais um pouco ou não fizermos nada?</li>
                <li>Este é um procedimento baseado em evidências científicas?</li>
              </ul>
            </div>
            
            <div className="bg-white p-4 rounded-lg shadow-sm">
              <h3 className="text-xl font-medium text-maternal-800 mb-2 flex items-center">
                <CheckCircle className="mr-2 h-5 w-5 text-green-600" />
                Estratégias Para Prevenir Intervenções Desnecessárias
              </h3>
              <ul className="list-disc pl-5 space-y-1 mb-4">
                <li>Escolha cuidadosamente sua equipe de assistência ao parto, buscando profissionais que respeitem suas escolhas</li>
                <li>Contrate uma doula para suporte contínuo durante o trabalho de parto</li>
                <li>Adie a ida para o hospital até estar em trabalho de parto ativo (consultando sua equipe médica)</li>
                <li>Mantenha-se ativa e vertical durante o trabalho de parto quando possível</li>
                <li>Utilize métodos não-farmacológicos de alívio da dor</li>
                <li>Tenha um acompanhante informado e preparado para apoiar suas decisões</li>
                <li>Comunique claramente seu plano de parto à equipe médica</li>
              </ul>
            </div>
            
            <div className="bg-white p-4 rounded-lg shadow-sm">
              <h3 className="text-xl font-medium text-maternal-800 mb-2 flex items-center">
                <Shield className="mr-2 h-5 w-5 text-maternal-600" />
                Mitos e Verdades Sobre Intervenções
              </h3>
              <div className="space-y-3">
                <div>
                  <p className="font-medium text-maternal-900">Mito: "Todas as gestantes precisam de monitoramento fetal contínuo."</p>
                  <p className="text-sm text-maternal-700">Verdade: Para gestações de baixo risco, o monitoramento intermitente é igualmente seguro e permite maior mobilidade.</p>
                </div>
                <div>
                  <p className="font-medium text-maternal-900">Mito: "A episiotomia previne lacerações graves."</p>
                  <p className="text-sm text-maternal-700">Verdade: A pesquisa atual mostra que a episiotomia de rotina não previne lacerações e pode até aumentar o risco de lacerações mais graves.</p>
                </div>
                <div>
                  <p className="font-medium text-maternal-900">Mito: "Você não pode comer ou beber durante o trabalho de parto."</p>
                  <p className="text-sm text-maternal-700">Verdade: Em partos de baixo risco, a ingestão de líquidos claros e alimentos leves é considerada segura e pode fornecer energia necessária.</p>
                </div>
                <div>
                  <p className="font-medium text-maternal-900">Mito: "A indução é necessária logo após 40 semanas."</p>
                  <p className="text-sm text-maternal-700">Verdade: Gestações saudáveis podem continuar até 41-42 semanas com monitoramento adequado. A decisão de induzir deve considerar diversos fatores individuais.</p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="bg-amber-100 p-4 rounded-lg mt-6">
            <p className="font-medium">
              Lembre-se: Em situações de emergência real, intervenções médicas podem ser necessárias e salvar vidas. 
              O objetivo não é evitar todas as intervenções, mas garantir que sejam feitas apenas quando realmente necessárias 
              e com seu consentimento informado.
            </p>
          </div>
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
          Próximo: Comunicação Eficaz <ChevronRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
