
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';

interface RadioOptionsProps {
  options: string[];
  questionId: string;
  selectedOption: string;
  onValueChange: (option: string) => void;
}

export function RadioOptions({
  options,
  questionId,
  selectedOption,
  onValueChange
}: RadioOptionsProps) {
  return (
    <div className="space-y-2 ml-8 mt-2">
      <RadioGroup 
        value={selectedOption}
        onValueChange={onValueChange}
        className="space-y-2"
      >
        {options.map((option: string) => (
          <div key={option} className="flex items-center space-x-2">
            <RadioGroupItem value={option} id={`option-${questionId}-${option}`} />
            <Label 
              htmlFor={`option-${questionId}-${option}`}
              className={`text-sm ${selectedOption === option ? 'font-medium' : 'text-gray-600'}`}
            >
              {option}
            </Label>
          </div>
        ))}
      </RadioGroup>
    </div>
  );
}
