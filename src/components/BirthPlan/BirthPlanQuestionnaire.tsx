
import { useState } from 'react';
import { QuestionnaireSection } from './QuestionnaireSection';
import { questionnaireSections } from './questionnaire';
import { BirthPlanSectionProgress } from './BirthPlanSectionProgress';

interface BirthPlanQuestionnaireProps {
  onSubmit: (data: Record<string, any>) => void;
}

export function BirthPlanQuestionnaire({ onSubmit }: BirthPlanQuestionnaireProps) {
  const [currentSectionIndex, setCurrentSectionIndex] = useState(0);
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [completedSections, setCompletedSections] = useState<string[]>([]);
  
  const currentSection = questionnaireSections[currentSectionIndex];
  const isFirstSection = currentSectionIndex === 0;
  const isLastSection = currentSectionIndex === questionnaireSections.length - 1;
  
  const handleSectionSubmit = (data: Record<string, any>) => {
    console.log("Section submitted with data:", data);
    
    // Create a clean copy of the data to avoid mutation issues
    const processedData = { ...data };
    
    // Save data from current section
    const updatedFormData = {
      ...formData,
      ...processedData,
    };
    
    console.log("Updated form data:", updatedFormData);
    setFormData(updatedFormData);
    
    // Mark this section as completed
    if (!completedSections.includes(currentSection.id)) {
      setCompletedSections([...completedSections, currentSection.id]);
    }
    
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
  
  const handleSectionClick = (index: number) => {
    // Only allow navigating to completed sections or the current + 1 section
    if (completedSections.includes(questionnaireSections[index].id) || 
        index === currentSectionIndex || 
        index === currentSectionIndex + 1 && completedSections.includes(questionnaireSections[currentSectionIndex].id)) {
      setCurrentSectionIndex(index);
      window.scrollTo(0, 0);
    }
  };
  
  return (
    <>
      <BirthPlanSectionProgress 
        sections={questionnaireSections}
        currentSectionIndex={currentSectionIndex}
        onSectionClick={handleSectionClick}
        stageType="questionnaire"
        completedSections={completedSections}
      />
      
      <QuestionnaireSection
        section={currentSection}
        onNext={handleSectionSubmit}
        onPrevious={goToPreviousSection}
        isFirstSection={isFirstSection}
        isLastSection={isLastSection}
        initialData={formData}
      />
    </>
  );
}
