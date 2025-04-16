
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
    if (activeFieldKey === 'emergencyScenarios' || 
        activeFieldKey === 'highRiskComplications' || 
        activeFieldKey === 'lowRiskOccurrences') {
      console.log(`🔍 ANÁLISE ESPECIAL para campo especial: ${activeFieldKey}`);
      
      // Verificar se temos a questão correspondente no selectedOptions
      const questionMap = {
        'emergencyScenarios': 'emergencyPreferences',
        'highRiskComplications': 'highRiskComplications',
        'lowRiskOccurrences': 'lowRiskOccurrences'
      };
      
      const questionId = questionMap[activeFieldKey as keyof typeof questionMap];
      if (selectedOptions[questionId]) {
        console.log(`🔍 Verificando questão específica ${questionId} para campo ${activeFieldKey}`);
        const selectedForQuestion = Object.entries(selectedOptions[questionId])
          .filter(([_, isSelected]) => isSelected)
          .map(([option]) => option);
        
        console.log(`🔍 Opções selecionadas para ${questionId}:`, selectedForQuestion);
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
    const selectedItems = [];
    
    // Capturar todas as opções selecionadas para o campo ativo
    if (activeFieldKey && Object.keys(selectedOptions).length > 0) {
      // Combinar opções de todas as questões relevantes para este campo
      Object.entries(selectedOptions).forEach(([questionId, options]) => {
        // Para os campos especiais específicos, verificamos se o questionId corresponde
        // às questões específicas mapeadas para esses campos
        const specialFields = {
          'emergencyScenarios': ['emergencyPreferences'],
          'highRiskComplications': ['highRiskComplications'],
          'lowRiskOccurrences': ['lowRiskOccurrences']
        };
        
        // Verificar se este questionId é relevante para o campo ativo
        const relevantQuestionIds = specialFields[activeFieldKey as keyof typeof specialFields] || [];
        const isRelevantQuestion = relevantQuestionIds.includes(questionId) || 
                                  questionId === activeFieldKey;
        
        if (isRelevantQuestion || Object.keys(relevantQuestionIds).length === 0) {
          console.log(`Processando opções para questão ${questionId} relevante para campo ${activeFieldKey}`);
          
          const selectedForQuestion = Object.entries(options)
            .filter(([_, isSelected]) => isSelected)
            .map(([option]) => option.trim());
          
          console.log(`Opções selecionadas para ${questionId}:`, selectedForQuestion);
          
          if (selectedForQuestion.length > 0) {
            selectedItems.push(...selectedForQuestion);
          }
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
      
      // CORREÇÃO: Formatar com vírgula e espaço, sem quebras de linha
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
