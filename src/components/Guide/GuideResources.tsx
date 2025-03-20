
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { BirthPlanCTA } from './BirthPlanCTA';
import { ProceduresSection } from './ProceduresSection';
import { ConsultationSection } from './ConsultationSection';
import { ProductsSection } from './ProductsSection';
import { NextStepsSection } from './NextStepsSection';

interface GuideResourcesProps {
  onPrevious: () => void;
}

export function GuideResources({ onPrevious }: GuideResourcesProps) {
  return (
    <div className="animate-fade-in">
      <h1 className="text-3xl font-bold text-maternal-900 mb-6">Recursos Adicionais</h1>
      
      <BirthPlanCTA />
      
      <div className="prose max-w-none">
        <ProceduresSection />
        
        <ConsultationSection />
        
        <ProductsSection />
        
        <NextStepsSection />
      </div>
      
      <div className="mt-8">
        <Button 
          variant="navigation"
          onClick={onPrevious}
          className="flex items-center"
        >
          <ArrowLeft className="mr-2 h-4 w-4" /> Voltar ao Checklist
        </Button>
      </div>
    </div>
  );
}
