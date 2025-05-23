
import { FileText, Edit, Eye, Share2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

type BuilderStage = 'welcome' | 'questionnaire' | 'editor' | 'preview' | 'share';

interface BirthPlanHeaderProps {
  currentStage: BuilderStage;
  onStageChange: (stage: BuilderStage) => void;
}

export function BirthPlanHeader({ currentStage, onStageChange }: BirthPlanHeaderProps) {
  return (
    <header className="bg-maternal-500 text-white py-4 px-4 sm:px-6 lg:px-8 shadow-md print:hidden fixed top-16 left-0 right-0 z-40">
      <div className="max-w-6xl mx-auto flex flex-col sm:flex-row gap-4 sm:gap-0 justify-between items-center">
        <div className="flex items-center space-x-2">
          <FileText className="h-6 w-6 text-maternal-100" />
          <h1 className="text-xl font-bold">Construa seu Plano de Parto</h1>
        </div>
        
        <div className="flex space-x-2">
          {(currentStage !== 'welcome' && currentStage !== 'questionnaire') && (
            <>
              <Button 
                variant={currentStage === 'editor' ? "default" : "outline"}
                size="sm" 
                onClick={() => onStageChange('editor')}
                className={currentStage === 'editor' 
                  ? "bg-maternal-100 text-maternal-900" 
                  : "text-white bg-maternal-600 hover:bg-maternal-500 border-maternal-300"}
              >
                <Edit className="h-4 w-4 mr-2" /> 
                <span className="hidden sm:inline">Editar</span>
              </Button>
              
              <Button 
                variant={currentStage === 'preview' ? "default" : "outline"}
                size="sm" 
                onClick={() => onStageChange('preview')}
                className={currentStage === 'preview' 
                  ? "bg-maternal-100 text-maternal-900" 
                  : "text-white bg-maternal-600 hover:bg-maternal-500 border-maternal-300"}
              >
                <Eye className="h-4 w-4 mr-2" /> 
                <span className="hidden sm:inline">Visualizar</span>
              </Button>
              
              <Button 
                variant={currentStage === 'share' ? "default" : "outline"}
                size="sm" 
                onClick={() => onStageChange('share')}
                className={currentStage === 'share' 
                  ? "bg-maternal-100 text-maternal-900" 
                  : "text-white bg-maternal-600 hover:bg-maternal-500 border-maternal-300"}
              >
                <Share2 className="h-4 w-4 mr-2" /> 
                <span className="hidden sm:inline">Compartilhar</span>
              </Button>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
