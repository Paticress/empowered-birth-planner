
/**
 * Utility functions for parsing options from text and field values
 */
import { parseOptionsFromText } from '../../utils/birthPlanUtils';

/**
 * Parses options from the current field value in the birth plan
 */
export const parseCurrentFieldOptions = (fieldKey: string, sectionId: string, birthPlan: Record<string, any>): string[] => {
  if (!birthPlan[sectionId] || !birthPlan[sectionId][fieldKey]) {
    return [];
  }
  const currentValue = birthPlan[sectionId][fieldKey] || '';
  
  // Verifica se o valor é uma string simples ou array
  if (typeof currentValue === 'string') {
    // Divide por virgulas se for separado por virgulas
    if (currentValue.includes(', ')) {
      return currentValue.split(', ').map(item => item.trim()).filter(Boolean);
    }
    // Ou por quebras de linha
    return parseOptionsFromText(currentValue);
  }
  
  return [];
};
