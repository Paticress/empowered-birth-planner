
import { useState } from 'react';
import { BookOpen } from 'lucide-react';
import { ResourceCard } from './ResourceCard';
import { ProceduresGuide } from './ProceduresGuide';
import { toast } from '@/hooks/use-toast';

export function ProceduresSection() {
  const [activeResource, setActiveResource] = useState<string | null>(null);
  const [showProceduresGuide, setShowProceduresGuide] = useState(false);

  const handleResourceClick = (resource: string) => {
    if (resource === 'checklist') {
      setShowProceduresGuide(!showProceduresGuide);
    } else {
      setActiveResource(resource === activeResource ? null : resource);
    }
  };

  const handleDownload = (resourceName: string) => {
    toast({
      title: "Download Iniciado",
      description: `O recurso "${resourceName}" está sendo baixado.`,
    });
    
    // In a real application, this would trigger an actual download
    setTimeout(() => {
      toast({
        title: "Download Concluído",
        description: "O arquivo foi baixado com sucesso.",
      });
    }, 1500);
  };

  return (
    <>
      <p className="text-lg mb-6">
        Confira também estes recursos adicionais para aprofundar ainda mais seus conhecimentos sobre o plano de parto.
      </p>
      
      <div className="mb-8">
        <ResourceCard 
          title="Guia de Procedimentos"
          description="Glossário com explicações sobre os procedimentos mais comuns do parto, para você entender melhor suas opções."
          icon={<BookOpen className="h-6 w-6 text-maternal-600" />}
          isActive={activeResource === 'checklist'}
          buttonText="Visualizar Guia"
          buttonIcon={<BookOpen className="mr-2 h-4 w-4" />}
          buttonVariant="resource"
          onClick={() => handleResourceClick('checklist')}
          onButtonClick={(e) => {
            e.stopPropagation();
            handleDownload('Guia de Procedimentos');
            setShowProceduresGuide(true);
          }}
        />
      </div>
      
      {showProceduresGuide && <ProceduresGuide onClose={() => setShowProceduresGuide(false)} />}
    </>
  );
}
