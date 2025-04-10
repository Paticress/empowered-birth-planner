
import { useCallback } from 'react';
import { birthPlanSections } from '../utils/birthPlanSections';

type UseProcessSelectedOptionsParams = {
  activeSectionIndex: number;
  activeFieldKey: string;
  selectedOptions: Record<string, Record<string, boolean>>;
  localBirthPlan: Record<string, any>;
  setLocalBirthPlan: (plan: Record<string, any>) => void;
  completedSections: string[];
  setCompletedSections: (sections: string[]) => void;
  setSelectedOptions: React.Dispatch<React.SetStateAction<Record<string, Record<string, boolean>>>>;
  setDialogOpen: (open: boolean) => void;
  textareaValues: Record<string, string>;
  setTextareaValues: (values: Record<string, string>) => void;
};

export function useProcessSelectedOptions({
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
}: UseProcessSelectedOptionsParams) {
  
  const processAddSelectedOptions = useCallback(() => {
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
  }, [
    activeSectionIndex,
    activeFieldKey,
    selectedOptions,
    localBirthPlan,
    textareaValues,
    completedSections,
    setLocalBirthPlan,
    setCompletedSections,
    setSelectedOptions,
    setTextareaValues,
    setDialogOpen
  ]);

  return { processAddSelectedOptions };
}
