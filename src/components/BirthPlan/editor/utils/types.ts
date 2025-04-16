
/**
 * Core types for the birth plan editor and questionnaire
 */

// Types for questionnaire questions
export interface QuestionOption {
  value: string;
  label: string;
}

export interface QuestionBase {
  id: string;
  text: string;
  description?: string;
  isRequired?: boolean;
  sectionId: string;
}

export interface TextQuestion extends QuestionBase {
  type: 'text';
}

export interface TextareaQuestion extends QuestionBase {
  type: 'textarea';
}

export interface RadioQuestion extends QuestionBase {
  type: 'radio';
  options: string[];
}

export interface CheckboxQuestion extends QuestionBase {
  type: 'checkbox';
  options: string[];
}

export interface SelectQuestion extends QuestionBase {
  type: 'select';
  options: string[];
}

export type Question = 
  | TextQuestion
  | TextareaQuestion
  | RadioQuestion
  | CheckboxQuestion
  | SelectQuestion;

// Special field types
export type SpecialFieldId = 
  | 'emergencyPreferences'
  | 'highRiskComplications'
  | 'lowRiskOccurrences';

export const SPECIAL_FIELD_IDS: SpecialFieldId[] = [
  'emergencyPreferences',
  'highRiskComplications',
  'lowRiskOccurrences'
];

// Types for editor fields
export interface EditorField {
  key: string;
  label: string;
}

export interface EditorSection {
  id: string;
  title: string;
  color?: string;
  fields: EditorField[];
}

// Types for option selection state
export type SelectedOptionsMap = Record<string, Record<string, boolean>>;
export type TextareaValuesMap = Record<string, string>;

// Mapping between questionnaire and editor
export interface FieldMapping {
  fieldKey: string;
  questionIds: string[];
  sectionId: string;
}
