
import { birthPlanSections } from './utils/birthPlanSections';
import { EditorContent } from './editor/EditorContent';
import { EditorFooter } from './editor/EditorFooter';
import { BirthPlanSectionProgress } from './BirthPlanSectionProgress';
import { useEditorState } from './hooks/useEditorState';
import { handleAddSelectedOptions } from './editor/editorHelpers';

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
    resetOptionsForField
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
  
  return (
    <div className="animate-fade-in">
      <h1 className="text-3xl font-bold text-maternal-800 mb-6">Edite seu Plano de Parto</h1>
      
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
      
      <div className="bg-maternal-50 p-4 rounded-lg mb-6 border border-maternal-200">
        <p className="text-sm text-maternal-700">
          <strong>Dica:</strong> Seja específico sobre suas preferências, mas também flexível. 
          Lembre-se de que situações imprevistas podem ocorrer durante o parto.
        </p>
      </div>
      
      <EditorFooter 
        activeSectionIndex={activeSectionIndex}
        birthPlanSectionLength={birthPlanSections.length}
        handleSave={handleSave}
        onNext={onNext}
        setActiveSectionIndex={setActiveSectionIndex}
      />
    </div>
  );
}
