
import { useAddSelectedOptions } from "@/hooks/useAddSelectedOptions";
import { Button } from '@/components/ui/button';
import { SelectableOptions } from './SelectableOptions';
import {
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { useState, useEffect } from 'react';
import { Textarea } from '@/components/ui/textarea';

interface OptionsDialogProps {
  dialogOpen: boolean;
  setDialogOpen: (value: boolean) => void;
  activeFieldKey: string;
  selectedOptions: Record<string, Record<string, boolean>>;
  setSelectedOptions: React.Dispatch<React.SetStateAction<Record<string, Record<string, boolean>>>>;
  getRelevantQuestionsForField: (fieldKey: string) => Array<{question: any, sectionId: string}>;
  questionnaireAnswers: Record<string, any>;
  handleAddSelectedOptions: () => void;
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
  handleAddSelectedOptions
}: OptionsDialogProps) {
  const [relevantQuestions, setRelevantQuestions] = useState<Array<{question: any, sectionId: string}>>([]);
  const [hasRadioOnly, setHasRadioOnly] = useState(false);
  const [textareaValues, setTextareaValues] = useState<Record<string, string>>({});
  const [currentFieldKey, setCurrentFieldKey] = useState<string>('');
  const [hasMounted, setHasMounted] = useState(false);
  const [isFirstRender, setIsFirstRender] = useState(true);
  
  // Check if component has mounted on client to avoid portal error (ownerDocument)
  useEffect(() => {
    setHasMounted(true);
  }, []);

  // Reset selections and fields when active field changes
  useEffect(() => {
    if (activeFieldKey !== currentFieldKey) {
      console.log(`Field changed from ${currentFieldKey} to ${activeFieldKey}, resetting selections`);
      // Don't clear selections on first render, they should be initialized by resetOptionsForField
      if (!isFirstRender) {
        setSelectedOptions({}); // clear old selections
      }
      setTextareaValues({}); // clear textarea
      setCurrentFieldKey(activeFieldKey);
      setIsFirstRender(false);
    }
  }, [activeFieldKey, currentFieldKey, setSelectedOptions, isFirstRender]);

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
      
      // Fill initial textarea values based on already provided answers
      const initialTextareaValues: Record<string, string> = {};
      questions.forEach(({ question }) => {
        if (question.type === 'textarea' && questionnaireAnswers[question.id]) {
          initialTextareaValues[question.id] = questionnaireAnswers[question.id];
        }
      });
      setTextareaValues(initialTextareaValues);
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
          relevantQuestions.map(({ question }) => {
            const questionId = question.id;

            if (!question) return null;

            // Render textarea when question is textarea type
            if (question.type === 'textarea') {
              return (
                <div key={questionId} className="py-3 border-b border-gray-100">
                  <div className="font-medium text-maternal-900">{question.text}</div>
                  <div className="mt-2">
                    <Textarea 
                      value={textareaValues[questionId] || ''}
                      onChange={(e) => handleTextareaChange(questionId, e.target.value)}
                      placeholder="Digite sua resposta aqui..."
                      className="w-full"
                      rows={4}
                    />
                  </div>
                </div>
              );
            }

            // Render selectable options (radio/select)
            return (
              <div key={questionId} className="py-3 border-b border-gray-100">
                <div className="font-medium text-maternal-900">{question.text}</div>
                <SelectableOptions 
                  question={question} 
                  questionId={questionId} 
                  selectedOptions={selectedOptions}
                  setSelectedOptions={setSelectedOptions}
                  questionnaireAnswers={questionnaireAnswers}
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
