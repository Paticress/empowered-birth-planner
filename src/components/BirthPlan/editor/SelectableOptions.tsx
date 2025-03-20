
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';

interface SelectableOptionsProps {
  question: any;
  questionId: string;
  selectedOptions: Record<string, Record<string, boolean>>;
  setSelectedOptions: (value: Record<string, Record<string, boolean>>) => void;
}

export function SelectableOptions({ 
  question, 
  questionId, 
  selectedOptions, 
  setSelectedOptions 
}: SelectableOptionsProps) {
  if (!question.options || question.options.length === 0) {
    return null;
  }
  
  const handleCheckedChange = (option: string, checked: boolean) => {
    const newSelectedOptions = {
      ...selectedOptions,
      [questionId]: {
        ...selectedOptions[questionId],
        [option]: checked
      }
    };
    setSelectedOptions(newSelectedOptions);
  };
  
  return (
    <div className="space-y-2 ml-8 mt-2">
      {question.options.map((option: string) => {
        const isSelected = selectedOptions[questionId]?.[option] || false;
        return (
          <div key={option} className="flex items-center space-x-2">
            <Checkbox
              id={`option-${questionId}-${option}`}
              checked={isSelected}
              onCheckedChange={(checked) => {
                handleCheckedChange(option, !!checked);
              }}
            />
            <Label 
              htmlFor={`option-${questionId}-${option}`}
              className={`text-sm ${isSelected ? 'font-medium' : 'text-gray-600'}`}
            >
              {option}
            </Label>
          </div>
        );
      })}
    </div>
  );
}
