
import { birthPlanSections } from './utils/birthPlanSections';
import { EditorContent } from './editor/EditorContent';
import { useEditorState } from './hooks/useEditorState';
import { useEffect } from 'react';
import { getRelevantQuestionsForField } from './editor/utils/questionRelevance';
import { useProcessSelectedOptions } from './hooks/useProcessSelectedOptions';
import { useAutoSave } from './hooks/useAutoSave';
import { useBeforeUnloadWarning } from './hooks/useBeforeUnloadWarning';
import { EditorLayout } from './editor/EditorLayout';

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

  // Use our custom hook for processing selected options
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
  
  // Use our custom hooks for auto-save and beforeunload warning
  useAutoSave({ isDirty, handleSave });
  useBeforeUnloadWarning({ isDirty });
  
  return (
    <EditorLayout
      activeSectionIndex={activeSectionIndex}
      setActiveSectionIndex={setActiveSectionIndex}
      completedSections={completedSections}
      goToPreviousSection={goToPreviousSection}
      goToNextSection={goToNextSection}
      handleSave={() => handleSave()}
      onNext={onNext}
      isDirty={isDirty}
    >
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
    </EditorLayout>
  );
}
