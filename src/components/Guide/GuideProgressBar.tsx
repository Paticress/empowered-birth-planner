
import { Progress } from '@/components/ui/progress';

type GuideProgressBarProps = {
  progress: number;
};

export function GuideProgressBar({ progress }: GuideProgressBarProps) {
  return (
    <div className="mb-4 print:hidden" aria-label="Progresso no guia">
      <div className="flex justify-between items-center mb-2">
        <span className="text-sm font-medium text-brand-black">Seu progresso</span>
        <span className="text-sm font-medium text-brand-black" aria-live="polite">{Math.round(progress)}%</span>
      </div>
      <Progress 
        value={progress} 
        className="h-2 bg-brand-beige/30" 
        indicatorClassName="bg-brand-pink"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={Math.round(progress)}
      />
    </div>
  );
}
