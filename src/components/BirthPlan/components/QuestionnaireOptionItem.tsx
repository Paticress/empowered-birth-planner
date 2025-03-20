
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';

interface QuestionnaireOptionItemProps {
  questionId: string;
  questionText: string;
  displayValue: string;
  isSelected: boolean;
  onSelectionChange: (questionId: string, checked: boolean) => void;
}

export function QuestionnaireOptionItem({
  questionId,
  questionText,
  displayValue,
  isSelected,
  onSelectionChange
}: QuestionnaireOptionItemProps) {
  return (
    <div className="flex items-start space-x-2 py-2 border-b border-gray-100">
      <Checkbox 
        id={`add-${questionId}`}
        checked={isSelected}
        onCheckedChange={(checked) => {
          onSelectionChange(questionId, !!checked);
        }}
      />
      <div className="grid gap-1.5 leading-none">
        <Label htmlFor={`add-${questionId}`} className="font-medium">
          {questionText}
        </Label>
        {displayValue && (
          <p className="text-sm text-gray-500 mt-1">
            {displayValue}
          </p>
        )}
      </div>
    </div>
  );
}
