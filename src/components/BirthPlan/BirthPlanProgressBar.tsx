
import { Progress } from '@/components/ui/progress';
import { BuilderStage } from './types/questionnaire';
import { CheckCircle } from 'lucide-react';

type BirthPlanProgressBarProps = {
  currentStage: BuilderStage;
};

export function BirthPlanProgressBar({ currentStage }: BirthPlanProgressBarProps) {
  // Calcula o progresso com base no estágio atual
  const getProgress = (stage: BuilderStage): number => {
    switch (stage) {
      case 'welcome':
        return 0;
      case 'questionnaire':
        return 25;
      case 'editor':
        return 50;
      case 'preview':
        return 75;
      case 'share':
        return 100;
      default:
        return 0;
    }
  };

  const progress = getProgress(currentStage);
  
  // Define os estágios em ordem
  const stages: BuilderStage[] = ['welcome', 'questionnaire', 'editor', 'preview', 'share'];
  
  // Encontra o índice do estágio atual
  const currentStageIndex = stages.indexOf(currentStage);

  const getStageLabel = (stage: BuilderStage): string => {
    switch (stage) {
      case 'welcome':
        return 'Início';
      case 'questionnaire':
        return 'Questionário';
      case 'editor':
        return 'Editor';
      case 'preview':
        return 'Visualização';
      case 'share':
        return 'Compartilhar';
      default:
        return '';
    }
  };

  return (
    <div className="mb-6 print:hidden">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mb-4">
        <Progress 
          value={progress} 
          className="h-2.5 bg-maternal-100" 
          indicatorClassName="bg-maternal-500"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={progress}
        />
        
        <div className="flex justify-between mt-2">
          {stages.map((stage, index) => {
            const isCompleted = index <= currentStageIndex;
            const isCurrent = index === currentStageIndex;
            
            return (
              <div 
                key={stage} 
                className={`text-xs font-medium flex flex-col items-center w-1/5 ${
                  isCompleted ? 'text-maternal-700' : 'text-maternal-400'
                }`}
              >
                <span className={`hidden sm:block ${isCurrent ? 'font-bold' : ''}`}>
                  {getStageLabel(stage)}
                </span>
                {isCompleted && (
                  <CheckCircle className="h-4 w-4 sm:hidden text-maternal-500" />
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
