
import { Button } from '@/components/ui/button';
import { useNavigation } from '@/hooks/useNavigation';
import { FileText, RefreshCw } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useBirthPlanAccess } from '@/hooks/useBirthPlanAccess';
import { useState } from 'react';
import { toast } from 'sonner';

interface NavButtonProps {
  className?: string;
  source?: 'guide' | 'purchase';
}

export function BirthPlanNavButton({ className = '', source }: NavButtonProps) {
  const { navigateTo } = useNavigation();
  const { isAuthenticated } = useAuth();
  const { hasBirthPlanAccess, refreshPlanStatus, isRefreshing } = useBirthPlanAccess();
  const [showRefreshTip, setShowRefreshTip] = useState(false);
  
  const goToBirthPlanAccess = () => {
    if (!isAuthenticated) {
      // If not authenticated, direct to login with the source parameter
      if (source) {
        navigateTo(`/acesso-plano?from=${source}`);
      } else {
        navigateTo('/acesso-plano');
      }
    } else if (!hasBirthPlanAccess) {
      // If authenticated but doesn't have birth plan access
      if (showRefreshTip) {
        // If showing refresh tip, check status first
        refreshPlanStatus().then(
          () => {
            const currentPlan = localStorage.getItem('user_plan');
            if (currentPlan === 'paid') {
              toast.success("Acesso ao plano atualizado! Redirecionando...");
              setTimeout(() => navigateTo('/criar-plano'), 1000);
            } else {
              // Open Wix landing page in a new tab
              window.open("https://www.energiamaterna.com.br/criar-meu-plano-de-parto-em-minutos", '_blank');
              setShowRefreshTip(false);
            }
          }
        );
      } else {
        // First time, just set flag to show refresh tip next time
        setShowRefreshTip(true);
        // Open Wix landing page in a new tab
        window.open("https://www.energiamaterna.com.br/criar-meu-plano-de-parto-em-minutos", '_blank');
      }
    } else {
      // If authenticated and has birth plan access, follow normal flow
      navigateTo('/criar-plano');
    }
  };
  
  return (
    <>
      <Button 
        onClick={goToBirthPlanAccess}
        variant="birth-plan-builder"
        className={`flex items-center font-semibold ${className}`}
        disabled={isRefreshing}
      >
        {isRefreshing ? (
          <RefreshCw className="mr-2 h-5 w-5 animate-spin" />
        ) : (
          <FileText className="mr-2 h-5 w-5" />
        )}
        Criar Meu Plano de Parto
      </Button>
      
      {showRefreshTip && !hasBirthPlanAccess && (
        <div className="text-xs text-maternal-600 mt-1 text-center">
          <button 
            onClick={(e) => {
              e.stopPropagation();
              refreshPlanStatus().then(() => {
                const currentPlan = localStorage.getItem('user_plan');
                if (currentPlan === 'paid') {
                  toast.success("Acesso ao plano atualizado! Redirecionando...");
                  setTimeout(() => navigateTo('/criar-plano'), 1000);
                } else {
                  toast.info("Você ainda não tem acesso ao plano premium");
                }
              });
            }}
            className="underline inline-flex items-center gap-1"
          >
            <RefreshCw className="h-3 w-3" /> 
            {isRefreshing ? "Verificando..." : "Comprou recentemente? Clique para verificar seu acesso"}
          </button>
        </div>
      )}
    </>
  );
}
