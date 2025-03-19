
import { Button } from '@/components/ui/button';
import { ArrowLeft, BookOpen, Download, FileText, BookHeart, Notebook, Calendar, ShoppingCart, CheckCircle, Shield } from 'lucide-react';
import { useState } from 'react';
import { toast } from '@/hooks/use-toast';
import { ResourceCard } from './ResourceCard';
import { ProceduresGuide } from './ProceduresGuide';
import { ProductCard } from './ProductCard';
import { ConsultationSection } from './ConsultationSection';
import { BirthPlanNavButton } from '../BirthPlan/NavButton';

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
      
      {/* Enhanced Birth Plan Builder CTA Section */}
      <div className="bg-gradient-to-r from-maternal-100 to-maternal-50 p-6 rounded-xl border border-maternal-200 mb-8 shadow-md">
        <div className="flex flex-col md:flex-row items-center justify-between">
          <div className="mb-6 md:mb-0 md:mr-6 md:w-2/3">
            <h2 className="text-2xl font-bold text-maternal-800 mb-3">
              Crie seu Plano de Parto Personalizado
            </h2>
            <p className="text-maternal-700 mb-4">
              Um plano de parto bem estruturado aumenta suas chances de ter uma experiência de parto positiva e respeitosa. 
              Nosso construtor de plano de parto facilita esse processo com:
            </p>
            <ul className="space-y-2 mb-4">
              <li className="flex items-center">
                <CheckCircle className="h-5 w-5 text-maternal-600 mr-2 flex-shrink-0" />
                <span>Questionário personalizado que identifica suas preferências</span>
              </li>
              <li className="flex items-center">
                <CheckCircle className="h-5 w-5 text-maternal-600 mr-2 flex-shrink-0" />
                <span>Modelos profissionais baseados nas melhores práticas</span>
              </li>
              <li className="flex items-center">
                <CheckCircle className="h-5 w-5 text-maternal-600 mr-2 flex-shrink-0" />
                <span>Editor intuitivo para personalizar cada detalhe</span>
              </li>
              <li className="flex items-center">
                <Shield className="h-5 w-5 text-maternal-600 mr-2 flex-shrink-0" />
                <span>Documentação reconhecida por equipes médicas</span>
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
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <ResourceCard 
            title="Modelo de Plano de Parto"
            description="Um modelo pronto para usar como base para o seu plano de parto, já estruturado com todas as seções importantes."
            icon={<FileText className="h-6 w-6 text-maternal-600" />}
            isActive={activeResource === 'template'}
            buttonText="Adquirir Modelo"
            buttonIcon={<ShoppingCart className="mr-2 h-4 w-4" />}
            buttonVariant="resource-highlight"
            onClick={() => handleResourceClick('template')}
            onButtonClick={() => window.open('https://www.energiamaterna.com.br/challenge-page/personalize-seu-plano-de-parto', '_blank')}
          />
          
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
        
        {/* Exibição do Guia de Procedimentos quando clicado */}
        {showProceduresGuide && <ProceduresGuide onClose={() => setShowProceduresGuide(false)} />}
        
        {/* Consulta Acolhedora */}
        <ConsultationSection />
        
        {/* Products Section */}
        <h2 className="text-2xl font-semibold text-maternal-800 mt-10 mb-6">Produtos para sua Jornada Materna</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <ProductCard 
            title="Meu Diário da Maternidade"
            subtitle="Registre memórias e sentimentos"
            description="Este diário foi criado para você registrar suas memórias, sentimentos e aprendizados, criando uma lembrança afetiva desse período tão especial. Escreva, reflita e celebre cada passo do seu caminho."
            buttonText="Conhecer Diário"
            buttonIcon={<BookHeart className="mr-2 h-4 w-4" />}
            url="https://www.energiamaterna.com.br/especiais/diario-da-maternidade"
          />
          
          <ProductCard 
            title="Afirmações para um Parto Positivo"
            subtitle="64 afirmações poderosas"
            description="eBook com 64 afirmações poderosas para nutrir sua confiança ao longo da gestação, trazer leveza ao momento do nascimento e fortalecer sua conexão com seu bebê. Deixe que essas palavras te guiem em cada etapa dessa experiência única."
            buttonText="Obter eBook"
            buttonIcon={<BookOpen className="mr-2 h-4 w-4" />}
            url="https://www.energiamaterna.com.br/especiais/afirmacoes-para-um-parto-positivo"
          />
          
          <ProductCard 
            title="Caderno de Bem-Estar"
            subtitle="Seu refúgio para autocuidado"
            description="Este caderno foi pensado para ser seu refúgio: um espaço para se expressar, aliviar a mente e reencontrar seu equilíbrio. Cuide de você, porque estar bem consigo mesma é vital para cuidar de quem ama."
            buttonText="Adquirir Caderno"
            buttonIcon={<Notebook className="mr-2 h-4 w-4" />}
            url="https://www.energiamaterna.com.br/especiais/caderno-de-bem-estar"
          />
        </div>
        
        <h2 className="text-2xl font-semibold text-maternal-800 mt-10 mb-4">Próximos Passos</h2>
        
        <p className="mb-4">
          Agora que você conhece os elementos essenciais de um plano de parto, recomendamos:
        </p>
        
        <ol className="list-decimal pl-5 space-y-2 mb-6">
          <li>Utilize nosso construtor de plano de parto para criar um documento personalizado</li>
          <li>Converse com seu parceiro/acompanhante sobre suas preferências</li>
          <li>Discuta seu plano de parto com seu médico/obstetra na próxima consulta</li>
          <li>Faça ajustes conforme necessário após essa conversa</li>
          <li>Imprima várias cópias e leve para o hospital no dia do parto</li>
        </ol>
        
        <div className="bg-maternal-50 border border-maternal-200 rounded-lg p-6 mt-6 mb-8">
          <h3 className="text-xl font-semibold text-maternal-800 mb-3">
            Comece agora mesmo!
          </h3>
          <p className="mb-4">
            Nosso construtor de plano de parto guiará você em todo o processo, gerando um documento personalizado baseado em suas preferências.
          </p>
          <div className="flex justify-center">
            <BirthPlanNavButton className="py-6" />
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
