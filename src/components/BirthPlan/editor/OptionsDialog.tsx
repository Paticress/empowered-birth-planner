
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
import { Textarea } from '@/components/ui/textarea';

interface OptionsDialogProps {
  dialogOpen: boolean;
  setDialogOpen: (value: boolean) => void;
  activeFieldKey: string;
  selectedOptions: Record<string, Record<string, boolean>>;
  setSelectedOptions: (value: Record<string, Record<string, boolean>>) => void;
  getRelevantQuestionsForField: (fieldKey: string) => Array<{question: any, sectionId: string}>;
  handleAddSelectedOptions: () => void;
  questionnaireAnswers: Record<string, any>;
}

export function OptionsDialog({
  dialogOpen,
  setDialogOpen,
  activeFieldKey,
  selectedOptions,
  setSelectedOptions,
  getRelevantQuestionsForField,
  handleAddSelectedOptions,
  questionnaireAnswers
}: OptionsDialogProps) {
  const [relevantQuestions, setRelevantQuestions] = useState<Array<{question: any, sectionId: string}>>([]);
  const [hasRadioOnly, setHasRadioOnly] = useState(false);
  const [textareaValues, setTextareaValues] = useState<Record<string, string>>({});
  
  // Update relevant questions when activeFieldKey changes or dialog opens
  useEffect(() => {
    if (dialogOpen && activeFieldKey) {
      // Reset any previous selections from other fields
      setSelectedOptions({});
      setTextareaValues({});
      
      // Get questions that are specifically relevant to this field
      const questions = getRelevantQuestionsForField(activeFieldKey);
      setRelevantQuestions(questions);
      
      // Check if all questions are radio type
      const onlyRadioQuestions = questions.length > 0 && 
        questions.every(q => q.question.type === 'radio' || q.question.type === 'select');
      setHasRadioOnly(onlyRadioQuestions);
      
      // Initialize textarea values from questionnaire answers
      const initialTextareaValues: Record<string, string> = {};
      questions.forEach(({ question }) => {
        if (question.type === 'textarea' && questionnaireAnswers[question.id]) {
          initialTextareaValues[question.id] = questionnaireAnswers[question.id];
        }
      });
      setTextareaValues(initialTextareaValues);
      
      // Debug logging
      console.log(`Dialog opened for field: ${activeFieldKey}`);
      console.log(`Found ${questions.length} relevant questions:`, questions.map(q => q.question.id));
    }
  }, [dialogOpen, activeFieldKey, getRelevantQuestionsForField, questionnaireAnswers, setSelectedOptions]);
  
  // Special case for specific fields
  const isSpecialField = [
    'emergencyScenarios',
    'highRiskComplications',
    'lowRiskOccurrences',
    'cascadeInterventions',
    'unexpectedScenarios',
    'specialWishes',
    'painRelief',
    'interventionsRoutine',
    'consentimentoInformado'
  ].includes(activeFieldKey);
  
  const handleTextareaChange = (questionId: string, value: string) => {
    setTextareaValues(prev => ({
      ...prev,
      [questionId]: value
    }));
  };
  
  return (
    <DialogContent className="max-w-md">
      <DialogHeader>
        <DialogTitle>Adicionar Respostas do Questionário</DialogTitle>
      </DialogHeader>
      
      <div className="max-h-[60vh] overflow-y-auto py-4">
        {relevantQuestions.length > 0 ? (
          relevantQuestions.map(({ question }) => {
            const questionId = question.id;
            
            // Handle textarea type questions
            if (question.type === 'textarea') {
              return (
                <div key={questionId} className="py-3 border-b border-gray-100">
                  <div className="font-medium text-maternal-900">
                    {question.text}
                  </div>
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
