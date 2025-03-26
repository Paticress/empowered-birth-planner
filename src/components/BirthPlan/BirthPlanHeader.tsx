
import { FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigation } from '@/hooks/useNavigation';

type BuilderStage = 'welcome' | 'questionnaire' | 'editor' | 'preview' | 'share';

interface BirthPlanHeaderProps {
  currentStage: BuilderStage;
  onStageChange: (stage: BuilderStage) => void;
}

export function BirthPlanHeader({ currentStage, onStageChange }: BirthPlanHeaderProps) {
  return (
    <header className="bg-maternal-500 text-white py-4 px-4 sm:px-6 lg:px-8 shadow-md print:hidden">
      <div className="max-w-6xl mx-auto flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <FileText className="h-6 w-6 text-maternal-100" />
          <h1 className="text-xl font-bold">Construa seu Plano de Parto</h1>
        </div>
        
        <div>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => window.open("/guia-online", "_blank")}
            className="text-white bg-maternal-600 hover:bg-maternal-500 border-maternal-300"
          >
            Voltar ao Guia
          </Button>
        </div>
      </div>
    </header>
  );
}
