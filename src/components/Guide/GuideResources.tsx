import { Button } from '@/components/ui/button';
import { 
  ArrowLeft, 
  BookOpen, 
  Download, 
  BookHeart, 
  Notebook, 
  Calendar, 
  CheckCircle, 
  Shield, 
  Edit, 
  MessageCircle, 
  FileEdit, 
  Printer, 
  Share2 
} from 'lucide-react';
import { useState } from 'react';
import { toast } from '@/hooks/use-toast';
import { ResourceCard } from './ResourceCard';
import { ProceduresGuide } from './ProceduresGuide';
import { ProductCard } from './ProductCard';
import { ConsultationSection } from './ConsultationSection';
import { BirthPlanNavButton } from '../BirthPlan/NavButton';
import { StepCard } from './StepCard';
import { Card, CardContent } from '@/components/ui/card';

interface GuideResourcesProps {
  onPrevious: () => void;
}

export function GuideResources({ onPrevious }: GuideResourcesProps) {
  const [activeResource, setActiveResource] = useState<string | null>(null);
  const [showProceduresGuide, setShowProceduresGuide] = useState(false);

  const handleResourceClick = (resource: string) => {
    if (resource === 'checklist') {
      setShowProceduresGuide(!showProceduresGuide);
    } else {
      setActiveResource(resource === activeResource ? null : resource);
    }
  };

  const handleDownload = (resourceName: string) => {
    toast({
      title: "Download Iniciado",
      description: `O recurso "${resourceName}" está sendo baixado.`,
    });
    
    // In a real application, this would trigger an actual download
    setTimeout(() => {
      toast({
        title: "Download Concluído",
        description: "O arquivo foi baixado com sucesso.",
      });
    }, 1500);
  };

  return (
    <div className="animate-fade-in">
      <h1 className="text-3xl font-bold text-maternal-900 mb-6">Recursos Adicionais</h1>
      
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
              <p className="text-maternal-900 font-bold text-3xl mb-4">R$ 97,00</p>
            </div>
            <BirthPlanNavButton className="w-full py-4" />
          </div>
        </div>
      </div>
      
      <div className="prose max-w-none">
        <p className="text-lg mb-6">
          Confira também estes recursos adicionais para aprofundar ainda mais seus conhecimentos sobre o plano de parto.
        </p>
        
        <div className="mb-8">
          <ResourceCard 
            title="Guia de Procedimentos"
            description="Glossário com explicações sobre os procedimentos mais comuns do parto, para você entender melhor suas opções."
            icon={<BookOpen className="h-6 w-6 text-maternal-600" />}
            isActive={activeResource === 'checklist'}
            buttonText="Visualizar Guia"
            buttonIcon={<BookOpen className="mr-2 h-4 w-4" />}
            buttonVariant="resource"
            onClick={() => handleResourceClick('checklist')}
            onButtonClick={(e) => {
              e.stopPropagation();
              handleDownload('Guia de Procedimentos');
              setShowProceduresGuide(true);
            }}
          />
        </div>
        
        {showProceduresGuide && <ProceduresGuide onClose={() => setShowProceduresGuide(false)} />}
        
        <ConsultationSection />
        
        <h2 className="text-2xl font-semibold text-maternal-800 mt-10 mb-6">Produtos para sua Jornada Materna</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <div className="bg-white border border-maternal-200 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-all duration-300">
            <div className="h-64 overflow-hidden">
              <img 
                src="/lovable-uploads/6b2f6105-ec41-413d-bd52-f974c7aba5ce.png" 
                alt="Capa do Diário da Maternidade" 
                className="w-full h-full object-cover"
              />
            </div>
            <div className="p-5">
              <h3 className="text-xl font-semibold text-maternal-800 mb-1">Meu Diário da Maternidade</h3>
              <p className="text-maternal-600 text-sm mb-3">Registre memórias e sentimentos</p>
              <p className="text-maternal-700 mb-4 text-sm">
                Este diário foi criado para você registrar suas memórias, sentimentos e aprendizados, criando uma lembrança afetiva desse período tão especial. Escreva, reflita e celebre cada passo do seu caminho.
              </p>
              <Button 
                variant="resource"
                className="w-full"
                onClick={() => window.open("https://www.energiamaterna.com.br/especiais/diario-da-maternidade", "_blank")}
              >
                <BookHeart className="mr-2 h-4 w-4" /> Conhecer Diário
              </Button>
            </div>
          </div>
          
          <div className="bg-white border border-maternal-200 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-all duration-300">
            <div className="h-64 overflow-hidden">
              <img 
                src="/lovable-uploads/fd7784b0-3d05-498e-a352-ea4c018d70b4.png" 
                alt="Introdução do eBook de Afirmações Positivas" 
                className="w-full h-full object-cover"
              />
            </div>
            <div className="p-5">
              <h3 className="text-xl font-semibold text-maternal-800 mb-1">Afirmações para um Parto Positivo</h3>
              <p className="text-maternal-600 text-sm mb-3">64 afirmações poderosas</p>
              <p className="text-maternal-700 mb-4 text-sm">
                eBook com 64 afirmações poderosas para nutrir sua confiança ao longo da gestação, trazer leveza ao momento do nascimento e fortalecer sua conexão com seu bebê. Deixe que essas palavras te guiem em cada etapa dessa experiência única.
              </p>
              <Button 
                variant="resource"
                className="w-full"
                onClick={() => window.open("https://www.energiamaterna.com.br/especiais/afirmacoes-para-um-parto-positivo", "_blank")}
              >
                <BookOpen className="mr-2 h-4 w-4" /> Obter eBook
              </Button>
            </div>
          </div>
          
          <div className="bg-white border border-maternal-200 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-all duration-300">
            <div className="h-64 overflow-hidden">
              <img 
                src="/lovable-uploads/88664f99-92f8-4a42-b203-a96d63ecbe3d.png" 
                alt="Capa do Caderno de Bem-Estar" 
                className="w-full h-full object-cover"
              />
            </div>
            <div className="p-5">
              <h3 className="text-xl font-semibold text-maternal-800 mb-1">Caderno de Bem-Estar</h3>
              <p className="text-maternal-600 text-sm mb-3">Seu refúgio para autocuidado</p>
              <p className="text-maternal-700 mb-4 text-sm">
                Este caderno foi pensado para ser seu refúgio: um espaço para se expressar, aliviar a mente e reencontrar seu equilíbrio. Cuide de você, porque estar bem consigo mesma é vital para cuidar de quem ama.
              </p>
              <Button 
                variant="resource"
                className="w-full"
                onClick={() => window.open("https://www.energiamaterna.com.br/especiais/caderno-de-bem-estar", "_blank")}
              >
                <Notebook className="mr-2 h-4 w-4" /> Adquirir Caderno
              </Button>
            </div>
          </div>
        </div>
        
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
                src="https://images.unsplash.com/photo-1581091226825-a6a2a5aee158" 
                alt="Gestante usando computador para criar plano de parto" 
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
      </div>
      
      <div className="mt-8">
        <Button 
          variant="navigation"
          onClick={onPrevious}
          className="flex items-center"
        >
          <ArrowLeft className="mr-2 h-4 w-4" /> Voltar ao Checklist
        </Button>
      </div>
    </div>
  );
}
