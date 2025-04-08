
import { Clock } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

interface ProgressCardProps {
  guideProgress: number;
  birthPlanProgress: number;
}

export function ProgressCard({ guideProgress, birthPlanProgress }: ProgressCardProps) {
  return (
    <Card className="p-6 bg-white border border-maternal-100">
      <h2 className="text-xl font-semibold text-maternal-900 mb-4 flex items-center">
        <Clock className="h-5 w-5 mr-2 text-maternal-600" /> Seu progresso geral
      </h2>
      
      <div className="space-y-6">
        <div>
          <div className="flex justify-between items-center mb-1">
            <span className="text-maternal-800 font-medium">Guia do Parto Respeitoso</span>
            <span className="text-maternal-600 text-sm">{Math.round(guideProgress)}%</span>
          </div>
          <Progress value={guideProgress} className="h-2" />
        </div>
        
        <div>
          <div className="flex justify-between items-center mb-1">
            <span className="text-maternal-800 font-medium">Plano de Parto</span>
            <span className="text-maternal-600 text-sm">{Math.round(birthPlanProgress)}%</span>
          </div>
          <Progress value={birthPlanProgress} className="h-2" />
        </div>
      </div>
    </Card>
  );
}
