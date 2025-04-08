
import { FileText, CheckCircle2, Circle } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useNavigation } from "@/hooks/useNavigation";

interface BirthPlanStage {
  id: string;
  name: string;
}

interface BirthPlanProgressCardProps {
  stages: BirthPlanStage[];
  hasStartedBirthPlan: boolean;
  birthPlanProgress: number;
  isCompleted: boolean;
}

export function BirthPlanProgressCard({ 
  stages, 
  hasStartedBirthPlan, 
  birthPlanProgress, 
  isCompleted 
}: BirthPlanProgressCardProps) {
  const { navigateTo } = useNavigation();
  
  const getBirthPlanStageUrl = (stageId: string) => {
    return `/criar-plano?stage=${stageId}`;
  };
  
  return (
    <Card className="p-6 bg-white border border-maternal-100">
      <h2 className="text-xl font-semibold text-maternal-900 mb-4 flex items-center">
        <FileText className="h-5 w-5 mr-2 text-maternal-600" /> Plano de Parto
      </h2>
      
      <div className="space-y-2">
        {stages.map((stage, index) => {
          // Estimate completion based on birth plan progress
          const isCompletedStage = hasStartedBirthPlan && 
            (birthPlanProgress > (index * (100 / stages.length)));
            
          return (
            <div 
              key={stage.id} 
              className={`flex items-center ${isCompletedStage ? 'cursor-pointer hover:bg-maternal-50 transition-colors rounded py-1 px-1' : ''}`}
              onClick={isCompletedStage ? () => navigateTo(getBirthPlanStageUrl(stage.id)) : undefined}
            >
              {isCompletedStage ? (
                <CheckCircle2 className="h-5 w-5 mr-3 text-green-500" />
              ) : (
                <Circle className="h-5 w-5 mr-3 text-gray-300" />
              )}
              <span className={isCompletedStage ? 'text-maternal-900' : 'text-maternal-600'}>
                {stage.name}
              </span>
            </div>
          );
        })}
      </div>
      
      <Separator className="my-4" />
      
      <Button 
        onClick={() => navigateTo('/criar-plano')}
        variant="outline" 
        className="w-full mt-2"
      >
        {isCompleted ? 'Plano Concluído - Revisar' : hasStartedBirthPlan ? 'Continuar plano' : 'Criar plano de parto'}
      </Button>
    </Card>
  );
}
