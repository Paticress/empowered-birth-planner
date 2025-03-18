
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ArrowLeft, ChevronRight, Save } from 'lucide-react';
import { Textarea } from '@/components/ui/textarea';
import { toast } from '@/hooks/use-toast';

interface BirthPlanEditorProps {
  birthPlan: Record<string, any>;
  onUpdate: (updatedPlan: Record<string, any>) => void;
  onNext: () => void;
}

export function BirthPlanEditor({ birthPlan, onUpdate, onNext }: BirthPlanEditorProps) {
  const [activeSectionIndex, setActiveSectionIndex] = useState(0);
  const [localBirthPlan, setLocalBirthPlan] = useState({ ...birthPlan });
  
  // Define sections for the birth plan
  const sections = [
    {
      id: 'personalInfo',
      title: 'Informações Pessoais',
      fields: [
        { key: 'name', label: 'Nome Completo' },
        { key: 'dueDate', label: 'Data Prevista do Parto' },
        { key: 'healthProvider', label: 'Médico/Obstetra' },
      ],
    },
    {
      id: 'preferences',
      title: 'Preferências para o Parto',
      fields: [
        { key: 'environment', label: 'Ambiente e Atmosfera' },
        { key: 'mobility', label: 'Movimentação durante o Trabalho de Parto' },
        { key: 'pain', label: 'Gerenciamento da Dor' },
        { key: 'interventions', label: 'Intervenções Médicas' },
      ],
    },
    {
      id: 'medicalConsiderations',
      title: 'Considerações Médicas',
      fields: [
        { key: 'conditions', label: 'Condições Médicas' },
        { key: 'medications', label: 'Medicamentos' },
        { key: 'allergies', label: 'Alergias' },
      ],
    },
    {
      id: 'postpartum',
      title: 'Pós-Parto',
      fields: [
        { key: 'newbornCare', label: 'Cuidados com o Recém-Nascido' },
        { key: 'feeding', label: 'Amamentação' },
        { key: 'recovery', label: 'Recuperação' },
      ],
    },
  ];
  
  const handleFieldChange = (sectionId: string, fieldKey: string, value: any) => {
    setLocalBirthPlan(prevPlan => ({
      ...prevPlan,
      [sectionId]: {
        ...prevPlan[sectionId],
        [fieldKey]: value,
      },
    }));
  };
  
  const handleSave = () => {
    onUpdate(localBirthPlan);
    toast({
      title: "Alterações salvas",
      description: "Seu plano de parto foi atualizado com sucesso.",
    });
  };
  
  const activeSection = sections[activeSectionIndex];
  
  return (
    <div className="animate-fade-in">
      <h1 className="text-3xl font-bold text-maternal-900 mb-6">Edite seu Plano de Parto</h1>
      
      <div className="flex overflow-x-auto pb-2 mb-6 gap-2">
        {sections.map((section, index) => (
          <Button
            key={section.id}
            variant={activeSectionIndex === index ? "default" : "outline"}
            className={activeSectionIndex === index ? "bg-maternal-600" : ""}
            onClick={() => setActiveSectionIndex(index)}
          >
            {section.title}
          </Button>
        ))}
      </div>
      
      <div className="bg-white border border-gray-200 rounded-lg p-6 mb-6">
        <h2 className="text-2xl font-semibold text-maternal-800 mb-4">{activeSection.title}</h2>
        
        {activeSection.fields.map((field) => {
          const sectionData = localBirthPlan[activeSection.id] || {};
          const fieldValue = sectionData[field.key] || '';
          
          return (
            <div key={field.key} className="mb-6">
              <label 
                htmlFor={`${activeSection.id}-${field.key}`} 
                className="block font-medium text-maternal-900 mb-2"
              >
                {field.label}
              </label>
              
              <Textarea
                id={`${activeSection.id}-${field.key}`}
                value={Array.isArray(fieldValue) ? fieldValue.join('\n') : fieldValue}
                onChange={(e) => handleFieldChange(
                  activeSection.id, 
                  field.key, 
                  e.target.value
                )}
                rows={6}
                className="w-full"
                placeholder={`Insira suas preferências para ${field.label.toLowerCase()}`}
              />
            </div>
          );
        })}
      </div>
      
      <div className="bg-maternal-50 p-4 rounded-lg mb-6">
        <p className="text-sm">
          <strong>Dica:</strong> Seja específico sobre suas preferências, mas também flexível. 
          Lembre-se de que situações imprevistas podem ocorrer durante o parto.
        </p>
      </div>
      
      <div className="flex justify-between mt-8">
        <Button 
          variant="outline"
          onClick={() => setActiveSectionIndex(Math.max(0, activeSectionIndex - 1))}
          disabled={activeSectionIndex === 0}
          className="flex items-center"
        >
          <ArrowLeft className="mr-2 h-4 w-4" /> Seção Anterior
        </Button>
        
        <Button 
          variant="outline"
          onClick={handleSave}
          className="flex items-center"
        >
          <Save className="mr-2 h-4 w-4" /> Salvar Alterações
        </Button>
        
        {activeSectionIndex === sections.length - 1 ? (
          <Button 
            onClick={() => {
              handleSave();
              onNext();
            }}
            className="bg-maternal-600 hover:bg-maternal-700 flex items-center"
          >
            Visualizar Plano Completo <ChevronRight className="ml-2 h-4 w-4" />
          </Button>
        ) : (
          <Button 
            onClick={() => setActiveSectionIndex(Math.min(sections.length - 1, activeSectionIndex + 1))}
            className="bg-maternal-600 hover:bg-maternal-700 flex items-center"
          >
            Próxima Seção <ChevronRight className="ml-2 h-4 w-4" />
          </Button>
        )}
      </div>
    </div>
  );
}
