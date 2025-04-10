// src/hooks/useAddSelectedOptions.ts

import { useCallback } from "react";

type Params = {
  activeFieldKey: string;
  selectedOptions: Record<string, Record<string, boolean>>;
  localBirthPlan: any;
  setLocalBirthPlan: (plan: any) => void;
  completedSections: string[];
  setCompletedSections: (sections: string[]) => void;

  // ✅ Corrigido aqui: define como uma função que recebe um state ou função e retorna void
  setSelectedOptions: React.Dispatch<React.SetStateAction<Record<string, Record<string, boolean>>>>;

  setDialogOpen: (open: boolean) => void;
  textareaValues: Record<string, string>;
  setTextareaValues: (values: Record<string, string>) => void;
};

export function useAddSelectedOptions({
  activeFieldKey,
  selectedOptions,
  localBirthPlan,
  setLocalBirthPlan,
  completedSections,
  setCompletedSections,
  setSelectedOptions,
  setDialogOpen,
  textareaValues,
  setTextareaValues,
}: Params) {
  
  // Função principal que processa as opções selecionadas e textarea
  const handleAddSelectedOptions = useCallback(() => {
    // Extrai as opções selecionadas (checkboxes ou similares)
    const selectedStrings = Object.entries(selectedOptions[activeFieldKey] || {})
      .filter(([_, isSelected]) => isSelected)
      .map(([option]) => option.trim());

    // Extrai o texto do textarea (se houver)
    const manualTexts = Object.values(textareaValues)
      .map(text => text.trim())
      .filter(Boolean); // remove textos vazios

    // Separa os valores já existentes no plano local
    const currentValue = (localBirthPlan?.[activeFieldKey] || '')
      .split('\n\n')
      .map(s => s.trim());

    // Combina selecionadas + textarea (se houver)
    const allNewValues = [...selectedStrings, ...manualTexts];

    // Junta tudo e remove duplicatas
    const mergedValues = Array.from(new Set([...currentValue, ...allNewValues])).filter(v => v);

    // Atualiza o plano local com os novos valores
    const updatedPlan = {
      ...localBirthPlan,
      [activeFieldKey]: mergedValues.join('\n\n')
    };

    setLocalBirthPlan(updatedPlan);

    // Marca a seção como concluída, se ainda não estiver
    if (!completedSections.includes(activeFieldKey)) {
      setCompletedSections([...completedSections, activeFieldKey]);
    }

    // Limpa as opções selecionadas para este campo
    setSelectedOptions(prev => ({
      ...prev,
      [activeFieldKey]: {}
    }));

    // Limpa as textareas
    setTextareaValues({});

    // Fecha o diálogo
    setDialogOpen(false);
  }, [
    activeFieldKey,
    selectedOptions,
    textareaValues,
    localBirthPlan,
    completedSections,
    setLocalBirthPlan,
    setCompletedSections,
    setSelectedOptions,
    setTextareaValues,
    setDialogOpen
  ]);

  return { handleAddSelectedOptions };
}
