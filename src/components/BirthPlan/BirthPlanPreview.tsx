
import { Button } from '@/components/ui/button';
import { ArrowLeft, ChevronRight, Printer, Download, Edit } from 'lucide-react';
import { toast } from 'sonner';

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
      description: "Seu plano de parto está sendo preparado para impressão.",
    });
    
    window.print();
  };
  
  const handleDownload = () => {
    toast({
      title: "Download Iniciado",
      description: "Seu plano de parto está sendo baixado como PDF.",
    });
    
    // In a real implementation, this would generate a PDF
    setTimeout(() => {
      toast({
        title: "Download Concluído",
        description: "Seu plano de parto foi baixado com sucesso.",
      });
    }, 1500);
  };
  
  // Helper function to render content from birth plan
  const renderSection = (sectionId: string, title: string, fields: { key: string, label: string }[]) => {
    const sectionData = birthPlan[sectionId] || {};
    
    return (
      <div className="mb-8 print:mb-4">
        <h2 className="text-2xl font-semibold text-maternal-800 mb-4 print:text-xl print:mb-2">{title}</h2>
        
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
  
  // Sections and fields configuration (matching the editor)
  const sections = [
    {
      id: 'personalInfo',
      title: 'Informações Pessoais',
      fields: [
        { key: 'name', label: 'Nome Completo' },
        { key: 'dueDate', label: 'Data Prevista do Parto' },
        { key: 'healthProvider', label: 'Médico/Obstetra' }
      ]
    },
    {
      id: 'preferences',
      title: 'Preferências para o Parto',
      fields: [
        { key: 'environment', label: 'Ambiente e Atmosfera' },
        { key: 'mobility', label: 'Movimentação durante o Trabalho de Parto' },
        { key: 'pain', label: 'Gerenciamento da Dor' },
        { key: 'interventions', label: 'Intervenções Médicas' }
      ]
    },
    {
      id: 'medicalConsiderations',
      title: 'Considerações Médicas',
      fields: [
        { key: 'conditions', label: 'Condições Médicas' },
        { key: 'medications', label: 'Medicamentos' },
        { key: 'allergies', label: 'Alergias' }
      ]
    },
    {
      id: 'postpartum',
      title: 'Pós-Parto',
      fields: [
        { key: 'newbornCare', label: 'Cuidados com o Recém-Nascido' },
        { key: 'feeding', label: 'Amamentação' },
        { key: 'recovery', label: 'Recuperação' }
      ]
    }
  ];
  
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
      <div className="bg-white border border-gray-200 rounded-lg p-6 print:p-0 print:border-0">
        {sections.map((section) => renderSection(section.id, section.title, section.fields))}
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
