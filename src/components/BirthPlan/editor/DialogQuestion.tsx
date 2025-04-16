
import { Textarea } from '@/components/ui/textarea';
import { SelectableOptions } from './SelectableOptions';

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
  
  // Enhanced debugging for special fields
  if (specialQuestionIds.includes(questionId)) {
    console.log(`DialogQuestion rendering special question: ${questionId}`);
    console.log(`Question data:`, question);
    console.log(`Question type (should be checkbox):`, question.type);
    console.log(`Selected options:`, selectedOptions[questionId]);
    
    // Check what's in questionnaire answers for this ID
    if (questionnaireAnswers && questionnaireAnswers[questionId]) {
      console.log(`Questionnaire answers for ${questionId}:`, questionnaireAnswers[questionId]);
      
      // If it's an object, log the selected true values
      if (typeof questionnaireAnswers[questionId] === 'object' && !Array.isArray(questionnaireAnswers[questionId])) {
        const selectedOptions = Object.entries(questionnaireAnswers[questionId])
          .filter(([_, value]) => !!value)
          .map(([key]) => key);
        console.log(`Selected options from questionnaire for ${questionId}:`, selectedOptions);
      }
    } else {
      console.log(`No questionnaire answers found for ${questionId}`);
    }
  }

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

  // Special treatment for known special situation questions - ALWAYS treat these as checkbox type
  const isSpecialField = specialQuestionIds.includes(questionId);
  
  // If this is a special field, ensure it's treated as a checkbox regardless of its type
  if (isSpecialField && question.type !== 'checkbox') {
    console.log(`Forcing checkbox treatment for special field ${questionId} with original type ${question.type}`);
    question = {
      ...question,
      type: 'checkbox'  // Force checkbox type
    };
  }

  // Render selectable options (radio/select/checkbox)
  return (
    <div className="py-3 border-b border-gray-100">
      <div className="font-medium text-maternal-900">{question.text}</div>
      <SelectableOptions 
        question={question} 
        questionId={questionId} 
        selectedOptions={selectedOptions}
        setSelectedOptions={setSelectedOptions}
        questionnaireAnswers={questionnaireAnswers}
        isSpecialField={isSpecialField}
      />
    </div>
  );
}
