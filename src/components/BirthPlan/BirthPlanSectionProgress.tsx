
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { 
  Book, 
  CheckCircle, 
  User, 
  MoonStar, 
  Baby, 
  Stethoscope, 
  Heart, 
  AlertCircle
} from 'lucide-react';

type Section = {
  id: string;
  title: string;
  color?: string;
  icon?: React.ReactNode;
};

interface BirthPlanSectionProgressProps {
  sections: Section[];
  currentSectionIndex: number;
  onSectionClick: (index: number) => void;
  stageType: 'questionnaire' | 'editor';
  completedSections?: string[];
}

export function BirthPlanSectionProgress({
  sections,
  currentSectionIndex,
  onSectionClick,
  stageType,
  completedSections = []
}: BirthPlanSectionProgressProps) {
  // Calculate progress percentage based on completed sections or current index
  const calculateProgress = () => {
    if (completedSections.length > 0) {
      return (completedSections.length / sections.length) * 100;
    }
    return ((currentSectionIndex + 1) / sections.length) * 100;
  };

  const progress = calculateProgress();
  
  // Get icon based on section id
  const getSectionIcon = (sectionId: string) => {
    switch (sectionId) {
      case 'personalInfo':
      case 'personal':
        return <User size={16} />;
      case 'atmosfera':
      case 'atmosphere':
        return <MoonStar size={16} />;
      case 'trabalhoDeParto':
      case 'labor':
        return <Baby size={16} />;
      case 'nascimento':
      case 'birth':
        return <Heart size={16} />;
      case 'cesarea':
      case 'cesarean':
        return <Stethoscope size={16} />;
      case 'posParto':
      case 'postpartum':
        return <Baby size={16} />;
      case 'situacoesEspeciais':
      case 'special':
        return <AlertCircle size={16} />;
      default:
        return <Book size={16} />;
    }
  };

  return (
    <div className="mb-6 print:hidden">
      <div className="max-w-6xl mx-auto mb-2">
        <div className="flex justify-between items-center">
          <span className="text-sm font-medium text-maternal-800">Seu progresso</span>
          <span className="text-sm font-medium text-maternal-800" aria-live="polite">{Math.round(progress)}%</span>
        </div>
        <Progress 
          value={progress} 
          className="h-2.5 bg-maternal-100" 
          indicatorClassName="bg-maternal-500"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={progress}
        />
        
        <div className="flex justify-between mt-4 gap-2 overflow-x-auto pb-2">
          {sections.map((section, index) => {
            const isActive = index === currentSectionIndex;
            const isCompleted = completedSections.includes(section.id) || index < currentSectionIndex;
            
            return (
              <Button
                key={section.id}
                variant="ghost"
                size="sm"
                className={`flex-shrink-0 text-xs px-3 py-2 h-auto rounded-md flex items-center gap-1.5 ${
                  isActive 
                    ? `bg-maternal-${section.color || '100'} text-maternal-900` 
                    : isCompleted 
                      ? 'text-maternal-700 bg-maternal-50' 
                      : 'text-maternal-500 hover:text-maternal-800 hover:bg-maternal-50'
                }`}
                onClick={() => onSectionClick(index)}
              >
                {getSectionIcon(section.id)}
                <span className="hidden sm:inline">{section.title}</span>
                {isCompleted && !isActive && (
                  <CheckCircle className="h-3 w-3 text-maternal-500 ml-1" />
                )}
              </Button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
