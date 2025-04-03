
import { BirthPlanWelcome } from '../BirthPlanWelcome';
import { BirthPlanQuestionnaire } from '../BirthPlanQuestionnaire';
import { BirthPlanEditor } from '../BirthPlanEditor';
import { BirthPlanPreview } from '../BirthPlanPreview';
import { BirthPlanShare } from '../BirthPlanShare';

interface StageContentProps {
  currentStage: string;
  birthPlanContent: Record<string, any>;
  questionnaireAnswers: Record<string, any>;
  onQuestionnaireSubmit: (data: Record<string, any>) => void;
  onUpdateBirthPlan: (data: Record<string, any>) => void;
  onNextStage: () => void;
  onGoToStage: (stage: 'welcome' | 'questionnaire' | 'editor' | 'preview' | 'share') => void;
}

export function StageContent({
  currentStage,
  birthPlanContent,
  questionnaireAnswers,
  onQuestionnaireSubmit,
  onUpdateBirthPlan,
  onNextStage,
  onGoToStage
}: StageContentProps) {
  switch (currentStage) {
    case 'welcome':
      return <BirthPlanWelcome onStart={onNextStage} />;
      
    case 'questionnaire':
      return <BirthPlanQuestionnaire onSubmit={onQuestionnaireSubmit} />;
      
    case 'editor':
      return (
        <BirthPlanEditor 
          birthPlan={birthPlanContent} 
          onUpdate={onUpdateBirthPlan} 
          onNext={onNextStage}
          onBack={() => onGoToStage('questionnaire')}
          questionnaireAnswers={questionnaireAnswers}
        />
      );
      
    case 'preview':
      return (
        <BirthPlanPreview 
          birthPlan={birthPlanContent} 
          onEdit={() => onGoToStage('editor')} 
          onNext={onNextStage} 
        />
      );
      
    case 'share':
      return (
        <BirthPlanShare 
          birthPlan={birthPlanContent} 
          onEdit={() => onGoToStage('editor')} 
        />
      );
      
    default:
      return <div>Stage not found</div>;
  }
}
