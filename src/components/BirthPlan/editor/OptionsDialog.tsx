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

  // Verifica se o componente já montou no cliente para evitar erro de portal (ownerDocument)
  const [hasMounted, setHasMounted] = useState(false);
  useEffect(() => {
    setHasMounted(true);
  }, []);

  // Hook customizado para lidar com a adição de opções selecionadas
  const { handleAddSelectedOptions } = useAddSelectedOptions({
    activeFieldKey,
    selectedOptions,
    localBirthPlan,
    setLocalBirthPlan,
    completedSections,
    setCompletedSections,
    setSelectedOptions,
    setDialogOpen,
    textareaValues,
    setTextareaValues,
  });

  // Reseta seleções e campos ao mudar o campo ativo
  useEffect(() => {
    if (activeFieldKey !== currentFieldKey) {
      console.log(`Field changed from ${currentFieldKey} to ${activeFieldKey}, resetting selections`);
      setSelectedOptions(() => ({})); // limpa seleções antigas
      setTextareaValues({}); // limpa textarea
      setCurrentFieldKey(activeFieldKey);
    }
  }, [activeFieldKey, currentFieldKey, setSelectedOptions]);

  // Atualiza perguntas relevantes ao abrir o diálogo
  useEffect(() => {
    if (dialogOpen && activeFieldKey) {
      const questions = getRelevantQuestionsForField(activeFieldKey);
      setRelevantQuestions(questions);

      // Verifica se todas as perguntas são do tipo radio ou select
      const onlyRadioQuestions = questions.length > 0 && 
        questions.every(q => q.question.type === 'radio' || q.question.type === 'select');
      setHasRadioOnly(onlyRadioQuestions);

      // Preenche os valores iniciais do textarea com base nas respostas já fornecidas
      const initialTextareaValues: Record<string, string> = {};
      questions.forEach(({ question }) => {
        if (question.type === 'textarea' && questionnaireAnswers[question.id]) {
          initialTextareaValues[question.id] = questionnaireAnswers[question.id];
        }
      });
      setTextareaValues(initialTextareaValues);
    }
  }, [dialogOpen, activeFieldKey, getRelevantQuestionsForField, questionnaireAnswers]);

  // Lista de campos especiais que sempre exibem textarea
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

  // Atualiza valores do textarea conforme o usuário digita
  const handleTextareaChange = (questionId: string, value: string) => {
    setTextareaValues(prev => ({
      ...prev,
      [questionId]: value
    }));
  };

  // Se ainda não montou no cliente, não renderiza o dialog (previne erro do portal)
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

            // Renderiza textarea quando a pergunta for do tipo textarea
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

            // Renderiza opções selecionáveis (radio/select)
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
