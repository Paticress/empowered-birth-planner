
import { FileText, Edit, Eye, Share2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigation } from '@/hooks/useNavigation';

type BuilderStage = 'welcome' | 'questionnaire' | 'editor' | 'preview' | 'share';

interface BirthPlanHeaderProps {
  currentStage: BuilderStage;
  onStageChange: (stage: BuilderStage) => void;
}

export function BirthPlanHeader({ currentStage, onStageChange }: BirthPlanHeaderProps) {
  const { navigateTo } = useNavigation();
  
  return (
    <header className="bg-white text-brand-black py-4 px-4 sm:px-6 lg:px-8 shadow-md print:hidden">
      <div className="max-w-6xl mx-auto flex flex-col sm:flex-row gap-4 sm:gap-0 justify-between items-center">
        <div className="flex items-center space-x-2">
          <FileText className="h-6 w-6 text-maternal-600" />
          <h1 className="text-xl font-bold text-brand-black">Construa seu Plano de Parto</h1>
        </div>
        
        <div className="flex space-x-2">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => navigateTo("/guia-online")}
            className="text-maternal-900"
          >
            Voltar ao Guia
          </Button>
          
          {currentStage !== 'welcome' && currentStage !== 'questionnaire' && (
            <>
              <Button 
                variant={currentStage === 'editor' ? "default" : "outline"}
                size="sm" 
                onClick={() => onStageChange('editor')}
                className={currentStage === 'editor' ? "bg-maternal-600" : "text-maternal-900"}
              >
                <Edit className="h-4 w-4 mr-2" /> 
                <span className="hidden sm:inline">Editar</span>
              </Button>
              
              <Button 
                variant={currentStage === 'preview' ? "default" : "outline"}
                size="sm" 
                onClick={() => onStageChange('preview')}
                className={currentStage === 'preview' ? "bg-maternal-600" : "text-maternal-900"}
              >
                <Eye className="h-4 w-4 mr-2" /> 
                <span className="hidden sm:inline">Visualizar</span>
              </Button>
              
              <Button 
                variant={currentStage === 'share' ? "default" : "outline"}
                size="sm" 
                onClick={() => onStageChange('share')}
                className={currentStage === 'share' ? "bg-maternal-600" : "text-maternal-900"}
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
