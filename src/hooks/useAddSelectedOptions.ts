// src/hooks/useAddSelectedOptions.ts

import { useCallback } from "react";

type Params = {
  activeFieldKey: string;
  selectedOptions: Record<string, string[]>;
  localBirthPlan: any;
  setLocalBirthPlan: (plan: any) => void;
  completedSections: string[];
  setCompletedSections: (sections: string[]) => void;
  setSelectedOptions: (options: Record<string, string[]>) => void;
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
  const handleAddSelectedOptions = useCallback(() => {
    console.log("➕ Adicionando opções ao campo:", activeFieldKey);
    console.log("🟣 Opções selecionadas:", selectedOptions);
    console.log("📝 Textareas preenchidos:", textareaValues);
    console.log("📄 Conteúdo atual do birthPlan:", localBirthPlan);

    const updatedField = [
      ...(selectedOptions[activeFieldKey] || []),
      ...(textareaValues[activeFieldKey] ? [textareaValues[activeFieldKey]] : [])
    ];

    const updatedPlan = {
      ...localBirthPlan,
      [activeFieldKey]: updatedField
    };

    setLocalBirthPlan(updatedPlan);

    if (!completedSections.includes(activeFieldKey)) {
      setCompletedSections([...completedSections, activeFieldKey]);
    }

    setSelectedOptions((prev) => ({ ...prev, [activeFieldKey]: [] }));
    setTextareaValues({});
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
