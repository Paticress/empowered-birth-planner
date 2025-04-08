
import { useAuth } from "@/contexts/AuthContext";

interface DashboardHeaderProps {
  greeting: string;
  guideProgress: number;
  birthPlanProgress: number;
  lastVisited: string | null;
  isGuideCompleted: boolean;
  isBirthPlanCompleted: boolean;
}

export function DashboardHeader({ 
  greeting, 
  guideProgress, 
  birthPlanProgress, 
  lastVisited,
  isGuideCompleted,
  isBirthPlanCompleted 
}: DashboardHeaderProps) {
  const { user } = useAuth();
  
  // Get personalized encouragement message based on progress
  const getEncouragementMessage = () => {
    // User completed everything
    if (isGuideCompleted && isBirthPlanCompleted) {
      return "Parabéns por concluir todo o conteúdo! Você está totalmente preparada para o seu parto respeitoso.";
    }
    
    // User made good progress
    if (guideProgress > 50 && birthPlanProgress > 50) {
      return "Você está fazendo um excelente progresso na sua jornada para um parto respeitoso.";
    }
    
    // User is working on guide but hasn't started birth plan
    if (guideProgress > 0 && birthPlanProgress === 0) {
      return "Continue com a leitura do guia e depois crie seu plano de parto personalizado.";
    }
    
    // User has begun birth plan
    if (birthPlanProgress > 0 && birthPlanProgress < 100) {
      return "Continue desenvolvendo seu plano de parto para se preparar adequadamente.";
    }
    
    // User recently started (low progress on both)
    if (guideProgress > 0 || birthPlanProgress > 0) {
      return "Você começou bem! Continue explorando nosso conteúdo para se preparar para o parto.";
    }
    
    // New user with no progress
    return "Bem-vinda à sua jornada para um parto respeitoso e informado.";
  };
  
  // Get the first name from the email, or use a generic greeting
  const getPersonalizedName = () => {
    if (user?.email) {
      const name = user.email.split('@')[0];
      // Capitalize first letter
      return name.charAt(0).toUpperCase() + name.slice(1);
    }
    return '';
  };
  
  const personalizedName = getPersonalizedName();
  const encouragementMessage = getEncouragementMessage();
  
  return (
    <div className="mb-8">
      <h1 className="text-3xl font-bold text-maternal-900">
        {greeting}{personalizedName ? `, ${personalizedName}` : ''}!
      </h1>
      <p className="text-maternal-700 mt-2">
        {encouragementMessage}
      </p>
    </div>
  );
}
