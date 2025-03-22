
import { CheckCircle, Shield } from 'lucide-react';
import { BirthPlanNavButton } from '../BirthPlan/NavButton';
import { useIsMobile } from '@/hooks/use-mobile';

export function BirthPlanCTA() {
  const isMobile = useIsMobile();
  
  return (
    <div className="bg-gradient-to-r from-maternal-100 to-maternal-50 p-4 md:p-6 rounded-xl border border-maternal-200 mb-8 shadow-md">
      <div className="flex flex-col md:flex-row items-center justify-between">
        <div className="mb-6 md:mb-0 md:mr-6 md:w-2/3">
          <h2 className={`${isMobile ? 'text-xl' : 'text-2xl'} font-bold text-maternal-800 mb-3`}>
            Crie seu Plano de Parto em Minutos
          </h2>
          <p className="text-maternal-700 mb-4 text-sm md:text-base">
            Nosso construtor de plano de parto simplifica todo o processo - em apenas alguns passos rápidos, 
            você terá um documento profissional pronto para compartilhar com toda sua equipe médica:
          </p>
          <ul className="space-y-2 mb-4 text-sm md:text-base">
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
            <span className="inline-block bg-maternal-400 text-white text-xs md:text-sm font-bold px-3 py-1 rounded-full mb-2">
              Recomendado por Especialistas
            </span>
            <h3 className="text-lg md:text-xl font-bold text-maternal-900">Construtor de Plano de Parto</h3>
            <p className="text-maternal-700 text-base md:text-lg mb-2">Acesso Único</p>
            <p className="text-maternal-900 font-bold text-2xl md:text-3xl mb-4">R$ 97,00</p>
          </div>
          <BirthPlanNavButton className={`w-full py-3 ${isMobile ? 'text-sm' : 'text-base'}`} />
        </div>
      </div>
    </div>
  );
}
