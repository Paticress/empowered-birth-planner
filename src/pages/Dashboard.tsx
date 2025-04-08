
import { useEffect, useState } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useNavigation } from "@/hooks/useNavigation";
import { Clock, BookOpen, FileText, Award, ChevronRight, CheckCircle2, Circle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { useIsMobile } from "@/hooks/use-mobile";

export function Dashboard() {
  const { user, isLoading } = useAuth();
  const { navigateTo } = useNavigation();
  const [lastVisited, setLastVisited] = useState<string | null>(null);
  const [hasStartedBirthPlan, setHasStartedBirthPlan] = useState(false);
  const [birthPlanProgress, setBirthPlanProgress] = useState(0);
  const [guideProgress, setGuideProgress] = useState(0);
  const [currentGuideTab, setCurrentGuideTab] = useState<string | null>(null);
  const isMobile = useIsMobile();
  
  // Guide sections in order
  const guideSections = [
    { id: "introduction", name: "Introdução" },
    { id: "structure", name: "Estrutura" },
    { id: "rights", name: "Direitos" },
    { id: "communication", name: "Comunicação" },
    { id: "checklist", name: "Checklist" },
    { id: "resources", name: "Recursos" }
  ];
  
  // Birth plan stages in order
  const birthPlanStages = [
    { id: "welcome", name: "Início" },
    { id: "questionnaire", name: "Questionário" },
    { id: "editor", name: "Editor" },
    { id: "preview", name: "Visualização" },
    { id: "share", name: "Compartilhamento" }
  ];
  
  useEffect(() => {
    // Check local storage for last visited page
    const lastPage = localStorage.getItem('last-visited-page');
    setLastVisited(lastPage);
    
    // Check if user has started birth plan and its progress
    const birthPlanData = localStorage.getItem('birthPlanData');
    setHasStartedBirthPlan(!!birthPlanData);
    
    if (birthPlanData) {
      try {
        const data = JSON.parse(birthPlanData);
        // Count filled sections to determine progress
        let filledSections = 0;
        let totalSections = 0;
        
        Object.keys(data).forEach(section => {
          if (typeof data[section] === 'object' && data[section] !== null) {
            const sectionFields = Object.keys(data[section]).length;
            if (sectionFields > 0) filledSections++;
            totalSections++;
          }
        });
        
        const progress = totalSections > 0 ? (filledSections / totalSections) * 100 : 0;
        setBirthPlanProgress(progress);
      } catch (e) {
        console.error("Error parsing birth plan data:", e);
        setBirthPlanProgress(0);
      }
    }
    
    // Check guide progress
    const guideTab = localStorage.getItem('guide-current-tab');
    setCurrentGuideTab(guideTab);
    
    if (guideTab) {
      const tabIndex = guideSections.findIndex(section => section.id === guideTab);
      if (tabIndex !== -1) {
        const progress = ((tabIndex + 1) / guideSections.length) * 100;
        setGuideProgress(progress);
      }
    }
    
    // Store current page as last visited
    localStorage.setItem('last-visited-page', '/dashboard');
  }, []);
  
  const getWelcomeMessage = () => {
    const currentHour = new Date().getHours();
    
    if (currentHour < 12) {
      return "Bom dia";
    } else if (currentHour < 18) {
      return "Boa tarde";
    } else {
      return "Boa noite";
    }
  };
  
  const getRecommendedNextStep = () => {
    if (!currentGuideTab) {
      return {
        title: "Conheça o Guia do Parto Respeitoso",
        description: "Leia nosso guia completo com informações importantes sobre o parto.",
        path: "/guia-online",
        icon: BookOpen
      };
    } else if (guideProgress < 100) {
      const currentIndex = guideSections.findIndex(section => section.id === currentGuideTab);
      const nextSectionName = currentIndex < guideSections.length - 1 
        ? guideSections[currentIndex + 1].name 
        : "restantes";
      
      return {
        title: `Continue a leitura do Guia`,
        description: `Continue de onde parou na seção "${nextSectionName}".`,
        path: "/guia-online",
        icon: BookOpen
      };
    } else if (!hasStartedBirthPlan) {
      return {
        title: "Crie seu Plano de Parto",
        description: "Comece a criar seu plano de parto personalizado com nosso construtor.",
        path: "/criar-plano",
        icon: FileText
      };
    } else {
      return {
        title: "Continue seu Plano de Parto",
        description: "Retome de onde parou na criação do seu plano de parto.",
        path: "/criar-plano",
        icon: ChevronRight
      };
    }
  };
  
  const recommendedStep = getRecommendedNextStep();
  
  // Check if guide is completed
  const isGuideCompleted = guideProgress >= 100;
  
  // Check if birth plan is completed
  const isBirthPlanCompleted = birthPlanProgress >= 100;
  
  // Get section specific URL for guide sections
  const getGuideSectionUrl = (sectionId: string) => {
    return `/guia-online?tab=${sectionId}`;
  };
  
  // Get stage specific URL for birth plan
  const getBirthPlanStageUrl = (stageId: string) => {
    return `/criar-plano?stage=${stageId}`;
  };
  
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow pt-20 bg-maternal-50">
        <div className="container max-w-5xl mx-auto px-4 py-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-maternal-900">
              {getWelcomeMessage()}{user?.email ? `, ${user.email.split('@')[0]}` : ''}!
            </h1>
            <p className="text-maternal-700 mt-2">
              Bem-vinda à sua jornada para um parto respeitoso e informado.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
            <Card className="p-6 bg-white border border-maternal-100">
              <div className="flex items-start">
                <div className="bg-maternal-100 p-3 rounded-full mr-4">
                  {recommendedStep.icon && <recommendedStep.icon className="h-6 w-6 text-maternal-600" />}
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
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
            <Card className="p-6 bg-white border border-maternal-100">
              <h2 className="text-xl font-semibold text-maternal-900 mb-4 flex items-center">
                <BookOpen className="h-5 w-5 mr-2 text-maternal-600" /> Guia do Parto Respeitoso
              </h2>
              
              <div className="space-y-2">
                {guideSections.map((section, index) => {
                  const isCompleted = currentGuideTab && 
                    guideSections.findIndex(s => s.id === currentGuideTab) >= index;
                  
                  return (
                    <div 
                      key={section.id} 
                      className={`flex items-center ${isCompleted ? 'cursor-pointer hover:bg-maternal-50 transition-colors rounded py-1 px-1' : ''}`}
                      onClick={isCompleted ? () => navigateTo(getGuideSectionUrl(section.id)) : undefined}
                    >
                      {isCompleted ? (
                        <CheckCircle2 className="h-5 w-5 mr-3 text-green-500" />
                      ) : (
                        <Circle className="h-5 w-5 mr-3 text-gray-300" />
                      )}
                      <span className={isCompleted ? 'text-maternal-900' : 'text-maternal-600'}>
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
                {isGuideCompleted ? 'Leitura Concluída - Reler' : currentGuideTab ? 'Continuar leitura' : 'Iniciar leitura'}
              </Button>
            </Card>
            
            <Card className="p-6 bg-white border border-maternal-100">
              <h2 className="text-xl font-semibold text-maternal-900 mb-4 flex items-center">
                <FileText className="h-5 w-5 mr-2 text-maternal-600" /> Plano de Parto
              </h2>
              
              <div className="space-y-2">
                {birthPlanStages.map((stage, index) => {
                  // Estimate completion based on birth plan progress
                  const isCompleted = hasStartedBirthPlan && 
                    (birthPlanProgress > (index * (100 / birthPlanStages.length)));
                    
                  return (
                    <div 
                      key={stage.id} 
                      className={`flex items-center ${isCompleted ? 'cursor-pointer hover:bg-maternal-50 transition-colors rounded py-1 px-1' : ''}`}
                      onClick={isCompleted ? () => navigateTo(getBirthPlanStageUrl(stage.id)) : undefined}
                    >
                      {isCompleted ? (
                        <CheckCircle2 className="h-5 w-5 mr-3 text-green-500" />
                      ) : (
                        <Circle className="h-5 w-5 mr-3 text-gray-300" />
                      )}
                      <span className={isCompleted ? 'text-maternal-900' : 'text-maternal-600'}>
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
                {isBirthPlanCompleted ? 'Plano Concluído - Revisar' : hasStartedBirthPlan ? 'Continuar plano' : 'Criar plano de parto'}
              </Button>
            </Card>
          </div>
          
          <h2 className="text-2xl font-bold text-maternal-900 mb-4">Explore nossos recursos</h2>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <Card 
              className="p-5 border border-maternal-100 cursor-pointer transition-all hover:shadow-md"
              onClick={() => navigateTo('/guia-online')}
            >
              <div className="flex items-center mb-3">
                <BookOpen className="h-5 w-5 text-maternal-600 mr-2" />
                <h3 className="font-semibold text-maternal-900">Guia Online</h3>
              </div>
              <p className="text-sm text-maternal-700">
                Informações completas sobre seus direitos e opções para um parto respeitoso.
              </p>
            </Card>
            
            <Card 
              className="p-5 border border-maternal-100 cursor-pointer transition-all hover:shadow-md"
              onClick={() => navigateTo('/criar-plano')}
            >
              <div className="flex items-center mb-3">
                <FileText className="h-5 w-5 text-maternal-600 mr-2" />
                <h3 className="font-semibold text-maternal-900">Construtor de Plano</h3>
              </div>
              <p className="text-sm text-maternal-700">
                Crie seu plano de parto personalizado para compartilhar com sua equipe médica.
              </p>
            </Card>
            
            <Card 
              className="p-5 border border-maternal-100 cursor-pointer transition-all hover:shadow-md"
              onClick={() => window.open('https://www.energiamaterna.com.br/programas', '_blank')}
            >
              <div className="flex items-center mb-3">
                <Award className="h-5 w-5 text-maternal-600 mr-2" />
                <h3 className="font-semibold text-maternal-900">Curso Gestando</h3>
              </div>
              <p className="text-sm text-maternal-700">
                Conheça nosso curso completo para gestantes com informações detalhadas.
              </p>
            </Card>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
