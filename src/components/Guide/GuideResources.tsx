
import { Button } from '@/components/ui/button';
import { ArrowLeft, BookOpen, Download, FileText, BookHeart, Notebook, Calendar, ShoppingCart, BookText } from 'lucide-react';
import { useState } from 'react';
import { toast } from '@/hooks/use-toast';
import { ResourceCard } from './ResourceCard';
import { ProceduresGuide } from './ProceduresGuide';
import { ProductCard } from './ProductCard';
import { ConsultationSection } from './ConsultationSection';

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
      
      <div className="prose max-w-none">
        <p className="text-lg mb-6">
          Confira estes recursos adicionais para aprofundar ainda mais seus conhecimentos sobre o plano de parto e garantir uma experiência de parto positiva e respeitosa.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <ResourceCard 
            title="Modelo de Plano de Parto"
            description="Um modelo pronto para usar como base para o seu plano de parto, já estruturado com todas as seções importantes."
            icon={<FileText className="h-6 w-6 text-maternal-600" />}
            isActive={activeResource === 'template'}
            buttonText="Adquirir Modelo"
            buttonIcon={<ShoppingCart className="mr-2 h-4 w-4" />}
            buttonVariant="default"
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
            onClick={() => handleResourceClick('checklist')}
            onButtonClick={(e) => {
              e.stopPropagation();
              handleDownload('Guia de Procedimentos');
              setShowProceduresGuide(true);
            }}
          />
          
          <ResourceCard 
            title="Ebook Gratuito: Seu Plano de Parto"
            description="Um guia completo em formato de ebook para te ajudar a criar seu plano de parto ideal, com dicas e exemplos práticos."
            icon={<BookText className="h-6 w-6 text-maternal-600" />}
            isActive={activeResource === 'ebook'}
            buttonText="Acessar Ebook"
            buttonIcon={<BookOpen className="mr-2 h-4 w-4" />}
            onClick={() => handleResourceClick('ebook')}
            onButtonClick={(e) => {
              e.stopPropagation();
              window.open('https://www.canva.com/design/DAGgZcXb8tk/4aPC17sCJ8iYv7Z0zEfJtw/view?utm_content=DAGgZcXb8tk&utm_campaign=designshare&utm_medium=link2&utm_source=uniquelinks&utlId=h51b40a15c3', '_blank');
              toast({
                title: "Ebook Aberto",
                description: "O ebook gratuito foi aberto em uma nova guia.",
              });
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
          <li>Baixe o modelo e comece a preencher seu plano de parto</li>
          <li>Converse com seu parceiro/acompanhante sobre suas preferências</li>
          <li>Discuta seu plano de parto com seu médico/obstetra na próxima consulta</li>
          <li>Faça ajustes conforme necessário após essa conversa</li>
          <li>Imprima várias cópias e leve para o hospital no dia do parto</li>
        </ol>
      </div>
      
      <div className="mt-8">
        <Button 
          variant="outline" 
          onClick={onPrevious}
          className="flex items-center"
        >
          <ArrowLeft className="mr-2 h-4 w-4" /> Voltar ao Checklist
        </Button>
      </div>
    </div>
  );
}
