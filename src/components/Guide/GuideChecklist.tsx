
import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { ChecklistSections } from './Checklist/ChecklistSections';
import { ChecklistTip } from './Checklist/ChecklistTip';
import { ChecklistNavigation } from './Checklist/ChecklistNavigation';
import { Printer, Save, RefreshCcw, FileText, Download } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { exportAsPDF, exportAsText } from '@/utils/exportUtils';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';

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
        
        <ChecklistTip>
          Para mais informações detalhadas sobre riscos e intervenções, consulte a 
          seção "Entendendo Riscos e Intervenções" na página "Como Estruturar seu Plano de Parto".
        </ChecklistTip>
        
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
