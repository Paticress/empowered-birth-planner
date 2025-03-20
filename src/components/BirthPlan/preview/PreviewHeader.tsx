
import { Button } from '@/components/ui/button';
import { Printer, Download } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';
import { exportAsPDF } from '@/utils/exportUtils';

interface PreviewHeaderProps {
  title: string;
}

export function PreviewHeader({ title }: PreviewHeaderProps) {
  // Functions to handle printing and downloading
  const handlePrint = () => {
    toast({
      title: "Preparando para impressão",
      description: "Seu plano de parto está sendo preparado para impressão."
    });
    
    window.print();
  };
  
  const handleDownload = () => {
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
          description: "Ocorreu um erro ao gerar o PDF. Por favor, tente novamente."
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
          onClick={handleDownload}
          className="flex items-center"
        >
          <Download className="mr-2 h-4 w-4" /> Baixar PDF
        </Button>
      </div>
    </div>
  );
}
