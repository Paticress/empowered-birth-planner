
import { Button } from '@/components/ui/button';
import { SelectableOptions } from './SelectableOptions';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { useState, useEffect } from 'react';

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
  const [relevantQuestions, setRelevantQuestions] = useState<Array<{question: any, sectionId: string}>>([]);
  const [hasRadioOnly, setHasRadioOnly] = useState(false);
  
  // Update relevant questions when activeFieldKey changes
  useEffect(() => {
    if (dialogOpen && activeFieldKey) {
      const questions = getRelevantQuestionsForField(activeFieldKey);
      setRelevantQuestions(questions);
      
      // Check if all questions are radio type
      const onlyRadioQuestions = questions.length > 0 && 
        questions.every(q => q.question.type === 'radio' || q.question.type === 'select');
      setHasRadioOnly(onlyRadioQuestions);
    }
  }, [dialogOpen, activeFieldKey, getRelevantQuestionsForField]);
  
  // Special case for emergency scenarios and complications fields
  const isSpecialField = activeFieldKey === 'emergencyScenarios' ||
                       activeFieldKey === 'highRiskComplications' ||
                       activeFieldKey === 'lowRiskOccurrences' ||
                       activeFieldKey === 'cascadeInterventions' ||
                       activeFieldKey === 'unexpectedScenarios' ||
                       activeFieldKey === 'specialWishes';
  
  return (
    <DialogContent className="max-w-md">
      <DialogHeader>
        <DialogTitle>Adicionar Respostas do Questionário</DialogTitle>
      </DialogHeader>
      
      <div className="max-h-[60vh] overflow-y-auto py-4">
        {relevantQuestions.length > 0 ? (
          relevantQuestions.map(({ question }) => {
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
                  isSpecialField={isSpecialField}
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
        <Button 
          onClick={handleAddSelectedOptions}
          disabled={relevantQuestions.length === 0}
        >
          {hasRadioOnly ? "Selecionar Opção" : "Adicionar Selecionadas"}
        </Button>
      </DialogFooter>
    </DialogContent>
  );
}
