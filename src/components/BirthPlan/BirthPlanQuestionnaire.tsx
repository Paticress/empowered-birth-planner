
import { useState } from 'react';
import { QuestionnaireSection } from './QuestionnaireSection';
import { questionnaireSections } from './questionnaire';

interface BirthPlanQuestionnaireProps {
  onSubmit: (data: Record<string, any>) => void;
}

export function BirthPlanQuestionnaire({ onSubmit }: BirthPlanQuestionnaireProps) {
  const [currentSectionIndex, setCurrentSectionIndex] = useState(0);
  const [formData, setFormData] = useState<Record<string, any>>({});
  
  const currentSection = questionnaireSections[currentSectionIndex];
  const isFirstSection = currentSectionIndex === 0;
  const isLastSection = currentSectionIndex === questionnaireSections.length - 1;
  
  const handleSectionSubmit = (data: Record<string, any>) => {
    console.log("Section submitted with data:", data);
    
    // Process checkbox data to convert from individual boolean fields to arrays
    const processedData = { ...data };
    
    // Process checkbox type questions for current section
    currentSection.questions.forEach(question => {
      if (question.type === 'checkbox' && question.options) {
        const selectedOptions: string[] = [];
        
        // Go through each option and check if it's selected
        question.options.forEach(option => {
          const optionKey = `${question.id}.${option}`;
          if (data[optionKey]) {
            selectedOptions.push(option);
          }
          
          // Remove the individual option from processed data
          delete processedData[optionKey];
        });
        
        // Add the array of selected options to processed data
        if (selectedOptions.length > 0) {
          processedData[question.id] = selectedOptions;
        }
      }
    });
    
    // Save processed data
    const updatedFormData = {
      ...formData,
      ...processedData,
    };
    
    console.log("Updated form data:", updatedFormData);
    setFormData(updatedFormData);
    
    if (isLastSection) {
      // If this is the last section, submit the complete form
      console.log("Final form submission:", updatedFormData);
      onSubmit(updatedFormData);
    } else {
      // Otherwise, move to the next section
      setCurrentSectionIndex(currentSectionIndex + 1);
      window.scrollTo(0, 0);
    }
  };
  
  const goToPreviousSection = () => {
    if (!isFirstSection) {
      setCurrentSectionIndex(currentSectionIndex - 1);
      window.scrollTo(0, 0);
    }
  };
  
  return (
    <QuestionnaireSection
      section={currentSection}
      onNext={handleSectionSubmit}
      onPrevious={goToPreviousSection}
      isFirstSection={isFirstSection}
      isLastSection={isLastSection}
      initialData={formData}
    />
  );
}
