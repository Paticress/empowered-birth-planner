
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { Dialog, DialogTrigger } from '@/components/ui/dialog';
import { QuestionnaireOptionsDialog } from './QuestionnaireOptionsDialog';

interface FieldEditorProps {
  sectionId: string;
  field: { 
    key: string; 
    label: string; 
  };
  value: string;
  onChange: (sectionId: string, fieldKey: string, value: any) => void;
  questionnaireAnswers?: Record<string, any>;
  showAddButton: boolean;
}

export function FieldEditor({ 
  sectionId, 
  field, 
  value, 
  onChange, 
  questionnaireAnswers = {},
  showAddButton
}: FieldEditorProps) {
  return (
    <div className="mb-6 border border-maternal-100 rounded-lg p-4 bg-maternal-50/30">
      <div className="flex justify-between items-center mb-2">
        <label 
          htmlFor={`${sectionId}-${field.key}`} 
          className="block font-medium text-maternal-800"
        >
          {field.label}
        </label>
        
        {showAddButton && (
          <Dialog>
            <DialogTrigger asChild>
              <Button 
                variant="outline" 
                size="sm"
                className="flex items-center gap-1 border-maternal-300 text-maternal-600 text-xs"
              >
                <Plus className="h-3 w-3" /> Adicionar do Questionário
              </Button>
            </DialogTrigger>
            <QuestionnaireOptionsDialog 
              fieldKey={field.key}
              fieldLabel={field.label}
              sectionId={sectionId}
              questionnaireAnswers={questionnaireAnswers}
              onAddOptions={(updatedValue) => onChange(sectionId, field.key, updatedValue)}
            />
          </Dialog>
        )}
      </div>
      
      <Textarea
        id={`${sectionId}-${field.key}`}
        value={Array.isArray(value) ? value.join('\n') : value}
        onChange={(e) => onChange(
          sectionId, 
          field.key, 
          e.target.value
        )}
        rows={6}
        className="w-full border-maternal-200 focus:border-maternal-400 focus:ring-maternal-400"
        placeholder={`Insira suas preferências para ${field.label.toLowerCase()}`}
      />
    </div>
  );
}
