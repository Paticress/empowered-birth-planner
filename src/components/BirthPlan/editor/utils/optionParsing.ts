
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
  
  // Check if the value is a simple string or array
  if (typeof currentValue === 'string') {
    // Split by commas if comma-separated
    if (currentValue.includes(', ')) {
      const options = currentValue.split(', ').map(item => item.trim()).filter(Boolean);
      console.log(`Parsed comma-separated options:`, options);
      return options;
    }
    // Or by line breaks
    const options = parseOptionsFromText(currentValue);
    console.log(`Parsed line-break options:`, options);
    return options;
  }
  
  console.log(`Unable to parse options, returning empty array`);
  return [];
};
