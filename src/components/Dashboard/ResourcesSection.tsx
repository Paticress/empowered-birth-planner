
import { BookOpen, FileText, Award, ShoppingBag } from "lucide-react";
import { Card } from "@/components/ui/card";
import { useNavigation } from "@/hooks/useNavigation";
import { useAuth } from "@/contexts/AuthContext";
import { useBirthPlanAccess } from "@/hooks/useBirthPlanAccess";

export function ResourcesSection() {
  const { navigateTo } = useNavigation();
  const { isAuthenticated } = useAuth();
  const isFullAccessUser = useBirthPlanAccess();
  
  const handleBirthPlanClick = () => {
    if (isAuthenticated && isFullAccessUser) {
      navigateTo('/criar-plano');
    } else {
      // Redirect LEADs to the Wix landing page
      window.location.href = "https://www.energiamaterna.com.br/criar-meu-plano-de-parto-em-minutos";
    }
  };
  
  return (
    <>
      <h2 className="text-2xl font-bold text-maternal-900 mb-4">Explore nossos recursos</h2>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card 
          className="p-5 border border-maternal-100 cursor-pointer transition-all hover:shadow-md"
          onClick={() => navigateTo('/guia-online')}
        >
          <div className="flex items-center mb-3">
            <BookOpen className="h-5 w-5 text-maternal-600 mr-2" />
            <h3 className="font-semibold text-maternal-900">Guia Online</h3>
          </div>
          <p className="text-sm text-maternal-700">
            {isAuthenticated 
              ? "Acesse nosso guia completo sobre seus direitos e opções para um parto respeitoso."
              : "Informações completas sobre seus direitos e opções para um parto respeitoso."}
          </p>
        </Card>
        
        <Card 
          className="p-5 border border-maternal-100 cursor-pointer transition-all hover:shadow-md"
          onClick={handleBirthPlanClick}
        >
          <div className="flex items-center mb-3">
            <FileText className="h-5 w-5 text-maternal-600 mr-2" />
            <h3 className="font-semibold text-maternal-900">Construtor de Plano</h3>
          </div>
          <p className="text-sm text-maternal-700">
            {isAuthenticated && isFullAccessUser
              ? "Crie e edite seu plano de parto personalizado para compartilhar com sua equipe médica."
              : "Crie seu plano de parto personalizado para compartilhar com sua equipe médica."}
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
        
        <Card 
          className="p-5 border border-maternal-100 cursor-pointer transition-all hover:shadow-md"
          onClick={() => window.open('https://www.energiamaterna.com.br/especiais', '_blank')}
        >
          <div className="flex items-center mb-3">
            <ShoppingBag className="h-5 w-5 text-maternal-600 mr-2" />
            <h3 className="font-semibold text-maternal-900">Produtos Especiais</h3>
          </div>
          <p className="text-sm text-maternal-700">
            Conheça nossos produtos especiais para o período gestacional e pós-parto.
          </p>
        </Card>
      </div>
    </>
  );
}
