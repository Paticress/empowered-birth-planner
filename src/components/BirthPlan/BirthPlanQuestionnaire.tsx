
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
          
          // Special debugging for problematic fields
          const specialFields = ['emergencyPreferences', 'highRiskComplications', 'lowRiskOccurrences'];
          specialFields.forEach(field => {
            if (parsedAnswers[field]) {
              console.log(`Loaded special field ${field}:`, parsedAnswers[field]);
              
              // Ensure special fields are properly formatted as objects with boolean values
              if (typeof parsedAnswers[field] === 'object' && !Array.isArray(parsedAnswers[field])) {
                const selectedOptions = Object.entries(parsedAnswers[field])
                  .filter(([_, value]) => !!value)
                  .map(([key]) => key);
                console.log(`Selected options for ${field}:`, selectedOptions);
              } else if (Array.isArray(parsedAnswers[field])) {
                // Convert array format to object format for consistency
                const objectFormat: Record<string, boolean> = {};
                parsedAnswers[field].forEach((option: string) => {
                  objectFormat[option] = true;
                });
                parsedAnswers[field] = objectFormat;
                console.log(`Converted array to object format for ${field}:`, parsedAnswers[field]);
              }
            } else {
              // Initialize empty object for special fields if they don't exist
              parsedAnswers[field] = {};
              console.log(`Initialized empty object for special field ${field}`);
            }
          });
          
          setFormData(parsedAnswers);
          
          // Determine which sections are completed based on saved answers
          const completed: string[] = [];
          questionnaireSections.forEach(section => {
            let sectionCompleted = false;
            // Check if any questions in this section have answers
            section.questions.forEach(question => {
              if (parsedAnswers[question.id] && 
                  (typeof parsedAnswers[question.id] === 'string' || 
                   Object.values(parsedAnswers[question.id]).some((val: any) => !!val))) {
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
      
      // Special handling for the problematic fields to ensure they're saved correctly
      const specialFields = ['emergencyPreferences', 'highRiskComplications', 'lowRiskOccurrences'];
      const dataToSave = { ...formData };
      
      specialFields.forEach(field => {
        if (dataToSave[field]) {
          console.log(`Saving special field ${field}:`, dataToSave[field]);
          
          // Ensure it's in the correct format (object with boolean values)
          if (typeof dataToSave[field] === 'object' && !Array.isArray(dataToSave[field])) {
            const selectedOptions = Object.entries(dataToSave[field])
              .filter(([_, value]) => !!value)
              .map(([key]) => key);
            console.log(`Selected options for ${field}:`, selectedOptions);
            
            // If no options are selected, make sure the object exists but is empty
            if (selectedOptions.length === 0) {
              dataToSave[field] = {};
            }
          }
        } else {
          // Initialize empty object for special fields if they don't exist
          dataToSave[field] = {};
        }
      });
      
      localStorage.setItem('birthPlanAnswers', JSON.stringify(dataToSave));
    }
  }, [formData, isLoaded]);
  
  const handleSectionSubmit = (data: Record<string, any>) => {
    console.log("Section submitted with data:", data);
    
    // Create a clean copy of the data to avoid mutation issues
    const processedData = { ...data };
    
    // Special handling for checkbox fields - ensure they're properly formatted
    const specialFields = ['emergencyPreferences', 'highRiskComplications', 'lowRiskOccurrences'];
    
    // Process special fields to ensure consistent format
    specialFields.forEach(field => {
      if (currentSection.id === 'specialSituations' && processedData[field]) {
        console.log(`Processing special field ${field} before saving`, processedData[field]);
        
        // Ensure the field is an object with boolean values
        if (typeof processedData[field] !== 'object' || Array.isArray(processedData[field])) {
          console.warn(`Invalid format for ${field}, converting to object format`);
          const newFormat: Record<string, boolean> = {};
          
          if (Array.isArray(processedData[field])) {
            processedData[field].forEach((option: string) => {
              newFormat[option] = true;
            });
          } else {
            // If it's a string or other type, create an empty object
            // This shouldn't happen but just in case
          }
          
          processedData[field] = newFormat;
        }
        
        // Log the selected options to verify
        const selectedOptions = Object.entries(processedData[field])
          .filter(([_, value]) => !!value)
          .map(([key]) => key);
        console.log(`Final selected options for ${field}:`, selectedOptions);
      }
    });
    
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
