
import { BookOpen, CheckCircle2, Circle, RefreshCw } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useNavigation } from "@/hooks/useNavigation";
import { useBirthPlanAccess } from "@/hooks/useBirthPlanAccess";
import { toast } from "sonner";

interface GuideSection {
  id: string;
  name: string;
}

interface GuideProgressCardProps {
  sections: GuideSection[];
  currentTab: string | null;
  isCompleted: boolean;
}

export function GuideProgressCard({ sections, currentTab, isCompleted }: GuideProgressCardProps) {
  const { navigateTo } = useNavigation();
  const { refreshPlanStatus, isRefreshing } = useBirthPlanAccess();
  
  // Modificamos esta função para criar URLs específicas para cada seção
  const handleSectionClick = (sectionId: string) => {
    navigateTo(`/guia-online?tab=${sectionId}`);
  };

  const handleRefreshAccess = () => {
    refreshPlanStatus().then(() => {
      const currentPlan = localStorage.getItem('user_plan');
      if (currentPlan === 'paid') {
        toast.success("Acesso atualizado com sucesso!");
        // No need to reload since we're not showing anything different based on plan here
      }
    });
  };
  
  return (
    <Card className="p-6 bg-white border border-maternal-100">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-maternal-900 flex items-center">
          <BookOpen className="h-5 w-5 mr-2 text-maternal-600" /> Guia do Parto Respeitoso
        </h2>
        <Button
          variant="ghost"
          size="sm"
          onClick={handleRefreshAccess}
          disabled={isRefreshing}
          className="h-8 px-2 text-xs flex items-center gap-1 text-maternal-600"
        >
          {isRefreshing ? (
            <RefreshCw className="h-3 w-3 animate-spin" />
          ) : (
            <RefreshCw className="h-3 w-3" />
          )}
          {isRefreshing ? "Verificando..." : "Verificar acesso"}
        </Button>
      </div>
      
      <div className="space-y-2">
        {sections.map((section, index) => {
          const isCompletedSection = currentTab && 
            sections.findIndex(s => s.id === currentTab) >= index;
          
          return (
            <div 
              key={section.id} 
              className={`flex items-center ${isCompletedSection ? 'cursor-pointer hover:bg-maternal-50 transition-colors rounded py-1 px-1' : ''}`}
              onClick={isCompletedSection ? () => handleSectionClick(section.id) : undefined}
            >
              {isCompletedSection ? (
                <CheckCircle2 className="h-5 w-5 mr-3 text-green-500" />
              ) : (
                <Circle className="h-5 w-5 mr-3 text-gray-300" />
              )}
              <span className={isCompletedSection ? 'text-maternal-900' : 'text-maternal-600'}>
                {section.name}
              </span>
            </div>
          );
        })}
      </div>
      
      <Separator className="my-4" />
      
      <Button 
        onClick={() => navigateTo('/guia-online')}
        variant="outline" 
        className="w-full mt-2"
      >
        {isCompleted ? 'Leitura Concluída - Reler' : currentTab ? 'Continuar leitura' : 'Iniciar leitura'}
      </Button>
    </Card>
  );
}
