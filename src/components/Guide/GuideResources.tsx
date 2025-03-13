
import { Button } from '@/components/ui/button';
import { ArrowLeft, BookOpen, Download, Video, FileText, Link as LinkIcon, MessageCircle } from 'lucide-react';
import { useState } from 'react';
import { toast } from '@/hooks/use-toast';

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
      <h1 className="text-3xl font-bold text-energia-900 mb-6">Recursos Adicionais</h1>
      
      <div className="prose max-w-none">
        <p className="text-lg mb-6">
          Confira estes recursos adicionais para aprofundar ainda mais seus conhecimentos sobre o plano de parto e garantir uma experiência de parto positiva e respeitosa.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div 
            className={`resource-card p-6 rounded-lg border border-energia-200 cursor-pointer transition-all duration-300 ${activeResource === 'template' ? 'bg-energia-50 shadow-md' : 'bg-white hover:shadow-sm'}`}
            onClick={() => handleResourceClick('template')}
          >
            <div className="flex items-center mb-4">
              <div className="bg-energia-100 p-3 rounded-full mr-4">
                <FileText className="h-6 w-6 text-energia-600" />
              </div>
              <h3 className="text-xl font-medium text-energia-800">Modelo de Plano de Parto</h3>
            </div>
            
            <p className="text-energia-700 mb-3">
              Um modelo pronto para usar como base para o seu plano de parto, já estruturado com todas as seções importantes.
            </p>
            
            {activeResource === 'template' && (
              <div className="mt-4 animate-fade-in">
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
            )}
          </div>
          
          <div 
            className={`resource-card p-6 rounded-lg border border-energia-200 cursor-pointer transition-all duration-300 ${activeResource === 'checklist' ? 'bg-energia-50 shadow-md' : 'bg-white hover:shadow-sm'}`}
            onClick={() => handleResourceClick('checklist')}
          >
            <div className="flex items-center mb-4">
              <div className="bg-energia-100 p-3 rounded-full mr-4">
                <BookOpen className="h-6 w-6 text-energia-600" />
              </div>
              <h3 className="text-xl font-medium text-energia-800">Guia de Procedimentos</h3>
            </div>
            
            <p className="text-energia-700 mb-3">
              Glossário com explicações sobre os procedimentos mais comuns do parto, para você entender melhor suas opções.
            </p>
            
            {activeResource === 'checklist' && (
              <div className="mt-4 animate-fade-in">
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
            )}
          </div>
          
          <div 
            className={`resource-card p-6 rounded-lg border border-energia-200 cursor-pointer transition-all duration-300 ${activeResource === 'videos' ? 'bg-energia-50 shadow-md' : 'bg-white hover:shadow-sm'}`}
            onClick={() => handleResourceClick('videos')}
          >
            <div className="flex items-center mb-4">
              <div className="bg-energia-100 p-3 rounded-full mr-4">
                <Video className="h-6 w-6 text-energia-600" />
              </div>
              <h3 className="text-xl font-medium text-energia-800">Videoaulas</h3>
            </div>
            
            <p className="text-energia-700 mb-3">
              Série de videoaulas sobre parto humanizado, plano de parto e seus direitos, com especialistas renomados.
            </p>
            
            {activeResource === 'videos' && (
              <div className="mt-4 animate-fade-in">
                <ul className="space-y-2">
                  <li className="flex items-center justify-between">
                    <span className="text-energia-800">Como conversar com seu médico</span>
                    <Button variant="ghost" size="sm" onClick={(e) => e.stopPropagation()}>
                      <LinkIcon className="h-4 w-4" />
                    </Button>
                  </li>
                  <li className="flex items-center justify-between">
                    <span className="text-energia-800">Posições para o trabalho de parto</span>
                    <Button variant="ghost" size="sm" onClick={(e) => e.stopPropagation()}>
                      <LinkIcon className="h-4 w-4" />
                    </Button>
                  </li>
                  <li className="flex items-center justify-between">
                    <span className="text-energia-800">Técnicas de relaxamento</span>
                    <Button variant="ghost" size="sm" onClick={(e) => e.stopPropagation()}>
                      <LinkIcon className="h-4 w-4" />
                    </Button>
                  </li>
                </ul>
              </div>
            )}
          </div>
          
          <div 
            className={`resource-card p-6 rounded-lg border border-energia-200 cursor-pointer transition-all duration-300 ${activeResource === 'community' ? 'bg-energia-50 shadow-md' : 'bg-white hover:shadow-sm'}`}
            onClick={() => handleResourceClick('community')}
          >
            <div className="flex items-center mb-4">
              <div className="bg-energia-100 p-3 rounded-full mr-4">
                <MessageCircle className="h-6 w-6 text-energia-600" />
              </div>
              <h3 className="text-xl font-medium text-energia-800">Comunidade</h3>
            </div>
            
            <p className="text-energia-700 mb-3">
              Participe da nossa comunidade de gestantes e mães para compartilhar experiências e tirar dúvidas.
            </p>
            
            {activeResource === 'community' && (
              <div className="mt-4 animate-fade-in">
                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={(e) => {
                    e.stopPropagation();
                    // Open community page in a new tab
                    window.open('https://comunidade.energiamaterna.com.br', '_blank');
                  }}
                >
                  Acessar Comunidade
                </Button>
              </div>
            )}
          </div>
        </div>
        
        <div className="bg-energia-100 p-6 rounded-lg border-l-4 border-energia-600 mb-8">
          <h3 className="text-xl font-semibold text-energia-800 mb-3">Modelo Personalizado</h3>
          <p className="text-energia-700 mb-4">
            Quer um plano de parto ainda mais completo e personalizado para suas necessidades específicas?
          </p>
          <p className="text-energia-700 mb-4">
            Acesse nosso serviço de criação de Plano de Parto Personalizado e tenha um documento único feito especialmente para você!
          </p>
          <Button 
            className="bg-energia-600 hover:bg-energia-700"
            onClick={() => window.location.href = '/plano-personalizado'}
          >
            Conhecer o Plano Personalizado
          </Button>
        </div>
        
        <h2 className="text-2xl font-semibold text-energia-800 mt-10 mb-4">Próximos Passos</h2>
        
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
