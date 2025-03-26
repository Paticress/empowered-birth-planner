
import { Button } from '@/components/ui/button';
import { ChevronRight, ArrowLeft } from 'lucide-react';
import { MainRights } from './Rights/MainRights';
import { WhoRecommendations } from './Rights/WhoRecommendations';
import { ObstetricViolence } from './Rights/ObstetricViolence';
import { RisksInterventionsSection } from './Rights/RisksInterventionsSection';

interface GuideRightsProps {
  onNext: () => void;
  onPrevious: () => void;
}

export function GuideRights({ onPrevious, onNext }: GuideRightsProps) {
  return (
    <div className="animate-fade-in">
      <h1 className="text-3xl font-bold text-maternal-900 mb-6">Seus Direitos no Parto</h1>
      
      <div className="prose max-w-none">
        <p className="text-lg mb-4">
          Conhecer seus direitos é fundamental para garantir um parto respeitoso. 
          No Brasil, diversas leis e normas protegem as gestantes durante todo o processo.
        </p>
        
        <MainRights />
        <WhoRecommendations />
        <ObstetricViolence />
        <RisksInterventionsSection />
      </div>
      
      <div className="mt-8 flex justify-between">
        <Button 
          variant="navigation" 
          onClick={onPrevious}
          className="flex items-center"
        >
          <ArrowLeft className="mr-2 h-4 w-4" /> Voltar à Estrutura
        </Button>
        
        <Button 
          onClick={onNext}
          variant="navigation"
          className="flex items-center"
        >
          Próximo: Comunicação Eficaz <ChevronRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
