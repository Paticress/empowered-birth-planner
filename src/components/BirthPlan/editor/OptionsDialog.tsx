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
  setSelectedOptions: (value: Record<string, Record<string, boolean>>) => void;
  getRelevantQuestionsForField: (fieldKey: string) => Array<{question: any, sectionId: string}>;
  questionnaireAnswers: Record<string, any>;
}

// Componente principal do dialog
export function OptionsDialog({
  dialogOpen,
  setDialogOpen,
  activeFieldKey,
  selectedOptions,
  setSelectedOptions,
  getRelevantQuestionsForField,
  questionnaireAnswers
}: OptionsDialogProps) {
  const [relevantQuestions, setRelevantQuestions] = useState<Array<{question: any, sectionId: string}>>([]);
  const [hasRadioOnly, setHasRadioOnly] = useState(false);
  const [textareaValues, setTextareaValues] = useState<Record<string, string>>({});
  const [currentFieldKey, setCurrentFieldKey] = useState<string>('');
  const [localBirthPlan, setLocalBirthPlan] = useState({});
  const [completedSections, setCompletedSections] = useState<string[]>([]);

  // Cria a função handleAddSelectedOptions com dados sempre atualizados
  const { handleAddSelectedOptions } = useAddSelectedOptions({
    activeFieldKey,
    selectedOptions: Object.entries(selectedOptions).reduce((acc, [qId, opts]) => {
      acc[qId] = Object.entries(opts)
        .filter(([_, isSelected]) => isSelected)
        .map(([opt]) => opt);
      return acc;
    }, {} as Record<string, string[]>),
    localBirthPlan,
    setLocalBirthPlan,
    completedSections,
    setCompletedSections,
    setSelectedOptions,
    setDialogOpen,
    textareaValues,
    setTextareaValues,
  });

  // Reset de seleções ao mudar de campo ativo
  useEffect(() => {
    if (activeFieldKey !== currentFieldKey) {
      console.log(`Field changed from ${currentFieldKey} to ${activeFieldKey}, resetting selections`);
      setSelectedOptions({}); // limpa seleções antigas
      setTextareaValues({}); // limpa textarea
      setCurrentFieldKey(activeFieldKey);
    }
  }, [activeFieldKey, currentFieldKey, setSelectedOptions]);

  // Atualiza perguntas relevantes quando abrir o diálogo
  useEffect(() => {
    if (dialogOpen && activeFieldKey) {
      const questions = getRelevantQuestionsForField(activeFieldKey);
      setRelevantQuestions(questions);

      // Verifica se todas são do tipo radio/select
      const onlyRadioQuestions = questions.length > 0 && 
        questions.every(q => q.question.type === 'radio' || q.question.type === 'select');
      setHasRadioOnly(onlyRadioQuestions);

      // Preenche campos de textarea com as respostas existentes
      const initialTextareaValues: Record<string, string> = {};
      questions.forEach(({ question }) => {
        if (question.type === 'textarea' && questionnaireAnswers[question.id]) {
          initialTextareaValues[question.id] = questionnaireAnswers[question.id];
        }
      });
      setTextareaValues(initialTextareaValues);
    }
  }, [dialogOpen, activeFieldKey, getRelevantQuestionsForField, questionnaireAnswers]);

  // Lista de campos especiais (exibe textarea mesmo com perguntas padrão)
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

  // Atualiza respostas digitadas nas textareas
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

            if (!question) return null;

            // Renderiza textarea
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

            // Renderiza opções selecionáveis
            return (
              <div key={questionId} className="py-3 border-b border-gray-100">
                <div className="font-medium text-maternal-900">{question.text}</div>
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
