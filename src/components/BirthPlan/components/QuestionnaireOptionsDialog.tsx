
import { useState } from 'react';
import { 
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose
} from "@/components/ui/dialog";
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';
import { QuestionnaireOptionItem } from './QuestionnaireOptionItem';
import { 
  findQuestionById, 
  formatSelectedOptions, 
  getRelevantQuestionsForField,
  getFormattedDisplayValue
} from '../utils/questionnaireUtils';

interface QuestionnaireOptionsDialogProps {
  fieldKey: string;
  fieldLabel: string;
  sectionId: string;
  questionnaireAnswers: Record<string, any>;
  onAddOptions: (updatedValue: string) => void;
}

export function QuestionnaireOptionsDialog({
  fieldKey,
  fieldLabel,
  questionnaireAnswers,
  onAddOptions
}: QuestionnaireOptionsDialogProps) {
  const [selectedQuestionOptions, setSelectedQuestionOptions] = useState<Record<string, any>>({});
  
  // Handler for updating the selected state of a question option
  const handleSelectionChange = (questionId: string, isSelected: boolean) => {
    setSelectedQuestionOptions(prev => ({
      ...prev,
      [questionId]: isSelected
    }));
  };

  // Add selected questionnaire options to the field
  const handleAddQuestionnaireOptionsForField = (fieldKey: string) => {
    let updatedValue = '';
    
    Object.entries(selectedQuestionOptions).forEach(([questionId, isSelected]) => {
      if (!isSelected) return;
      
      // Find the question and original section
      const questionData = findQuestionById(questionId);
      if (!questionData) return;
      
      // Get the questionnaire answer value
      const answer = questionnaireAnswers[questionId];
      if (!answer && answer !== false) return;
      
      // Format the answer
      const formattedAnswer = formatSelectedOptions(questionId, answer);
      
      // Add to the value string
      if (updatedValue) {
        updatedValue += '\n';
      }
      updatedValue += formattedAnswer;
    });
    
    if (updatedValue) {
      onAddOptions(updatedValue);
      setSelectedQuestionOptions({});
      
      toast({
        title: "Opções adicionadas",
        description: "As opções selecionadas foram adicionadas ao seu plano de parto."
      });
    }
  };
  
  const relevantQuestions = getRelevantQuestionsForField(fieldKey, questionnaireAnswers);
  
  return (
    <DialogContent className="max-w-md">
      <DialogHeader>
        <DialogTitle>Adicionar Respostas do Questionário</DialogTitle>
        <DialogDescription>
          Selecione as opções do questionário para adicionar ao campo "{fieldLabel}".
        </DialogDescription>
      </DialogHeader>
      
      <div className="max-h-[60vh] overflow-y-auto py-4">
        {relevantQuestions.map(({ question }) => (
          <QuestionnaireOptionItem
            key={question.id}
            questionId={question.id}
            questionText={question.text}
            displayValue={getFormattedDisplayValue(question, questionnaireAnswers)}
            isSelected={!!selectedQuestionOptions[question.id]}
            onSelectionChange={handleSelectionChange}
          />
        ))}
      </div>
      
      <DialogFooter>
        <DialogClose asChild>
          <Button variant="outline">Cancelar</Button>
        </DialogClose>
        <DialogClose asChild>
          <Button onClick={() => handleAddQuestionnaireOptionsForField(fieldKey)}>Adicionar Selecionados</Button>
        </DialogClose>
      </DialogFooter>
    </DialogContent>
  );
}
