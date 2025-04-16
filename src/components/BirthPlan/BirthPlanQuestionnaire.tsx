
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
