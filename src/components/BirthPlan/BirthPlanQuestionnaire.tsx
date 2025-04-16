
import { useState, useEffect } from 'react';
import { QuestionnaireSection } from './QuestionnaireSection';
import { questionnaireSections } from './questionnaire';
import { BirthPlanSectionProgress } from './BirthPlanSectionProgress';
import { toast } from 'sonner';

interface BirthPlanQuestionnaireProps {
  onSubmit: (data: Record<string, any>) => void;
}

export function BirthPlanQuestionnaire({ onSubmit }: BirthPlanQuestionnaireProps) {
  const [currentSectionIndex, setCurrentSectionIndex] = useState(0);
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [completedSections, setCompletedSections] = useState<string[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);
  
  const currentSection = questionnaireSections[currentSectionIndex];
  const isFirstSection = currentSectionIndex === 0;
  const isLastSection = currentSectionIndex === questionnaireSections.length - 1;
  
  // Load previously saved answers when component mounts
  useEffect(() => {
    const loadSavedAnswers = () => {
      try {
        const savedAnswers = localStorage.getItem('birthPlanAnswers');
        if (savedAnswers) {
          const parsedAnswers = JSON.parse(savedAnswers);
          console.log("Carregando respostas salvas:", parsedAnswers);
          setFormData(parsedAnswers);
          
          // Check for special fields and log them
          const specialFields = ['emergencyPreferences', 'highRiskComplications', 'lowRiskOccurrences'];
          specialFields.forEach(field => {
            if (parsedAnswers[field]) {
              console.log(`Loaded special field ${field}:`, parsedAnswers[field]);
              
              // If it's an object, log the selected options
              if (typeof parsedAnswers[field] === 'object' && !Array.isArray(parsedAnswers[field])) {
                const selectedOptions = Object.entries(parsedAnswers[field])
                  .filter(([_, value]) => !!value)
                  .map(([key]) => key);
                console.log(`Selected options for ${field}:`, selectedOptions);
              }
            } else {
              console.log(`No saved data for special field ${field}`);
            }
          });
          
          // Determine which sections are completed based on saved answers
          const completed: string[] = [];
          questionnaireSections.forEach(section => {
            let sectionCompleted = false;
            // Check if any questions in this section have answers
            section.questions.forEach(question => {
              if (parsedAnswers[question.id]) {
                sectionCompleted = true;
              }
            });
            if (sectionCompleted) {
              completed.push(section.id);
            }
          });
          
          setCompletedSections(completed);
          toast.info("Suas respostas anteriores foram carregadas automaticamente.");
        }
      } catch (error) {
        console.error("Erro ao carregar respostas salvas:", error);
      }
      
      setIsLoaded(true);
    };
    
    loadSavedAnswers();
  }, []);
  
  // Save answers to localStorage whenever formData changes
  useEffect(() => {
    if (Object.keys(formData).length > 0 && isLoaded) {
      console.log("Salvando respostas no localStorage:", formData);
      
      // Special debug logging for the problematic fields
      const specialFields = ['emergencyPreferences', 'highRiskComplications', 'lowRiskOccurrences'];
      specialFields.forEach(field => {
        if (formData[field]) {
          console.log(`Saving special field ${field}:`, formData[field]);
          
          // If it's an object, log the selected options
          if (typeof formData[field] === 'object' && !Array.isArray(formData[field])) {
            const selectedOptions = Object.entries(formData[field])
              .filter(([_, value]) => !!value)
              .map(([key]) => key);
            console.log(`Selected options for ${field}:`, selectedOptions);
          }
        }
      });
      
      localStorage.setItem('birthPlanAnswers', JSON.stringify(formData));
    }
  }, [formData, isLoaded]);
  
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
    
    // Log special situation fields for debugging
    if (currentSection.id === 'specialSituations') {
      console.log("Special situations data:", {
        emergencyPreferences: updatedFormData.emergencyPreferences,
        highRiskComplications: updatedFormData.highRiskComplications,
        lowRiskOccurrences: updatedFormData.lowRiskOccurrences
      });
      
      // For each special field, log the selected options if it exists
      const specialFields = ['emergencyPreferences', 'highRiskComplications', 'lowRiskOccurrences'];
      specialFields.forEach(field => {
        if (updatedFormData[field] && typeof updatedFormData[field] === 'object') {
          const selectedOptions = Object.entries(updatedFormData[field])
            .filter(([_, value]) => !!value)
            .map(([key]) => key);
          console.log(`Selected options for ${field}:`, selectedOptions);
        }
      });
    }
    
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
  
  if (!isLoaded) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-pulse flex flex-col items-center">
          <div className="h-12 w-12 rounded-full bg-maternal-200 mb-4"></div>
          <div className="h-4 w-48 bg-maternal-100 rounded mb-2"></div>
          <div className="h-4 w-36 bg-maternal-100 rounded"></div>
        </div>
      </div>
    );
  }
  
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
