
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
    // Strategic logging for debugging option selection
    console.log("➕ Adicionando opções ao campo:", activeFieldKey);
    console.log("📋 Opções atualmente selecionadas:", selectedOptions);
    console.log("🧠 Textareas preenchidos:", textareaValues);
    console.log("📄 Conteúdo atual do birthPlan:", localBirthPlan);

    // Verificar a estrutura atual da seção ativa
    const currentActiveSection = birthPlanSections[activeSectionIndex];
    if (currentActiveSection) {
      console.log("🔍 Seção ativa:", currentActiveSection.id);
      console.log("🔍 Campo ativo:", activeFieldKey);
      
      // Verificar se o localBirthPlan tem a estrutura correta
      if (!localBirthPlan[currentActiveSection.id]) {
        console.log("⚠️ Seção não existe no localBirthPlan, criando...");
        setLocalBirthPlan({
          ...localBirthPlan,
          [currentActiveSection.id]: {}
        });
      }
    }

    // Verificar as opções selecionadas para o campo atual
    if (selectedOptions[activeFieldKey]) {
      const selectedForField = Object.entries(selectedOptions[activeFieldKey])
        .filter(([_, isSelected]) => isSelected)
        .map(([option]) => option);
      console.log("🔍 Opções selecionadas para este campo:", selectedForField);
    } else {
      console.log("⚠️ Nenhuma opção selecionada para este campo");
    }

    // Usar o hook personalizado para processar as opções
    const currentSection = birthPlanSections[activeSectionIndex];
    if (!localBirthPlan[currentSection.id]) {
      // Certifique-se de que a seção existe antes de adicionar opções
      const updatedPlan = {
        ...localBirthPlan,
        [currentSection.id]: {}
      };
      setLocalBirthPlan(updatedPlan);
    }

    // Processar as opções selecionadas e atualizar o plano
    // Importante: activeFieldKey é o campo do momento, não a seção
    const currentFieldValue = localBirthPlan[currentSection.id]?.[activeFieldKey] || '';
    console.log("🔍 Valor atual do campo:", currentFieldValue);

    // Processar as opções selecionadas e textareas
    const selectedItems = Object.entries(selectedOptions[activeFieldKey] || {})
      .filter(([_, isSelected]) => isSelected)
      .map(([option]) => option.trim());
    
    const manualItems = Object.values(textareaValues)
      .map(text => text.trim())
      .filter(Boolean);
    
    // Combinar os itens existentes com os novos
    const existingItems = currentFieldValue ? currentFieldValue.split('\n\n').map(item => item.trim()) : [];
    const newItems = [...selectedItems, ...manualItems];
    const combinedItems = Array.from(new Set([...existingItems, ...newItems])).filter(Boolean);
    
    // Atualizar o plano
    if (combinedItems.length > 0) {
      const updatedSection = {
        ...localBirthPlan[currentSection.id],
        [activeFieldKey]: combinedItems.join('\n\n')
      };
      
      const updatedPlan = {
        ...localBirthPlan,
        [currentSection.id]: updatedSection
      };
      
      console.log("🔍 Atualizando plano com:", updatedPlan[currentSection.id][activeFieldKey]);
      setLocalBirthPlan(updatedPlan);
      
      // Marcar a seção como concluída se ainda não estiver
      if (!completedSections.includes(activeFieldKey)) {
        setCompletedSections([...completedSections, activeFieldKey]);
      }
    }
    
    // Limpar seleções e fechar diálogo
    setSelectedOptions(prev => ({
      ...prev,
      [activeFieldKey]: {}
    }));
    
    setTextareaValues({});
    setDialogOpen(false);
  };
  
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

