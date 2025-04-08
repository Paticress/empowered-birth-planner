
import { ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";
import { useNavigation } from "@/hooks/useNavigation";

type RecommendedStep = {
  title: string;
  description: string;
  path: string;
  icon: LucideIcon;
};

interface RecommendedStepCardProps {
  recommendedStep: RecommendedStep;
  isGuideCompleted: boolean;
  isBirthPlanCompleted: boolean;
}

export function RecommendedStepCard({ 
  recommendedStep, 
  isGuideCompleted, 
  isBirthPlanCompleted 
}: RecommendedStepCardProps) {
  const { navigateTo } = useNavigation();
  const Icon = recommendedStep.icon;

  return (
    <Card className="p-6 bg-white border border-maternal-100">
      <div className="flex items-start">
        <div className="bg-maternal-100 p-3 rounded-full mr-4">
          <Icon className="h-6 w-6 text-maternal-600" />
        </div>
        <div>
          <h2 className="text-xl font-semibold text-maternal-900 mb-2">
            Próximo passo recomendado
          </h2>
          <p className="text-maternal-700 mb-4">{recommendedStep.description}</p>
          <Button 
            onClick={() => navigateTo(recommendedStep.path)}
            className="bg-maternal-600 hover:bg-maternal-700"
          >
            {isGuideCompleted && recommendedStep.title.includes("Guia") 
              ? "Reler o Guia Completo" 
              : isBirthPlanCompleted && recommendedStep.title.includes("Plano de Parto")
                ? "Revisar seu Plano de Parto" 
                : recommendedStep.title} 
            <ChevronRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </div>
    </Card>
  );
}
