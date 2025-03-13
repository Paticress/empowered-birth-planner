
import { Button } from '@/components/ui/button';
import { ArrowLeft, CheckSquare, Link } from 'lucide-react';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { useState } from 'react';

interface GuideChecklistProps {
  onPrevious: () => void;
}

export function GuideChecklist({ onPrevious }: GuideChecklistProps) {
  const [openSection, setOpenSection] = useState<string | null>("pre-labor");
  
  return (
    <div className="animate-fade-in">
      <h1 className="text-3xl font-bold text-maternal-900 mb-6">Checklist Essencial para o Plano de Parto</h1>
      
      <div className="prose max-w-none">
        <p className="text-lg mb-4">
          Este checklist completo ajudará você a garantir que todos os aspectos importantes 
          do seu parto sejam considerados no seu plano. Use-o como um guia para criar um 
          plano de parto personalizado.
        </p>
        
        <div className="space-y-4 mb-8">
          <Collapsible 
            open={openSection === "pre-labor"} 
            onOpenChange={() => setOpenSection(openSection === "pre-labor" ? null : "pre-labor")}
          >
            <CollapsibleTrigger className="flex justify-between items-center w-full p-4 bg-maternal-100 rounded-lg text-left font-medium text-maternal-900 hover:bg-maternal-200 transition-colors">
              <span className="flex items-center">
                <CheckSquare className="mr-2 h-5 w-5 text-maternal-600" />
                Antes do Trabalho de Parto
              </span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className={`transition-transform ${openSection === "pre-labor" ? "transform rotate-180" : ""}`}
              >
                <polyline points="6 9 12 15 18 9"></polyline>
              </svg>
            </CollapsibleTrigger>
            <CollapsibleContent className="p-4 bg-white border border-maternal-100 rounded-lg mt-2">
              <ul className="list-disc pl-5 space-y-2">
                <li>Quem você deseja como acompanhante(s)?</li>
                <li>Você planeja ter uma doula presente?</li>
                <li>Preferências para o ambiente: luzes, música, objetos pessoais</li>
                <li>Deseja trazer itens especiais para o quarto?</li>
                <li>Quem pode visitar durante ou após o parto?</li>
                <li>Fotografias ou filmagem do parto são desejadas?</li>
              </ul>
            </CollapsibleContent>
          </Collapsible>
          
          <Collapsible 
            open={openSection === "labor"} 
            onOpenChange={() => setOpenSection(openSection === "labor" ? null : "labor")}
          >
            <CollapsibleTrigger className="flex justify-between items-center w-full p-4 bg-maternal-100 rounded-lg text-left font-medium text-maternal-900 hover:bg-maternal-200 transition-colors">
              <span className="flex items-center">
                <CheckSquare className="mr-2 h-5 w-5 text-maternal-600" />
                Durante o Trabalho de Parto
              </span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className={`transition-transform ${openSection === "labor" ? "transform rotate-180" : ""}`}
              >
                <polyline points="6 9 12 15 18 9"></polyline>
              </svg>
            </CollapsibleTrigger>
            <CollapsibleContent className="p-4 bg-white border border-maternal-100 rounded-lg mt-2">
              <ul className="list-disc pl-5 space-y-2">
                <li>Liberdade de movimento e posições durante o trabalho de parto</li>
                <li>Preferências para monitoramento fetal (contínuo ou intermitente)</li>
                <li>Métodos de alívio da dor não-medicamentosos (banho, massagem, bola de pilates)</li>
                <li>Métodos de alívio da dor medicamentosos (analgesia, anestesia)</li>
                <li>Preferências sobre indução, aceleração ou ruptura artificial de membranas</li>
                <li>Alimentação e hidratação durante o trabalho de parto</li>
                <li>Uso de cateter urinário (sonda)</li>
                <li>Exames vaginais (frequência e consentimento)</li>
              </ul>
            </CollapsibleContent>
          </Collapsible>
          
          <Collapsible 
            open={openSection === "delivery"} 
            onOpenChange={() => setOpenSection(openSection === "delivery" ? null : "delivery")}
          >
            <CollapsibleTrigger className="flex justify-between items-center w-full p-4 bg-maternal-100 rounded-lg text-left font-medium text-maternal-900 hover:bg-maternal-200 transition-colors">
              <span className="flex items-center">
                <CheckSquare className="mr-2 h-5 w-5 text-maternal-600" />
                Durante o Parto
              </span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className={`transition-transform ${openSection === "delivery" ? "transform rotate-180" : ""}`}
              >
                <polyline points="6 9 12 15 18 9"></polyline>
              </svg>
            </CollapsibleTrigger>
            <CollapsibleContent className="p-4 bg-white border border-maternal-100 rounded-lg mt-2">
              <ul className="list-disc pl-5 space-y-2">
                <li>Posições preferidas para o parto</li>
                <li>Preferências sobre episiotomia</li>
                <li>Uso de fórceps ou vácuo extrator (se necessário)</li>
                <li>Visualização do nascimento com espelho</li>
                <li>Toque do bebê durante o coroamento</li>
                <li>Quem cortará o cordão umbilical</li>
                <li>Preferências sobre clampeamento do cordão (imediato ou tardio)</li>
                <li>Contato pele a pele imediato</li>
                <li>Amamentação na primeira hora</li>
                <li>Preferências sobre coleta de células-tronco do cordão umbilical</li>
              </ul>
            </CollapsibleContent>
          </Collapsible>
          
          <Collapsible 
            open={openSection === "cesarean"} 
            onOpenChange={() => setOpenSection(openSection === "cesarean" ? null : "cesarean")}
          >
            <CollapsibleTrigger className="flex justify-between items-center w-full p-4 bg-maternal-100 rounded-lg text-left font-medium text-maternal-900 hover:bg-maternal-200 transition-colors">
              <span className="flex items-center">
                <CheckSquare className="mr-2 h-5 w-5 text-maternal-600" />
                Em Caso de Cesárea
              </span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className={`transition-transform ${openSection === "cesarean" ? "transform rotate-180" : ""}`}
              >
                <polyline points="6 9 12 15 18 9"></polyline>
              </svg>
            </CollapsibleTrigger>
            <CollapsibleContent className="p-4 bg-white border border-maternal-100 rounded-lg mt-2">
              <ul className="list-disc pl-5 space-y-2">
                <li>Presença do acompanhante durante a cesárea</li>
                <li>Tipo de anestesia preferida</li>
                <li>Preferência por tela transparente ou abaixada para visualizar o nascimento</li>
                <li>Braços livres durante o procedimento</li>
                <li>Contato pele a pele na sala de cirurgia, se possível</li>
                <li>Amamentação na sala de recuperação</li>
                <li>Permanência do bebê com você durante a recuperação</li>
              </ul>
            </CollapsibleContent>
          </Collapsible>
          
          <Collapsible 
            open={openSection === "postpartum"} 
            onOpenChange={() => setOpenSection(openSection === "postpartum" ? null : "postpartum")}
          >
            <CollapsibleTrigger className="flex justify-between items-center w-full p-4 bg-maternal-100 rounded-lg text-left font-medium text-maternal-900 hover:bg-maternal-200 transition-colors">
              <span className="flex items-center">
                <CheckSquare className="mr-2 h-5 w-5 text-maternal-600" />
                Pós-Parto e Cuidados com o Recém-Nascido
              </span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className={`transition-transform ${openSection === "postpartum" ? "transform rotate-180" : ""}`}
              >
                <polyline points="6 9 12 15 18 9"></polyline>
              </svg>
            </CollapsibleTrigger>
            <CollapsibleContent className="p-4 bg-white border border-maternal-100 rounded-lg mt-2">
              <ul className="list-disc pl-5 space-y-2">
                <li>Preferências para o manejo da placenta</li>
                <li>Preferências sobre exames e procedimentos no recém-nascido</li>
                <li>Banho do bebê (quando e quem realizará)</li>
                <li>Administração de vitamina K e colírio antibiótico</li>
                <li>Vacinas no recém-nascido</li>
                <li>Permanência do bebê com você (alojamento conjunto)</li>
                <li>Preferências sobre amamentação e uso de mamadeira/chupeta</li>
                <li>Circuncisão (para meninos)</li>
                <li>Visitas durante a internação</li>
                <li>Período de internação preferido</li>
              </ul>
            </CollapsibleContent>
          </Collapsible>
        </div>
        
        <div className="bg-maternal-50 p-6 rounded-lg mb-8">
          <h2 className="text-2xl font-semibold text-maternal-800 mb-4">Como utilizar este checklist</h2>
          <ol className="list-decimal pl-5 space-y-3">
            <li>
              Revise cada categoria e reflita sobre suas preferências pessoais. Não há 
              necessidade de ter uma opinião sobre todos os itens.
            </li>
            <li>
              Pesquise e informe-se sobre os pontos que você não conhece ou tem dúvidas. 
              Converse com seu médico/obstetra, doula ou grupos de apoio.
            </li>
            <li>
              Selecione os itens mais importantes para você e inclua-os em seu plano de parto, 
              usando a estrutura que aprendemos no capítulo anterior.
            </li>
            <li>
              Lembre-se de que o mais importante é que seu plano reflita suas preferências pessoais 
              e seja baseado em informações bem fundamentadas.
            </li>
          </ol>
        </div>
        
        <div className="bg-maternal-100 p-4 rounded-lg border-l-4 border-maternal-600 mb-8">
          <h3 className="font-bold text-maternal-900 mb-2">Dica importante</h3>
          <p className="text-maternal-800">
            Tenha sempre uma versão impressa do seu plano de parto na sua bolsa da maternidade, 
            e uma versão digital para compartilhar com seu acompanhante, doula e equipe médica.
          </p>
        </div>
        
        <h2 className="text-2xl font-semibold text-maternal-800 mt-8 mb-4">Próximos Passos</h2>
        
        <p className="mb-4">
          Agora que você concluiu nosso guia completo sobre plano de parto, você está muito 
          melhor preparada para criar um documento que realmente represente suas preferências 
          e necessidades.
        </p>
        
        <p className="mb-4">
          Lembre-se que um plano de parto bem elaborado é uma ferramenta poderosa para ter 
          uma experiência de parto mais positiva e respeitosa.
        </p>
        
        <div className="bg-maternal-50 p-6 rounded-lg border border-maternal-200 mb-6">
          <h3 className="text-xl font-semibold text-maternal-800 mb-4 flex items-center">
            <Link className="mr-2 h-5 w-5 text-maternal-600" />
            Quer ir além?
          </h3>
          <p className="mb-4">
            Se você deseja um modelo personalizado e completo de plano de parto, 
            já pronto para usar, acesse agora nosso:
          </p>
          <div className="flex justify-center">
            <a 
              href="/plano-personalizado" 
              className="btn-primary inline-block"
            >
              Modelo Personalizado de Plano de Parto
            </a>
          </div>
        </div>
      </div>
      
      <div className="mt-8 flex justify-between">
        <Button 
          variant="outline" 
          onClick={onPrevious}
          className="flex items-center"
        >
          <ArrowLeft className="mr-2 h-4 w-4" /> Voltar à Comunicação
        </Button>
      </div>
    </div>
  );
}
