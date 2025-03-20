
import { Progress } from '@/components/ui/progress';
import { BuilderStage } from './types/questionnaire';
import { CheckCircle } from 'lucide-react';

type BirthPlanProgressBarProps = {
  currentStage: BuilderStage;
};

export function BirthPlanProgressBar({ currentStage }: BirthPlanProgressBarProps) {
  // Return null for all stages to remove the progress bar completely
  return null;
}
