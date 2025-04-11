
/**
 * Utility functions for parsing options from text and field values
 */
import { parseOptionsFromText } from '../../utils/birthPlanUtils';

/**
 * Parses options from the current field value in the birth plan
 */
export const parseCurrentFieldOptions = (fieldKey: string, sectionId: string, birthPlan: Record<string, any>): string[] => {
  console.log(`Parsing options for field ${fieldKey} in section ${sectionId}`);
  
  if (!birthPlan[sectionId] || !birthPlan[sectionId][fieldKey]) {
    console.log(`No current value found for ${fieldKey} in section ${sectionId}`);
    return [];
  }
  
  const currentValue = birthPlan[sectionId][fieldKey] || '';
  console.log(`Current value: "${currentValue}"`);
  
  // Verifica se o valor é uma string simples ou array
  if (typeof currentValue === 'string') {
    // Divide por virgulas se for separado por virgulas
    if (currentValue.includes(', ')) {
      const options = currentValue.split(', ').map(item => item.trim()).filter(Boolean);
      console.log(`Parsed comma-separated options:`, options);
      return options;
    }
    // Ou por quebras de linha
    const options = parseOptionsFromText(currentValue);
    console.log(`Parsed line-break options:`, options);
    return options;
  }
  
  console.log(`Unable to parse options, returning empty array`);
  return [];
};
