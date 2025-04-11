
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
  
  // Initialize on first render if options are empty
  useEffect(() => {
    if (!initialized && (!selectedOptions[questionId] || Object.keys(selectedOptions[questionId]).length === 0)) {
      console.log(`SelectableOptions: Initializing options for ${questionId}`);
      
      // Only initialize if we have options to work with
      if (question.options && question.options.length > 0) {
        const newOptions = initializeQuestionOptions(question, questionId, questionnaireAnswers);
        
        // Properly type the function parameter in setSelectedOptions
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
  
  // Debug para questões especiais
  if (['emergencyPreferences', 'highRiskComplications', 'lowRiskOccurrences'].includes(questionId)) {
    console.log(`SelectableOptions para questão especial: ${questionId}`);
    console.log(`Tem resposta:`, !!questionnaireAnswers[questionId]);
    
    if (questionnaireAnswers[questionId]) {
      console.log(`Tipo da resposta:`, typeof questionnaireAnswers[questionId]);
      console.log(`Valor da resposta:`, questionnaireAnswers[questionId]);
    }
    
    console.log(`Opções disponíveis:`, question.options);
    console.log(`Opções selecionadas atualmente:`, selectedOptions[questionId]);
  }
  
  const handleCheckedChange = (option: string, checked: boolean) => {
    // Debug específico para opções especiais
    if (['emergencyPreferences', 'highRiskComplications', 'lowRiskOccurrences'].includes(questionId)) {
      console.log(`Seleção alterada para ${option}: ${checked}`);
    }
    
    const newSelections = updateSelectionState(
      questionId,
      option,
      checked,
      selectedOptions,
      (question.type === 'radio' || question.type === 'select'),
      isSpecialField
    );
    
    setSelectedOptions(newSelections);
  };
  
  // Handle radio selection (single selection)
  const handleRadioSelection = (option: string) => {
    // For radio selection, we always set the selected option to true
    handleCheckedChange(option, true);
  };
  
  // Special treatment for special fields with radio/select types
  if (isSpecialField && (question.type === 'radio' || question.type === 'select')) {
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
