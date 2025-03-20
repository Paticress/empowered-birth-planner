
import { AlertTriangle, HelpCircle, CheckCircle, Shield } from 'lucide-react';

export function RisksInterventionsSection() {
  return (
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
  );
}
