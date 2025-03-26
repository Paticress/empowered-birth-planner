
import { Progress } from '@/components/ui/progress';

// Define the tab order to calculate progress
const TAB_ORDER = [
  'introduction',
  'rights',
  'structure',
  'communication',
  'checklist',
  'resources'
];

type GuideProgressBarProps = {
  activeTab: string;
};

export function GuideProgressBar({ activeTab }: GuideProgressBarProps) {
  // Calculate progress based on activeTab position in TAB_ORDER
  const currentIndex = TAB_ORDER.indexOf(activeTab);
  const progress = currentIndex >= 0 ? ((currentIndex + 1) / TAB_ORDER.length) * 100 : 0;

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
