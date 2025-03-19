
import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { ChecklistSections } from './Checklist/ChecklistSections';
import { ChecklistTip } from './Checklist/ChecklistTip';
import { ChecklistNavigation } from './Checklist/ChecklistNavigation';
import { Printer, Save, RefreshCcw, FileText, Download, Share2, AlertTriangle } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { exportAsPDF, exportAsText } from '@/utils/exportUtils';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

interface GuideChecklistProps {
  onPrevious: () => void;
  onNext: () => void;
}

export function GuideChecklist({ onPrevious, onNext }: GuideChecklistProps) {
  const [lastSaved, setLastSaved] = useState<string | null>(null);
  const checklistRef = useRef<HTMLDivElement>(null);

  // Load last saved time
  useEffect(() => {
    const savedTime = localStorage.getItem('checklist-last-saved');
    if (savedTime) {
      setLastSaved(savedTime);
    }
  }, []);

  const handlePrint = () => {
    window.print();
    toast({
      title: "Checklist sendo preparado para impressão",
      description: "A janela de impressão será aberta em instantes.",
    });
  };

  const handleSaveProgress = () => {
    // Progress is automatically saved in the ChecklistItem component
    // This function just updates the last saved time
    const now = new Date().toLocaleString('pt-BR');
    localStorage.setItem('checklist-last-saved', now);
    setLastSaved(now);
    
    toast({
      title: "Progresso salvo com sucesso",
      description: "Seu progresso no checklist foi salvo localmente.",
    });
  };

  const handleClearProgress = () => {
    if (confirm('Tem certeza que deseja limpar todo o progresso?')) {
      localStorage.removeItem('checklist-items');
      localStorage.removeItem('checklist-last-saved');
      setLastSaved(null);
      
      toast({
        title: "Progresso limpo",
        description: "Todo seu progresso no checklist foi removido.",
      });
      
      // Reload the page to reset all checkboxes
      window.location.reload();
    }
  };
  
  const handleExportPDF = () => {
    if (checklistRef.current) {
      exportAsPDF('checklist-content', 'plano-de-parto-checklist.pdf');
    }
  };
  
  const handleExportText = () => {
    if (checklistRef.current) {
      exportAsText('checklist-content', 'plano-de-parto-checklist.txt');
    }
  };

  return (
    <div className="animate-fade-in">
      <h1 className="text-3xl font-bold text-maternal-900 mb-6">Checklist do Plano de Parto</h1>
      
      <div className="flex flex-wrap gap-2 mb-6 print:hidden">
        <Button 
          variant="outline" 
          className="flex items-center gap-2"
          onClick={handlePrint}
        >
          <Printer className="h-4 w-4" />
          Imprimir
        </Button>
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="flex items-center gap-2">
              <Download className="h-4 w-4" />
              Exportar
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem onClick={handleExportPDF}>
              <FileText className="h-4 w-4 mr-2" />
              Exportar como PDF
            </DropdownMenuItem>
            <DropdownMenuItem onClick={handleExportText}>
              <FileText className="h-4 w-4 mr-2" />
              Exportar como Texto
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        
        <Button 
          variant="outline"
          className="flex items-center gap-2" 
          onClick={handleSaveProgress}
        >
          <Save className="h-4 w-4" />
          Salvar Progresso
        </Button>
        
        <Button 
          variant="outline"
          className="flex items-center gap-2 text-destructive hover:text-destructive hover:bg-destructive/10"
          onClick={handleClearProgress}
        >
          <RefreshCcw className="h-4 w-4" />
          Resetar Checklist
        </Button>
      </div>
      
      {lastSaved && (
        <p className="text-sm text-maternal-600 mb-4 print:hidden">
          Última atualização: {lastSaved}
        </p>
      )}
      
      <div className="prose max-w-none" id="checklist-content" ref={checklistRef}>
        <p className="text-lg mb-4">
          Utilize este checklist para garantir que você considerou todos os aspectos importantes 
          ao elaborar seu plano de parto.
        </p>
        
        <div className="bg-orange-50 border-l-4 border-orange-400 p-4 rounded-md mb-6 print:hidden">
          <div className="flex items-center gap-2 mb-2">
            <AlertTriangle className="h-5 w-5 text-orange-500" />
            <h3 className="font-bold text-orange-800 m-0">Entendendo Riscos e Intervenções</h3>
          </div>
          <p className="text-orange-700 mb-2">
            É importante diferenciar entre intervenções necessárias para sua segurança e 
            procedimentos que podem ser evitados.
          </p>
          
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="cascade">
              <AccordionTrigger className="text-orange-800 font-medium">
                O efeito cascata de intervenções
              </AccordionTrigger>
              <AccordionContent>
                <p className="text-sm text-orange-700">
                  Quando uma intervenção desnecessária é realizada, ela pode desencadear a necessidade de outras intervenções, 
                  criando um "efeito cascata". Por exemplo, uma indução artificial pode levar a contrações mais dolorosas, 
                  que exigem analgesia, que pode diminuir as contrações, levando à necessidade de mais ocitocina, 
                  podendo resultar em sofrimento fetal e cesariana de emergência.
                </p>
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="myths">
              <AccordionTrigger className="text-orange-800 font-medium">
                Riscos reais vs. mitos
              </AccordionTrigger>
              <AccordionContent>
                <p className="text-sm text-orange-700 mb-2">
                  Alguns cenários frequentemente apresentados como "de risco" nem sempre exigem intervenções imediatas:
                </p>
                <ul className="text-sm text-orange-700 list-disc pl-5">
                  <li>Bebê grande nem sempre precisa de cesárea</li>
                  <li>Bolsa rota pode aguardar até 24h se não houver sinais de infecção</li>
                  <li>Circular de cordão raramente impede parto normal</li>
                  <li>A posição vertical durante o trabalho de parto é frequentemente mais vantajosa que a deitada</li>
                </ul>
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="prevention">
              <AccordionTrigger className="text-orange-800 font-medium">
                Como prevenir intervenções desnecessárias
              </AccordionTrigger>
              <AccordionContent>
                <ul className="text-sm text-orange-700 list-disc pl-5">
                  <li>Escolha uma equipe que respeite o processo natural do parto</li>
                  <li>Inclua no plano de parto que deseja ser consultada antes de qualquer intervenção</li>
                  <li>Tenha um acompanhante e/ou doula informados sobre suas preferências</li>
                  <li>Questione o motivo e as alternativas para cada intervenção proposta</li>
                  <li>Solicite tempo para tomar decisões, quando não for emergência</li>
                </ul>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
        
        <ChecklistSections />
        
        <ChecklistTip>
          Dica: Este checklist é um guia, e você pode adicionar ou remover itens de acordo com suas necessidades específicas. 
          O mais importante é que seu plano de parto reflita suas preferências e prioridades.
        </ChecklistTip>
      </div>
      
      <ChecklistNavigation onPrevious={onPrevious} onNext={onNext} />
    </div>
  );
}
