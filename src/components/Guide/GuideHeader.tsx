
import { BookOpen, Printer, Download, Share2, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from '@/hooks/use-toast';
import { GuideSearch } from './Search/GuideSearch';

interface GuideHeaderProps {
  onNavigate?: (tab: string) => void;
}

export function GuideHeader({ onNavigate }: GuideHeaderProps) {
  const handlePrint = () => {
    window.print();
    toast({
      title: "Preparando para impressão",
      description: "Seu guia completo está sendo preparado para impressão.",
    });
  };
  
  const handleDownload = () => {
    toast({
      title: "Download Iniciado",
      description: "Seu guia completo está sendo baixado.",
    });
    
    // In a real application, this would trigger a PDF download
    setTimeout(() => {
      window.open('/guia-plano-parto-humanizado.pdf', '_blank');
    }, 1500);
  };

  return (
    <header className="bg-brand-gold text-white py-4 px-4 sm:px-6 lg:px-8 shadow-md print:hidden">
      <div className="max-w-6xl mx-auto flex flex-col sm:flex-row gap-4 sm:gap-0 justify-between items-center">
        <div className="flex items-center space-x-2">
          <BookOpen className="h-6 w-6" />
          <h1 className="text-xl font-bold">Guia do Plano de Parto</h1>
        </div>
        
        <div className="flex items-center gap-2">
          <GuideSearch onNavigate={onNavigate} />
          
          <div className="flex space-x-2">
            <Button 
              variant="outline" 
              className="text-white border-white hover:bg-brand-tan bg-brand-gold/30"
              onClick={handlePrint}
            >
              <Printer className="h-4 w-4 mr-2" /> 
              <span className="hidden sm:inline">Imprimir</span>
            </Button>
            
            <Button 
              variant="outline" 
              className="text-white border-white hover:bg-brand-tan bg-brand-gold/30" 
              onClick={handleDownload}
            >
              <Download className="h-4 w-4 mr-2" /> 
              <span className="hidden sm:inline">Download</span>
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}
