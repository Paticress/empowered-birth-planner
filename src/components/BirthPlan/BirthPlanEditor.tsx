
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ArrowLeft, ChevronRight, Save } from 'lucide-react';
import { Textarea } from '@/components/ui/textarea';
import { toast } from '@/components/ui/use-toast';
import { birthPlanSections } from './utils/birthPlanSections';

interface BirthPlanEditorProps {
  birthPlan: Record<string, any>;
  onUpdate: (updatedPlan: Record<string, any>) => void;
  onNext: () => void;
}

export function BirthPlanEditor({ birthPlan, onUpdate, onNext }: BirthPlanEditorProps) {
  const [activeSectionIndex, setActiveSectionIndex] = useState(0);
  const [localBirthPlan, setLocalBirthPlan] = useState({ ...birthPlan });
  
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
  
  const activeSection = birthPlanSections[activeSectionIndex];
  
  return (
    <div className="animate-fade-in">
      <h1 className="text-3xl font-bold text-purple-900 mb-6">Edite seu Plano de Parto</h1>
      
      <div className="flex overflow-x-auto pb-2 mb-6 gap-2">
        {birthPlanSections.map((section, index) => (
          <Button
            key={section.id}
            variant={activeSectionIndex === index ? "default" : "outline"}
            className={activeSectionIndex === index 
              ? `bg-${section.color || 'purple-600'}` 
              : `hover:bg-${section.color || 'purple-100'} hover:text-purple-900`}
            onClick={() => setActiveSectionIndex(index)}
          >
            {section.title}
          </Button>
        ))}
      </div>
      
      <div className={`bg-white border-l-4 border-${activeSection.color || 'purple-500'} rounded-lg p-6 mb-6 shadow-md`}>
        <h2 className="text-2xl font-semibold text-purple-800 mb-4">{activeSection.title}</h2>
        
        {activeSection.fields.map((field) => {
          const sectionData = localBirthPlan[activeSection.id] || {};
          const fieldValue = sectionData[field.key] || '';
          
          return (
            <div key={field.key} className="mb-6">
              <label 
                htmlFor={`${activeSection.id}-${field.key}`} 
                className="block font-medium text-purple-900 mb-2"
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
                className="w-full border-purple-200 focus:border-purple-500 focus:ring-purple-500"
                placeholder={`Insira suas preferências para ${field.label.toLowerCase()}`}
              />
            </div>
          );
        })}
      </div>
      
      <div className="bg-purple-50 p-4 rounded-lg mb-6 border border-purple-200">
        <p className="text-sm text-purple-800">
          <strong>Dica:</strong> Seja específico sobre suas preferências, mas também flexível. 
          Lembre-se de que situações imprevistas podem ocorrer durante o parto.
        </p>
      </div>
      
      <div className="flex justify-between mt-8">
        <Button 
          variant="outline"
          onClick={() => setActiveSectionIndex(Math.max(0, activeSectionIndex - 1))}
          disabled={activeSectionIndex === 0}
          className="flex items-center border-purple-300 text-purple-700 hover:bg-purple-50"
        >
          <ArrowLeft className="mr-2 h-4 w-4" /> Seção Anterior
        </Button>
        
        <Button 
          variant="outline"
          onClick={handleSave}
          className="flex items-center border-purple-300 text-purple-700 hover:bg-purple-50"
        >
          <Save className="mr-2 h-4 w-4" /> Salvar Alterações
        </Button>
        
        {activeSectionIndex === birthPlanSections.length - 1 ? (
          <Button 
            onClick={() => {
              handleSave();
              onNext();
            }}
            className="bg-purple-600 hover:bg-purple-700 flex items-center"
          >
            Visualizar Plano Completo <ChevronRight className="ml-2 h-4 w-4" />
          </Button>
        ) : (
          <Button 
            onClick={() => setActiveSectionIndex(Math.min(birthPlanSections.length - 1, activeSectionIndex + 1))}
            className="bg-purple-600 hover:bg-purple-700 flex items-center"
          >
            Próxima Seção <ChevronRight className="ml-2 h-4 w-4" />
          </Button>
        )}
      </div>
    </div>
  );
}
