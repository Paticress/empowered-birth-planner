
import { CheckCircle, Shield, FileText, Clock, Star, Book, Award, Percent } from 'lucide-react';
import { BirthPlanNavButton } from '../BirthPlan/NavButton';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { useNavigation } from '@/hooks/useNavigation';
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export function BirthPlanCTA() {
  const { isAuthenticated, user } = useAuth();
  const { navigateTo } = useNavigation();
  const [isFullAccessUser, setIsFullAccessUser] = useState<boolean | null>(null);
  
  // Check if the authenticated user has full access (is a Client, not just a Lead)
  useEffect(() => {
    const checkAccessLevel = async () => {
      if (!isAuthenticated || !user?.email) {
        setIsFullAccessUser(false);
        return;
      }
      
      try {
        const { data, error } = await supabase
          .from('users_db_birthplanbuilder')
          .select('email')
          .eq('email', user.email)
          .maybeSingle();
          
        setIsFullAccessUser(!error && !!data);
      } catch (error) {
        console.error("Error checking user access level:", error);
        setIsFullAccessUser(false);
      }
    };
    
    checkAccessLevel();
  }, [isAuthenticated, user]);

  // Se o usuário já é um Cliente (tem acesso completo), mostrar interface diferente
  if (isAuthenticated && isFullAccessUser) {
    return (
      <div className="bg-gradient-to-r from-green-50 to-maternal-50 p-6 rounded-xl border border-green-200 mb-8 shadow-md">
        <div className="flex flex-col md:flex-row items-center justify-between">
          <div className="mb-6 md:mb-0 md:mr-6 md:w-2/3">
            <h2 className="text-2xl font-bold text-maternal-800 mb-3">
              Construtor de Plano de Parto Disponível
            </h2>
            <p className="text-maternal-700 mb-4">
              Você já tem acesso completo ao construtor de plano de parto! Com essa ferramenta você pode:
            </p>
            <ul className="space-y-2 mb-4">
              <li className="flex items-center">
                <CheckCircle className="h-5 w-5 text-green-600 mr-2 flex-shrink-0" />
                <span>Criar um plano de parto personalizado em <strong>minutos</strong></span>
              </li>
              <li className="flex items-center">
                <CheckCircle className="h-5 w-5 text-green-600 mr-2 flex-shrink-0" />
                <span>Compartilhar facilmente com sua equipe médica</span>
              </li>
              <li className="flex items-center">
                <Shield className="h-5 w-5 text-green-600 mr-2 flex-shrink-0" />
                <span>Formato respeitado por profissionais de saúde</span>
              </li>
            </ul>
          </div>
          <div className="md:w-1/3 flex flex-col items-center">
            <Button 
              onClick={() => navigateTo('/criar-plano')}
              className="w-full py-4 bg-green-600 hover:bg-green-700 text-white"
            >
              <FileText className="mr-2 h-4 w-4" />
              Acessar Meu Construtor de Plano
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Versão para LEADs (usuários autenticados mas sem acesso completo) e Visitantes (não autenticados)
  return (
    <div className="bg-gradient-to-r from-maternal-100 to-maternal-50 p-6 rounded-xl border border-maternal-200 mb-8 shadow-md">
      <div className="flex flex-col md:flex-row items-center justify-between">
        <div className="mb-6 md:mb-0 md:mr-6 md:w-2/3">
          <h2 className="text-2xl font-bold text-maternal-800 mb-3">
            Crie seu Plano de Parto em Minutos
          </h2>
          <p className="text-maternal-700 mb-4">
            Nosso construtor de plano de parto simplifica todo o processo - em apenas alguns passos rápidos, 
            você terá um documento profissional pronto para compartilhar com toda sua equipe médica:
          </p>
          <ul className="space-y-2 mb-4">
            <li className="flex items-center">
              <Clock className="h-5 w-5 text-maternal-600 mr-2 flex-shrink-0" />
              <span>Crie um Plano de Parto <strong>do seu jeito em apenas 5 minutos</strong></span>
            </li>
            <li className="flex items-center">
              <Star className="h-5 w-5 text-maternal-600 mr-2 flex-shrink-0" />
              <span><strong>Construtor simplificado</strong>, não precisa começar do zero</span>
            </li>
            <li className="flex items-center">
              <CheckCircle className="h-5 w-5 text-maternal-600 mr-2 flex-shrink-0" />
              <span><strong>Compartilhe com sua equipe médica</strong> para garantir alinhamento</span>
            </li>
            <li className="flex items-center">
              <FileText className="h-5 w-5 text-maternal-600 mr-2 flex-shrink-0" />
              <span><strong>Faça quantos ajustes</strong> forem necessários de forma prática</span>
            </li>
            <li className="flex items-center">
              <Award className="h-5 w-5 text-maternal-600 mr-2 flex-shrink-0" />
              <span><strong>Imprima algumas cópias</strong> para levar com você no dia do parto</span>
            </li>
            <li className="flex items-center">
              <Book className="h-5 w-5 text-maternal-600 mr-2 flex-shrink-0" />
              <span><strong>Acesso ao Guia Online Gratuito</strong> incluído</span>
            </li>
            <li className="flex items-center">
              <Shield className="h-5 w-5 text-maternal-600 mr-2 flex-shrink-0" />
              <span>Formato respeitado por profissionais de saúde e maternidades</span>
            </li>
          </ul>
        </div>
        <div className="md:w-1/3 flex flex-col items-center bg-white p-4 rounded-lg shadow-sm border border-maternal-200">
          <div className="text-center mb-4 w-full">
            <span className="inline-block bg-maternal-400 text-white text-sm font-bold px-3 py-1 rounded-full mb-2">
              Recomendado por Especialistas
            </span>
            <h3 className="text-xl font-bold text-maternal-900">Construtor Virtual de Plano de Parto</h3>
            <p className="text-maternal-700 text-lg mb-2">Acesso Único</p>
            
            <div className="flex justify-center items-center gap-2 mb-2">
              <p className="text-maternal-600 text-lg font-medium line-through">R$ 128,00</p>
              <p className="text-maternal-900 font-bold text-3xl">R$ 76,80</p>
            </div>
            
            <div className="bg-yellow-100 border border-yellow-200 rounded-md p-2 mb-4 flex items-center justify-center">
              <Percent className="h-4 w-4 text-yellow-600 mr-1" />
              <span className="text-yellow-800 font-semibold text-sm">Cupom: OFFGUIA40 (-40%)</span>
            </div>
            
            <p className="text-maternal-600 text-xs mb-4">
              Oferta por tempo limitado para leitores do Guia
            </p>
          </div>
          <BirthPlanNavButton className="w-full py-4" source="guide" />
          <p className="text-maternal-500 text-xs mt-2 text-center">
            Pagamento único, sem assinaturas
          </p>
        </div>
      </div>
    </div>
  );
}
