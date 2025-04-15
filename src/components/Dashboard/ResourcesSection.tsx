
import { BookOpen, FileText, Award, ShoppingBag } from "lucide-react";
import { Card } from "@/components/ui/card";
import { useNavigation } from "@/hooks/useNavigation";
import { useAuth } from "@/contexts/AuthContext";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

export function ResourcesSection() {
  const { navigateTo } = useNavigation();
  const { isAuthenticated, user } = useAuth();
  const [hasBirthPlanAccess, setHasBirthPlanAccess] = useState<boolean | null>(null);
  
  // Check if the authenticated user has full access (is a Client, not just a Lead)
  useEffect(() => {
    const checkAccessLevel = async () => {
      if (!isAuthenticated || !user?.email) {
        setHasBirthPlanAccess(false);
        return;
      }
      
      // First check localStorage for cached plan value
      const cachedPlan = localStorage.getItem('user_plan');
      if (cachedPlan === 'paid') {
        setHasBirthPlanAccess(true);
        return;
      } else if (cachedPlan === 'free') {
        setHasBirthPlanAccess(false);
        return;
      }
      
      try {
        const { data, error } = await supabase
          .from('users_db_birthplanbuilder')
          .select('plan')
          .eq('email', user.email)
          .maybeSingle();
          
        const isPaidUser = !error && !!data && data.plan === 'paid';
        setHasBirthPlanAccess(isPaidUser);
        
        // Cache the result in localStorage
        localStorage.setItem('user_plan', isPaidUser ? 'paid' : 'free');
      } catch (error) {
        console.error("Error checking user access level:", error);
        setHasBirthPlanAccess(false);
      }
    };
    
    checkAccessLevel();
  }, [isAuthenticated, user]);
  
  const handleBirthPlanClick = () => {
    if (hasBirthPlanAccess) {
      // For CLIENT users, direct to birth plan builder
      navigateTo('/criar-plano');
    } else {
      // For LEAD users, direct to landing page
      navigateTo('/plano-personalizado');
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
            {isAuthenticated && hasBirthPlanAccess
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
