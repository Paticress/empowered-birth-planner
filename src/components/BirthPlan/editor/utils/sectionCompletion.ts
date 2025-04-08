
import { birthPlanSections } from '../../utils/birthPlanSections';

/**
 * Checks if a section is completed based on the number of filled fields
 */
export const checkSectionCompletion = (
  sectionId: string, 
  plan: Record<string, any>,
  completedSections: string[],
  setCompletedSections: React.Dispatch<React.SetStateAction<string[]>>
) => {
  const section = birthPlanSections.find(section => section.id === sectionId);
  if (!section) return;
  
  const filledFields = section.fields.filter(field => {
    const value = plan[sectionId]?.[field.key];
    return value && value.trim() !== '';
  });
  
  if (filledFields.length >= 3 && !completedSections.includes(sectionId)) {
    setCompletedSections(prev => [...prev, sectionId]);
  } else if (filledFields.length < 3 && completedSections.includes(sectionId)) {
    setCompletedSections(prev => prev.filter(id => id !== sectionId));
  }
};
