
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
  
  // Pre-initialize with questionnaire answers if this is a special field
  useEffect(() => {
    if (forceCheckbox && !initialized) {
      console.log(`Pre-initializing options for special field ${questionId} from questionnaire answers`);
      
      // If we have questionnaire answers for this question, use them
      if (questionnaireAnswers[questionId] && typeof questionnaireAnswers[questionId] === 'object') {
        const questAnswers = questionnaireAnswers[questionId];
        const initOptions: Record<string, boolean> = {};
        
        // Initialize all options as unselected first
        question.options?.forEach((option: string) => {
          initOptions[option] = false;
        });
        
        // Then set selected options from questionnaire
        Object.entries(questAnswers).forEach(([option, selected]) => {
          if (selected && question.options?.includes(option)) {
            initOptions[option] = true;
          }
        });
        
        console.log(`Initialized options from questionnaire for ${questionId}:`, initOptions);
        
        setSelectedOptions(prev => ({
          ...prev,
          [questionId]: initOptions
        }));
      }
      
      setInitialized(true);
    }
  }, [forceCheckbox, questionId, question, questionnaireAnswers, initialized, setSelectedOptions]);
  
  // Initialize on first render if options are empty
  useEffect(() => {
    if (!initialized && (!selectedOptions[questionId] || Object.keys(selectedOptions[questionId] || {}).length === 0)) {
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
    console.log(`Original question type: ${question.type}, forced checkbox: ${forceCheckbox}`);
    console.log(`Options:`, question.options);
    console.log(`Current selected options:`, selectedOptions[questionId]);
  }
  
  const handleCheckedChange = (option: string, checked: boolean) => {
    // Log before updating
    if (forceCheckbox) {
      console.log(`Checkbox change for special field ${questionId}:`, { option, checked });
      console.log(`Current state:`, selectedOptions[questionId]);
    }
    
    // For special fields, we always use checkbox behavior even if originally radio/select
    const newSelections = updateSelectionState(
      questionId,
      option,
      checked,
      selectedOptions,
      (question.type === 'radio' || question.type === 'select') && !forceCheckbox, // only allow single selection if not a special field
      forceCheckbox // force checkbox behavior for special fields
    );
    
    // Log what's happening with the selection for special fields
    if (forceCheckbox) {
      console.log(`Updated selection for special field ${questionId}:`, {
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
