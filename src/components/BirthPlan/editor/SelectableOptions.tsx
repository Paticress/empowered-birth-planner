
import { useEffect, useState } from 'react';
import { CheckboxOptions } from './CheckboxOptions';
import { RadioOptions } from './RadioOptions';
import { isSpecialField } from './utils/specialFieldHandler';
import { SelectedOptionsMap } from './utils/types';

interface SelectableOptionsProps {
  question: any;
  questionId: string;
  selectedOptions: SelectedOptionsMap;
  setSelectedOptions: React.Dispatch<React.SetStateAction<SelectedOptionsMap>>;
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
        
        // If it's a special field or we have questionnaire answers, initialize from them
        if (isSpecialField || isSpecialField(questionId)) {
          question.options.forEach((option: string) => {
            // For checkbox-style answers
            if (typeof questionnaireAnswers[questionId] === 'object' && 
                !Array.isArray(questionnaireAnswers[questionId])) {
              newOptions[option] = !!questionnaireAnswers[questionId]?.[option];
            } 
            // For radio/select answers
            else if (typeof questionnaireAnswers[questionId] === 'string') {
              newOptions[option] = questionnaireAnswers[questionId] === option;
            }
            else {
              newOptions[option] = false;
            }
          });
        } 
        // For regular questions
        else {
          question.options.forEach((option: string) => {
            let isSelected = false;
            
            if (question.type === 'checkbox' && 
                typeof questionnaireAnswers[questionId] === 'object' && 
                !Array.isArray(questionnaireAnswers[questionId])) {
              isSelected = !!questionnaireAnswers[questionId]?.[option];
            } 
            else if ((question.type === 'radio' || question.type === 'select') && 
                questionnaireAnswers[questionId] !== undefined) {
              isSelected = questionnaireAnswers[questionId] === option;
            }
            
            newOptions[option] = isSelected;
          });
        }
        
        // Update selected options
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
  }, [questionId, questionnaireAnswers, question, selectedOptions, setSelectedOptions, initialized, isSpecialField]);
  
  if (!question.options || question.options.length === 0) {
    console.warn(`No options found for question ${questionId}`);
    return null;
  }
  
  // Enhanced debugging for special questions
  if (isSpecialField || isSpecialField(questionId)) {
    console.log(`SelectableOptions for special question: ${questionId}`);
    console.log(`Question type: ${question.type}`);
    console.log(`Is special field: ${isSpecialField}`);
    console.log(`Has answer:`, !!questionnaireAnswers[questionId]);
    console.log(`Options:`, question.options);
    console.log(`Current selected options:`, selectedOptions[questionId]);
    
    // If we have answers in the questionnaire, log them in detail
    if (questionnaireAnswers[questionId]) {
      if (typeof questionnaireAnswers[questionId] === 'object') {
        const selectedFromQuestionnaire = Object.entries(questionnaireAnswers[questionId])
          .filter(([_, value]) => !!value)
          .map(([key]) => key);
        console.log(`Selected options from questionnaire:`, selectedFromQuestionnaire);
      } else {
        console.log(`Answer value:`, questionnaireAnswers[questionId]);
      }
    }
  }
  
  const handleCheckedChange = (option: string, checked: boolean) => {
    // For special fields, we always use checkbox behavior even if originally radio/select
    const specialFieldQuestion = isSpecialField || isSpecialField(questionId);
    const isSingleSelection = (question.type === 'radio' || question.type === 'select') && !specialFieldQuestion;
    
    setSelectedOptions(prev => {
      // Create a deep copy of the previous state
      const updated = { ...prev };
      
      // Initialize the question entry if it doesn't exist
      if (!updated[questionId]) {
        updated[questionId] = {};
      }
      
      // For radio buttons (single selection), uncheck all other options first
      if (isSingleSelection) {
        Object.keys(updated[questionId] || {}).forEach(opt => {
          updated[questionId][opt] = false;
        });
      }
      
      // Set the selected option
      updated[questionId][option] = checked;
      
      return updated;
    });
    
    // Log what's happening with the selection for special fields
    if (specialFieldQuestion) {
      console.log(`Updating selection for special field ${questionId}:`, {
        option,
        checked
      });
    }
  };
  
  // Handle radio selection (single selection)
  const handleRadioSelection = (option: string) => {
    // For radio selection, we always set the selected option to true
    handleCheckedChange(option, true);
  };
  
  // Special treatment for special fields - ALWAYS render as checkboxes
  if (isSpecialField || isSpecialField(questionId)) {
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
