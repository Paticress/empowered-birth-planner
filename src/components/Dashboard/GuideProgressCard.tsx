
import { BookOpen, CheckCircle2, Circle } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useNavigation } from "@/hooks/useNavigation";

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
  
  const getGuideSectionUrl = (sectionId: string) => {
    return `/guia-online?tab=${sectionId}`;
  };
  
  return (
    <Card className="p-6 bg-white border border-maternal-100">
      <h2 className="text-xl font-semibold text-maternal-900 mb-4 flex items-center">
        <BookOpen className="h-5 w-5 mr-2 text-maternal-600" /> Guia do Parto Respeitoso
      </h2>
      
      <div className="space-y-2">
        {sections.map((section, index) => {
          const isCompletedSection = currentTab && 
            sections.findIndex(s => s.id === currentTab) >= index;
          
          return (
            <div 
              key={section.id} 
              className={`flex items-center ${isCompletedSection ? 'cursor-pointer hover:bg-maternal-50 transition-colors rounded py-1 px-1' : ''}`}
              onClick={isCompletedSection ? () => navigateTo(getGuideSectionUrl(section.id)) : undefined}
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
