
import { Button } from '@/components/ui/button';
import { ChevronRight, ArrowLeft } from 'lucide-react';

interface GuideChecklistProps {
  onPrevious: () => void;
  onNext: () => void;
}

export function GuideChecklist({ onPrevious, onNext }: GuideChecklistProps) {
  return (
    <div className="animate-fade-in">
      <h1 className="text-3xl font-bold text-maternal-900 mb-6">Checklist do Plano de Parto</h1>
      
      <div className="prose max-w-none">
        <p className="text-lg mb-4">
          Utilize este checklist para garantir que você considerou todos os aspectos importantes 
          ao elaborar seu plano de parto.
        </p>
        
        <div className="space-y-6 mb-8">
          <div className="bg-white border border-maternal-200 rounded-lg p-4 shadow-sm">
            <h3 className="text-xl font-medium text-maternal-800 mb-4">Aspectos Gerais</h3>
            <ul className="space-y-3">
              <li className="flex items-start">
                <input 
                  type="checkbox" 
                  className="mt-1 h-5 w-5 rounded border-maternal-300 text-maternal-600 focus:ring-maternal-600"
                />
                <span className="ml-3">Incluí meus dados pessoais completos (nome, data prevista do parto, etc.)</span>
              </li>
              <li className="flex items-start">
                <input 
                  type="checkbox" 
                  className="mt-1 h-5 w-5 rounded border-maternal-300 text-maternal-600 focus:ring-maternal-600"
                />
                <span className="ml-3">Identifiquei claramente quem será meu acompanhante</span>
              </li>
              <li className="flex items-start">
                <input 
                  type="checkbox" 
                  className="mt-1 h-5 w-5 rounded border-maternal-300 text-maternal-600 focus:ring-maternal-600"
                />
                <span className="ml-3">Defini se terei doula e incluí seus dados de contato</span>
              </li>
              <li className="flex items-start">
                <input 
                  type="checkbox" 
                  className="mt-1 h-5 w-5 rounded border-maternal-300 text-maternal-600 focus:ring-maternal-600"
                />
                <span className="ml-3">Organizei o plano em seções claras e objetivas</span>
              </li>
            </ul>
          </div>
          
          <div className="bg-white border border-maternal-200 rounded-lg p-4 shadow-sm">
            <h3 className="text-xl font-medium text-maternal-800 mb-4">Trabalho de Parto</h3>
            <ul className="space-y-3">
              <li className="flex items-start">
                <input 
                  type="checkbox" 
                  className="mt-1 h-5 w-5 rounded border-maternal-300 text-maternal-600 focus:ring-maternal-600"
                />
                <span className="ml-3">Especifiquei preferências sobre ambiente (luz, som, privacidade)</span>
              </li>
              <li className="flex items-start">
                <input 
                  type="checkbox" 
                  className="mt-1 h-5 w-5 rounded border-maternal-300 text-maternal-600 focus:ring-maternal-600"
                />
                <span className="ml-3">Indiquei preferências sobre liberdade de movimentação</span>
              </li>
              <li className="flex items-start">
                <input 
                  type="checkbox" 
                  className="mt-1 h-5 w-5 rounded border-maternal-300 text-maternal-600 focus:ring-maternal-600"
                />
                <span className="ml-3">Defini opções para alívio da dor (métodos não-farmacológicos e/ou analgesia)</span>
              </li>
              <li className="flex items-start">
                <input 
                  type="checkbox" 
                  className="mt-1 h-5 w-5 rounded border-maternal-300 text-maternal-600 focus:ring-maternal-600"
                />
                <span className="ml-3">Estabeleci preferências sobre alimentação e hidratação</span>
              </li>
              <li className="flex items-start">
                <input 
                  type="checkbox" 
                  className="mt-1 h-5 w-5 rounded border-maternal-300 text-maternal-600 focus:ring-maternal-600"
                />
                <span className="ml-3">Especifiquei como quero que seja feito o monitoramento fetal</span>
              </li>
            </ul>
          </div>
          
          <div className="bg-white border border-maternal-200 rounded-lg p-4 shadow-sm">
            <h3 className="text-xl font-medium text-maternal-800 mb-4">Parto</h3>
            <ul className="space-y-3">
              <li className="flex items-start">
                <input 
                  type="checkbox" 
                  className="mt-1 h-5 w-5 rounded border-maternal-300 text-maternal-600 focus:ring-maternal-600"
                />
                <span className="ml-3">Indiquei posições preferidas para o parto</span>
              </li>
              <li className="flex items-start">
                <input 
                  type="checkbox" 
                  className="mt-1 h-5 w-5 rounded border-maternal-300 text-maternal-600 focus:ring-maternal-600"
                />
                <span className="ml-3">Estabeleci preferências sobre episiotomia</span>
              </li>
              <li className="flex items-start">
                <input 
                  type="checkbox" 
                  className="mt-1 h-5 w-5 rounded border-maternal-300 text-maternal-600 focus:ring-maternal-600"
                />
                <span className="ml-3">Defini preferências sobre uso de fórceps ou vácuo extrator</span>
              </li>
              <li className="flex items-start">
                <input 
                  type="checkbox" 
                  className="mt-1 h-5 w-5 rounded border-maternal-300 text-maternal-600 focus:ring-maternal-600"
                />
                <span className="ml-3">Estabeleci como quero que seja feito o clampeamento do cordão</span>
              </li>
              <li className="flex items-start">
                <input 
                  type="checkbox" 
                  className="mt-1 h-5 w-5 rounded border-maternal-300 text-maternal-600 focus:ring-maternal-600"
                />
                <span className="ml-3">Especifiquei preferências sobre contato pele a pele imediato</span>
              </li>
            </ul>
          </div>
          
          <div className="bg-white border border-maternal-200 rounded-lg p-4 shadow-sm">
            <h3 className="text-xl font-medium text-maternal-800 mb-4">Pós-Parto</h3>
            <ul className="space-y-3">
              <li className="flex items-start">
                <input 
                  type="checkbox" 
                  className="mt-1 h-5 w-5 rounded border-maternal-300 text-maternal-600 focus:ring-maternal-600"
                />
                <span className="ml-3">Estabeleci preferências sobre os exames do recém-nascido</span>
              </li>
              <li className="flex items-start">
                <input 
                  type="checkbox" 
                  className="mt-1 h-5 w-5 rounded border-maternal-300 text-maternal-600 focus:ring-maternal-600"
                />
                <span className="ml-3">Indiquei preferências sobre amamentação na primeira hora</span>
              </li>
              <li className="flex items-start">
                <input 
                  type="checkbox" 
                  className="mt-1 h-5 w-5 rounded border-maternal-300 text-maternal-600 focus:ring-maternal-600"
                />
                <span className="ml-3">Defini se quero que o bebê permaneça comigo o tempo todo</span>
              </li>
              <li className="flex items-start">
                <input 
                  type="checkbox" 
                  className="mt-1 h-5 w-5 rounded border-maternal-300 text-maternal-600 focus:ring-maternal-600"
                />
                <span className="ml-3">Estabeleci quando e como deve ser feito o primeiro banho do bebê</span>
              </li>
              <li className="flex items-start">
                <input 
                  type="checkbox" 
                  className="mt-1 h-5 w-5 rounded border-maternal-300 text-maternal-600 focus:ring-maternal-600"
                />
                <span className="ml-3">Especifiquei preferências sobre visitas no pós-parto</span>
              </li>
            </ul>
          </div>
          
          <div className="bg-white border border-maternal-200 rounded-lg p-4 shadow-sm">
            <h3 className="text-xl font-medium text-maternal-800 mb-4">Cesárea (se necessária)</h3>
            <ul className="space-y-3">
              <li className="flex items-start">
                <input 
                  type="checkbox" 
                  className="mt-1 h-5 w-5 rounded border-maternal-300 text-maternal-600 focus:ring-maternal-600"
                />
                <span className="ml-3">Indiquei preferências sobre o tipo de anestesia</span>
              </li>
              <li className="flex items-start">
                <input 
                  type="checkbox" 
                  className="mt-1 h-5 w-5 rounded border-maternal-300 text-maternal-600 focus:ring-maternal-600"
                />
                <span className="ml-3">Estabeleci a presença do acompanhante durante a cesárea</span>
              </li>
              <li className="flex items-start">
                <input 
                  type="checkbox" 
                  className="mt-1 h-5 w-5 rounded border-maternal-300 text-maternal-600 focus:ring-maternal-600"
                />
                <span className="ml-3">Defini se quero visualizar o nascimento (ex. abaixando o campo cirúrgico)</span>
              </li>
              <li className="flex items-start">
                <input 
                  type="checkbox" 
                  className="mt-1 h-5 w-5 rounded border-maternal-300 text-maternal-600 focus:ring-maternal-600"
                />
                <span className="ml-3">Especifiquei preferências sobre contato pele a pele na cesárea</span>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="bg-maternal-100 p-4 rounded-lg border-l-4 border-maternal-600 mb-6">
          <p className="font-medium text-maternal-900">
            Dica: Este checklist é um guia, e você pode adicionar ou remover itens de acordo com suas necessidades específicas. 
            O mais importante é que seu plano de parto reflita suas preferências e prioridades.
          </p>
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
        
        <Button 
          onClick={onNext}
          className="bg-maternal-600 hover:bg-maternal-700 flex items-center"
        >
          Próximo: Recursos Adicionais <ChevronRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
