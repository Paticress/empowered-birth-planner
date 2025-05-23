
export type QuestionSection = {
  id: string;
  title: string;
  description: string;
  icon?: string;
  questions: Question[];
};

export type Question = {
  id: string;
  text: string;
  type: 'text' | 'textarea' | 'checkbox' | 'radio' | 'select';
  options?: string[];
  isRequired?: boolean;
  description?: string;
  conditionalDisplay?: {
    dependsOn: string;
    showWhen: string | string[];
  };
};

// Define the builder stages for better type safety
export type BuilderStage = 'welcome' | 'questionnaire' | 'editor' | 'preview' | 'share';

// Define the birth plan data structure
export type BirthPlanData = Record<string, any>;
