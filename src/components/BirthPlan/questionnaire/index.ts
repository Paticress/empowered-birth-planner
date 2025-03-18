
import { personalSection } from './personalSection';
import { atmosphereSection } from './atmosphereSection';
import { laborPreferencesSection } from './laborPreferencesSection';
import { birthSection } from './birthSection';
import { cesareanSection } from './cesareanSection';
import { postpartumSection } from './postpartumSection';
import { specialSituationsSection } from './specialSituationsSection';
import { QuestionSection } from '../types/questionnaire';

// Export all sections in an array to maintain original order
export const questionnaireSections: QuestionSection[] = [
  personalSection,
  atmosphereSection,
  laborPreferencesSection,
  birthSection,
  cesareanSection,
  postpartumSection,
  specialSituationsSection
];
