
import { Edit, Share2, MessageCircle, FileEdit, Printer } from 'lucide-react';
import { StepCard } from './StepCard';
import { BirthPlanNavButton } from '../BirthPlan/NavButton';

export function NextStepsSection() {
  return (
    <>
      <h2 className="text-2xl font-semibold text-maternal-800 mt-10 mb-6">Próximos Passos</h2>
      
      <p className="mb-6">
        Agora que você conhece os elementos essenciais de um plano de parto, recomendamos:
      </p>
      
      <div className="grid gap-4 mb-8">
        <StepCard 
          stepNumber={1}
          title="Crie seu plano rapidamente"
          description="Use nosso construtor para criar seu plano de parto completo em apenas 5 minutos."
          icon={Edit}
        />
        
        <StepCard 
          stepNumber={2}
          title="Compartilhe com seu parceiro/acompanhante"
          description="Envie facilmente por e-mail ou WhatsApp para que todos estejam alinhados."
          icon={Share2}
        />
        
        <StepCard 
          stepNumber={3}
          title="Discuta com seu médico/obstetra"
          description="Leve seu plano para a próxima consulta e converse sobre suas preferências."
          icon={MessageCircle}
        />
        
        <StepCard 
          stepNumber={4}
          title="Faça os ajustes necessários"
          description="Atualize seu plano após conversar com a equipe médica para garantir alinhamento."
          icon={FileEdit}
        />
        
        <StepCard 
          stepNumber={5}
          title="Imprima cópias para o dia do parto"
          description="Leve várias cópias impressas para entregar na maternidade."
          icon={Printer}
        />
      </div>
      
      <div className="bg-maternal-50 border border-maternal-200 rounded-lg p-6 mt-6 mb-8">
        <div className="flex flex-col md:flex-row items-center gap-6">
          <div className="md:w-1/3">
            <img 
              src="https://images.unsplash.com/photo-1649972904349-6e44c42644a7" 
              alt="Gestante relaxando em casa usando o celular para criar plano de parto" 
              className="rounded-xl shadow-md object-cover w-full h-auto"
            />
          </div>
          <div className="md:w-2/3">
            <h3 className="text-xl font-semibold text-maternal-800 mb-3">
              Pronta para criar seu plano em minutos?
            </h3>
            <p className="mb-4">
              Não perca tempo tentando fazer tudo do zero! Nosso construtor simplifica todo o processo, desde a criação até o compartilhamento.
            </p>
            <div className="flex justify-center md:justify-start">
              <BirthPlanNavButton className="py-6 px-8 text-base" />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
