
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { SelectableOptions } from './SelectableOptions';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

interface OptionsDialogProps {
  dialogOpen: boolean;
  setDialogOpen: (value: boolean) => void;
  activeFieldKey: string;
  selectedOptions: Record<string, Record<string, boolean>>;
  setSelectedOptions: (value: Record<string, Record<string, boolean>>) => void;
  getRelevantQuestionsForField: (fieldKey: string) => Array<{question: any, sectionId: string}>;
  handleAddSelectedOptions: () => void;
}

export function OptionsDialog({
  dialogOpen,
  setDialogOpen,
  activeFieldKey,
  selectedOptions,
  setSelectedOptions,
  getRelevantQuestionsForField,
  handleAddSelectedOptions
}: OptionsDialogProps) {
  return (
    <DialogContent className="max-w-md">
      <DialogHeader>
        <DialogTitle>Adicionar Respostas do Questionário</DialogTitle>
      </DialogHeader>
      
      <div className="max-h-[60vh] overflow-y-auto py-4">
        {getRelevantQuestionsForField(activeFieldKey).length > 0 ? (
          getRelevantQuestionsForField(activeFieldKey).map(({ question }) => {
            const questionId = question.id;
            
            return (
              <div key={questionId} className="py-3 border-b border-gray-100">
                <div className="font-medium text-maternal-900">
                  {question.text}
                </div>
                
                <SelectableOptions 
                  question={question} 
                  questionId={questionId} 
                  selectedOptions={selectedOptions}
                  setSelectedOptions={setSelectedOptions}
                />
              </div>
            );
          })
        ) : (
          <p className="text-center py-4 text-gray-500">
            Não há respostas disponíveis do questionário para este campo.
          </p>
        )}
      </div>
      
      <DialogFooter>
        <Button variant="outline" onClick={() => setDialogOpen(false)}>
          Cancelar
        </Button>
        <Button onClick={handleAddSelectedOptions}>
          Adicionar Selecionados
        </Button>
      </DialogFooter>
    </DialogContent>
  );
}
