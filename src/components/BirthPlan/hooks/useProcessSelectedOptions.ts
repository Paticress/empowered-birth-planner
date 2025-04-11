
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
    const allSelectedOptions = [];
    
    // Verificar todas as chaves de questão e suas opções selecionadas
    Object.entries(selectedOptions).forEach(([questionId, options]) => {
      console.log(`Processando questão: ${questionId}`);
      
      const selectedForQuestion = Object.entries(options)
        .filter(([_, isSelected]) => isSelected)
        .map(([option]) => option);
      
      console.log(`Opções selecionadas para ${questionId}:`, selectedForQuestion);
      
      if (selectedForQuestion.length > 0) {
        allSelectedOptions.push(...selectedForQuestion);
      }
    });
    
    console.log("🔍 Todas as opções selecionadas:", allSelectedOptions);

    // CORREÇÃO: Modificação na forma como processamos as opções e atualizamos o campo
    
    // Processar as opções selecionadas e textareas
    const selectedItems = [];
    
    // Capturar todas as opções selecionadas para o campo ativo
    if (Object.keys(selectedOptions).length > 0) {
      Object.values(selectedOptions).forEach(optionMap => {
        const options = Object.entries(optionMap)
          .filter(([_, isSelected]) => isSelected)
          .map(([option]) => option.trim());
        
        if (options.length > 0) {
          selectedItems.push(...options);
        }
      });
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
      
      const currentSection = birthPlanSections[activeSectionIndex];
      
      // Formatação especial para campos da seção de situações especiais
      const specialFields = ['emergencyScenarios', 'highRiskComplications', 'lowRiskOccurrences'];
      const useParagraphFormat = specialFields.includes(activeFieldKey);
      
      // Utilizar formato de parágrafos para os campos especiais
      const formattedText = useParagraphFormat 
        ? selectedItems.join('\n\n') 
        : selectedItems.join(', ');
      
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
