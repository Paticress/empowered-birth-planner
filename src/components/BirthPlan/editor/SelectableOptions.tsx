
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';

interface SelectableOptionsProps {
  question: any;
  questionId: string;
  selectedOptions: Record<string, Record<string, boolean>>;
  setSelectedOptions: (value: Record<string, Record<string, boolean>>) => void;
  isSpecialField?: boolean;
}

export function SelectableOptions({ 
  question, 
  questionId, 
  selectedOptions, 
  setSelectedOptions,
  isSpecialField = false
}: SelectableOptionsProps) {
  if (!question.options || question.options.length === 0) {
    return null;
  }
  
  const handleCheckedChange = (option: string, checked: boolean) => {
    // Create a copy of the current state
    const newSelectedOptions = { ...selectedOptions };
    
    // Initialize the question entry if it doesn't exist
    if (!newSelectedOptions[questionId]) {
      newSelectedOptions[questionId] = {};
    }
    
    // For radio buttons (single selection), unselect all other options first
    if (question.type === 'radio' || question.type === 'select') {
      Object.keys(newSelectedOptions[questionId] || {}).forEach(opt => {
        newSelectedOptions[questionId][opt] = false;
      });
    }
    
    // Set the selected option
    newSelectedOptions[questionId][option] = checked;
    
    setSelectedOptions(newSelectedOptions);
  };
  
  // Handle radio selection (single selection)
  const handleRadioSelection = (option: string) => {
    const newSelectedOptions = { ...selectedOptions };
    
    // Initialize the question entry if it doesn't exist
    if (!newSelectedOptions[questionId]) {
      newSelectedOptions[questionId] = {};
    }
    
    // Unselect all options
    Object.keys(newSelectedOptions[questionId] || {}).forEach(opt => {
      newSelectedOptions[questionId][opt] = false;
    });
    
    // Select only the chosen option
    newSelectedOptions[questionId][option] = true;
    
    setSelectedOptions(newSelectedOptions);
  };
  
  // Special handling for emergency scenarios and complications fields
  // For these fields, we want to potentially select multiple radio options
  // across different questions
  if (isSpecialField && (question.type === 'radio' || question.type === 'select')) {
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
  
  // If it's a radio or select question, we should only allow one option to be selected
  if (question.type === 'radio' || question.type === 'select') {
    // Find the selected option (if any) or leave empty
    const selectedOption = Object.entries(selectedOptions[questionId] || {})
      .find(([_, isSelected]) => isSelected)?.[0] || '';
      
    return (
      <div className="space-y-2 ml-8 mt-2">
        <RadioGroup 
          value={selectedOption}
          onValueChange={handleRadioSelection}
          className="space-y-2"
        >
          {question.options.map((option: string) => (
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
  
  // Default to checkbox for multiple selection
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
