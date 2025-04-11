
import { useEffect, useState } from 'react';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';

interface SelectableOptionsProps {
  question: any;
  questionId: string;
  selectedOptions: Record<string, Record<string, boolean>>;
  setSelectedOptions: React.Dispatch<React.SetStateAction<Record<string, Record<string, boolean>>>>;
  isSpecialField?: boolean;
  questionnaireAnswers?: Record<string, any>;
}

export function SelectableOptions({ 
  question, 
  questionId, 
  selectedOptions, 
  setSelectedOptions,
  isSpecialField = false,
  questionnaireAnswers = {}
}: SelectableOptionsProps) {
  
  // Add state to track initialization
  const [initialized, setInitialized] = useState(false);
  
  // Initialize on first render if options are empty
  useEffect(() => {
    if (!initialized && (!selectedOptions[questionId] || Object.keys(selectedOptions[questionId]).length === 0)) {
      console.log(`SelectableOptions: Initializing options for ${questionId}`);
      
      // Only initialize if we have options to work with
      if (question.options && question.options.length > 0) {
        const newOptions: Record<string, boolean> = {};
        
        // Initialize options from questionnaire answers
        question.options.forEach((option: string) => {
          let isSelected = false;
          
          // For checkbox questions
          if (question.type === 'checkbox' && 
              typeof questionnaireAnswers[questionId] === 'object' && 
              !Array.isArray(questionnaireAnswers[questionId])) {
            isSelected = !!questionnaireAnswers[questionId]?.[option];
          } 
          // For radio/select questions
          else if ((question.type === 'radio' || question.type === 'select') && 
              questionnaireAnswers[questionId] !== undefined) {
            isSelected = questionnaireAnswers[questionId] === option;
          }
          
          newOptions[option] = isSelected;
        });
        
        // Fixed: properly type the function parameter in setSelectedOptions
        setSelectedOptions((prev) => {
          return {
            ...prev,
            [questionId]: newOptions
          };
        });
        
        console.log(`SelectableOptions: Initialized options for ${questionId}:`, newOptions);
      }
      
      setInitialized(true);
    }
  }, [questionId, questionnaireAnswers, question, selectedOptions, setSelectedOptions, initialized]);
  
  if (!question.options || question.options.length === 0) {
    console.warn(`No options found for question ${questionId}`);
    return null;
  }
  
  // Debug for special questions
  if (['emergencyPreferences', 'highRiskComplications', 'lowRiskOccurrences'].includes(questionId)) {
    console.log(`SelectableOptions for special question: ${questionId}`);
    console.log(`Has answer:`, !!questionnaireAnswers[questionId]);
    console.log(`Options:`, question.options);
    console.log(`Current selected options:`, selectedOptions[questionId]);
  }
  
  const handleCheckedChange = (option: string, checked: boolean) => {
    // Create a copy of the current state
    const newSelectedOptions = { ...selectedOptions };
    
    // Initialize the question entry if it doesn't exist
    if (!newSelectedOptions[questionId]) {
      newSelectedOptions[questionId] = {};
    }
    
    // For radio buttons (single selection), uncheck all other options first
    if ((question.type === 'radio' || question.type === 'select') && !isSpecialField) {
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
    
    // Uncheck all options
    Object.keys(newSelectedOptions[questionId] || {}).forEach(opt => {
      newSelectedOptions[questionId][opt] = false;
    });
    
    // Select only the chosen option
    newSelectedOptions[questionId][option] = true;
    
    setSelectedOptions(newSelectedOptions);
  };
  
  // Special treatment for special fields
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
  
  // If it's a radio or select question, we should only allow one selected option
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
  
  // Default for checkbox (multiple selection)
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
