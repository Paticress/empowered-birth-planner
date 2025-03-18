
import { Button } from '@/components/ui/button';
import { ArrowLeft, ChevronRight, Printer, Download, Edit } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';
import { birthPlanSections } from './utils/birthPlanSections';
import { getSectionIcon } from './utils/sectionIcons';
import { exportAsPDF } from '@/utils/exportUtils';

interface BirthPlanPreviewProps {
  birthPlan: Record<string, any>;
  onEdit: () => void;
  onNext: () => void;
}

export function BirthPlanPreview({ birthPlan, onEdit, onNext }: BirthPlanPreviewProps) {
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
  
  // Helper function to render content from birth plan
  const renderSection = (sectionId: string, title: string, fields: { key: string, label: string }[]) => {
    const sectionData = birthPlan[sectionId] || {};
    const SectionIcon = getSectionIcon(sectionId);
    
    return (
      <div className="mb-8 print:mb-4">
        <div className="flex items-center gap-2 mb-4 print:mb-2">
          {SectionIcon && <SectionIcon className="h-5 w-5 text-maternal-700 print:text-black" />}
          <h2 className="text-2xl font-semibold text-maternal-800 print:text-xl">{title}</h2>
        </div>
        
        <div className="space-y-4 print:space-y-2">
          {fields.map((field) => {
            const value = sectionData[field.key];
            
            // Skip empty fields
            if (!value || (Array.isArray(value) && value.length === 0)) {
              return null;
            }
            
            return (
              <div key={field.key}>
                <h3 className="font-semibold text-maternal-700 mb-1 print:text-sm">{field.label}</h3>
                <div className="bg-maternal-50 p-4 rounded-lg print:p-2 print:bg-white print:border print:border-gray-300">
                  {Array.isArray(value) ? (
                    <ul className="list-disc pl-5 space-y-1">
                      {value.map((item, index) => (
                        <li key={index}>{item}</li>
                      ))}
                    </ul>
                  ) : (
                    <p>{value}</p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };
  
  return (
    <div className="animate-fade-in">
      <div className="flex justify-between items-center mb-6 print:hidden">
        <h1 className="text-3xl font-bold text-maternal-900">Visualização do Plano de Parto</h1>
        
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
      
      {/* Print Title */}
      <div className="hidden print:block mb-6">
        <h1 className="text-2xl font-bold text-center">PLANO DE PARTO</h1>
        <p className="text-center text-gray-500">Este documento representa minhas preferências para o parto e nascimento do meu bebê.</p>
      </div>
      
      {/* Render all sections */}
      <div id="birth-plan-preview" className="bg-white border border-gray-200 rounded-lg p-6 print:p-0 print:border-0">
        {birthPlanSections.map((section) => renderSection(section.id, section.title, section.fields))}
      </div>
      
      {/* Print Footer */}
      <div className="hidden print:block mt-6">
        <p className="text-center text-gray-600 text-sm">
          Este plano de parto foi criado em {new Date().toLocaleDateString()}. Agradeço sua compreensão e respeito às minhas escolhas.
        </p>
      </div>
      
      <div className="bg-maternal-100 p-4 rounded-lg border-l-4 border-maternal-600 mt-6 mb-6 print:hidden">
        <p className="font-medium text-maternal-900">
          Lembre-se de discutir este plano de parto com sua equipe médica e estar aberta a ajustes conforme necessário.
        </p>
      </div>
      
      <div className="flex justify-between mt-8 print:hidden">
        <Button 
          variant="outline"
          onClick={onEdit}
          className="flex items-center"
        >
          <Edit className="mr-2 h-4 w-4" /> Editar Plano
        </Button>
        
        <Button 
          onClick={onNext}
          className="bg-maternal-600 hover:bg-maternal-700 flex items-center"
        >
          Compartilhar Plano <ChevronRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
