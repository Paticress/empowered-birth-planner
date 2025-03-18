
export type QuestionSection = {
  id: string;
  title: string;
  description: string;
  questions: Question[];
};

export type Question = {
  id: string;
  text: string;
  type: 'text' | 'textarea' | 'checkbox' | 'radio' | 'select';
  options?: string[];
  isRequired?: boolean;
};
