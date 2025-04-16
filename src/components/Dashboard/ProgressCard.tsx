
import { Clock, Lock, RefreshCw } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { useNavigation } from "@/hooks/useNavigation";
import { useBirthPlanAccess } from "@/hooks/useBirthPlanAccess";
import { toast } from "sonner";

interface ProgressCardProps {
  guideProgress: number;
  birthPlanProgress: number;
  isFullAccessUser: boolean | null;
}

export function ProgressCard({ guideProgress, birthPlanProgress, isFullAccessUser }: ProgressCardProps) {
  const { navigateTo } = useNavigation();
  const { refreshPlanStatus, isRefreshing } = useBirthPlanAccess();
  
  const handleCheckAccess = () => {
    refreshPlanStatus().then(() => {
      const currentPlan = localStorage.getItem('user_plan');
      if (currentPlan === 'paid') {
        toast.success("Acesso ao plano premium atualizado! Atualizando página...");
        setTimeout(() => window.location.reload(), 1500);
      } else {
        window.open("https://www.energiamaterna.com.br/criar-meu-plano-de-parto-em-minutos", "_blank");
      }
    });
  };
  
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
        
        {isFullAccessUser ? (
          <div>
            <div className="flex justify-between items-center mb-1">
              <span className="text-maternal-800 font-medium">Plano de Parto</span>
              <span className="text-maternal-600 text-sm">{Math.round(birthPlanProgress)}%</span>
            </div>
            <Progress value={birthPlanProgress} className="h-2" />
          </div>
        ) : (
          <div>
            <div className="flex justify-between items-center mb-1">
              <span className="text-maternal-800 font-medium flex items-center">
                Plano de Parto <Lock className="h-3 w-3 ml-1 text-maternal-400" />
              </span>
              <span className="text-maternal-600 text-sm">Bloqueado</span>
            </div>
            <div className="bg-gray-200 h-2 w-full rounded-full relative">
              <div className="absolute inset-0 flex items-center justify-center">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  disabled={isRefreshing}
                  className="text-xs text-maternal-500 hover:text-maternal-700 p-0 h-auto flex items-center gap-1"
                  onClick={handleCheckAccess}
                >
                  {isRefreshing && <RefreshCw className="h-3 w-3 animate-spin" />}
                  {isRefreshing ? "Verificando acesso..." : "Adquirir acesso"}
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </Card>
  );
}
