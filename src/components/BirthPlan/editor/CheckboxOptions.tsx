
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';

interface CheckboxOptionsProps {
  options: string[];
  questionId: string;
  selectedOptions: Record<string, boolean>;
  onCheckedChange: (option: string, checked: boolean) => void;
}

export function CheckboxOptions({
  options,
  questionId,
  selectedOptions,
  onCheckedChange
}: CheckboxOptionsProps) {
  return (
    <div className="space-y-2 ml-8 mt-2">
      {options.map((option: string) => {
        const isSelected = selectedOptions?.[option] || false;
        return (
          <div key={option} className="flex items-center space-x-2">
            <Checkbox
              id={`option-${questionId}-${option}`}
              checked={isSelected}
              onCheckedChange={(checked) => {
                onCheckedChange(option, !!checked);
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
