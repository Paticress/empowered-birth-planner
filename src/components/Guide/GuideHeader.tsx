
import { BookOpen, Printer, Download, Share2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from '@/hooks/use-toast';

export function GuideHeader() {
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
    if (navigator.share) {
      navigator.share({
        title: 'Guia do Plano de Parto',
        text: 'Confira este guia completo para criar seu plano de parto!',
        url: window.location.href,
      })
      .catch((error) => console.log('Erro ao compartilhar', error));
    } else {
      // Fallback for browsers that don't support Web Share API
      toast({
        title: "Link Copiado!",
        description: "O link do guia foi copiado para a área de transferência.",
      });
      navigator.clipboard.writeText(window.location.href);
    }
  };

  return (
    <header className="bg-brand-gold text-white py-4 px-4 sm:px-6 lg:px-8 shadow-md print:hidden">
      <div className="max-w-6xl mx-auto flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <BookOpen className="h-6 w-6" />
          <h1 className="text-xl font-bold">Guia do Plano de Parto</h1>
        </div>
        <div className="flex space-x-2">
          <Button 
            variant="outline" 
            className="text-white border-white hover:bg-brand-tan bg-brand-gold/30"
            onClick={handlePrint}
          >
            <Printer className="h-4 w-4 mr-2" /> Imprimir
          </Button>
          <Button 
            variant="outline" 
            className="text-white border-white hover:bg-brand-tan bg-brand-gold/30" 
            onClick={handleDownload}
          >
            <Download className="h-4 w-4 mr-2" /> Download
          </Button>
          <Button 
            variant="outline" 
            className="text-white border-white hover:bg-brand-tan bg-brand-gold/30" 
            onClick={handleShare}
          >
            <Share2 className="h-4 w-4 mr-2" /> Compartilhar
          </Button>
        </div>
      </div>
    </header>
  );
}
