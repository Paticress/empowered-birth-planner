
import { BookOpen, Printer, Download, Share2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from '@/hooks/use-toast';
import { GuideSearch } from './Search/GuideSearch';
import { useState } from 'react';
import { GuideShare } from './Share/GuideShare';

interface GuideHeaderProps {
  onNavigate?: (tab: string) => void;
  currentTab?: string;
}

export function GuideHeader({ onNavigate, currentTab = "introduction" }: GuideHeaderProps) {
  const [shareOpen, setShareOpen] = useState(false);
  
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

  const handleShare = () => {
    setShareOpen(true);
  };

  return (
    <header className="bg-white text-brand-black py-4 px-4 sm:px-6 lg:px-8 shadow-md print:hidden">
      <div className="max-w-6xl mx-auto flex flex-col sm:flex-row gap-4 sm:gap-0 justify-between items-center">
        <div className="flex items-center space-x-2">
          <BookOpen className="h-6 w-6 text-brand-black" />
          <h1 className="text-xl font-bold text-brand-black">Guia do Plano de Parto</h1>
        </div>
        
        <div className="flex items-center gap-2">
          <GuideSearch onNavigate={onNavigate} />
          
          <div className="flex space-x-2">
            <Button 
              variant="navigation" 
              className="text-maternal-900 hover:bg-gray-200"
              onClick={handlePrint}
            >
              <Printer className="h-4 w-4 mr-2" /> 
              <span className="hidden sm:inline">Imprimir</span>
            </Button>
            
            <Button 
              variant="navigation" 
              className="text-maternal-900 hover:bg-gray-200" 
              onClick={handleDownload}
            >
              <Download className="h-4 w-4 mr-2" /> 
              <span className="hidden sm:inline">Download</span>
            </Button>
            
            <Button 
              variant="navigation" 
              className="text-maternal-900 hover:bg-gray-200" 
              onClick={handleShare}
            >
              <Share2 className="h-4 w-4 mr-2" /> 
              <span className="hidden sm:inline">Compartilhar</span>
            </Button>
          </div>
        </div>
      </div>
      
      <GuideShare open={shareOpen} onOpenChange={setShareOpen} currentTab={currentTab} />
    </header>
  );
}
