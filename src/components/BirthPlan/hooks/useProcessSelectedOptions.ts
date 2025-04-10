
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

    // CORREÇÃO: Modificação na forma como processamos as opções e atualizamos o campo
    
    // Processar as opções selecionadas e textareas
    const selectedItems = [];
    
    // Capturar todas as opções selecionadas para o campo ativo
    if (selectedOptions[activeFieldKey]) {
      const selectedForField = Object.entries(selectedOptions[activeFieldKey])
        .filter(([_, isSelected]) => isSelected)
        .map(([option]) => option.trim());
      
      if (selectedForField.length > 0) {
        selectedItems.push(...selectedForField);
      }
    }
    
    // Capturar qualquer texto de textareas
    Object.values(textareaValues)
      .map(text => text.trim())
      .filter(Boolean)
      .forEach(text => {
        selectedItems.push(text);
      });
    
    // Se temos opções selecionadas, vamos atualizar o campo
    if (selectedItems.length > 0) {
      console.log("🔍 Opções selecionadas finais:", selectedItems);
      
      // CORREÇÃO: Sempre usar formato de lista com quebras de linha duplas
      // Formatar cada item em sua própria linha
      const formattedText = selectedItems.join('\n\n');
      
      // Atualizar o plano de parto com o texto formatado
      const updatedSection = {
        ...localBirthPlan[currentSection.id],
        [activeFieldKey]: formattedText
      };
      
      const updatedPlan = {
        ...localBirthPlan,
        [currentSection.id]: updatedSection
      };
      
      console.log("🔍 Atualizando plano com:", formattedText);
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
