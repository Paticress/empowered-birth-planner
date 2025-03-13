import { Button } from '@/components/ui/button';
import { ArrowLeft, BookOpen, Download, FileText, ExternalLink, BookHeart, Notebook, Calendar } from 'lucide-react';
import { useState } from 'react';
import { toast } from '@/hooks/use-toast';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

interface GuideResourcesProps {
  onPrevious: () => void;
}

export function GuideResources({ onPrevious }: GuideResourcesProps) {
  const [activeResource, setActiveResource] = useState<string | null>(null);

  const handleResourceClick = (resource: string) => {
    setActiveResource(resource === activeResource ? null : resource);
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
          <div 
            className={`resource-card p-6 rounded-lg border border-maternal-200 cursor-pointer transition-all duration-300 ${activeResource === 'template' ? 'bg-maternal-50 shadow-md' : 'bg-white hover:shadow-sm'}`}
            onClick={() => handleResourceClick('template')}
          >
            <div className="flex items-center mb-4">
              <div className="bg-maternal-100 p-3 rounded-full mr-4">
                <FileText className="h-6 w-6 text-maternal-600" />
              </div>
              <h3 className="text-xl font-medium text-maternal-800">Modelo de Plano de Parto</h3>
            </div>
            
            <p className="text-maternal-700 mb-3">
              Um modelo pronto para usar como base para o seu plano de parto, já estruturado com todas as seções importantes.
            </p>
            
            <div className="mt-4">
              <Button 
                variant="outline" 
                className="w-full"
                onClick={(e) => {
                  e.stopPropagation();
                  handleDownload('Modelo de Plano de Parto');
                }}
              >
                <Download className="mr-2 h-4 w-4" /> Baixar Modelo
              </Button>
            </div>
          </div>
          
          <div 
            className={`resource-card p-6 rounded-lg border border-maternal-200 cursor-pointer transition-all duration-300 ${activeResource === 'checklist' ? 'bg-maternal-50 shadow-md' : 'bg-white hover:shadow-sm'}`}
            onClick={() => handleResourceClick('checklist')}
          >
            <div className="flex items-center mb-4">
              <div className="bg-maternal-100 p-3 rounded-full mr-4">
                <BookOpen className="h-6 w-6 text-maternal-600" />
              </div>
              <h3 className="text-xl font-medium text-maternal-800">Guia de Procedimentos</h3>
            </div>
            
            <p className="text-maternal-700 mb-3">
              Glossário com explicações sobre os procedimentos mais comuns do parto, para você entender melhor suas opções.
            </p>
            
            <div className="mt-4">
              <Button 
                variant="outline" 
                className="w-full"
                onClick={(e) => {
                  e.stopPropagation();
                  handleDownload('Guia de Procedimentos');
                }}
              >
                <Download className="mr-2 h-4 w-4" /> Baixar Guia
              </Button>
            </div>
          </div>
        </div>
        
        {/* Consulta Acolhedora - Adjusted from "Modelo Personalizado" */}
        <div className="bg-maternal-100 p-6 rounded-lg border-l-4 border-maternal-600 mb-8">
          <h3 className="text-xl font-semibold text-maternal-800 mb-3">Consulta Acolhedora</h3>
          <p className="text-maternal-700 mb-4">
            Um espaço acolhedor para tirar suas dúvidas sobre seu plano de parto com a fundadora do Energia Materna, que criou o modelo de plano de parto personalizado.
          </p>
          <p className="text-maternal-700 mb-4">
            Explore alternativas e receba orientação personalizada para ajustar o que for necessário, tornando seu Plano de Parto um documento ideal para a sua jornada.
          </p>
          <Button 
            className="bg-maternal-600 hover:bg-maternal-700"
            onClick={() => window.open('https://www.energiamaterna.com.br/service-page/consulta-acolhedora', '_blank')}
          >
            <Calendar className="mr-2 h-4 w-4" /> Agendar Consulta Acolhedora
          </Button>
        </div>
        
        {/* Updated section for other Energia Materna products */}
        <h2 className="text-2xl font-semibold text-maternal-800 mt-10 mb-6">Produtos para sua Jornada Materna</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <Card className="border-maternal-200 hover:border-maternal-300 transition-all duration-300">
            <CardHeader className="pb-3">
              <CardTitle className="text-maternal-800">Meu Diário da Maternidade</CardTitle>
              <CardDescription>Registre memórias e sentimentos</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-maternal-700 mb-4">
                Este diário foi criado para você registrar suas memórias, sentimentos e aprendizados, criando uma lembrança afetiva desse período tão especial. Escreva, reflita e celebre cada passo do seu caminho.
              </p>
              <Button 
                className="w-full bg-maternal-600 hover:bg-maternal-700"
                onClick={() => window.open('https://www.energiamaterna.com.br/especiais/diario-da-maternidade', '_blank')}
              >
                <BookHeart className="mr-2 h-4 w-4" /> Conhecer Diário
              </Button>
            </CardContent>
          </Card>
          
          <Card className="border-maternal-200 hover:border-maternal-300 transition-all duration-300">
            <CardHeader className="pb-3">
              <CardTitle className="text-maternal-800">Afirmações para um Parto Positivo</CardTitle>
              <CardDescription>64 afirmações poderosas</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-maternal-700 mb-4">
                eBook com 64 afirmações poderosas para nutrir sua confiança ao longo da gestação, trazer leveza ao momento do nascimento e fortalecer sua conexão com seu bebê. Deixe que essas palavras te guiem em cada etapa dessa experiência única.
              </p>
              <Button 
                className="w-full bg-maternal-600 hover:bg-maternal-700"
                onClick={() => window.open('https://www.energiamaterna.com.br/especiais/afirmacoes-para-um-parto-positivo', '_blank')}
              >
                <BookOpen className="mr-2 h-4 w-4" /> Obter eBook
              </Button>
            </CardContent>
          </Card>
          
          <Card className="border-maternal-200 hover:border-maternal-300 transition-all duration-300">
            <CardHeader className="pb-3">
              <CardTitle className="text-maternal-800">Caderno de Bem-Estar</CardTitle>
              <CardDescription>Seu refúgio para autocuidado</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-maternal-700 mb-4">
                Este caderno foi pensado para ser seu refúgio: um espaço para se expressar, aliviar a mente e reencontrar seu equilíbrio. Cuide de você, porque estar bem consigo mesma é vital para cuidar de quem ama.
              </p>
              <Button 
                className="w-full bg-maternal-600 hover:bg-maternal-700"
                onClick={() => window.open('https://www.energiamaterna.com.br/especiais/caderno-de-bem-estar', '_blank')}
              >
                <Notebook className="mr-2 h-4 w-4" /> Adquirir Caderno
              </Button>
            </CardContent>
          </Card>
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
