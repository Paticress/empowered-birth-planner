
import { generateEmptyBirthPlan, generateBirthPlanFromAnswers } from './birthPlanGenerationUtils';

// Re-export the utility functions
export {
  generateEmptyBirthPlan,
  generateBirthPlanFromAnswers
};

// Add any additional utility functions here if needed
export const formatBirthPlanSection = (section: Record<string, string>): string => {
  return Object.entries(section)
    .filter(([_, value]) => value && value.trim() !== '')
    .map(([key, value]) => `${key}: ${value}`)
    .join('\n\n');
};

