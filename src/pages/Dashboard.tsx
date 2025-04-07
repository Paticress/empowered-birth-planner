
import { useEffect, useState } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useNavigation } from "@/hooks/useNavigation";
import { Clock, BookOpen, FileText, Award, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export function Dashboard() {
  const { user, isLoading } = useAuth();
  const { navigateTo } = useNavigation();
  const [lastVisited, setLastVisited] = useState<string | null>(null);
  const [hasStartedBirthPlan, setHasStartedBirthPlan] = useState(false);
  const [hasReadGuide, setHasReadGuide] = useState(false);
  
  useEffect(() => {
    // Check local storage for last visited page
    const lastPage = localStorage.getItem('last-visited-page');
    setLastVisited(lastPage);
    
    // Check if user has started birth plan
    const birthPlanData = localStorage.getItem('birthPlanData');
    setHasStartedBirthPlan(!!birthPlanData);
    
    // Check if user has visited the guide
    const guideTab = localStorage.getItem('guide-current-tab');
    setHasReadGuide(!!guideTab);
    
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
    if (!hasReadGuide) {
      return {
        title: "Conheça o Guia do Parto Respeitoso",
        description: "Leia nosso guia completo com informações importantes sobre o parto.",
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
                    {recommendedStep.title} <ChevronRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </div>
            </Card>
            
            <Card className="p-6 bg-white border border-maternal-100">
              <h2 className="text-xl font-semibold text-maternal-900 mb-4 flex items-center">
                <Clock className="h-5 w-5 mr-2 text-maternal-600" /> Seu progresso
              </h2>
              
              <div className="space-y-4">
                <div className="flex items-center">
                  <div className={`w-4 h-4 rounded-full mr-3 ${hasReadGuide ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                  <span className={hasReadGuide ? 'text-maternal-900' : 'text-maternal-600'}>
                    Leitura do Guia do Parto Respeitoso
                  </span>
                </div>
                
                <div className="flex items-center">
                  <div className={`w-4 h-4 rounded-full mr-3 ${hasStartedBirthPlan ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                  <span className={hasStartedBirthPlan ? 'text-maternal-900' : 'text-maternal-600'}>
                    Criação do Plano de Parto
                  </span>
                </div>
              </div>
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
