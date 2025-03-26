
import { Button } from '@/components/ui/button';
import { ChevronRight, ArrowLeft } from 'lucide-react';
import { EssentialSections } from './Structure/EssentialSections';
import { StructureTips } from './Structure/StructureTips';

interface GuideStructureProps {
  onNext: () => void;
  onPrevious: () => void;
}

export function GuideStructure({ onPrevious, onNext }: GuideStructureProps) {
  return (
    <div className="animate-fade-in">
      <h1 className="text-3xl font-bold text-maternal-900 mb-6">Como Estruturar seu Plano de Parto</h1>
      
      <div className="prose max-w-none">
        <p className="text-lg mb-4">
          Um plano de parto bem estruturado facilita a comunicação com a equipe médica e 
          aumenta as chances de que seus desejos sejam respeitados.
        </p>
        
        <EssentialSections />
        <StructureTips />
      </div>
      
      <div className="mt-8 flex justify-between">
        <Button 
          variant="navigation" 
          onClick={onPrevious}
          className="flex items-center"
        >
          <ArrowLeft className="mr-2 h-4 w-4" /> Voltar à Introdução
        </Button>
        
        <Button 
          onClick={onNext}
          variant="navigation"
          className="flex items-center"
        >
          Próximo: Seus Direitos <ChevronRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
