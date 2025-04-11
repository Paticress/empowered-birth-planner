
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

    // Debug para campos especiais
    if (['emergencyScenarios', 'highRiskComplications', 'lowRiskOccurrences'].includes(activeFieldKey)) {
      console.log(`Processando campo especial: ${activeFieldKey}`);
      
      // Verificar todas as opções disponíveis para este campo
      if (selectedOptions[activeFieldKey]) {
        console.log(`Verificando opções disponíveis:`, selectedOptions[activeFieldKey]);
        Object.entries(selectedOptions[activeFieldKey]).forEach(([option, isSelected]) => {
          console.log(`${option}: ${isSelected}`);
        });
      } else {
        console.log(`Nenhuma opção disponível para ${activeFieldKey}`);
      }
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

    // Processar as opções selecionadas e textareas
    const selectedItems: string[] = [];
    let hasSelections = false;
    
    // Capturar todas as opções selecionadas (para todos os questionIds relacionados ao campo)
    Object.entries(selectedOptions).forEach(([questionId, options]) => {
      const selectedForQuestion = Object.entries(options)
        .filter(([_, isSelected]) => isSelected === true) // Verificar explicitamente se é true
        .map(([option]) => option.trim());
      
      if (selectedForQuestion.length > 0) {
        hasSelections = true;
        selectedItems.push(...selectedForQuestion);
      }
    });
    
    // Capturar qualquer texto de textareas
    Object.values(textareaValues)
      .map(text => text.trim())
      .filter(Boolean)
      .forEach(text => {
        hasSelections = true;
        selectedItems.push(text);
      });
    
    // Debug para campos específicos
    if (['emergencyScenarios', 'highRiskComplications', 'lowRiskOccurrences'].includes(activeFieldKey)) {
      console.log(`Opções finais para ${activeFieldKey}:`, selectedItems);
      console.log(`Tem seleções: ${hasSelections}`);
    }
    
    // Se temos opções selecionadas, vamos atualizar o campo
    if (hasSelections && selectedItems.length > 0) {
      console.log("🔍 Opções selecionadas finais:", selectedItems);
      
      // Formatar com vírgula e espaço para melhor legibilidade
      const formattedText = selectedItems.join(', ');
      
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
    } else {
      console.log("⚠️ Nenhuma opção selecionada, pulando atualização do plano");
    }
    
    // Limpar seleções e fechar diálogo
    setSelectedOptions({});
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
