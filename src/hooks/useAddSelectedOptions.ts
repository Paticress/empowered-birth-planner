
import { useCallback } from "react";

type Params = {
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
  
  // Main function that processes selected options and textarea values
  const handleAddSelectedOptions = useCallback(() => {
    // Detailed logging for debugging
    console.log(`🔍 Processing options for field: ${activeFieldKey}`);
    console.log(`🔍 Current options:`, selectedOptions[activeFieldKey] || {});
    console.log(`🔍 Current textarea values:`, textareaValues);
    
    // Extract selected options (from checkboxes or similar UI elements)
    const selectedStrings = Object.entries(selectedOptions[activeFieldKey] || {})
      .filter(([_, isSelected]) => isSelected)
      .map(([option]) => option.trim());
    
    console.log(`🔍 Selected options extracted: ${selectedStrings.length} items`);

    // Extract manual text entries from textareas
    const manualTexts = Object.values(textareaValues)
      .map(text => text.trim())
      .filter(Boolean); // remove empty texts
    
    console.log(`🔍 Manual texts extracted: ${manualTexts.length} items`);

    // Get existing value in the birth plan
    const currentValue = (localBirthPlan?.[activeFieldKey] || '')
      .split('\n\n')
      .map(s => s.trim())
      .filter(Boolean);
    
    console.log(`🔍 Current field value has: ${currentValue.length} items`);

    // Combine all values: existing + selected + manual
    const allNewValues = [...selectedStrings, ...manualTexts];
    
    // Create final value by merging everything and removing duplicates
    const mergedValues = Array.from(new Set([...currentValue, ...allNewValues])).filter(Boolean);
    
    console.log(`🔍 Final merged values: ${mergedValues.length} items`);

    // Update the birth plan with new values
    const updatedPlan = {
      ...localBirthPlan,
      [activeFieldKey]: mergedValues.join('\n\n')
    };
    
    setLocalBirthPlan(updatedPlan);

    // Mark section as completed if not already done
    if (!completedSections.includes(activeFieldKey)) {
      setCompletedSections([...completedSections, activeFieldKey]);
    }

    // Reset state
    setSelectedOptions(prev => ({
      ...prev,
      [activeFieldKey]: {}
    }));
    setTextareaValues({});
    setDialogOpen(false);
    
    console.log(`✅ Options processing complete for ${activeFieldKey}`);
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
