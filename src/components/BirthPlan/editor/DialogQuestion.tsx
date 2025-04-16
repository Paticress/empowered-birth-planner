
import { Textarea } from '@/components/ui/textarea';
import { SelectableOptions } from './SelectableOptions';
import { useEffect } from 'react';

interface DialogQuestionProps {
  question: any;
  questionId: string;
  selectedOptions: Record<string, Record<string, boolean>>;
  setSelectedOptions: React.Dispatch<React.SetStateAction<Record<string, Record<string, boolean>>>>;
  questionnaireAnswers: Record<string, any>;
  textareaValues: Record<string, string>;
  onTextareaChange: (questionId: string, value: string) => void;
}

export function DialogQuestion({
  question,
  questionId,
  selectedOptions,
  setSelectedOptions,
  questionnaireAnswers,
  textareaValues,
  onTextareaChange
}: DialogQuestionProps) {
  if (!question) return null;

  // List of special fields that should always be treated as checkboxes
  const specialQuestionIds = ['emergencyPreferences', 'highRiskComplications', 'lowRiskOccurrences'];
  
  // Check if this is one of our special question IDs
  const isSpecialQuestion = specialQuestionIds.includes(questionId);
  
  // Enhanced debugging for special fields
  useEffect(() => {
    if (isSpecialQuestion) {
      console.log(`DialogQuestion initialized special question: ${questionId}`);
      console.log(`Question data:`, question);
      console.log(`Question type (original): ${question.type}`);
      console.log(`Current selected options:`, selectedOptions[questionId]);
      
      // Check what's in questionnaire answers for this ID
      if (questionnaireAnswers && questionnaireAnswers[questionId]) {
        console.log(`Questionnaire answers for ${questionId}:`, questionnaireAnswers[questionId]);
        
        // If it's an object, log the selected true values
        if (typeof questionnaireAnswers[questionId] === 'object' && !Array.isArray(questionnaireAnswers[questionId])) {
          const selectedAnswers = Object.entries(questionnaireAnswers[questionId])
            .filter(([_, value]) => !!value)
            .map(([key]) => key);
          console.log(`Selected options from questionnaire for ${questionId}:`, selectedAnswers);
        }
      } else {
        console.log(`No questionnaire answers found for ${questionId}`);
      }
    }
  }, [isSpecialQuestion, questionId, question, questionnaireAnswers, selectedOptions]);

  // Render textarea when question is textarea type
  if (question.type === 'textarea') {
    return (
      <div className="py-3 border-b border-gray-100">
        <div className="font-medium text-maternal-900">{question.text}</div>
        <div className="mt-2">
          <Textarea 
            value={textareaValues[questionId] || ''}
            onChange={(e) => onTextareaChange(questionId, e.target.value)}
            placeholder="Digite sua resposta aqui..."
            className="w-full"
            rows={4}
          />
        </div>
      </div>
    );
  }

  // Create a modified question for special fields to ensure checkbox treatment
  const questionToRender = isSpecialQuestion 
    ? { ...question, type: 'checkbox' } // Force checkbox type for special questions
    : question;

  // Render selectable options (radio/select/checkbox)
  return (
    <div className="py-3 border-b border-gray-100">
      <div className="font-medium text-maternal-900">{questionToRender.text}</div>
      <SelectableOptions 
        question={questionToRender} 
        questionId={questionId} 
        selectedOptions={selectedOptions}
        setSelectedOptions={setSelectedOptions}
        questionnaireAnswers={questionnaireAnswers}
        isSpecialField={isSpecialQuestion}
      />
    </div>
  );
}
