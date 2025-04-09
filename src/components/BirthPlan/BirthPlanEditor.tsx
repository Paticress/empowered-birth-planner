
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

  const processAddSelectedOptions = () => {
    handleAddSelectedOptions(
      activeFieldKey,
      selectedOptions,
      localBirthPlan,
      setLocalBirthPlan,
      completedSections,
      setCompletedSections,
      setSelectedOptions,
      setDialogOpen,
      textareaValues
    );
    // Reset textarea values after adding
    setTextareaValues({});
  };
  
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
  
  // Clean up any field values that might have labels or prefixes
  useEffect(() => {
    if (Object.keys(localBirthPlan).length > 0) {
      // Check for fields with prefixes that need to be cleaned
      let needsCleanup = false;
      const cleanedPlan = { ...localBirthPlan };
      
      Object.keys(cleanedPlan).forEach(sectionId => {
        const section = cleanedPlan[sectionId];
        if (!section) return;
        
        Object.keys(section).forEach(fieldKey => {
          const fieldValue = section[fieldKey];
          if (typeof fieldValue === 'string' && fieldValue.includes('Preferências para')) {
            // This field might need cleanup - it contains a label prefix
            needsCleanup = true;
            
            // Split the value into lines and clean each line
            const lines = fieldValue.split('\n\n');
            const cleanedLines = lines.map(line => {
              // Remove the prefix pattern "Prefix: " if present
              if (line.includes(':')) {
                const parts = line.split(':');
                // If the part before the colon looks like a label/prefix, remove it
                if (parts[0].includes('Preferências')) {
                  return parts.slice(1).join(':').trim();
                }
              }
              return line;
            });
            
            // Update the field with cleaned content
            section[fieldKey] = cleanedLines.join('\n\n');
          }
        });
      });
      
      // Only update if we actually cleaned something
      if (needsCleanup) {
        setLocalBirthPlan(cleanedPlan);
      }
    }
  }, []);
  
  // Special debug for emergency scenarios fields
  useEffect(() => {
    if (activeSectionIndex === 6) { // Situações Especiais section
      console.log("Checking special situations loading:");
      const sectionId = 'situacoesEspeciais';
      const specialFields = ['emergencyScenarios', 'highRiskComplications', 'lowRiskOccurrences'];
      
      specialFields.forEach(fieldKey => {
        console.log(`${fieldKey} value:`, localBirthPlan[sectionId]?.[fieldKey] || 'empty');
        
        // Log the relevant questions and answers for this field
        const relevantQuestions = resetOptionsForField ? 
          resetOptionsForField['getRelevantQuestionsForField'] ? 
          resetOptionsForField['getRelevantQuestionsForField'](fieldKey) : [] : [];
        
        console.log(`${fieldKey} has ${relevantQuestions.length} relevant questions`);
        
        relevantQuestions.forEach(q => {
          if (q && q.question) {
            console.log(`Question ${q.question.id}: ${questionnaireAnswers[q.question.id] || 'no answer'}`);
          }
        });
      });
    }
  }, [activeSectionIndex]);
  
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
