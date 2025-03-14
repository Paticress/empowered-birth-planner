
import { Progress } from '@/components/ui/progress';

type GuideProgressBarProps = {
  progress: number;
};

export function GuideProgressBar({ progress }: GuideProgressBarProps) {
  return (
    <div className="mb-4 print:hidden">
      <div className="flex justify-between items-center mb-2">
        <span className="text-sm font-medium text-brand-gold">Seu progresso</span>
        <span className="text-sm font-medium text-brand-gold">{Math.round(progress)}%</span>
      </div>
      <Progress value={progress} className="h-2 bg-brand-beige/50" indicatorClassName="bg-brand-gold" />
    </div>
  );
}
