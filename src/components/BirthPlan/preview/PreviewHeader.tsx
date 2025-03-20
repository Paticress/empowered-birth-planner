import { Button } from '@/components/ui/button';
import { Printer, Download, FileText } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';
import { exportAsPDF, exportAsWord } from '@/utils/export';

interface PreviewHeaderProps {
  title: string;
  birthPlan?: Record<string, any>;
}

export function PreviewHeader({ title, birthPlan }: PreviewHeaderProps) {
  // Functions to handle printing and downloading
  const handlePrint = () => {
    toast({
      title: "Preparando para impressão",
      description: "Seu plano de parto está sendo preparado para impressão."
    });
    
    window.print();
  };
  
  const handleDownloadPDF = () => {
    toast({
      title: "Download Iniciado",
      description: "Seu plano de parto está sendo baixado como PDF."
    });
    
    exportAsPDF('birth-plan-preview', 'meu-plano-de-parto.pdf')
      .then(() => {
        toast({
          title: "Download Concluído",
          description: "Seu plano de parto foi baixado com sucesso."
        });
      })
      .catch((error) => {
        console.error("Erro ao exportar PDF:", error);
        toast({
          title: "Erro no Download",
          description: "Ocorreu um erro ao gerar o PDF. Por favor, tente baixar como documento Word."
        });
      });
  };
  
  const handleDownloadWord = () => {
    if (!birthPlan) {
      toast({
        title: "Erro no Download",
        description: "Dados do plano de parto não disponíveis."
      });
      return;
    }
    
    // Debug log to check if birth plan data is available
    console.log("Birth plan data being sent to Word export:", birthPlan);
    
    toast({
      title: "Download Iniciado",
      description: "Seu plano de parto está sendo baixado como documento Word."
    });
    
    exportAsWord(birthPlan, 'meu-plano-de-parto.docx')
      .then(() => {
        toast({
          title: "Download Concluído",
          description: "Seu plano de parto foi baixado com sucesso como documento Word."
        });
      })
      .catch((error) => {
        console.error("Erro ao exportar Word:", error);
        toast({
          title: "Erro no Download",
          description: "Ocorreu um erro ao gerar o documento Word. Por favor, tente novamente."
        });
      });
  };
  
  return (
    <div className="flex justify-between items-center mb-6 print:hidden">
      <h1 className="text-3xl font-bold text-maternal-900">{title}</h1>
      
      <div className="flex space-x-2">
        <Button 
          variant="outline" 
          onClick={handlePrint}
          className="flex items-center"
        >
          <Printer className="mr-2 h-4 w-4" /> Imprimir
        </Button>
        
        <Button 
          variant="outline" 
          onClick={handleDownloadPDF}
          className="flex items-center"
        >
          <Download className="mr-2 h-4 w-4" /> PDF
        </Button>
        
        <Button 
          variant="outline" 
          onClick={handleDownloadWord}
          className="flex items-center"
        >
          <FileText className="mr-2 h-4 w-4" /> Word
        </Button>
      </div>
    </div>
  );
}
