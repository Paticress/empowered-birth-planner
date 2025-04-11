
import { Button } from '@/components/ui/button';
import {
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { useState, useEffect } from 'react';
import { DialogQuestion } from './DialogQuestion';

interface OptionsDialogProps {
  dialogOpen: boolean;
  setDialogOpen: (value: boolean) => void;
  activeFieldKey: string;
  selectedOptions: Record<string, Record<string, boolean>>;
  setSelectedOptions: React.Dispatch<React.SetStateAction<Record<string, Record<string, boolean>>>>;
  getRelevantQuestionsForField: (fieldKey: string) => Array<{question: any, sectionId: string}>;
  questionnaireAnswers: Record<string, any>;
  handleAddSelectedOptions: () => void;
  textareaValues: Record<string, string>;
  setTextareaValues: React.Dispatch<React.SetStateAction<Record<string, string>>>;
}

// Main dialog component
export function OptionsDialog({
  dialogOpen,
  setDialogOpen,
  activeFieldKey,
  selectedOptions,
  setSelectedOptions,
  getRelevantQuestionsForField,
  questionnaireAnswers,
  handleAddSelectedOptions,
  textareaValues,
  setTextareaValues
}: OptionsDialogProps) {
  const [relevantQuestions, setRelevantQuestions] = useState<Array<{question: any, sectionId: string}>>([]);
  const [hasRadioOnly, setHasRadioOnly] = useState(false);
  const [hasMounted, setHasMounted] = useState(false);
  
  // Check if component has mounted on client to avoid portal error (ownerDocument)
  useEffect(() => {
    setHasMounted(true);
  }, []);

  // Update relevant questions when dialog opens
  useEffect(() => {
    if (dialogOpen && activeFieldKey) {
      console.log(`Dialog opened for field ${activeFieldKey}, getting relevant questions`);
      const questions = getRelevantQuestionsForField(activeFieldKey);
      setRelevantQuestions(questions);

      // Check if all questions are radio or select type
      const onlyRadioQuestions = questions.length > 0 && 
        questions.every(q => q.question.type === 'radio' || q.question.type === 'select');
      setHasRadioOnly(onlyRadioQuestions);

      console.log(`Selected options on dialog open:`, selectedOptions);
      console.log(`Textarea values on dialog open:`, textareaValues);
    }
  }, [dialogOpen, activeFieldKey, getRelevantQuestionsForField, questionnaireAnswers, selectedOptions]);

  // Update textarea values as user types
  const handleTextareaChange = (questionId: string, value: string) => {
    setTextareaValues(prev => ({
      ...prev,
      [questionId]: value
    }));
  };

  // If not mounted on client, don't render dialog (prevents portal error)
  if (!hasMounted || !dialogOpen) return null;

  return (
    <DialogContent className="max-w-md">
      <DialogHeader>
        <DialogTitle>Adicionar Respostas do Questionário</DialogTitle>
      </DialogHeader>

      <div className="max-h-[60vh] overflow-y-auto py-4">
        {relevantQuestions.length > 0 ? (
          relevantQuestions.map(({ question }) => (
            <DialogQuestion 
              key={question.id}
              question={question}
              questionId={question.id}
              selectedOptions={selectedOptions}
              setSelectedOptions={setSelectedOptions}
              questionnaireAnswers={questionnaireAnswers}
              textareaValues={textareaValues}
              onTextareaChange={handleTextareaChange}
            />
          ))
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
