
import { useState } from 'react';
import { QuestionnaireSection } from './QuestionnaireSection';
import { questionnaireSections } from './questionnaireData';

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
    // Cleanup checkbox data - convert from form format to clean format
    const processedData = { ...data };
    
    // Process checkbox values for the current section
    currentSection.questions.forEach(question => {
      if (question.type === 'checkbox' && question.options) {
        const checkboxValues: Record<string, boolean> = {};
        
        question.options.forEach(option => {
          const key = `${question.id}.${option}`;
          if (data[key]) {
            checkboxValues[option] = true;
            // Remove the individual checkbox entry
            delete processedData[key];
          }
        });
        
        // Add the processed checkbox values
        if (Object.keys(checkboxValues).length > 0) {
          processedData[question.id] = checkboxValues;
        }
      }
    });
    
    // Save data from current section
    const updatedFormData = {
      ...formData,
      ...processedData,
    };
    
    setFormData(updatedFormData);
    
    if (isLastSection) {
      // If this is the last section, submit the complete form
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
