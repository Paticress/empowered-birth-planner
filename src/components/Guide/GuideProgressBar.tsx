
import { Progress } from '@/components/ui/progress';

type GuideProgressBarProps = {
  progress: number;
};

export function GuideProgressBar({ progress }: GuideProgressBarProps) {
  return (
    <div className="mb-4 print:hidden">
      <div className="flex justify-between items-center mb-2">
        <span className="text-sm font-medium text-maternal-700">Seu progresso</span>
        <span className="text-sm font-medium text-maternal-700">{Math.round(progress)}%</span>
      </div>
      <Progress value={progress} className="h-2" />
    </div>
  );
}
