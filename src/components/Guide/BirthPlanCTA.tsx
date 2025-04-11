
import { CheckCircle, Shield, FileText } from 'lucide-react';
import { BirthPlanNavButton } from '../BirthPlan/NavButton';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { useNavigation } from '@/hooks/useNavigation';

export function BirthPlanCTA() {
  const { isAuthenticated } = useAuth();
  const { navigateTo } = useNavigation();

  // Se o usuário já está logado, mostrar interface diferente
  if (isAuthenticated) {
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

  // Versão original para visitantes não autenticados
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
              <CheckCircle className="h-5 w-5 text-maternal-600 mr-2 flex-shrink-0" />
              <span>Apenas <strong>5 minutos</strong> para criar um plano completo e personalizado</span>
            </li>
            <li className="flex items-center">
              <CheckCircle className="h-5 w-5 text-maternal-600 mr-2 flex-shrink-0" />
              <span>Compartilhe facilmente por <strong>WhatsApp, e-mail ou PDF</strong> com sua equipe</span>
            </li>
            <li className="flex items-center">
              <CheckCircle className="h-5 w-5 text-maternal-600 mr-2 flex-shrink-0" />
              <span>Interface intuitiva que <strong>elimina a confusão</strong> de criar do zero</span>
            </li>
            <li className="flex items-center">
              <Shield className="h-5 w-5 text-maternal-600 mr-2 flex-shrink-0" />
              <span>Formato respeitado por profissionais de saúde e maternidades</span>
            </li>
          </ul>
        </div>
        <div className="md:w-1/3 flex flex-col items-center">
          <div className="text-center mb-4">
            <span className="inline-block bg-maternal-400 text-white text-sm font-bold px-3 py-1 rounded-full mb-2">
              Recomendado por Especialistas
            </span>
            <h3 className="text-xl font-bold text-maternal-900">Construtor de Plano de Parto</h3>
            <p className="text-maternal-700 text-lg mb-2">Acesso Único</p>
            <p className="text-maternal-900 font-bold text-3xl mb-4">R$ 128,00</p>
          </div>
          <BirthPlanNavButton className="w-full py-4" />
        </div>
      </div>
    </div>
  );
}
