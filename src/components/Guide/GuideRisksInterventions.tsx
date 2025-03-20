
import { 
  AlertTriangle, 
  HelpCircle, 
  Heart, 
  Shield, 
  MessageSquare, 
  Sparkles 
} from 'lucide-react';
import { 
  Accordion, 
  AccordionContent, 
  AccordionItem, 
  AccordionTrigger 
} from '@/components/ui/accordion';

export function GuideRisksInterventions() {
  return (
    <div className="bg-white border border-maternal-200 rounded-lg p-5 shadow-sm mb-8">
      <div className="flex items-start gap-3 mb-4">
        <div className="bg-orange-100 p-2 rounded-full">
          <AlertTriangle className="h-5 w-5 text-orange-500" />
        </div>
        <div>
          <h3 className="text-2xl font-semibold text-maternal-800">Entendendo Riscos e Intervenções</h3>
          <p className="text-maternal-700">
            Um plano de parto eficaz depende da sua compreensão sobre quando intervenções são necessárias
            e quando podem ser evitadas.
          </p>
        </div>
      </div>

      <div className="space-y-6">
        <div className="bg-orange-50 p-4 rounded-lg">
          <h4 className="text-lg font-medium text-maternal-800 flex items-center gap-2 mb-3">
            <HelpCircle className="h-5 w-5 text-orange-500" />
            Por que isso é importante?
          </h4>
          <p className="text-maternal-700 mb-3">
            Muitas gestantes não questionam procedimentos por receio de parecerem "difíceis" ou por 
            não saberem distinguir entre intervenções necessárias e desnecessárias. Um plano de parto 
            bem fundamentado ajuda a:
          </p>
          <ul className="list-disc pl-5 space-y-2 text-maternal-700">
            <li>Evitar procedimentos desnecessários que podem levar a complicações</li>
            <li>Aceitar intervenções genuinamente necessárias para sua segurança e a do bebê</li>
            <li>Ter mais controle e participação no processo do parto</li>
            <li>Reduzir a ansiedade causada por incertezas e surpresas</li>
          </ul>
        </div>

        <Accordion type="multiple" className="w-full">
          <AccordionItem value="cascade" className="border border-maternal-200 rounded-lg mb-3 overflow-hidden">
            <AccordionTrigger className="px-4 py-3 hover:bg-maternal-50 hover:no-underline">
              <div className="flex items-center gap-2 text-left">
                <Shield className="h-5 w-5 text-maternal-600 flex-shrink-0" />
                <span className="font-medium text-maternal-800">O efeito cascata de intervenções</span>
              </div>
            </AccordionTrigger>
            <AccordionContent className="px-4 pb-4 pt-1 bg-maternal-50">
              <p className="text-maternal-700 mb-3">
                Uma intervenção desnecessária frequentemente desencadeia a necessidade de outras, criando um 
                "efeito cascata" que pode resultar em um parto muito diferente do desejado:
              </p>
              
              <div className="bg-white p-3 rounded-md border border-maternal-200 mb-3">
                <h5 className="font-medium text-maternal-800 mb-2">Exemplo comum do efeito cascata:</h5>
                <ol className="list-decimal pl-5 text-maternal-700 space-y-1">
                  <li>Indução artificial do parto sem indicação médica clara</li>
                  <li>Contrações mais intensas e dolorosas que as naturais</li>
                  <li>Maior necessidade de analgesia</li>
                  <li>Diminuição da mobilidade e possível queda na pressão arterial</li>
                  <li>Desaceleração das contrações</li>
                  <li>Administração de ocitocina sintética</li>
                  <li>Aumento do estresse fetal</li>
                  <li>Maior probabilidade de cesariana de emergência</li>
                </ol>
              </div>
              
              <p className="text-maternal-700">
                Compreender este processo permite que você faça perguntas informadas e 
                tome decisões conscientes sobre cada intervenção proposta.
              </p>
            </AccordionContent>
          </AccordionItem>
          
          <AccordionItem value="myths" className="border border-maternal-200 rounded-lg mb-3 overflow-hidden">
            <AccordionTrigger className="px-4 py-3 hover:bg-maternal-50 hover:no-underline">
              <div className="flex items-center gap-2 text-left">
                <Sparkles className="h-5 w-5 text-maternal-600 flex-shrink-0" />
                <span className="font-medium text-maternal-800">Riscos reais vs. mitos</span>
              </div>
            </AccordionTrigger>
            <AccordionContent className="px-4 pb-4 pt-1 bg-maternal-50">
              <p className="text-maternal-700 mb-3">
                Algumas situações são frequentemente apresentadas como "de risco" e usadas para 
                justificar intervenções, mas a evidência científica mostra uma realidade diferente:
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
                <div className="bg-white p-3 rounded-md border border-maternal-200">
                  <h5 className="font-medium text-maternal-800 mb-1">Bebê grande</h5>
                  <p className="text-sm text-maternal-700">
                    Ultrassons não são precisos para estimar o peso fetal, com margem de erro de até 500g. 
                    A maioria das mulheres com bebês acima de 4kg pode ter partos vaginais sem complicações.
                  </p>
                </div>
                
                <div className="bg-white p-3 rounded-md border border-maternal-200">
                  <h5 className="font-medium text-maternal-800 mb-1">Bolsa rota</h5>
                  <p className="text-sm text-maternal-700">
                    Se não houver sinais de infecção e o liquido estiver claro, é seguro aguardar o início 
                    espontâneo do trabalho de parto por até 24-48 horas, com monitoramento adequado.
                  </p>
                </div>
                
                <div className="bg-white p-3 rounded-md border border-maternal-200">
                  <h5 className="font-medium text-maternal-800 mb-1">Circular de cordão</h5>
                  <p className="text-sm text-maternal-700">
                    Presente em cerca de 30% dos nascimentos, raramente causa problemas. A maioria dos bebês 
                    com circular de cordão nasce sem complicações por via vaginal.
                  </p>
                </div>
                
                <div className="bg-white p-3 rounded-md border border-maternal-200">
                  <h5 className="font-medium text-maternal-800 mb-1">Pós-datismo</h5>
                  <p className="text-sm text-maternal-700">
                    A gestação é considerada a termo entre 37 e 42 semanas. Muitas induções são realizadas 
                    antes das 41 semanas sem evidência de benefício.
                  </p>
                </div>
              </div>
              
              <p className="text-maternal-700">
                É seu direito questionar e receber explicações claras sobre os riscos reais 
                de cada situação e as evidências que apoiam as intervenções sugeridas.
              </p>
            </AccordionContent>
          </AccordionItem>
          
          <AccordionItem value="questions" className="border border-maternal-200 rounded-lg mb-3 overflow-hidden">
            <AccordionTrigger className="px-4 py-3 hover:bg-maternal-50 hover:no-underline">
              <div className="flex items-center gap-2 text-left">
                <MessageSquare className="h-5 w-5 text-maternal-600 flex-shrink-0" />
                <span className="font-medium text-maternal-800">Perguntas essenciais antes de intervenções</span>
              </div>
            </AccordionTrigger>
            <AccordionContent className="px-4 pb-4 pt-1 bg-maternal-50">
              <p className="text-maternal-700 mb-3">
                Utilize estas perguntas para obter informações que ajudarão nas suas decisões:
              </p>
              
              <div className="bg-white p-3 rounded-md border border-maternal-200 mb-3">
                <ol className="list-decimal pl-5 text-maternal-700 space-y-2">
                  <li>
                    <strong>Por que esta intervenção está sendo proposta?</strong>
                    <p className="text-sm mt-1">Peça uma explicação clara sobre a indicação médica.</p>
                  </li>
                  <li>
                    <strong>Quais são os benefícios esperados?</strong>
                    <p className="text-sm mt-1">Entenda o que se espera ganhar com o procedimento.</p>
                  </li>
                  <li>
                    <strong>Quais são os riscos possíveis?</strong>
                    <p className="text-sm mt-1">Conheça todos os efeitos colaterais e complicações potenciais.</p>
                  </li>
                  <li>
                    <strong>Existem alternativas?</strong>
                    <p className="text-sm mt-1">Pergunte sobre opções menos invasivas.</p>
                  </li>
                  <li>
                    <strong>O que acontece se esperarmos mais um pouco?</strong>
                    <p className="text-sm mt-1">Entenda se há urgência real ou se é possível aguardar.</p>
                  </li>
                  <li>
                    <strong>Posso ter um momento para refletir sobre isso?</strong>
                    <p className="text-sm mt-1">Em situações não emergenciais, solicite tempo para decidir.</p>
                  </li>
                </ol>
              </div>
              
              <p className="text-maternal-700">
                Lembre-se: fazer perguntas não é "ser difícil" – é seu direito e responsabilidade 
                como protagonista do seu parto.
              </p>
            </AccordionContent>
          </AccordionItem>
          
          <AccordionItem value="prevention" className="border border-maternal-200 rounded-lg overflow-hidden">
            <AccordionTrigger className="px-4 py-3 hover:bg-maternal-50 hover:no-underline">
              <div className="flex items-center gap-2 text-left">
                <Heart className="h-5 w-5 text-maternal-600 flex-shrink-0" />
                <span className="font-medium text-maternal-800">Como prevenir intervenções desnecessárias</span>
              </div>
            </AccordionTrigger>
            <AccordionContent className="px-4 pb-4 pt-1 bg-maternal-50">
              <p className="text-maternal-700 mb-3">
                Estas estratégias podem ajudar a evitar intervenções que não sejam medicamente necessárias:
              </p>
              
              <div className="space-y-3 mb-3">
                <div className="bg-white p-3 rounded-md border border-maternal-200">
                  <h5 className="font-medium text-maternal-800 mb-1">Na preparação pré-natal</h5>
                  <ul className="list-disc pl-5 text-sm text-maternal-700">
                    <li>Escolha cuidadosamente sua equipe de assistência</li>
                    <li>Pesquise taxas de cesárea e intervenções do hospital/maternidade</li>
                    <li>Participe de grupos de apoio ao parto normal</li>
                    <li>Considere contratar uma doula</li>
                    <li>Eduque-se sobre o processo fisiológico do parto</li>
                  </ul>
                </div>
                
                <div className="bg-white p-3 rounded-md border border-maternal-200">
                  <h5 className="font-medium text-maternal-800 mb-1">No seu plano de parto</h5>
                  <ul className="list-disc pl-5 text-sm text-maternal-700">
                    <li>Inclua sua preferência por ser consultada antes de qualquer intervenção</li>
                    <li>Especifique quais intervenções você prefere evitar</li>
                    <li>Indique quem pode tomar decisões caso você não esteja em condições de fazê-lo</li>
                    <li>Solicite que alternativas menos invasivas sejam tentadas primeiro</li>
                  </ul>
                </div>
                
                <div className="bg-white p-3 rounded-md border border-maternal-200">
                  <h5 className="font-medium text-maternal-800 mb-1">Durante o trabalho de parto</h5>
                  <ul className="list-disc pl-5 text-sm text-maternal-700">
                    <li>Mantenha-se ativa e vertical o máximo possível</li>
                    <li>Adie a ida ao hospital até o trabalho de parto ativo (se for seguro)</li>
                    <li>Utilize métodos não-farmacológicos de alívio da dor</li>
                    <li>Tenha um acompanhante e/ou doula que conheça suas preferências</li>
                    <li>Solicite tempo para tomar decisões quando não for emergência</li>
                  </ul>
                </div>
              </div>
              
              <p className="text-maternal-700">
                Lembre-se que o objetivo não é recusar todas as intervenções, mas sim garantir 
                que aquelas realizadas sejam verdadeiramente benéficas e necessárias.
              </p>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
        
        <div className="bg-maternal-100 p-4 rounded-lg border-l-4 border-maternal-600">
          <p className="font-medium text-maternal-900">
            Importante: Em situações de emergência real, intervenções podem ser necessárias 
            para garantir sua segurança e a do bebê. A chave é distinguir entre emergências 
            genuínas e situações que permitem tempo para decisões informadas.
          </p>
        </div>
      </div>
    </div>
  );
}
