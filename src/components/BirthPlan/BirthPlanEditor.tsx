
import { birthPlanSections } from './utils/birthPlanSections';
import { EditorContent } from './editor/EditorContent';
import { EditorFooter } from './editor/EditorFooter';
import { EditorHeader } from './editor/EditorHeader';
import { EditorTip } from './editor/EditorTip';
import { BirthPlanSectionProgress } from './BirthPlanSectionProgress';
import { useEditorState } from './hooks/useEditorState';
import { BackToTopButton } from './common/BackToTopButton';
import { useEffect } from 'react';
import { getRelevantQuestionsForField } from './editor/utils/questionRelevance';
import { useProcessSelectedOptions } from './hooks/useProcessSelectedOptions';

interface BirthPlanEditorProps {
  birthPlan: Record<string, any>;
  onUpdate: (updatedPlan: Record<string, any>) => void;
  onNext: () => void;
  onBack?: () => void;
  questionnaireAnswers?: Record<string, any>;
}

export function BirthPlanEditor({ 
  birthPlan, 
  onUpdate, 
  onNext,
  onBack,
  questionnaireAnswers = {}
}: BirthPlanEditorProps) {
  const {
    activeSectionIndex,
    setActiveSectionIndex,
    localBirthPlan,
    setLocalBirthPlan,
    selectedOptions,
    setSelectedOptions,
    activeFieldKey,
    dialogOpen,
    setDialogOpen,
    completedSections,
    setCompletedSections,
    handleFieldChange,
    goToPreviousSection,
    goToNextSection,
    handleSave,
    resetOptionsForField,
    isDirty,
    textareaValues,
    setTextareaValues
  } = useEditorState(birthPlan, onUpdate, questionnaireAnswers);

  // Use our new custom hook for processing selected options
  const { processAddSelectedOptions } = useProcessSelectedOptions({
    activeSectionIndex,
    activeFieldKey,
    selectedOptions,
    localBirthPlan,
    setLocalBirthPlan,
    completedSections,
    setCompletedSections,
    setSelectedOptions,
    setDialogOpen,
    textareaValues,
    setTextareaValues
  });
  
  // Helper function to pass to children components
  const getRelevantQuestionsForActiveField = (fieldKey: string) => {
    return getRelevantQuestionsForField(fieldKey, questionnaireAnswers);
  };
  
  // Auto-save functionality
  useEffect(() => {
    if (isDirty) {
      const autoSaveTimer = setTimeout(() => {
        handleSave(false); // Pass false to avoid showing toast on auto-save
      }, 30000); // Auto-save after 30 seconds of inactivity
      
      return () => clearTimeout(autoSaveTimer);
    }
  }, [localBirthPlan, isDirty, handleSave]);
  
  // Save before navigating away
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (isDirty) {
        const message = "Você tem alterações não salvas. Tem certeza que deseja sair?";
        e.returnValue = message;
        return message;
      }
    };
    
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [isDirty]);
  
  return (
    <div className="animate-fade-in">
      <EditorHeader />
      
      <BirthPlanSectionProgress 
        sections={birthPlanSections}
        currentSectionIndex={activeSectionIndex}
        onSectionClick={setActiveSectionIndex}
        stageType="editor"
        completedSections={completedSections}
        onPrevious={goToPreviousSection}
        onNext={goToNextSection}
      />
      
      <EditorContent 
        activeSectionIndex={activeSectionIndex}
        localBirthPlan={localBirthPlan}
        handleFieldChange={handleFieldChange}
        resetOptionsForField={resetOptionsForField}
        activeFieldKey={activeFieldKey}
        dialogOpen={dialogOpen}
        setDialogOpen={setDialogOpen}
        selectedOptions={selectedOptions}
        setSelectedOptions={setSelectedOptions}
        questionnaireAnswers={questionnaireAnswers}
        handleAddSelectedOptions={processAddSelectedOptions}
        getRelevantQuestionsForField={getRelevantQuestionsForActiveField}
      />
      
      <EditorTip />
      
      <EditorFooter 
        activeSectionIndex={activeSectionIndex}
        birthPlanSectionLength={birthPlanSections.length}
        handleSave={() => handleSave()}
        onNext={onNext}
        setActiveSectionIndex={setActiveSectionIndex}
        isDirty={isDirty}
      />
      
      <BackToTopButton />
    </div>
  );
}
