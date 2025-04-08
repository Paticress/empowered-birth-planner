
import { birthPlanSections } from './utils/birthPlanSections';
import { EditorContent } from './editor/EditorContent';
import { EditorFooter } from './editor/EditorFooter';
import { EditorHeader } from './editor/EditorHeader';
import { EditorTip } from './editor/EditorTip';
import { BirthPlanSectionProgress } from './BirthPlanSectionProgress';
import { useEditorState } from './hooks/useEditorState';
import { handleAddSelectedOptions } from './editor/editorHelpers';
import { BackToTopButton } from './common/BackToTopButton';
import { useEffect } from 'react';
import { prefillFieldFromQuestionnaire, getSpecialFields } from './editor/utils/optionsHandling';
import { fieldToSectionMap, mapQuestionnaireToSectionId } from './editor/utils/fieldMapping';

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
    isDirty
  } = useEditorState(birthPlan, onUpdate, questionnaireAnswers);

  const processAddSelectedOptions = () => {
    handleAddSelectedOptions(
      activeFieldKey,
      selectedOptions,
      localBirthPlan,
      setLocalBirthPlan,
      completedSections,
      setCompletedSections,
      setSelectedOptions,
      setDialogOpen
    );
  };
  
  // Auto-fill special fields from questionnaire on first load
  useEffect(() => {
    if (Object.keys(questionnaireAnswers).length > 0) {
      console.log("Auto-filling special fields from questionnaire");
      
      // Get all special fields
      const specialFields = getSpecialFields();
      
      // Process each special field
      specialFields.forEach(fieldKey => {
        // Get the appropriate section for this field
        const sectionId = fieldToSectionMap[fieldKey] 
          ? mapQuestionnaireToSectionId(fieldToSectionMap[fieldKey])
          : 'situacoesEspeciais'; // Default to special situations
        
        // Pre-fill the field from questionnaire answers  
        prefillFieldFromQuestionnaire(
          fieldKey,
          questionnaireAnswers,
          localBirthPlan,
          setLocalBirthPlan,
          sectionId
        );
      });
      
      // Also prefill the text area fields
      if (questionnaireAnswers['unexpectedScenarios']) {
        prefillFieldFromQuestionnaire(
          'unexpectedScenarios',
          questionnaireAnswers,
          localBirthPlan,
          setLocalBirthPlan,
          'situacoesEspeciais'
        );
      }
      
      if (questionnaireAnswers['specialWishes']) {
        prefillFieldFromQuestionnaire(
          'specialWishes',
          questionnaireAnswers,
          localBirthPlan,
          setLocalBirthPlan,
          'situacoesEspeciais'
        );
      }
    }
  }, [questionnaireAnswers]);
  
  // Auto-save functionality
  useEffect(() => {
    if (isDirty) {
      const autoSaveTimer = setTimeout(() => {
        handleSave(false); // Pass false to avoid showing toast on auto-save
      }, 30000); // Auto-save after 30 seconds of inactivity
      
      return () => clearTimeout(autoSaveTimer);
    }
  }, [localBirthPlan, isDirty]);
  
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
