
import { QuestionnaireOptionItem } from './QuestionnaireOptionItem';
import { getFormattedDisplayValue } from '../utils/questionnaireUtils';

interface QuestionsListProps {
  questions: Array<{question: any, sectionId: string}>;
  questionnaireAnswers: Record<string, any>;
  selectedOptions: Record<string, boolean>;
  onSelectionChange: (questionId: string, isSelected: boolean) => void;
}

export function QuestionnaireOptionsList({
  questions,
  questionnaireAnswers,
  selectedOptions,
  onSelectionChange
}: QuestionsListProps) {
  if (questions.length === 0) {
    return (
      <div className="py-4 text-center text-gray-500">
        Nenhuma opção relevante encontrada para este campo.
      </div>
    );
  }

  return (
    <div className="space-y-1">
      {questions.map(({ question }) => (
        <QuestionnaireOptionItem
          key={question.id}
          questionId={question.id}
          questionText={question.text}
          displayValue={getFormattedDisplayValue(question, questionnaireAnswers)}
          isSelected={!!selectedOptions[question.id]}
          onSelectionChange={onSelectionChange}
        />
      ))}
    </div>
  );
}
