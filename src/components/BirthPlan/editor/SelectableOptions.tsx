
import { useEffect, useState } from 'react';
import { CheckboxOptions } from './CheckboxOptions';
import { RadioOptions } from './RadioOptions';
import { initializeQuestionOptions, updateSelectionState } from './utils/optionSelectionUtils';

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
  
  // Special fields that must be treated as checkboxes
  const specialFieldIds = ['emergencyPreferences', 'highRiskComplications', 'lowRiskOccurrences'];
  
  // Check if this is one of our special question IDs
  const isSpecialQuestion = specialFieldIds.includes(questionId);
  
  // If this is a special field or special question, force checkbox behavior
  const forceCheckbox = isSpecialField || isSpecialQuestion;
  
  // Initialize on first render if options are empty
  useEffect(() => {
    if (!initialized && (!selectedOptions[questionId] || Object.keys(selectedOptions[questionId]).length === 0)) {
      console.log(`Initializing options for ${questionId} (special field: ${forceCheckbox ? 'yes' : 'no'})`);
      
      // Only initialize if we have options to work with
      if (question.options && question.options.length > 0) {
        const newOptions = initializeQuestionOptions(question, questionId, questionnaireAnswers);
        
        setSelectedOptions((prev) => {
          return {
            ...prev,
            [questionId]: newOptions
          };
        });
        
        console.log(`Initialized options for ${questionId}:`, newOptions);
      }
      
      setInitialized(true);
    }
  }, [questionId, questionnaireAnswers, question, selectedOptions, setSelectedOptions, initialized, forceCheckbox]);
  
  if (!question.options || question.options.length === 0) {
    console.warn(`No options found for question ${questionId}`);
    return null;
  }
  
  // Enhanced debugging for special questions
  if (forceCheckbox) {
    console.log(`Rendering options for special question: ${questionId}`);
    console.log(`Question type: ${question.type}`);
    console.log(`Force checkbox: ${forceCheckbox}`);
    console.log(`Options:`, question.options);
    console.log(`Current selected options:`, selectedOptions[questionId]);
  }
  
  const handleCheckedChange = (option: string, checked: boolean) => {
    // For special fields, we always use checkbox behavior even if originally radio/select
    const newSelections = updateSelectionState(
      questionId,
      option,
      checked,
      selectedOptions,
      (question.type === 'radio' || question.type === 'select') && !forceCheckbox,
      forceCheckbox
    );
    
    // Log what's happening with the selection for special fields
    if (forceCheckbox) {
      console.log(`Updating selection for special field ${questionId}:`, {
        option,
        checked,
        newState: newSelections[questionId]
      });
    }
    
    setSelectedOptions(newSelections);
  };
  
  // Handle radio selection (single selection)
  const handleRadioSelection = (option: string) => {
    // For radio selection, we always set the selected option to true
    handleCheckedChange(option, true);
  };
  
  // Special treatment for special fields - ALWAYS render as checkboxes
  if (forceCheckbox) {
    return (
      <CheckboxOptions
        options={question.options}
        questionId={questionId}
        selectedOptions={selectedOptions[questionId] || {}}
        onCheckedChange={handleCheckedChange}
      />
    );
  }
  
  // If it's a radio or select question, we should only allow one selected option
  if (question.type === 'radio' || question.type === 'select') {
    // Find the selected option (if any) or leave empty
    const selectedOption = Object.entries(selectedOptions[questionId] || {})
      .find(([_, isSelected]) => isSelected)?.[0] || '';
      
    return (
      <RadioOptions
        options={question.options}
        questionId={questionId}
        selectedOption={selectedOption}
        onValueChange={handleRadioSelection}
      />
    );
  }
  
  // Default for checkbox (multiple selection)
  return (
    <CheckboxOptions
      options={question.options}
      questionId={questionId}
      selectedOptions={selectedOptions[questionId] || {}}
      onCheckedChange={handleCheckedChange}
    />
  );
}
